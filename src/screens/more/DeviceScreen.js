import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
// Assume device slice actions exist; if not, we'll use local state.
// import { connectDevice, disconnectDevice, startScan } from '../../store/slices/deviceSlice';

const DeviceScreen = () => {
  const dispatch = useDispatch();
  // Mock device state - in real app, use useSelector
  // const { connected, deviceName, batteryLevel, firmwareVersion, lastSync, scanning } = useSelector((state) => state.device);
  const [connected, setConnected] = useState(false);
  const [deviceName, setDeviceName] = useState('AyurBand');
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [firmwareVersion, setFirmwareVersion] = useState('1.2.4');
  const [lastSync, setLastSync] = useState(new Date().toISOString());
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState([]);

  // Simulate device scanning
  const handleScan = () => {
    setScanning(true);
    setDevices([]);
    // Mock scan results after 2 seconds
    setTimeout(() => {
      setDevices([
        { id: '1', name: 'AyurBand (AB:12:34)', rssi: -45 },
        { id: '2', name: 'AyurBand (CD:56:78)', rssi: -62 },
        { id: '3', name: 'Unknown Device', rssi: -78 },
      ]);
      setScanning(false);
    }, 2000);
  };

  const handleConnect = (device) => {
    Alert.alert('Connect', `Connect to ${device.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Connect',
        onPress: () => {
          setConnected(true);
          setDeviceName(device.name);
          setDevices([]);
        },
      },
    ]);
  };

  const handleDisconnect = () => {
    Alert.alert('Disconnect', 'Are you sure you want to disconnect?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Disconnect',
        style: 'destructive',
        onPress: () => {
          setConnected(false);
          setDeviceName('');
        },
      },
    ]);
  };

  const handleSync = () => {
    Alert.alert('Sync', 'Syncing data from device...', [
      { text: 'OK', onPress: () => setLastSync(new Date().toISOString()) },
    ]);
  };

  const handleCalibrate = (sensor) => {
    Alert.alert('Calibrate', `Calibrate ${sensor} sensor?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Calibrate', onPress: () => Alert.alert('Success', `${sensor} calibrated`) },
    ]);
  };

  // Format last sync time
  const formatLastSync = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  // Battery color
  const getBatteryColor = (level) => {
    if (level > 60) return colors.successGreen;
    if (level > 20) return colors.warningYellow;
    return colors.alertRed;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Device</Text>
        <Text style={styles.headerSubtitle}>Manage your AyurBand</Text>
      </View>

      {/* Connection Status Card */}
      <Card style={styles.connectionCard}>
        <View style={styles.connectionHeader}>
          <Ionicons
            name={connected ? 'bluetooth' : 'bluetooth-outline'}
            size={28}
            color={connected ? colors.primarySaffron : colors.textTertiary}
          />
          <Text style={styles.connectionTitle}>
            {connected ? 'Connected' : 'Not Connected'}
          </Text>
        </View>
        {connected ? (
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>{deviceName}</Text>
            <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}>
              <Text style={styles.disconnectText}>Disconnect</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Button
            title="Scan for Devices"
            onPress={handleScan}
            style={styles.scanButton}
            disabled={scanning}
          />
        )}
      </Card>

      {/* Scanning Indicator */}
      {scanning && (
        <View style={styles.scanningContainer}>
          <ActivityIndicator size="large" color={colors.primarySaffron} />
          <Text style={styles.scanningText}>Scanning for devices...</Text>
        </View>
      )}

      {/* Device List */}
      {devices.length > 0 && (
        <Card style={styles.deviceListCard}>
          <Text style={styles.listTitle}>Available Devices</Text>
          {devices.map((device) => (
            <TouchableOpacity
              key={device.id}
              style={styles.deviceItem}
              onPress={() => handleConnect(device)}
            >
              <Ionicons name="hardware-chip" size={24} color={colors.textSecondary} />
              <View style={styles.deviceDetails}>
                <Text style={styles.deviceItemName}>{device.name}</Text>
                <Text style={styles.deviceItemSignal}>Signal: {device.rssi} dBm</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </Card>
      )}

      {/* Device Info (only if connected) */}
      {connected && (
        <>
          <Card style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Device Information</Text>
            <View style={styles.infoRow}>
              <Ionicons name="information-circle" size={20} color={colors.primarySaffron} />
              <Text style={styles.infoLabel}>Model:</Text>
              <Text style={styles.infoValue}>AyurBand Pro</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="code" size={20} color={colors.primarySaffron} />
              <Text style={styles.infoLabel}>Firmware:</Text>
              <Text style={styles.infoValue}>{firmwareVersion}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="battery-charging" size={20} color={getBatteryColor(batteryLevel)} />
              <Text style={styles.infoLabel}>Battery:</Text>
              <Text style={[styles.infoValue, { color: getBatteryColor(batteryLevel) }]}>
                {batteryLevel}%
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="sync" size={20} color={colors.primarySaffron} />
              <Text style={styles.infoLabel}>Last Sync:</Text>
              <Text style={styles.infoValue}>{formatLastSync(lastSync)}</Text>
            </View>
          </Card>

          {/* Sensor Calibration */}
          <Card style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Sensor Calibration</Text>
            <TouchableOpacity
              style={styles.calibrateItem}
              onPress={() => handleCalibrate('Heart Rate')}
            >
              <Text style={styles.calibrateLabel}>Heart Rate Sensor</Text>
              <Ionicons name="refresh" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.calibrateItem}
              onPress={() => handleCalibrate('Temperature')}
            >
              <Text style={styles.calibrateLabel}>Temperature Sensor</Text>
              <Ionicons name="refresh" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.calibrateItem}
              onPress={() => handleCalibrate('SpO₂')}
            >
              <Text style={styles.calibrateLabel}>SpO₂ Sensor</Text>
              <Ionicons name="refresh" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </Card>

          {/* Sync Button */}
          <Button
            title="Sync Now"
            onPress={handleSync}
            style={styles.syncButton}
            icon={<Ionicons name="sync" size={20} color="white" style={{ marginRight: 8 }} />}
          />
        </>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
  },
  connectionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  connectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  connectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  deviceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.textPrimary,
  },
  disconnectButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: `${colors.alertRed}20`,
    borderRadius: 16,
  },
  disconnectText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.alertRed,
  },
  scanButton: {
    marginTop: 8,
  },
  scanningContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  scanningText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  deviceListCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  listTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  deviceDetails: {
    flex: 1,
    marginLeft: 12,
  },
  deviceItemName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.textPrimary,
  },
  deviceItemSignal: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  infoLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 10,
    width: 80,
  },
  infoValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
  },
  calibrateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  calibrateLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.textPrimary,
  },
  syncButton: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  bottomPadding: {
    height: 30,
  },
});

export default DeviceScreen;