/**
 * Database Service Layer
 * All Supabase queries centralized here
 */
const supabase = require('../config/supabase');

// =====================================================
// USERS
// =====================================================
const getUser = (userId) =>
  supabase.from('users').select('*').eq('id', userId).single();

const getUserByEmail = (email) =>
  supabase.from('users').select('*').eq('email', email).single();

const getUserByUsername = (username) =>
  supabase.from('users').select('*').eq('username', username).single();

const getUserByEmailOrUsername = (identifier, password) =>
  supabase
    .from('users')
    .select('*')
    .or(`email.eq.${identifier},username.eq.${identifier}`)
    .eq('password_hash', password)
    .single();

const createUser = (userData) =>
  supabase.from('users').insert([userData]).select().single();

const updateUser = (userId, fields) =>
  supabase.from('users').update(fields).eq('id', userId).select().single();

// =====================================================
// HEALTH DATA (multi-table upserts)
// =====================================================
const saveLifestyle = (userId, data) =>
  supabase.from('lifestyle_data').upsert([{ user_id: userId, ...data }], { onConflict: 'user_id' });

const saveSleepMental = (userId, data) =>
  supabase.from('sleep_mental_data').upsert([{ user_id: userId, ...data }], { onConflict: 'user_id' });

const saveFamilyHistory = (userId, data) =>
  supabase.from('family_history').upsert([{ user_id: userId, ...data }], { onConflict: 'user_id' });

const saveSymptoms = (userId, data) =>
  supabase.from('symptoms').upsert([{ user_id: userId, ...data }], { onConflict: 'user_id' });

const saveAyurvedic = (userId, data) =>
  supabase.from('ayurvedic_inputs').upsert([{ user_id: userId, ...data }], { onConflict: 'user_id' });

const savePrakritiQuiz = (userId, quizResult) =>
  supabase.from('prakriti_quiz').insert([{ user_id: userId, ...quizResult }]);

// =====================================================
// COMPLETE USER PROFILE (parallel fetch)
// =====================================================
const fetchCompleteUserProfile = async (userId) => {
  const [user, lifestyle, sleep, familyHistory, symptoms, ayurvedic, prakriti, doshaBalance] =
    await Promise.all([
      supabase.from('users').select('*').eq('id', userId).single(),
      supabase.from('lifestyle_data').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).single(),
      supabase.from('sleep_mental_data').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).single(),
      supabase.from('family_history').select('*').eq('user_id', userId).limit(1).single(),
      supabase.from('symptoms').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).single(),
      supabase.from('ayurvedic_inputs').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).single(),
      supabase.from('prakriti_quiz').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).single(),
      supabase.from('dosha_balance').select('*').eq('user_id', userId).order('recorded_at', { ascending: false }).limit(1).single(),
    ]);

  return {
    user: user.data,
    lifestyle: lifestyle.data,
    sleep: sleep.data,
    familyHistory: familyHistory.data,
    symptoms: symptoms.data,
    ayurvedic: ayurvedic.data,
    prakriti: prakriti.data,
    doshaBalance: doshaBalance.data,
  };
};

// =====================================================
// SENSOR READINGS
// =====================================================
const getLatestSensor = (userId) =>
  supabase
    .from('sensor_readings')
    .select('*')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })
    .limit(1)
    .single();

const getSensorHistory = (userId, limit = 20) =>
  supabase
    .from('sensor_readings')
    .select('*')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })
    .limit(limit);

const insertSensorReading = (data) =>
  supabase.from('sensor_readings').insert([data]).select().single();

// =====================================================
// DISEASE PREDICTIONS
// =====================================================
const savePrediction = (data) =>
  supabase.from('disease_predictions').insert([data]);

const getLatestPrediction = (userId) =>
  supabase
    .from('disease_predictions')
    .select('*')
    .eq('user_id', userId)
    .order('predicted_at', { ascending: false })
    .limit(1)
    .single();

// =====================================================
// DOSHA BALANCE
// =====================================================
const saveDoshaBalance = (data) =>
  supabase.from('dosha_balance').insert([data]);

// =====================================================
// SOCIAL POSTS
// =====================================================
const getSocialFeed = (limit = 50) =>
  supabase
    .from('social_posts')
    .select('*, user:user_id(id, first_name, last_name, username, user_type)')
    .order('created_at', { ascending: false })
    .limit(limit);

const createPost = (data) =>
  supabase.from('social_posts').insert([data]).select().single();

const likePost = async (postId, userId) => {
  await supabase.from('social_likes').insert([{ post_id: postId, user_id: userId }]);
  await supabase.rpc('increment_likes', { p_post_id: postId });
};

// =====================================================
// LEADERBOARD
// =====================================================
const getLeaderboard = (limit = 50) =>
  supabase
    .from('leaderboard')
    .select('*, user:user_id(id, first_name, last_name, username, user_type)')
    .order('total_score', { ascending: false })
    .limit(limit);

const getLeaderboardEntry = (userId) =>
  supabase.from('leaderboard').select('*').eq('user_id', userId).single();

const upsertLeaderboard = (data) =>
  supabase.from('leaderboard').upsert([data], { onConflict: 'user_id' });

// =====================================================
// FAMILY CONNECTIONS
// =====================================================
const getFamilyConnections = (userId) =>
  supabase
    .from('family_connections')
    .select('*, patient:patient_id(id, first_name, last_name, email), family_member:family_member_id(id, first_name, last_name, email)')
    .or(`patient_id.eq.${userId},family_member_id.eq.${userId}`);

const getPendingInvites = (userId) =>
  supabase
    .from('family_connections')
    .select('*, family_member:family_member_id(id, first_name, last_name, email, relationship)')
    .eq('patient_id', userId)
    .eq('status', 'pending');

const createFamilyConnection = (data) =>
  supabase.from('family_connections').insert([data]);

const updateFamilyConnection = (connectionId, status) =>
  supabase.from('family_connections').update({ status }).eq('id', connectionId);

// =====================================================
// FOOD DATABASE & RECOMMENDATIONS
// =====================================================
const getFoodDatabase = (filters = {}) => {
  let query = supabase.from('food_database').select('*');
  if (filters.category) query = query.eq('category', filters.category);
  if (filters.is_vegetarian !== undefined) query = query.eq('is_vegetarian', filters.is_vegetarian === 'true');
  return query.order('name');
};

const saveFoodRecommendations = (recs) =>
  supabase.from('food_recommendations').insert(recs);

const saveMealPlan = (plan) =>
  supabase.from('meal_plans').upsert([plan], { onConflict: 'user_id,plan_date' });

// =====================================================
// VIRUDDHA AHARA (Food Compatibility)
// =====================================================
const getViruddhaRules = () =>
  supabase.from('viruddha_ahara_rules').select('*');

const logViruddhaCheck = (data) =>
  supabase.from('viruddha_ahara_log').insert([data]);

// =====================================================
// YOGA
// =====================================================
const getYogaPoses = () =>
  supabase.from('yoga_poses').select('*');

const saveYogaRecommendations = (recs) =>
  supabase.from('yoga_recommendations').insert(recs);

const saveYogaSession = (data) =>
  supabase.from('yoga_sessions').insert([data]).select().single();

// =====================================================
// DISEASE PREVENTION PROTOCOLS
// =====================================================
const getPreventionProtocols = () =>
  supabase.from('disease_prevention_protocols').select('*');

// =====================================================
// NADI PARIKSHA
// =====================================================
const saveNadiPariksha = (data) =>
  supabase.from('nadi_pariksha').insert([data]).select().single();

const getNadiHistory = (userId, limit = 30) =>
  supabase
    .from('nadi_pariksha')
    .select('*')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })
    .limit(limit);

// =====================================================
// RITUCHARYA
// =====================================================
const saveRitucharyaPlan = (data) =>
  supabase.from('ritucharya_plans').insert([data]);

// =====================================================
// PANCHAKARMA
// =====================================================
const savePanchakarmaAssessment = (data) =>
  supabase.from('panchakarma_assessment').insert([data]);

// =====================================================
// DOSHA CLOCK LOG
// =====================================================
const logDoshaClock = (data) =>
  supabase.from('dosha_clock_log').insert([data]);

// =====================================================
// DINACHARYA
// =====================================================
const saveDinacharya = (userId, date, data) =>
  supabase.from('dinacharya_tracking').upsert([{ user_id: userId, date, ...data }], { onConflict: 'user_id,date' });

const getDinacharyaHistory = (userId, limit = 30) =>
  supabase
    .from('dinacharya_tracking')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit);

// =====================================================
// MEAL TRACKING
// =====================================================
const saveMeal = (data) =>
  supabase.from('meal_tracking').insert([data]).select().single();

// =====================================================
// CHATBOT
// =====================================================
const saveChatMessage = (userId, message, sender) =>
  supabase.from('chatbot_conversations').insert([{ user_id: userId, message, sender }]);

// =====================================================
// HEALTH METRICS
// =====================================================
const getLatestHealthMetrics = (userId) =>
  supabase
    .from('health_metrics')
    .select('*')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })
    .limit(1)
    .single();

module.exports = {
  // Users
  getUser, getUserByEmail, getUserByUsername, getUserByEmailOrUsername,
  createUser, updateUser,
  // Health data
  saveLifestyle, saveSleepMental, saveFamilyHistory, saveSymptoms, saveAyurvedic, savePrakritiQuiz,
  fetchCompleteUserProfile,
  // Sensors
  getLatestSensor, getSensorHistory, insertSensorReading,
  // Predictions
  savePrediction, getLatestPrediction,
  // Dosha
  saveDoshaBalance,
  // Social
  getSocialFeed, createPost, likePost,
  // Leaderboard
  getLeaderboard, getLeaderboardEntry, upsertLeaderboard,
  // Family
  getFamilyConnections, getPendingInvites, createFamilyConnection, updateFamilyConnection,
  // Food
  getFoodDatabase, saveFoodRecommendations, saveMealPlan,
  getViruddhaRules, logViruddhaCheck,
  // Yoga
  getYogaPoses, saveYogaRecommendations, saveYogaSession,
  // Prevention
  getPreventionProtocols,
  // Nadi
  saveNadiPariksha, getNadiHistory,
  // Ritucharya
  saveRitucharyaPlan,
  // Panchakarma
  savePanchakarmaAssessment,
  // Dosha clock
  logDoshaClock,
  // Dinacharya
  saveDinacharya, getDinacharyaHistory,
  // Meals
  saveMeal,
  // Chat
  saveChatMessage,
  // Metrics
  getLatestHealthMetrics,
};
