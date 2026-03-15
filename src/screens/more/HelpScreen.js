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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const HelpScreen = () => {
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  
  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  // FAQ data
  const faqCategories = [
    {
      title: 'Getting Started',
      icon: 'rocket',
      faqs: [
        {
          id: 'gs1',
          question: 'How do I set up my AyurTwin device?',
          answer: 'To set up your AyurTwin device: 1) Charge the device fully, 2) Download the AyurTwin app, 3) Enable Bluetooth on your phone, 4) Open the app and go to Device Connection, 5) Tap "Scan for Devices" and select your device, 6) Follow the on-screen instructions to complete pairing.',
        },
        {
          id: 'gs2',
          question: 'How do I create an account?',
          answer: 'Open the app and tap "Create New Account". Fill in your personal information, lifestyle details, and complete the Prakriti analysis. After completing all 8 registration steps, your account will be created and you can start using AyurTwin.',
        },
        {
          id: 'gs3',
          question: 'What is Prakriti analysis?',
          answer: 'Prakriti analysis is an Ayurvedic assessment that determines your unique mind-body constitution (Vata, Pitta, or Kapha). This helps personalize your health recommendations, diet suggestions, and lifestyle guidance based on your dominant dosha.',
        },
      ],
    },
    {
      title: 'Device & Sensors',
      icon: 'hardware-chip',
      faqs: [
        {
          id: 'dev1',
          question: 'Why is my device not connecting?',
          answer: 'If your device isn\'t connecting: 1) Ensure Bluetooth is enabled, 2) Bring the device closer to your phone, 3) Restart both the app and device, 4) Check if the device is charged, 5) Try forgetting the device and re-pairing.',
        },
        {
          id: 'dev2',
          question: 'How do I check my device battery?',
          answer: 'Go to the Device Connection screen in the More tab. The battery level of your connected device will be displayed there. You\'ll also receive notifications when battery is low.',
        },
        {
          id: 'dev3',
          question: 'What sensors does the wristband have?',
          answer: 'The AyurTwin wristband includes sensors for: Heart Rate (PPG), Blood Oxygen (SpO₂), Body Temperature, Galvanic Skin Response (GSR) for stress, 3-axis accelerometer for activity tracking, and gyroscope for movement analysis.',
        },
        {
          id: 'dev4',
          question: 'How often does the device sync data?',
          answer: 'The device automatically syncs data every 15 minutes when connected. You can also manually sync anytime by pulling down on the dashboard or tapping the sync button in Device Connection.',
        },
      ],
    },
    {
      title: 'Health Monitoring',
      icon: 'fitness',
      faqs: [
        {
          id: 'hm1',
          question: 'How accurate are the health readings?',
          answer: 'AyurTwin devices are clinically validated and provide medical-grade accuracy. However, they are not intended to replace professional medical devices. Always consult healthcare providers for medical decisions.',
        },
        {
          id: 'hm2',
          question: 'What do the disease risk predictions mean?',
          answer: 'Risk predictions are based on AI analysis of your health data, lifestyle factors, and family history. They indicate potential health risks and are meant for preventive awareness, not diagnosis.',
        },
        {
          id: 'hm3',
          question: 'How are alerts triggered?',
          answer: 'Alerts are triggered when your health metrics fall outside personalized normal ranges, when stress levels are elevated, when dosha imbalances are detected, or when device issues occur (like low battery).',
        },
      ],
    },
    {
      title: 'Account & Privacy',
      icon: 'shield',
      faqs: [
        {
          id: 'ap1',
          question: 'Is my health data secure?',
          answer: 'Yes, all health data is encrypted end-to-end and stored securely. We comply with HIPAA and GDPR guidelines. Your data is never shared without your explicit consent.',
        },
        {
          id: 'ap2',
          question: 'Can I export my health data?',
          answer: 'Yes, you can export your health data in CSV or PDF format. Go to Settings > Privacy > Export Data. You can choose the date range and data types to export.',
        },
        {
          id: 'ap3',
          question: 'How do I delete my account?',
          answer: 'To delete your account, go to Settings > Privacy > Delete Account. Please note that this action is permanent and all your health data will be erased.',
        },
      ],
    },
  ];

  const quickGuides = [
    {
      title: 'Device Setup Guide',
      icon: 'hardware-chip',
      color: colors.primarySaffron,
      steps: 5,
    },
    {
      title: 'Reading Your Health Data',
      icon: 'analytics',
      color: colors.primaryGreen,
      steps: 4,
    },
    {
      title: 'Understanding Alerts',
      icon: 'notifications',
      color: colors.alertRed,
      steps: 3,
    },
    {
      title: 'Ayurvedic Basics',
      icon: 'leaf',
      color: colors.primaryGreen,
      steps: 6,
    },
  ];

  const handleContactSubmit = () => {
    if (!contactName || !contactEmail || !contactSubject || !contactMessage) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Simulate form submission
    Alert.alert(
      'Message Sent',
      'Thank you for contacting us. We\'ll get back to you within 24 hours.',
      [
        {
          text: 'OK',
          onPress: () => {
            setShowContactForm(false);
            setContactName('');
            setContactEmail('');
            setContactSubject('');
            setContactMessage('');
          },
        },
      ]
    );
  };

  const openLiveChat = () => {
    Alert.alert('Live Chat', 'Connecting you to a support representative...');
  };

  const callSupport = () => {
    Linking.openURL('tel:+18001234567');
  };

  const emailSupport = () => {
    Linking.openURL('mailto:support@ayurtwin.com');
  };

  const filteredFaqs = searchQuery
    ? faqCategories.flatMap(cat => 
        cat.faqs.filter(faq => 
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : [];

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
          <Text style={styles.headerTitle}>Help & Support</Text>
          <TouchableOpacity onPress={() => setShowContactForm(!showContactForm)} style={styles.contactButton}>
            <Ionicons name="mail" size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for help..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Search Results */}
        {searchQuery.length > 0 && (
          <Card style={styles.searchResultsCard}>
            <Text style={styles.searchResultsTitle}>Search Results</Text>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <TouchableOpacity
                  key={faq.id}
                  style={styles.searchResultItem}
                  onPress={() => setExpandedFaq(faq.id)}
                >
                  <Text style={styles.searchResultQuestion}>{faq.question}</Text>
                  {expandedFaq === faq.id && (
                    <Text style={styles.searchResultAnswer}>{faq.answer}</Text>
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noResults}>No results found</Text>
            )}
          </Card>
        )}

        {/* Quick Help Cards */}
        <View style={styles.quickHelpContainer}>
          <TouchableOpacity style={styles.quickHelpCard} onPress={openLiveChat}>
            <LinearGradient
              colors={[colors.primarySaffron, colors.primaryGreen]}
              style={styles.quickHelpGradient}
            >
              <Ionicons name="chatbubbles" size={30} color="white" />
              <Text style={styles.quickHelpTitle}>Live Chat</Text>
              <Text style={styles.quickHelpSubtitle}>24/7 Support</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickHelpCard} onPress={callSupport}>
            <LinearGradient
              colors={[colors.alertRed, colors.heartRate]}
              style={styles.quickHelpGradient}
            >
              <Ionicons name="call" size={30} color="white" />
              <Text style={styles.quickHelpTitle}>Phone Support</Text>
              <Text style={styles.quickHelpSubtitle}>Toll-free</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickHelpCard} onPress={emailSupport}>
            <LinearGradient
              colors={[colors.spO2Blue, colors.spO2Blue]}
              style={styles.quickHelpGradient}
            >
              <Ionicons name="mail" size={30} color="white" />
              <Text style={styles.quickHelpTitle}>Email</Text>
              <Text style={styles.quickHelpSubtitle}>24h response</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Quick Guides */}
        <Text style={styles.sectionTitle}>Quick Guides</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.guidesScroll}>
          {quickGuides.map((guide, index) => (
            <TouchableOpacity key={index} style={styles.guideCard}>
              <LinearGradient
                colors={[guide.color, `${guide.color}CC`]}
                style={styles.guideGradient}
              >
                <Ionicons name={guide.icon} size={30} color="white" />
                <Text style={styles.guideTitle}>{guide.title}</Text>
                <Text style={styles.guideSteps}>{guide.steps} steps</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Contact Form */}
        {showContactForm && (
          <Card style={styles.contactFormCard}>
            <Text style={styles.contactFormTitle}>Contact Support</Text>
            
            <TextInput
              style={styles.contactInput}
              placeholder="Your Name"
              placeholderTextColor={colors.textTertiary}
              value={contactName}
              onChangeText={setContactName}
            />
            
            <TextInput
              style={styles.contactInput}
              placeholder="Your Email"
              placeholderTextColor={colors.textTertiary}
              value={contactEmail}
              onChangeText={setContactEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.contactInput}
              placeholder="Subject"
              placeholderTextColor={colors.textTertiary}
              value={contactSubject}
              onChangeText={setContactSubject}
            />
            
            <TextInput
              style={[styles.contactInput, styles.messageInput]}
              placeholder="Message"
              placeholderTextColor={colors.textTertiary}
              value={contactMessage}
              onChangeText={setContactMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            
            <Button
              title="Send Message"
              onPress={handleContactSubmit}
              style={styles.sendButton}
              gradient
            />
            
            <TouchableOpacity 
              style={styles.cancelFormButton}
              onPress={() => setShowContactForm(false)}
            >
              <Text style={styles.cancelFormText}>Cancel</Text>
            </TouchableOpacity>
          </Card>
        )}

        {/* FAQ Sections */}
        {!searchQuery && faqCategories.map((category, index) => (
          <Card key={index} style={styles.faqCategoryCard}>
            <View style={styles.categoryHeader}>
              <Ionicons name={category.icon} size={24} color={colors.primarySaffron} />
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </View>

            {category.faqs.map((faq) => (
              <View key={faq.id}>
                <TouchableOpacity
                  style={styles.faqItem}
                  onPress={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                >
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Ionicons 
                    name={expandedFaq === faq.id ? 'chevron-up' : 'chevron-down'} 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                </TouchableOpacity>
                
                {expandedFaq === faq.id && (
                  <View style={styles.faqAnswerContainer}>
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </Card>
        ))}

        {/* Support Hours */}
        <Card style={styles.hoursCard}>
          <Text style={styles.hoursTitle}>Support Hours</Text>
          
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Monday - Friday</Text>
            <Text style={styles.hoursTime}>24/7</Text>
          </View>
          
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Saturday</Text>
            <Text style={styles.hoursTime}>9:00 AM - 9:00 PM</Text>
          </View>
          
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Sunday</Text>
            <Text style={styles.hoursTime}>10:00 AM - 6:00 PM</Text>
          </View>
          
          <Text style={styles.hoursNote}>
            Emergency support available 24/7 for critical health alerts
          </Text>
        </Card>

        {/* Useful Links */}
        <Card style={styles.linksCard}>
          <Text style={styles.linksTitle}>Useful Links</Text>
          
          <TouchableOpacity style={styles.linkItem}>
            <Ionicons name="book" size={20} color={colors.primarySaffron} />
            <Text style={styles.linkText}>User Manual</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkItem}>
            <Ionicons name="play-circle" size={20} color={colors.primarySaffron} />
            <Text style={styles.linkText}>Video Tutorials</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkItem}>
            <Ionicons name="document-text" size={20} color={colors.primarySaffron} />
            <Text style={styles.linkText}>FAQs</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkItem}>
            <Ionicons name="shield" size={20} color={colors.primarySaffron} />
            <Text style={styles.linkText}>Safety Guidelines</Text>
          </TouchableOpacity>
        </Card>

        {/* Feedback */}
        <Card style={styles.feedbackCard}>
          <Text style={styles.feedbackTitle}>Was this helpful?</Text>
          <View style={styles.feedbackButtons}>
            <TouchableOpacity style={styles.feedbackButton}>
              <Ionicons name="thumbs-up" size={24} color={colors.successGreen} />
              <Text style={styles.feedbackButtonText}>Yes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.feedbackButton}>
              <Ionicons name="thumbs-down" size={24} color={colors.alertRed} />
              <Text style={styles.feedbackButtonText}>No</Text>
            </TouchableOpacity>
          </View>
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
  contactButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 8,
    marginRight: 8,
  },
  searchResultsCard: {
    padding: 16,
    marginBottom: 16,
  },
  searchResultsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  searchResultItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  searchResultQuestion: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  searchResultAnswer: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 4,
  },
  noResults: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textTertiary,
    textAlign: 'center',
    padding: 20,
  },
  quickHelpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickHelpCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickHelpGradient: {
    padding: 16,
    alignItems: 'center',
  },
  quickHelpTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'white',
    marginTop: 8,
    marginBottom: 2,
  },
  quickHelpSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: 'white',
    opacity: 0.8,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  guidesScroll: {
    marginBottom: 20,
  },
  guideCard: {
    width: 140,
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  guideGradient: {
    padding: 16,
    height: 120,
    justifyContent: 'space-between',
  },
  guideTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'white',
  },
  guideSteps: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: 'white',
    opacity: 0.8,
  },
  contactFormCard: {
    padding: 16,
    marginBottom: 20,
  },
  contactFormTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  contactInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textPrimary,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    marginTop: 8,
    marginBottom: 8,
  },
  cancelFormButton: {
    alignItems: 'center',
    padding: 8,
  },
  cancelFormText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  faqCategoryCard: {
    padding: 16,
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  categoryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  faqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  faqQuestion: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
    marginRight: 8,
  },
  faqAnswerContainer: {
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  faqAnswer: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  hoursCard: {
    padding: 16,
    marginBottom: 16,
  },
  hoursTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  hoursDay: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  hoursTime: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
  },
  hoursNote: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 12,
    fontStyle: 'italic',
  },
  linksCard: {
    padding: 16,
    marginBottom: 16,
  },
  linksTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  linkText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  feedbackCard: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  feedbackTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  feedbackButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  feedbackButton: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  feedbackButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
});

export default HelpScreen;