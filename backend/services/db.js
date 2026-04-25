/**
 * Database service layer - every Supabase query lives here.
 * Matches schema v4 (users, health_profile, sensor_data, alerts,
 * health_scores, disease_predictions, family_links, community_posts,
 * dinacharya_log, and reference datasets).
 */
const { supabase } = require('../config/supabase');

// ─── Users ──────────────────────────────────────────────────────────
const getUserById = (id) =>
    supabase.from('users').select('*').eq('id', id).single();

const getUserByEmail = (email) =>
    supabase.from('users').select('*').ilike('email', email).maybeSingle();

const getUserByUsername = (username) =>
    supabase.from('users').select('*').ilike('username', username).maybeSingle();

const getUserByEmailOrUsername = (identifier) =>
    supabase
        .from('users')
        .select('*')
        .or(`email.ilike.${identifier},username.ilike.${identifier}`)
        .maybeSingle();

const createUser = (data) =>
    supabase.from('users').insert([data]).select().single();

const updateUser = (id, fields) =>
    supabase
        .from('users')
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

// ─── Health profile (1-to-1 with users) ─────────────────────────────
const upsertHealthProfile = (userId, fields) =>
    supabase
        .from('health_profile')
        .upsert([{ user_id: userId, ...fields, updated_at: new Date().toISOString() }],
            { onConflict: 'user_id' })
        .select()
        .single();

const getHealthProfile = (userId) =>
    supabase.from('health_profile').select('*').eq('user_id', userId).maybeSingle();

// ─── Prakriti quiz ──────────────────────────────────────────────────
const savePrakritiQuiz = (row) =>
    supabase.from('prakriti_quiz_results').insert([row]).select().single();

const getLatestPrakriti = (userId) =>
    supabase
        .from('prakriti_quiz_results')
        .select('*')
        .eq('user_id', userId)
        .order('taken_at', { ascending: false })
        .limit(1)
        .maybeSingle();

// ─── Sensor data ────────────────────────────────────────────────────
const insertSensor = (row) =>
    supabase.from('sensor_data').insert([row]);

const getLatestSensor = (userId) =>
    supabase
        .from('sensor_data')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .maybeSingle();

const getSensorHistory = (userId, limit = 100) =>
    supabase
        .from('sensor_data')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false })
        .limit(limit);

const getSensorSince = (userId, sinceIso) =>
    supabase
        .from('sensor_data')
        .select('*')
        .eq('user_id', userId)
        .gte('recorded_at', sinceIso)
        .order('recorded_at', { ascending: true });

// ─── Health score / predictions / alerts ────────────────────────────
const saveHealthScore = (userId, score, breakdown) =>
    supabase.from('health_scores').insert([{ user_id: userId, score, breakdown }]);

const getLatestHealthScore = (userId) =>
    supabase
        .from('health_scores')
        .select('*')
        .eq('user_id', userId)
        .order('computed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

const savePrediction = (userId, predictions, modelVersion = 'logreg-v1') =>
    supabase.from('disease_predictions').insert([{ user_id: userId, predictions, model_version: modelVersion }]);

const getLatestPrediction = (userId) =>
    supabase
        .from('disease_predictions')
        .select('*')
        .eq('user_id', userId)
        .order('computed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

const createAlert = (row) =>
    supabase.from('alerts').insert([row]);

const getAlerts = (userId, limit = 50) =>
    supabase
        .from('alerts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

// ─── Family links ───────────────────────────────────────────────────
const inviteFamily = (row) =>
    supabase.from('family_links').insert([row]).select().single();

const listFamilyForPatient = (patientId) =>
    supabase
        .from('family_links')
        .select('*, family:family_user_id(id,full_name,email,age)')
        .eq('patient_id', patientId);

const listFamilyInvites = (familyUserId, familyEmail) =>
    supabase
        .from('family_links')
        .select('*, patient:patient_id(id,full_name,email,prakriti)')
        .or(`family_user_id.eq.${familyUserId},family_email.ilike.${familyEmail}`);

const respondInvite = (id, status, familyUserId) =>
    supabase
        .from('family_links')
        .update({ status, family_user_id: familyUserId, responded_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

const listApprovedPatientsForFamily = (familyUserId) =>
    supabase
        .from('family_links')
        .select('*, patient:patient_id(id,full_name,email,username,prakriti,age,gender)')
        .eq('family_user_id', familyUserId)
        .eq('status', 'approved');

// ─── Dinacharya ─────────────────────────────────────────────────────
const upsertDinacharya = (userId, date, tasks, completionPct) =>
    supabase
        .from('dinacharya_log')
        .upsert([{ user_id: userId, log_date: date, tasks, completion_pct: completionPct }],
            { onConflict: 'user_id,log_date' });

const getTodayDinacharya = (userId) =>
    supabase
        .from('dinacharya_log')
        .select('*')
        .eq('user_id', userId)
        .eq('log_date', new Date().toISOString().slice(0, 10))
        .maybeSingle();

// ─── Community ──────────────────────────────────────────────────────
const listPosts = (limit = 50) =>
    supabase
        .from('community_posts')
        .select('*, user:user_id(full_name,username)')
        .order('created_at', { ascending: false })
        .limit(limit);

const createPost = (row) =>
    supabase.from('community_posts').insert([row]).select().single();

const likePost = async (id) => {
    const { data } = await supabase.from('community_posts').select('likes').eq('id', id).single();
    return supabase.from('community_posts').update({ likes: (data?.likes || 0) + 1 }).eq('id', id);
};

// ─── Leaderboard ────────────────────────────────────────────────────
const listLeaderboardDummy = () =>
    supabase.from('leaderboard_dummy').select('*').order('rank');

// ─── Reference data ─────────────────────────────────────────────────
const getFoods = () => supabase.from('foods').select('*');
const getYoga = () => supabase.from('yoga_practices').select('*');
const getRitucharya = () => supabase.from('ritucharya_foods').select('*');
const getViruddha = () => supabase.from('viruddha_ahar').select('*');
const getPrevention = () => supabase.from('prevention_rules').select('*');
const getChatbotQA = () => supabase.from('chatbot_qa').select('*');

module.exports = {
    getUserById, getUserByEmail, getUserByUsername, getUserByEmailOrUsername,
    createUser, updateUser,
    upsertHealthProfile, getHealthProfile,
    savePrakritiQuiz, getLatestPrakriti,
    insertSensor, getLatestSensor, getSensorHistory, getSensorSince,
    saveHealthScore, getLatestHealthScore,
    savePrediction, getLatestPrediction,
    createAlert, getAlerts,
    inviteFamily, listFamilyForPatient, listFamilyInvites, respondInvite,
    listApprovedPatientsForFamily,
    upsertDinacharya, getTodayDinacharya,
    listPosts, createPost, likePost,
    listLeaderboardDummy,
    getFoods, getYoga, getRitucharya, getViruddha, getPrevention, getChatbotQA,
};
