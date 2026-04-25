import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import { useApp } from '../../context/AppContext';

const MAIN_TILES = [
  { ion: 'person-outline',   label: 'Profile',   screen: 'Profile' },
  { ion: 'document-text-outline', label: 'Reports', screen: 'Reports' },
  { ion: 'school-outline',   label: 'Education', screen: 'Education' },
  { ion: 'information-circle-outline', label: 'About', screen: 'About' },
  { ion: 'settings-outline', label: 'Settings',  screen: 'Settings' },
  { ion: 'help-circle-outline', label: 'Help',   screen: 'Help' },
];

const QUICK_ACCESS = [
  { ion: 'triangle-outline',  label: 'Dosha Details',   screen: 'DoshaDetail' },
  { ion: 'restaurant-outline', label: 'Diet',            screen: 'FoodRecommendations' },
  { ion: 'body-outline',      label: 'Yoga',            screen: 'Yoga' },
  { ion: 'calendar-outline',  label: 'Ritucharya',      screen: 'Ritucharya' },
  { ion: 'warning-outline',   label: 'Viruddha Ahar',   screen: 'ViruddhaAhara' },
  { ion: 'shield-checkmark-outline', label: 'Prevention', screen: 'DiseasePrevention' },
  { ion: 'people-outline',    label: 'Family',          screen: 'Family' },
  { ion: 'trophy-outline',    label: 'Leaderboard',     screen: 'Leaderboard' },
  { ion: 'globe-outline',     label: 'Community',       screen: 'Social' },
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

      <View style={styles.gridWrap}>
        <View style={styles.grid}>
          {MAIN_TILES.map(item => (
            <TouchableOpacity key={item.label} style={styles.tile} activeOpacity={0.75}
              onPress={() => navigation.navigate(item.screen)}>
              <Ionicons name={item.ion} size={32} color={COLORS.primary} style={{ marginBottom: 8 }} />
              <Text style={styles.tileLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quick Access</Text>
      <View style={styles.quickWrap}>
        {QUICK_ACCESS.map(item => (
          <TouchableOpacity key={item.label} style={styles.chip} activeOpacity={0.75}
            onPress={() => navigation.navigate(item.screen)}>
            <Ionicons name={item.ion} size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
            <Text style={styles.chipLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={confirmLogout} activeOpacity={0.85}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.error} style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>Logout</Text>
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
  tileLabel: { fontSize: 12, fontWeight: '700', color: COLORS.text },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginHorizontal: 16, marginBottom: 8, marginTop: 4 },
  quickWrap: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16 },
  chip: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    paddingVertical: 10, paddingHorizontal: 14, borderRadius: 22, margin: 4,
    borderWidth: 1, borderColor: '#EEE',
  },
  chipLabel: { fontSize: 12, fontWeight: '600', color: COLORS.text },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    margin: 16, marginTop: 24, padding: 16, borderRadius: 14, backgroundColor: '#FEE2E2',
  },
  logoutText: { color: COLORS.error, fontWeight: '700', fontSize: 15 },
});
