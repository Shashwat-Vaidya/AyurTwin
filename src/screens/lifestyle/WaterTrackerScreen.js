import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const { width } = Dimensions.get('window');

const WaterTrackerScreen = () => {
  const navigation = useNavigation();

  const [waterIntake, setWaterIntake] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2.5);
  const [cups, setCups] = useState([]);
  const [showAddCup, setShowAddCup] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('ml');
  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(7);

  useEffect(() => {
    loadTodayData();
  }, []);

  const loadTodayData = () => {
    // Mock data
    setWaterIntake(1.8);
    setCups([
      { id: '1', amount: 250, time: '8:30 AM', type: 'water' },
      { id: '2', amount: 250, time: '10:15 AM', type: 'water' },
      { id: '3', amount: 300, time: '12:00 PM', type: 'water' },
      { id: '4', amount: 250, time: '2:30 PM', type: 'water' },
      { id: '5', amount: 250, time: '4:45 PM', type: 'water' },
      { id: '6', amount: 500, time: '7:00 PM', type: 'water' },
    ]);
  };

  const quickAddAmounts = [200, 250, 300, 500];

  const progress = (waterIntake / dailyGoal) * 100;
  const remaining = Math.max(0, dailyGoal - waterIntake);

  const addWater = (amount) => {
    const newCup = {
      id: Date.now().toString(),
      amount,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'water',
    };
    setCups([newCup, ...cups]);
    setWaterIntake(prev => prev + amount / 1000);
    setShowAddCup(false);
  };

  const removeWater = (id, amount) => {
    Alert.alert(
      'Remove Entry',
      'Are you sure you want to remove this water entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setCups(cups.filter(cup => cup.id !== id));
            setWaterIntake(prev => prev - amount / 1000);
          },
        },
      ]
    );
  };

  const handleCustomAdd = () => {
    const amount = parseInt(customAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }
    addWater(amount);
    setCustomAmount('');
    setShowAddCup(false);
  };

  const formatAmount = (amount) => {
    if (selectedUnit === 'ml') {
      return `${amount} ml`;
    } else {
      return `${(amount / 1000).toFixed(1)} L`;
    }
  };

  const getHydrationStatus = () => {
    if (progress >= 100) {
      return {
        message: 'Great job! You\'ve met your daily goal!',
        color: colors.successGreen,
      };
    } else if (progress >= 75) {
      return {
        message: 'Almost there! Keep drinking!',
        color: colors.primaryGreen,
      };
    } else if (progress >= 50) {
      return {
        message: 'Halfway there! Stay hydrated.',
        color: colors.warningYellow,
      };
    } else {
      return {
        message: 'Remember to drink more water',
        color: colors.alertRed,
      };
    }
  };

  const status = getHydrationStatus();

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
          <Text style={styles.headerTitle}>Water Tracker</Text>
          <TouchableOpacity style={styles.statsButton}>
            <Ionicons name="stats-chart" size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* Main Progress Card */}
        <LinearGradient
          colors={[colors.spO2Blue, '#6AB0FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.progressCard}
        >
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Today's Water Intake</Text>
            <TouchableOpacity onPress={() => setShowAddCup(true)}>
              <Ionicons name="add-circle" size={30} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.progressContent}>
            <ProgressChart
              data={[progress / 100]}
              width={150}
              height={150}
              strokeWidth={12}
              radius={60}
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              hideLegend={true}
            />
            <View style={styles.progressInfo}>
              <Text style={styles.waterAmount}>{waterIntake.toFixed(1)}L</Text>
              <Text style={styles.waterGoal}>of {dailyGoal}L</Text>
              <Text style={styles.waterRemaining}>{remaining.toFixed(1)}L remaining</Text>
            </View>
          </View>

          <Text style={[styles.statusText, { color: 'white' }]}>
            {status.message}
          </Text>
        </LinearGradient>

        {/* Quick Add */}
        {!showAddCup && (
          <View style={styles.quickAddContainer}>
            <Text style={styles.sectionTitle}>Quick Add</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {quickAddAmounts.map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={styles.quickAddButton}
                  onPress={() => addWater(amount)}
                >
                  <Text style={styles.quickAddText}>{amount} ml</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.quickAddButton, styles.customButton]}
                onPress={() => setShowAddCup(true)}
              >
                <Ionicons name="add" size={20} color={colors.textPrimary} />
                <Text style={styles.quickAddText}>Custom</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {/* Add Custom Amount */}
        {showAddCup && (
          <Card style={styles.customCard}>
            <Text style={styles.customTitle}>Add Custom Amount</Text>
            
            <View style={styles.unitToggle}>
              <TouchableOpacity
                style={[styles.unitButton, selectedUnit === 'ml' && styles.unitButtonActive]}
                onPress={() => setSelectedUnit('ml')}
              >
                <Text style={[styles.unitText, selectedUnit === 'ml' && styles.unitTextActive]}>ml</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.unitButton, selectedUnit === 'l' && styles.unitButtonActive]}
                onPress={() => setSelectedUnit('l')}
              >
                <Text style={[styles.unitText, selectedUnit === 'l' && styles.unitTextActive]}>L</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.customInput}
              placeholder={`Enter amount in ${selectedUnit}`}
              placeholderTextColor={colors.textTertiary}
              value={customAmount}
              onChangeText={setCustomAmount}
              keyboardType="numeric"
            />

            <View style={styles.customButtons}>
              <Button
                title="Cancel"
                onPress={() => setShowAddCup(false)}
                style={styles.cancelButton}
                outline
                size="small"
              />
              <Button
                title="Add"
                onPress={handleCustomAdd}
                style={styles.addButton}
                gradient
                size="small"
              />
            </View>
          </Card>
        )}

        {/* Today's Log */}
        <Text style={styles.sectionTitle}>Today's Log</Text>
        
        {cups.map((cup) => (
          <Card key={cup.id} style={styles.logCard}>
            <View style={styles.logLeft}>
              <View style={[styles.logIcon, { backgroundColor: `${colors.spO2Blue}20` }]}>
                <Ionicons name="water" size={20} color={colors.spO2Blue} />
              </View>
              <View>
                <Text style={styles.logAmount}>{cup.amount} ml</Text>
                <Text style={styles.logTime}>{cup.time}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => removeWater(cup.id, cup.amount)}>
              <Ionicons name="trash-outline" size={20} color={colors.alertRed} />
            </TouchableOpacity>
          </Card>
        ))}

        {/* Daily Goal Settings */}
        <Card style={styles.goalCard}>
          <Text style={styles.goalTitle}>Daily Goal</Text>
          
          <View style={styles.goalRow}>
            <Text style={styles.goalLabel}>Target</Text>
            <Text style={styles.goalValue}>{dailyGoal} L</Text>
          </View>

          <Slider
            style={styles.goalSlider}
            minimumValue={1}
            maximumValue={5}
            step={0.1}
            value={dailyGoal}
            onValueChange={setDailyGoal}
            minimumTrackTintColor={colors.spO2Blue}
            maximumTrackTintColor="rgba(0,0,0,0.1)"
            thumbTintColor={colors.spO2Blue}
          />

          <View style={styles.goalRow}>
            <Text style={styles.goalLabel}>Recommended</Text>
            <Text style={styles.goalValue}>2.5 L</Text>
          </View>
        </Card>

        {/* Streak & Stats */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Ionicons name="flame" size={24} color={colors.tempOrange} />
            <Text style={styles.statNumber}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </Card>

          <Card style={styles.statCard}>
            <Ionicons name="calendar" size={24} color={colors.primaryGreen} />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </Card>

          <Card style={styles.statCard}>
            <Ionicons name="trophy" size={24} color={colors.warningYellow} />
            <Text style={styles.statNumber}>45</Text>
            <Text style={styles.statLabel}>Total Liters</Text>
          </Card>
        </View>

        {/* Hydration Tips */}
        <Card style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Hydration Tips</Text>
          
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.successGreen} />
            <Text style={styles.tipText}>Drink a glass of water first thing in morning</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.successGreen} />
            <Text style={styles.tipText}>Keep water bottle on your desk</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.successGreen} />
            <Text style={styles.tipText}>Set hourly reminders</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.successGreen} />
            <Text style={styles.tipText}>Add lemon or mint for flavor</Text>
          </View>
        </Card>

        {/* Reminder Settings */}
        <TouchableOpacity style={styles.reminderButton}>
          <Ionicons name="notifications-outline" size={20} color={colors.primarySaffron} />
          <Text style={styles.reminderText}>Set Hydration Reminders</Text>
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
  statsButton: {
    padding: 8,
  },
  progressCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  progressInfo: {
    alignItems: 'center',
  },
  waterAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: 'white',
  },
  waterGoal: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
    marginBottom: 4,
  },
  waterRemaining: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    textAlign: 'center',
  },
  quickAddContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  quickAddButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickAddText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
  },
  customCard: {
    padding: 16,
    marginBottom: 20,
  },
  customTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  unitToggle: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  unitButtonActive: {
    backgroundColor: colors.spO2Blue,
    borderColor: colors.spO2Blue,
  },
  unitText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  unitTextActive: {
    color: 'white',
  },
  customInput: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  customButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    flex: 1,
    marginLeft: 8,
  },
  logCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
  },
  logLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  logTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
  },
  goalCard: {
    padding: 16,
    marginBottom: 16,
  },
  goalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  goalValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  goalSlider: {
    width: '100%',
    height: 40,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 4,
  },
  statNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
  },
  tipsCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(74, 144, 226, 0.05)',
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
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 153, 51, 0.1)',
    borderRadius: 30,
    marginBottom: 10,
  },
  reminderText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.primarySaffron,
    marginLeft: 8,
  },
});

export default WaterTrackerScreen;