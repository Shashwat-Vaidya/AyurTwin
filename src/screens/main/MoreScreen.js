import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import { useApp } from '../../context/AppContext';

const MAIN_TILES = [
  { icon: '👤', label: 'Profile',   screen: 'Profile' },
  { icon: '📄', label: 'Reports',   screen: 'Reports' },
  { icon: '📘', label: 'Education', screen: 'Education' },
  { icon: 'ℹ️', label: 'About',     screen: 'About' },
  { icon: '⚙️', label: 'Settings',  screen: 'Settings' },
  { icon: '❓', label: 'Help',      screen: 'Help' },
];

const QUICK_ACCESS = [
  { icon: '🔺', label: 'Dosha Details',   screen: 'DoshaDetail' },
  { icon: '🍽️', label: 'Diet',            screen: 'FoodRecommendations' },
  { icon: '🧘', label: 'Yoga',            screen: 'Yoga' },
  { icon: '🍂', label: 'Ritucharya',      screen: 'Ritucharya' },
  { icon: '⚠️', label: 'Viruddha Ahar',  screen: 'ViruddhaAhara' },
  { icon: '🛡️', label: 'Prevention',     screen: 'DiseasePrevention' },
  { icon: '👨‍👩‍👧', label: 'Family',     screen: 'Family' },
  { icon: '🏆', label: 'Leaderboard',     screen: 'Leaderboard' },
  { icon: '🌐', label: 'Community',       screen: 'Social' },
];

export default function MoreScreen({ navigation }) {
  const { logout } = useApp();

  const confirmLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: logout, style: 'destructive' },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <LinearGradient colors={COLORS.gradient.saffron} style={styles.header}>
        <Text style={styles.title}>More</Text>
        <Text style={styles.subtitle}>Profile, reports, education and quick access</Text>
      </LinearGradient>

      {/* 6 main tiles, 3 columns */}
      <View style={styles.gridWrap}>
        <View style={styles.grid}>
          {MAIN_TILES.map(item => (
            <TouchableOpacity key={item.label} style={styles.tile} activeOpacity={0.75}
              onPress={() => navigation.navigate(item.screen)}>
              <Text style={styles.tileIcon}>{item.icon}</Text>
              <Text style={styles.tileLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick access */}
      <Text style={styles.sectionTitle}>Quick Access</Text>
      <View style={styles.quickWrap}>
        {QUICK_ACCESS.map(item => (
          <TouchableOpacity key={item.label} style={styles.chip} activeOpacity={0.75}
            onPress={() => navigation.navigate(item.screen)}>
            <Text style={styles.chipIcon}>{item.icon}</Text>
            <Text style={styles.chipLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={confirmLogout} activeOpacity={0.85}>
        <Text style={styles.logoutText}>🚪  Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { padding: 24, paddingTop: 56, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  title: { fontSize: 26, fontWeight: '800', color: '#FFF' },
  subtitle: { fontSize: 13, color: '#FFFFFFCC', marginTop: 4 },
  gridWrap: { padding: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: {
    width: '31%', aspectRatio: 1, backgroundColor: '#FFF', borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
    ...SHADOWS.card,
  },
  tileIcon: { fontSize: 36, marginBottom: 6 },
  tileLabel: { fontSize: 12, fontWeight: '700', color: COLORS.text },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginHorizontal: 16, marginBottom: 8, marginTop: 4 },
  quickWrap: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16 },
  chip: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    paddingVertical: 10, paddingHorizontal: 14, borderRadius: 22, margin: 4,
    borderWidth: 1, borderColor: '#EEE',
  },
  chipIcon: { fontSize: 16, marginRight: 6 },
  chipLabel: { fontSize: 12, fontWeight: '600', color: COLORS.text },
  logoutBtn: {
    margin: 16, marginTop: 24, padding: 16, borderRadius: 14,
    backgroundColor: '#FEE2E2', alignItems: 'center',
  },
  logoutText: { color: COLORS.error, fontWeight: '700', fontSize: 15 },
});
