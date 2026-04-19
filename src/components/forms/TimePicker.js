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

const TimePicker = ({
  value,
  onChange,
  mode = 'time', // 'time', 'datetime'
  display = 'default', // 'default', 'spinner', 'clock'
  minuteInterval = 1,
  placeholder = 'Select time',
  label,
  error,
  icon,
  format = 'HH:MM A', // 'HH:MM', 'HH:MM A', 'HH:MM:SS'
  disabled = false,
  style,
  labelStyle,
  inputStyle,
  errorStyle,
  is24Hour = false,
}) => {
  
  const [show, setShow] = useState(false);
  const [tempTime, setTempTime] = useState(value || new Date());

  const formatTime = (date) => {
    if (!date) return '';
    
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    if (is24Hour) {
      const hour24 = hours.toString().padStart(2, '0');
      switch(format) {
        case 'HH:MM':
          return `${hour24}:${minutes}`;
        case 'HH:MM:SS':
          return `${hour24}:${minutes}:${seconds}`;
        default:
          return `${hour24}:${minutes}`;
      }
    } else {
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hour12 = (hours % 12 || 12).toString().padStart(2, '0');
      switch(format) {
        case 'HH:MM A':
          return `${hour12}:${minutes} ${ampm}`;
        case 'HH:MM:SS A':
          return `${hour12}:${minutes}:${seconds} ${ampm}`;
        default:
          return `${hour12}:${minutes} ${ampm}`;
      }
    }
  };

  const handleChange = (event, selectedTime) => {
    if (Platform.OS === 'android') {
      setShow(false);
      if (selectedTime) {
        onChange(selectedTime);
      }
    } else {
      if (selectedTime) {
        setTempTime(selectedTime);
      }
    }
  };

  const handleConfirm = () => {
    onChange(tempTime);
    setShow(false);
  };

  const handleCancel = () => {
    setTempTime(value || new Date());
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
            <Text style={styles.modalTitle}>{label || 'Select Time'}</Text>
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <DateTimePicker
            value={tempTime}
            mode="time"
            display="spinner"
            onChange={handleChange}
            minuteInterval={minuteInterval}
            is24Hour={is24Hour}
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
          {value ? formatTime(value) : placeholder}
        </Text>
        <Ionicons name="time" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
      
      {error && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}

      {show && Platform.OS === 'ios' && renderIOSPicker()}
      
      {show && Platform.OS === 'android' && (
        <DateTimePicker
          value={value || new Date()}
          mode="time"
          display={display}
          onChange={handleChange}
          minuteInterval={minuteInterval}
          is24Hour={is24Hour}
        />
      )}
    </View>
  );
};

export const TimeRangePicker = ({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  label,
  ...props
}) => {
  return (
    <View style={styles.rangeContainer}>
      <TimePicker
        label="Start Time"
        value={startTime}
        onChange={onStartTimeChange}
        {...props}
      />
      <TimePicker
        label="End Time"
        value={endTime}
        onChange={onEndTimeChange}
        {...props}
      />
    </View>
  );
};

export const DurationPicker = ({
  value = 0,
  onChange,
  minHours = 0,
  maxHours = 24,
  minMinutes = 0,
  maxMinutes = 59,
  step = 1,
  label,
  ...props
}) => {
  const [hours, setHours] = useState(Math.floor(value / 60));
  const [minutes, setMinutes] = useState(value % 60);

  const handleHoursChange = (h) => {
    const newHours = Math.min(maxHours, Math.max(minHours, h));
    setHours(newHours);
    onChange(newHours * 60 + minutes);
  };

  const handleMinutesChange = (m) => {
    const newMinutes = Math.min(maxMinutes, Math.max(minMinutes, m));
    setMinutes(newMinutes);
    onChange(hours * 60 + newMinutes);
  };

  return (
    <View style={styles.durationContainer}>
      <Text style={styles.durationLabel}>{label}</Text>
      <View style={styles.durationInputs}>
        <View style={styles.durationInput}>
          <Text style={styles.durationNumber}>{hours}</Text>
          <Text style={styles.durationUnit}>hr</Text>
        </View>
        <Text style={styles.durationSeparator}>:</Text>
        <View style={styles.durationInput}>
          <Text style={styles.durationNumber}>{minutes.toString().padStart(2, '0')}</Text>
          <Text style={styles.durationUnit}>min</Text>
        </View>
      </View>
      <View style={styles.durationSteppers}>
        <TouchableOpacity 
          style={styles.durationStepper}
          onPress={() => handleHoursChange(hours + step)}
        >
          <Ionicons name="chevron-up" size={20} color={colors.primarySaffron} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.durationStepper}
          onPress={() => handleMinutesChange(minutes + step)}
        >
          <Ionicons name="chevron-up" size={20} color={colors.primarySaffron} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.durationStepper}
          onPress={() => handleHoursChange(hours - step)}
        >
          <Ionicons name="chevron-down" size={20} color={colors.primarySaffron} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.durationStepper}
          onPress={() => handleMinutesChange(minutes - step)}
        >
          <Ionicons name="chevron-down" size={20} color={colors.primarySaffron} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const BedtimePicker = ({ bedtime, waketime, onBedtimeChange, onWaketimeChange }) => (
  <View style={styles.bedtimeContainer}>
    <TimePicker
      label="Bedtime"
      value={bedtime}
      onChange={onBedtimeChange}
      icon="moon"
      format="HH:MM A"
    />
    <TimePicker
      label="Wake Time"
      value={waketime}
      onChange={onWaketimeChange}
      icon="sunny"
      format="HH:MM A"
    />
  </View>
);

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
  durationContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  durationLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  durationInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  durationInput: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 80,
  },
  durationNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.textPrimary,
  },
  durationUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 4,
  },
  durationSeparator: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.textPrimary,
    marginHorizontal: 8,
  },
  durationSteppers: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  durationStepper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,153,51,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bedtimeContainer: {
    gap: 12,
  },
});

export default TimePicker;