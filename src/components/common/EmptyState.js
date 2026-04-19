import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';
import Button from './Button';

const EmptyState = ({
  icon,
  image,
  title,
  message,
  buttonText,
  onButtonPress,
  secondaryButtonText,
  onSecondaryButtonPress,
  type = 'info', // 'info', 'warning', 'success', 'error'
  size = 'medium', // 'small', 'medium', 'large'
  style,
}) => {
  
  const getTypeIcon = () => {
    switch(type) {
      case 'warning':
        return 'warning';
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'alert-circle';
      default:
        return icon || 'information-circle';
    }
  };

  const getTypeColor = () => {
    switch(type) {
      case 'warning':
        return colors.warningYellow;
      case 'success':
        return colors.successGreen;
      case 'error':
        return colors.alertRed;
      default:
        return colors.primarySaffron;
    }
  };

  const getSizeStyles = () => {
    switch(size) {
      case 'small':
        return {
          iconSize: 40,
          titleSize: 18,
          messageSize: 14,
          spacing: 12,
        };
      case 'large':
        return {
          iconSize: 80,
          titleSize: 24,
          messageSize: 16,
          spacing: 20,
        };
      default:
        return {
          iconSize: 60,
          titleSize: 20,
          messageSize: 15,
          spacing: 16,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const typeColor = getTypeColor();

  const renderIcon = () => {
    if (image) {
      return <Image source={image} style={[styles.image, { width: sizeStyles.iconSize * 2, height: sizeStyles.iconSize * 2 }]} />;
    }

    if (typeof icon === 'string') {
      return (
        <View style={[styles.iconContainer, { backgroundColor: `${typeColor}20` }]}>
          <Ionicons 
            name={icon || getTypeIcon()} 
            size={sizeStyles.iconSize} 
            color={typeColor} 
          />
        </View>
      );
    }

    return icon || (
      <View style={[styles.iconContainer, { backgroundColor: `${typeColor}20` }]}>
        <Ionicons name={getTypeIcon()} size={sizeStyles.iconSize} color={typeColor} />
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {renderIcon()}

      <Text style={[
        styles.title,
        {
          fontSize: sizeStyles.titleSize,
          marginTop: sizeStyles.spacing,
          marginBottom: sizeStyles.spacing / 2,
        }
      ]}>
        {title || 'Nothing to see here'}
      </Text>

      {message && (
        <Text style={[
          styles.message,
          { fontSize: sizeStyles.messageSize, marginBottom: sizeStyles.spacing }
        ]}>
          {message}
        </Text>
      )}

      {buttonText && onButtonPress && (
        <Button
          title={buttonText}
          onPress={onButtonPress}
          gradient
          style={styles.button}
        />
      )}

      {secondaryButtonText && onSecondaryButtonPress && (
        <TouchableOpacity onPress={onSecondaryButtonPress} style={styles.secondaryButton}>
          <Text style={[styles.secondaryButtonText, { color: typeColor }]}>
            {secondaryButtonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export const NoDataEmptyState = ({ onRefresh, message = 'No data available' }) => (
  <EmptyState
    icon="bar-chart"
    title="No Data"
    message={message}
    buttonText="Refresh"
    onButtonPress={onRefresh}
    type="info"
  />
);

export const NoAlertsEmptyState = () => (
  <EmptyState
    icon="notifications-off"
    title="All Clear!"
    message="You have no alerts at this time. Your health metrics are within normal ranges."
    type="success"
  />
);

export const NoDevicesEmptyState = ({ onConnect }) => (
  <EmptyState
    icon="bluetooth-off"
    title="No Device Connected"
    message="Connect your AyurTwin wristband to start monitoring your health in real-time."
    buttonText="Connect Device"
    onButtonPress={onConnect}
    type="info"
  />
);

export const NoResultsEmptyState = ({ onClear, searchTerm }) => (
  <EmptyState
    icon="search"
    title="No Results Found"
    message={`No results found for "${searchTerm || 'your search'}". Try different keywords.`}
    buttonText="Clear Search"
    onButtonPress={onClear}
    secondaryButtonText="Browse All"
    type="warning"
  />
);

export const ErrorEmptyState = ({ onRetry, message }) => (
  <EmptyState
    icon="alert-circle"
    title="Something Went Wrong"
    message={message || "An error occurred while loading data. Please try again."}
    buttonText="Try Again"
    onButtonPress={onRetry}
    type="error"
  />
);

export const NoInternetEmptyState = ({ onRetry }) => (
  <EmptyState
    icon="cloud-offline"
    title="No Internet Connection"
    message="Please check your internet connection and try again."
    buttonText="Retry"
    onButtonPress={onRetry}
    type="warning"
  />
);

export const NoFavoritesEmptyState = ({ onBrowse }) => (
  <EmptyState
    icon="heart-outline"
    title="No Favorites Yet"
    message="Save your favorite articles, exercises, and recommendations to access them quickly."
    buttonText="Browse Content"
    onButtonPress={onBrowse}
    type="info"
  />
);

export const NoHistoryEmptyState = ({ message = 'No history available' }) => (
  <EmptyState
    icon="time"
    title="No History"
    message={message || "Your history will appear here once you start using the app."}
    size="small"
    type="info"
  />
);

export const ComingSoonEmptyState = ({ feature, onNotify }) => (
  <EmptyState
    icon="construct"
    title="Coming Soon"
    message={`${feature || 'This feature'} is under development and will be available soon.`}
    buttonText="Notify Me"
    onButtonPress={onNotify}
    secondaryButtonText="Back"
    type="info"
  />
);

export const WelcomeEmptyState = ({ onGetStarted }) => (
  <LinearGradient
    colors={[colors.primarySaffron, colors.primaryGreen]}
    style={styles.welcomeContainer}
  >
    <View style={styles.welcomeContent}>
      <View style={styles.welcomeIconContainer}>
        <Ionicons name="leaf" size={60} color="white" />
      </View>
      <Text style={styles.welcomeTitle}>Welcome to AyurTwin!</Text>
      <Text style={styles.welcomeMessage}>
        Your journey to better health starts here. Complete your profile to get personalized insights.
      </Text>
      <Button
        title="Get Started"
        onPress={onGetStarted}
        style={styles.welcomeButton}
        textColor={colors.primarySaffron}
        backgroundColor="white"
      />
    </View>
  </LinearGradient>
);

export const AchievementsEmptyState = () => (
  <EmptyState
    icon="trophy-outline"
    title="No Achievements Yet"
    message="Complete health goals and maintain streaks to earn achievements."
    size="medium"
    type="info"
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 300,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  image: {
    resizeMode: 'contain',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  message: {
    fontFamily: 'Inter-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  button: {
    minWidth: 200,
    marginTop: 8,
  },
  secondaryButton: {
    marginTop: 16,
    padding: 8,
  },
  secondaryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  welcomeContainer: {
    borderRadius: 20,
    margin: 20,
    overflow: 'hidden',
  },
  welcomeContent: {
    padding: 30,
    alignItems: 'center',
  },
  welcomeIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
    marginBottom: 24,
  },
  welcomeButton: {
    minWidth: 200,
  },
});

export default EmptyState;