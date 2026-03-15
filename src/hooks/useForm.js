import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';

export const useForm = (initialValues = {}, validationSchema = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Validate on values change
  useEffect(() => {
    if (validationSchema) {
      validateForm();
    }
  }, [values]);

  // Handle input change
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  // Handle blur
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    if (validationSchema) {
      validateField(name);
    }
  }, [values]);

  // Validate single field
  const validateField = useCallback((name) => {
    if (!validationSchema) return true;

    try {
      const fieldSchema = validationSchema.shape?.[name];
      if (fieldSchema) {
        fieldSchema.parse(values[name]);
        setErrors(prev => ({ ...prev, [name]: '' }));
        return true;
      }
      return true;
    } catch (error) {
      if (error.errors) {
        setErrors(prev => ({ ...prev, [name]: error.errors[0] }));
      }
      return false;
    }
  }, [values, validationSchema]);

  // Validate entire form
  const validateForm = useCallback(() => {
    if (!validationSchema) {
      setIsValid(true);
      return true;
    }

    try {
      validationSchema.parse(values);
      setErrors({});
      setIsValid(true);
      return true;
    } catch (error) {
      if (error.errors) {
        const newErrors = {};
        error.errors.forEach(err => {
          const path = err.path[0];
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      setIsValid(false);
      return false;
    }
  }, [values, validationSchema]);

  // Handle submit
  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(values).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate form
    const isValidForm = validateForm();

    if (isValidForm) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
        Alert.alert('Error', error.message || 'Form submission failed');
      }
    } else {
      // Show first error
      const firstError = Object.values(errors)[0];
      if (firstError) {
        Alert.alert('Validation Error', firstError);
      }
    }

    setIsSubmitting(false);
  }, [values, errors, validateForm]);

  // Reset form
  const resetForm = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Set field value
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  // Set multiple fields
  const setMultipleFields = useCallback((fields) => {
    setValues(prev => ({ ...prev, ...fields }));
  }, []);

  // Get field props
  const getFieldProps = useCallback((name) => ({
    value: values[name] || '',
    onChangeText: (text) => handleChange(name, text),
    onBlur: () => handleBlur(name),
    error: touched[name] ? errors[name] : '',
  }), [values, touched, errors, handleChange, handleBlur]);

  // Check if field has error
  const hasError = useCallback((name) => {
    return touched[name] && !!errors[name];
  }, [touched, errors]);

  // Get error for field
  const getError = useCallback((name) => {
    return touched[name] ? errors[name] : '';
  }, [touched, errors]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setMultipleFields,
    getFieldProps,
    hasError,
    getError,
  };
};

export default useForm;