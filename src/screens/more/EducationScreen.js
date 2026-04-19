import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
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

const EducationScreen = () => {
  const navigation = useNavigation();

  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: 'apps' },
    { id: 'ayurveda', name: 'Ayurveda', icon: 'leaf', color: colors.primaryGreen },
    { id: 'dosha', name: 'Dosha', icon: 'body', color: colors.stressPurple },
    { id: 'nutrition', name: 'Nutrition', icon: 'restaurant', color: colors.tempOrange },
    { id: 'lifestyle', name: 'Lifestyle', icon: 'fitness', color: colors.heartRate },
    { id: 'yoga', name: 'Yoga', icon: 'body', color: colors.primarySaffron },
  ];

  const featuredArticles = [
    {
      id: 'f1',
      title: 'Understanding Your Prakriti',
      excerpt: 'Learn about your unique mind-body constitution and how it affects your health.',
      category: 'ayurveda',
      readTime: '5 min',
      image: '📚',
      color: colors.primaryGreen,
      featured: true,
    },
    {
      id: 'f2',
      title: 'The Six Tastes in Ayurveda',
      excerpt: 'Discover how sweet, sour, salty, pungent, bitter, and astringent tastes affect your doshas.',
      category: 'nutrition',
      readTime: '4 min',
      image: '🍎',
      color: colors.tempOrange,
      featured: true,
    },
  ];

  const articles = [
    {
      id: '1',
      title: 'Vata Dosha: The Energy of Movement',
      excerpt: 'Vata governs all movement in the body and mind. Learn to balance this airy dosha.',
      category: 'dosha',
      readTime: '6 min',
      image: '🌬️',
      color: colors.vata,
      author: 'Dr. Arya Sharma',
      date: 'Mar 15, 2024',
    },
    {
      id: '2',
      title: 'Pitta Dosha: The Fire Within',
      excerpt: 'Understand the transformative energy of Pitta and how to keep it in balance.',
      category: 'dosha',
      readTime: '5 min',
      image: '🔥',
      color: colors.pitta,
      author: 'Dr. Rajesh Kumar',
      date: 'Mar 12, 2024',
    },
    {
      id: '3',
      title: 'Kapha Dosha: The Structure of Life',
      excerpt: 'Explore the grounding energy of Kapha and tips for maintaining balance.',
      category: 'dosha',
      readTime: '7 min',
      image: '🌊',
      color: colors.kapha,
      author: 'Dr. Arya Sharma',
      date: 'Mar 10, 2024',
    },
    {
      id: '4',
      title: 'Morning Routine for Optimal Health',
      excerpt: 'Start your day right with these Ayurvedic practices for energy and clarity.',
      category: 'lifestyle',
      readTime: '4 min',
      image: '🌅',
      color: colors.warningYellow,
      author: 'Priya Singh',
      date: 'Mar 8, 2024',
    },
    {
      id: '5',
      title: 'Seasonal Eating Guide',
      excerpt: 'Learn how to adjust your diet according to the seasons for better health.',
      category: 'nutrition',
      readTime: '5 min',
      image: '🍂',
      color: colors.tempOrange,
      author: 'Vikram Mehta',
      date: 'Mar 5, 2024',
    },
    {
      id: '6',
      title: 'Yoga Poses for Each Dosha',
      excerpt: 'Specific yoga practices to balance your unique constitution.',
      category: 'yoga',
      readTime: '8 min',
      image: '🧘',
      color: colors.primarySaffron,
      author: 'Priya Singh',
      date: 'Mar 3, 2024',
    },
    {
      id: '7',
      title: 'Digestive Health in Ayurveda',
      excerpt: 'Understanding Agni (digestive fire) and how to maintain healthy digestion.',
      category: 'ayurveda',
      readTime: '6 min',
      image: '🍲',
      color: colors.primaryGreen,
      author: 'Dr. Rajesh Kumar',
      date: 'Feb 28, 2024',
    },
    {
      id: '8',
      title: 'Stress Management Through Ayurveda',
      excerpt: 'Natural techniques to reduce stress and anxiety based on your dosha.',
      category: 'lifestyle',
      readTime: '5 min',
      image: '🧘',
      color: colors.stressPurple,
      author: 'Dr. Arya Sharma',
      date: 'Feb 25, 2024',
    },
    {
      id: '9',
      title: 'Herbs for Common Ailments',
      excerpt: 'Ayurvedic herbs and their benefits for everyday health issues.',
      category: 'ayurveda',
      readTime: '7 min',
      image: '🌿',
      color: colors.primaryGreen,
      author: 'Vikram Mehta',
      date: 'Feb 22, 2024',
    },
  ];

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  const videos = [
    {
      id: 'v1',
      title: 'Introduction to Ayurveda',
      duration: '15:30',
      thumbnail: '🎥',
      views: '12K',
    },
    {
      id: 'v2',
      title: 'Dosha Quiz & Explanation',
      duration: '22:15',
      thumbnail: '🎥',
      views: '8.5K',
    },
    {
      id: 'v3',
      title: 'Morning Yoga Routine',
      duration: '18:45',
      thumbnail: '🎥',
      views: '15K',
    },
  ];

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
          <Text style={styles.headerTitle}>Education</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <LinearGradient
          colors={[colors.primarySaffron, colors.primaryGreen]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Text style={styles.heroTitle}>Ayurveda Learning Center</Text>
          <Text style={styles.heroSubtitle}>
            Discover the ancient wisdom of Ayurveda and transform your health
          </Text>
          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>Start Learning</Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </TouchableOpacity>
        </LinearGradient>

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
                selectedCategory === category.id && category.color && { backgroundColor: category.color }
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons 
                name={category.icon} 
                size={16} 
                color={selectedCategory === category.id ? 'white' : category.color || colors.textSecondary} 
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

        {/* Featured Articles */}
        {selectedCategory === 'all' && (
          <View style={styles.featuredSection}>
            <Text style={styles.sectionTitle}>Featured Articles</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {featuredArticles.map((article) => (
                <TouchableOpacity
                  key={article.id}
                  style={styles.featuredCard}
                  onPress={() => navigation.navigate(ROUTES.EDUCATION_DETAIL, { article })}
                >
                  <LinearGradient
                    colors={[article.color, `${article.color}CC`]}
                    style={styles.featuredGradient}
                  >
                    <Text style={styles.featuredEmoji}>{article.image}</Text>
                    <Text style={styles.featuredTitle}>{article.title}</Text>
                    <Text style={styles.featuredExcerpt} numberOfLines={2}>
                      {article.excerpt}
                    </Text>
                    <View style={styles.featuredFooter}>
                      <Text style={styles.featuredReadTime}>{article.readTime} read</Text>
                      <Ionicons name="arrow-forward" size={16} color="white" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Articles Grid */}
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'all' ? 'Latest Articles' : `${categories.find(c => c.id === selectedCategory)?.name} Articles`}
        </Text>

        {filteredArticles.map((article) => (
          <TouchableOpacity
            key={article.id}
            style={styles.articleCard}
            onPress={() => navigation.navigate(ROUTES.EDUCATION_DETAIL, { article })}
          >
            <View style={[styles.articleEmojiContainer, { backgroundColor: `${article.color}20` }]}>
              <Text style={styles.articleEmoji}>{article.image}</Text>
            </View>
            
            <View style={styles.articleContent}>
              <View style={styles.articleHeader}>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <View style={[styles.categoryBadge, { backgroundColor: `${article.color}20` }]}>
                  <Text style={[styles.categoryBadgeText, { color: article.color }]}>
                    {article.category}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.articleExcerpt} numberOfLines={2}>
                {article.excerpt}
              </Text>
              
              <View style={styles.articleFooter}>
                <View style={styles.articleMeta}>
                  <Ionicons name="person-outline" size={12} color={colors.textTertiary} />
                  <Text style={styles.articleMetaText}>{article.author}</Text>
                </View>
                <View style={styles.articleMeta}>
                  <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
                  <Text style={styles.articleMetaText}>{article.readTime}</Text>
                </View>
                <View style={styles.articleMeta}>
                  <Ionicons name="calendar-outline" size={12} color={colors.textTertiary} />
                  <Text style={styles.articleMetaText}>{article.date}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Video Section */}
        {selectedCategory === 'all' && (
          <View style={styles.videoSection}>
            <Text style={styles.sectionTitle}>Educational Videos</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {videos.map((video) => (
                <TouchableOpacity key={video.id} style={styles.videoCard}>
                  <View style={styles.videoThumbnail}>
                    <Text style={styles.videoEmoji}>{video.thumbnail}</Text>
                    <View style={styles.videoDuration}>
                      <Text style={styles.videoDurationText}>{video.duration}</Text>
                    </View>
                  </View>
                  <Text style={styles.videoTitle}>{video.title}</Text>
                  <Text style={styles.videoViews}>{video.views} views</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Quiz Section */}
        <Card style={styles.quizCard}>
          <View style={styles.quizHeader}>
            <Ionicons name="help-circle" size={30} color={colors.primarySaffron} />
            <View style={styles.quizInfo}>
              <Text style={styles.quizTitle}>Test Your Knowledge</Text>
              <Text style={styles.quizSubtitle}>Take the Ayurveda quiz</Text>
            </View>
          </View>
          <Text style={styles.quizDescription}>
            10 questions to assess your understanding of Ayurvedic principles
          </Text>
          <Button
            title="Start Quiz"
            onPress={() => {}}
            style={styles.quizButton}
            gradient
            icon="help"
          />
        </Card>

        {/* Newsletter */}
        <Card style={styles.newsletterCard}>
          <Text style={styles.newsletterTitle}>Stay Updated</Text>
          <Text style={styles.newsletterText}>
            Get weekly Ayurvedic tips and new articles directly in your inbox
          </Text>
          <Button
            title="Subscribe"
            onPress={() => {}}
            style={styles.newsletterButton}
            outline
            icon="mail"
          />
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
  searchButton: {
    padding: 8,
  },
  heroCard: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
  },
  heroTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: 'white',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginBottom: 20,
    lineHeight: 20,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  heroButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'white',
    marginRight: 8,
  },
  categoryScroll: {
    marginBottom: 24,
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
  featuredSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  featuredCard: {
    width: 280,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  featuredGradient: {
    padding: 20,
    height: 200,
    justifyContent: 'space-between',
  },
  featuredEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  featuredTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: 'white',
    marginBottom: 6,
  },
  featuredExcerpt: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: 'white',
    opacity: 0.9,
    lineHeight: 18,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  featuredReadTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'white',
    opacity: 0.8,
  },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  articleEmojiContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  articleEmoji: {
    fontSize: 30,
  },
  articleContent: {
    flex: 1,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  articleTitle: {
    flex: 1,
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
  },
  articleExcerpt: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  articleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  articleMetaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
    marginLeft: 4,
  },
  videoSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  videoCard: {
    width: 200,
    marginRight: 16,
  },
  videoThumbnail: {
    width: '100%',
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  videoEmoji: {
    fontSize: 40,
  },
  videoDuration: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoDurationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: 'white',
  },
  videoTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  videoViews: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
  },
  quizCard: {
    padding: 20,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 153, 51, 0.05)',
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quizInfo: {
    marginLeft: 12,
  },
  quizTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  quizSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
  },
  quizDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  quizButton: {
    marginTop: 8,
  },
  newsletterCard: {
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  newsletterTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  newsletterText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  newsletterButton: {
    width: '100%',
  },
});

export default EducationScreen;