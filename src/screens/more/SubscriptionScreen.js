import React, { useState } from 'react';
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

const SubscriptionScreen = () => {
  const navigation = useNavigation();

  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = {
    monthly: {
      id: 'monthly',
      name: 'Monthly',
      price: 9.99,
      period: 'month',
      savings: null,
    },
    yearly: {
      id: 'yearly',
      name: 'Yearly',
      price: 89.99,
      period: 'year',
      savings: 'Save 25%',
    },
    lifetime: {
      id: 'lifetime',
      name: 'Lifetime',
      price: 199.99,
      period: 'one-time',
      savings: 'Best value',
    },
  };

  const features = [
    {
      icon: 'analytics',
      title: 'Advanced Health Analytics',
      description: 'Detailed insights and trends for all your health metrics',
      included: true,
    },
    {
      icon: 'alert',
      title: 'AI Disease Predictions',
      description: 'Early warnings for 10+ health conditions',
      included: true,
    },
    {
      icon: 'leaf',
      title: 'Personalized Ayurvedic Guidance',
      description: 'Custom recommendations based on your dosha',
      included: true,
    },
    {
      icon: 'document-text',
      title: 'Comprehensive Reports',
      description: 'Weekly and monthly health summaries',
      included: true,
    },
    {
      icon: 'cloud',
      title: 'Unlimited Cloud Storage',
      description: 'Store all your health data securely',
      included: true,
    },
    {
      icon: 'people',
      title: 'Family Sharing',
      description: 'Share with up to 5 family members',
      included: selectedPlan === 'lifetime',
    },
    {
      icon: 'chatbubbles',
      title: 'Priority Support',
      description: '24/7 priority customer support',
      included: selectedPlan !== 'monthly',
    },
    {
      icon: 'fitness',
      title: 'Personal Health Coach',
      description: '1-on-1 coaching sessions',
      included: selectedPlan === 'lifetime',
    },
  ];

  const handleSubscribe = () => {
    Alert.alert(
      'Confirm Subscription',
      `You are about to subscribe to the ${plans[selectedPlan].name} plan for $${plans[selectedPlan].price} per ${plans[selectedPlan].period}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Subscribe',
          onPress: () => {
            Alert.alert('Success', 'Subscription successful! Thank you for choosing AyurTwin.');
          },
        },
      ]
    );
  };

  const handleRestore = () => {
    Alert.alert('Restore', 'Restoring purchases...');
  };

  const handleTerms = () => {
    navigation.navigate(ROUTES.TERMS);
  };

  const handlePrivacy = () => {
    navigation.navigate(ROUTES.PRIVACY_POLICY);
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
          <Text style={styles.headerTitle}>Subscription</Text>
          <TouchableOpacity onPress={handleRestore} style={styles.restoreButton}>
            <Text style={styles.restoreText}>Restore</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <LinearGradient
          colors={[colors.primarySaffron, colors.primaryGreen]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Ionicons name="leaf" size={60} color="white" />
          <Text style={styles.heroTitle}>AyurTwin Premium</Text>
          <Text style={styles.heroSubtitle}>
            Unlock the full potential of your health journey
          </Text>
        </LinearGradient>

        {/* Plan Selector */}
        <View style={styles.planSelector}>
          <TouchableOpacity
            style={[
              styles.planOption,
              selectedPlan === 'monthly' && styles.planOptionActive,
            ]}
            onPress={() => setSelectedPlan('monthly')}
          >
            <Text style={[
              styles.planName,
              selectedPlan === 'monthly' && styles.planNameActive,
            ]}>Monthly</Text>
            <Text style={[
              styles.planPrice,
              selectedPlan === 'monthly' && styles.planPriceActive,
            ]}>$9.99</Text>
            <Text style={[
              styles.planPeriod,
              selectedPlan === 'monthly' && styles.planPeriodActive,
            ]}>per month</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.planOption,
              selectedPlan === 'yearly' && styles.planOptionActive,
            ]}
            onPress={() => setSelectedPlan('yearly')}
          >
            <View style={styles.savingsBadge}>
              <Text style={styles.savingsText}>Save 25%</Text>
            </View>
            <Text style={[
              styles.planName,
              selectedPlan === 'yearly' && styles.planNameActive,
            ]}>Yearly</Text>
            <Text style={[
              styles.planPrice,
              selectedPlan === 'yearly' && styles.planPriceActive,
            ]}>$89.99</Text>
            <Text style={[
              styles.planPeriod,
              selectedPlan === 'yearly' && styles.planPeriodActive,
            ]}>per year</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.planOption,
              selectedPlan === 'lifetime' && styles.planOptionActive,
            ]}
            onPress={() => setSelectedPlan('lifetime')}
          >
            <View style={[styles.savingsBadge, styles.bestValueBadge]}>
              <Text style={styles.savingsText}>Best Value</Text>
            </View>
            <Text style={[
              styles.planName,
              selectedPlan === 'lifetime' && styles.planNameActive,
            ]}>Lifetime</Text>
            <Text style={[
              styles.planPrice,
              selectedPlan === 'lifetime' && styles.planPriceActive,
            ]}>$199.99</Text>
            <Text style={[
              styles.planPeriod,
              selectedPlan === 'lifetime' && styles.planPeriodActive,
            ]}>one-time</Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <Text style={styles.sectionTitle}>All Premium Features</Text>

        {features.map((feature, index) => (
          <Card key={index} style={[styles.featureCard, !feature.included && styles.featureDisabled]}>
            <View style={styles.featureLeft}>
              <View style={[styles.featureIcon, { backgroundColor: `${colors.primarySaffron}20` }]}>
                <Ionicons name={feature.icon} size={24} color={colors.primarySaffron} />
              </View>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
            {feature.included ? (
              <Ionicons name="checkmark-circle" size={24} color={colors.successGreen} />
            ) : (
              <Text style={styles.comingSoon}>Coming soon</Text>
            )}
          </Card>
        ))}

        {/* Comparison Table */}
        <Card style={styles.comparisonCard}>
          <Text style={styles.comparisonTitle}>Plan Comparison</Text>
          
          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonFeature}>Health Monitoring</Text>
            <View style={styles.comparisonValues}>
              <Text style={styles.comparisonValue}>Basic</Text>
              <Text style={styles.comparisonValue}>Advanced</Text>
              <Text style={styles.comparisonValue}>Advanced</Text>
            </View>
          </View>

          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonFeature}>AI Predictions</Text>
            <View style={styles.comparisonValues}>
              <Text style={styles.comparisonValue}>Limited</Text>
              <Text style={styles.comparisonValue}>Full</Text>
              <Text style={styles.comparisonValue}>Full</Text>
            </View>
          </View>

          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonFeature}>Reports</Text>
            <View style={styles.comparisonValues}>
              <Text style={styles.comparisonValue}>Basic</Text>
              <Text style={styles.comparisonValue}>Detailed</Text>
              <Text style={styles.comparisonValue}>Detailed</Text>
            </View>
          </View>

          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonFeature}>Data Storage</Text>
            <View style={styles.comparisonValues}>
              <Text style={styles.comparisonValue}>30 days</Text>
              <Text style={styles.comparisonValue}>1 year</Text>
              <Text style={styles.comparisonValue}>Lifetime</Text>
            </View>
          </View>

          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonFeature}>Priority Support</Text>
            <View style={styles.comparisonValues}>
              <Text style={styles.comparisonValue}>-</Text>
              <Text style={styles.comparisonValue}>✓</Text>
              <Text style={styles.comparisonValue}>✓</Text>
            </View>
          </View>

          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonFeature}>Family Sharing</Text>
            <View style={styles.comparisonValues}>
              <Text style={styles.comparisonValue}>-</Text>
              <Text style={styles.comparisonValue}>-</Text>
              <Text style={styles.comparisonValue}>✓</Text>
            </View>
          </View>

          <View style={styles.planLabels}>
            <Text style={styles.planLabel}>Free</Text>
            <Text style={styles.planLabel}>Monthly</Text>
            <Text style={styles.planLabel}>Yearly</Text>
          </View>
        </Card>

        {/* Subscribe Button */}
        <Button
          title={`Subscribe - $${plans[selectedPlan].price}/${plans[selectedPlan].period}`}
          onPress={handleSubscribe}
          style={styles.subscribeButton}
          gradient
        />

        {/* Guarantee */}
        <View style={styles.guaranteeContainer}>
          <Ionicons name="shield-checkmark" size={20} color={colors.successGreen} />
          <Text style={styles.guaranteeText}>
            30-day money-back guarantee. Cancel anytime.
          </Text>
        </View>

        {/* Terms */}
        <View style={styles.termsContainer}>
          <TouchableOpacity onPress={handleTerms}>
            <Text style={styles.termsLink}>Terms of Service</Text>
          </TouchableOpacity>
          <Text style={styles.termsSeparator}>•</Text>
          <TouchableOpacity onPress={handlePrivacy}>
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        {/* Current Plan */}
        <Card style={styles.currentPlanCard}>
          <Text style={styles.currentPlanTitle}>Current Plan: Free</Text>
          <Text style={styles.currentPlanText}>
            You are currently on the free plan. Upgrade to access all features.
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
  restoreButton: {
    padding: 8,
  },
  restoreText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.primarySaffron,
  },
  heroCard: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  heroTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 22,
  },
  planSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  planOption: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    position: 'relative',
  },
  planOptionActive: {
    borderColor: colors.primarySaffron,
    borderWidth: 2,
  },
  savingsBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: colors.warningYellow,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  bestValueBadge: {
    backgroundColor: colors.successGreen,
  },
  savingsText: {
    fontFamily: 'Inter-Bold',
    fontSize: 9,
    color: 'white',
  },
  planName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  planNameActive: {
    color: colors.primarySaffron,
  },
  planPrice: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  planPriceActive: {
    color: colors.primarySaffron,
  },
  planPeriod: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
  },
  planPeriodActive: {
    color: colors.primarySaffron,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 8,
  },
  featureDisabled: {
    opacity: 0.5,
  },
  featureLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  featureDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    lineHeight: 16,
  },
  comingSoon: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
  comparisonCard: {
    padding: 16,
    marginVertical: 16,
  },
  comparisonTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  comparisonFeature: {
    width: 120,
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
  },
  comparisonValues: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  comparisonValue: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  planLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  planLabel: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  subscribeButton: {
    marginBottom: 16,
  },
  guaranteeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  guaranteeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  termsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  termsLink: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.primarySaffron,
  },
  termsSeparator: {
    marginHorizontal: 8,
    color: colors.textTertiary,
  },
  currentPlanCard: {
    padding: 16,
    backgroundColor: 'rgba(255, 153, 51, 0.05)',
  },
  currentPlanTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  currentPlanText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});

export default SubscriptionScreen;