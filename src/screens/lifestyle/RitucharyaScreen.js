import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const { width } = Dimensions.get('window');

const RitucharyaScreen = () => {
  const navigation = useNavigation();

  // State for selected season
  const [selectedSeason, setSelectedSeason] = useState('spring');
  const [currentSeason, setCurrentSeason] = useState('spring');

  // Season data
  const seasons = [
    { 
      id: 'spring', 
      name: 'Spring (Vasant)', 
      sanskrit: 'Vasant Rutu',
      months: 'March - May',
      dosha: 'Kapha',
      color: colors.primaryGreen,
      icon: 'flower',
      description: 'Kapha accumulates in winter and aggravates in spring. Time for detox and light foods.',
    },
    { 
      id: 'summer', 
      name: 'Summer (Grishma)', 
      sanskrit: 'Grishma Rutu',
      months: 'June - August',
      dosha: 'Pitta',
      color: colors.tempOrange,
      icon: 'sunny',
      description: 'Pitta accumulates and aggravates. Stay cool, avoid spicy foods, and hydrate.',
    },
    { 
      id: 'monsoon', 
      name: 'Monsoon (Varsha)', 
      sanskrit: 'Varsha Rutu',
      months: 'September - October',
      dosha: 'Vata',
      color: colors.spO2Blue,
      icon: 'rainy',
      description: 'Vata accumulates. Digestive fire weakens. Eat warm, cooked foods.',
    },
    { 
      id: 'autumn', 
      name: 'Autumn (Sharad)', 
      sanskrit: 'Sharad Rutu',
      months: 'November - December',
      dosha: 'Pitta',
      color: colors.warningYellow,
      icon: 'leaf',
      description: 'Pitta aggravates. Sweet, bitter tastes. Avoid fermented foods.',
    },
    { 
      id: 'earlyWinter', 
      name: 'Early Winter (Hemant)', 
      sanskrit: 'Hemant Rutu',
      months: 'January - February',
      dosha: 'Vata',
      color: colors.stressPurple,
      icon: 'snow',
      description: 'Vata accumulates. Strong digestion. Nourishing, warm foods.',
    },
    { 
      id: 'lateWinter', 
      name: 'Late Winter (Shishir)', 
      sanskrit: 'Shishir Rutu',
      months: 'February - March',
      dosha: 'Kapha',
      color: colors.heartRate,
      icon: 'snow',
      description: 'Kapha accumulates. Warm, light foods. Stay active.',
    },
  ];

  // Get current season based on date
  React.useEffect(() => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) setCurrentSeason('spring');
    else if (month >= 5 && month <= 7) setCurrentSeason('summer');
    else if (month >= 8 && month <= 9) setCurrentSeason('monsoon');
    else if (month >= 10 && month <= 11) setCurrentSeason('autumn');
    else if (month === 0 || month === 1) setCurrentSeason('earlyWinter');
    else setCurrentSeason('spring');
    
    setSelectedSeason(currentSeason);
  }, []);

  const selectedSeasonData = seasons.find(s => s.id === selectedSeason) || seasons[0];
  const currentSeasonData = seasons.find(s => s.id === currentSeason) || seasons[0];

  // Seasonal guidelines
  const seasonalGuidelines = {
    spring: {
      diet: [
        'Light, dry, warm foods',
        'Barley, millet, corn',
        'Honey instead of sugar',
        'Bitter greens (kale, dandelion)',
        'Avoid heavy, oily, cold foods',
      ],
      lifestyle: [
        'Wake up before sunrise',
        'Vigorous exercise',
        'Dry brushing',
        'Neti pot for sinuses',
        'Avoid daytime sleep',
      ],
      herbs: ['Turmeric', 'Ginger', 'Black pepper', 'Neem', 'Triphala'],
      yoga: ['Sun salutations', 'Twists', 'Backbends'],
    },
    summer: {
      diet: [
        'Cool, liquid, sweet foods',
        'Fresh fruits (melons, grapes)',
        'Cucumber, zucchini',
        'Coconut water',
        'Avoid spicy, oily, fermented',
      ],
      lifestyle: [
        'Stay in cool places',
        'Avoid midday sun',
        'Swimming',
        'Wear light colors',
        'Rose water for eyes',
      ],
      herbs: ['Coriander', 'Fennel', 'Mint', 'Shatavari', 'Aloe vera'],
      yoga: ['Forward bends', 'Moon salutations', 'Restorative poses'],
    },
    monsoon: {
      diet: [
        'Warm, cooked, light foods',
        'Rice, barley, mung dal',
        'Vegetable soups',
        'Ginger tea',
        'Avoid raw vegetables',
      ],
      lifestyle: [
        'Stay dry and warm',
        'Avoid getting wet in rain',
        'Oil massage',
        'Nasya (nasal oil)',
        'Boost immunity',
      ],
      herbs: ['Ginger', 'Tulsi', 'Cinnamon', 'Pippali', 'Chyawanprash'],
      yoga: ['Standing poses', 'Chest openers', 'Pranayama'],
    },
    autumn: {
      diet: [
        'Sweet, bitter, astringent',
        'Rice, wheat, mung dal',
        'Pumpkin, sweet potatoes',
        'Ghee',
        'Avoid fermented foods',
      ],
      lifestyle: [
        'Oil massage with cooling oils',
        'Moonlight walks',
        'Moderate exercise',
        'Early to bed',
        'Abhyanga',
      ],
      herbs: ['Shatavari', 'Licorice', 'Ashwagandha', 'Brahmi', 'Neem'],
      yoga: ['Cooling pranayama', 'Gentle flow', 'Meditation'],
    },
    earlyWinter: {
      diet: [
        'Warm, nourishing, heavy',
        'Whole grains, root vegetables',
        'Nuts, seeds',
        'Warm milk with spices',
        'Sesame, ghee',
      ],
      lifestyle: [
        'Abhyanga with warm oils',
        'Sunbathing',
        'Staying warm',
        'Regular routine',
        'Strong exercise',
      ],
      herbs: ['Ashwagandha', 'Bala', 'Ginger', 'Cinnamon', 'Licorice'],
      yoga: ['Vigorous practice', 'Sun salutations', 'Backbends'],
    },
    lateWinter: {
      diet: [
        'Light, warm, dry',
        'Barley, corn, millet',
        'Steamed vegetables',
        'Honey',
        'Avoid cold drinks',
      ],
      lifestyle: [
        'Early rising',
        'Active exercise',
        'Dry brushing',
        'Avoid heavy sleep',
        'Spring cleaning',
      ],
      herbs: ['Ginger', 'Turmeric', 'Pippali', 'Tulsi', 'Triphala'],
      yoga: ['Fast-paced flow', 'Twists', 'Kapalabhati'],
    },
  };

  const guidelines = seasonalGuidelines[selectedSeason] || seasonalGuidelines.spring;

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
          <Text style={styles.headerTitle}>Ritucharya</Text>
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="calendar" size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* Current Season Banner */}
        <LinearGradient
          colors={[currentSeasonData.color, `${currentSeasonData.color}CC`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.currentSeasonBanner}
        >
          <View style={styles.currentSeasonContent}>
            <Text style={styles.currentSeasonLabel}>Current Season</Text>
            <Text style={styles.currentSeasonName}>{currentSeasonData.name}</Text>
            <Text style={styles.currentSeasonMonths}>{currentSeasonData.months}</Text>
            <View style={styles.currentSeasonDosha}>
              <Text style={styles.currentSeasonDoshaText}>
                Dominant Dosha: {currentSeasonData.dosha}
              </Text>
            </View>
          </View>
          <Ionicons name={currentSeasonData.icon} size={60} color="white" />
        </LinearGradient>

        {/* Season Selector */}
        <Text style={styles.sectionTitle}>Explore Seasons</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.seasonScroll}
        >
          {seasons.map((season) => (
            <TouchableOpacity
              key={season.id}
              style={[
                styles.seasonCard,
                selectedSeason === season.id && { borderColor: season.color, borderWidth: 2 }
              ]}
              onPress={() => setSelectedSeason(season.id)}
            >
              <View style={[styles.seasonIcon, { backgroundColor: `${season.color}20` }]}>
                <Ionicons name={season.icon} size={24} color={season.color} />
              </View>
              <Text style={styles.seasonName}>{season.name}</Text>
              <Text style={styles.seasonMonths}>{season.months}</Text>
              <View style={[styles.seasonDoshaBadge, { backgroundColor: season.color }]}>
                <Text style={styles.seasonDoshaText}>{season.dosha}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Selected Season Details */}
        <Card style={styles.seasonDetailCard}>
          <View style={styles.seasonDetailHeader}>
            <View>
              <Text style={styles.seasonDetailName}>{selectedSeasonData.name}</Text>
              <Text style={styles.seasonDetailSanskrit}>{selectedSeasonData.sanskrit}</Text>
            </View>
            <View style={[styles.seasonDetailBadge, { backgroundColor: selectedSeasonData.color }]}>
              <Text style={styles.seasonDetailBadgeText}>{selectedSeasonData.dosha}</Text>
            </View>
          </View>
          
          <Text style={styles.seasonDetailDescription}>{selectedSeasonData.description}</Text>
        </Card>

        {/* Diet Recommendations */}
        <Card style={styles.guidelineCard}>
          <View style={styles.guidelineHeader}>
            <Ionicons name="restaurant" size={24} color={colors.primarySaffron} />
            <Text style={styles.guidelineTitle}>Diet Recommendations</Text>
          </View>
          
          {guidelines.diet.map((item, index) => (
            <View key={index} style={styles.guidelineItem}>
              <Ionicons name="checkmark-circle" size={18} color={colors.successGreen} />
              <Text style={styles.guidelineItemText}>{item}</Text>
            </View>
          ))}
        </Card>

        {/* Lifestyle Recommendations */}
        <Card style={styles.guidelineCard}>
          <View style={styles.guidelineHeader}>
            <Ionicons name="fitness" size={24} color={colors.primaryGreen} />
            <Text style={styles.guidelineTitle}>Lifestyle Recommendations</Text>
          </View>
          
          {guidelines.lifestyle.map((item, index) => (
            <View key={index} style={styles.guidelineItem}>
              <Ionicons name="checkmark-circle" size={18} color={colors.successGreen} />
              <Text style={styles.guidelineItemText}>{item}</Text>
            </View>
          ))}
        </Card>

        {/* Herbs & Yoga */}
        <View style={styles.rowContainer}>
          <Card style={[styles.halfCard, styles.herbsCard]}>
            <View style={styles.guidelineHeader}>
              <Ionicons name="leaf" size={24} color={colors.primaryGreen} />
              <Text style={styles.guidelineTitle}>Beneficial Herbs</Text>
            </View>
            
            {guidelines.herbs.map((herb, index) => (
              <View key={index} style={styles.herbItem}>
                <Ionicons name="leaf" size={14} color={colors.primaryGreen} />
                <Text style={styles.herbText}>{herb}</Text>
              </View>
            ))}
          </Card>

          <Card style={[styles.halfCard, styles.yogaCard]}>
            <View style={styles.guidelineHeader}>
              <Ionicons name="body" size={24} color={colors.stressPurple} />
              <Text style={styles.guidelineTitle}>Yoga Practices</Text>
            </View>
            
            {guidelines.yoga.map((pose, index) => (
              <View key={index} style={styles.yogaItem}>
                <Ionicons name="fitness" size={14} color={colors.stressPurple} />
                <Text style={styles.yogaText}>{pose}</Text>
              </View>
            ))}
          </Card>
        </View>

        {/* Seasonal Calendar */}
        <Card style={styles.calendarCard}>
          <Text style={styles.calendarTitle}>Seasonal Calendar</Text>
          
          <View style={styles.calendarGrid}>
            <View style={styles.calendarRow}>
              <View style={[styles.calendarCell, { backgroundColor: colors.primaryGreen }]}>
                <Text style={styles.calendarMonth}>Mar-May</Text>
                <Text style={styles.calendarSeason}>Spring</Text>
              </View>
              <View style={[styles.calendarCell, { backgroundColor: colors.tempOrange }]}>
                <Text style={styles.calendarMonth}>Jun-Aug</Text>
                <Text style={styles.calendarSeason}>Summer</Text>
              </View>
            </View>
            
            <View style={styles.calendarRow}>
              <View style={[styles.calendarCell, { backgroundColor: colors.spO2Blue }]}>
                <Text style={styles.calendarMonth}>Sep-Oct</Text>
                <Text style={styles.calendarSeason}>Monsoon</Text>
              </View>
              <View style={[styles.calendarCell, { backgroundColor: colors.warningYellow }]}>
                <Text style={styles.calendarMonth}>Nov-Dec</Text>
                <Text style={styles.calendarSeason}>Autumn</Text>
              </View>
            </View>
            
            <View style={styles.calendarRow}>
              <View style={[styles.calendarCell, { backgroundColor: colors.stressPurple }]}>
                <Text style={styles.calendarMonth}>Jan-Feb</Text>
                <Text style={styles.calendarSeason}>Early Winter</Text>
              </View>
              <View style={[styles.calendarCell, { backgroundColor: colors.heartRate }]}>
                <Text style={styles.calendarMonth}>Feb-Mar</Text>
                <Text style={styles.calendarSeason}>Late Winter</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Ayurvedic Wisdom */}
        <Card style={styles.wisdomCard}>
          <Ionicons name="leaf" size={30} color={colors.primaryGreen} />
          <Text style={styles.wisdomTitle}>Ayurvedic Wisdom</Text>
          <Text style={styles.wisdomText}>
            "Ritucharya, the seasonal routine, helps you align with nature's rhythms. 
            By adapting your diet and lifestyle to each season, you prevent disease 
            and maintain optimal health throughout the year."
          </Text>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Set Reminders"
            onPress={() => {}}
            style={styles.reminderButton}
            gradient
            icon="notifications-outline"
          />
          <Button
            title="Learn More"
            onPress={() => {}}
            style={styles.learnButton}
            outline
            icon="book-outline"
          />
        </View>
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
  infoButton: {
    padding: 8,
  },
  currentSeasonBanner: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentSeasonContent: {
    flex: 1,
  },
  currentSeasonLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'white',
    opacity: 0.9,
    marginBottom: 4,
  },
  currentSeasonName: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: 'white',
    marginBottom: 2,
  },
  currentSeasonMonths: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginBottom: 8,
  },
  currentSeasonDosha: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  currentSeasonDoshaText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'white',
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  seasonScroll: {
    marginBottom: 16,
  },
  seasonCard: {
    width: 140,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  seasonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  seasonName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
  },
  seasonMonths: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
    marginBottom: 6,
  },
  seasonDoshaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  seasonDoshaText: {
    fontFamily: 'Inter-Medium',
    fontSize: 9,
    color: 'white',
  },
  seasonDetailCard: {
    padding: 16,
    marginBottom: 16,
  },
  seasonDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seasonDetailName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  seasonDetailSanskrit: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
  seasonDetailBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  seasonDetailBadgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: 'white',
  },
  seasonDetailDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  guidelineCard: {
    padding: 16,
    marginBottom: 16,
  },
  guidelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  guidelineTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  guidelineItemText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfCard: {
    width: '48%',
    padding: 16,
  },
  herbsCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.02)',
  },
  yogaCard: {
    backgroundColor: 'rgba(155, 107, 158, 0.02)',
  },
  herbItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  herbText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  yogaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  yogaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  calendarCard: {
    padding: 16,
    marginBottom: 16,
  },
  calendarTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  calendarGrid: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  calendarRow: {
    flexDirection: 'row',
  },
  calendarCell: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  calendarMonth: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: 'white',
    marginBottom: 2,
  },
  calendarSeason: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: 'white',
    opacity: 0.9,
  },
  wisdomCard: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  wisdomTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  wisdomText: {
    fontFamily: 'Inter-Italic',
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  reminderButton: {
    flex: 1,
    marginRight: 8,
  },
  learnButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default RitucharyaScreen;