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
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Bluetooth from 'expo-bluetooth';

import { ROUTES } from '../../navigation/types';
import colors from '../../utils/constants/colors';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const DeviceConnectionScreen = () => {
  const navigation = useNavigation();

  // Device states
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [deviceBattery, setDeviceBattery] = useState(85);
  const [deviceSignal, setDeviceSignal] = useState(80);
  const [lastSync, setLastSync] = useState(new Date());

  // Mock devices for demo
  const mockDevices = [
    {
      id: '1',
      name: 'AyurTwin Wristband',
      address: 'AA:BB:CC:DD:EE:01',
      rssi: -45,
      type: 'wristband',
      battery: 85,
    },
    {
      id: '2',
      name: 'AyurTwin Ring',
      address: 'AA:BB:CC:DD:EE:02',
      rssi: -60,
      type: 'ring',
      battery: 92,
    },
    {
      id: '3',
      name: 'AyurTwin Patch',
      address: 'AA:BB:CC:DD:EE:03',
      rssi: -75,
      type: 'patch',
      battery: 78,
    },
    {
      id: '4',
      name: 'Unknown Device',
      address: 'AA:BB:CC:DD:EE:04',
      rssi: -85,
      type: 'unknown',
      battery: 0,
    },
  ];

  useEffect(() => {
    // Check if device is already connected
    checkConnection();
  }, []);

  const checkConnection = async () => {
    // Mock check - replace with actual Bluetooth check
    setTimeout(() => {
      setIsConnected(false);
    }, 1000);
  };

  const startScan = () => {
    setIsScanning(true);
    setAvailableDevices([]);

    // Mock scanning - replace with actual Bluetooth scan
    setTimeout(() => {
      setAvailableDevices(mockDevices);
      setIsScanning(false);
    }, 2000);
  };

  const stopScan = () => {
    setIsScanning(false);
  };

  const connectToDevice = (device) => {
    Alert.alert(
      'Connect Device',
      `Do you want to connect to ${device.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Connect',
          onPress: () => {
            // Mock connection - replace with actual connection
            setIsScanning(false);
            setConnectedDevice(device);
            setIsConnected(true);
            setLastSync(new Date());
            Alert.alert('Success', `Connected to ${device.name}`);
          },
        },
      ]
    );
  };

  const disconnectDevice = () => {
    Alert.alert(
      'Disconnect Device',
      'Are you sure you want to disconnect?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          onPress: () => {
            setConnectedDevice(null);
            setIsConnected(false);
            Alert.alert('Success', 'Device disconnected');
          },
        },
      ]
    );
  };

  const syncData = () => {
    Alert.alert(
      'Sync Data',
      'Sync health data from device?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sync',
          onPress: () => {
            setLastSync(new Date());
            Alert.alert('Success', 'Data synced successfully');
          },
        },
      ]
    );
  };

  const calibrateDevice = () => {
    Alert.alert(
      'Calibrate Device',
      'Follow the instructions to calibrate your device',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start', onPress: () => Alert.alert('Calibration', 'Calibration started') },
      ]
    );
  };

  const getSignalStrength = (rssi) => {
    if (rssi > -50) return { text: 'Excellent', color: colors.successGreen };
    if (rssi > -65) return { text: 'Good', color: colors.primaryGreen };
    if (rssi > -75) return { text: 'Fair', color: colors.warningYellow };
    return { text: 'Poor', color: colors.alertRed };
  };

  const getBatteryColor = (level) => {
    if (level > 70) return colors.successGreen;
    if (level > 30) return colors.warningYellow;
    return colors.alertRed;
  };

  const getDeviceIcon = (type) => {
    switch(type) {
      case 'wristband': return 'watch';
      case 'ring': return 'diamond';
      case 'patch': return 'bandage';
      default: return 'hardware-chip';
    }
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
          <Text style={styles.headerTitle}>Device Connection</Text>
          <TouchableOpacity onPress={syncData} style={styles.syncButton}>
            <Ionicons name="sync" size={24} color={colors.primarySaffron} />
          </TouchableOpacity>
        </View>

        {/* Connection Status */}
        <LinearGradient
          colors={isConnected ? [colors.successGreen, colors.primaryGreen] : [colors.textTertiary, colors.textSecondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statusCard}
        >
          <View style={styles.statusIcon}>
            <Ionicons 
              name={isConnected ? 'bluetooth' : 'bluetooth-off'} 
              size={40} 
              color="white" 
            />
          </View>
          <View style={styles.statusContent}>
            <Text style={styles.statusTitle}>
              {isConnected ? 'Device Connected' : 'No Device Connected'}
            </Text>
            {isConnected && connectedDevice && (
              <Text style={styles.statusDevice}>{connectedDevice.name}</Text>
            )}
            {lastSync && (
              <Text style={styles.statusSync}>
                Last sync: {lastSync.toLocaleTimeString()}
              </Text>
            )}
          </View>
        </LinearGradient>

        {/* Connected Device Details */}
        {isConnected && connectedDevice && (
          <Card style={styles.deviceDetailsCard}>
            <View style={styles.deviceHeader}>
              <Ionicons name={getDeviceIcon(connectedDevice.type)} size={30} color={colors.primarySaffron} />
              <Text style={styles.deviceName}>{connectedDevice.name}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Battery</Text>
              <View style={styles.detailValueContainer}>
                <View style={styles.batteryBar}>
                  <View 
                    style={[
                      styles.batteryFill,
                      { 
                        width: `${deviceBattery}%`,
                        backgroundColor: getBatteryColor(deviceBattery)
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.detailValue, { color: getBatteryColor(deviceBattery) }]}>
                  {deviceBattery}%
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Signal Strength</Text>
              <View style={styles.detailValueContainer}>
                <Text style={[styles.detailValue, { color: getSignalStrength(connectedDevice.rssi).color }]}>
                  {getSignalStrength(connectedDevice.rssi).text}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>MAC Address</Text>
              <Text style={styles.detailValue}>{connectedDevice.address}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Firmware</Text>
              <Text style={styles.detailValue}>v2.1.4</Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.actionButton} onPress={syncData}>
                <Ionicons name="sync" size={20} color={colors.primarySaffron} />
                <Text style={styles.actionButtonText}>Sync</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={calibrateDevice}>
                <Ionicons name="options" size={20} color={colors.primarySaffron} />
                <Text style={styles.actionButtonText}>Calibrate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.disconnectButton]} onPress={disconnectDevice}>
                <Ionicons name="close-circle" size={20} color={colors.alertRed} />
                <Text style={[styles.actionButtonText, styles.disconnectText]}>Disconnect</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {/* Scan Section */}
        {!isConnected && (
          <Card style={styles.scanCard}>
            <Text style={styles.scanTitle}>Available Devices</Text>
            
            {!isScanning && availableDevices.length === 0 && (
              <TouchableOpacity style={styles.scanButton} onPress={startScan}>
                <Ionicons name="scan" size={24} color={colors.primarySaffron} />
                <Text style={styles.scanButtonText}>Scan for Devices</Text>
              </TouchableOpacity>
            )}

            {isScanning && (
              <View style={styles.scanningContainer}>
                <ActivityIndicator size="large" color={colors.primarySaffron} />
                <Text style={styles.scanningText}>Scanning for devices...</Text>
                <TouchableOpacity onPress={stopScan}>
                  <Text style={styles.stopScanText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}

            {availableDevices.map((device) => (
              <TouchableOpacity
                key={device.id}
                style={styles.deviceItem}
                onPress={() => connectToDevice(device)}
              >
                <View style={styles.deviceItemLeft}>
                  <Ionicons 
                    name={getDeviceIcon(device.type)} 
                    size={24} 
                    color={colors.primarySaffron} 
                  />
                  <View style={styles.deviceItemInfo}>
                    <Text style={styles.deviceItemName}>{device.name}</Text>
                    <Text style={styles.deviceItemAddress}>{device.address}</Text>
                  </View>
                </View>
                <View style={styles.deviceItemRight}>
                  <Text style={[
                    styles.deviceItemSignal,
                    { color: getSignalStrength(device.rssi).color }
                  ]}>
                    {getSignalStrength(device.rssi).text}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                </View>
              </TouchableOpacity>
            ))}

            {availableDevices.length > 0 && !isScanning && (
              <TouchableOpacity style={styles.rescanButton} onPress={startScan}>
                <Ionicons name="refresh" size={20} color={colors.primarySaffron} />
                <Text style={styles.rescanText}>Scan Again</Text>
              </TouchableOpacity>
            )}
          </Card>
        )}

        {/* Instructions */}
        <Card style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>How to Connect</Text>
          
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>1</Text>
            </View>
            <Text style={styles.instructionText}>
              Make sure your AyurTwin device is charged and turned on
            </Text>
          </View>

          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>2</Text>
            </View>
            <Text style={styles.instructionText}>
              Enable Bluetooth on your phone
            </Text>
          </View>

          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>3</Text>
            </View>
            <Text style={styles.instructionText}>
              Bring the device close to your phone (within 1 meter)
            </Text>
          </View>

          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>4</Text>
            </View>
            <Text style={styles.instructionText}>
              Tap "Scan for Devices" and select your device
            </Text>
          </View>
        </Card>

        {/* Troubleshooting */}
        <Card style={styles.troubleshootCard}>
          <Text style={styles.troubleshootTitle}>Troubleshooting</Text>
          
          <TouchableOpacity style={styles.troubleshootItem}>
            <Ionicons name="help-circle" size={20} color={colors.primarySaffron} />
            <Text style={styles.troubleshootText}>Device not showing up?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.troubleshootItem}>
            <Ionicons name="refresh" size={20} color={colors.primarySaffron} />
            <Text style={styles.troubleshootText}>Connection issues</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.troubleshootItem}>
            <Ionicons name="battery-dead" size={20} color={colors.primarySaffron} />
            <Text style={styles.troubleshootText}>Battery problems</Text>
          </TouchableOpacity>
        </Card>

        {/* Support */}
        <View style={styles.supportContainer}>
          <Text style={styles.supportText}>Need help?</Text>
          <TouchableOpacity>
            <Text style={styles.supportLink}>Contact Support</Text>
          </TouchableOpacity>
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
  syncButton: {
    padding: 8,
  },
  statusCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  statusIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'white',
    marginBottom: 4,
  },
  statusDevice: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginBottom: 2,
  },
  statusSync: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'white',
    opacity: 0.7,
  },
  deviceDetailsCard: {
    padding: 16,
    marginBottom: 20,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  deviceName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
  },
  batteryBar: {
    width: 80,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    marginRight: 8,
    overflow: 'hidden',
  },
  batteryFill: {
    height: '100%',
    borderRadius: 3,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textPrimary,
    marginTop: 4,
  },
  disconnectButton: {
    opacity: 0.8,
  },
  disconnectText: {
    color: colors.alertRed,
  },
  scanCard: {
    padding: 16,
    marginBottom: 20,
  },
  scanTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 153, 51, 0.1)',
    padding: 16,
    borderRadius: 12,
  },
  scanButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.primarySaffron,
    marginLeft: 8,
  },
  scanningContainer: {
    alignItems: 'center',
    padding: 20,
  },
  scanningText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 8,
  },
  stopScanText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.alertRed,
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  deviceItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceItemInfo: {
    marginLeft: 12,
    flex: 1,
  },
  deviceItemName: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  deviceItemAddress: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
  },
  deviceItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceItemSignal: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginRight: 8,
  },
  rescanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  rescanText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primarySaffron,
    marginLeft: 6,
  },
  instructionsCard: {
    padding: 16,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primarySaffron,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: 'white',
  },
  instructionText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  troubleshootCard: {
    padding: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 153, 51, 0.05)',
  },
  troubleshootTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  troubleshootItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  troubleshootText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
  },
  supportContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  supportText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  supportLink: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primarySaffron,
    marginLeft: 8,
    textDecorationLine: 'underline',
  },
});

export default DeviceConnectionScreen;