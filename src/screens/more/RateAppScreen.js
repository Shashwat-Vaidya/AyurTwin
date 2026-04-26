import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as StoreReview from 'expo-store-review';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const RateAppScreen = () => {
  const navigation = useNavigation();

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState(null);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  const handleRate = async () => {
    if (rating === 0) {
      Alert.alert('Please Rate', 'Select a rating to continue');
      return;
    }

    setIsSubmitting(true);

    if (rating >= 4) {
      // Happy user - ask to rate on store
      setTimeout(() => {
        setIsSubmitting(false);
        Alert.alert(
          'Thank You! ',
          'We\'re so glad you\'re enjoying AyurTwin! Would you like to leave a review on the app store?',
          [
            { text: 'Not Now', style: 'cancel' },
            {
              text: 'Rate Now',
              onPress: async () => {
                if (await StoreReview.hasAction()) {
                  StoreReview.requestReview();
                } else {
                  // Fallback to store link
                  const storeUrl = Platform.select({
                    ios: 'https://apps.apple.com/app/id123456789',
                    android: 'market://details?id=com.ayurtwin.app',
                  });
                  Linking.openURL(storeUrl);
                }
                setHasRated(true);
              },
            },
          ]
        );
      }, 1000);
    } else {
      // Not so happy - ask for feedback
      setTimeout(() => {
        setIsSubmitting(false);
        setFeedbackType('improvement');
        Alert.alert(
          'Help Us Improve',
          'We\'re sorry to hear that. Your feedback helps us make AyurTwin better. Would you like to tell us what went wrong?',
          [
            { text: 'No Thanks', style: 'cancel' },
            {
              text: 'Give Feedback',
              onPress: () => setFeedbackType('improvement'),
            },
          ]
        );
      }, 1000);
    }
  };

  const handleSubmitFeedback = () => {
    if (!feedback.trim()) {
      Alert.alert('Feedback Required', 'Please enter your feedback');
      return;
    }

    Alert.alert(
      'Thank You!',
      'Your feedback has been submitted. We appreciate your help in making AyurTwin better!',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const handleShareApp = () => {
    // Implement share functionality
    Alert.alert('Share', 'Share AyurTwin with your friends!');
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}
            disabled={hasRated}
          >
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={48}
              color={star <= rating ? colors.warningYellow : colors.textTertiary}
            />
          </TouchableOpacity>
        ))}
      </View>
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
            <Ionicons name="arrow-back"size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rate AyurTwin</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Hero Section */}
        <LinearGradient
          colors={[colors.primarySaffron, colors.primaryGreen]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Ionicons name="heart"size={60} color="white" />
          <Text style={styles.heroTitle}>Love AyurTwin?</Text>
          <Text style={styles.heroSubtitle}>
            Your feedback helps us improve and reach more people on their wellness journey.
          </Text>
        </LinearGradient>

        {!hasRated && !feedbackType ? (
          <>
            {/* Rating Section */}
            <Card style={styles.ratingCard}>
              <Text style={styles.ratingQuestion}>How would you rate AyurTwin?</Text>
              {renderStars()}
              <Text style={styles.ratingDescription}>
                Tap a star to rate. Your feedback means a lot to us!
              </Text>
            </Card>

            {/* Rate Button */}
            <Button
              title="Submit Rating"onPress={handleRate}
              style={styles.rateButton}
              gradient
              loading={isSubmitting}
              disabled={rating === 0}
            />
          </>
        ) : null}

        {/* Feedback Form (for low ratings) */}
        {feedbackType === 'improvement' && (
          <Card style={styles.feedbackCard}>
            <Text style={styles.feedbackTitle}>Help Us Improve</Text>
            <Text style={styles.feedbackSubtitle}>
              We're sorry your experience wasn't perfect. Please tell us what we can do better:
            </Text>

            <TextInput
              style={styles.feedbackInput}
              placeholder="Your feedback..."placeholderTextColor={colors.textTertiary}
              value={feedback}
              onChangeText={setFeedback}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            <TextInput
              style={styles.emailInput}
              placeholder="Email (optional, for follow-up)"placeholderTextColor={colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"autoCapitalize="none"
            />

            <Button
              title="Submit Feedback"onPress={handleSubmitFeedback}
              style={styles.submitButton}
              gradient
            />
          </Card>
        )}

        {/* Thank You Message (for high ratings) */}
        {hasRated && (
          <Card style={styles.thankYouCard}>
            <Ionicons name="checkmark-circle"size={80} color={colors.successGreen} />
            <Text style={styles.thankYouTitle}>Thank You!</Text>
            <Text style={styles.thankYouText}>
              Your rating means the world to us. We're committed to helping you on your health journey!
            </Text>
          </Card>
        )}

        {/* Share Section */}
        <Card style={styles.shareCard}>
          <Text style={styles.shareTitle}>Spread the Word</Text>
          <Text style={styles.shareText}>
            Know someone who could benefit from AyurTwin? Share it with them!
          </Text>
          
          <View style={styles.shareButtons}>
            <TouchableOpacity style={styles.shareButton} onPress={handleShareApp}>
              <LinearGradient
                colors={['#25D366', '#128C7E']}
                style={styles.shareButtonGradient}
              >
                <Ionicons name="logo-whatsapp"size={24} color="white" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareButton} onPress={handleShareApp}>
              <LinearGradient
                colors={['#1DA1F2', '#0D8ECF']}
                style={styles.shareButtonGradient}
              >
                <Ionicons name="logo-twitter"size={24} color="white" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareButton} onPress={handleShareApp}>
              <LinearGradient
                colors={['#4267B2', '#2E4B8C']}
                style={styles.shareButtonGradient}
              >
                <Ionicons name="logo-facebook"size={24} color="white" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareButton} onPress={handleShareApp}>
              <LinearGradient
                colors={['#E1306C', '#C13584']}
                style={styles.shareButtonGradient}
              >
                <Ionicons name="logo-instagram"size={24} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>4.8</Text>
            <View style={styles.statStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons key={star} name="star"size={12} color={colors.warningYellow} />
              ))}
            </View>
            <Text style={styles.statLabel}>App Store</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>4.7</Text>
            <View style={styles.statStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons key={star} name="star"size={12} color={colors.warningYellow} />
              ))}
            </View>
            <Text style={styles.statLabel}>Play Store</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>10K+</Text>
            <Text style={styles.statLabel}>Happy Users</Text>
          </Card>
        </View>

        {/* Testimonials */}
        <Text style={styles.sectionTitle}>What Users Say</Text>

        <Card style={styles.testimonialCard}>
          <View style={styles.testimonialHeader}>
            <View style={[styles.testimonialAvatar, { backgroundColor: `${colors.primarySaffron}20` }]}>
              <Text style={styles.testimonialInitials}>RJ</Text>
            </View>
            <View>
              <Text style={styles.testimonialName}>Rajesh Kumar</Text>
              <View style={styles.testimonialStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons key={star} name="star"size={12} color={colors.warningYellow} />
                ))}
              </View>
            </View>
          </View>
          <Text style={styles.testimonialText}>
            "AyurTwin has completely transformed how I track my health. The Ayurvedic insights are spot-on!"
          </Text>
        </Card>

        <Card style={styles.testimonialCard}>
          <View style={styles.testimonialHeader}>
            <View style={[styles.testimonialAvatar, { backgroundColor: `${colors.primaryGreen}20` }]}>
              <Text style={styles.testimonialInitials}>PS</Text>
            </View>
            <View>
              <Text style={styles.testimonialName}>Priya Sharma</Text>
              <View style={styles.testimonialStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons key={star} name="star"size={12} color={colors.warningYellow} />
                ))}
              </View>
            </View>
          </View>
          <Text style={styles.testimonialText}>
            "The disease prediction feature helped me catch potential issues early. Highly recommended!"
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
  heroCard: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
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
  ratingCard: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingQuestion: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  starButton: {
    padding: 4,
  },
  ratingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
  rateButton: {
    marginBottom: 20,
  },
  feedbackCard: {
    padding: 20,
    marginBottom: 20,
  },
  feedbackTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  feedbackSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textPrimary,
    height: 150,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  emailInput: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 14,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 20,
  },
  submitButton: {
    marginTop: 8,
  },
  thankYouCard: {
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  thankYouTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  thankYouText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  shareCard: {
    padding: 20,
    marginBottom: 20,
  },
  shareTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  shareText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  shareButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  shareButton: {
    overflow: 'hidden',
    borderRadius: 30,
  },
  shareButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 4,
  },
  statNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statStars: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  testimonialCard: {
    padding: 16,
    marginBottom: 8,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  testimonialAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  testimonialInitials: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.textPrimary,
  },
  testimonialName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  testimonialStars: {
    flexDirection: 'row',
  },
  testimonialText: {
    fontFamily: 'Inter-Italic',
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default RateAppScreen;