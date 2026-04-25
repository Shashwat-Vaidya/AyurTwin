import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert,
  KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../config/theme';
import Card from '../../components/common/Card';
import GradientButton from '../../components/common/GradientButton';
import { useApp } from '../../context/AppContext';
import {
  inviteFamily, listMyFamily, listFamilyInvites, respondFamilyInvite,
  listMonitorPatients, verifyPatientCredentials, setAuthToken,
} from '../../services/api';

const FamilyDashboard = ({ navigation }) => {
  const { state, dispatch, logout } = useApp();
  const isFamily = state.user?.role === 'family';

  const [loading, setLoading] = useState(true);
  const [family, setFamily] = useState([]);         // patient side
  const [invites, setInvites] = useState([]);       // family side - pending
  const [patients, setPatients] = useState([]);     // family side - approved

  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ family_email: '', family_name: '', family_age: '', family_role: '' });

  const [credsModal, setCredsModal] = useState(null); // { patient }
  const [credsId, setCredsId] = useState('');
  const [credsPwd, setCredsPwd] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    if (isFamily) {
      const [inv, pat] = await Promise.all([listFamilyInvites(), listMonitorPatients()]);
      if (inv.success) setInvites(inv.data.invites || []);
      if (pat.success) setPatients(pat.data.patients || []);
    } else {
      const f = await listMyFamily();
      if (f.success) setFamily(f.data.family || []);
    }
    setLoading(false);
  };

  const submitInvite = async () => {
    if (!inviteForm.family_email) return Alert.alert('Error', 'Email is required');
    const res = await inviteFamily({
      family_email: inviteForm.family_email,
      family_name: inviteForm.family_name,
      family_age: inviteForm.family_age ? parseInt(inviteForm.family_age, 10) : null,
      family_role: inviteForm.family_role,
    });
    if (!res.success) return Alert.alert('Error', res.error);
    setShowInvite(false);
    setInviteForm({ family_email: '', family_name: '', family_age: '', family_role: '' });
    load();
  };

  const respond = async (id, action) => {
    const res = await respondFamilyInvite(id, action);
    if (!res.success) Alert.alert('Error', res.error);
    load();
  };

  const openPatientDashboard = (patient) => {
    setCredsModal({ patient });
    setCredsId(patient.username || patient.email);
    setCredsPwd('');
  };

  const confirmMonitor = async () => {
    if (!credsPwd) return;
    const res = await verifyPatientCredentials(credsId, credsPwd);
    if (!res.success) return Alert.alert('Verification failed', res.error || 'Invalid credentials');
    // swap auth token to the patient's, so all /dashboard calls show their data
    await setAuthToken(res.data.token);
    dispatch({ type: 'SET_MONITORING_PATIENT', payload: res.data.user });
    dispatch({ type: 'SET_USER', payload: res.data.user });
    setCredsModal(null);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={COLORS.gradient.green} style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>{isFamily ? 'Family Monitoring' : 'Your Family'}</Text>
              <Text style={styles.headerSubtitle}>{isFamily ? 'Watch over your loved ones' : 'People who monitor your health'}</Text>
            </View>
            <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
              <Ionicons name="log-out-outline" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {!isFamily && (
            <>
              <TouchableOpacity style={styles.addBtn} onPress={() => setShowInvite(v => !v)}>
                <Text style={styles.addBtnText}>+ Invite Family Member</Text>
              </TouchableOpacity>

              {showInvite && (
                <Card style={{ marginBottom: 16 }}>
                  <TextInput style={styles.input} placeholder="Family member email *"
                    autoCapitalize="none" keyboardType="email-address"
                    value={inviteForm.family_email} onChangeText={v => setInviteForm(f => ({ ...f, family_email: v }))} />
                  <TextInput style={styles.input} placeholder="Name"
                    value={inviteForm.family_name} onChangeText={v => setInviteForm(f => ({ ...f, family_name: v }))} />
                  <TextInput style={styles.input} placeholder="Age" keyboardType="number-pad"
                    value={inviteForm.family_age} onChangeText={v => setInviteForm(f => ({ ...f, family_age: v }))} />
                  <TextInput style={styles.input} placeholder="Role (Mother / Father / Son / etc.)"
                    value={inviteForm.family_role} onChangeText={v => setInviteForm(f => ({ ...f, family_role: v }))} />
                  <GradientButton title="Send Invite" onPress={submitInvite} />
                </Card>
              )}

              <Text style={styles.sectionTitle}>People who monitor you</Text>
              {family.length === 0 && <Text style={styles.empty}>No family members linked yet.</Text>}
              {family.map(f => (
                <Card key={f.id} style={styles.personCard}>
                  <View>
                    <Text style={styles.personName}>{f.family_name || f.family?.full_name || f.family_email}</Text>
                    <Text style={styles.personMeta}>{f.family_role || '—'}{f.family_age ? ` · ${f.family_age} yrs` : ''}</Text>
                    <Text style={[styles.badge, statusStyle(f.status)]}>{f.status.toUpperCase()}</Text>
                  </View>
                </Card>
              ))}
            </>
          )}

          {isFamily && (
            <>
              <Text style={styles.sectionTitle}>Pending Invites</Text>
              {invites.length === 0 && <Text style={styles.empty}>No pending invites.</Text>}
              {invites.map(inv => (
                <Card key={inv.id} style={styles.personCard}>
                  <Text style={styles.personName}>{inv.patient?.full_name || inv.patient?.email}</Text>
                  <Text style={styles.personMeta}>{inv.patient?.prakriti ? `Prakriti: ${inv.patient.prakriti}` : ' '}</Text>
                  <View style={styles.row}>
                    <TouchableOpacity style={styles.approveBtn} onPress={() => respond(inv.id, 'approve')}>
                      <Text style={styles.approveText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rejectBtn} onPress={() => respond(inv.id, 'reject')}>
                      <Text style={styles.rejectText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              ))}

              <Text style={styles.sectionTitle}>Patients You Monitor</Text>
              {patients.length === 0 && <Text style={styles.empty}>Approve an invite to start monitoring.</Text>}
              {patients.map(p => (
                <Card key={p.id} style={styles.personCard}>
                  <Text style={styles.personName}>{p.patient?.full_name || p.patient?.username}</Text>
                  <Text style={styles.personMeta}>
                    {p.patient?.prakriti ? `Prakriti: ${p.patient.prakriti}` : ''}
                    {p.patient?.age ? ` · ${p.patient.age} yrs` : ''}
                  </Text>
                  <TouchableOpacity style={styles.viewBtn} onPress={() => openPatientDashboard(p.patient)}>
                    <Text style={styles.viewText}>See Dashboard</Text>
                  </TouchableOpacity>
                </Card>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      <Modal visible={!!credsModal} transparent animationType="fade" onRequestClose={() => setCredsModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Verify Patient Credentials</Text>
            <Text style={styles.modalSubtitle}>To view {credsModal?.patient?.full_name}'s dashboard, enter their login.</Text>
            <TextInput style={styles.input} placeholder="Email or username"
              autoCapitalize="none" value={credsId} onChangeText={setCredsId} />
            <TextInput style={styles.input} placeholder="Password"
              secureTextEntry value={credsPwd} onChangeText={setCredsPwd} />
            <View style={styles.row}>
              <TouchableOpacity style={styles.rejectBtn} onPress={() => setCredsModal(null)}>
                <Text style={styles.rejectText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.approveBtn} onPress={confirmMonitor}>
                <Text style={styles.approveText}>View Dashboard</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const statusStyle = (s) => ({
  color: s === 'approved' ? COLORS.success : s === 'rejected' ? COLORS.error : COLORS.warning,
  borderColor: s === 'approved' ? COLORS.success : s === 'rejected' ? COLORS.error : COLORS.warning,
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { padding: 24, paddingTop: 52, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  headerSubtitle: { fontSize: 13, color: '#FFFFFFCC', marginTop: 4 },
  logoutBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF33', alignItems: 'center', justifyContent: 'center' },
  logoutText: { fontSize: 18 },
  content: { padding: 16 },
  addBtn: { backgroundColor: COLORS.primary, padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  addBtnText: { color: '#FFF', fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginTop: 12, marginBottom: 8 },
  empty: { color: COLORS.textSecondary, fontStyle: 'italic', padding: 8 },
  personCard: { marginBottom: 10, padding: 14 },
  personName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  personMeta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2, marginBottom: 8 },
  badge: { alignSelf: 'flex-start', fontSize: 10, fontWeight: '800', paddingVertical: 2, paddingHorizontal: 8, borderRadius: 6, borderWidth: 1 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, marginBottom: 10, fontSize: 14, backgroundColor: '#FFF' },
  row: { flexDirection: 'row', gap: 10, marginTop: 8 },
  approveBtn: { flex: 1, backgroundColor: COLORS.success, padding: 12, borderRadius: 10, alignItems: 'center' },
  approveText: { color: '#FFF', fontWeight: '700' },
  rejectBtn: { flex: 1, backgroundColor: COLORS.error, padding: 12, borderRadius: 10, alignItems: 'center' },
  rejectText: { color: '#FFF', fontWeight: '700' },
  viewBtn: { backgroundColor: COLORS.primary, padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  viewText: { color: '#FFF', fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: '#00000088', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, width: '100%', maxWidth: 400 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  modalSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 14 },
});

export default FamilyDashboard;
