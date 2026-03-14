import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';
import { ROUTES } from '../../navigation/types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import DoshaTriangle from '../../components/charts/DoshaTriangle';
import { logout } from '../../store/slices/authSlice';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  // Get user data from Redux
  const { user } = useSelector((state) => state.auth);
  const { personalInfo, lifestyle, prakriti } = useSelector((state) => state.user);

  const handleEditProfile = () => {
    navigation.navigate(ROUTES.EDIT_PROFILE);
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
          onPress: () => dispatch(logout()),
        },
      ],
      { cancelable: true }
    );
  };

  const handleSettings = () => {
    navigation.navigate(ROUTES.SETTINGS);
  };

  // Determine BMI category
  const getBMICategory = (bmi) => {
    if (!bmi) return { label: 'Not calculated', color: colors.textTertiary };
    if (bmi < 18.5) return { label: 'Underweight', color: colors.spO2Blue };
    if (bmi < 25) return { label: 'Normal', color: colors.successGreen };
    if (bmi < 30) return { label: 'Overweight', color: colors.warningYellow };
    return { label: 'Obese', color: colors.alertRed };
  };

  const bmiCategory = getBMICategory(personalInfo?.bmi);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with settings and logout icons */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSettings} style={styles.iconButton}>
          <Ionicons name="settings-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
          <Ionicons name="log-out-outline" size={24} color={colors.alertRed} />
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={[colors.primarySaffron, colors.primaryGreen]}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarText}>
                {personalInfo?.fullName ? personalInfo.fullName.charAt(0).toUpperCase() : 'U'}
              </Text>
            </LinearGradient>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{personalInfo?.fullName || 'User Name'}</Text>
            <Text style={styles.userEmail}>{personalInfo?.email || 'email@example.com'}</Text>
            <Text style={styles.userPhone}>{personalInfo?.phone || '+91 98765 43210'}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Ionicons name="pencil" size={18} color={colors.primarySaffron} />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </Card>

      {/* Prakriti (Dosha) Section */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Your Prakriti</Text>
        <DoshaTriangle
          vata={prakriti?.vata || 33.33}
          pitta={prakriti?.pitta || 33.33}
          kapha={prakriti?.kapha || 33.33}
          size={200}
          showLabels={false}
          showLegend={false}
          animate={false}
        />
        <View style={styles.doshaLabels}>
          <View style={styles.doshaItem}>
            <View style={[styles.doshaDot, { backgroundColor: colors.vata }]} />
            <Text style={styles.doshaText}>Vata: {Math.round(prakriti?.vata || 33)}%</Text>
          </View>
          <View style={styles.doshaItem}>
            <View style={[styles.doshaDot, { backgroundColor: colors.pitta }]} />
            <Text style={styles.doshaText}>Pitta: {Math.round(prakriti?.pitta || 33)}%</Text>
          </View>
          <View style={styles.doshaItem}>
            <View style={[styles.doshaDot, { backgroundColor: colors.kapha }]} />
            <Text style={styles.doshaText}>Kapha: {Math.round(prakriti?.kapha || 33)}%</Text>
          </View>
        </View>
        <View style={styles.dominantContainer}>
          <Text style={styles.dominantLabel}>Dominant: </Text>
          <View style={[styles.dominantBadge, { backgroundColor: `${colors.primaryGreen}20` }]}>
            <Text style={[styles.dominantText, { color: colors.primaryGreen }]}>
              {prakriti?.type || 'Balanced'}
            </Text>
          </View>
        </View>
      </Card>

      {/* Body Metrics */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Body Metrics</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Ionicons name="resize" size={20} color={colors.primarySaffron} />
            <Text style={styles.metricLabel}>Height</Text>
            <Text style={styles.metricValue}>{personalInfo?.height || '--'} cm</Text>
          </View>
          <View style={styles.metricItem}>
            <Ionicons name="barbell" size={20} color={colors.primarySaffron} />
            <Text style={styles.metricLabel}>Weight</Text>
            <Text style={styles.metricValue}>{personalInfo?.weight || '--'} kg</Text>
          </View>
          <View style={styles.metricItem}>
            <Ionicons name="fitness" size={20} color={colors.primarySaffron} />
            <Text style={styles.metricLabel}>BMI</Text>
            <Text style={[styles.metricValue, { color: bmiCategory.color }]}>
              {personalInfo?.bmi || '--'}
            </Text>
            <Text style={[styles.metricSubValue, { color: bmiCategory.color }]}>
              {bmiCategory.label}
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Ionicons name="calendar" size={20} color={colors.primarySaffron} />
            <Text style={styles.metricLabel}>Age</Text>
            <Text style={styles.metricValue}>{personalInfo?.age || '--'} yrs</Text>
          </View>
          <View style={styles.metricItem}>
            <Ionicons name="water" size={20} color={colors.primarySaffron} />
            <Text style={styles.metricLabel}>Blood Group</Text>
            <Text style={styles.metricValue}>{personalInfo?.bloodGroup || '--'}</Text>
          </View>
          <View style={styles.metricItem}>
            <Ionicons name="male-female" size={20} color={colors.primarySaffron} />
            <Text style={styles.metricLabel}>Gender</Text>
            <Text style={styles.metricValue}>{personalInfo?.gender || '--'}</Text>
          </View>
        </View>
      </Card>

      {/* Health Preferences */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Health Preferences</Text>
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Diet Type</Text>
          <Text style={styles.preferenceValue}>{lifestyle?.dietType || 'Not specified'}</Text>
        </View>
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Activity Level</Text>
          <Text style={styles.preferenceValue}>{lifestyle?.physicalActivity || 'Not specified'}</Text>
        </View>
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Smoking</Text>
          <Text style={styles.preferenceValue}>{lifestyle?.smoking ? 'Yes' : 'No'}</Text>
        </View>
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Alcohol</Text>
          <Text style={styles.preferenceValue}>{lifestyle?.alcohol ? 'Yes' : 'No'}</Text>
        </View>
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Water Intake</Text>
          <Text style={styles.preferenceValue}>{lifestyle?.waterIntake || 0} L/day</Text>
        </View>
      </Card>

      {/* Account Actions */}
      <Card style={styles.sectionCard}>
        <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate(ROUTES.REPORTS)}>
          <Ionicons name="document-text" size={22} color={colors.textPrimary} />
          <Text style={styles.actionText}>Health Reports</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate(ROUTES.DEVICE)}>
          <Ionicons name="watch" size={22} color={colors.textPrimary} />
          <Text style={styles.actionText}>Device Settings</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate(ROUTES.HELP)}>
          <Ionicons name="help-circle" size={22} color={colors.textPrimary} />
          <Text style={styles.actionText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </TouchableOpacity>
      </Card>

      {/* Logout button at bottom (redundant but safe) */}
      <Button
        title="Logout"
        onPress={handleLogout}
        style={styles.logoutButton}
        textStyle={styles.logoutButtonText}
        gradient={false}
        backgroundColor={colors.alertRed}
      />

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  profileCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatarGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primarySaffron,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  userPhone: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.primarySaffron,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  editButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.primarySaffron,
    marginLeft: 6,
  },
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  doshaLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    marginBottom: 8,
  },
  doshaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doshaDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  doshaText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textSecondary,
  },
  dominantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  dominantLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  dominantBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  dominantText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    width: '48%',
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  metricLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 4,
  },
  metricValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: 2,
  },
  metricSubValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  preferenceLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  preferenceValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  actionText: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 30,
  },
  logoutButtonText: {
    color: 'white',
  },
  bottomPadding: {
    height: 20,
  },
});

export default ProfileScreen;