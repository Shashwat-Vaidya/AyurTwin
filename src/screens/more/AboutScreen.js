import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const AboutScreen = () => {
  const navigation = useNavigation();

  const openLink = (url) => {
    Linking.openURL(url);
  };

  const teamMembers = [
    {
      name: 'Dr. Arya Sharma',
      role: 'Ayurvedic Consultant',
      avatar: '',
    },
    {
      name: 'Prof. Rajesh Kumar',
      role: 'Lead Researcher',
      avatar: '',
    },
    {
      name: 'Priya Singh',
      role: 'UI/UX Designer',
      avatar: '',
    },
    {
      name: 'Vikram Mehta',
      role: 'Lead Developer',
      avatar: '',
    },
  ];

  const features = [
    'Real-time health monitoring with IoT sensors',
    'AI-powered disease risk prediction',
    'Personalized Ayurvedic recommendations',
    'Dosha (Prakriti) analysis and tracking',
    '24/7 health alerts and notifications',
    'Comprehensive health reports',
    'Integration with Ayurvedic wisdom',
    'Secure data encryption',
    'Multi-device support',
    'Offline mode capability',
  ];

  const technologies = [
    { name: 'React Native Expo', icon: 'logo-react' },
    { name: 'Redux Toolkit', icon: 'swap-horizontal' },
    { name: 'TensorFlow Lite', icon: 'analytics' },
    { name: 'Victory Charts', icon: 'bar-chart' },
    { name: 'WebSocket', icon: 'wifi' },
    { name: 'Bluetooth LE', icon: 'bluetooth' },
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
            <Ionicons name="arrow-back"size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Logo and App Info */}
        <LinearGradient
          colors={[colors.primarySaffron, colors.primaryGreen]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoCard}
        >
          <View style={styles.logoContainer}>
            <Ionicons name="leaf"size={50} color="white" />
            <View style={styles.logoHeart}>
              <Ionicons name="heart"size={30} color="white" />
            </View>
          </View>
          <Text style={styles.appName}>AyurTwin</Text>
          <Text style={styles.appTagline}>Your Digital Health Twin</Text>
          <Text style={styles.appVersion}>Version 1.0.0 (Build 1234)</Text>
        </LinearGradient>

        {/* Description */}
        <Card style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>About AyurTwin</Text>
          <Text style={styles.descriptionText}>
            AyurTwin is a revolutionary health monitoring system that combines 
            ancient Ayurvedic wisdom with modern technology. Our wearable sensors 
            track your vital signs in real-time, while AI algorithms predict 
            potential health risks and provide personalized recommendations based 
            on your unique Prakriti (constitution).
          </Text>
          <Text style={styles.descriptionText}>
            Founded in 2024, our mission is to make preventive healthcare accessible 
            to everyone by blending traditional knowledge with cutting-edge innovation.
          </Text>
        </Card>

        {/* Key Features */}
        <Card style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>Key Features</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name="checkmark-circle"size={20} color={colors.successGreen} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </Card>

        {/* Our Team */}
        <Text style={styles.sectionTitle}>Our Team</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.teamScroll}>
          {teamMembers.map((member, index) => (
            <Card key={index} style={styles.teamCard}>
              <View style={styles.teamAvatar}>
                <Text style={styles.teamAvatarText}>{member.avatar}</Text>
              </View>
              <Text style={styles.teamName}>{member.name}</Text>
              <Text style={styles.teamRole}>{member.role}</Text>
            </Card>
          ))}
        </ScrollView>

        {/* Technology Stack */}
        <Card style={styles.techCard}>
          <Text style={styles.techTitle}>Technology Stack</Text>
          <View style={styles.techGrid}>
            {technologies.map((tech, index) => (
              <View key={index} style={styles.techItem}>
                <Ionicons name={tech.icon} size={24} color={colors.primarySaffron} />
                <Text style={styles.techName}>{tech.name}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Awards & Recognition */}
        <Card style={styles.awardsCard}>
          <Text style={styles.awardsTitle}>Awards & Recognition</Text>
          
          <View style={styles.awardItem}>
            <Ionicons name="trophy"size={24} color={colors.warningYellow} />
            <View style={styles.awardContent}>
              <Text style={styles.awardName}>Best Health Tech Innovation 2024</Text>
              <Text style={styles.awardOrg}>Digital Health Summit</Text>
            </View>
          </View>

          <View style={styles.awardItem}>
            <Ionicons name="medal"size={24} color={colors.primaryGreen} />
            <View style={styles.awardContent}>
              <Text style={styles.awardName}>AI for Good Award</Text>
              <Text style={styles.awardOrg}>Tech for Humanity</Text>
            </View>
          </View>

          <View style={styles.awardItem}>
            <Ionicons name="star"size={24} color={colors.primarySaffron} />
            <View style={styles.awardContent}>
              <Text style={styles.awardName}>Top 10 Startups 2024</Text>
              <Text style={styles.awardOrg}>HealthTech Magazine</Text>
            </View>
          </View>
        </Card>

        {/* Contact & Social */}
        <Card style={styles.contactCard}>
          <Text style={styles.contactTitle}>Connect With Us</Text>
          
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton} onPress={() => openLink('https://twitter.com/ayurtwin')}>
              <Ionicons name="logo-twitter"size={24} color="#1DA1F2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => openLink('https://linkedin.com/company/ayurtwin')}>
              <Ionicons name="logo-linkedin"size={24} color="#0077B5" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => openLink('https://facebook.com/ayurtwin')}>
              <Ionicons name="logo-facebook"size={24} color="#4267B2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => openLink('https://instagram.com/ayurtwin')}>
              <Ionicons name="logo-instagram"size={24} color="#E4405F" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => openLink('https://github.com/ayurtwin')}>
              <Ionicons name="logo-github"size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.contactInfo}>
            <TouchableOpacity style={styles.contactRow} onPress={() => openLink('mailto:support@ayurtwin.com')}>
              <Ionicons name="mail-outline"size={20} color={colors.primarySaffron} />
              <Text style={styles.contactText}>support@ayurtwin.com</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.contactRow} onPress={() => openLink('https://ayurtwin.com')}>
              <Ionicons name="globe-outline"size={20} color={colors.primarySaffron} />
              <Text style={styles.contactText}>www.ayurtwin.com</Text>
            </TouchableOpacity>
            
            <View style={styles.contactRow}>
              <Ionicons name="location-outline"size={20} color={colors.primarySaffron} />
              <Text style={styles.contactText}>Bangalore, India</Text>
            </View>
          </View>
        </Card>

        {/* Legal */}
        <Card style={styles.legalCard}>
          <TouchableOpacity style={styles.legalLink} onPress={() => {}}>
            <Text style={styles.legalLinkText}>Terms of Service</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.legalLink} onPress={() => {}}>
            <Text style={styles.legalLinkText}>Privacy Policy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.legalLink} onPress={() => {}}>
            <Text style={styles.legalLinkText}>Data Processing Agreement</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.legalLink} onPress={() => {}}>
            <Text style={styles.legalLinkText}>Licenses</Text>
          </TouchableOpacity>
        </Card>

        {/* Copyright */}
        <Text style={styles.copyright}>
          © 2024 AyurTwin. All rights reserved.{'\n'}
          Made with  in India
        </Text>

        {/* Rate Us Button */}
        <Button
          title="Rate AyurTwin on Play Store"onPress={() => {}}
          style={styles.rateButton}
          outline
          icon="star"
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
  logoCard: {
    alignItems: 'center',
    padding: 30,
    borderRadius: 20,
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoHeart: {
    marginLeft: -10,
    marginTop: 10,
  },
  appName: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: 'white',
    marginBottom: 4,
  },
  appTagline: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginBottom: 8,
  },
  appVersion: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'white',
    opacity: 0.7,
  },
  descriptionCard: {
    padding: 16,
    marginBottom: 16,
  },
  descriptionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  descriptionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  featuresCard: {
    padding: 16,
    marginBottom: 16,
  },
  featuresTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 10,
    flex: 1,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  teamScroll: {
    marginBottom: 16,
  },
  teamCard: {
    width: 140,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
  },
  teamAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 153, 51, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamAvatarText: {
    fontSize: 30,
  },
  teamName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  teamRole: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  techCard: {
    padding: 16,
    marginBottom: 16,
  },
  techTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  techItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
  },
  techName: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  awardsCard: {
    padding: 16,
    marginBottom: 16,
  },
  awardsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  awardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  awardContent: {
    flex: 1,
    marginLeft: 12,
  },
  awardName: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  awardOrg: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  contactCard: {
    padding: 16,
    marginBottom: 16,
  },
  contactTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.02)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
  },
  legalCard: {
    padding: 16,
    marginBottom: 16,
  },
  legalLink: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  legalLinkText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
  },
  copyright: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  rateButton: {
    marginBottom: 10,
  },
});

export default AboutScreen;