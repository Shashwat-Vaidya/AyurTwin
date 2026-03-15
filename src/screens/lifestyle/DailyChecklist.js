import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const DailyChecklist = () => {
  const navigation = useNavigation();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [checklists, setChecklists] = useState({});
  const [streak, setStreak] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);

  // Default checklist items
  const defaultChecklist = [
    {
      id: 'wake_early',
      category: 'morning',
      title: 'Wake up before sunrise',
      icon: 'sunny',
      color: colors.warningYellow,
      benefit: 'Aligns with natural rhythms',
      ayurvedic: 'Brahma muhurta - best for meditation',
    },
    {
      id: 'drink_water',
      category: 'morning',
      title: 'Drink warm water',
      icon: 'water',
      color: colors.spO2Blue,
      benefit: 'Hydrates and cleanses',
      ayurvedic: 'With lemon and honey for digestion',
    },
    {
      id: 'elimination',
      category: 'morning',
      title: 'Elimination',
      icon: 'trash',
      color: colors.textSecondary,
      benefit: 'Natural cleansing',
      ayurvedic: 'Best time is morning',
    },
    {
      id: 'tongue_scraping',
      category: 'morning',
      title: 'Tongue scraping',
      icon: 'remove',
      color: colors.primarySaffron,
      benefit: 'Removes toxins',
      ayurvedic: 'Removes Ama (toxins) from tongue',
    },
    {
      id: 'oil_pulling',
      category: 'morning',
      title: 'Oil pulling',
      icon: 'water',
      color: colors.primaryGreen,
      benefit: 'Oral detox',
      ayurvedic: 'Use coconut or sesame oil',
    },
    {
      id: 'nasya',
      category: 'morning',
      title: 'Nasya (nasal oil)',
      icon: 'medical',
      color: colors.stressPurple,
      benefit: 'Clears sinuses',
      ayurvedic: 'Lubricates nasal passages',
    },
    {
      id: 'abhyanga',
      category: 'morning',
      title: 'Abhyanga (self-massage)',
      icon: 'body',
      color: colors.heartRate,
      benefit: 'Nourishes skin',
      ayurvedic: 'Use warm oil suitable for your dosha',
    },
    {
      id: 'exercise',
      category: 'morning',
      title: 'Exercise',
      icon: 'fitness',
      color: colors.primaryGreen,
      benefit: 'Boosts energy',
      ayurvedic: '30 mins of appropriate exercise',
    },
    {
      id: 'meditation',
      category: 'morning',
      title: 'Meditation',
      icon: 'leaf',
      color: colors.stressPurple,
      benefit: 'Mental clarity',
      ayurvedic: '10-20 minutes of mindfulness',
    },
    {
      id: 'breakfast',
      category: 'morning',
      title: 'Healthy breakfast',
      icon: 'restaurant',
      color: colors.warningYellow,
      benefit: 'Fuel for the day',
      ayurvedic: 'Warm, cooked breakfast',
    },
    {
      id: 'lunch',
      category: 'afternoon',
      title: 'Largest meal at noon',
      icon: 'sunny',
      color: colors.tempOrange,
      benefit: 'When digestion is strongest',
      ayurvedic: 'Pitta time - best for digestion',
    },
    {
      id: 'walk',
      category: 'afternoon',
      title: 'Afternoon walk',
      icon: 'walk',
      color: colors.primaryGreen,
      benefit: 'Prevent afternoon slump',
      ayurvedic: 'Short walk after lunch',
    },
    {
      id: 'work_break',
      category: 'afternoon',
      title: 'Take breaks',
      icon: 'time',
      color: colors.textSecondary,
      benefit: 'Prevent fatigue',
      ayurvedic: '5 min break every hour',
    },
    {
      id: 'dinner',
      category: 'evening',
      title: 'Light dinner',
      icon: 'moon',
      color: colors.sleepIndigo,
      benefit: 'Easy digestion',
      ayurvedic: 'Before sunset if possible',
    },
    {
      id: 'evening_walk',
      category: 'evening',
      title: 'Evening walk',
      icon: 'walk',
      color: colors.stressPurple,
      benefit: 'Grounding',
      ayurvedic: 'Slow, mindful walk',
    },
    {
      id: 'digital_detox',
      category: 'evening',
      title: 'Digital detox',
      icon: 'phone-portrait',
      color: colors.alertRed,
      benefit: 'Better sleep',
      ayurvedic: 'No screens 1 hour before bed',
    },
    {
      id: 'journal',
      category: 'evening',
      title: 'Gratitude journal',
      icon: 'journal',
      color: colors.primarySaffron,
      benefit: 'Mental wellbeing',
      ayurvedic: 'Reflect on the day',
    },
    {
      id: 'early_sleep',
      category: 'night',
      title: 'Early to bed',
      icon: 'bed',
      color: colors.sleepIndigo,
      benefit: 'Restorative sleep',
      ayurvedic: 'Before 10 PM is ideal',
    },
  ];

  const categories = [
    { id: 'morning', name: 'Morning', icon: 'sunny', color: colors.warningYellow },
    { id: 'afternoon', name: 'Afternoon', icon: 'partly-sunny', color: colors.tempOrange },
    { id: 'evening', name: 'Evening', icon: 'moon', color: colors.sleepIndigo },
    { id: 'night', name: 'Night', icon: 'bed', color: colors.stressPurple },
  ];

  useEffect(() => {
    loadChecklist();
  }, [selectedDate]);

  const loadChecklist = async () => {
    try {
      const dateKey = selectedDate.toDateString();
      const saved = await AsyncStorage.getItem(`checklist_${dateKey}`);
      
      if (saved) {
        setChecklists(JSON.parse(saved));
      } else {
        // Initialize with all unchecked
        const initial = {};
        defaultChecklist.forEach(item => {
          initial[item.id] = false;
        });
        setChecklists(initial);
      }
      
      // Load streak
      const streakValue = await AsyncStorage.getItem('checklist_streak');
      if (streakValue) {
        setStreak(parseInt(streakValue));
      }
    } catch (error) {
      console.error('Failed to load checklist', error);
    }
  };

  const saveChecklist = async (updated) => {
    try {
      const dateKey = selectedDate.toDateString();
      await AsyncStorage.setItem(`checklist_${dateKey}`, JSON.stringify(updated));
      
      // Calculate completed count
      const completed = Object.values(updated).filter(v => v).length;
      setTotalCompleted(completed);
      
      // Update streak if all completed
      if (completed === defaultChecklist.length) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        await AsyncStorage.setItem('checklist_streak', newStreak.toString());
        
        Alert.alert(
          '🎉 Amazing!',
          `You've completed your entire daily routine! Streak: ${newStreak} days`,
          [{ text: 'Great!' }]
        );
      }
    } catch (error) {
      console.error('Failed to save checklist', error);
    }
  };

  const toggleItem = (itemId) => {
    const updated = { ...checklists, [itemId]: !checklists[itemId] };
    setChecklists(updated);
    saveChecklist(updated);
  };

  const resetChecklist = () => {
    Alert.alert(
      'Reset Checklist',
      'Are you sure you want to reset all items?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            const reset = {};
            defaultChecklist.forEach(item => {
              reset[item.id] = false;
            });
            setChecklists(reset);
            saveChecklist(reset);
          },
        },
      ]
    );
  };

  const shareProgress = async () => {
    const completed = Object.values(checklists).filter(v => v).length;
    const total = defaultChecklist.length;
    const percentage = Math.round((completed / total) * 100);
    
    try {
      await Share.share({
        message: `I've completed ${completed}/${total} (${percentage}%) of my Ayurvedic daily routine today! 🌿\n\nTrack your own wellness with AyurTwin app.`,
        title: 'My Daily Routine Progress',
      });
    } catch (error) {
      console.error('Share failed', error);
    }
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const completedCount = Object.values(checklists).filter(v => v).length;
  const totalItems = defaultChecklist.length;
  const progressPercentage = (completedCount / totalItems) * 100;

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
          <Text style={styles.headerTitle}>Daily Routine</Text>
          <TouchableOpacity onPress={shareProgress} style={styles.shareButton}>
            <Ionicons name="share-social" size={22} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* Streak Card */}
        <LinearGradient
          colors={[colors.primarySaffron, colors.primaryGreen]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.streakCard}
        >
          <View style={styles.streakLeft}>
            <Ionicons name="flame" size={30} color="white" />
            <View>
              <Text style={styles.streakLabel}>Current Streak</Text>
              <Text style={styles.streakValue}>{streak} days</Text>
            </View>
          </View>
          <View style={styles.streakRight}>
            <Text style={styles.streakGoal}>Goal: 30 days</Text>
          </View>
        </LinearGradient>

        {/* Date Navigator */}
        <View style={styles.dateNavigator}>
          <TouchableOpacity onPress={() => changeDate(-1)} style={styles.dateArrow}>
            <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <View style={styles.dateContainer}>
            <Ionicons name="calendar" size={18} color={colors.primarySaffron} />
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          </View>
          
          <TouchableOpacity 
            onPress={() => changeDate(1)} 
            style={styles.dateArrow}
            disabled={selectedDate > new Date()}
          >
            <Ionicons 
              name="chevron-forward" 
              size={22} 
              color={selectedDate > new Date() ? colors.disabled : colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        {/* Progress Card */}
        <Card style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Today's Progress</Text>
            <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
          </View>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${progressPercentage}%` }
              ]} 
            />
          </View>
          
          <Text style={styles.progressText}>
            {completedCount}/{totalItems} tasks completed
          </Text>

          <TouchableOpacity onPress={resetChecklist} style={styles.resetButton}>
            <Ionicons name="refresh" size={16} color={colors.textTertiary} />
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </Card>

        {/* Checklist Categories */}
        {categories.map((category) => {
          const categoryItems = defaultChecklist.filter(item => item.category === category.id);
          const categoryCompleted = categoryItems.filter(item => checklists[item.id]).length;
          const categoryTotal = categoryItems.length;
          
          if (categoryItems.length === 0) return null;

          return (
            <View key={category.id} style={styles.categoryContainer}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryTitleContainer}>
                  <Ionicons name={category.icon} size={20} color={category.color} />
                  <Text style={styles.categoryTitle}>{category.name}</Text>
                </View>
                <Text style={styles.categoryCount}>
                  {categoryCompleted}/{categoryTotal}
                </Text>
              </View>

              {categoryItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.checklistItem}
                  onPress={() => toggleItem(item.id)}
                >
                  <View style={[styles.checkbox, checklists[item.id] && styles.checkboxChecked]}>
                    {checklists[item.id] && <Ionicons name="checkmark" size={16} color="white" />}
                  </View>
                  
                  <View style={styles.itemContent}>
                    <View style={styles.itemHeader}>
                      <Ionicons name={item.icon} size={18} color={item.color} />
                      <Text style={[
                        styles.itemTitle,
                        checklists[item.id] && styles.itemTitleCompleted
                      ]}>
                        {item.title}
                      </Text>
                    </View>
                    
                    <View style={styles.itemDetails}>
                      <View style={styles.itemBenefit}>
                        <Ionicons name="leaf" size={12} color={colors.primaryGreen} />
                        <Text style={styles.itemBenefitText}>{item.benefit}</Text>
                      </View>
                      <Text style={styles.itemAyurvedic}>{item.ayurvedic}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}

        {/* Wisdom Card */}
        <Card style={styles.wisdomCard}>
          <Ionicons name="leaf" size={30} color={colors.primaryGreen} />
          <Text style={styles.wisdomTitle}>Ayurvedic Wisdom</Text>
          <Text style={styles.wisdomText}>
            "Dinacharya (daily routine) is the foundation of health. 
            Consistency in daily practices creates balance in body and mind."
          </Text>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Set Reminders"
            onPress={() => {}}
            style={styles.reminderButton}
            outline
            icon="notifications"
          />
          <Button
            title="View History"
            onPress={() => {}}
            style={styles.historyButton}
            outline
            icon="time"
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
  shareButton: {
    padding: 8,
  },
  streakCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'white',
    opacity: 0.9,
    marginLeft: 8,
  },
  streakValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: 'white',
    marginLeft: 8,
  },
  streakRight: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  streakGoal: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: 'white',
  },
  dateNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateArrow: {
    padding: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  dateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 6,
  },
  progressCard: {
    padding: 16,
    marginBottom: 20,
    position: 'relative',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
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
    fontSize: 13,
    color: colors.textSecondary,
  },
  resetButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginLeft: 4,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 6,
  },
  categoryCount: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  checklistItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
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
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  itemTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  itemDetails: {
    marginLeft: 26,
  },
  itemBenefit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemBenefitText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.primaryGreen,
    marginLeft: 4,
  },
  itemAyurvedic: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    fontStyle: 'italic',
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
  historyButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default DailyChecklist;