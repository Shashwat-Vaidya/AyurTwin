import React, { createContext, useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import colors from '../../utils/constants/colors';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const FormContext = createContext({});

export const useFormContext = () => useContext(FormContext);

const FormWrapper = ({
  children,
  onSubmit,
  schema,
  defaultValues = {},
  mode = 'onChange',
  reValidateMode = 'onChange',
  shouldFocusError = true,
  submitButtonText = 'Submit',
  submitButtonProps = {},
  cancelButtonText,
  onCancel,
  loading = false,
  error = null,
  showSubmitButton = true,
  submitButtonPosition = 'bottom', // 'bottom', 'sticky'
  formStyle,
  contentContainerStyle,
  buttonContainerStyle,
  enableKeyboardAvoiding = true,
  keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0,
  scrollEnabled = true,
  showHeader = false,
  headerTitle,
  headerSubtitle,
  headerComponent,
  footerComponent,
  validateOnSubmit = true,
  resetAfterSubmit = false,
  ...props
}) => {
  
  const methods = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
    mode,
    reValidateMode,
    shouldFocusError,
  });

  const { handleSubmit, formState: { errors, isDirty, isValid, isSubmitting } } = methods;

  const [formError, setFormError] = useState(null);

  const onSubmitHandler = async (data) => {
    try {
      setFormError(null);
      await onSubmit(data);
      if (resetAfterSubmit) {
        methods.reset();
      }
    } catch (err) {
      setFormError(err.message || 'An error occurred while submitting the form');
    }
  };

  const onErrorHandler = (errors) => {
    console.log('Form validation errors:', errors);
  };

  const isSubmitDisabled = validateOnSubmit 
    ? !isValid || !isDirty || loading || isSubmitting
    : loading || isSubmitting;

  const renderHeader = () => {
    if (headerComponent) return headerComponent;
    if (!showHeader) return null;

    return (
      <View style={styles.header}>
        {headerTitle && <Text style={styles.headerTitle}>{headerTitle}</Text>}
        {headerSubtitle && <Text style={styles.headerSubtitle}>{headerSubtitle}</Text>}
      </View>
    );
  };

  const renderSubmitButton = () => {
    if (!showSubmitButton) return null;

    return (
      <View style={[
        styles.buttonContainer,
        submitButtonPosition === 'sticky' && styles.stickyButton,
        buttonContainerStyle,
      ]}>
        {cancelButtonText && onCancel && (
          <Button
            title={cancelButtonText}
            onPress={onCancel}
            style={styles.cancelButton}
            outline
            disabled={loading}
          />
        )}
        <Button
          title={submitButtonText}
          onPress={handleSubmit(onSubmitHandler, onErrorHandler)}
          loading={loading || isSubmitting}
          disabled={isSubmitDisabled}
          gradient
          style={[
            styles.submitButton,
            cancelButtonText && styles.submitButtonWithCancel,
          ]}
          {...submitButtonProps}
        />
      </View>
    );
  };

  const FormContent = () => (
    <FormProvider {...methods}>
      <FormContext.Provider value={{ methods, errors, loading }}>
        <View style={[styles.form, formStyle]}>
          {renderHeader()}

          {error && (
            <ErrorMessage
              message={error}
              type="error"
              style={styles.errorMessage}
            />
          )}

          {formError && (
            <ErrorMessage
              message={formError}
              type="error"
              onDismiss={() => setFormError(null)}
              style={styles.errorMessage}
            />
          )}

          <View style={[styles.content, contentContainerStyle]}>
            {children}
          </View>

          {footerComponent}

          {submitButtonPosition === 'bottom' && renderSubmitButton()}
        </View>
      </FormContext.Provider>
    </FormProvider>
  );

  if (!enableKeyboardAvoiding) {
    return scrollEnabled ? (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FormContent />
      </ScrollView>
    ) : (
      <FormContent />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {scrollEnabled ? (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <FormContent />
          </ScrollView>
        ) : (
          <View style={styles.container}>
            <FormContent />
          </View>
        )}
      </TouchableWithoutFeedback>

      {submitButtonPosition === 'sticky' && renderSubmitButton()}
    </KeyboardAvoidingView>
  );
};

export const MultiStepForm = ({
  steps = [],
  currentStep = 0,
  onStepChange,
  onSubmit,
  schema,
  defaultValues = {},
  ...props
}) => {
  const [stepData, setStepData] = useState(defaultValues);

  const handleNext = async (data) => {
    const updatedData = { ...stepData, ...data };
    setStepData(updatedData);

    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1);
    } else {
      await onSubmit(updatedData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <View style={styles.multiStepContainer}>
      <View style={styles.stepIndicator}>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepWrapper}>
            <View style={[
              styles.stepDot,
              index <= currentStep && styles.stepDotActive,
              index < currentStep && styles.stepDotCompleted,
            ]}>
              {index < currentStep ? (
                <Ionicons name="checkmark" size={12} color="white" />
              ) : (
                <Text style={styles.stepNumber}>{index + 1}</Text>
              )}
            </View>
            {index < steps.length - 1 && (
              <View style={[
                styles.stepLine,
                index < currentStep && styles.stepLineActive,
              ]} />
            )}
          </View>
        ))}
      </View>

      <FormWrapper
        onSubmit={handleNext}
        schema={steps[currentStep].schema || schema}
        defaultValues={stepData}
        submitButtonText={currentStep === steps.length - 1 ? 'Submit' : 'Next'}
        cancelButtonText={currentStep > 0 ? 'Back' : undefined}
        onCancel={handleBack}
        {...props}
      >
        <CurrentStepComponent />
      </FormWrapper>
    </View>
  );
};

export const FormSection = ({ title, children, style }) => (
  <View style={[styles.section, style]}>
    {title && <Text style={styles.sectionTitle}>{title}</Text>}
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

export const FormRow = ({ children, style }) => (
  <View style={[styles.row, style]}>{children}</View>
);

export const FormField = ({ label, required, error, children, style }) => (
  <View style={[styles.field, style]}>
    {label && (
      <Text style={styles.fieldLabel}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
    )}
    {children}
    {error && <Text style={styles.fieldError}>{error}</Text>}
  </View>
);

export const FormDivider = ({ text, style }) => (
  <View style={[styles.divider, style]}>
    <View style={styles.dividerLine} />
    {text && <Text style={styles.dividerText}>{text}</Text>}
    <View style={styles.dividerLine} />
  </View>
);

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  form: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.backgroundWhite,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  errorMessage: {
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stickyButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButton: {
    flex: 1,
  },
  submitButtonWithCancel: {
    flex: 1,
    marginLeft: 8,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  multiStepContainer: {
    flex: 1,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  stepWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotActive: {
    backgroundColor: colors.primarySaffron,
  },
  stepDotCompleted: {
    backgroundColor: colors.successGreen,
  },
  stepNumber: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textSecondary,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: colors.successGreen,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  sectionContent: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  field: {
    flex: 1,
    marginBottom: 16,
  },
  fieldLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  required: {
    color: colors.alertRed,
  },
  fieldError: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.alertRed,
    marginTop: 4,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  dividerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginHorizontal: 16,
  },
});

export default FormWrapper;