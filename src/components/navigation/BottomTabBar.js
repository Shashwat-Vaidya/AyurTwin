import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import colors from '../../utils/constants/colors';
import { ROUTES } from '../../navigation/types';

const BottomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  const getIconName = (routeName, isFocused) => {
    const icons = {
      [ROUTES.DASHBOARD_STACK]: isFocused ? 'home' : 'home-outline',
      [ROUTES.METRICS_STACK]: isFocused ? 'stats-chart' : 'stats-chart-outline',
      [ROUTES.ALERTS_STACK]: isFocused ? 'notifications' : 'notifications-outline',
      [ROUTES.LIFESTYLE_STACK]: isFocused ? 'leaf' : 'leaf-outline',
      [ROUTES.MORE_STACK]: isFocused ? 'menu' : 'menu-outline',
    };
    return icons[routeName] || 'help-outline';
  };

  const getLabel = (routeName) => {
    const labels = {
      [ROUTES.DASHBOARD_STACK]: 'Dashboard',
      [ROUTES.METRICS_STACK]: 'Metrics',
      [ROUTES.ALERTS_STACK]: 'Alerts',
      [ROUTES.LIFESTYLE_STACK]: 'Lifestyle',
      [ROUTES.MORE_STACK]: 'More',
    };
    return labels[routeName] || routeName;
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const iconName = getIconName(route.name, isFocused);
        const label = getLabel(route.name);

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <Ionicons
              name={iconName}
              size={24}
              color={isFocused ? colors.primarySaffron : colors.textTertiary}
            />
            <Text
              style={[
                styles.label,
                { color: isFocused ? colors.primarySaffron : colors.textTertiary },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    paddingTop: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  label: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    marginTop: 4,
  },
});

export default BottomTabBar;