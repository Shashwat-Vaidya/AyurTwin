import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const FAQScreen = () => {
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: 'apps' },
    { id: 'account', name: 'Account', icon: 'person' },
    { id: 'device', name: 'Device', icon: 'hardware-chip' },
    { id: 'health', name: 'Health', icon: 'fitness' },
    { id: 'ayurveda', name: 'Ayurveda', icon: 'leaf' },
    { id: 'billing', name: 'Billing', icon: 'card' },
  ];

  const faqs = [
    {
      id: '1',
      category: 'account',
      question: 'How do I create an account?',
      answer: 'To create an account, open the app and tap "Create New Account". Fill in your personal information, complete the registration steps, and set up your login credentials. You\'ll need to provide your email, create a password, and complete your health profile.',
      helpful: 124,
      related: ['2', '3', '5'],
    },
    {
      id: '2',
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'To reset your password, go to the login screen and tap "Forgot Password". Enter your email address and we\'ll send you a link to create a new password. The link expires in 30 minutes for security reasons.',
      helpful: 98,
      related: ['1', '3'],
    },
    {
      id: '3',
      category: 'account',
      question: 'Can I delete my account?',
      answer: 'Yes, you can delete your account from Settings > Privacy > Delete Account. Please note that this action is permanent and all your health data will be erased. You may want to export your data first if you wish to keep a copy.',
      helpful: 67,
      related: ['1', '2', '18'],
    },
    {
      id: '4',
      category: 'device',
      question: 'How do I connect my AyurTwin device?',
      answer: 'To connect your device: 1) Ensure Bluetooth is enabled on your phone, 2) Go to More > Device > Connect Device, 3) Tap "Scan for Devices", 4) Select your device from the list, 5) Follow the on-screen pairing instructions. Make sure your device is charged and nearby.',
      helpful: 156,
      related: ['5', '6', '7'],
    },
    {
      id: '5',
      category: 'device',
      question: 'Why is my device not connecting?',
      answer: 'If your device isn\'t connecting: 1) Check if Bluetooth is enabled, 2) Ensure the device is charged, 3) Bring the device closer to your phone, 4) Restart both the app and device, 5) Try forgetting the device and re-pairing. If issues persist, contact support.',
      helpful: 143,
      related: ['4', '6', '7'],
    },
    {
      id: '6',
      category: 'device',
      question: 'How do I check my device battery?',
      answer: 'You can check your device battery level in two ways: 1) Go to More > Device, where you\'ll see the battery percentage, or 2) Look at the device status icon on the dashboard. You\'ll also receive notifications when battery is low.',
      helpful: 89,
      related: ['4', '5', '7'],
    },
    {
      id: '7',
      category: 'device',
      question: 'How often does the device sync data?',
      answer: 'The device automatically syncs data every 15 minutes when connected. You can also manually sync anytime by pulling down on the dashboard or tapping the sync button in Device settings. Data is stored on the device for up to 7 days if not synced.',
      helpful: 112,
      related: ['4', '5', '6'],
    },
    {
      id: '8',
      category: 'health',
      question: 'How accurate are the health readings?',
      answer: 'AyurTwin devices are clinically validated and provide medical-grade accuracy. However, they are not intended to replace professional medical devices. Always consult healthcare providers for medical decisions. For best accuracy, ensure proper device placement and follow usage guidelines.',
      helpful: 178,
      related: ['9', '10', '11'],
    },
    {
      id: '9',
      category: 'health',
      question: 'What do the disease risk predictions mean?',
      answer: 'Risk predictions are based on AI analysis of your health data, lifestyle factors, and family history. They indicate potential health risks and are meant for preventive awareness, not diagnosis. A high risk doesn\'t mean you have the condition, but suggests you may want to discuss it with your healthcare provider.',
      helpful: 145,
      related: ['8', '10', '11'],
    },
    {
      id: '10',
      category: 'health',
      question: 'How are alerts triggered?',
      answer: 'Alerts are triggered when your health metrics fall outside personalized normal ranges, when stress levels are elevated, when dosha imbalances are detected, or when device issues occur (like low battery). You can customize alert thresholds in Settings > Alerts.',
      helpful: 134,
      related: ['8', '9', '11'],
    },
    {
      id: '11',
      category: 'health',
      question: 'Can I share my health data with my doctor?',
      answer: 'Yes, you can share your health data with healthcare providers. Go to More > Reports, select a report, and use the share or export option. You can export data as PDF or CSV files that can be emailed or printed.',
      helpful: 167,
      related: ['8', '9', '10'],
    },
    {
      id: '12',
      category: 'ayurveda',
      question: 'What is Prakriti?',
      answer: 'Prakriti is your unique mind-body constitution in Ayurveda. It\'s determined at conception and remains constant throughout life. Understanding your Prakriti helps personalize health recommendations, diet, and lifestyle choices. The three doshas (Vata, Pitta, Kapha) combine in unique proportions to form your Prakriti.',
      helpful: 189,
      related: ['13', '14', '15'],
    },
    {
      id: '13',
      category: 'ayurveda',
      question: 'How do I determine my dosha?',
      answer: 'You can determine your dosha by taking our Prakriti quiz during registration or from the More > Education section. The quiz analyzes your physical characteristics, mental tendencies, and behavioral patterns to determine your dominant dosha and dosha proportions.',
      helpful: 176,
      related: ['12', '14', '15'],
    },
    {
      id: '14',
      category: 'ayurveda',
      question: 'What happens when doshas are imbalanced?',
      answer: 'Dosha imbalances can lead to various health issues. Vata imbalance may cause anxiety, dry skin, and irregular digestion. Pitta imbalance can lead to inflammation, acidity, and irritability. Kapha imbalance may result in lethargy, weight gain, and congestion. The app alerts you to imbalances and suggests corrective measures.',
      helpful: 154,
      related: ['12', '13', '15'],
    },
    {
      id: '15',
      category: 'ayurveda',
      question: 'How can I balance my doshas?',
      answer: 'Doshas can be balanced through diet, lifestyle, and routines. For Vata: warm, grounding foods and regular routines. For Pitta: cooling foods and moderate exercise. For Kapha: light, stimulating activities and warm foods. The app provides personalized recommendations based on your dosha.',
      helpful: 167,
      related: ['12', '13', '14'],
    },
    {
      id: '16',
      category: 'billing',
      question: 'How much does AyurTwin cost?',
      answer: 'AyurTwin offers a free basic version with essential features. Premium subscriptions start at $9.99/month or $89.99/year, providing advanced analytics, detailed reports, and personalized coaching. Family plans are also available.',
      helpful: 98,
      related: ['17', '18'],
    },
    {
      id: '17',
      category: 'billing',
      question: 'How do I cancel my subscription?',
      answer: 'To cancel your subscription, go to Settings > Subscription and tap "Cancel Subscription". You can also manage through your app store (Apple App Store or Google Play Store). Cancellation takes effect at the end of your current billing period.',
      helpful: 87,
      related: ['16', '18'],
    },
    {
      id: '18',
      category: 'billing',
      question: 'Is there a refund policy?',
      answer: 'Yes, we offer a 30-day money-back guarantee for annual subscriptions. Monthly subscriptions can be cancelled anytime but are non-refundable for the current month. Contact support within 30 days of purchase for refund requests.',
      helpful: 76,
      related: ['16', '17'],
    },
  ];

  const filteredFaqs = faqs.filter(faq => {
    if (selectedCategory !== 'all' && faq.category !== selectedCategory) return false;
    if (searchQuery) {
      return faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
             faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const getCategoryColor = (category) => {
    switch(category) {
      case 'account': return colors.primarySaffron;
      case 'device': return colors.spO2Blue;
      case 'health': return colors.heartRate;
      case 'ayurveda': return colors.primaryGreen;
      case 'billing': return colors.stressPurple;
      default: return colors.textSecondary;
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'account': return 'person';
      case 'device': return 'hardware-chip';
      case 'health': return 'fitness';
      case 'ayurveda': return 'leaf';
      case 'billing': return 'card';
      default: return 'help';
    }
  };

  const handleHelpful = (faqId) => {
    // In a real app, you'd send this to analytics
    alert('Thank you for your feedback!');
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
          <Text style={styles.headerTitle}>FAQ</Text>
          <TouchableOpacity style={styles.contactButton}>
            <Ionicons name="mail" size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search FAQs..."
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

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.categoryChipActive,
                selectedCategory === category.id && { backgroundColor: getCategoryColor(category.id) }
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons 
                name={category.icon} 
                size={16} 
                color={selectedCategory === category.id ? 'white' : getCategoryColor(category.id)} 
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive,
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results Count */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {filteredFaqs.length} {filteredFaqs.length === 1 ? 'question' : 'questions'} found
          </Text>
        </View>

        {/* FAQ List */}
        {filteredFaqs.map((faq) => (
          <Card key={faq.id} style={styles.faqCard}>
            <TouchableOpacity
              style={styles.faqHeader}
              onPress={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
            >
              <View style={styles.faqHeaderLeft}>
                <View style={[styles.categoryIcon, { backgroundColor: `${getCategoryColor(faq.category)}20` }]}>
                  <Ionicons name={getCategoryIcon(faq.category)} size={16} color={getCategoryColor(faq.category)} />
                </View>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
              </View>
              <Ionicons 
                name={expandedFaq === faq.id ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={colors.textSecondary} 
              />
            </TouchableOpacity>

            {expandedFaq === faq.id && (
              <View style={styles.faqAnswer}>
                <Text style={styles.answerText}>{faq.answer}</Text>

                {/* Helpful Section */}
                <View style={styles.helpfulSection}>
                  <Text style={styles.helpfulText}>Was this helpful?</Text>
                  <View style={styles.helpfulButtons}>
                    <TouchableOpacity 
                      style={styles.helpfulButton}
                      onPress={() => handleHelpful(faq.id)}
                    >
                      <Ionicons name="thumbs-up" size={18} color={colors.successGreen} />
                      <Text style={styles.helpfulButtonText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.helpfulButton}
                      onPress={() => handleHelpful(faq.id)}
                    >
                      <Ionicons name="thumbs-down" size={18} color={colors.alertRed} />
                      <Text style={styles.helpfulButtonText}>No</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.helpfulCount}>{faq.helpful} people found this helpful</Text>
                </View>

                {/* Related FAQs */}
                {faq.related && faq.related.length > 0 && (
                  <View style={styles.relatedSection}>
                    <Text style={styles.relatedTitle}>Related Questions</Text>
                    {faq.related.map((relatedId) => {
                      const related = faqs.find(f => f.id === relatedId);
                      if (!related) return null;
                      return (
                        <TouchableOpacity
                          key={relatedId}
                          style={styles.relatedItem}
                          onPress={() => setExpandedFaq(relatedId)}
                        >
                          <Ionicons name="help-circle" size={16} color={colors.primarySaffron} />
                          <Text style={styles.relatedText}>{related.question}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            )}
          </Card>
        ))}

        {/* Still Need Help */}
        <Card style={styles.helpCard}>
          <Ionicons name="help-circle" size={40} color={colors.primarySaffron} />
          <Text style={styles.helpTitle}>Still Need Help?</Text>
          <Text style={styles.helpText}>
            Can't find what you're looking for? Our support team is here to help.
          </Text>
          <View style={styles.helpButtons}>
            <Button
              title="Contact Support"
              onPress={() => navigation.navigate(ROUTES.HELP)}
              style={styles.contactButton}
              gradient
            />
            <Button
              title="Live Chat"
              onPress={() => {}}
              style={styles.chatButton}
              outline
              icon="chatbubble"
            />
          </View>
        </Card>

        {/* Quick Links */}
        <View style={styles.quickLinks}>
          <TouchableOpacity style={styles.quickLink}>
            <Ionicons name="document-text" size={20} color={colors.primarySaffron} />
            <Text style={styles.quickLinkText}>User Guide</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickLink}>
            <Ionicons name="play-circle" size={20} color={colors.primarySaffron} />
            <Text style={styles.quickLinkText}>Video Tutorials</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickLink}>
            <Ionicons name="bug" size={20} color={colors.primarySaffron} />
            <Text style={styles.quickLinkText}>Report an Issue</Text>
          </TouchableOpacity>
        </View>

        {/* Version Info */}
        <Text style={styles.versionText}>
          FAQ last updated: March 2024 • AyurTwin v1.0.0
        </Text>
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
  categoryScroll: {
    marginBottom: 15,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  categoryChipActive: {
    borderColor: 'transparent',
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  categoryTextActive: {
    color: 'white',
  },
  resultsContainer: {
    marginBottom: 15,
  },
  resultsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textTertiary,
  },
  faqCard: {
    marginBottom: 12,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  faqQuestion: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  answerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  helpfulSection: {
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  helpfulText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  helpfulButtons: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 8,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 20,
  },
  helpfulButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  helpfulCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  relatedSection: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  relatedTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  relatedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  relatedText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  helpCard: {
    padding: 24,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 153, 51, 0.05)',
  },
  helpTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  helpText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  helpButtons: {
    flexDirection: 'row',
    width: '100%',
  },
  contactButton: {
    flex: 1,
    marginRight: 8,
  },
  chatButton: {
    flex: 1,
    marginLeft: 8,
  },
  quickLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  quickLink: {
    alignItems: 'center',
  },
  quickLinkText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});

export default FAQScreen;