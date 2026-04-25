import React, { useState, useEffect } from 'react';
import { submitDinacharya, getTodayDinacharya } from '../../services/api';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const DinacharyaScreen = () => {
  const navigation = useNavigation();

  // State for checklist
  const [checklist, setChecklist] = useState({
    wakeUp: false,
    elimination: false,
    tongueScraping: false,
    oilPulling: false,
    nasalCleaning: false,
    oilMassage: false,
    bath: false,
    meditation: false,
    exercise: false,
    breakfast: false,
    lunch: false,
    dinner: false,
    eveningWalk: false,
    digitalDetox: false,
    earlySleep: false,
  });

  const [selectedDosha, setSelectedDosha] = useState('vata'); // vata, pitta, kapha

  // Get progress percentage
  const getProgress = () => {
    const total = Object.keys(checklist).length;
    const completed = Object.values(checklist).filter(Boolean).length;
    return (completed / total) * 100;
  };

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get current time period
  const getCurrentPeriod = () => {
    const hour = new Date().getHours();
    if (hour < 6) return 'Night (Vata)';
    if (hour < 10) return 'Morning (Kapha)';
    if (hour < 14) return 'Midday (Pitta)';
    if (hour < 18) return 'Afternoon (Vata)';
    if (hour < 22) return 'Evening (Kapha)';
    return 'Night (Pitta)';
  };

  // Get dosha color
  const getDoshaColor = () => {
    switch(selectedDosha) {
      case 'vata': return colors.vata;
      case 'pitta': return colors.pitta;
      case 'kapha': return colors.kapha;
      default: return colors.primarySaffron;
    }
  };

  // Daily routine sections
  const routineSections = [
    {
      title: 'Morning (Brahma Muhurta)',
      time: '4:30 AM - 6:00 AM',
      icon: 'sunny',
      color: colors.warningYellow,
      items: [
        { id: 'wakeUp', label: 'Wake up before sunrise', ayurvedic: 'Ideal for Vata' },
        { id: 'elimination', label: 'Elimination & cleansing', ayurvedic: 'Natural process' },
        { id: 'tongueScraping', label: 'Tongue scraping', ayurvedic: 'Remove Ama (toxins)' },
        { id: 'oilPulling', label: 'Oil pulling', ayurvedic: 'Oral detox' },
      ],
    },
    {
      title: 'Early Morning',
      time: '6:00 AM - 8:00 AM',
      icon: 'cloudy',
      color: colors.primarySaffron,
      items: [
        { id: 'nasalCleaning', label: 'Nasal cleaning (Neti)', ayurvedic: 'Clear sinuses' },
        { id: 'oilMassage', label: 'Abhyanga (self-massage)', ayurvedic: 'Vata balancing' },
        { id: 'bath', label: 'Warm bath', ayurvedic: 'Purification' },
        { id: 'meditation', label: 'Meditation & Pranayama', ayurvedic: 'Mental clarity' },
      ],
    },
    {
      title: 'Morning',
      time: '8:00 AM - 12:00 PM',
      icon: 'fitness',
      color: colors.primaryGreen,
      items: [
        { id: 'exercise', label: 'Exercise (Kapha time)', ayurvedic: 'Best for activity' },
        { id: 'breakfast', label: 'Light breakfast', ayurvedic: 'Not too heavy' },
      ],
    },
    {
      title: 'Midday',
      time: '12:00 PM - 2:00 PM',
      icon: 'sunny',
      color: colors.tempOrange,
      items: [
        { id: 'lunch', label: 'Largest meal (Pitta time)', ayurvedic: 'Digestive fire peak' },
      ],
    },
    {
      title: 'Afternoon',
      time: '2:00 PM - 6:00 PM',
      icon: 'partly-sunny',
      color: colors.stressPurple,
      items: [
        { id: 'work', label: 'Work/Study (Vata time)', ayurvedic: 'Creative period' },
      ],
    },
    {
      title: 'Evening',
      time: '6:00 PM - 10:00 PM',
      icon: 'moon',
      color: colors.sleepIndigo,
      items: [
        { id: 'dinner', label: 'Light dinner (before sunset)', ayurvedic: 'Easy digestion' },
        { id: 'eveningWalk', label: 'Evening walk', ayurvedic: 'Grounding' },
        { id: 'digitalDetox', label: 'Digital detox', ayurvedic: 'Reduce stimulation' },
      ],
    },
    {
      title: 'Night',
      time: '10:00 PM onwards',
      icon: 'bed',
      color: colors.alertRed,
      items: [
        { id: 'earlySleep', label: 'Early to bed', ayurvedic: 'Restorative sleep' },
      ],
    },
  ];

  // Load today's saved checklist from backend
  useEffect(() => { (async () => {
    const r = await getTodayDinacharya();
    if (r.success && r.data?.entry?.tasks) setChecklist(prev => ({ ...prev, ...r.data.entry.tasks }));
  })(); }, []);

  // Persist after every toggle so the health-score engine picks it up
  const handleToggle = async (id) => {
    const next = { ...checklist, [id]: !checklist[id] };
    setChecklist(next);
    await submitDinacharya(next);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Checklist',
      'Are you sure you want to reset your daily routine checklist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: () => {
            const resetState = {};
            Object.keys(checklist).forEach(key => resetState[key] = false);
            setChecklist(resetState);
          },
        },
      ]
    );
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
          <Text style={styles.headerTitle}>Dinacharya</Text>
          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
            <Ionicons name="refresh" size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* Welcome Card */}
        <LinearGradient
          colors={[colors.primarySaffron, colors.primaryGreen]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.welcomeCard}
        >
          <Text style={styles.welcomeGreeting}>{getGreeting()}</Text>
          <Text style={styles.welcomeTitle}>Daily Routine</Text>
          <Text style={styles.welcomeSubtitle}>Follow Ayurvedic wisdom for optimal health</Text>
          
          <View style={styles.currentPeriod}>
            <Ionicons name="time" size={16} color="white" />
            <Text style={styles.currentPeriodText}>Current: {getCurrentPeriod()}</Text>
          </View>
        </LinearGradient>

        {/* Progress Card */}
        <Card style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Today's Progress</Text>
            <Text style={styles.progressPercentage}>{Math.round(getProgress())}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${getProgress()}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {Object.values(checklist).filter(Boolean).length}/{Object.keys(checklist).length} tasks completed
          </Text>
        </Card>

        {/* Dosha Selector */}
        <View style={styles.doshaSelector}>
          <Text style={styles.doshaSelectorLabel}>Customize for your dosha:</Text>
          <View style={styles.doshaButtons}>
            {['vata', 'pitta', 'kapha'].map((dosha) => (
              <TouchableOpacity
                key={dosha}
                style={[
                  styles.doshaButton,
                  selectedDosha === dosha && styles.doshaButtonActive,
                  { borderColor: selectedDosha === dosha ? getDoshaColor() : colors.textTertiary }
                ]}
                onPress={() => setSelectedDosha(dosha)}
              >
                <Text style={[
                  styles.doshaButtonText,
                  selectedDosha === dosha && { color: getDoshaColor() }
                ]}>
                  {dosha.charAt(0).toUpperCase() + dosha.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Routine Sections */}
        {routineSections.map((section, index) => (
          <Card key={index} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: `${section.color}20` }]}>
                <Ionicons name={section.icon} size={24} color={section.color} />
              </View>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionTime}>{section.time}</Text>
              </View>
            </View>

            {section.items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.checklistItem}
                onPress={() => handleToggle(item.id)}
              >
                <View style={[styles.checkbox, checklist[item.id] && styles.checkboxChecked]}>
                  {checklist[item.id] && <Ionicons name="checkmark" size={16} color="white" />}
                </View>
                <View style={styles.checklistContent}>
                  <Text style={[styles.checklistLabel, checklist[item.id] && styles.checklistLabelCompleted]}>
                    {item.label}
                  </Text>
                  <Text style={styles.checklistAyurvedic}>{item.ayurvedic}</Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Ayurvedic Tip */}
            <View style={styles.tipContainer}>
              <Ionicons name="leaf" size={16} color={colors.primaryGreen} />
              <Text style={styles.tipText}>
                {selectedDosha === 'vata' && 'Keep warm and steady during this time'}
                {selectedDosha === 'pitta' && 'Stay cool and avoid skipping meals'}
                {selectedDosha === 'kapha' && 'Stay active and avoid heavy foods'}
              </Text>
            </View>
          </Card>
        ))}

        {/* Wisdom Card */}
        <Card style={styles.wisdomCard}>
          <Ionicons name="leaf" size={30} color={colors.primaryGreen} />
          <Text style={styles.wisdomTitle}>Ayurvedic Wisdom</Text>
          <Text style={styles.wisdomText}>
            "Dinacharya (daily routine) is a powerful Ayurvedic tool to maintain balance. 
            Following nature's rhythms aligns your body's internal clock for optimal health."
          </Text>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Set Reminders"
            onPress={() => Alert.alert('Coming Soon', 'Reminder feature coming soon!')}
            style={styles.reminderButton}
            gradient
            icon="notifications-outline"
          />
          <Button
            title="Learn More"
            onPress={() => {}}
            style={styles.learnButton}
            outline
            icon="book-outline"
          />
        </View>
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
  resetButton: {
    padding: 8,
  },
  welcomeCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
  },
  welcomeGreeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginBottom: 4,
  },
  welcomeTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: 'white',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginBottom: 12,
  },
  currentPeriod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  currentPeriodText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'white',
    marginLeft: 6,
  },
  progressCard: {
    padding: 16,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
  },
  progressPercentage: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.primarySaffron,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primarySaffron,
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'right',
  },
  doshaSelector: {
    marginBottom: 16,
  },
  doshaSelectorLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  doshaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  doshaButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  doshaButtonActive: {
    backgroundColor: 'white',
    borderWidth: 2,
  },
  doshaButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  sectionCard: {
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  sectionTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  checklistItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primarySaffron,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primarySaffron,
  },
  checklistContent: {
    flex: 1,
  },
  checklistLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  checklistLabelCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  checklistAyurvedic: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.primaryGreen,
    fontStyle: 'italic',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  tipText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  wisdomCard: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  wisdomTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  wisdomText: {
    fontFamily: 'Inter-Italic',
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  reminderButton: {
    flex: 1,
    marginRight: 8,
  },
  learnButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default DinacharyaScreen;