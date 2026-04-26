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

const StressReliefTools = () => {
  const navigation = useNavigation();

  const [selectedTool, setSelectedTool] = useState('breathing');
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [breathingCount, setBreathingCount] = useState(4);
  const [isBreathing, setIsBreathing] = useState(false);
  const [selectedSound, setSelectedSound] = useState('rain');
  const [isPlaying, setIsPlaying] = useState(false);
  const [meditationTime, setMeditationTime] = useState(5);
  const [meditationProgress, setMeditationProgress] = useState(0);

  const breatheAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);

  const tools = [
    { id: 'breathing', name: 'Breathing', icon: 'leaf', color: colors.primaryGreen },
    { id: 'meditation', name: 'Meditation', icon: 'body', color: colors.stressPurple },
    { id: 'sounds', name: 'Sounds', icon: 'musical-notes', color: colors.spO2Blue },
    { id: 'yoga', name: 'Yoga', icon: 'fitness', color: colors.primarySaffron },
    { id: 'journal', name: 'Journal', icon: 'journal', color: colors.heartRate },
  ];

  const breathingExercises = [
    { id: 'box', name: 'Box Breathing', inhale: 4, hold: 4, exhale: 4 },
    { id: '478', name: '4-7-8 Breathing', inhale: 4, hold: 7, exhale: 8 },
    { id: 'relaxing', name: 'Relaxing Breath', inhale: 5, hold: 2, exhale: 5 },
  ];

  const sounds = [
    { id: 'rain', name: 'Rain', icon: 'rainy', color: colors.spO2Blue },
    { id: 'forest', name: 'Forest', icon: 'leaf', color: colors.primaryGreen },
    { id: 'ocean', name: 'Ocean', icon: 'water', color: colors.spO2Blue },
    { id: 'fire', name: 'Fireplace', icon: 'flame', color: colors.tempOrange },
    { id: 'wind', name: 'Wind', icon: 'wind', color: colors.stressPurple },
  ];

  const yogaPoses = [
    { id: 'child', name: "Child's Pose", time: '2 min', benefit: 'Calms nervous system' },
    { id: 'downward', name: 'Downward Dog', time: '1 min', benefit: 'Relieves stress' },
    { id: 'legs', name: 'Legs Up Wall', time: '5 min', benefit: 'Restorative' },
    { id: 'cat', name: 'Cat-Cow', time: '2 min', benefit: 'Spine flexibility' },
  ];

  useEffect(() => {
    if (isBreathing) {
      startBreathing();
    } else {
      resetBreathing();
    }
    return () => clearInterval(timerRef.current);
  }, [isBreathing, selectedTool]);

  const startBreathing = () => {
    let phase = 'inhale';
    let count = 4;
    
    timerRef.current = setInterval(() => {
      setBreathingPhase(phase);
      setBreathingCount(count);
      
      Animated.timing(breatheAnim, {
        toValue: phase === 'inhale' ? 1.5 : phase === 'exhale' ? 0.8 : 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      if (phase === 'inhale') {
        if (count === 1) {
          phase = 'hold';
          count = 7;
        } else {
          count--;
        }
      } else if (phase === 'hold') {
        if (count === 1) {
          phase = 'exhale';
          count = 8;
        } else {
          count--;
        }
      } else if (phase === 'exhale') {
        if (count === 1) {
          phase = 'inhale';
          count = 4;
        } else {
          count--;
        }
      }
    }, 1000);
  };

  const resetBreathing = () => {
    clearInterval(timerRef.current);
    setBreathingPhase('inhale');
    setBreathingCount(4);
    breatheAnim.setValue(1);
  };

  const renderBreathingTool = () => (
    <View style={styles.toolContent}>
      <Text style={styles.toolTitle}>Guided Breathing</Text>
      
      <View style={styles.breathingContainer}>
        <Animated.View
          style={[
            styles.breathingCircle,
            {
              transform: [{ scale: breatheAnim }],
              backgroundColor: isBreathing ? colors.primaryGreen : colors.textTertiary,
            },
          ]}
        >
          <Text style={styles.breathingPhase}>
            {breathingPhase.charAt(0).toUpperCase() + breathingPhase.slice(1)}
          </Text>
          <Text style={styles.breathingCount}>{breathingCount}</Text>
        </Animated.View>
      </View>

      <View style={styles.exerciseSelector}>
        {breathingExercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.id}
            style={styles.exerciseButton}
            onPress={() => {
              resetBreathing();
              setIsBreathing(false);
            }}
          >
            <Text style={styles.exerciseName}>{exercise.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.breathingButton, isBreathing && styles.breathingButtonActive]}
        onPress={() => setIsBreathing(!isBreathing)}
      >
        <Ionicons 
          name={isBreathing ? 'pause' : 'play'} 
          size={30} 
          color="white" 
        />
        <Text style={styles.breathingButtonText}>
          {isBreathing ? 'Pause' : 'Start Breathing Exercise'}
        </Text>
      </TouchableOpacity>

      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>How to do Box Breathing:</Text>
        <Text style={styles.instruction}>1. Inhale through your nose for 4 seconds</Text>
        <Text style={styles.instruction}>2. Hold your breath for 4 seconds</Text>
        <Text style={styles.instruction}>3. Exhale through your mouth for 4 seconds</Text>
        <Text style={styles.instruction}>4. Hold for 4 seconds before next breath</Text>
      </View>
    </View>
  );

  const renderMeditationTool = () => (
    <View style={styles.toolContent}>
      <Text style={styles.toolTitle}>Guided Meditation</Text>

      <View style={styles.meditationContainer}>
        <LinearGradient
          colors={[colors.stressPurple, colors.sleepIndigo]}
          style={styles.meditationCircle}
        >
          <Ionicons name="body"size={50} color="white" />
        </LinearGradient>

        <View style={styles.meditationTimer}>
          <Text style={styles.meditationTime}>{meditationTime}:00</Text>
          <Text style={styles.meditationLabel}>minutes</Text>
        </View>

        <Slider
          style={styles.meditationSlider}
          minimumValue={1}
          maximumValue={30}
          step={1}
          value={meditationTime}
          onValueChange={setMeditationTime}
          minimumTrackTintColor={colors.stressPurple}
          maximumTrackTintColor="rgba(0,0,0,0.1)"thumbTintColor={colors.stressPurple}
        />

        <View style={styles.meditationOptions}>
          <TouchableOpacity style={styles.meditationOption}>
            <Ionicons name="volume-high"size={20} color={colors.stressPurple} />
            <Text style={styles.meditationOptionText}>Guided</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.meditationOption}>
            <Ionicons name="musical-notes"size={20} color={colors.stressPurple} />
            <Text style={styles.meditationOptionText}>Music</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.meditationOption}>
            <Ionicons name="timer"size={20} color={colors.stressPurple} />
            <Text style={styles.meditationOptionText}>Timer</Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Start Meditation"onPress={() => {}}
          style={styles.meditationStartButton}
          gradient
          icon="play"
        />
      </View>
    </View>
  );

  const renderSoundsTool = () => (
    <View style={styles.toolContent}>
      <Text style={styles.toolTitle}>Calming Sounds</Text>

      <View style={styles.soundsGrid}>
        {sounds.map((sound) => (
          <TouchableOpacity
            key={sound.id}
            style={[
              styles.soundCard,
              selectedSound === sound.id && { borderColor: sound.color, borderWidth: 2 }
            ]}
            onPress={() => setSelectedSound(sound.id)}
          >
            <View style={[styles.soundIcon, { backgroundColor: `${sound.color}20` }]}>
              <Ionicons name={sound.icon} size={30} color={sound.color} />
            </View>
            <Text style={styles.soundName}>{sound.name}</Text>
            {selectedSound === sound.id && (
              <View style={[styles.soundPlaying, { backgroundColor: sound.color }]}>
                <Ionicons name="volume-high"size={16} color="white" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.soundControls}>
        <TouchableOpacity 
          style={styles.soundControlButton}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          <LinearGradient
            colors={[colors.primarySaffron, colors.primaryGreen]}
            style={styles.soundControlGradient}
          >
            <Ionicons 
              name={isPlaying ? 'pause' : 'play'} 
              size={30} 
              color="white" 
            />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.volumeControl}>
          <Ionicons name="volume-low"size={20} color={colors.textSecondary} />
          <Slider
            style={styles.volumeSlider}
            minimumValue={0}
            maximumValue={100}
            value={50}
            minimumTrackTintColor={colors.primarySaffron}
            maximumTrackTintColor="rgba(0,0,0,0.1)"
          />
          <Ionicons name="volume-high"size={20} color={colors.textSecondary} />
        </View>
      </View>

      <Card style={styles.timerCard}>
        <Ionicons name="timer"size={20} color={colors.primarySaffron} />
        <Text style={styles.timerText}>Sleep timer: Off</Text>
        <TouchableOpacity>
          <Text style={styles.timerSetText}>Set</Text>
        </TouchableOpacity>
      </Card>
    </View>
  );

  const renderYogaTool = () => (
    <View style={styles.toolContent}>
      <Text style={styles.toolTitle}>Quick Yoga Poses</Text>

      {yogaPoses.map((pose) => (
        <Card key={pose.id} style={styles.yogaCard}>
          <View style={styles.yogaHeader}>
            <Ionicons name="body"size={24} color={colors.primarySaffron} />
            <View style={styles.yogaInfo}>
              <Text style={styles.yogaName}>{pose.name}</Text>
              <Text style={styles.yogaTime}>{pose.time}</Text>
            </View>
          </View>
          <Text style={styles.yogaBenefit}>{pose.benefit}</Text>
          <TouchableOpacity style={styles.yogaStartButton}>
            <Text style={styles.yogaStartText}>Start</Text>
          </TouchableOpacity>
        </Card>
      ))}

      <Button
        title="View All Yoga Poses"onPress={() => {}}
        style={styles.viewAllButton}
        outline
      />
    </View>
  );

  const renderJournalTool = () => (
    <View style={styles.toolContent}>
      <Text style={styles.toolTitle}>Gratitude Journal</Text>

      <Card style={styles.journalPromptCard}>
        <Text style={styles.promptDate}>Today, {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</Text>
        <Text style={styles.promptText}>What are three things you're grateful for today?</Text>
      </Card>

      <TouchableOpacity style={styles.journalEntry}>
        <View style={styles.entryLeft}>
          <Ionicons name="sunny"size={20} color={colors.warningYellow} />
          <Text style={styles.entryText}>Morning reflection...</Text>
        </View>
        <Text style={styles.entryTime}>8:30 AM</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.journalEntry}>
        <View style={styles.entryLeft}>
          <Ionicons name="cafe"size={20} color={colors.tempOrange} />
          <Text style={styles.entryText}>Afternoon thoughts...</Text>
        </View>
        <Text style={styles.entryTime}>2:15 PM</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addEntryButton}>
        <Ionicons name="add-circle"size={24} color={colors.primarySaffron} />
        <Text style={styles.addEntryText}>Write in journal</Text>
      </TouchableOpacity>

      <View style={styles.moodTracker}>
        <Text style={styles.moodTitle}>How are you feeling?</Text>
        <View style={styles.moodOptions}>
          {['', '', '', '', ''].map((mood, index) => (
            <TouchableOpacity key={index} style={styles.moodButton}>
              <Text style={styles.moodEmoji}>{mood}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

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
            <Ionicons name="arrow-back"size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Stress Relief Tools</Text>
          <TouchableOpacity style={styles.historyButton}>
            <Ionicons name="time"size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* Tool Selector */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.toolScroll}
        >
          {tools.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={[
                styles.toolTab,
                selectedTool === tool.id && styles.toolTabActive,
                selectedTool === tool.id && { borderColor: tool.color }
              ]}
              onPress={() => setSelectedTool(tool.id)}
            >
              <Ionicons 
                name={tool.icon} 
                size={24} 
                color={selectedTool === tool.id ? tool.color : colors.textSecondary} 
              />
              <Text style={[
                styles.toolTabText,
                selectedTool === tool.id && { color: tool.color }
              ]}>
                {tool.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Selected Tool Content */}
        <Card style={styles.toolCard}>
          {selectedTool === 'breathing' && renderBreathingTool()}
          {selectedTool === 'meditation' && renderMeditationTool()}
          {selectedTool === 'sounds' && renderSoundsTool()}
          {selectedTool === 'yoga' && renderYogaTool()}
          {selectedTool === 'journal' && renderJournalTool()}
        </Card>

        {/* Daily Affirmation */}
        <Card style={styles.affirmationCard}>
          <Ionicons name="heart"size={24} color={colors.heartRate} />
          <Text style={styles.affirmationText}>
            "You are stronger than you think. Take a deep breath and keep going."
          </Text>
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
  toolScroll: {
    marginBottom: 16,
  },
  toolTab: {
    alignItems: 'center',
    marginRight: 20,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  toolTabActive: {
    borderBottomWidth: 2,
  },
  toolTabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  toolCard: {
    padding: 20,
    marginBottom: 16,
  },
  toolContent: {
    width: '100%',
  },
  toolTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: colors.textPrimary,
    marginBottom: 20,
  },
  // Breathing styles
  breathingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathingPhase: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: 'white',
    marginBottom: 8,
  },
  breathingCount: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: 'white',
    opacity: 0.9,
  },
  exerciseSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  exerciseButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  exerciseName: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
  },
  breathingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryGreen,
    paddingVertical: 16,
    borderRadius: 30,
    marginBottom: 20,
  },
  breathingButtonActive: {
    backgroundColor: colors.alertRed,
  },
  breathingButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'white',
    marginLeft: 8,
  },
  instructionsCard: {
    padding: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  instructionsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  instruction: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
    lineHeight: 18,
  },
  // Meditation styles
  meditationContainer: {
    alignItems: 'center',
  },
  meditationCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  meditationTimer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  meditationTime: {
    fontFamily: 'Inter-Bold',
    fontSize: 48,
    color: colors.textPrimary,
  },
  meditationLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textTertiary,
  },
  meditationSlider: {
    width: '100%',
    height: 40,
    marginBottom: 20,
  },
  meditationOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  meditationOption: {
    alignItems: 'center',
  },
  meditationOptionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  meditationStartButton: {
    width: '100%',
  },
  // Sounds styles
  soundsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  soundCard: {
    width: '48%',
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    backgroundColor: 'white',
    position: 'relative',
  },
  soundIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  soundName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
  },
  soundPlaying: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  soundControls: {
    alignItems: 'center',
    marginBottom: 20,
  },
  soundControlButton: {
    marginBottom: 20,
  },
  soundControlGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  volumeSlider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  timerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  timerText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  timerSetText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primarySaffron,
  },
  // Yoga styles
  yogaCard: {
    padding: 16,
    marginBottom: 12,
  },
  yogaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  yogaInfo: {
    flex: 1,
    marginLeft: 12,
  },
  yogaName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  yogaTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  yogaBenefit: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  yogaStartButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: colors.primarySaffron,
    borderRadius: 15,
  },
  yogaStartText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'white',
  },
  viewAllButton: {
    marginTop: 8,
  },
  // Journal styles
  journalPromptCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 153, 51, 0.05)',
  },
  promptDate: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.primarySaffron,
    marginBottom: 4,
  },
  promptText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
  },
  journalEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  entryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  entryTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  addEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 153, 51, 0.3)',
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  addEntryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.primarySaffron,
    marginLeft: 8,
  },
  moodTracker: {
    alignItems: 'center',
  },
  moodTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  moodOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  moodButton: {
    padding: 10,
  },
  moodEmoji: {
    fontSize: 24,
  },
  affirmationCard: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 77, 109, 0.05)',
  },
  affirmationText: {
    flex: 1,
    fontFamily: 'Inter-Italic',
    fontSize: 15,
    color: colors.textSecondary,
    marginLeft: 12,
    lineHeight: 22,
  },
});

export default StressReliefTools;