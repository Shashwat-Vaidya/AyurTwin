import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Button from '../../components/common/Button';

const { width, height } = Dimensions.get('window');

const FeaturesScreen = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  const features = [
    {
      id: '1',
      title: 'Real-time Health Monitoring',
      description: 'Track your heart rate, SpO₂, temperature, and stress levels continuously with our advanced sensors.',
      icon: 'heart',
      color: colors.heartRate,
      gradient: [colors.heartRate, '#FF8A5C'],
      details: [
        '24/7 continuous monitoring',
        'Instant alerts for abnormalities',
        'Historical data tracking',
        'Trend analysis and insights',
      ],
    },
    {
      id: '2',
      title: 'AI Disease Prediction',
      description: 'Get early warnings about potential health risks using our advanced machine learning algorithms.',
      icon: 'analytics',
      color: colors.primarySaffron,
      gradient: [colors.primarySaffron, '#FFB347'],
      details: [
        '10 disease risk predictions',
        'Personalized risk factors',
        'Preventive recommendations',
        'Regular risk assessments',
      ],
    },
    {
      id: '3',
      title: 'Ayurvedic Wisdom',
      description: 'Discover your unique dosha constitution and receive personalized Ayurvedic guidance.',
      icon: 'leaf',
      color: colors.primaryGreen,
      gradient: [colors.primaryGreen, '#6AB04A'],
      details: [
        'Prakriti analysis quiz',
        'Dosha balance tracking',
        'Ayurvedic lifestyle tips',
        'Seasonal recommendations',
      ],
    },
    {
      id: '4',
      title: 'Smart Alerts & Notifications',
      description: 'Stay informed about your health with intelligent alerts and reminders.',
      icon: 'notifications',
      color: colors.warningYellow,
      gradient: [colors.warningYellow, '#FFB347'],
      details: [
        'Critical health alerts',
        'Medication reminders',
        'Hydration notifications',
        'Weekly health reports',
      ],
    },
    {
      id: '5',
      title: 'Device Integration',
      description: 'Seamlessly connect with your AyurTwin wearable device for accurate real-time data.',
      icon: 'watch',
      color: colors.spO2Blue,
      gradient: [colors.spO2Blue, '#6AB0FF'],
      details: [
        'Bluetooth connectivity',
        'Automatic data sync',
        'Battery monitoring',
        'Multiple device support',
      ],
    },
    {
      id: '6',
      title: 'Personalized Recommendations',
      description: 'Receive customized diet, exercise, and lifestyle advice based on your unique profile.',
      icon: 'fitness',
      color: colors.stressPurple,
      gradient: [colors.stressPurple, '#B78CB9'],
      details: [
        'Diet recommendations',
        'Exercise suggestions',
        'Stress relief techniques',
        'Sleep optimization tips',
      ],
    },
  ];

  const handleNext = () => {
    if (currentIndex < features.length - 1) {
      flatListRef.current.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleContinue();
    }
  };

  const handleContinue = () => {
    navigation.navigate(ROUTES.ONBOARDING);
  };

  const renderFeature = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.featureSlide, { width, opacity, transform: [{ scale }] }]}>
        <LinearGradient
          colors={item.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconContainer}
        >
          <Ionicons name={item.icon} size={50} color="white" />
        </LinearGradient>

        <Text style={styles.featureTitle}>{item.title}</Text>
        <Text style={styles.featureDescription}>{item.description}</Text>

        <View style={styles.detailsContainer}>
          {item.details.map((detail, idx) => (
            <View key={idx} style={styles.detailItem}>
              <Ionicons name="checkmark-circle" size={20} color={item.color} />
              <Text style={styles.detailText}>{detail}</Text>
            </View>
          ))}
        </View>
      </Animated.View>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {features.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor: features[index].color,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={features}
        renderItem={renderFeature}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {renderPagination()}

      <View style={styles.footer}>
        <Button
          title={currentIndex === features.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          gradient
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
  },
  featureSlide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  featureTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  featureDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  detailsContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 12,
    flex: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  button: {
    width: '100%',
  },
});

export default FeaturesScreen;