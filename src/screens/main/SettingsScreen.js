import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import Card from '../../components/common/Card';
import { useApp } from '../../context/AppContext';

const SettingsScreen = ({ navigation }) => {
  const { logout } = useApp();

  const [notifications, setNotifications] = useState(true);
  const [alertNotif, setAlertNotif] = useState(true);
  const [doshaNotif, setDoshaNotif] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [units, setUnits] = useState('metric');
  const [language, setLanguage] = useState('English');
  const [darkMode, setDarkMode] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [biometric, setBiometric] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: logout, style: 'destructive' },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert('Delete Account', 'This will permanently delete your account and all data. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Info', 'Account deletion would be processed here.') },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={COLORS.gradient.saffron} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <Card variant="elevated">
          <SettingToggle icon=""label="Push Notifications"value={notifications} onChange={setNotifications} />
          <SettingToggle icon=""label="Health Alert Notifications"value={alertNotif} onChange={setAlertNotif} />
          <SettingToggle icon=""label="Dosha Imbalance Alerts"value={doshaNotif} onChange={setDoshaNotif} />
          <SettingToggle icon=""label="Weekly Report Notifications"value={weeklyReport} onChange={setWeeklyReport} />
        </Card>

        {/* Display */}
        <Text style={styles.sectionTitle}>Display</Text>
        <Card variant="elevated">
          <SettingToggle icon=""label="Dark Mode"value={darkMode} onChange={setDarkMode} />
          <SettingRow icon=""label="Units"value={units} onPress={() => setUnits(units === 'metric' ? 'imperial' : 'metric')} />
          <SettingRow icon=""label="Language"value={language} onPress={() => {}} />
        </Card>

        {/* Data & Privacy */}
        <Text style={styles.sectionTitle}>Data & Privacy</Text>
        <Card variant="elevated">
          <SettingToggle icon=""label="Auto Sync Data"value={autoSync} onChange={setAutoSync} />
          <SettingToggle icon=""label="Anonymous Data Sharing"value={dataSharing} onChange={setDataSharing} />
          <SettingToggle icon=""label="Biometric Login"value={biometric} onChange={setBiometric} />
          <SettingRow icon=""label="Export Health Data"value=""onPress={() => Alert.alert('Export', 'Your health data export would be generated here.')} />
        </Card>

        {/* App Info */}
        <Text style={styles.sectionTitle}>App Info</Text>
        <Card variant="elevated">
          <InfoRow icon=""label="App Version"value="1.0.0" />
          <InfoRow icon=""label="Build"value="2026.04.13" />
          <InfoRow icon=""label="Terms of Service"value=""onPress={() => {}} />
          <InfoRow icon=""label="Privacy Policy"value=""onPress={() => {}} />
          <InfoRow icon=""label="Open Source Licenses"value=""onPress={() => {}} />
        </Card>

        {/* Account Actions */}
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnIcon}></Text>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
          <Text style={styles.deleteBtnIcon}></Text>
          <Text style={styles.deleteBtnText}>Delete Account</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          This app provides preventive health insights and does not replace professional medical advice.
        </Text>
      </View>
    </ScrollView>
  );
};

const SettingToggle = ({ icon, label, value, onChange }) => (
  <View style={styles.settingRow}>
    <Text style={styles.settingIcon}>{icon}</Text>
    <Text style={styles.settingLabel}>{label}</Text>
    <Switch value={value} onValueChange={onChange}
      trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
      thumbColor={value ? COLORS.primary : '#f4f3f4'} />
  </View>
);

const SettingRow = ({ icon, label, value, onPress }) => (
  <TouchableOpacity style={styles.settingRow} onPress={onPress}>
    <Text style={styles.settingIcon}>{icon}</Text>
    <Text style={styles.settingLabel}>{label}</Text>
    <Text style={styles.settingValue}>{value}</Text>
    <Text style={styles.settingArrow}>›</Text>
  </TouchableOpacity>
);

const InfoRow = ({ icon, label, value, onPress }) => (
  <TouchableOpacity style={styles.settingRow} onPress={onPress} disabled={!onPress}>
    <Text style={styles.settingIcon}>{icon}</Text>
    <Text style={styles.settingLabel}>{label}</Text>
    <Text style={styles.settingValue}>{value}</Text>
    {onPress && <Text style={styles.settingArrow}>›</Text>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: SIZES.screenPadding, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  backBtn: { marginBottom: 6 },
  backText: { fontSize: 14, color: '#FFFFFFCC', fontWeight: '600' },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#FFF' },
  content: { paddingHorizontal: SIZES.screenPadding, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 22, marginBottom: 10 },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: COLORS.border, gap: 10 },
  settingIcon: { fontSize: 18 },
  settingLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: COLORS.text },
  settingValue: { fontSize: 14, fontWeight: '600', color: COLORS.primary },
  settingArrow: { fontSize: 22, color: COLORS.textLight },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 14, borderRadius: SIZES.borderRadius, backgroundColor: COLORS.surface,
    borderWidth: 1.5, borderColor: COLORS.warning, ...SHADOWS.small,
  },
  logoutBtnIcon: { fontSize: 20 },
  logoutBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.warning },
  deleteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 14, borderRadius: SIZES.borderRadius, backgroundColor: '#FFF5F5',
    borderWidth: 1.5, borderColor: COLORS.error, marginTop: 12,
  },
  deleteBtnIcon: { fontSize: 20 },
  deleteBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.error },
  disclaimer: { fontSize: 10, color: COLORS.textLight, textAlign: 'center', marginTop: 24, lineHeight: 14 },
});

export default SettingsScreen;
