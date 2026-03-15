import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../utils/constants/colors';

const ProgressIndicator = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.stepText}>Step {currentStep} of {totalSteps}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.disabled,
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: colors.primarySaffron,
    borderRadius: 2,
  },
  stepText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
  },
});

export default ProgressIndicator;