import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import SensorCard from '../../components/health/SensorCard';
import AlertCard from '../../components/health/AlertCard';
import RiskPredictionCard from '../../components/health/RiskPredictionCard';
import { generateCurrentReadings } from '../../services/sensors/mockDataGenerator';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { currentReadings, diseaseRisks } = useSelector((state) => state.healthData);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  // Local state
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [heartRateData, setHeartRateData] = useState({
    labels: ['6h', '12h', '18h', '24h'],
    datasets: [{
      data: [72, 75, 78, 72, 74, 76, 73, 70],
    }]
  });

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: false,
      }),
    ]).start();

    updateGreeting(); // Fixed: Changed from setGreeting() to updateGreeting()
    loadMockData();
    
    // Update greeting every minute
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateGreeting = () => { // New function to update greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  };

  const loadMockData = () => {
    const mockData = generateCurrentReadings();
    console.log('Mock data loaded:', mockData);
  };

  const getDoshaBadgeColor = () => {
    switch(user?.prakriti?.type) {
      case 'vata': return '#7B6E8F';
      case 'pitta': return '#FF6B6B';
      case 'kapha': return '#6BA6A6';
      default: return colors.primarySaffron;
    }
  };

  const getDoshaEmoji = () => {
    switch(user?.prakriti?.type) {
      case 'vata': return '🌬️';
      case 'pitta': return '🔥';
      case 'kapha': return '🌊';
      default: return '🌿';
    }
  };

  // Sample alerts
  const recentAlerts = [
    {
      id: '1',
      type: 'stress',
      title: 'High Stress Detected',
      message: 'Your stress levels are elevated. Try deep breathing.',
      time: '5 min ago',
      severity: 'high',
    },
    {
      id: '2',
      type: 'heart',
      title: 'Irregular Heart Rate',
      message: 'Slight variation detected. Monitoring...',
      time: '25 min ago',
      severity: 'medium',
    },
  ];

  // Feature cards
  const features = [
    {
      id: '1',
      title: 'AI Disease Prediction',
      icon: 'analytics',
      description: 'ML-powered health risk assessment',
      color: colors.primarySaffron,
    },
    {
      id: '2',
      title: 'Dosha Balance',
      icon: 'leaf',
      description: 'Track your Ayurvedic constitution',
      color: colors.primaryGreen,
    },
    {
      id: '3',
      title: 'Lifestyle Guidance',
      icon: 'fitness',
      description: 'Personalized daily recommendations',
      color: colors.spO2Blue,
    },
    {
      id: '4',
      title: 'Real-time Monitoring',
      icon: 'pulse',
      description: 'Continuous sensor tracking',
      color: colors.heartRate,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.headerTop}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>{greeting},</Text>
              <Text style={styles.userName}>
                {user?.personalInfo?.fullName?.split(' ')[0] || 'User'}
              </Text>
            </View>
            
            <View style={styles.headerRight}>
              {user?.prakriti?.type && (
                <View style={[styles.doshaBadge, { backgroundColor: getDoshaBadgeColor() }]}>
                  <Text style={styles.doshaBadgeText}>
                    {getDoshaEmoji()} {user.prakriti.type.charAt(0).toUpperCase() + user.prakriti.type.slice(1)}
                  </Text>
                </View>
              )}
              <TouchableOpacity style={styles.profileButton}>
                <Ionicons name="person-circle" size={40} color={colors.primarySaffron} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </Animated.View>

        {/* Live Sensor Data - Horizontal Scroll */}
        <Animated.View 
          style={[
            styles.sensorsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Live Sensors</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.sensorsScroll}
          >
            <SensorCard
              type="heart"
              value={currentReadings?.heartRate || 72}
              unit="bpm"
              icon="heart"
              color={colors.heartRate}
              onPress={() => navigation.navigate(ROUTES.HEART_RATE_DETAIL)}
            />
            <SensorCard
              type="temperature"
              value={currentReadings?.temperature || 36.6}
              unit="°C"
              icon="thermometer"
              color={colors.tempOrange}
              onPress={() => navigation.navigate(ROUTES.TEMPERATURE_DETAIL)}
            />
            <SensorCard
              type="spo2"
              value={currentReadings?.spo2 || 98}
              unit="%"
              icon="fitness"
              color={colors.spO2Blue}
              onPress={() => navigation.navigate(ROUTES.SPO2_DETAIL)}
            />
            <SensorCard
              type="stress"
              value={currentReadings?.stress || 45}
              unit=""
              icon="flash"
              color={colors.stressPurple}
              onPress={() => navigation.navigate(ROUTES.STRESS_DETAIL)}
            />
          </ScrollView>
        </Animated.View>

        {/* Heart Rate Graph */}
        <Animated.View 
          style={[
            styles.graphSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.graphHeader}>
            <Text style={styles.graphTitle}>Heart Rate Trend</Text>
            <View style={styles.graphStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Min</Text>
                <Text style={styles.statValue}>58</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Avg</Text>
                <Text style={styles.statValue}>72</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Max</Text>
                <Text style={styles.statValue}>82</Text>
              </View>
            </View>
          </View>
          
          <LineChart
            data={heartRateData}
            width={width - 40}
            height={180}
            chartConfig={{
              backgroundColor: 'white',
              backgroundGradientFrom: 'white',
              backgroundGradientTo: 'white',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 77, 109, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(90, 107, 122, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: colors.heartRate,
              },
            }}
            bezier
            style={styles.graph}
          />
          
          <Text style={styles.currentBPM}>
            Current: {currentReadings?.heartRate || 72} BPM
          </Text>
        </Animated.View>

        {/* Recent Alerts */}
        <Animated.View 
          style={[
            styles.alertsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Alerts</Text>
            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.ALERTS_MAIN)}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentAlerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}

          {recentAlerts.length === 0 && (
            <View style={styles.noAlerts}>
              <Ionicons name="checkmark-circle" size={40} color={colors.successGreen} />
              <Text style={styles.noAlertsText}>All systems balanced 🌿</Text>
            </View>
          )}
        </Animated.View>

        {/* Feature Cards */}
        <Animated.View 
          style={[
            styles.featuresSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresGrid}>
            {features.map(feature => (
              <TouchableOpacity key={feature.id} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: `${feature.color}20` }]}>
                  <Ionicons name={feature.icon} size={24} color={feature.color} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Disease Risk Predictions */}
        <Animated.View 
          style={[
            styles.risksSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Top Risk Predictions</Text>
          {diseaseRisks?.slice(0, 3).map((risk, index) => (
            <RiskPredictionCard key={index} risk={risk} />
          ))}
        </Animated.View>

        {/* Sync Status */}
        <Animated.View 
          style={[
            styles.syncStatus,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Ionicons name="sync" size={16} color={colors.textTertiary} />
          <Text style={styles.syncText}>
            Last synced: {new Date().toLocaleTimeString()}
          </Text>
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
  },
  userName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doshaBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 12,
  },
  doshaBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'white',
  },
  profileButton: {
    padding: 4,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textTertiary,
  },
  sensorsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  sensorsScroll: {
    flexDirection: 'row',
  },
  graphSection: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  graphHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  graphTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  graphStats: {
    flexDirection: 'row',
  },
  statItem: {
    alignItems: 'center',
    marginLeft: 16,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
  },
  statValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
  },
  graph: {
    marginVertical: 8,
    borderRadius: 16,
  },
  currentBPM: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.heartRate,
    textAlign: 'center',
    marginTop: 8,
  },
  alertsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primarySaffron,
  },
  noAlerts: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'white',
    borderRadius: 16,
  },
  noAlertsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
  },
  featuresSection: {
    marginBottom: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    lineHeight: 16,
  },
  risksSection: {
    marginBottom: 20,
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  syncText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginLeft: 6,
  },
});

export default DashboardScreen;