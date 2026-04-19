import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const EducationDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { article } = route.params || {};

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(124);

  // If no article data, show error
  if (!article) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={60} color={colors.alertRed} />
        <Text style={styles.errorText}>Article not found</Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          style={styles.errorButton}
        />
      </View>
    );
  }

  // Mock article content based on article ID
  const getArticleContent = () => {
    switch(article.id) {
      case 'f1':
      case '1':
        return {
          content: `
            <h2>What is Prakriti?</h2>
            <p>Prakriti is your unique mind-body constitution determined at conception. It remains constant throughout your life and influences your physical, mental, and emotional characteristics.</p>
            
            <h3>The Three Doshas</h3>
            <p>Your Prakriti is composed of three doshas in varying proportions:</p>
            
            <h4>Vata (Air & Space)</h4>
            <p>Governs movement, creativity, and communication. When balanced, Vata types are energetic and creative. When imbalanced, they may experience anxiety, dry skin, and irregular digestion.</p>
            
            <h4>Pitta (Fire & Water)</h4>
            <p>Governs transformation, metabolism, and intellect. Balanced Pitta leads to sharp intelligence and warm personality. Imbalance can cause irritability, inflammation, and acidity.</p>
            
            <h4>Kapha (Water & Earth)</h4>
            <p>Governs structure, stability, and lubrication. Balanced Kapha brings calmness and strength. Imbalance may lead to lethargy, weight gain, and congestion.</p>
            
            <h3>Determining Your Prakriti</h3>
            <p>Your Prakriti can be determined through our comprehensive quiz that analyzes your physical characteristics, mental tendencies, and behavioral patterns. Understanding your Prakriti helps you make lifestyle choices that maintain balance and prevent disease.</p>
          `,
          relatedArticles: [
            { id: '2', title: 'Understanding Vata Dosha', readTime: '5 min' },
            { id: '3', title: 'Pitta Dosha Explained', readTime: '4 min' },
            { id: '4', title: 'Kapha Dosha Guide', readTime: '6 min' },
          ],
          references: [
            'Charaka Samhita, Sutrasthana 1:20',
            'Ashtanga Hridayam, Sutrasthana 1:10',
            'Modern Ayurvedic Research Journal, 2023',
          ],
        };
      
      case 'f2':
      case '5':
        return {
          content: `
            <h2>The Six Tastes in Ayurveda</h2>
            <p>Ayurveda recognizes six tastes (Rasas) that are essential for complete nutrition and dosha balance. Each taste has specific qualities and effects on the body.</p>
            
            <h3>Sweet (Madhura)</h3>
            <p>Found in sugars, grains, dairy, and sweet fruits. Builds tissues, calms nerves, and provides energy. Best for Vata and Pitta, but can aggravate Kapha.</p>
            
            <h3>Sour (Amla)</h3>
            <p>Found in citrus fruits, yogurt, and fermented foods. Stimulates digestion and appetite. Benefits Vata, but can aggravate Pitta and Kapha.</p>
            
            <h3>Salty (Lavana)</h3>
            <p>Found in salt, seaweed, and salty foods. Improves taste, aids digestion, and maintains electrolyte balance. Benefits Vata, but aggravates Pitta and Kapha.</p>
            
            <h3>Pungent (Katu)</h3>
            <p>Found in chili peppers, ginger, and spicy foods. Stimulates digestion and clears sinuses. Benefits Kapha, but aggravates Vata and Pitta.</p>
            
            <h3>Bitter (Tikta)</h3>
            <p>Found in bitter greens, turmeric, and coffee. Detoxifies and reduces inflammation. Benefits Pitta and Kapha, but can aggravate Vata.</p>
            
            <h3>Astringent (Kashaya)</h3>
            <p>Found in legumes, raw bananas, and pomegranates. Absorbs water and promotes healing. Benefits Pitta and Kapha, but aggravates Vata.</p>
            
            <h3>Including All Tastes</h3>
            <p>For optimal health, include all six tastes in your daily meals. The proportion of each taste should be adjusted according to your dominant dosha and current imbalances.</p>
          `,
          relatedArticles: [
            { id: '1', title: 'Understanding Your Prakriti', readTime: '5 min' },
            { id: '7', title: 'Digestive Health in Ayurveda', readTime: '6 min' },
            { id: '5', title: 'Seasonal Eating Guide', readTime: '5 min' },
          ],
          references: [
            'Charaka Samhita, Vimana Sthana 1:15',
            'Sushruta Samhita, Sutrasthana 42',
            'Ayurvedic Nutrition Textbook, 2022',
          ],
        };
      
      default:
        return {
          content: `
            <h2>${article.title}</h2>
            <p>${article.excerpt}</p>
            <p>This comprehensive guide explores the principles of Ayurveda and how they apply to modern life. Understanding these concepts helps you make informed decisions about your health and wellness.</p>
            
            <h3>Key Principles</h3>
            <p>Ayurveda is based on the understanding that health is a state of balance between body, mind, and consciousness. The five great elements (ether, air, fire, water, earth) combine to form the three doshas that govern all biological processes.</p>
            
            <h3>Practical Applications</h3>
            <p>Applying Ayurvedic principles to daily life involves understanding your unique constitution, eating according to the seasons, maintaining a consistent daily routine, and using herbs and therapies to maintain balance.</p>
          `,
          relatedArticles: [
            { id: '1', title: 'Understanding Your Prakriti', readTime: '5 min' },
            { id: '2', title: 'Understanding Vata Dosha', readTime: '5 min' },
            { id: '6', title: 'Yoga Poses for Each Dosha', readTime: '8 min' },
          ],
          references: [
            'Ayurveda: The Science of Self-Healing',
            'The Complete Book of Ayurvedic Home Remedies',
          ],
        };
    }
  };

  const content = getArticleContent();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this article: ${article.title} from AyurTwin app!`,
        title: 'AyurTwin Article',
      });
    } catch (error) {
      console.error('Share failed', error);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    Alert.alert(
      isBookmarked ? 'Bookmark Removed' : 'Article Saved',
      isBookmarked ? 'Article removed from your bookmarks' : 'Article added to your bookmarks'
    );
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
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
          <Text style={styles.headerTitle}>Article</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleBookmark} style={styles.headerAction}>
              <Ionicons 
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'} 
                size={22} 
                color={isBookmarked ? colors.primarySaffron : colors.textSecondary} 
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.headerAction}>
              <Ionicons name="share-social-outline" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Article Header */}
        <View style={styles.articleHeader}>
          <View style={[styles.articleEmojiContainer, { backgroundColor: `${article.color}20` }]}>
            <Text style={styles.articleEmoji}>{article.image}</Text>
          </View>
          
          <Text style={styles.articleTitle}>{article.title}</Text>
          
          <View style={styles.articleMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={14} color={colors.textTertiary} />
              <Text style={styles.metaText}>{article.author || 'AyurTwin Team'}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color={colors.textTertiary} />
              <Text style={styles.metaText}>{article.date || 'Mar 15, 2024'}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
              <Text style={styles.metaText}>{article.readTime} read</Text>
            </View>
          </View>

          <View style={styles.categoryTag}>
            <Text style={styles.categoryTagText}>{article.category}</Text>
          </View>
        </View>

        {/* Article Content */}
        <Card style={styles.contentCard}>
          <Text style={styles.contentText}>
            {/* Simple text rendering - in a real app, you'd use a rich text renderer */}
            {content.content.replace(/<[^>]*>/g, '')}
          </Text>
        </Card>

        {/* Key Takeaways */}
        <Card style={styles.takeawaysCard}>
          <Text style={styles.takeawaysTitle}>Key Takeaways</Text>
          
          <View style={styles.takeawayItem}>
            <Ionicons name="leaf" size={16} color={colors.primaryGreen} />
            <Text style={styles.takeawayText}>
              Your Prakriti is your unique mind-body constitution
            </Text>
          </View>
          
          <View style={styles.takeawayItem}>
            <Ionicons name="leaf" size={16} color={colors.primaryGreen} />
            <Text style={styles.takeawayText}>
              Balance is achieved through diet, lifestyle, and routines
            </Text>
          </View>
          
          <View style={styles.takeawayItem}>
            <Ionicons name="leaf" size={16} color={colors.primaryGreen} />
            <Text style={styles.takeawayText}>
              Small daily changes lead to significant health improvements
            </Text>
          </View>
        </Card>

        {/* Related Articles */}
        <Text style={styles.sectionTitle}>Related Articles</Text>
        
        {content.relatedArticles.map((relArticle, index) => (
          <TouchableOpacity
            key={index}
            style={styles.relatedArticle}
            onPress={() => navigation.push(ROUTES.EDUCATION_DETAIL, { 
              article: { ...relArticle, color: article.color } 
            })}
          >
            <View style={styles.relatedArticleContent}>
              <Text style={styles.relatedArticleTitle}>{relArticle.title}</Text>
              <Text style={styles.relatedArticleMeta}>{relArticle.readTime} read</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}

        {/* References */}
        <Card style={styles.referencesCard}>
          <Text style={styles.referencesTitle}>References</Text>
          
          {content.references.map((ref, index) => (
            <Text key={index} style={styles.referenceText}>• {ref}</Text>
          ))}
        </Card>

        {/* Interaction Bar */}
        <View style={styles.interactionBar}>
          <TouchableOpacity style={styles.interactionButton} onPress={handleLike}>
            <Ionicons 
              name={isLiked ? 'heart' : 'heart-outline'} 
              size={24} 
              color={isLiked ? colors.heartRate : colors.textSecondary} 
            />
            <Text style={styles.interactionText}>{likesCount}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.interactionButton}>
            <Ionicons name="chatbubble-outline" size={24} color={colors.textSecondary} />
            <Text style={styles.interactionText}>12</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.interactionButton} onPress={handleBookmark}>
            <Ionicons 
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'} 
              size={24} 
              color={isBookmarked ? colors.primarySaffron : colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Take Prakriti Quiz"
            onPress={() => {}}
            style={styles.quizButton}
            gradient
            icon="help"
          />
          <Button
            title="Save Article"
            onPress={handleBookmark}
            style={styles.saveButton}
            outline
            icon="bookmark"
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
  headerActions: {
    flexDirection: 'row',
  },
  headerAction: {
    padding: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 20,
  },
  errorButton: {
    width: 200,
  },
  articleHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  articleEmojiContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  articleEmoji: {
    fontSize: 40,
  },
  articleTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  metaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginLeft: 4,
  },
  categoryTag: {
    backgroundColor: 'rgba(255, 153, 51, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryTagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.primarySaffron,
  },
  contentCard: {
    padding: 20,
    marginBottom: 16,
  },
  contentText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  takeawaysCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  takeawaysTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  takeawayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  takeawayText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 10,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 12,
  },
  relatedArticle: {
    flexDirection: 'row',
    alignItems: 'center',
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
  relatedArticleContent: {
    flex: 1,
  },
  relatedArticleTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  relatedArticleMeta: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
  },
  referencesCard: {
    padding: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  referencesTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  referenceText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
    lineHeight: 18,
  },
  interactionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  quizButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default EducationDetailScreen;