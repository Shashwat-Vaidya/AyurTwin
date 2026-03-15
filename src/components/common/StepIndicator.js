import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';

const StepIndicator = ({
  currentStep = 1,
  totalSteps = 8,
  steps = [],
  showLabels = true,
  showNumbers = true,
  size = 'medium',
  activeColor = colors.primarySaffron,
  completedColor = colors.successGreen,
  inactiveColor = 'rgba(0,0,0,0.05)',
  onStepPress,
  direction = 'horizontal',
  style,
}) => {
  
  const getStepSize = () => {
    switch(size) {
      case 'small':
        return {
          indicator: 30,
          icon: 14,
          fontSize: 12,
          lineHeight: 2,
        };
      case 'large':
        return {
          indicator: 50,
          icon: 24,
          fontSize: 16,
          lineHeight: 4,
        };
      default:
        return {
          indicator: 40,
          icon: 20,
          fontSize: 14,
          lineHeight: 3,
        };
    }
  };

  const stepSize = getStepSize();

  const getStepStatus = (index) => {
    const stepNumber = index + 1;
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'active';
    return 'inactive';
  };

  const getStepColor = (status) => {
    switch(status) {
      case 'completed': return completedColor;
      case 'active': return activeColor;
      default: return inactiveColor;
    }
  };

  const getStepIcon = (status) => {
    if (status === 'completed') return 'checkmark';
    return null;
  };

  const renderStep = (step, index) => {
    const status = getStepStatus(index);
    const color = getStepColor(status);
    const icon = getStepIcon(status);
    const stepNumber = index + 1;

    const stepContent = (
      <View style={[
        styles.stepContainer,
        direction === 'vertical' && styles.verticalStep,
      ]}>
        <View style={styles.stepIndicatorWrapper}>
          <View
            style={[
              styles.stepIndicator,
              {
                width: stepSize.indicator,
                height: stepSize.indicator,
                borderRadius: stepSize.indicator / 2,
                backgroundColor: status === 'active' ? 'transparent' : color,
                borderColor: color,
                borderWidth: status === 'active' ? 2 : 0,
              },
            ]}
          >
            {status === 'active' ? (
              <LinearGradient
                colors={[activeColor, `${activeColor}CC`]}
                style={[
                  styles.gradientIndicator,
                  {
                    width: stepSize.indicator - 4,
                    height: stepSize.indicator - 4,
                    borderRadius: (stepSize.indicator - 4) / 2,
                  },
                ]}
              >
                {showNumbers ? (
                  <Text style={[
                    styles.stepNumber,
                    { fontSize: stepSize.fontSize, color: 'white' }
                  ]}>
                    {stepNumber}
                  </Text>
                ) : (
                  <View style={styles.activeDot} />
                )}
              </LinearGradient>
            ) : icon ? (
              <Ionicons 
                name={icon} 
                size={stepSize.icon} 
                color="white" 
              />
            ) : (
              showNumbers && (
                <Text style={[
                  styles.stepNumber,
                  { fontSize: stepSize.fontSize, color: colors.textSecondary }
                ]}>
                  {stepNumber}
                </Text>
              )
            )}
          </View>

          {index < totalSteps - 1 && (
            <View style={[
              styles.stepConnector,
              direction === 'horizontal' ? styles.horizontalConnector : styles.verticalConnector,
              {
                backgroundColor: status === 'completed' ? completedColor : inactiveColor,
                [direction === 'horizontal' ? 'width' : 'height']: stepSize.lineHeight,
                [direction === 'horizontal' ? 'height' : 'width']: stepSize.lineHeight,
              },
            ]} />
          )}
        </View>

        {showLabels && step && (
          <View style={[
            styles.stepLabel,
            direction === 'vertical' && styles.verticalLabel,
          ]}>
            <Text style={[
              styles.stepLabelText,
              { fontSize: stepSize.fontSize - 2 },
              status === 'active' && styles.activeLabel,
              status === 'completed' && styles.completedLabel,
            ]}>
              {step}
            </Text>
          </View>
        )}
      </View>
    );

    if (onStepPress && status !== 'inactive') {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => onStepPress(stepNumber)}
          activeOpacity={0.7}
          style={[
            styles.touchable,
            direction === 'vertical' && styles.verticalTouchable,
          ]}
        >
          {stepContent}
        </TouchableOpacity>
      );
    }

    return (
      <View key={index} style={styles.stepWrapper}>
        {stepContent}
      </View>
    );
  };

  const stepLabels = steps.length === totalSteps 
    ? steps 
    : Array.from({ length: totalSteps }, (_, i) => `Step ${i + 1}`);

  return (
    <View style={[
      styles.container,
      direction === 'horizontal' ? styles.horizontalContainer : styles.verticalContainer,
      style,
    ]}>
      {stepLabels.map((step, index) => renderStep(step, index))}
    </View>
  );
};

export const DotStepIndicator = ({
  currentStep,
  totalSteps,
  size = 8,
  activeColor = colors.primarySaffron,
  inactiveColor = 'rgba(0,0,0,0.1)',
  spacing = 8,
  style,
}) => {
  return (
    <View style={[styles.dotContainer, style]}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              width: index + 1 === currentStep ? size * 2 : size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: index + 1 <= currentStep ? activeColor : inactiveColor,
              marginHorizontal: spacing / 2,
            },
          ]}
        />
      ))}
    </View>
  );
};

export const NumberStepIndicator = ({
  currentStep,
  totalSteps,
  size = 30,
  activeColor = colors.primarySaffron,
  completedColor = colors.successGreen,
  inactiveColor = 'rgba(0,0,0,0.05)',
  showLabels = false,
  labels = [],
  style,
}) => {
  return (
    <View style={[styles.numberContainer, style]}>
      <View style={styles.numberRow}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          
          return (
            <React.Fragment key={index}>
              <View
                style={[
                  styles.numberIndicator,
                  {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: isCompleted 
                      ? completedColor 
                      : isActive 
                        ? activeColor 
                        : inactiveColor,
                  },
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={size * 0.6} color="white" />
                ) : (
                  <Text style={[
                    styles.numberText,
                    { fontSize: size * 0.5, color: isActive ? 'white' : colors.textSecondary }
                  ]}>
                    {stepNumber}
                  </Text>
                )}
              </View>
              {index < totalSteps - 1 && (
                <View style={[
                  styles.numberLine,
                  {
                    height: 2,
                    flex: 1,
                    backgroundColor: stepNumber < currentStep ? completedColor : inactiveColor,
                  },
                ]} />
              )}
            </React.Fragment>
          );
        })}
      </View>
      
      {showLabels && labels.length === totalSteps && (
        <View style={styles.labelsRow}>
          {labels.map((label, index) => (
            <Text key={index} style={[
              styles.labelText,
              { 
                width: `${100 / totalSteps}%`,
                color: index + 1 === currentStep ? activeColor : colors.textSecondary,
              }
            ]}>
              {label}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export const ProgressStepIndicator = ({
  currentStep,
  totalSteps,
  progress,
  color = colors.primarySaffron,
  showPercentage = true,
  style,
}) => {
  const calculatedProgress = progress || (currentStep / totalSteps) * 100;

  return (
    <View style={[styles.progressContainer, style]}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressTitle}>
          Step {currentStep} of {totalSteps}
        </Text>
        {showPercentage && (
          <Text style={styles.progressPercentage}>
            {Math.round(calculatedProgress)}%
          </Text>
        )}
      </View>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill,
            { 
              width: `${calculatedProgress}%`,
              backgroundColor: color,
            }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  verticalContainer: {
    flexDirection: 'column',
  },
  stepWrapper: {
    flex: 1,
  },
  touchable: {
    flex: 1,
  },
  verticalTouchable: {
    width: '100%',
  },
  stepContainer: {
    alignItems: 'center',
  },
  verticalStep: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  stepIndicatorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  gradientIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    fontFamily: 'Inter-SemiBold',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  stepConnector: {
    flex: 1,
  },
  horizontalConnector: {
    height: 2,
    marginHorizontal: 4,
  },
  verticalConnector: {
    width: 2,
    marginVertical: 4,
  },
  stepLabel: {
    marginTop: 8,
  },
  verticalLabel: {
    marginTop: 0,
    marginLeft: 12,
    flex: 1,
  },
  stepLabelText: {
    fontFamily: 'Inter-Regular',
    color: colors.textTertiary,
    textAlign: 'center',
  },
  activeLabel: {
    color: colors.primarySaffron,
    fontFamily: 'Inter-Medium',
  },
  completedLabel: {
    color: colors.successGreen,
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    borderRadius: 4,
  },
  numberContainer: {
    width: '100%',
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontFamily: 'Inter-SemiBold',
  },
  numberLine: {
    flex: 1,
  },
  labelsRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  labelText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  progressPercentage: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.primarySaffron,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default StepIndicator;