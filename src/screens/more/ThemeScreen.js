import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const ThemeScreen = () => {
  const navigation = useNavigation();

  const [selectedTheme, setSelectedTheme] = useState('light');
  const [accentColor, setAccentColor] = useState('saffron');
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [fontFamily, setFontFamily] = useState('inter');

  const themes = [
    {
      id: 'light',
      name: 'Light',
      icon: 'sunny',
      colors: ['#FFFFFF', '#F8FAF5', '#FAF7F2'],
      description: 'Clean and bright interface',
    },
    {
      id: 'dark',
      name: 'Dark',
      icon: 'moon',
      colors: ['#1A1A1A', '#2A2A2A', '#333333'],
      description: 'Easy on the eyes at night',
    },
    {
      id: 'system',
      name: 'System Default',
      icon: 'phone-portrait',
      colors: ['#FFFFFF', '#F8FAF5', '#FAF7F2'],
      description: 'Follows your device settings',
    },
  ];

  const accentColors = [
    { id: 'saffron', name: 'Saffron', color: colors.primarySaffron },
    { id: 'green', name: 'Green', color: colors.primaryGreen },
    { id: 'blue', name: 'Blue', color: colors.spO2Blue },
    { id: 'purple', name: 'Purple', color: colors.stressPurple },
    { id: 'pink', name: 'Pink', color: colors.heartRate },
    { id: 'orange', name: 'Orange', color: colors.tempOrange },
  ];

  const fontSizeOptions = [
    { id: 'small', name: 'Small', scale: 0.85 },
    { id: 'medium', name: 'Medium', scale: 1.0 },
    { id: 'large', name: 'Large', scale: 1.15 },
    { id: 'xlarge', name: 'Extra Large', scale: 1.3 },
  ];

  const fontOptions = [
    { id: 'inter', name: 'Inter', sample: 'Aa', description: 'Modern, clean sans-serif' },
    { id: 'roboto', name: 'Roboto', sample: 'Aa', description: 'Android default' },
    { id: 'opensans', name: 'Open Sans', sample: 'Aa', description: 'Highly readable' },
    { id: 'montserrat', name: 'Montserrat', sample: 'Aa', description: 'Geometric sans-serif' },
    { id: 'serif', name: 'Serif', sample: 'Aa', description: 'Traditional, elegant' },
    { id: 'monospace', name: 'Monospace', sample: 'Aa', description: 'Code-style font' },
  ];

  const handleThemeSelect = (themeId) => {
    setSelectedTheme(themeId);
    if (themeId === 'dark') {
      setDarkMode(true);
    } else if (themeId === 'light') {
      setDarkMode(false);
    }
  };

  const handleSave = () => {
    Alert.alert(
      'Theme Updated',
      'Your theme preferences have been saved.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Theme',
      'Reset all theme settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: () => {
            setSelectedTheme('light');
            setAccentColor('saffron');
            setDarkMode(false);
            setHighContrast(false);
            setReduceMotion(false);
            setFontSize('medium');
            setFontFamily('inter');
          },
        },
      ]
    );
  };

  const renderPreview = () => {
    const previewColors = {
      background: darkMode ? '#1A1A1A' : colors.backgroundWhite,
      card: darkMode ? '#2A2A2A' : colors.cardBeige,
      text: darkMode ? '#FFFFFF' : colors.textPrimary,
    };

    const accent = accentColors.find(c => c.id === accentColor)?.color || colors.primarySaffron;

    return (
      <View style={[styles.previewContainer, { backgroundColor: previewColors.background }]}>
        <View style={[styles.previewCard, { backgroundColor: previewColors.card }]}>
          <View style={[styles.previewHeader, { borderBottomColor: accent }]}>
            <Text style={[styles.previewTitle, { color: previewColors.text }]}>Preview</Text>
            <View style={[styles.previewAccent, { backgroundColor: accent }]} />
          </View>
          
          <View style={styles.previewContent}>
            <View style={[styles.previewIcon, { backgroundColor: `${accent}20` }]}>
              <Ionicons name="heart" size={24} color={accent} />
            </View>
            <View style={styles.previewText}>
              <Text style={[styles.previewName, { color: previewColors.text }]}>Heart Rate</Text>
              <Text style={[styles.previewValue, { color: accent }]}>72 bpm</Text>
            </View>
          </View>

          <View style={[styles.previewButton, { backgroundColor: accent }]}>
            <Text style={styles.previewButtonText}>Sample Button</Text>
          </View>
        </View>
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
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Theme Settings</Text>
          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
            <Ionicons name="refresh" size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* Live Preview */}
        {renderPreview()}

        {/* Theme Selection */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Theme</Text>
          
          <View style={styles.themeGrid}>
            {themes.map((theme) => (
              <TouchableOpacity
                key={theme.id}
                style={[
                  styles.themeOption,
                  selectedTheme === theme.id && styles.themeOptionActive,
                ]}
                onPress={() => handleThemeSelect(theme.id)}
              >
                <LinearGradient
                  colors={theme.colors}
                  style={styles.themePreview}
                >
                  <Ionicons 
                    name={theme.icon} 
                    size={24} 
                    color={selectedTheme === theme.id ? accentColor : colors.textSecondary} 
                  />
                </LinearGradient>
                <Text style={[
                  styles.themeName,
                  selectedTheme === theme.id && styles.themeNameActive,
                ]}>
                  {theme.name}
                </Text>
                <Text style={styles.themeDescription}>{theme.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Accent Color */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Accent Color</Text>
          
          <View style={styles.colorGrid}>
            {accentColors.map((color) => (
              <TouchableOpacity
                key={color.id}
                style={[
                  styles.colorOption,
                  { backgroundColor: color.color },
                  accentColor === color.id && styles.colorOptionActive,
                ]}
                onPress={() => setAccentColor(color.id)}
              >
                {accentColor === color.id && (
                  <Ionicons name="checkmark" size={20} color="white" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Font Size */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Font Size</Text>
          
          <View style={styles.fontSizeGrid}>
            {fontSizeOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.fontSizeOption,
                  fontSize === option.id && styles.fontSizeOptionActive,
                ]}
                onPress={() => setFontSize(option.id)}
              >
                <Text style={[
                  styles.fontSizeText,
                  fontSize === option.id && styles.fontSizeTextActive,
                ]}>
                  Aa
                </Text>
                <Text style={[
                  styles.fontSizeName,
                  fontSize === option.id && styles.fontSizeNameActive,
                ]}>
                  {option.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Font Family */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Font Family</Text>
          
          {fontOptions.map((font) => (
            <TouchableOpacity
              key={font.id}
              style={[
                styles.fontOption,
                fontFamily === font.id && styles.fontOptionActive,
              ]}
              onPress={() => setFontFamily(font.id)}
            >
              <View style={styles.fontLeft}>
                <Text style={styles.fontSample}>{font.sample}</Text>
                <View>
                  <Text style={styles.fontName}>{font.name}</Text>
                  <Text style={styles.fontDescription}>{font.description}</Text>
                </View>
              </View>
              {fontFamily === font.id && (
                <Ionicons name="checkmark" size={20} color={colors.successGreen} />
              )}
            </TouchableOpacity>
          ))}
        </Card>

        {/* Accessibility Settings */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Accessibility</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="contrast" size={20} color={colors.textSecondary} />
              <Text style={styles.settingLabel}>High Contrast</Text>
            </View>
            <Switch
              value={highContrast}
              onValueChange={setHighContrast}
              trackColor={{ false: colors.disabled, true: colors.primarySaffron }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="leaf" size={20} color={colors.textSecondary} />
              <Text style={styles.settingLabel}>Reduce Motion</Text>
            </View>
            <Switch
              value={reduceMotion}
              onValueChange={setReduceMotion}
              trackColor={{ false: colors.disabled, true: colors.primarySaffron }}
            />
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Save Changes"
            onPress={handleSave}
            style={styles.saveButton}
            gradient
          />
          <Button
            title="Preview Theme"
            onPress={() => {}}
            style={styles.previewButton}
            outline
          />
        </View>

        {/* Note */}
        <Text style={styles.note}>
          Theme changes will be applied immediately. Some settings may require app restart.
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
  resetButton: {
    padding: 8,
  },
  previewContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  previewCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
  },
  previewTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  previewAccent: {
    width: 30,
    height: 4,
    borderRadius: 2,
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  previewText: {
    flex: 1,
  },
  previewName: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    marginBottom: 2,
  },
  previewValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  previewButton: {
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  previewButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: 'white',
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
  themeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  themeOptionActive: {
    transform: [{ scale: 1.05 }],
  },
  themePreview: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  themeName: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  themeNameActive: {
    color: colors.primarySaffron,
  },
  themeDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 9,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionActive: {
    borderColor: colors.textPrimary,
    transform: [{ scale: 1.1 }],
  },
  fontSizeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fontSizeOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
  },
  fontSizeOptionActive: {
    backgroundColor: colors.primarySaffron,
    borderColor: colors.primarySaffron,
  },
  fontSizeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  fontSizeTextActive: {
    color: 'white',
  },
  fontSizeName: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textSecondary,
  },
  fontSizeNameActive: {
    color: 'white',
  },
  fontOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  fontLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fontSample: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.textPrimary,
    width: 40,
    marginRight: 12,
  },
  fontName: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  fontDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 16,
  },
  saveButton: {
    flex: 1,
    marginRight: 8,
  },
  previewButton: {
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

export default ThemeScreen;