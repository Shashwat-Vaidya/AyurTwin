import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';

const { width, height } = Dimensions.get('window');

const Dropdown = ({
  data = [],
  value,
  onSelect,
  placeholder = 'Select an option',
  label,
  error,
  searchable = false,
  searchPlaceholder = 'Search...',
  multiple = false,
  disabled = false,
  required = false,
  icon,
  iconPosition = 'left',
  clearable = false,
  onClear,
  renderItem,
  renderSelectedItem,
  maxHeight = 300,
  minWidth = 200,
  dropdownPosition = 'bottom', // 'bottom', 'top', 'auto'
  animationType = 'fade', // 'fade', 'slide', 'none'
  backgroundColor = 'white',
  textColor = colors.textPrimary,
  placeholderColor = colors.textTertiary,
  borderColor = 'rgba(0,0,0,0.05)',
  activeColor = colors.primarySaffron,
  style,
  dropdownStyle,
  itemStyle,
  selectedItemStyle,
  labelStyle,
  errorStyle,
}) => {
  
  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [dropdownPosition_ , setDropdownPosition_] = useState('bottom');
  const dropdownButton = useRef();
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const [dropdownWidth, setDropdownWidth] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-10)).current;

  const toggleDropdown = () => {
    if (visible) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  const openDropdown = () => {
    measureDropdown();
    setVisible(true);
    
    if (animationType === 'fade') {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else if (animationType === 'slide') {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const closeDropdown = () => {
    if (animationType !== 'none') {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start(() => {
        setVisible(false);
        setSearchText('');
      });
    } else {
      setVisible(false);
      setSearchText('');
    }
  };

  const measureDropdown = () => {
    dropdownButton.current.measure((fx, fy, w, h, px, py) => {
      const screenHeight = height;
      const spaceBelow = screenHeight - py - h;
      const spaceAbove = py;

      if (dropdownPosition === 'auto') {
        setDropdownPosition_(spaceBelow > maxHeight + 20 ? 'bottom' : 'top');
      } else {
        setDropdownPosition_(dropdownPosition);
      }

      setDropdownTop(py + (dropdownPosition_ === 'bottom' ? h : 0));
      setDropdownLeft(px);
      setDropdownWidth(w);
    });
  };

  const handleSelect = (item) => {
    if (multiple) {
      const newValue = value?.includes(item.value)
        ? value.filter(v => v !== item.value)
        : [...(value || []), item.value];
      onSelect(newValue);
    } else {
      onSelect(item.value);
      closeDropdown();
    }
  };

  const handleClear = () => {
    if (multiple) {
      onSelect([]);
    } else {
      onSelect(null);
    }
    if (onClear) onClear();
  };

  const getSelectedLabel = () => {
    if (!value) return placeholder;
    
    if (multiple) {
      if (value.length === 0) return placeholder;
      const selectedItems = data.filter(item => value.includes(item.value));
      if (renderSelectedItem) {
        return renderSelectedItem(selectedItems);
      }
      return selectedItems.map(item => item.label).join(', ');
    } else {
      const selectedItem = data.find(item => item.value === value);
      return selectedItem ? selectedItem.label : placeholder;
    }
  };

  const filteredData = searchable
    ? data.filter(item => 
        item.label.toLowerCase().includes(searchText.toLowerCase())
      )
    : data;

  const renderDefaultItem = ({ item }) => {
    const isSelected = multiple
      ? value?.includes(item.value)
      : value === item.value;

    return (
      <TouchableOpacity
        style={[
          styles.item,
          isSelected && [styles.selectedItem, { backgroundColor: `${activeColor}10` }],
          itemStyle,
          isSelected && selectedItemStyle,
        ]}
        onPress={() => handleSelect(item)}
      >
        {item.icon && (
          <Ionicons
            name={item.icon}
            size={18}
            color={isSelected ? activeColor : colors.textSecondary}
            style={styles.itemIcon}
          />
        )}
        <Text style={[
          styles.itemText,
          { color: isSelected ? activeColor : textColor },
        ]}>
          {item.label}
        </Text>
        {isSelected && (
          <Ionicons
            name="checkmark"
            size={18}
            color={activeColor}
            style={styles.checkIcon}
          />
        )}
      </TouchableOpacity>
    );
  };

  const getTransformStyle = () => {
    switch(animationType) {
      case 'slide':
        return {
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
        };
      case 'fade':
        return {
          opacity: fadeAnim,
        };
      default:
        return {};
    }
  };

  const dropdownStyles = [
    styles.dropdown,
    {
      top: dropdownPosition_ === 'bottom' ? dropdownTop : dropdownTop - maxHeight,
      left: dropdownLeft,
      width: Math.max(dropdownWidth, minWidth),
      maxHeight,
      backgroundColor,
      borderColor,
    },
    dropdownStyle,
    getTransformStyle(),
  ];

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        ref={dropdownButton}
        style={[
          styles.button,
          { borderColor, backgroundColor },
          error && styles.buttonError,
          disabled && styles.buttonDisabled,
        ]}
        onPress={toggleDropdown}
        disabled={disabled}
      >
        <View style={styles.buttonContent}>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={20} color={colors.textSecondary} style={styles.buttonIcon} />
          )}
          
          <Text
            style={[
              styles.buttonText,
              { color: value ? textColor : placeholderColor },
            ]}
            numberOfLines={1}
          >
            {getSelectedLabel()}
          </Text>
          
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={20} color={colors.textSecondary} style={styles.buttonIcon} />
          )}
        </View>

        <View style={styles.buttonActions}>
          {clearable && value && (multiple ? value.length > 0 : true) && (
            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
              <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
          <Ionicons
            name={visible ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.textSecondary}
          />
        </View>
      </TouchableOpacity>

      {error && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}

      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={closeDropdown}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeDropdown}
        >
          <Animated.View style={dropdownStyles}>
            {searchable && (
              <View style={[styles.searchContainer, { borderColor }]}>
                <Ionicons name="search" size={18} color={colors.textTertiary} />
                <TextInput
                  style={styles.searchInput}
                  placeholder={searchPlaceholder}
                  placeholderTextColor={colors.textTertiary}
                  value={searchText}
                  onChangeText={setSearchText}
                  autoCapitalize="none"
                />
                {searchText.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchText('')}>
                    <Ionicons name="close-circle" size={16} color={colors.textTertiary} />
                  </TouchableOpacity>
                )}
              </View>
            )}

            <FlatList
              data={filteredData}
              renderItem={renderItem || renderDefaultItem}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No options found</Text>
                </View>
              }
            />
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export const SearchableDropdown = (props) => (
  <Dropdown searchable {...props} />
);

export const MultiSelectDropdown = (props) => (
  <Dropdown multiple {...props} />
);

export const CountryCodeDropdown = ({ value, onSelect, ...props }) => {
  const countryCodes = [
    { value: '+1', label: '🇺🇸 +1 (USA)' },
    { value: '+44', label: '🇬🇧 +44 (UK)' },
    { value: '+91', label: '🇮🇳 +91 (India)' },
    { value: '+61', label: '🇦🇺 +61 (Australia)' },
    { value: '+81', label: '🇯🇵 +81 (Japan)' },
    { value: '+86', label: '🇨🇳 +86 (China)' },
    { value: '+49', label: '🇩🇪 +49 (Germany)' },
    { value: '+33', label: '🇫🇷 +33 (France)' },
    { value: '+39', label: '🇮🇹 +39 (Italy)' },
    { value: '+34', label: '🇪🇸 +34 (Spain)' },
  ];

  return (
    <Dropdown
      data={countryCodes}
      value={value}
      onSelect={onSelect}
      placeholder="Select country code"
      minWidth={150}
      {...props}
    />
  );
};

export const BloodGroupDropdown = ({ value, onSelect, ...props }) => {
  const bloodGroups = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
  ];

  return (
    <Dropdown
      data={bloodGroups}
      value={value}
      onSelect={onSelect}
      placeholder="Select blood group"
      {...props}
    />
  );
};

export const GenderDropdown = ({ value, onSelect, ...props }) => {
  const genders = [
    { value: 'male', label: 'Male', icon: 'male' },
    { value: 'female', label: 'Female', icon: 'female' },
    { value: 'other', label: 'Other', icon: 'people' },
  ];

  return (
    <Dropdown
      data={genders}
      value={value}
      onSelect={onSelect}
      placeholder="Select gender"
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
  required: {
    color: colors.alertRed,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 56,
  },
  buttonError: {
    borderColor: colors.alertRed,
  },
  buttonDisabled: {
    opacity: 0.5,
    backgroundColor: '#F5F5F5',
  },
  buttonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  buttonActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    marginRight: 8,
    padding: 2,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.alertRed,
    marginTop: 4,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 8,
    paddingVertical: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectedItem: {
    backgroundColor: 'rgba(255,153,51,0.1)',
  },
  itemIcon: {
    marginRight: 12,
  },
  itemText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
  },
  checkIcon: {
    marginLeft: 8,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textTertiary,
  },
});

export default Dropdown;