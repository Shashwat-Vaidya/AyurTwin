import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';

import colors from '../../utils/constants/colors';
import Card from '../common/Card';
import Button from '../common/Button';
import { ProgressCircle } from '../charts/ProgressCircle';

const GoalCard = ({
  goal,
  progress,
  target,
  unit,
  icon,
  color = colors.primarySaffron,
  deadline,
  onUpdate,
  onComplete,
  onEdit,
  editable = true,
  showProgress = true,
  showTarget = true,
  showDeadline = true,
  style,
}) => {
  
  const [showEdit, setShowEdit] = useState(false);
  const [editValue, setEditValue] = useState(target.toString());
  const [editDeadline, setEditDeadline] = useState(deadline || '');

  const percentage = (progress / target) * 100;
  const isCompleted = progress >= target;

  const getDaysRemaining = () => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  const handleUpdate = () => {
    Alert.alert(
      'Update Progress',
      `How much ${goal.toLowerCase()} have you achieved?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: () => {
            const newProgress = prompt('Enter new progress:');
            if (newProgress && onUpdate) {
              onUpdate(parseFloat(newProgress));
            }
          },
        },
      ]
    );
  };

  const handleComplete = () => {
    Alert.alert(
      'Goal Complete! 🎉',
      'Congratulations on achieving your goal!',
      [
        { text: 'Close' },
        {
          text: 'Share',
          onPress: () => console.log('Share achievement'),
        },
      ]
    );
    if (onComplete) onComplete();
  };

  const handleEdit = () => {
    setShowEdit(true);
  };

  const handleSaveEdit = () => {
    const newTarget = parseFloat(editValue);
    if (isNaN(newTarget) || newTarget <= 0) {
      Alert.alert('Invalid Value', 'Please enter a valid target');
      return;
    }
    if (onEdit) {
      onEdit({ target: newTarget, deadline: editDeadline });
    }
    setShowEdit(false);
  };

  return (
    <Card style={[styles.container, style]}>
      {!showEdit ? (
        <>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
              <Ionicons name={icon} size={24} color={color} />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.goalTitle}>{goal}</Text>
              {deadline && showDeadline && (
                <View style={styles.deadlineContainer}>
                  <Ionicons name="calendar" size={12} color={colors.textTertiary} />
                  <Text style={[
                    styles.deadlineText,
                    daysRemaining < 0 && styles.expiredText
                  ]}>
                    {daysRemaining > 0 ? `${daysRemaining} days left` :
                     daysRemaining === 0 ? 'Due today' :
                     'Overdue'}
                  </Text>
                </View>
              )}
            </View>
            {editable && (
              <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
                <Ionicons name="pencil" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Progress */}
          {showProgress && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: color,
                    }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {progress} / {target} {unit}
              </Text>
            </View>
          )}

          {/* Circular Progress Alternative */}
          {showProgress === 'circle' && (
            <View style={styles.circularContainer}>
              <ProgressCircle
                progress={percentage}
                size={80}
                color={color}
              >
                <Text style={styles.circularProgress}>{Math.round(percentage)}%</Text>
              </ProgressCircle>
            </View>
          )}

          {/* Target Info */}
          {showTarget && (
            <View style={styles.targetContainer}>
              <View style={styles.targetItem}>
                <Text style={styles.targetLabel}>Target</Text>
                <Text style={styles.targetValue}>{target} {unit}</Text>
              </View>
              <View style={styles.targetItem}>
                <Text style={styles.targetLabel}>Current</Text>
                <Text style={styles.targetValue}>{progress} {unit}</Text>
              </View>
              <View style={styles.targetItem}>
                <Text style={styles.targetLabel}>Remaining</Text>
                <Text style={[styles.targetValue, { color: color }]}>
                  {Math.max(0, target - progress)} {unit}
                </Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actions}>
            {!isCompleted && (
              <TouchableOpacity 
                style={[styles.updateButton, { backgroundColor: color }]}
                onPress={handleUpdate}
              >
                <Text style={styles.updateButtonText}>Update Progress</Text>
              </TouchableOpacity>
            )}
            
            {isCompleted && (
              <TouchableOpacity 
                style={[styles.completeButton, { backgroundColor: colors.successGreen }]}
                onPress={handleComplete}
              >
                <Ionicons name="checkmark-circle" size={18} color="white" />
                <Text style={styles.completeButtonText}>Goal Achieved!</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      ) : (
        /* Edit Mode */
        <View style={styles.editContainer}>
          <Text style={styles.editTitle}>Edit Goal</Text>
          
          <View style={styles.editField}>
            <Text style={styles.editLabel}>Target ({unit})</Text>
            <TextInput
              style={styles.editInput}
              value={editValue}
              onChangeText={setEditValue}
              keyboardType="numeric"
              placeholder="Enter target"
            />
          </View>

          <View style={styles.editField}>
            <Text style={styles.editLabel}>Deadline</Text>
            <TextInput
              style={styles.editInput}
              value={editDeadline}
              onChangeText={setEditDeadline}
              placeholder="YYYY-MM-DD"
            />
          </View>

          <View style={styles.editButtons}>
            <Button
              title="Cancel"
              onPress={() => setShowEdit(false)}
              style={styles.editCancel}
              outline
              size="small"
            />
            <Button
              title="Save"
              onPress={handleSaveEdit}
              style={styles.editSave}
              gradient
              size="small"
            />
          </View>
        </View>
      )}
    </Card>
  );
};

export const StepGoalCard = ({ steps, goal = 10000, onUpdate }) => {
  const progress = (steps / goal) * 100;

  return (
    <GoalCard
      goal="Daily Steps"
      progress={steps}
      target={goal}
      unit="steps"
      icon="walk"
      color={colors.primaryGreen}
      onUpdate={onUpdate}
      showProgress="circle"
    />
  );
};

export const WaterGoalCard = ({ consumed, goal = 2500, onUpdate }) => {
  return (
    <GoalCard
      goal="Daily Water Intake"
      progress={consumed}
      target={goal}
      unit="ml"
      icon="water"
      color={colors.spO2Blue}
      onUpdate={onUpdate}
    />
  );
};

export const SleepGoalCard = ({ hours, goal = 8, onUpdate }) => {
  return (
    <GoalCard
      goal="Sleep Goal"
      progress={hours}
      target={goal}
      unit="hours"
      icon="moon"
      color={colors.sleepIndigo}
      onUpdate={onUpdate}
      showProgress="circle"
    />
  );
};

export const WeightGoalCard = ({ current, target, startWeight, onUpdate }) => {
  const progress = startWeight ? 
    ((startWeight - current) / (startWeight - target)) * 100 : 
    (current / target) * 100;

  return (
    <GoalCard
      goal="Weight Goal"
      progress={current}
      target={target}
      unit="kg"
      icon="body"
      color={colors.heartRate}
      onUpdate={onUpdate}
      showProgress={false}
    />
  );
};

export const CaloriesGoalCard = ({ consumed, goal = 2000, onUpdate }) => {
  return (
    <GoalCard
      goal="Calorie Intake"
      progress={consumed}
      target={goal}
      unit="kcal"
      icon="flame"
      color={colors.tempOrange}
      onUpdate={onUpdate}
    />
  );
};

export const WorkoutGoalCard = ({ sessions, goal = 5, onUpdate }) => {
  return (
    <GoalCard
      goal="Weekly Workouts"
      progress={sessions}
      target={goal}
      unit="sessions"
      icon="fitness"
      color={colors.stressPurple}
      onUpdate={onUpdate}
    />
  );
};

export const MeditationGoalCard = ({ minutes, goal = 30, onUpdate }) => {
  return (
    <GoalCard
      goal="Daily Meditation"
      progress={minutes}
      target={goal}
      unit="minutes"
      icon="leaf"
      color={colors.primarySaffron}
      onUpdate={onUpdate}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  goalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadlineText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    marginLeft: 4,
  },
  expiredText: {
    color: colors.alertRed,
  },
  editButton: {
    padding: 8,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  circularContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  circularProgress: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  targetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  targetItem: {
    alignItems: 'center',
  },
  targetLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  targetValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  updateButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  updateButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: 'white',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  completeButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: 'white',
    marginLeft: 6,
  },
  editContainer: {
    padding: 8,
  },
  editTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  editField: {
    marginBottom: 16,
  },
  editLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  editInput: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 10,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textPrimary,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  editCancel: {
    flex: 1,
    marginRight: 8,
  },
  editSave: {
    flex: 1,
    marginLeft: 8,
  },
});

export default GoalCard;