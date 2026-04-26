/**
 * AyurTwin API client. All requests go through the Node backend.
 * JWT token is stored in memory (set by setAuthToken) and attached automatically.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api';

let _token = null;
export const setAuthToken = async (token) => {
    _token = token;
    if (token) await AsyncStorage.setItem('ayurtwin_token', token);
    else await AsyncStorage.removeItem('ayurtwin_token');
};
export const getAuthToken = async () => {
    if (_token) return _token;
    _token = await AsyncStorage.getItem('ayurtwin_token');
    return _token;
};

async function request(path, { method = 'GET', body, auth = true } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (auth) {
        const t = await getAuthToken();
        if (t) headers['Authorization'] = `Bearer ${t}`;
    }
    try {
        const res = await fetch(`${API_BASE_URL}${path}`, {
            method, headers,
            body: body ? JSON.stringify(body) : undefined,
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) return { success: false, error: json.error || `HTTP ${res.status}` };
        return { success: true, data: json };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

// ── Auth ───────────────────────────────────────────────────────────
export const registerUser = (payload) =>
    request('/auth/register', { method: 'POST', body: payload, auth: false });

export const loginUser = (identifier, password) =>
    request('/auth/login', { method: 'POST', body: { identifier, password }, auth: false });

export const verifyPatientCredentials = (identifier, password) =>
    request('/auth/verify-patient-credentials',
        { method: 'POST', body: { identifier, password }, auth: false });

// ── Users / Profile ────────────────────────────────────────────────
export const getMe = () => request('/users/me');
export const updateMe = (fields) => request('/users/me', { method: 'PATCH', body: fields });
export const submitPrakritiQuiz = (result) =>
    request('/users/prakriti-quiz', { method: 'POST', body: result });
export const updateHealthProfile = (data, force = false) =>
    request('/users/health-profile', { method: 'PUT', body: { ...data, force } });
export const getHealthUpdateStatus = () => request('/users/health-update-status');

// ── Dashboard + scoring ────────────────────────────────────────────
export const getDashboard = () => request('/dashboard');
export const getHealthScoreBreakdown = () => request('/dashboard/health-score');

// ── Metrics + sensors ──────────────────────────────────────────────
export const getMetrics = (userId, window = 'daily') =>
    request(`/metrics/${userId}?window=${window}`);
export const getHrTrend = (userId) => request(`/metrics/${userId}/hr-trend`);
export const getDoshaTrend = (userId) => request(`/metrics/${userId}/dosha-trend`);
export const getLatestSensor = (userId) => request(`/sensors/latest/${userId}`);
export const getSensorHistory = (userId, window = 'daily', limit = 5000) =>
    request(`/sensors/history/${userId}?window=${window}&limit=${limit}`);
export const ingestSensor = (payload) =>
    request('/sensors/ingest', { method: 'POST', body: payload, auth: false });

// ── Prediction ─────────────────────────────────────────────────────
export const predictRisk = (payload) =>
    request('/predict-risk', { method: 'POST', body: payload });
export const predictMyRisk = () => request('/predict-risk/me');
export const explainDiseaseRisk = (disease) => request(`/predict-risk/me/explain/${disease}`);

// ── Diet / Ritucharya / Viruddha / Calories ────────────────────────
export const getDietRecommendations = () => request('/diet/recommendations');
export const getCalories = () => request('/diet/calories');
export const getRitucharya = (season) =>
    request(`/diet/ritucharya${season ? `?season=${season}` : ''}`);
export const checkViruddha = (foods, ctx = {}) =>
    request('/diet/check-viruddha', { method: 'POST', body: { foods, ...ctx } });
export const searchFood = (q) => request(`/diet/food-search?q=${encodeURIComponent(q)}`);
export const suggestViruddha = (q) =>
    request(`/diet/viruddha-suggest?q=${encodeURIComponent(q)}`);

// ── Yoga / Prevention / Education / Reports ────────────────────────
export const getYogaRecommendations = () => request('/yoga/recommendations');
export const getPrevention = () => request('/prevention');
export const getPreventionPlans = () => request('/prevention');
export const getEducation = () => request('/education');
export const getPanchakarma = () => request('/education/panchakarma');
export const getPanchakarmaAssessment = () => request('/education/panchakarma');
export const getFoodRecommendations = () => request('/diet/recommendations');
export const getDoshaClock = () => request('/diet/dosha-clock');
export const getReport = () => request('/reports/me');
export const getReportPdfUrl = async () => {
    const t = await getAuthToken();
    return { url: `${API_BASE_URL}/reports/me/pdf`, token: t };
};

// ── Chatbot ────────────────────────────────────────────────────────
export const sendChat = (message) =>
    request('/chat', { method: 'POST', body: { message } });

// ── Dinacharya ─────────────────────────────────────────────────────
export const getTodayDinacharya = () => request('/dinacharya/today');
export const submitDinacharya = (tasks) =>
    request('/dinacharya', { method: 'POST', body: { tasks } });

// ── Alerts / Smart Insights ────────────────────────────────────────
export const getAlerts = () => request('/alerts');
export const getAlertHistory = () => request('/alerts/history');

// ── Family ─────────────────────────────────────────────────────────
export const inviteFamily = (data) =>
    request('/family/invite', { method: 'POST', body: data });
export const listMyFamily = () => request('/family/my-family');
export const listFamilyInvites = () => request('/family/invites');
export const respondFamilyInvite = (invite_id, action) =>
    request('/family/respond', { method: 'POST', body: { invite_id, action } });
export const listMonitorPatients = () => request('/family/patients');

// ── Community / Leaderboard ────────────────────────────────────────
export const getCommunityFeed = () => request('/social', { auth: false });
export const createCommunityPost = (data) =>
    request('/social', { method: 'POST', body: data });
export const likeCommunityPost = (id) =>
    request(`/social/${id}/like`, { method: 'POST' });
export const getLeaderboard = () => request('/leaderboard');
