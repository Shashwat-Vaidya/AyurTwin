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
import { LinearGradient } from 'expo-linear-gradient';

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

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
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
  }, []);

  const getDoshaColor = () => {
    switch(prakriti?.type) {
      case 'vata': return '#7B6E8F';
      case 'pitta': return '#FF6B6B';
      case 'kapha': return '#6BA6A6';
      default: return colors.primarySaffron;
    }
  };

  const getDoshaIcon = () => {
    switch(prakriti?.type) {
      case 'vata': return 'cloud-outline';
      case 'pitta': return 'flame-outline';
      case 'kapha': return 'water-outline';
      default: return 'leaf-outline';
    }
  };

  const handleGoToDashboard = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: ROUTES.MAIN_TABS }],
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Checkmark */}
        <Animated.View style={[styles.checkmarkContainer, { transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient
            colors={[colors.successGreen, colors.primaryGreen]}
            style={styles.checkmarkCircle}
          >
            <Ionicons name="checkmark" size={60} color="white" />
          </LinearGradient>
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
          <Text style={styles.welcomeText}>Welcome to AyurTwin!</Text>
          <Text style={styles.nameText}>{user?.personalInfo?.fullName?.split(' ')[0] || 'User'}</Text>
          
          <View style={styles.successBadge}>
            <Ionicons name="leaf" size={20} color={colors.primaryGreen} />
            <Text style={styles.successBadgeText}>Registration Complete</Text>
          </View>

          {/* Prakriti Card */}
          {prakriti?.type && (
            <View style={[styles.prakritiCard, { borderColor: getDoshaColor() }]}>
              <View style={styles.prakritiHeader}>
                <Text style={styles.prakritiTitle}>Your Prakriti</Text>
                <View style={[styles.prakritiBadge, { backgroundColor: getDoshaColor() }]}>
                  <Ionicons name={getDoshaIcon()} size={14} color="white" style={{ marginRight: 6 }} />
                  <Text style={styles.prakritiBadgeText}>
                    {prakriti.type.charAt(0).toUpperCase() + prakriti.type.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Go to Dashboard"
              onPress={handleGoToDashboard}
              style={styles.dashboardButton}
              gradient
            />
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
    padding: 20,
    paddingBottom: 40,
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
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.successGreen,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  contentContainer: {
    alignItems: 'center',
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
    width: '100%',
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
  },
  prakritiTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
  },
  prakritiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  prakritiBadgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'white',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  dashboardButton: {
    marginBottom: 12,
  },
});

export default RegistrationComplete;