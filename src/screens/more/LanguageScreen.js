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

const LanguageScreen = () => {
  const navigation = useNavigation();

  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');

  const languages = [
    { code: 'en', name: 'English', native: 'English', flag: '', rtl: false },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '', rtl: false },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '', rtl: false },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '', rtl: false },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '', rtl: false },
    { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '', rtl: false },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '', rtl: false },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '', rtl: false },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '', rtl: false },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', flag: '', rtl: false },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '', rtl: false },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া', flag: '', rtl: false },
    { code: 'ur', name: 'Urdu', native: 'اردو', flag: '', rtl: true },
    { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्', flag: '', rtl: false },
    { code: 'es', name: 'Spanish', native: 'Español', flag: '', rtl: false },
    { code: 'fr', name: 'French', native: 'Français', flag: '', rtl: false },
    { code: 'de', name: 'German', native: 'Deutsch', flag: '', rtl: false },
    { code: 'it', name: 'Italian', native: 'Italiano', flag: '', rtl: false },
    { code: 'pt', name: 'Portuguese', native: 'Português', flag: '', rtl: false },
    { code: 'ru', name: 'Russian', native: 'Русский', flag: '', rtl: false },
    { code: 'ja', name: 'Japanese', native: '日本語', flag: '', rtl: false },
    { code: 'ko', name: 'Korean', native: '한국어', flag: '', rtl: false },
    { code: 'zh', name: 'Chinese', native: '中文', flag: '', rtl: false },
    { code: 'ar', name: 'Arabic', native: 'العربية', flag: '', rtl: true },
  ];

  const popularLanguages = languages.slice(0, 8);
  const otherLanguages = languages.slice(8);

  const handleLanguageSelect = (code) => {
    setSelectedLanguage(code);
  };

  const handleSave = () => {
    Alert.alert(
      'Language Changed',
      'The app language has been updated. Some changes may require restarting the app.',
      [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]
    );
  };

  const getLanguageProgress = (code) => {
    const progress = {
      en: 100,
      hi: 95,
      bn: 90,
      te: 85,
      ta: 85,
      mr: 80,
      gu: 80,
      kn: 75,
      ml: 75,
      or: 70,
      pa: 70,
      as: 65,
      ur: 60,
      sa: 50,
      es: 40,
      fr: 35,
      de: 30,
      it: 25,
      pt: 20,
      ru: 15,
      ja: 10,
      ko: 10,
      zh: 10,
      ar: 5,
    };
    return progress[code] || 0;
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
          <Text style={styles.headerTitle}>Language</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Current Language */}
        <LinearGradient
          colors={[colors.primarySaffron, colors.primaryGreen]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.currentCard}
        >
          <Text style={styles.currentLabel}>Current Language</Text>
          <View style={styles.currentLanguage}>
            <Text style={styles.currentFlag}>
              {languages.find(l => l.code === selectedLanguage)?.flag}
            </Text>
            <View style={styles.currentInfo}>
              <Text style={styles.currentName}>
                {languages.find(l => l.code === selectedLanguage)?.name}
              </Text>
              <Text style={styles.currentNative}>
                {languages.find(l => l.code === selectedLanguage)?.native}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Popular Languages */}
        <Text style={styles.sectionTitle}>Popular Languages</Text>
        
        {popularLanguages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageItem,
              selectedLanguage === language.code && styles.languageItemSelected,
            ]}
            onPress={() => handleLanguageSelect(language.code)}
          >
            <View style={styles.languageLeft}>
              <Text style={styles.languageFlag}>{language.flag}</Text>
              <View style={styles.languageInfo}>
                <Text style={styles.languageName}>{language.name}</Text>
                <Text style={styles.languageNative}>{language.native}</Text>
              </View>
            </View>
            
            <View style={styles.languageRight}>
              <View style={styles.progressContainer}>
                <View 
                  style={[
                    styles.progressBar,
                    { width: `${getLanguageProgress(language.code)}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {getLanguageProgress(language.code)}%
              </Text>
              {selectedLanguage === language.code && (
                <Ionicons name="checkmark-circle"size={24} color={colors.successGreen} />
              )}
            </View>
          </TouchableOpacity>
        ))}

        {/* All Languages */}
        <Text style={styles.sectionTitle}>All Languages</Text>
        
        {otherLanguages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageItem,
              selectedLanguage === language.code && styles.languageItemSelected,
            ]}
            onPress={() => handleLanguageSelect(language.code)}
          >
            <View style={styles.languageLeft}>
              <Text style={styles.languageFlag}>{language.flag}</Text>
              <View style={styles.languageInfo}>
                <Text style={styles.languageName}>{language.name}</Text>
                <Text style={styles.languageNative}>{language.native}</Text>
              </View>
            </View>
            
            <View style={styles.languageRight}>
              <View style={styles.progressContainer}>
                <View 
                  style={[
                    styles.progressBar,
                    { width: `${getLanguageProgress(language.code)}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {getLanguageProgress(language.code)}%
              </Text>
              {selectedLanguage === language.code && (
                <Ionicons name="checkmark-circle"size={24} color={colors.successGreen} />
              )}
            </View>
          </TouchableOpacity>
        ))}

        {/* RTL Notice */}
        <Card style={styles.rtlCard}>
          <Ionicons name="information-circle"size={20} color={colors.spO2Blue} />
          <Text style={styles.rtlText}>
            Right-to-left languages like Arabic and Urdu will adjust the app layout accordingly.
          </Text>
        </Card>

        {/* Translation Progress */}
        <Card style={styles.progressCard}>
          <Text style={styles.progressTitle}>Translation Progress</Text>
          <Text style={styles.progressDescription}>
            Help us translate AyurTwin into your language and earn rewards!
          </Text>
          <Button
            title="Contribute Translations"onPress={() => {}}
            style={styles.contributeButton}
            outline
            icon="language"
          />
        </Card>

        {/* Save Button */}
        <Button
          title="Save Language"onPress={handleSave}
          style={styles.saveButton}
          gradient
        />
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
  currentCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
  },
  currentLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: 'white',
    opacity: 0.9,
    marginBottom: 12,
  },
  currentLanguage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentFlag: {
    fontSize: 48,
    marginRight: 16,
  },
  currentInfo: {
    flex: 1,
  },
  currentName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: 'white',
    marginBottom: 2,
  },
  currentNative: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 12,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  languageItemSelected: {
    borderWidth: 2,
    borderColor: colors.primarySaffron,
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageFlag: {
    fontSize: 30,
    marginRight: 12,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  languageNative: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  languageRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContainer: {
    width: 60,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 2,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primaryGreen,
    borderRadius: 2,
  },
  progressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    marginRight: 8,
    minWidth: 35,
  },
  rtlCard: {
    flexDirection: 'row',
    padding: 16,
    marginVertical: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(74, 144, 226, 0.05)',
  },
  rtlText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 12,
    lineHeight: 18,
  },
  progressCard: {
    padding: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  progressTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  progressDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  contributeButton: {
    marginTop: 8,
  },
  saveButton: {
    marginTop: 20,
  },
});

export default LanguageScreen;