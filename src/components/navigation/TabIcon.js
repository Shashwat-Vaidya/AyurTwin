import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';

const TabIcon = ({
  name,
  focused,
  color,
  size = 24,
  label,
  showLabel = true,
  badge,
  badgeColor = colors.alertRed,
  iconFamily = 'Ionicons',
  animated = true,
  gradient = false,
  gradientColors = [colors.primarySaffron, colors.primaryGreen],
  style,
}) => {
  
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  const translateYValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (focused && animated) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1.1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(translateYValue, {
          toValue: -4,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(translateYValue, {
          toValue: 0,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused]);

  const renderIcon = () => {
    const iconName = focused ? name : `${name}-outline`;
    
    if (gradient && focused) {
      return (
        <View style={[styles.gradientContainer, { width: size * 1.5, height: size * 1.5 }]}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradient, { borderRadius: (size * 1.5) / 2 }]}
          />
          <Ionicons name={iconName} size={size} color="white" style={styles.gradientIcon} />
        </View>
      );
    }

    return (
      <Ionicons 
        name={iconName} 
        size={size} 
        color={focused ? color : colors.textTertiary} 
      />
    );
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [
            { scale: scaleValue },
            { translateY: translateYValue },
          ],
        },
        style,
      ]}
    >
      <View style={styles.iconContainer}>
        {renderIcon()}
        {badge ? (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>
              {badge > 99 ? '99+' : badge}
            </Text>
          </View>
        ) : null}
      </View>
      {showLabel && label && (
        <Text 
          style={[
            styles.label,
            { color: focused ? color : colors.textTertiary },
          ]}
        >
          {label}
        </Text>
      )}
    </Animated.View>
  );
};

export const HomeTabIcon = (props) => (
  <TabIcon name="home" label="Home" {...props} />
);

export const DashboardTabIcon = (props) => (
  <TabIcon name="speedometer" label="Dashboard" {...props} />
);

export const MetricsTabIcon = (props) => (
  <TabIcon name="stats-chart" label="Metrics" {...props} />
);

export const AlertsTabIcon = (props) => (
  <TabIcon name="notifications" label="Alerts" {...props} />
);

export const LifestyleTabIcon = (props) => (
  <TabIcon name="leaf" label="Lifestyle" {...props} />
);

export const ProfileTabIcon = (props) => (
  <TabIcon name="person" label="Profile" {...props} />
);

export const SettingsTabIcon = (props) => (
  <TabIcon name="settings" label="Settings" {...props} />
);

export const MoreTabIcon = (props) => (
  <TabIcon name="menu" label="More" {...props} />
);

export const ChatTabIcon = (props) => (
  <TabIcon name="chatbubble" label="Chat" {...props} />
);

export const ReportsTabIcon = (props) => (
  <TabIcon name="document-text" label="Reports" {...props} />
);

export const DeviceTabIcon = (props) => (
  <TabIcon name="hardware-chip" label="Device" {...props} />
);

export const EducationTabIcon = (props) => (
  <TabIcon name="school" label="Learn" {...props} />
);

export const GradientTabIcon = (props) => (
  <TabIcon gradient {...props} />
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 9,
    color: 'white',
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    marginTop: 2,
  },
  gradientContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradientIcon: {
    zIndex: 1,
  },
});

export default TabIcon;