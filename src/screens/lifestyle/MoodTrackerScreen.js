import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const { width } = Dimensions.get('window');

const MoodTrackerScreen = () => {
  const navigation = useNavigation();

  const [selectedMood, setSelectedMood] = useState(null);
  const [moodNote, setMoodNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [moodHistory, setMoodHistory] = useState([]);

  const moods = [
    { id: 1, emoji: '😊', label: 'Great', color: colors.successGreen, value: 5 },
    { id: 2, emoji: '🙂', label: 'Good', color: colors.primaryGreen, value: 4 },
    { id: 3, emoji: '😐', label: 'Okay', color: colors.warningYellow, value: 3 },
    { id: 4, emoji: '😔', label: 'Sad', color: colors.tempOrange, value: 2 },
    { id: 5, emoji: '😫', label: 'Stressed', color: colors.stressPurple, value: 2 },
    { id: 6, emoji: '😤', label: 'Angry', color: colors.alertRed, value: 1 },
    { id: 7, emoji: '😴', label: 'Tired', color: colors.sleepIndigo, value: 2 },
    { id: 8, emoji: '😰', label: 'Anxious', color: colors.heartRate, value: 1 },
  ];

  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [4, 3, 5, 4, 3, 4, 5],
    }],
  };

  const monthlyData = {
    labels: ['W1', 'W2', 'W3', 'W4'],
    datasets: [{
      data: [4.2, 3.8, 4.5, 4.0],
    }],
  };

  const chartData = selectedPeriod === 'week' ? weeklyData : monthlyData;

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setShowNoteInput(true);
  };

  const handleSaveMood = () => {
    const newEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      note: moodNote,
      timestamp: new Date().toISOString(),
    };
    setMoodHistory([newEntry, ...moodHistory]);
    setSelectedMood(null);
    setMoodNote('');
    setShowNoteInput(false);
  };

  const getAverageMood = () => {
    if (moodHistory.length === 0) return 'No data';
    const sum = moodHistory.reduce((acc, entry) => acc + entry.mood.value, 0);
    const avg = sum / moodHistory.length;
    return avg.toFixed(1);
  };

  const getMoodColor = (value) => {
    if (value >= 4) return colors.successGreen;
    if (value >= 3) return colors.warningYellow;
    return colors.alertRed;
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
          <Text style={styles.headerTitle}>Mood Tracker</Text>
          <TouchableOpacity style={styles.historyButton}>
            <Ionicons name="calendar" size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* How are you feeling today? */}
        <LinearGradient
          colors={[colors.stressPurple, colors.sleepIndigo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.questionCard}
        >
          <Text style={styles.questionTitle}>How are you feeling today?</Text>
          <Text style={styles.questionSubtitle}>Select your mood to track</Text>
        </LinearGradient>

        {/* Mood Selection Grid */}
        <View style={styles.moodGrid}>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodItem,
                selectedMood?.id === mood.id && { borderColor: mood.color, borderWidth: 2 }
              ]}
              onPress={() => handleMoodSelect(mood)}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={styles.moodLabel}>{mood.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Note Input */}
        {showNoteInput && selectedMood && (
          <Card style={styles.noteCard}>
            <Text style={styles.noteTitle}>Add a note (optional)</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="What's on your mind?"
              placeholderTextColor={colors.textTertiary}
              value={moodNote}
              onChangeText={setMoodNote}
              multiline
              numberOfLines={3}
            />
            <View style={styles.noteButtons}>
              <Button
                title="Cancel"
                onPress={() => {
                  setShowNoteInput(false);
                  setSelectedMood(null);
                  setMoodNote('');
                }}
                style={styles.noteCancelButton}
                outline
                size="small"
              />
              <Button
                title="Save"
                onPress={handleSaveMood}
                style={styles.noteSaveButton}
                gradient
                size="small"
              />
            </View>
          </Card>
        )}

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{moodHistory.length}</Text>
            <Text style={styles.statLabel}>Entries</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{getAverageMood()}</Text>
            <Text style={styles.statLabel}>Average</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>7</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </Card>
        </View>

        {/* Chart Period Selector */}
        <View style={styles.periodContainer}>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'week' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('week')}
          >
            <Text style={[styles.periodText, selectedPeriod === 'week' && styles.periodTextActive]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'month' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('month')}
          >
            <Text style={[styles.periodText, selectedPeriod === 'month' && styles.periodTextActive]}>
              Month
            </Text>
          </TouchableOpacity>
        </View>

        {/* Mood Chart */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Mood Trends</Text>
          <LineChart
            data={chartData}
            width={width - 70}
            height={200}
            chartConfig={{
              backgroundColor: 'white',
              backgroundGradientFrom: 'white',
              backgroundGradientTo: 'white',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(155, 107, 158, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(90, 107, 122, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: { r: '4', strokeWidth: '2', stroke: colors.stressPurple },
            }}
            bezier
            style={styles.chart}
            formatYLabel={(value) => value}
          />
        </Card>

        {/* Recent Entries */}
        <Text style={styles.sectionTitle}>Recent Entries</Text>
        
        {moodHistory.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="heart-outline" size={50} color={colors.textTertiary} />
            <Text style={styles.emptyText}>No mood entries yet</Text>
            <Text style={styles.emptySubtext}>Track your mood to see patterns</Text>
          </Card>
        ) : (
          moodHistory.slice(0, 5).map((entry) => (
            <Card key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryEmoji}>{entry.mood.emoji}</Text>
                <View style={styles.entryInfo}>
                  <Text style={styles.entryMood}>{entry.mood.label}</Text>
                  <Text style={styles.entryTime}>
                    {new Date(entry.timestamp).toLocaleDateString()} at{' '}
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
              {entry.note && (
                <Text style={styles.entryNote}>"{entry.note}"</Text>
              )}
            </Card>
          ))
        )}

        {/* Tips for Mental Wellness */}
        <Card style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Tips for Mental Wellness</Text>
          
          <View style={styles.tipItem}>
            <Ionicons name="leaf" size={18} color={colors.primaryGreen} />
            <Text style={styles.tipText}>Practice mindfulness for 5 minutes daily</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="fitness" size={18} color={colors.heartRate} />
            <Text style={styles.tipText}>Exercise regularly to boost mood</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="moon" size={18} color={colors.sleepIndigo} />
            <Text style={styles.tipText}>Maintain consistent sleep schedule</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="people" size={18} color={colors.spO2Blue} />
            <Text style={styles.tipText}>Connect with friends and family</Text>
          </View>
        </Card>

        {/* Journal Button */}
        <TouchableOpacity style={styles.journalButton}>
          <Ionicons name="book" size={20} color={colors.primarySaffron} />
          <Text style={styles.journalText}>Open Journal</Text>
        </TouchableOpacity>
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
  questionCard: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  questionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: 'white',
    marginBottom: 8,
  },
  questionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: 'white',
    opacity: 0.9,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  moodItem: {
    width: '23%',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    backgroundColor: 'white',
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  moodLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: colors.textSecondary,
  },
  noteCard: {
    padding: 16,
    marginBottom: 20,
  },
  noteTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textPrimary,
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  noteButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noteCancelButton: {
    flex: 1,
    marginRight: 8,
  },
  noteSaveButton: {
    flex: 1,
    marginLeft: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 4,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
  },
  periodContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: colors.stressPurple,
    borderColor: colors.stressPurple,
  },
  periodText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  periodTextActive: {
    color: 'white',
  },
  chartCard: {
    padding: 16,
    marginBottom: 20,
  },
  chartTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  chart: {
    borderRadius: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textTertiary,
  },
  entryCard: {
    padding: 16,
    marginBottom: 8,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  entryInfo: {
    flex: 1,
  },
  entryMood: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  entryTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
  },
  entryNote: {
    fontFamily: 'Inter-Italic',
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 40,
    lineHeight: 18,
  },
  tipsCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(155, 107, 158, 0.05)',
  },
  tipsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  journalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 153, 51, 0.1)',
    borderRadius: 30,
    marginBottom: 10,
  },
  journalText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.primarySaffron,
    marginLeft: 8,
  },
});

export default MoodTrackerScreen;