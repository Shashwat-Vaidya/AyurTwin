import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import Card from '../../components/common/Card';
import GradientButton from '../../components/common/GradientButton';

const DeviceScreen = ({ navigation }) => {
  const [autoSync, setAutoSync] = useState(true);
  const [continuousMonitoring, setContinuousMonitoring] = useState(true);
  const [heartRateAlert, setHeartRateAlert] = useState(true);
  const [spo2Alert, setSpo2Alert] = useState(true);

  // Simulated device data
  const device = {
    name: 'AyurTwin Band Pro',
    model: 'ATB-200',
    firmware: 'v2.1.0',
    battery: 85,
    status: 'Connected',
    lastSync: 'Just now',
    macAddress: 'AA:BB:CC:DD:EE:FF',
    sensors: [
      { name: 'Heart Rate', status: 'Active', icon: '' },
      { name: 'SpO2', status: 'Active', icon: '' },
      { name: 'Temperature', status: 'Active', icon: '' },
      { name: 'Accelerometer', status: 'Active', icon: '' },
      { name: 'Stress Monitor', status: 'Active', icon: '' },
    ],
  };

  const getBatteryColor = (level) => {
    if (level > 60) return COLORS.success;
    if (level > 30) return COLORS.warning;
    return COLORS.error;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={COLORS.gradient.blue} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Device</Text>
        <Text style={styles.headerSubtitle}>Health monitoring device status</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Device Status Card */}
        <Card variant="elevated"style={styles.statusCard}>
          <View style={styles.deviceHeader}>
            <View style={styles.deviceIconBox}>
              <Text style={styles.deviceIcon}>⌚</Text>
            </View>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text style={styles.deviceModel}>Model: {device.model}</Text>
            </View>
            <View style={styles.statusIndicator}>
              <View style={[styles.statusDot, { backgroundColor: COLORS.success }]} />
              <Text style={[styles.statusText, { color: COLORS.success }]}>{device.status}</Text>
            </View>
          </View>
        </Card>

        {/* Battery */}
        <Text style={styles.sectionTitle}>Battery Status</Text>
        <Card variant="elevated">
          <View style={styles.batteryRow}>
            <Text style={styles.batteryIcon}></Text>
            <View style={styles.batteryBarTrack}>
              <View style={[styles.batteryBarFill, {
                width: `${device.battery}%`,
                backgroundColor: getBatteryColor(device.battery),
              }]} />
            </View>
            <Text style={[styles.batteryPercent, { color: getBatteryColor(device.battery) }]}>{device.battery}%</Text>
          </View>
          <Text style={styles.batteryEstimate}>Estimated: ~3 days remaining</Text>
        </Card>

        {/* Sync Info */}
        <Text style={styles.sectionTitle}>Sync Status</Text>
        <Card variant="elevated">
          <InfoRow icon=""label="Last Sync"value={device.lastSync} />
          <InfoRow icon=""label="Firmware"value={device.firmware} />
          <InfoRow icon=""label="Connection"value="Bluetooth 5.0" />
          <InfoRow icon=""label="MAC Address"value={device.macAddress} />
          <GradientButton title="Sync Now"onPress={() => {}} gradient={COLORS.gradient.blue} style={styles.syncBtn} />
        </Card>

        {/* Sensors */}
        <Text style={styles.sectionTitle}>Sensors</Text>
        <Card variant="elevated">
          {device.sensors.map((sensor, i) => (
            <View key={i} style={styles.sensorRow}>
              <Text style={styles.sensorIcon}>{sensor.icon}</Text>
              <Text style={styles.sensorName}>{sensor.name}</Text>
              <View style={[styles.sensorBadge, { backgroundColor: COLORS.success + '15' }]}>
                <Text style={[styles.sensorStatus, { color: COLORS.success }]}>{sensor.status}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Device Settings */}
        <Text style={styles.sectionTitle}>Device Settings</Text>
        <Card variant="elevated">
          <SettingRow label="Auto Sync"value={autoSync} onChange={setAutoSync} />
          <SettingRow label="Continuous Monitoring"value={continuousMonitoring} onChange={setContinuousMonitoring} />
          <SettingRow label="Heart Rate Alerts"value={heartRateAlert} onChange={setHeartRateAlert} />
          <SettingRow label="SpO2 Alerts"value={spo2Alert} onChange={setSpo2Alert} />
        </Card>

        {/* Note */}
        <Card variant="outlined"style={styles.noteCard}>
          <Text style={styles.noteIcon}>ℹ</Text>
          <Text style={styles.noteText}>
            Device integration is currently simulated. In the next phase, real IoT health monitoring devices will be supported for continuous data collection.
          </Text>
        </Card>

        <Text style={styles.disclaimer}>
          This app provides preventive health insights and does not replace professional medical advice.
        </Text>
      </View>
    </ScrollView>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoIcon}>{icon}</Text>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const SettingRow = ({ label, value, onChange }) => (
  <View style={styles.settingRow}>
    <Text style={styles.settingLabel}>{label}</Text>
    <Switch value={value} onValueChange={onChange}
      trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
      thumbColor={value ? COLORS.primary : '#f4f3f4'} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 50, paddingBottom: 24, paddingHorizontal: SIZES.screenPadding, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  backBtn: { marginBottom: 6 },
  backText: { fontSize: 14, color: '#FFFFFFCC', fontWeight: '600' },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#FFF' },
  headerSubtitle: { fontSize: 13, color: '#FFFFFFCC' },
  content: { paddingHorizontal: SIZES.screenPadding, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 20, marginBottom: 10 },
  statusCard: { marginTop: -12 },
  deviceHeader: { flexDirection: 'row', alignItems: 'center' },
  deviceIconBox: { width: 50, height: 50, borderRadius: 14, backgroundColor: COLORS.info + '15', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  deviceIcon: { fontSize: 28 },
  deviceInfo: { flex: 1 },
  deviceName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  deviceModel: { fontSize: 12, color: COLORS.textSecondary },
  statusIndicator: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '700' },
  // Battery
  batteryRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  batteryIcon: { fontSize: 22 },
  batteryBarTrack: { flex: 1, height: 14, backgroundColor: COLORS.border, borderRadius: 7, overflow: 'hidden' },
  batteryBarFill: { height: '100%', borderRadius: 7 },
  batteryPercent: { fontSize: 16, fontWeight: '800', width: 45, textAlign: 'right' },
  batteryEstimate: { fontSize: 12, color: COLORS.textSecondary, marginTop: 6, textAlign: 'center' },
  // Info
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, borderBottomWidth: 0.5, borderBottomColor: COLORS.border, gap: 10 },
  infoIcon: { fontSize: 18 },
  infoLabel: { flex: 1, fontSize: 14, color: COLORS.textSecondary },
  infoValue: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  syncBtn: { marginTop: 14 },
  // Sensors
  sensorRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: COLORS.border, gap: 10 },
  sensorIcon: { fontSize: 20 },
  sensorName: { flex: 1, fontSize: 14, fontWeight: '500', color: COLORS.text },
  sensorBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  sensorStatus: { fontSize: 11, fontWeight: '700' },
  // Settings
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  settingLabel: { fontSize: 14, fontWeight: '500', color: COLORS.text },
  // Note
  noteCard: { flexDirection: 'row', gap: 10, marginTop: 20, alignItems: 'flex-start' },
  noteIcon: { fontSize: 20 },
  noteText: { flex: 1, fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
  disclaimer: { fontSize: 10, color: COLORS.textLight, textAlign: 'center', marginTop: 24, lineHeight: 14 },
});

export default DeviceScreen;
