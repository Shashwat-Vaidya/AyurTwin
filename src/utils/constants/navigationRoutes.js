/**
 * Navigation route constants for the entire app
 */

/**
 * Auth stack routes
 */
export const AUTH_ROUTES = {
  SPLASH: 'Splash',
  LANDING: 'Landing',
  SIGN_IN: 'SignIn',
  SIGN_UP: 'SignUp',
  FORGOT_PASSWORD: 'ForgotPassword',
  RESET_PASSWORD: 'ResetPassword',
  VERIFY_EMAIL: 'VerifyEmail',
  BIOMETRIC: 'Biometric',
  ONBOARDING: 'Onboarding',
};

/**
 * Registration stack routes
 */
export const REGISTRATION_ROUTES = {
  REGISTRATION: 'Registration',
  REGISTRATION_NAVIGATOR: 'RegistrationNavigator',
  PERSONAL_INFO: 'PersonalInfo',
  LIFESTYLE: 'Lifestyle',
  SLEEP_MENTAL: 'SleepMental',
  FAMILY_HISTORY: 'FamilyHistory',
  SYMPTOMS: 'Symptoms',
  AYURVEDIC_INPUTS: 'AyurvedicInputs',
  PRAKRITI: 'Prakriti',
  CREDENTIALS: 'Credentials',
  REGISTRATION_COMPLETE: 'RegistrationComplete',
};

/**
 * Main tab routes
 */
export const TAB_ROUTES = {
  MAIN_TABS: 'MainTabs',
  DASHBOARD: 'Dashboard',
  DASHBOARD_TAB: 'DashboardTab',
  METRICS: 'Metrics',
  METRICS_TAB: 'MetricsTab',
  ALERTS: 'Alerts',
  ALERTS_TAB: 'AlertsTab',
  LIFESTYLE: 'Lifestyle',
  LIFESTYLE_TAB: 'LifestyleTab',
  MORE: 'More',
  MORE_TAB: 'MoreTab',
};

/**
 * Dashboard stack routes
 */
export const DASHBOARD_ROUTES = {
  DASHBOARD_MAIN: 'DashboardMain',
  DASHBOARD_HOME: 'DashboardHome',
  HEART_RATE_DETAIL: 'HeartRateDetail',
  TEMPERATURE_DETAIL: 'TemperatureDetail',
  SPO2_DETAIL: 'SpO2Detail',
  STRESS_DETAIL: 'StressDetail',
  SLEEP_DETAIL: 'SleepDetail',
  ACTIVITY_DETAIL: 'ActivityDetail',
  DOSHA_DETAIL: 'DoshaDetail',
  RISK_DETAIL: 'RiskDetail',
  TODAY_SUMMARY: 'TodaySummary',
};

/**
 * Metrics stack routes
 */
export const METRICS_ROUTES = {
  METRICS_MAIN: 'MetricsMain',
  METRICS_HOME: 'MetricsHome',
  HEART_RATE_METRICS: 'HeartRateMetrics',
  SPO2_METRICS: 'SpO2Metrics',
  TEMPERATURE_METRICS: 'TemperatureMetrics',
  STRESS_METRICS: 'StressMetrics',
  SLEEP_METRICS: 'SleepMetrics',
  ACTIVITY_METRICS: 'ActivityMetrics',
  DOSHA_METRICS: 'DoshaMetrics',
  SENSOR_LOG: 'SensorLog',
  CHARTS_DETAIL: 'ChartsDetail',
  COMPARISON: 'Comparison',
  TRENDS: 'Trends',
};

/**
 * Alerts stack routes
 */
export const ALERTS_ROUTES = {
  ALERTS_MAIN: 'AlertsMain',
  ALERTS_HOME: 'AlertsHome',
  ALERT_DETAIL: 'AlertDetail',
  ALERT_HISTORY: 'AlertHistory',
  ALERT_SETTINGS: 'AlertSettings',
  CRITICAL_ALERTS: 'CriticalAlerts',
  NOTIFICATION_CENTER: 'NotificationCenter',
};

/**
 * Lifestyle stack routes
 */
export const LIFESTYLE_ROUTES = {
  LIFESTYLE_MAIN: 'LifestyleMain',
  LIFESTYLE_HOME: 'LifestyleHome',
  DINACHARYA: 'Dinacharya',
  DIET_RECOMMENDATIONS: 'DietRecommendations',
  RITUCHARYA: 'Ritucharya',
  CALORIE_CALCULATOR: 'CalorieCalculator',
  STRESS_RELIEF: 'StressRelief',
  EXERCISE_SUGGESTIONS: 'ExerciseSuggestions',
  DAILY_CHECKLIST: 'DailyChecklist',
  MEDITATION: 'Meditation',
  YOGA: 'Yoga',
  RECIPES: 'Recipes',
  WATER_TRACKER: 'WaterTracker',
};

/**
 * More stack routes
 */
export const MORE_ROUTES = {
  MORE_MAIN: 'MoreMain',
  MORE_HOME: 'MoreHome',
  PROFILE: 'Profile',
  EDIT_PROFILE: 'EditProfile',
  REPORTS: 'Reports',
  REPORT_DETAIL: 'ReportDetail',
  DEVICE: 'Device',
  DEVICE_CONNECTION: 'DeviceConnection',
  EDUCATION: 'Education',
  EDUCATION_DETAIL: 'EducationDetail',
  ABOUT: 'About',
  SETTINGS: 'Settings',
  NOTIFICATION_SETTINGS: 'NotificationSettings',
  PRIVACY_SETTINGS: 'PrivacySettings',
  HELP: 'Help',
  FAQ: 'FAQ',
  SUPPORT: 'Support',
  TERMS: 'Terms',
  PRIVACY_POLICY: 'PrivacyPolicy',
  DATA_MANAGEMENT: 'DataManagement',
  SUBSCRIPTION: 'Subscription',
};

/**
 * Chatbot routes
 */
export const CHATBOT_ROUTES = {
  CHAT: 'Chat',
  CHAT_HISTORY: 'ChatHistory',
  CHAT_SETTINGS: 'ChatSettings',
};

/**
 * All routes combined for easy access
 */
export const ROUTES = {
  ...AUTH_ROUTES,
  ...REGISTRATION_ROUTES,
  ...TAB_ROUTES,
  ...DASHBOARD_ROUTES,
  ...METRICS_ROUTES,
  ...ALERTS_ROUTES,
  ...LIFESTYLE_ROUTES,
  ...MORE_ROUTES,
  ...CHATBOT_ROUTES,
};

/**
 * Route groups for organization
 */
export const ROUTE_GROUPS = {
  auth: Object.values(AUTH_ROUTES),
  registration: Object.values(REGISTRATION_ROUTES),
  dashboard: Object.values(DASHBOARD_ROUTES),
  metrics: Object.values(METRICS_ROUTES),
  alerts: Object.values(ALERTS_ROUTES),
  lifestyle: Object.values(LIFESTYLE_ROUTES),
  more: Object.values(MORE_ROUTES),
  chatbot: Object.values(CHATBOT_ROUTES),
};

/**
 * Routes that require authentication
 */
export const PROTECTED_ROUTES = [
  ...Object.values(DASHBOARD_ROUTES),
  ...Object.values(METRICS_ROUTES),
  ...Object.values(ALERTS_ROUTES),
  ...Object.values(LIFESTYLE_ROUTES),
  ...Object.values(MORE_ROUTES),
  ...Object.values(CHATBOT_ROUTES),
  TAB_ROUTES.MAIN_TABS,
  TAB_ROUTES.DASHBOARD_TAB,
  TAB_ROUTES.METRICS_TAB,
  TAB_ROUTES.ALERTS_TAB,
  TAB_ROUTES.LIFESTYLE_TAB,
  TAB_ROUTES.MORE_TAB,
];

/**
 * Routes that don't require authentication
 */
export const PUBLIC_ROUTES = [
  ...Object.values(AUTH_ROUTES),
  ...Object.values(REGISTRATION_ROUTES),
];

/**
 * Routes that should hide bottom tab
 */
export const HIDE_TAB_ROUTES = [
  ...Object.values(REGISTRATION_ROUTES),
  ...Object.values(AUTH_ROUTES),
  ...Object.values(DASHBOARD_ROUTES).filter(r => r !== DASHBOARD_ROUTES.DASHBOARD_MAIN),
  ...Object.values(METRICS_ROUTES).filter(r => r !== METRICS_ROUTES.METRICS_MAIN),
  ...Object.values(ALERTS_ROUTES).filter(r => r !== ALERTS_ROUTES.ALERTS_MAIN),
  ...Object.values(LIFESTYLE_ROUTES).filter(r => r !== LIFESTYLE_ROUTES.LIFESTYLE_MAIN),
  ...Object.values(MORE_ROUTES).filter(r => r !== MORE_ROUTES.MORE_MAIN),
  ...Object.values(CHATBOT_ROUTES),
];

/**
 * Routes that should show back button
 */
export const SHOW_BACK_BUTTON_ROUTES = [
  ...Object.values(REGISTRATION_ROUTES).filter(r => r !== REGISTRATION_ROUTES.REGISTRATION_NAVIGATOR),
  ...Object.values(DASHBOARD_ROUTES).filter(r => r !== DASHBOARD_ROUTES.DASHBOARD_MAIN),
  ...Object.values(METRICS_ROUTES).filter(r => r !== METRICS_ROUTES.METRICS_MAIN),
  ...Object.values(ALERTS_ROUTES).filter(r => r !== ALERTS_ROUTES.ALERTS_MAIN),
  ...Object.values(LIFESTYLE_ROUTES).filter(r => r !== LIFESTYLE_ROUTES.LIFESTYLE_MAIN),
  ...Object.values(MORE_ROUTES).filter(r => r !== MORE_ROUTES.MORE_MAIN),
  AUTH_ROUTES.FORGOT_PASSWORD,
  AUTH_ROUTES.RESET_PASSWORD,
  AUTH_ROUTES.VERIFY_EMAIL,
  AUTH_ROUTES.BIOMETRIC,
];

/**
 * Get route title for header
 * @param {string} routeName - Route name
 * @returns {string} Title for header
 */
export const getRouteTitle = (routeName) => {
  const titles = {
    [AUTH_ROUTES.SPLASH]: 'AyurTwin',
    [AUTH_ROUTES.LANDING]: 'Welcome',
    [AUTH_ROUTES.SIGN_IN]: 'Sign In',
    [AUTH_ROUTES.SIGN_UP]: 'Create Account',
    [AUTH_ROUTES.FORGOT_PASSWORD]: 'Forgot Password',
    [AUTH_ROUTES.RESET_PASSWORD]: 'Reset Password',
    [AUTH_ROUTES.VERIFY_EMAIL]: 'Verify Email',
    [AUTH_ROUTES.BIOMETRIC]: 'Biometric Login',
    [AUTH_ROUTES.ONBOARDING]: 'Welcome',
    
    [REGISTRATION_ROUTES.PERSONAL_INFO]: 'Personal Information',
    [REGISTRATION_ROUTES.LIFESTYLE]: 'Lifestyle',
    [REGISTRATION_ROUTES.SLEEP_MENTAL]: 'Sleep & Mental Health',
    [REGISTRATION_ROUTES.FAMILY_HISTORY]: 'Family History',
    [REGISTRATION_ROUTES.SYMPTOMS]: 'Current Symptoms',
    [REGISTRATION_ROUTES.AYURVEDIC_INPUTS]: 'Ayurvedic Inputs',
    [REGISTRATION_ROUTES.PRAKRITI]: 'Prakriti Analysis',
    [REGISTRATION_ROUTES.CREDENTIALS]: 'Create Account',
    [REGISTRATION_ROUTES.REGISTRATION_COMPLETE]: 'Welcome to AyurTwin',
    
    [TAB_ROUTES.DASHBOARD_TAB]: 'Dashboard',
    [TAB_ROUTES.METRICS_TAB]: 'Metrics',
    [TAB_ROUTES.ALERTS_TAB]: 'Alerts',
    [TAB_ROUTES.LIFESTYLE_TAB]: 'Lifestyle',
    [TAB_ROUTES.MORE_TAB]: 'More',
    
    [DASHBOARD_ROUTES.HEART_RATE_DETAIL]: 'Heart Rate',
    [DASHBOARD_ROUTES.TEMPERATURE_DETAIL]: 'Temperature',
    [DASHBOARD_ROUTES.SPO2_DETAIL]: 'Blood Oxygen',
    [DASHBOARD_ROUTES.STRESS_DETAIL]: 'Stress Level',
    [DASHBOARD_ROUTES.SLEEP_DETAIL]: 'Sleep Analysis',
    [DASHBOARD_ROUTES.ACTIVITY_DETAIL]: 'Activity',
    [DASHBOARD_ROUTES.DOSHA_DETAIL]: 'Dosha Balance',
    [DASHBOARD_ROUTES.RISK_DETAIL]: 'Health Risks',
    [DASHBOARD_ROUTES.TODAY_SUMMARY]: 'Today\'s Summary',
    
    [METRICS_ROUTES.HEART_RATE_METRICS]: 'Heart Rate Metrics',
    [METRICS_ROUTES.SPO2_METRICS]: 'SpO₂ Metrics',
    [METRICS_ROUTES.TEMPERATURE_METRICS]: 'Temperature Metrics',
    [METRICS_ROUTES.STRESS_METRICS]: 'Stress Metrics',
    [METRICS_ROUTES.SLEEP_METRICS]: 'Sleep Metrics',
    [METRICS_ROUTES.ACTIVITY_METRICS]: 'Activity Metrics',
    [METRICS_ROUTES.DOSHA_METRICS]: 'Dosha Metrics',
    [METRICS_ROUTES.SENSOR_LOG]: 'Sensor Log',
    [METRICS_ROUTES.CHARTS_DETAIL]: 'Charts',
    [METRICS_ROUTES.COMPARISON]: 'Comparison',
    [METRICS_ROUTES.TRENDS]: 'Trends',
    
    [ALERTS_ROUTES.ALERT_DETAIL]: 'Alert Details',
    [ALERTS_ROUTES.ALERT_HISTORY]: 'Alert History',
    [ALERTS_ROUTES.ALERT_SETTINGS]: 'Alert Settings',
    [ALERTS_ROUTES.CRITICAL_ALERTS]: 'Critical Alerts',
    [ALERTS_ROUTES.NOTIFICATION_CENTER]: 'Notifications',
    
    [LIFESTYLE_ROUTES.DINACHARYA]: 'Daily Routine',
    [LIFESTYLE_ROUTES.DIET_RECOMMENDATIONS]: 'Diet Recommendations',
    [LIFESTYLE_ROUTES.RITUCHARYA]: 'Seasonal Routine',
    [LIFESTYLE_ROUTES.CALORIE_CALCULATOR]: 'Calorie Calculator',
    [LIFESTYLE_ROUTES.STRESS_RELIEF]: 'Stress Relief',
    [LIFESTYLE_ROUTES.EXERCISE_SUGGESTIONS]: 'Exercise',
    [LIFESTYLE_ROUTES.DAILY_CHECKLIST]: 'Daily Checklist',
    [LIFESTYLE_ROUTES.MEDITATION]: 'Meditation',
    [LIFESTYLE_ROUTES.YOGA]: 'Yoga',
    [LIFESTYLE_ROUTES.RECIPES]: 'Healthy Recipes',
    [LIFESTYLE_ROUTES.WATER_TRACKER]: 'Water Tracker',
    
    [MORE_ROUTES.PROFILE]: 'My Profile',
    [MORE_ROUTES.EDIT_PROFILE]: 'Edit Profile',
    [MORE_ROUTES.REPORTS]: 'Health Reports',
    [MORE_ROUTES.REPORT_DETAIL]: 'Report Details',
    [MORE_ROUTES.DEVICE]: 'My Device',
    [MORE_ROUTES.DEVICE_CONNECTION]: 'Connect Device',
    [MORE_ROUTES.EDUCATION]: 'Education',
    [MORE_ROUTES.EDUCATION_DETAIL]: 'Learn',
    [MORE_ROUTES.ABOUT]: 'About',
    [MORE_ROUTES.SETTINGS]: 'Settings',
    [MORE_ROUTES.NOTIFICATION_SETTINGS]: 'Notifications',
    [MORE_ROUTES.PRIVACY_SETTINGS]: 'Privacy',
    [MORE_ROUTES.HELP]: 'Help',
    [MORE_ROUTES.FAQ]: 'FAQ',
    [MORE_ROUTES.SUPPORT]: 'Support',
    [MORE_ROUTES.TERMS]: 'Terms of Service',
    [MORE_ROUTES.PRIVACY_POLICY]: 'Privacy Policy',
    [MORE_ROUTES.DATA_MANAGEMENT]: 'Data Management',
    [MORE_ROUTES.SUBSCRIPTION]: 'Subscription',
    
    [CHATBOT_ROUTES.CHAT]: 'AyurBot',
    [CHATBOT_ROUTES.CHAT_HISTORY]: 'Chat History',
    [CHATBOT_ROUTES.CHAT_SETTINGS]: 'Chat Settings',
  };

  return titles[routeName] || routeName;
};

export default ROUTES;