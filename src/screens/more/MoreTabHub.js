import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const { width } = Dimensions.get('window');

const MoreTabHub = () => {
  const navigation = useNavigation();
  const [activeSection, setActiveSection] = useState('quick');

  // Quick navigation shortcuts
  const quickLinks = [
    {
      id: 'help',
      label: 'Help & Support',
      icon: 'help-circle-outline',
      color: '#FF6B6B',
      route: 'HelpScreen',
      description: 'Get answers to FAQs'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings-outline',
      color: '#4ECDC4',
      route: 'SettingsScreen',
      description: 'Manage your preferences'
    },
    {
      id: 'education',
      label: 'Education',
      icon: 'book-outline',
      color: '#95E1D3',
      route: 'EducationScreen',
      description: 'Learn about Ayurveda'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'person-circle-outline',
      color: '#F7DC6F',
      route: 'ProfileScreen',
      description: 'View & edit profile'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'notifications-outline',
      color: '#BB8FCE',
      route: 'NotificationSettings',
      description: 'Alert preferences'
    },
    {
      id: 'privacy',
      label: 'Privacy & Data',
      icon: 'shield-checkmark-outline',
      color: '#85C1E2',
      route: 'PrivacySettings',
      description: 'Your data & security'
    },
  ];

  // Secondary menu items
  const secondaryLinks = [
    {
      id: 'reports',
      label: 'Health Reports',
      icon: 'document-outline',
      route: 'ReportsScreen',
      description: 'View your health reports'
    },
    {
      id: 'faq',
      label: 'FAQ',
      icon: 'chatbubbles-outline',
      route: 'FAQScreen',
      description: 'Frequently asked questions'
    },
    {
      id: 'feedback',
      label: 'Send Feedback',
      icon: 'mail-outline',
      route: 'FeedbackScreen',
      description: 'Help us improve'
    },
    {
      id: 'rate',
      label: 'Rate App',
      icon: 'star-outline',
      route: 'RateAppScreen',
      description: 'Enjoy the app?'
    },
    {
      id: 'subscription',
      label: 'Subscription',
      icon: 'layers-outline',
      route: 'SubscriptionScreen',
      description: 'Premium features'
    },
    {
      id: 'about',
      label: 'About',
      icon: 'information-circle-outline',
      route: 'AboutScreen',
      description: 'About AyurTwin'
    },
  ];

  const handleNavigate = (route) => {
    try {
      navigation.navigate(route);
    } catch (error) {
      console.log('Navigation error:', error);
    }
  };

  const QuickShortcutCard = ({ item }) => (
    <TouchableOpacity
      style={styles.shortcutCard}
      onPress={() => handleNavigate(item.route)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[item.color, `${item.color}CC`]}
        style={styles.shortcutGradient}
      >
        <Ionicons name={item.icon} size={28} color="white" />
        <Text style={styles.shortcutLabel}>{item.label}</Text>
      </LinearGradient>
      <Text style={styles.shortcutDesc}>{item.description}</Text>
    </TouchableOpacity>
  );

  const SecondaryMenuItem = ({ item }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => handleNavigate(item.route)}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons name={item.icon} size={24} color={COLORS.primary} />
        <View style={styles.menuItemText}>
          <Text style={styles.menuItemLabel}>{item.label}</Text>
          <Text style={styles.menuItemDesc}>{item.description}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings & More</Text>
          <Text style={styles.subtitle}>Quick access to all features</Text>
        </View>

        {/* Quick Shortcuts Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Shortcuts</Text>
          <View style={styles.gridContainer}>
            {quickLinks.map((item) => (
              <View key={item.id} style={styles.gridItem}>
                <QuickShortcutCard item={item} />
              </View>
            ))}
          </View>
        </View>

        {/* Secondary Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More Options</Text>
          <Card style={styles.menuCard}>
            {secondaryLinks.map((item, index) => (
              <View key={item.id}>
                <SecondaryMenuItem item={item} />
                {index < secondaryLinks.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </Card>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Card style={styles.accountCard}>
            <TouchableOpacity style={styles.accountAction}>
              <Ionicons name="log-out-outline" size={24} color={colors.alertRed} />
              <Text style={styles.accountActionText}>Logout</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.accountAction}>
              <Ionicons name="trash-outline" size={24} color={colors.warningYellow} />
              <Text style={styles.accountActionText}>Delete Account</Text>
            </TouchableOpacity>
          </Card>
        </View>

        {/* App Info */}
        <View style={styles.appInfoSection}>
          <Text style={styles.appVersion}>AyurTwin v1.0.0</Text>
          <Text style={styles.appSubtext}>© 2025 AyurTwin. All rights reserved.</Text>
          <View style={styles.linkRow}>
            <TouchableOpacity>
              <Text style={styles.linkText}>Terms</Text>
            </TouchableOpacity>
            <Text style={styles.linkSeparator}>•</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Privacy</Text>
            </TouchableOpacity>
            <Text style={styles.linkSeparator}>•</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Contact</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor || '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    backgroundColor: colors.backgroundColor,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textTertiary,
  },
  section: {
    paddingHorizontal: SIZES.padding,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 12,
  },
  shortcutCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  shortcutGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  shortcutLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    marginTop: 8,
    textAlign: 'center',
  },
  shortcutDesc: {
    fontSize: 10,
    color: colors.textTertiary,
    marginTop: 6,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  menuCard: {
    overflow: 'hidden',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    marginLeft: 12,
    flex: 1,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  menuItemDesc: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderColor || '#E0E0E0',
  },
  accountCard: {
    overflow: 'hidden',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  accountAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  accountActionText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    color: colors.textPrimary,
  },
  appInfoSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: SIZES.padding,
  },
  appVersion: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  appSubtext: {
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 12,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  linkSeparator: {
    marginHorizontal: 8,
    color: colors.textTertiary,
  },
});

export default MoreTabHub;
