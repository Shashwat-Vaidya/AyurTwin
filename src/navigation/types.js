export const ROUTES = {
  // Auth Stack
  SPLASH: 'Splash',
  LANDING: 'Landing',
  SIGN_IN: 'SignIn',
  FORGOT_PASSWORD: 'ForgotPassword',
  RESET_PASSWORD: 'ResetPassword',
  BIOMETRIC: 'Biometric',

  // Registration Stack
  REGISTRATION_NAVIGATOR: 'RegistrationNavigator',
  STEP1_PERSONAL_INFO: 'Step1PersonalInfo',
  STEP2_LIFESTYLE: 'Step2Lifestyle',
  STEP3_SLEEP_MENTAL: 'Step3SleepMental',
  STEP4_FAMILY_HISTORY: 'Step4FamilyHistory',
  STEP5_SYMPTOMS: 'Step5Symptoms',
  STEP6_AYURVEDIC_INPUTS: 'Step6AyurvedicInputs',
  STEP7_PRAKRITI: 'Step7Prakriti',
  STEP8_CREDENTIALS: 'Step8Credentials',
  REGISTRATION_COMPLETE: 'RegistrationComplete',

  // Main Tabs
  MAIN_TABS: 'MainTabs',
  DASHBOARD: 'Dashboard',
  DASHBOARD_STACK: 'DashboardStack',
  METRICS: 'Metrics',
  METRICS_STACK: 'MetricsStack',
  ALERTS: 'Alerts',
  ALERTS_STACK: 'AlertsStack',
  LIFESTYLE: 'Lifestyle',
  LIFESTYLE_STACK: 'LifestyleStack',
  MORE: 'More',
  MORE_STACK: 'MoreStack',

  // Dashboard Stack
  DASHBOARD_MAIN: 'DashboardMain',
  HEART_RATE_DETAIL: 'HeartRateDetail',
  TEMPERATURE_DETAIL: 'TemperatureDetail',
  SPO2_DETAIL: 'SpO2Detail',
  STRESS_DETAIL: 'StressDetail',
  SLEEP_DETAIL: 'SleepDetail',
  ACTIVITY_DETAIL: 'ActivityDetail',

  // Metrics Stack
  METRICS_MAIN: 'MetricsMain',
  SENSOR_LOG: 'SensorLog',
  CHARTS_DETAIL: 'ChartsDetail',

  // Alerts Stack
  ALERTS_MAIN: 'AlertsMain',
  ALERT_DETAIL: 'AlertDetail',
  ALERT_HISTORY: 'AlertHistory',
  ALERT_SETTINGS: 'AlertSettings',

  // Lifestyle Stack
  LIFESTYLE_MAIN: 'LifestyleMain',
  DINACHARYA: 'Dinacharya',
  DIET_RECOMMENDATIONS: 'DietRecommendations',
  RITUCHARYA: 'Ritucharya',
  CALORIE_CALCULATOR: 'CalorieCalculator',
  STRESS_RELIEF: 'StressRelief',
  EXERCISE_SUGGESTIONS: 'ExerciseSuggestions',
  DAILY_CHECKLIST: 'DailyChecklist',

  // More Stack
  MORE_MAIN: 'MoreMain',
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
};

export const TAB_ICONS = {
  [ROUTES.DASHBOARD]: 'home',
  [ROUTES.METRICS]: 'chart-line',
  [ROUTES.ALERTS]: 'bell',
  [ROUTES.LIFESTYLE]: 'leaf',
  [ROUTES.MORE]: 'menu',
};