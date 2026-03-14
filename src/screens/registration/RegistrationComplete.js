import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Button from '../../components/common/Button';

const { width, height } = Dimensions.get('window');

const RegistrationComplete = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { prakriti } = useSelector((state) => state.user);

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;
  
  // For confetti effect
  const confetti1 = useRef(new Animated.Value(0)).current;
  const confetti2 = useRef(new Animated.Value(0)).current;
  const confetti3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Sequence of animations
    Animated.sequence([
      // Scale up checkmark
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      
      // Confetti explosions
      Animated.parallel([
        Animated.timing(confetti1, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(confetti2, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(confetti3, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
      
      // Fade in and slide up content
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
      ]),
    ]).start();
  };

  const getDoshaColor = () => {
    switch(prakriti?.type) {
      case 'vata': return '#7B6E8F';
      case 'pitta': return '#FF6B6B';
      case 'kapha': return '#6BA6A6';
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

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getDoshaAdvice = () => {
    switch(prakriti?.type) {
      case 'vata':
        return 'Focus on warm, grounding foods and regular routines.';
      case 'pitta':
        return 'Stay cool, avoid skipping meals, and moderate exercise.';
      case 'kapha':
        return 'Stay active, eat light, and seek variety in your day.';
      default:
        return 'We\'ll help you maintain your unique balance.';
    }
  };

  const handleGoToDashboard = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: ROUTES.MAIN_TABS }],
    });
  };

  const handleCompleteProfile = () => {
    navigation.navigate(ROUTES.PROFILE);
  };

  // Confetti animation interpolations
  const getConfetti1Transform = () => ({
    transform: [
      { translateX: confetti1.interpolate({ inputRange: [0, 1], outputRange: [0, -50] }) },
      { translateY: confetti1.interpolate({ inputRange: [0, 1], outputRange: [0, -100] }) },
      { rotate: confetti1.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] }) },
    ],
    opacity: confetti1.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1, 0] }),
  });

  const getConfetti2Transform = () => ({
    transform: [
      { translateX: confetti2.interpolate({ inputRange: [0, 1], outputRange: [0, 50] }) },
      { translateY: confetti2.interpolate({ inputRange: [0, 1], outputRange: [0, -120] }) },
      { rotate: confetti2.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-30deg'] }) },
    ],
    opacity: confetti2.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1, 0] }),
  });

  const getConfetti3Transform = () => ({
    transform: [
      { translateX: confetti3.interpolate({ inputRange: [0, 1], outputRange: [0, 80] }) },
      { translateY: confetti3.interpolate({ inputRange: [0, 1], outputRange: [0, -150] }) },
      { rotate: confetti3.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '60deg'] }) },
    ],
    opacity: confetti3.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1, 0] }),
  });

  return (
    <View style={styles.container}>
      {/* Confetti Background */}
      <View style={styles.confettiContainer}>
        <Animated.View style={[styles.confetti, styles.confetti1, getConfetti1Transform()]} />
        <Animated.View style={[styles.confetti, styles.confetti2, getConfetti2Transform()]} />
        <Animated.View style={[styles.confetti, styles.confetti3, getConfetti3Transform()]} />
        <Animated.View style={[styles.confetti, styles.confetti4, getConfetti1Transform()]} />
        <Animated.View style={[styles.confetti, styles.confetti5, getConfetti2Transform()]} />
        <Animated.View style={[styles.confetti, styles.confetti6, getConfetti3Transform()]} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Checkmark */}
        <Animated.View style={[styles.checkmarkContainer, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.checkmarkCircle}>
            <Ionicons name="checkmark" size={60} color="white" />
          </View>
        </Animated.View>

        {/* Welcome Message */}
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.welcomeText}>{getWelcomeMessage()},</Text>
          <Text style={styles.nameText}>{user?.personalInfo?.fullName?.split(' ')[0]}!</Text>
          
          <View style={styles.successBadge}>
            <Ionicons name="leaf" size={20} color={colors.primaryGreen} />
            <Text style={styles.successBadgeText}>Registration Complete</Text>
          </View>

          {/* Prakriti Card */}
          <View style={[styles.prakritiCard, { borderColor: getDoshaColor() }]}>
            <View style={styles.prakritiHeader}>
              <Text style={styles.prakritiTitle}>Your Prakriti</Text>
              <View style={[styles.prakritiBadge, { backgroundColor: getDoshaColor() }]}>
                <Text style={styles.prakritiBadgeText}>
                  {getDoshaEmoji()} {prakriti?.type?.charAt(0).toUpperCase() + prakriti?.type?.slice(1) || 'Balanced'}
                </Text>
              </View>
            </View>

            <Text style={styles.prakritiAdvice}>{getDoshaAdvice()}</Text>

            <View style={styles.doshaBars}>
              <View style={styles.doshaBarItem}>
                <Text style={styles.doshaBarLabel}>Vata</Text>
                <View style={styles.doshaBarContainer}>
                  <View 
                    style={[
                      styles.doshaBarFill, 
                      { width: `${prakriti?.vata || 33}%`, backgroundColor: '#7B6E8F' }
                    ]} 
                  />
                </View>
                <Text style={styles.doshaBarValue}>{prakriti?.vata || 33}%</Text>
              </View>

              <View style={styles.doshaBarItem}>
                <Text style={styles.doshaBarLabel}>Pitta</Text>
                <View style={styles.doshaBarContainer}>
                  <View 
                    style={[
                      styles.doshaBarFill, 
                      { width: `${prakriti?.pitta || 33}%`, backgroundColor: '#FF6B6B' }
                    ]} 
                  />
                </View>
                <Text style={styles.doshaBarValue}>{prakriti?.pitta || 33}%</Text>
              </View>

              <View style={styles.doshaBarItem}>
                <Text style={styles.doshaBarLabel}>Kapha</Text>
                <View style={styles.doshaBarContainer}>
                  <View 
                    style={[
                      styles.doshaBarFill, 
                      { width: `${prakriti?.kapha || 34}%`, backgroundColor: '#6BA6A6' }
                    ]} 
                  />
                </View>
                <Text style={styles.doshaBarValue}>{prakriti?.kapha || 34}%</Text>
              </View>
            </View>
          </View>

          {/* Next Steps */}
          <View style={styles.nextStepsCard}>
            <Text style={styles.nextStepsTitle}>🚀 Next Steps</Text>
            
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Complete Your Profile</Text>
                <Text style={styles.stepDescription}>
                  Add more details for personalized insights
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Connect Your Device</Text>
                <Text style={styles.stepDescription}>
                  Sync your wristband for real-time monitoring
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Take Health Assessment</Text>
                <Text style={styles.stepDescription}>
                  Get your baseline health score
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Go to Dashboard"
              onPress={handleGoToDashboard}
              style={styles.dashboardButton}
              gradient
            />
            
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={handleCompleteProfile}
            >
              <Text style={styles.profileButtonText}>Complete Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Tips */}
          <View style={styles.tipsContainer}>
            <Ionicons name="bulb" size={20} color={colors.warningYellow} />
            <Text style={styles.tipsText}>
              Tip: Enable notifications to get daily health insights and reminders
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  confettiContainer: {
    position: 'absolute',
    width: width,
    height: height,
    pointerEvents: 'none',
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  confetti1: {
    backgroundColor: colors.primarySaffron,
    top: '30%',
    left: '40%',
  },
  confetti2: {
    backgroundColor: colors.primaryGreen,
    top: '40%',
    left: '50%',
  },
  confetti3: {
    backgroundColor: colors.heartRate,
    top: '35%',
    left: '45%',
  },
  confetti4: {
    backgroundColor: colors.spO2Blue,
    top: '45%',
    left: '55%',
  },
  confetti5: {
    backgroundColor: colors.stressPurple,
    top: '25%',
    left: '60%',
  },
  confetti6: {
    backgroundColor: colors.warningYellow,
    top: '50%',
    left: '35%',
  },
  checkmarkContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  checkmarkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.successGreen,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.successGreen,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 20,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  nameText: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 24,
  },
  successBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primaryGreen,
    marginLeft: 8,
  },
  prakritiCard: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  prakritiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  prakritiTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
  },
  prakritiBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  prakritiBadgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'white',
  },
  prakritiAdvice: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  doshaBars: {
    marginTop: 8,
  },
  doshaBarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  doshaBarLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
    width: 50,
  },
  doshaBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    marginHorizontal: 10,
  },
  doshaBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  doshaBarValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: colors.textPrimary,
    width: 40,
    textAlign: 'right',
  },
  nextStepsCard: {
    backgroundColor: 'rgba(255, 153, 51, 0.05)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  nextStepsTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primarySaffron,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: 'white',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  stepDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textTertiary,
    lineHeight: 18,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  dashboardButton: {
    marginBottom: 12,
  },
  profileButton: {
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.primarySaffron,
    alignItems: 'center',
  },
  profileButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.primarySaffron,
  },
  tipsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 179, 71, 0.1)',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  tipsText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.warningYellow,
    marginLeft: 12,
    lineHeight: 18,
  },
});

export default RegistrationComplete;