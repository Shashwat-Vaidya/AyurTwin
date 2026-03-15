import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Share,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSelector, useDispatch } from 'react-redux';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import { logout } from '../../store/slices/authSlice';

const { width, height } = Dimensions.get('window');

const MoreScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { prakriti } = useSelector((state) => state.user);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const [showFloatingMenu, setShowFloatingMenu] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const menuSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          icon: 'person-outline',
          label: 'My Profile',
          route: ROUTES.PROFILE,
          color: colors.primarySaffron,
        },
        {
          id: 'reports',
          icon: 'document-text-outline',
          label: 'Health Reports',
          route: ROUTES.REPORTS,
          color: colors.primaryGreen,
          badge: 'New',
        },
        {
          id: 'device',
          icon: 'hardware-chip-outline',
          label: 'My Device',
          route: ROUTES.DEVICE,
          color: colors.spO2Blue,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'education',
          icon: 'school-outline',
          label: 'Education',
          route: ROUTES.EDUCATION,
          color: colors.stressPurple,
        },
        {
          id: 'about',
          icon: 'information-circle-outline',
          label: 'About',
          route: ROUTES.ABOUT,
          color: colors.warningYellow,
        },
        {
          id: 'settings',
          icon: 'settings-outline',
          label: 'Settings',
          route: ROUTES.SETTINGS,
          color: colors.textSecondary,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          icon: 'help-circle-outline',
          label: 'Help & Support',
          route: ROUTES.HELP,
          color: colors.heartRate,
        },
        {
          id: 'faq',
          icon: 'chatbubble-outline',
          label: 'FAQ',
          route: ROUTES.FAQ,
          color: colors.tempOrange,
        },
        {
          id: 'feedback',
          icon: 'megaphone-outline',
          label: 'Send Feedback',
          route: ROUTES.FEEDBACK,
          color: colors.primaryGreen,
        },
      ],
    },
  ];

  const quickActions = [
    {
      id: 'subscription',
      icon: 'star',
      label: 'Premium',
      route: ROUTES.SUBSCRIPTION,
      color: colors.warningYellow,
      gradient: [colors.warningYellow, colors.tempOrange],
    },
    {
      id: 'share',
      icon: 'share-social',
      label: 'Share App',
      action: 'share',
      color: colors.spO2Blue,
    },
    {
      id: 'rate',
      icon: 'heart',
      label: 'Rate Us',
      route: ROUTES.RATE_APP,
      color: colors.heartRate,
    },
  ];

  const handleMenuItemPress = (item) => {
    if (item.action === 'share') {
      handleShareApp();
    } else if (item.route) {
      navigation.navigate(item.route);
    }
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Check out AyurTwin - Your personal AI-powered Ayurvedic health companion! Download now: https://ayurtwin.com',
        title: 'Share AyurTwin',
      });
    } catch (error) {
      console.error('Error sharing app:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            navigation.reset({
              index: 0,
              routes: [{ name: ROUTES.LANDING }],
            });
          },
        },
      ]
    );
  };

  const getDoshaColor = () => {
    switch(prakriti?.type) {
      case 'vata': return colors.vata;
      case 'pitta': return colors.pitta;
      case 'kapha': return colors.kapha;
      default: return colors.primarySaffron;
    }
  };

  const getDoshaEmoji = () => {
    switch(prakriti?.type) {
      case 'vata': return '🌬️';
      case 'pitta': return '🔥';
      case 'kapha': return '🌊';
      default: return '🌿';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.headerTitle}>More</Text>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setShowFloatingMenu(!showFloatingMenu)}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </Animated.View>

        {/* Profile Card */}
        <Animated.View 
          style={[
            styles.profileCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <LinearGradient
            colors={[colors.primarySaffron, colors.primaryGreen]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileGradient}
          >
            <View style={styles.profileContent}>
              <Avatar
                name={user?.personalInfo?.fullName || 'User'}
                size="large"
                backgroundColor="white"
                textColor={colors.primarySaffron}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {user?.personalInfo?.fullName || 'User Name'}
                </Text>
                <Text style={styles.profileEmail}>
                  {user?.personalInfo?.email || 'user@example.com'}
                </Text>
                {prakriti?.type && (
                  <View style={[styles.doshaBadge, { backgroundColor: getDoshaColor() }]}>
                    <Text style={styles.doshaBadgeText}>
                      {getDoshaEmoji()} {prakriti.type.charAt(0).toUpperCase() + prakriti.type.slice(1)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View 
          style={[
            styles.quickActions,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionItem}
                onPress={() => handleMenuItemPress(action)}
              >
                <LinearGradient
                  colors={action.gradient || [action.color, `${action.color}CC`]}
                  style={styles.quickActionIcon}
                >
                  <Ionicons name={action.icon} size={24} color="white" />
                </LinearGradient>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Menu Sections */}
        {menuSections.map((section, index) => (
          <Animated.View
            key={section.title}
            style={[
              styles.section,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Card style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    itemIndex < section.items.length - 1 && styles.menuItemBorder,
                  ]}
                  onPress={() => handleMenuItemPress(item)}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                      <Ionicons name={item.icon} size={22} color={item.color} />
                    </View>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                  </View>
                  <View style={styles.menuItemRight}>
                    {item.badge && (
                      <Badge
                        label={item.badge}
                        size="small"
                        type="primary"
                        style={styles.menuBadge}
                      />
                    )}
                    <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                  </View>
                </TouchableOpacity>
              ))}
            </Card>
          </Animated.View>
        ))}

        {/* Logout Button */}
        <Animated.View 
          style={[
            styles.logoutSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color={colors.alertRed} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Version Info */}
        <Animated.View 
          style={[
            styles.versionInfo,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.versionText}>AyurTwin v1.0.0</Text>
          <Text style={styles.copyrightText}>© 2024 AyurTwin. All rights reserved.</Text>
        </Animated.View>
      </ScrollView>

      {/* Floating Menu */}
      {showFloatingMenu && (
        <BlurView
          intensity={50}
          tint="light"
          style={styles.floatingMenu}
        >
          <TouchableOpacity 
            style={styles.floatingMenuItem}
            onPress={() => {
              setShowFloatingMenu(false);
              navigation.navigate(ROUTES.SUBSCRIPTION);
            }}
          >
            <Ionicons name="star" size={20} color={colors.warningYellow} />
            <Text style={styles.floatingMenuText}>Upgrade to Premium</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.floatingMenuItem}
            onPress={() => {
              setShowFloatingMenu(false);
              navigation.navigate(ROUTES.SETTINGS);
            }}
          >
            <Ionicons name="settings" size={20} color={colors.textSecondary} />
            <Text style={styles.floatingMenuText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.floatingMenuItem}
            onPress={() => {
              setShowFloatingMenu(false);
              handleShareApp();
            }}
          >
            <Ionicons name="share-social" size={20} color={colors.spO2Blue} />
            <Text style={styles.floatingMenuText}>Share App</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.floatingMenuItem, styles.floatingMenuItemLast]}
            onPress={() => setShowFloatingMenu(false)}
          >
            <Ionicons name="close" size={20} color={colors.alertRed} />
            <Text style={styles.floatingMenuText}>Close</Text>
          </TouchableOpacity>
        </BlurView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: colors.textPrimary,
  },
  menuButton: {
    padding: 8,
  },
  profileCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  profileGradient: {
    padding: 20,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: 'white',
    marginBottom: 2,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: 'white',
    opacity: 0.9,
    marginBottom: 8,
  },
  doshaBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  doshaBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'white',
  },
  quickActions: {
    marginBottom: 20,
  },
  quickActionItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    padding: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuBadge: {
    marginRight: 8,
  },
  logoutSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 90, 95, 0.1)',
    borderRadius: 30,
  },
  logoutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.alertRed,
    marginLeft: 8,
  },
  versionInfo: {
    alignItems: 'center',
  },
  versionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  copyrightText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
  },
  floatingMenu: {
    position: 'absolute',
    top: 80,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    minWidth: 200,
  },
  floatingMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  floatingMenuItemLast: {
    borderBottomWidth: 0,
  },
  floatingMenuText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 12,
  },
});

export default MoreScreen;