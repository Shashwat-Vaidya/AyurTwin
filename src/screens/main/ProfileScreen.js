import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import Card from '../../components/common/Card';
import GradientButton from '../../components/common/GradientButton';
import { useApp } from '../../context/AppContext';
import { calculateBMI, calculateHealthScore } from '../../utils/healthCalculations';
import { updateMe } from '../../services/api';

const ProfileScreen = ({ navigation }) => {
  const { state, dispatch } = useApp();
  const user = state.user || {};
  const regData = state.registrationData || {};
  const profile = { ...user, ...regData };

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    first_name: profile.first_name || '',
    last_name: profile.last_name || '',
    phone: profile.phone || '',
    height_cm: String(profile.height_cm || ''),
    weight_kg: String(profile.weight_kg || ''),
  });

  const bmi = calculateBMI(profile.weight_kg, profile.height_cm);
  const healthScore = calculateHealthScore(profile);
  const prakriti = state.prakritiResult || {};

  const getBMIColor = () => {
    const c = { underweight: COLORS.bmi.underweight, normal: COLORS.bmi.normal, overweight: COLORS.bmi.overweight, obese: COLORS.bmi.obese };
    return c[bmi.category] || COLORS.textLight;
  };

  const handleSave = async () => {
    const payload = {
      full_name: `${editData.first_name || profile.first_name || ''} ${editData.last_name || profile.last_name || ''}`.trim(),
      height_cm: editData.height_cm ? parseFloat(editData.height_cm) : undefined,
      weight_kg: editData.weight_kg ? parseFloat(editData.weight_kg) : undefined,
    };
    const res = await updateMe(payload);
    if (!res.success) return Alert.alert('Update failed', res.error);
    dispatch({ type: 'SET_USER', payload: { ...user, ...res.data.user } });
    setIsEditing(false);
    Alert.alert('Saved', 'Profile updated successfully.');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={COLORS.gradient.saffron} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(profile.first_name || profile.username || 'U')[0].toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>{profile.first_name || ''} {profile.last_name || ''}</Text>
          <Text style={styles.userEmail}>{profile.email || profile.username || ''}</Text>
          {prakriti.prakriti && (
            <View style={styles.doshaBadge}>
              <Text style={styles.doshaBadgeText}> {prakriti.prakriti}</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.quickStatItem}>
            <Text style={[styles.quickStatValue, { color: getScoreColor(healthScore) }]}>{healthScore}</Text>
            <Text style={styles.quickStatLabel}>Health Score</Text>
          </View>
          <View style={[styles.quickStatItem, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: COLORS.border }]}>
            <Text style={[styles.quickStatValue, { color: getBMIColor() }]}>{bmi.value}</Text>
            <Text style={styles.quickStatLabel}>BMI</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={[styles.quickStatValue, { color: COLORS.primary }]}>{profile.age || 'N/A'}</Text>
            <Text style={styles.quickStatLabel}>Age</Text>
          </View>
        </View>

        {/* BMI Ring */}
        <Card variant="elevated"style={styles.bmiCard}>
          <View style={styles.bmiRow}>
            <View style={[styles.bmiRing, { borderColor: getBMIColor() }]}>
              <Text style={[styles.bmiValue, { color: getBMIColor() }]}>{bmi.value}</Text>
              <Text style={styles.bmiLabel}>BMI</Text>
            </View>
            <View style={styles.bmiInfo}>
              <Text style={[styles.bmiCategory, { color: getBMIColor() }]}>{(bmi.category || 'N/A').toUpperCase()}</Text>
              <Text style={styles.bmiDesc}>Height: {profile.height_cm || '--'} cm</Text>
              <Text style={styles.bmiDesc}>Weight: {profile.weight_kg || '--'} kg</Text>
            </View>
          </View>
          {/* BMI Scale */}
          <View style={styles.bmiScale}>
            <View style={[styles.bmiScaleSegment, { backgroundColor: COLORS.bmi.underweight, flex: 18.5 }]} />
            <View style={[styles.bmiScaleSegment, { backgroundColor: COLORS.bmi.normal, flex: 6.5 }]} />
            <View style={[styles.bmiScaleSegment, { backgroundColor: COLORS.bmi.overweight, flex: 5 }]} />
            <View style={[styles.bmiScaleSegment, { backgroundColor: COLORS.bmi.obese, flex: 10 }]} />
          </View>
          <View style={styles.bmiScaleLabels}>
            <Text style={styles.bmiScaleLabel}>Underweight</Text>
            <Text style={styles.bmiScaleLabel}>Normal</Text>
            <Text style={styles.bmiScaleLabel}>Overweight</Text>
            <Text style={styles.bmiScaleLabel}>Obese</Text>
          </View>
        </Card>

        {/* Dosha Profile */}
        {prakriti.prakriti && (
          <>
            <Text style={styles.sectionTitle}>Dosha Profile</Text>
            <Card variant="elevated">
              <View style={styles.doshaGrid}>
                <DoshaItem label="Vata"percent={prakriti.vata_percent} color={COLORS.vata} />
                <DoshaItem label="Pitta"percent={prakriti.pitta_percent} color={COLORS.pitta} />
                <DoshaItem label="Kapha"percent={prakriti.kapha_percent} color={COLORS.kapha} />
              </View>
            </Card>
          </>
        )}

        {/* Personal Info */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Text style={styles.editBtn}>{isEditing ? 'Cancel' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>

        <Card variant="elevated">
          {isEditing ? (
            <View>
              <EditRow label="First Name"value={editData.first_name} onChange={(v) => setEditData({...editData, first_name: v})} />
              <EditRow label="Last Name"value={editData.last_name} onChange={(v) => setEditData({...editData, last_name: v})} />
              <EditRow label="Phone"value={editData.phone} onChange={(v) => setEditData({...editData, phone: v})} keyboardType="phone-pad" />
              <EditRow label="Height (cm)"value={editData.height_cm} onChange={(v) => setEditData({...editData, height_cm: v})} keyboardType="numeric" />
              <EditRow label="Weight (kg)"value={editData.weight_kg} onChange={(v) => setEditData({...editData, weight_kg: v})} keyboardType="numeric" />
              <GradientButton title="Save Changes"onPress={handleSave} style={styles.saveBtn} />
            </View>
          ) : (
            <View>
              <InfoRow label="Full Name"value={`${profile.first_name || ''} ${profile.middle_name || ''} ${profile.last_name || ''}`.trim()} />
              <InfoRow label="Email"value={profile.email || 'N/A'} />
              <InfoRow label="Phone"value={profile.phone || 'N/A'} />
              <InfoRow label="Date of Birth"value={profile.date_of_birth || 'N/A'} />
              <InfoRow label="Age"value={profile.age ? `${profile.age} years` : 'N/A'} />
              <InfoRow label="Gender"value={profile.gender || 'N/A'} />
              <InfoRow label="Blood Group"value={profile.blood_group || 'N/A'} />
              <InfoRow label="Height"value={profile.height_cm ? `${profile.height_cm} cm` : 'N/A'} />
              <InfoRow label="Weight"value={profile.weight_kg ? `${profile.weight_kg} kg` : 'N/A'} />
              <InfoRow label="User Type"value={profile.user_type === 'patient' ? 'Patient' : 'Family Member'} />
            </View>
          )}
        </Card>

        {/* Lifestyle Summary */}
        <Text style={styles.sectionTitle}>Lifestyle Summary</Text>
        <Card variant="elevated">
          <InfoRow label="Physical Activity"value={profile.physical_activity || 'N/A'} />
          <InfoRow label="Work Type"value={profile.work_type || 'N/A'} />
          <InfoRow label="Diet Type"value={profile.diet_type || 'N/A'} />
          <InfoRow label="Smoking"value={profile.smoking ? 'Yes' : 'No'} />
          <InfoRow label="Alcohol"value={profile.alcohol ? 'Yes' : 'No'} />
          <InfoRow label="Stress Level"value={profile.stress_level ? `${profile.stress_level}/10` : 'N/A'} />
          <InfoRow label="Sleep Duration"value={profile.sleep_duration_hours ? `${profile.sleep_duration_hours} hrs` : 'N/A'} />
        </Card>

        {/* Family History Summary */}
        <Text style={styles.sectionTitle}>Family History</Text>
        <Card variant="elevated">
          {profile.family_history ? (
            Object.entries(profile.family_history).map(([key, val]) => (
              <InfoRow key={key} label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} value={val ? 'Yes' : 'No'} />
            ))
          ) : (
            <Text style={styles.emptyText}>No family history data</Text>
          )}
        </Card>

        <Text style={styles.disclaimer}>
          This app provides preventive health insights and does not replace professional medical advice.
        </Text>
      </View>
    </ScrollView>
  );
};

const getScoreColor = (s) => s >= 70 ? COLORS.success : s >= 50 ? COLORS.warning : COLORS.error;

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const EditRow = ({ label, value, onChange, keyboardType }) => (
  <View style={styles.editRow}>
    <Text style={styles.editLabel}>{label}</Text>
    <TextInput style={styles.editInput} value={value} onChangeText={onChange} keyboardType={keyboardType || 'default'} />
  </View>
);

const DoshaItem = ({ label, percent, color }) => (
  <View style={styles.doshaItem}>
    <View style={[styles.doshaRing, { borderColor: color }]}>
      <Text style={[styles.doshaValue, { color }]}>{percent}%</Text>
    </View>
    <Text style={[styles.doshaLabel, { color }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 50, paddingBottom: 30, paddingHorizontal: SIZES.screenPadding, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, alignItems: 'center' },
  backBtn: { alignSelf: 'flex-start', marginBottom: 10 },
  backText: { fontSize: 14, color: '#FFFFFFCC', fontWeight: '600' },
  avatarContainer: { alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFFFFF40', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  avatarText: { fontSize: 34, fontWeight: '800', color: '#FFF' },
  userName: { fontSize: 22, fontWeight: '700', color: '#FFF' },
  userEmail: { fontSize: 13, color: '#FFFFFFCC', marginTop: 2 },
  doshaBadge: { marginTop: 8, backgroundColor: '#FFFFFF30', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 14 },
  doshaBadgeText: { fontSize: 13, fontWeight: '700', color: '#FFF' },
  content: { paddingHorizontal: SIZES.screenPadding, paddingBottom: 40 },
  // Quick Stats
  quickStats: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: SIZES.borderRadiusLg, marginTop: -20, ...SHADOWS.medium },
  quickStatItem: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  quickStatValue: { fontSize: 24, fontWeight: '800' },
  quickStatLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  // BMI
  bmiCard: { marginTop: 16 },
  bmiRow: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 16 },
  bmiRing: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
  bmiValue: { fontSize: 22, fontWeight: '800' },
  bmiLabel: { fontSize: 10, color: COLORS.textSecondary },
  bmiInfo: { flex: 1 },
  bmiCategory: { fontSize: 18, fontWeight: '800' },
  bmiDesc: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  bmiScale: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden' },
  bmiScaleSegment: { height: '100%' },
  bmiScaleLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  bmiScaleLabel: { fontSize: 9, color: COLORS.textLight },
  // Dosha
  doshaGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  doshaItem: { alignItems: 'center' },
  doshaRing: { width: 60, height: 60, borderRadius: 30, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  doshaValue: { fontSize: 14, fontWeight: '800' },
  doshaLabel: { fontSize: 13, fontWeight: '700', marginTop: 6 },
  // Sections
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 22, marginBottom: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, marginBottom: 10 },
  editBtn: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  // Info rows
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 11, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  infoLabel: { fontSize: 14, color: COLORS.textSecondary },
  infoValue: { fontSize: 14, fontWeight: '600', color: COLORS.text, maxWidth: '55%', textAlign: 'right' },
  // Edit rows
  editRow: { marginBottom: 12 },
  editLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 4 },
  editInput: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 10, fontSize: 14, color: COLORS.text },
  saveBtn: { marginTop: 8 },
  emptyText: { fontSize: 13, color: COLORS.textLight, textAlign: 'center', paddingVertical: 16 },
  disclaimer: { fontSize: 10, color: COLORS.textLight, textAlign: 'center', marginTop: 24, lineHeight: 14 },
});

export default ProfileScreen;
