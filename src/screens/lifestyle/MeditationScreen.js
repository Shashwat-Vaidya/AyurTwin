import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const { width } = Dimensions.get('window');

const MeditationScreen = () => {
  const navigation = useNavigation();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMeditation, setSelectedMeditation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(5);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [favoriteMeditations, setFavoriteMeditations] = useState([]);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressWidth = progressAnim.interpolate({
  inputRange: [0, 100],
  outputRange: [0, width - 80], // adjust based on container padding
  });
  const timerRef = useRef(null);

  const categories = [
    { id: 'all', name: 'All', icon: 'apps' },
    { id: 'guided', name: 'Guided', icon: 'headset' },
    { id: 'breathing', name: 'Breathing', icon: 'leaf' },
    { id: 'sleep', name: 'Sleep', icon: 'moon' },
    { id: 'stress', name: 'Stress Relief', icon: 'flash' },
    { id: 'focus', name: 'Focus', icon: 'fitness' },
  ];

  const meditations = [
    {
      id: '1',
      title: 'Morning Calm',
      duration: 10,
      category: 'guided',
      instructor: 'Sarah Williams',
      description: 'Start your day with clarity and peace',
      color: colors.primarySaffron,
      icon: 'sunny',
      audio: 'morning_calm.mp3',
      favorite: false,
    },
    {
      id: '2',
      title: 'Deep Relaxation',
      duration: 15,
      category: 'sleep',
      instructor: 'Dr. James Chen',
      description: 'Release tension and prepare for restful sleep',
      color: colors.sleepIndigo,
      icon: 'moon',
      audio: 'deep_relaxation.mp3',
      favorite: true,
    },
    {
      id: '3',
      title: 'Stress Release',
      duration: 12,
      category: 'stress',
      instructor: 'Priya Patel',
      description: 'Let go of stress and anxiety',
      color: colors.stressPurple,
      icon: 'flash',
      audio: 'stress_release.mp3',
      favorite: false,
    },
    {
      id: '4',
      title: 'Box Breathing',
      duration: 5,
      category: 'breathing',
      instructor: 'Michael Brown',
      description: 'Calm your nervous system with box breathing',
      color: colors.primaryGreen,
      icon: 'leaf',
      audio: 'box_breathing.mp3',
      favorite: false,
    },
    {
      id: '5',
      title: 'Body Scan',
      duration: 20,
      category: 'guided',
      instructor: 'Sarah Williams',
      description: 'Full body awareness and relaxation',
      color: colors.spO2Blue,
      icon: 'body',
      audio: 'body_scan.mp3',
      favorite: true,
    },
    {
      id: '6',
      title: 'Focus Flow',
      duration: 8,
      category: 'focus',
      instructor: 'Dr. James Chen',
      description: 'Enhance concentration and productivity',
      color: colors.tempOrange,
      icon: 'fitness',
      audio: 'focus_flow.mp3',
      favorite: false,
    },
    {
      id: '7',
      title: 'Gratitude Practice',
      duration: 7,
      category: 'guided',
      instructor: 'Priya Patel',
      description: 'Cultivate appreciation and joy',
      color: colors.warningYellow,
      icon: 'heart',
      audio: 'gratitude.mp3',
      favorite: true,
    },
    {
      id: '8',
      title: '4-7-8 Breathing',
      duration: 6,
      category: 'breathing',
      instructor: 'Michael Brown',
      description: 'Deep relaxation breathing technique',
      color: colors.heartRate,
      icon: 'leaf',
      audio: '478_breathing.mp3',
      favorite: false,
    },
  ];

  const filteredMeditations = selectedCategory === 'all' 
    ? meditations 
    : meditations.filter(m => m.category === selectedCategory);

  const favorites = meditations.filter(m => m.favorite);

  useEffect(() => {
    if (isPlaying) {
      startTimer();
    } else {
      stopTimer();
    }
    return () => stopTimer();
  }, [isPlaying]);

  const startTimer = () => {
    let timeLeft = timer * 60;
    const interval = 1000; // 1 second
    const totalSteps = timeLeft / interval;

    timerRef.current = setInterval(() => {
      timeLeft -= interval / 1000;
      const newProgress = ((timer * 60 - timeLeft) / (timer * 60)) * 100;
      setProgress(newProgress);
      Animated.timing(progressAnim, {
        toValue: newProgress,
        duration: 100,
        useNativeDriver: false,
      }).start();

      if (timeLeft <= 0) {
        stopTimer();
        setIsPlaying(false);
        setProgress(0);
      }
    }, interval);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const togglePlay = (meditation) => {
    if (selectedMeditation?.id === meditation.id) {
      setIsPlaying(!isPlaying);
    } else {
      setSelectedMeditation(meditation);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const toggleFavorite = (meditationId) => {
    setFavoriteMeditations(prev => {
      if (prev.includes(meditationId)) {
        return prev.filter(id => id !== meditationId);
      } else {
        return [...prev, meditationId];
      }
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meditation</Text>
          <TouchableOpacity style={styles.historyButton}>
            <Ionicons name="time" size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <LinearGradient
          colors={[colors.stressPurple, colors.sleepIndigo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Text style={styles.heroTitle}>Find Your Peace</Text>
          <Text style={styles.heroSubtitle}>
            Guided meditations for stress relief, better sleep, and inner calm
          </Text>
          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>Start Your Journey</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons 
                name={category.icon} 
                size={16} 
                color={selectedCategory === category.id ? 'white' : colors.textSecondary} 
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive,
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Favorites Section */}
        {favorites.length > 0 && selectedCategory === 'all' && (
          <View style={styles.favoritesSection}>
            <Text style={styles.sectionTitle}>Your Favorites</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {favorites.map((meditation) => (
                <TouchableOpacity
                  key={meditation.id}
                  style={[styles.favoriteCard, { backgroundColor: `${meditation.color}20` }]}
                  onPress={() => togglePlay(meditation)}
                >
                  <LinearGradient
                    colors={[meditation.color, `${meditation.color}CC`]}
                    style={styles.favoriteIcon}
                  >
                    <Ionicons name={meditation.icon} size={24} color="white" />
                  </LinearGradient>
                  <Text style={styles.favoriteTitle}>{meditation.title}</Text>
                  <Text style={styles.favoriteDuration}>{meditation.duration} min</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* All Meditations */}
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'all' ? 'All Meditations' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Meditations`}
        </Text>

        {filteredMeditations.map((meditation) => (
          <Card key={meditation.id} style={styles.meditationCard}>
            <View style={styles.meditationHeader}>
              <LinearGradient
                colors={[meditation.color, `${meditation.color}CC`]}
                style={styles.meditationIcon}
              >
                <Ionicons name={meditation.icon} size={24} color="white" />
              </LinearGradient>
              
              <View style={styles.meditationInfo}>
                <Text style={styles.meditationTitle}>{meditation.title}</Text>
                <Text style={styles.meditationInstructor}>{meditation.instructor}</Text>
                <Text style={styles.meditationDuration}>{meditation.duration} min</Text>
              </View>

              <TouchableOpacity onPress={() => toggleFavorite(meditation.id)}>
                <Ionicons 
                  name={favoriteMeditations.includes(meditation.id) ? 'heart' : 'heart-outline'} 
                  size={24} 
                  color={favoriteMeditations.includes(meditation.id) ? colors.heartRate : colors.textTertiary} 
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.meditationDescription}>{meditation.description}</Text>

            {selectedMeditation?.id === meditation.id && isPlaying && (
              <View style={styles.playerContainer}>
                <View style={styles.progressContainer}>
                  <Animated.View
                    style={[
                      styles.progressBar,
                    {
                    width: progressWidth,
                    },
                  ]}
                  />
                </View>
                <View style={styles.playerControls}>
                  <Text style={styles.timeText}>
                    {formatTime(progress * timer * 60 / 100)} / {formatTime(timer * 60)}
                  </Text>
                  <View style={styles.controlButtons}>
                    <TouchableOpacity style={styles.controlButton}>
                      <Ionicons name="play-skip-back" size={20} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.playButton, { backgroundColor: meditation.color }]}
                      onPress={() => setIsPlaying(!isPlaying)}
                    >
                      <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.controlButton}>
                      <Ionicons name="play-skip-forward" size={20} color={colors.textPrimary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {selectedMeditation?.id !== meditation.id && (
              <TouchableOpacity 
                style={[styles.startButton, { backgroundColor: meditation.color }]}
                onPress={() => togglePlay(meditation)}
              >
                <Ionicons name="play" size={16} color="white" />
                <Text style={styles.startButtonText}>Start</Text>
              </TouchableOpacity>
            )}
          </Card>
        ))}

        {/* Timer Settings */}
        <Card style={styles.timerCard}>
          <Text style={styles.timerTitle}>Timer Settings</Text>
          
          <View style={styles.timerRow}>
            <Text style={styles.timerLabel}>Duration</Text>
            <Text style={styles.timerValue}>{timer} minutes</Text>
          </View>
          
          <Slider
            style={styles.timerSlider}
            minimumValue={1}
            maximumValue={60}
            step={1}
            value={timer}
            onValueChange={setTimer}
            minimumTrackTintColor={colors.stressPurple}
            maximumTrackTintColor="rgba(0,0,0,0.1)"
            thumbTintColor={colors.stressPurple}
          />

          <View style={styles.timerRow}>
            <Text style={styles.timerLabel}>Volume</Text>
            <Text style={styles.timerValue}>{volume}%</Text>
          </View>
          
          <Slider
            style={styles.timerSlider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={volume}
            onValueChange={setVolume}
            minimumTrackTintColor={colors.stressPurple}
            maximumTrackTintColor="rgba(0,0,0,0.1)"
            thumbTintColor={colors.stressPurple}
          />
        </Card>

        {/* Meditation Stats */}
        <Card style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Meditation Journey</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Total Sessions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>187</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>7</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </Card>

        {/* Daily Quote */}
        <Card style={styles.quoteCard}>
          <Ionicons name="quote" size={30} color={colors.primarySaffron} />
          <Text style={styles.quoteText}>
            "Peace comes from within. Do not seek it without."
          </Text>
          <Text style={styles.quoteAuthor}>- Buddha</Text>
        </Card>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.textPrimary,
  },
  historyButton: {
    padding: 8,
  },
  heroCard: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
  },
  heroTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: 'white',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: 'white',
    opacity: 0.9,
    marginBottom: 20,
    lineHeight: 22,
  },
  heroButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'white',
  },
  categoryScroll: {
    marginBottom: 24,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  categoryChipActive: {
    backgroundColor: colors.primarySaffron,
    borderColor: colors.primarySaffron,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  categoryTextActive: {
    color: 'white',
  },
  favoritesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  favoriteCard: {
    width: 150,
    padding: 16,
    marginRight: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  favoriteIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  favoriteTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  favoriteDuration: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  meditationCard: {
    padding: 16,
    marginBottom: 12,
  },
  meditationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  meditationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  meditationInfo: {
    flex: 1,
  },
  meditationTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  meditationInstructor: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  meditationDuration: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.primarySaffron,
  },
  meditationDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
  },
  startButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: 'white',
    marginLeft: 4,
  },
  playerContainer: {
    marginTop: 12,
  },
  progressContainer: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.stressPurple,
    borderRadius: 2,
  },
  playerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textTertiary,
  },
  controlButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  timerCard: {
    padding: 16,
    marginBottom: 16,
  },
  timerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timerLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  timerValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
  },
  timerSlider: {
    width: '100%',
    height: 40,
    marginBottom: 16,
  },
  statsCard: {
    padding: 16,
    marginBottom: 16,
  },
  statsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  quoteCard: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 153, 51, 0.05)',
  },
  quoteText: {
    fontFamily: 'Inter-Italic',
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
    lineHeight: 24,
  },
  quoteAuthor: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primarySaffron,
  },
});

export default MeditationScreen;