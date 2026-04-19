import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as MailComposer from 'expo-mail-composer';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const FeedbackScreen = () => {
  const navigation = useNavigation();

  const [feedbackType, setFeedbackType] = useState('suggestion');
  const [rating, setRating] = useState(0);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [attachLogs, setAttachLogs] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTypes = [
    { id: 'suggestion', label: 'Suggestion', icon: 'bulb' },
    { id: 'bug', label: 'Bug Report', icon: 'bug' },
    { id: 'feature', label: 'Feature Request', icon: 'rocket' },
    { id: 'compliment', label: 'Compliment', icon: 'heart' },
    { id: 'other', label: 'Other', icon: 'help-buoy' },
  ];

  const ratingLabels = ['Terrible', 'Poor', 'Okay', 'Good', 'Excellent'];

  const handleSubmit = async () => {
    if (!subject.trim()) {
      Alert.alert('Error', 'Please enter a subject');
      return;
    }

    if (!message.trim()) {
      Alert.alert('Error', 'Please enter your feedback');
      return;
    }

    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Thank You!',
        'Your feedback has been submitted successfully. We appreciate your input!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 1500);
  };

  const handleContactSupport = () => {
    MailComposer.composeAsync({
      recipients: ['support@ayurtwin.com'],
      subject: `AyurTwin Support: ${subject || 'General Inquiry'}`,
      body: message,
    }).catch(() => {
      Alert.alert('Error', 'Could not open email client');
    });
  };

  const renderRating = () => {
    return (
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingLabel}>How would you rate your experience?</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}
            >
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={32}
                color={star <= rating ? colors.warningYellow : colors.textTertiary}
              />
            </TouchableOpacity>
          ))}
        </View>
        {rating > 0 && (
          <Text style={[styles.ratingText, { color: colors.primarySaffron }]}>
            {ratingLabels[rating - 1]}
          </Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
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
          <Text style={styles.headerTitle}>Feedback</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Hero Section */}
        <LinearGradient
          colors={[colors.primarySaffron, colors.primaryGreen]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Ionicons name="chatbubbles" size={50} color="white" />
          <Text style={styles.heroTitle}>We Value Your Feedback</Text>
          <Text style={styles.heroSubtitle}>
            Help us improve AyurTwin by sharing your thoughts, suggestions, or reporting issues.
          </Text>
        </LinearGradient>

        {/* Rating */}
        <Card style={styles.sectionCard}>
          {renderRating()}
        </Card>

        {/* Feedback Type */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Feedback Type</Text>
          <View style={styles.typeGrid}>
            {feedbackTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeButton,
                  feedbackType === type.id && styles.typeButtonActive,
                ]}
                onPress={() => setFeedbackType(type.id)}
              >
                <Ionicons
                  name={type.icon}
                  size={20}
                  color={feedbackType === type.id ? 'white' : colors.primarySaffron}
                />
                <Text
                  style={[
                    styles.typeText,
                    feedbackType === type.id && styles.typeTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Form */}
        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Your Feedback</Text>

          {/* Subject */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Subject *</Text>
            <TextInput
              style={styles.input}
              placeholder="Brief summary of your feedback"
              placeholderTextColor={colors.textTertiary}
              value={subject}
              onChangeText={setSubject}
            />
          </View>

          {/* Message */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Message *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Please share your detailed feedback..."
              placeholderTextColor={colors.textTertiary}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          {/* Email (optional) */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email for follow-up"
              placeholderTextColor={colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Attach Logs */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAttachLogs(!attachLogs)}
          >
            <View style={[styles.checkbox, attachLogs && styles.checkboxChecked]}>
              {attachLogs && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
            <Text style={styles.checkboxLabel}>Attach diagnostic logs (helps with bug fixes)</Text>
          </TouchableOpacity>
        </Card>

        {/* Quick Feedback Options */}
        <Card style={styles.quickCard}>
          <Text style={styles.quickTitle}>Quick Feedback</Text>
          
          <TouchableOpacity style={styles.quickOption}>
            <Ionicons name="thumbs-up" size={20} color={colors.successGreen} />
            <Text style={styles.quickText}>I love this app!</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickOption}>
            <Ionicons name="bulb" size={20} color={colors.warningYellow} />
            <Text style={styles.quickText}>I have an idea to improve</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickOption}>
            <Ionicons name="bug" size={20} color={colors.alertRed} />
            <Text style={styles.quickText}>I found a bug</Text>
          </TouchableOpacity>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Submit Feedback"
            onPress={handleSubmit}
            style={styles.submitButton}
            gradient
            loading={isSubmitting}
          />
          <Button
            title="Contact Support"
            onPress={handleContactSupport}
            style={styles.supportButton}
            outline
            icon="mail"
          />
        </View>

        {/* Privacy Note */}
        <Text style={styles.note}>
          Your feedback helps us improve. We'll never share your personal information.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
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
    fontSize: 22,
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionCard: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  ratingContainer: {
    alignItems: 'center',
  },
  ratingLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginTop: 4,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeButton: {
    width: '18%',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    backgroundColor: 'white',
  },
  typeButtonActive: {
    backgroundColor: colors.primarySaffron,
    borderColor: colors.primarySaffron,
  },
  typeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  typeTextActive: {
    color: 'white',
  },
  formCard: {
    padding: 16,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: 'white',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
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
  checkboxLabel: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
  },
  quickCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  quickTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  quickOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  quickText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  submitButton: {
    flex: 1,
    marginRight: 8,
  },
  supportButton: {
    flex: 1,
    marginLeft: 8,
  },
  note: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default FeedbackScreen;