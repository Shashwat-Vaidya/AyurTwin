import { supabase } from '../config/supabase';
import {
  generateSimulatedVitals,
  generateDiseaseRisks,
  calculateHealthScore,
  detectDoshaImbalance,
  generateRecommendations,
  generateAlerts,
} from '../utils/healthCalculations';

// =====================================================
// BACKEND API BASE
// =====================================================
// Override via EXPO_PUBLIC_API_URL env var for production deployments.
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api';

const apiRequest = async (path, options = {}) => {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
    return { success: true, data: json };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// AUTH SERVICE
// =====================================================
export const registerUser = async (userData) => {
  try {
    const isFamily = userData.user_type === 'family_member';
    const insertData = isFamily
      ? {
          username: userData.username,
          email: userData.email,
          password_hash: userData.password,
          user_type: 'family_member',
          first_name: userData.first_name,
          last_name: userData.last_name,
          age: userData.age,
          relationship: userData.relationship,
        }
      : {
          username: userData.username,
          email: userData.email,
          password_hash: userData.password,
          user_type: 'patient',
          first_name: userData.first_name,
          middle_name: userData.middle_name,
          last_name: userData.last_name,
          phone: userData.phone,
          date_of_birth: userData.date_of_birth,
          age: userData.age,
          gender: userData.gender,
          blood_group: userData.blood_group,
          height_cm: userData.height_cm,
          weight_kg: userData.weight_kg,
          bmi: userData.bmi,
          bmi_category: userData.bmi_category,
        };

    const { data, error } = await supabase
      .from('users')
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const loginUser = async (emailOrUsername, password) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`email.eq.${emailOrUsername},username.eq.${emailOrUsername}`)
      .eq('password_hash', password)
      .single();

    if (error || !data) throw new Error('Invalid credentials');
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// HEALTH DATA SERVICE
// =====================================================
export const saveLifestyleData = async (userId, data) => {
  try {
    const { error } = await supabase
      .from('lifestyle_data')
      .upsert([{ user_id: userId, ...data }], { onConflict: 'user_id' });
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const saveSleepMentalData = async (userId, data) => {
  try {
    const { error } = await supabase
      .from('sleep_mental_data')
      .upsert([{ user_id: userId, ...data }], { onConflict: 'user_id' });
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const saveFamilyHistory = async (userId, data) => {
  try {
    const { error } = await supabase
      .from('family_history')
      .upsert([{ user_id: userId, ...data }], { onConflict: 'user_id' });
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const saveSymptoms = async (userId, data) => {
  try {
    const { error } = await supabase
      .from('symptoms')
      .upsert([{ user_id: userId, ...data }], { onConflict: 'user_id' });
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const saveAyurvedicInputs = async (userId, data) => {
  try {
    const { error } = await supabase
      .from('ayurvedic_inputs')
      .upsert([{ user_id: userId, ...data }], { onConflict: 'user_id' });
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const savePrakritiQuiz = async (userId, quizResult) => {
  try {
    const { error } = await supabase
      .from('prakriti_quiz')
      .insert([{ user_id: userId, ...quizResult }]);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// DASHBOARD DATA SERVICE (Simulated)
// =====================================================
export const getDashboardData = async (userId, userProfile) => {
  try {
    const vitals = generateSimulatedVitals(userProfile);
    const risks = generateDiseaseRisks(userProfile);
    const healthScore = calculateHealthScore(userProfile);
    const doshaBalance = detectDoshaImbalance(userProfile?.prakriti_data, userProfile);
    const recommendations = generateRecommendations(userProfile?.prakriti_data, risks, healthScore);
    const alerts = generateAlerts(vitals, risks, doshaBalance);

    return {
      success: true,
      data: { vitals, risks, healthScore, doshaBalance, recommendations, alerts },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// FAMILY SERVICE
// =====================================================
export const sendFamilyInvite = async (patientId, email) => {
  try {
    const { data: familyUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (!familyUser) throw new Error('User not found');

    const { error } = await supabase
      .from('family_connections')
      .insert([{ patient_id: patientId, family_member_id: familyUser.id, status: 'pending' }]);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const acceptFamilyInvite = async (connectionId) => {
  try {
    const { error } = await supabase
      .from('family_connections')
      .update({ status: 'accepted' })
      .eq('id', connectionId);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getFamilyMembers = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('family_connections')
      .select('*, patient:patient_id(id, first_name, last_name, email), family_member:family_member_id(id, first_name, last_name, email)')
      .or(`patient_id.eq.${userId},family_member_id.eq.${userId}`)
      .eq('status', 'accepted');

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// SOCIAL SERVICE
// =====================================================
export const createPost = async (userId, content, postType) => {
  try {
    const { data, error } = await supabase
      .from('social_posts')
      .insert([{ user_id: userId, content, post_type: postType }])
      .select()
      .single();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getSocialFeed = async () => {
  try {
    const { data, error } = await supabase
      .from('social_posts')
      .select('*, user:user_id(id, first_name, last_name, username, user_type)')
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    // Only show posts from registered patients
    const patientPosts = (data || []).filter(post => post.user?.user_type === 'patient');
    return { success: true, data: patientPosts };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const likePost = async (postId, userId) => {
  try {
    const { error } = await supabase
      .from('social_likes')
      .insert([{ post_id: postId, user_id: userId }]);
    if (error) throw error;

    await supabase.rpc('increment_likes', { post_id: postId });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// LEADERBOARD SERVICE
// =====================================================
export const getLeaderboard = async () => {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*, user:user_id(id, first_name, last_name, username, user_type)')
      .order('total_score', { ascending: false })
      .limit(50);
    if (error) throw error;
    // Only include patients in leaderboard
    const patients = (data || []).filter(entry => entry.user?.user_type === 'patient');
    return { success: true, data: patients };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// DINACHARYA SERVICE
// =====================================================
export const saveDinacharya = async (userId, date, data) => {
  try {
    const { error } = await supabase
      .from('dinacharya_tracking')
      .upsert([{ user_id: userId, date, ...data }], { onConflict: 'user_id,date' });
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// MEAL TRACKING SERVICE
// =====================================================
export const saveMeal = async (userId, mealData) => {
  try {
    const { data, error } = await supabase
      .from('meal_tracking')
      .insert([{ user_id: userId, ...mealData }])
      .select()
      .single();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// =====================================================
// CHATBOT SERVICE
// =====================================================
export const saveChatMessage = async (userId, message, sender) => {
  try {
    const { error } = await supabase
      .from('chatbot_conversations')
      .insert([{ user_id: userId, message, sender }]);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const sendChatToBackend = (userId, message) =>
  apiRequest('/chat', { method: 'POST', body: { user_id: userId, message } });

// =====================================================
// COMPREHENSIVE DASHBOARD (backend engine)
// =====================================================
export const getBackendDashboard = (userId) =>
  apiRequest(`/dashboard/${userId}`);

// =====================================================
// FOOD RECOMMENDATIONS
// =====================================================
export const getFoodRecommendations = (userId) =>
  apiRequest(`/food/recommendations/${userId}`);

export const checkFoodCompatibility = (foods) =>
  apiRequest('/food/check-compatibility', { method: 'POST', body: { foods } });

export const getFoodDatabase = (filters = {}) => {
  const qs = new URLSearchParams(filters).toString();
  return apiRequest(`/food/database${qs ? `?${qs}` : ''}`);
};

// =====================================================
// YOGA RECOMMENDATIONS
// =====================================================
export const getYogaRecommendations = (userId, sessionType = 'morning') =>
  apiRequest(`/yoga/recommendations/${userId}?sessionType=${sessionType}`);

export const buildYogaSession = (userId, sessionType, duration) =>
  apiRequest('/yoga/session', {
    method: 'POST',
    body: { userId, sessionType, duration },
  });

// =====================================================
// DISEASE PREVENTION
// =====================================================
export const getPreventionPlans = (userId) =>
  apiRequest(`/prevention/${userId}`);

// =====================================================
// NADI PARIKSHA
// =====================================================
export const analyzeNadi = (userId, pulseData) =>
  apiRequest('/nadi/analyze', { method: 'POST', body: { userId, ...pulseData } });

export const getNadiHistory = (userId) =>
  apiRequest(`/nadi/history/${userId}`);

// =====================================================
// RITUCHARYA (SEASONAL)
// =====================================================
export const getRitucharya = (userId) =>
  apiRequest(`/ritucharya/${userId}`);

// =====================================================
// PANCHAKARMA
// =====================================================
export const getPanchakarmaAssessment = (userId) =>
  apiRequest(`/panchakarma/${userId}`);

// =====================================================
// DOSHA CLOCK (KALA CHAKRA)
// =====================================================
export const getDoshaClock = (userId) =>
  apiRequest(`/dosha-clock/${userId}`);

export const logDoshaClockActivity = (userId, activity) =>
  apiRequest('/dosha-clock/log', {
    method: 'POST',
    body: { userId, ...activity },
  });

// =====================================================
// SENSOR READINGS (Supabase direct)
// Sensors: temperature, spo2, heart_rate, accel_x, accel_y, accel_z
// =====================================================
export const getLatestSensorReading = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('sensor_readings')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .single();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getSensorHistory = async (userId, limit = 20) => {
  try {
    const { data, error } = await supabase
      .from('sensor_readings')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const ingestSensorData = async (userId, sensorData) => {
  try {
    const { data, error } = await supabase
      .from('sensor_readings')
      .insert([{
        user_id: userId,
        device_id: sensorData.device_id || 'ATB-200',
        temperature: sensorData.temperature,
        spo2: sensorData.spo2,
        heart_rate: sensorData.heart_rate,
        accel_x: sensorData.accel_x,
        accel_y: sensorData.accel_y,
        accel_z: sensorData.accel_z,
      }])
      .select()
      .single();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
