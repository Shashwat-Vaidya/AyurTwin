import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';
import Button from '../common/Button';

const DatePicker = ({
  value,
  onChange,
  mode = 'date', // 'date', 'time', 'datetime'
  display = 'default', // 'default', 'spinner', 'calendar', 'clock'
  minimumDate,
  maximumDate,
  placeholder = 'Select date',
  label,
  error,
  icon,
  format = 'DD/MM/YYYY',
  disabled = false,
  style,
  labelStyle,
  inputStyle,
  errorStyle,
}) => {
  
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState(value || new Date());

  const formatDate = (date) => {
    if (!date) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    switch(format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'DD MMM YYYY':
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${day} ${months[date.getMonth()]} ${year}`;
      case 'HH:MM':
        return `${hours}:${minutes}`;
      case 'HH:MM A':
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hour12 = hours % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
      case 'DD/MM/YYYY HH:MM':
        return `${day}/${month}/${year} ${hours}:${minutes}`;
      default:
        return `${day}/${month}/${year}`;
    }
  };

  const handleChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShow(false);
      if (selectedDate) {
        onChange(selectedDate);
      }
    } else {
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleConfirm = () => {
    onChange(tempDate);
    setShow(false);
  };

  const handleCancel = () => {
    setTempDate(value || new Date());
    setShow(false);
  };

  const renderIOSPicker = () => (
    <Modal
      visible={show}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{label || 'Select ' + mode}</Text>
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <DateTimePicker
            value={tempDate}
            mode={mode}
            display="spinner"
            onChange={handleChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            textColor={colors.textPrimary}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      
      <TouchableOpacity
        style={[
          styles.input,
          error && styles.inputError,
          disabled && styles.inputDisabled,
          inputStyle,
        ]}
        onPress={() => setShow(true)}
        disabled={disabled}
      >
        {icon && (
          <Ionicons name={icon} size={20} color={colors.textSecondary} style={styles.icon} />
        )}
        <Text style={[
          styles.valueText,
          !value && styles.placeholderText,
        ]}>
          {value ? formatDate(value) : placeholder}
        </Text>
        <Ionicons name="calendar" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
      
      {error && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}

      {show && Platform.OS === 'ios' && renderIOSPicker()}
      
      {show && Platform.OS === 'android' && (
        <DateTimePicker
          value={value || new Date()}
          mode={mode}
          display={display}
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </View>
  );
};

export const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  label,
  ...props
}) => {
  return (
    <View style={styles.rangeContainer}>
      <DatePicker
        label="Start Date"
        value={startDate}
        onChange={onStartDateChange}
        {...props}
      />
      <DatePicker
        label="End Date"
        value={endDate}
        onChange={onEndDateChange}
        minimumDate={startDate}
        {...props}
      />
    </View>
  );
};

export const MonthYearPicker = ({ value, onChange, ...props }) => {
  const formatMonthYear = (date) => {
    if (!date) return '';
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <DatePicker
      mode="date"
      format="MMMM YYYY"
      placeholder="Select month"
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};

export const TimePicker = ({ value, onChange, format = 'HH:MM A', ...props }) => (
  <DatePicker
    mode="time"
    format={format}
    placeholder="Select time"
    value={value}
    onChange={onChange}
    {...props}
  />
);

export const BirthdayPicker = ({ value, onChange, ...props }) => {
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  
  return (
    <DatePicker
      mode="date"
      format="DD MMM YYYY"
      placeholder="Select date of birth"
      value={value}
      onChange={onChange}
      maximumDate={maxDate}
      icon="cake"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 56,
  },
  inputError: {
    borderColor: colors.alertRed,
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
    opacity: 0.6,
  },
  icon: {
    marginRight: 12,
  },
  valueText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textPrimary,
  },
  placeholderText: {
    color: colors.textTertiary,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.alertRed,
    marginTop: 4,
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  cancelText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textSecondary,
  },
  doneText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.primarySaffron,
  },
  rangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default DatePicker;