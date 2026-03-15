import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import colors from '../../utils/constants/colors';

const Header = ({
  title,
  subtitle,
  leftIcon,
  onLeftPress,
  rightIcon,
  onRightPress,
  rightIcon2,
  onRightPress2,
  showBack = false,
  onBackPress,
  gradient = false,
  gradientColors = [colors.primarySaffron, colors.primaryGreen],
  transparent = false,
  elevated = true,
  titleAlign = 'center', // 'left', 'center'
  titleSize = 'large', // 'small', 'medium', 'large'
  showStatusBar = true,
  statusBarStyle = 'dark-content',
  backgroundColor,
  style,
  titleStyle,
  children,
}) => {
  
  const insets = useSafeAreaInsets();

  const getTitleSize = () => {
    switch(titleSize) {
      case 'small':
        return 16;
      case 'medium':
        return 18;
      case 'large':
        return 20;
      default:
        return 20;
    }
  };

  const renderLeft = () => {
    if (showBack) {
      return (
        <TouchableOpacity onPress={onBackPress} style={styles.leftButton}>
          <Ionicons name="arrow-back" size={24} color={getIconColor()} />
        </TouchableOpacity>
      );
    }

    if (leftIcon) {
      return (
        <TouchableOpacity onPress={onLeftPress} style={styles.leftButton}>
          <Ionicons name={leftIcon} size={24} color={getIconColor()} />
        </TouchableOpacity>
      );
    }

    return <View style={styles.placeholder} />;
  };

  const renderRight = () => {
    if (rightIcon2) {
      return (
        <View style={styles.rightContainer}>
          <TouchableOpacity onPress={onRightPress} style={styles.rightButton}>
            <Ionicons name={rightIcon} size={24} color={getIconColor()} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onRightPress2} style={styles.rightButton}>
            <Ionicons name={rightIcon2} size={24} color={getIconColor()} />
          </TouchableOpacity>
        </View>
      );
    }

    if (rightIcon) {
      return (
        <TouchableOpacity onPress={onRightPress} style={styles.rightButton}>
          <Ionicons name={rightIcon} size={24} color={getIconColor()} />
        </TouchableOpacity>
      );
    }

    return <View style={styles.placeholder} />;
  };

  const getBackgroundColor = () => {
    if (gradient) return 'transparent';
    if (transparent) return 'transparent';
    return backgroundColor || colors.backgroundWhite;
  };

  const getIconColor = () => {
    if (gradient) return 'white';
    if (transparent) return colors.textPrimary;
    return colors.textPrimary;
  };

  const getTitleColor = () => {
    if (gradient) return 'white';
    if (transparent) return colors.textPrimary;
    return colors.textPrimary;
  };

  const headerStyles = [
    styles.container,
    {
      paddingTop: insets.top + (Platform.OS === 'ios' ? 0 : StatusBar.currentHeight || 0),
      backgroundColor: getBackgroundColor(),
    },
    elevated && styles.elevated,
    style,
  ];

  const contentStyles = [
    styles.content,
    titleAlign === 'left' && styles.contentLeft,
  ];

  const HeaderContent = () => (
    <>
      {renderLeft()}
      
      <View style={[styles.titleContainer, titleAlign === 'left' && styles.titleContainerLeft]}>
        {title && (
          <Text 
            style={[
              styles.title,
              { 
                fontSize: getTitleSize(),
                color: getTitleColor(),
                textAlign: titleAlign,
              },
              titleStyle,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
        {subtitle && (
          <Text 
            style={[
              styles.subtitle,
              { color: getTitleColor() },
            ]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
        {children}
      </View>

      {renderRight()}
    </>
  );

  if (gradient) {
    return (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={headerStyles}
      >
        {showStatusBar && (
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        )}
        <HeaderContent />
      </LinearGradient>
    );
  }

  return (
    <View style={headerStyles}>
      {showStatusBar && (
        <StatusBar barStyle={statusBarStyle} backgroundColor="transparent" translucent />
      )}
      <HeaderContent />
    </View>
  );
};

export const DashboardHeader = ({
  greeting,
  userName,
  dosha,
  doshaColor,
  onProfilePress,
  onNotificationPress,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.dashboardHeader, { paddingTop: insets.top + 10 }]}>
      <View style={styles.dashboardTop}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>{greeting},</Text>
          <Text style={styles.userNameText}>{userName}</Text>
        </View>
        <View style={styles.dashboardActions}>
          {dosha && (
            <View style={[styles.doshaBadge, { backgroundColor: doshaColor || colors.primarySaffron }]}>
              <Text style={styles.doshaText}>{dosha}</Text>
            </View>
          )}
          <TouchableOpacity onPress={onNotificationPress} style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onProfilePress} style={styles.profileButton}>
            <Ionicons name="person-circle" size={32} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export const ModalHeader = ({
  title,
  onClose,
  showClose = true,
  rightText,
  onRightPress,
}) => (
  <View style={styles.modalHeader}>
    <View style={styles.modalLeft}>
      {showClose && (
        <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      )}
    </View>
    <Text style={styles.modalTitle}>{title}</Text>
    <View style={styles.modalRight}>
      {rightText && (
        <TouchableOpacity onPress={onRightPress}>
          <Text style={styles.modalRightText}>{rightText}</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

export const SectionHeader = ({ title, actionText, onAction, style }) => (
  <View style={[styles.sectionHeader, style]}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {actionText && onAction && (
      <TouchableOpacity onPress={onAction}>
        <Text style={styles.sectionAction}>{actionText}</Text>
      </TouchableOpacity>
    )}
  </View>
);

export const SearchHeader = ({
  value,
  onChangeText,
  onSubmit,
  onBack,
  placeholder = 'Search...',
}) => (
  <View style={styles.searchHeader}>
    <TouchableOpacity onPress={onBack} style={styles.searchBackButton}>
      <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
    </TouchableOpacity>
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color={colors.textTertiary} style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        autoFocus
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
  },
  contentLeft: {
    justifyContent: 'flex-start',
  },
  leftButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainerLeft: {
    alignItems: 'flex-start',
    marginLeft: 8,
  },
  title: {
    fontFamily: 'Inter-Bold',
    includeFontPadding: false,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  },
  dashboardHeader: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: colors.backgroundWhite,
  },
  dashboardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  userNameText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.textPrimary,
  },
  dashboardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doshaBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    marginRight: 8,
  },
  doshaText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'white',
  },
  notificationButton: {
    padding: 8,
  },
  profileButton: {
    padding: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    backgroundColor: 'white',
  },
  modalLeft: {
    width: 40,
  },
  modalRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.textPrimary,
  },
  modalRightText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.primarySaffron,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  sectionAction: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primarySaffron,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  searchBackButton: {
    padding: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 10,
  },
});

export default Header;