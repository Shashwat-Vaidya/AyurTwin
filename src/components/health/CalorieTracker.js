import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressChart } from 'react-native-chart-kit';

import colors from '../../utils/constants/colors';
import Card from '../common/Card';
import Button from '../common/Button';

const CalorieTracker = ({
  consumed = 0,
  target = 2000,
  meals = [],
  onAddMeal,
  onEditMeal,
  onDeleteMeal,
  onSetTarget,
  showAddMeal = true,
  showChart = true,
  showMeals = true,
  showSummary = true,
  style,
}) => {
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMeal, setNewMeal] = useState({ name: '', calories: '', time: '' });
  const [editingTarget, setEditingTarget] = useState(false);
  const [newTarget, setNewTarget] = useState(target.toString());

  const remaining = target - consumed;
  const progress = (consumed / target) * 100;
  const progressColor = progress > 100 ? colors.alertRed : progress > 80 ? colors.warningYellow : colors.successGreen;

  const getProgressChartData = () => {
    return {
      data: [consumed / target]
    };
  };

  const handleAddMeal = () => {
    if (newMeal.name && newMeal.calories) {
      onAddMeal?.({
        ...newMeal,
        calories: parseInt(newMeal.calories),
        id: Date.now().toString(),
      });
      setNewMeal({ name: '', calories: '', time: '' });
      setShowAddForm(false);
    }
  };

  const handleSetTarget = () => {
    const targetNum = parseInt(newTarget);
    if (targetNum > 0) {
      onSetTarget?.(targetNum);
      setEditingTarget(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Ionicons name="flame" size={24} color={colors.tempOrange} />
        <Text style={styles.headerTitle}>Calorie Tracker</Text>
      </View>
      
      {showAddMeal && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(true)}
        >
          <Ionicons name="add-circle" size={24} color={colors.primarySaffron} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderTargetEditor = () => (
    <View style={styles.targetEditor}>
      <Text style={styles.targetLabel}>Daily Target:</Text>
      {editingTarget ? (
        <View style={styles.targetInputContainer}>
          <TextInput
            style={styles.targetInput}
            value={newTarget}
            onChangeText={setNewTarget}
            keyboardType="numeric"
            placeholder="2000"
          />
          <TouchableOpacity onPress={handleSetTarget} style={styles.targetSaveButton}>
            <Ionicons name="checkmark" size={18} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setEditingTarget(false)} style={styles.targetCancelButton}>
            <Ionicons name="close" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setEditingTarget(true)} style={styles.targetDisplay}>
          <Text style={styles.targetValue}>{target}</Text>
          <Text style={styles.targetUnit}>kcal</Text>
          <Ionicons name="pencil" size={16} color={colors.textSecondary} style={styles.targetEditIcon} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSummary = () => (
    <LinearGradient
      colors={[colors.primarySaffron, colors.primaryGreen]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.summaryCard}
    >
      <View style={styles.summaryContent}>
        <View style={styles.consumedContainer}>
          <Text style={styles.consumedLabel}>Consumed</Text>
          <Text style={styles.consumedValue}>{consumed}</Text>
          <Text style={styles.consumedUnit}>kcal</Text>
        </View>

        <View style={styles.remainingContainer}>
          <Text style={styles.remainingLabel}>Remaining</Text>
          <Text style={[
            styles.remainingValue,
            { color: remaining < 0 ? colors.alertRed : 'white' }
          ]}>
            {remaining}
          </Text>
          <Text style={styles.remainingUnit}>kcal</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: 'white',
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{Math.round(progress)}% of daily target</Text>
      </View>
    </LinearGradient>
  );

  const renderChart = () => (
    <Card style={styles.chartCard}>
      <Text style={styles.chartTitle}>Calorie Breakdown</Text>
      <View style={styles.chartContainer}>
        <ProgressChart
          data={getProgressChartData()}
          width={150}
          height={150}
          strokeWidth={16}
          radius={60}
          chartConfig={{
            backgroundColor: 'white',
            backgroundGradientFrom: 'white',
            backgroundGradientTo: 'white',
            color: (opacity = 1) => progressColor,
          }}
          hideLegend={true}
        />
        <View style={styles.chartInfo}>
          <Text style={styles.chartInfoLabel}>Remaining</Text>
          <Text style={styles.chartInfoValue}>{remaining}</Text>
          <Text style={styles.chartInfoUnit}>kcal</Text>
        </View>
      </View>
    </Card>
  );

  const renderAddMealForm = () => (
    <Card style={styles.addFormCard}>
      <Text style={styles.addFormTitle}>Add Meal</Text>
      
      <View style={styles.formField}>
        <Text style={styles.formLabel}>Meal Name</Text>
        <TextInput
          style={styles.formInput}
          value={newMeal.name}
          onChangeText={(text) => setNewMeal({ ...newMeal, name: text })}
          placeholder="e.g., Breakfast"
          placeholderTextColor={colors.textTertiary}
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.formLabel}>Calories</Text>
        <TextInput
          style={styles.formInput}
          value={newMeal.calories}
          onChangeText={(text) => setNewMeal({ ...newMeal, calories: text })}
          placeholder="e.g., 500"
          keyboardType="numeric"
          placeholderTextColor={colors.textTertiary}
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.formLabel}>Time (optional)</Text>
        <TextInput
          style={styles.formInput}
          value={newMeal.time}
          onChangeText={(text) => setNewMeal({ ...newMeal, time: text })}
          placeholder="e.g., 8:00 AM"
          placeholderTextColor={colors.textTertiary}
        />
      </View>

      <View style={styles.formButtons}>
        <Button
          title="Cancel"
          onPress={() => setShowAddForm(false)}
          style={styles.formCancelButton}
          outline
          size="small"
        />
        <Button
          title="Add Meal"
          onPress={handleAddMeal}
          style={styles.formAddButton}
          gradient
          size="small"
          disabled={!newMeal.name || !newMeal.calories}
        />
      </View>
    </Card>
  );

  const renderMeals = () => (
    <View style={styles.mealsContainer}>
      <Text style={styles.mealsTitle}>Today's Meals</Text>
      
      {meals.length === 0 ? (
        <Text style={styles.noMealsText}>No meals logged yet</Text>
      ) : (
        meals.map((meal) => (
          <Card key={meal.id} style={styles.mealCard}>
            <View style={styles.mealInfo}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealName}>{meal.name}</Text>
                {meal.time && <Text style={styles.mealTime}>{meal.time}</Text>}
              </View>
              <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
            </View>
            
            <View style={styles.mealActions}>
              <TouchableOpacity onPress={() => onEditMeal?.(meal)} style={styles.mealAction}>
                <Ionicons name="pencil" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onDeleteMeal?.(meal.id)} style={styles.mealAction}>
                <Ionicons name="trash" size={18} color={colors.alertRed} />
              </TouchableOpacity>
            </View>
          </Card>
        ))
      )}
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      {renderHeader()}
      {renderTargetEditor()}
      
      {showSummary && renderSummary()}
      
      <View style={styles.content}>
        {showChart && renderChart()}
        
        {showAddMeal && showAddForm && renderAddMealForm()}
        
        {showMeals && renderMeals()}
      </View>
    </View>
  );
};

export const SimpleCalorieTracker = ({ consumed, target, onAddMeal }) => {
  const [meals, setMeals] = useState([]);

  const handleAddMeal = (meal) => {
    setMeals([...meals, meal]);
    onAddMeal?.(meal);
  };

  return (
    <CalorieTracker
      consumed={consumed}
      target={target}
      meals={meals}
      onAddMeal={handleAddMeal}
      showChart={false}
      showSummary={true}
      showMeals={true}
    />
  );
};

export const MacroTracker = ({ carbs, protein, fat, target }) => {
  const macros = [
    { label: 'Carbs', value: carbs, target: target?.carbs || 250, color: colors.primaryGreen },
    { label: 'Protein', value: protein, target: target?.protein || 150, color: colors.heartRate },
    { label: 'Fat', value: fat, target: target?.fat || 65, color: colors.warningYellow },
  ];

  return (
    <Card style={styles.macroContainer}>
      <Text style={styles.macroTitle}>Macronutrients</Text>
      
      {macros.map((macro, index) => {
        const percentage = (macro.value / macro.target) * 100;
        
        return (
          <View key={index} style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <Text style={styles.macroLabel}>{macro.label}</Text>
              <Text style={styles.macroValues}>
                {macro.value}g / {macro.target}g
              </Text>
            </View>
            <View style={styles.macroBar}>
              <View
                style={[
                  styles.macroFill,
                  {
                    width: `${Math.min(percentage, 100)}%`,
                    backgroundColor: macro.color,
                  },
                ]}
              />
            </View>
          </View>
        );
      })}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  addButton: {
    padding: 4,
  },
  targetEditor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  targetLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  targetDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  targetValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.textPrimary,
  },
  targetUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginLeft: 4,
  },
  targetEditIcon: {
    marginLeft: 8,
  },
  targetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  targetInput: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 80,
    textAlign: 'right',
    marginRight: 8,
  },
  targetSaveButton: {
    backgroundColor: colors.successGreen,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  targetCancelButton: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  consumedContainer: {
    alignItems: 'center',
  },
  consumedLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: 'white',
    opacity: 0.8,
    marginBottom: 4,
  },
  consumedValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: 'white',
  },
  consumedUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'white',
    opacity: 0.7,
  },
  remainingContainer: {
    alignItems: 'center',
  },
  remainingLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: 'white',
    opacity: 0.8,
    marginBottom: 4,
  },
  remainingValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: 'white',
  },
  remainingUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'white',
    opacity: 0.7,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'white',
    opacity: 0.8,
  },
  chartCard: {
    padding: 16,
    marginBottom: 16,
  },
  chartTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  chartInfo: {
    alignItems: 'center',
  },
  chartInfoLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textTertiary,
    marginBottom: 4,
  },
  chartInfoValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.textPrimary,
  },
  chartInfoUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  addFormCard: {
    padding: 16,
    marginBottom: 16,
  },
  addFormTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  formField: {
    marginBottom: 12,
  },
  formLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  formInput: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textPrimary,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  formCancelButton: {
    flex: 1,
    marginRight: 8,
  },
  formAddButton: {
    flex: 1,
    marginLeft: 8,
  },
  mealsContainer: {
    marginTop: 8,
  },
  mealsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  noMealsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingVertical: 20,
  },
  mealCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
  },
  mealInfo: {
    flex: 1,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  mealName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginRight: 8,
  },
  mealTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
  },
  mealCalories: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primarySaffron,
  },
  mealActions: {
    flexDirection: 'row',
  },
  mealAction: {
    padding: 8,
  },
  macroContainer: {
    padding: 16,
    marginTop: 16,
  },
  macroTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  macroItem: {
    marginBottom: 12,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  macroLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  macroValues: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textTertiary,
  },
  macroBar: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  macroFill: {
    height: '100%',
    borderRadius: 3,
  },
});

export default CalorieTracker;