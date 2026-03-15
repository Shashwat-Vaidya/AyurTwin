/**
 * Analytics event constants
 * Centralized list of all analytics events used throughout the app
 */

// App Lifecycle Events
export const APP_EVENTS = {
  APP_LAUNCH: 'app_launch',
  APP_CLOSE: 'app_close',
  APP_BACKGROUND: 'app_background',
  APP_FOREGROUND: 'app_foreground',
  APP_CRASH: 'app_crash',
  APP_UPDATE: 'app_update',
  APP_RATING: 'app_rating',
};

// Session Events
export const SESSION_EVENTS = {
  SESSION_START: 'session_start',
  SESSION_END: 'session_end',
  SESSION_RESUME: 'session_resume',
  SESSION_PAUSE: 'session_pause',
  SESSION_TIMEOUT: 'session_timeout',
};

// Authentication Events
export const AUTH_EVENTS = {
  LOGIN: 'login',
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILED: 'login_failed',
  LOGOUT: 'logout',
  SIGNUP: 'signup',
  SIGNUP_SUCCESS: 'signup_success',
  SIGNUP_FAILED: 'signup_failed',
  PASSWORD_RESET: 'password_reset',
  PASSWORD_CHANGE: 'password_change',
  BIOMETRIC_LOGIN: 'biometric_login',
  BIOMETRIC_ENABLE: 'biometric_enable',
  BIOMETRIC_DISABLE: 'biometric_disable',
  SESSION_EXPIRED: 'session_expired',
  ACCOUNT_DELETED: 'account_deleted',
};

// User Events
export const USER_EVENTS = {
  PROFILE_VIEW: 'profile_view',
  PROFILE_EDIT: 'profile_edit',
  PROFILE_UPDATE: 'profile_update',
  PROFILE_COMPLETE: 'profile_complete',
  AVATAR_UPDATE: 'avatar_update',
  PREFERENCES_UPDATE: 'preferences_update',
  SETTINGS_UPDATE: 'settings_update',
  NOTIFICATION_SETTINGS_UPDATE: 'notification_settings_update',
  PRIVACY_SETTINGS_UPDATE: 'privacy_settings_update',
};

// Onboarding Events
export const ONBOARDING_EVENTS = {
  ONBOARDING_START: 'onboarding_start',
  ONBOARDING_STEP: 'onboarding_step',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  ONBOARDING_SKIP: 'onboarding_skip',
  PERMISSION_REQUEST: 'permission_request',
  PERMISSION_GRANTED: 'permission_granted',
  PERMISSION_DENIED: 'permission_denied',
};

// Registration Events
export const REGISTRATION_EVENTS = {
  REGISTRATION_START: 'registration_start',
  REGISTRATION_STEP: 'registration_step',
  REGISTRATION_COMPLETE: 'registration_complete',
  REGISTRATION_ABANDON: 'registration_abandon',
  PERSONAL_INFO_SUBMIT: 'personal_info_submit',
  LIFESTYLE_SUBMIT: 'lifestyle_submit',
  SLEEP_MENTAL_SUBMIT: 'sleep_mental_submit',
  FAMILY_HISTORY_SUBMIT: 'family_history_submit',
  SYMPTOMS_SUBMIT: 'symptoms_submit',
  AYURVEDIC_INPUTS_SUBMIT: 'ayurvedic_inputs_submit',
  PRAKRITI_SUBMIT: 'prakriti_submit',
  CREDENTIALS_SUBMIT: 'credentials_submit',
};

// Health Tracking Events
export const HEALTH_EVENTS = {
  HEALTH_DATA_SYNC: 'health_data_sync',
  HEALTH_READING_ADD: 'health_reading_add',
  HEALTH_READING_UPDATE: 'health_reading_update',
  HEALTH_READING_DELETE: 'health_reading_delete',
  HEART_RATE_READING: 'heart_rate_reading',
  SPO2_READING: 'spo2_reading',
  TEMPERATURE_READING: 'temperature_reading',
  STRESS_READING: 'stress_reading',
  SLEEP_READING: 'sleep_reading',
  ACTIVITY_READING: 'activity_reading',
  BLOOD_PRESSURE_READING: 'blood_pressure_reading',
  HRV_READING: 'hrv_reading',
  RESPIRATORY_RATE_READING: 'respiratory_rate_reading',
  GLUCOSE_READING: 'glucose_reading',
  WEIGHT_READING: 'weight_reading',
  HEIGHT_READING: 'height_reading',
  BMI_READING: 'bmi_reading',
};

// Alert Events
export const ALERT_EVENTS = {
  ALERT_RECEIVED: 'alert_received',
  ALERT_VIEW: 'alert_view',
  ALERT_ACKNOWLEDGE: 'alert_acknowledge',
  ALERT_RESOLVE: 'alert_resolve',
  ALERT_SNOOZE: 'alert_snooze',
  ALERT_DISMISS: 'alert_dismiss',
  ALERT_DELETE: 'alert_delete',
  CRITICAL_ALERT: 'critical_alert',
  HEALTH_ALERT: 'health_alert',
  STRESS_ALERT: 'stress_alert',
  DOSHA_ALERT: 'dosha_alert',
  DEVICE_ALERT: 'device_alert',
  REMINDER_ALERT: 'reminder_alert',
};

// Disease Prediction Events
export const PREDICTION_EVENTS = {
  PREDICTION_VIEW: 'prediction_view',
  PREDICTION_REFRESH: 'prediction_refresh',
  RISK_FACTORS_VIEW: 'risk_factors_view',
  PREVENTION_TIPS_VIEW: 'prevention_tips_view',
  DISEASE_INFO_VIEW: 'disease_info_view',
  RISK_LEVEL_CHANGE: 'risk_level_change',
};

// Dosha Events
export const DOSHA_EVENTS = {
  DOSHA_QUIZ_START: 'dosha_quiz_start',
  DOSHA_QUIZ_COMPLETE: 'dosha_quiz_complete',
  DOSHA_VIEW: 'dosha_view',
  DOSHA_UPDATE: 'dosha_update',
  DOSHA_BALANCE_CHECK: 'dosha_balance_check',
  DOSHA_IMBALANCE_DETECTED: 'dosha_imbalance_detected',
  DOSHA_RECOMMENDATIONS_VIEW: 'dosha_recommendations_view',
};

// Goal Events
export const GOAL_EVENTS = {
  GOAL_CREATE: 'goal_create',
  GOAL_UPDATE: 'goal_update',
  GOAL_DELETE: 'goal_delete',
  GOAL_COMPLETE: 'goal_complete',
  GOAL_PROGRESS: 'goal_progress',
  GOAL_REMINDER_SET: 'goal_reminder_set',
  DAILY_GOAL_VIEW: 'daily_goal_view',
  WEEKLY_GOAL_VIEW: 'weekly_goal_view',
  MONTHLY_GOAL_VIEW: 'monthly_goal_view',
};

// Achievement Events
export const ACHIEVEMENT_EVENTS = {
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  ACHIEVEMENT_VIEW: 'achievement_view',
  ACHIEVEMENT_SHARE: 'achievement_share',
  STREAK_UPDATE: 'streak_update',
  STREAK_MILESTONE: 'streak_milestone',
  LEVEL_UP: 'level_up',
  BADGE_EARNED: 'badge_earned',
};

// Lifestyle Events
export const LIFESTYLE_EVENTS = {
  DIET_LOG: 'diet_log',
  EXERCISE_LOG: 'exercise_log',
  MEDITATION_LOG: 'meditation_log',
  WATER_LOG: 'water_log',
  SLEEP_LOG: 'sleep_log',
  MOOD_LOG: 'mood_log',
  JOURNAL_ENTRY: 'journal_entry',
  RECIPE_VIEW: 'recipe_view',
  RECIPE_SAVE: 'recipe_save',
  RECIPE_TRY: 'recipe_try',
  EXERCISE_START: 'exercise_start',
  EXERCISE_COMPLETE: 'exercise_complete',
  MEDITATION_START: 'meditation_start',
  MEDITATION_COMPLETE: 'meditation_complete',
};

// Device Events
export const DEVICE_EVENTS = {
  DEVICE_CONNECT: 'device_connect',
  DEVICE_DISCONNECT: 'device_disconnect',
  DEVICE_SYNC: 'device_sync',
  DEVICE_SYNC_SUCCESS: 'device_sync_success',
  DEVICE_SYNC_FAILED: 'device_sync_failed',
  DEVICE_BATTERY_LOW: 'device_battery_low',
  DEVICE_UPDATE_AVAILABLE: 'device_update_available',
  DEVICE_UPDATE_START: 'device_update_start',
  DEVICE_UPDATE_COMPLETE: 'device_update_complete',
  DEVICE_CALIBRATE: 'device_calibrate',
  DEVICE_ERROR: 'device_error',
};

// Report Events
export const REPORT_EVENTS = {
  REPORT_VIEW: 'report_view',
  REPORT_DOWNLOAD: 'report_download',
  REPORT_SHARE: 'report_share',
  REPORT_EMAIL: 'report_email',
  REPORT_PRINT: 'report_print',
  DAILY_REPORT_VIEW: 'daily_report_view',
  WEEKLY_REPORT_VIEW: 'weekly_report_view',
  MONTHLY_REPORT_VIEW: 'monthly_report_view',
  CUSTOM_REPORT_CREATE: 'custom_report_create',
};

// Subscription Events
export const SUBSCRIPTION_EVENTS = {
  SUBSCRIPTION_VIEW: 'subscription_view',
  SUBSCRIPTION_START: 'subscription_start',
  SUBSCRIPTION_COMPLETE: 'subscription_complete',
  SUBSCRIPTION_CANCEL: 'subscription_cancel',
  SUBSCRIPTION_RENEW: 'subscription_renew',
  SUBSCRIPTION_EXPIRE: 'subscription_expire',
  SUBSCRIPTION_UPGRADE: 'subscription_upgrade',
  SUBSCRIPTION_DOWNGRADE: 'subscription_downgrade',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
  PAYMENT_METHOD_ADD: 'payment_method_add',
  PAYMENT_METHOD_REMOVE: 'payment_method_remove',
  TRIAL_START: 'trial_start',
  TRIAL_END: 'trial_end',
};

// Education Events
export const EDUCATION_EVENTS = {
  ARTICLE_VIEW: 'article_view',
  ARTICLE_SAVE: 'article_save',
  ARTICLE_SHARE: 'article_share',
  VIDEO_VIEW: 'video_view',
  VIDEO_COMPLETE: 'video_complete',
  QUIZ_START: 'quiz_start',
  QUIZ_COMPLETE: 'quiz_complete',
  QUIZ_RESULT: 'quiz_result',
  COURSE_START: 'course_start',
  COURSE_COMPLETE: 'course_complete',
  LESSON_COMPLETE: 'lesson_complete',
};

// Chatbot Events
export const CHATBOT_EVENTS = {
  CHAT_START: 'chat_start',
  CHAT_END: 'chat_end',
  CHAT_MESSAGE_SEND: 'chat_message_send',
  CHAT_MESSAGE_RECEIVE: 'chat_message_receive',
  QUICK_REPLY_USE: 'quick_reply_use',
  FEEDBACK_SUBMIT: 'feedback_submit',
  CHAT_RATING: 'chat_rating',
  ESCALATE_TO_HUMAN: 'escalate_to_human',
};

// Search Events
export const SEARCH_EVENTS = {
  SEARCH: 'search',
  SEARCH_RESULT_CLICK: 'search_result_click',
  SEARCH_FILTER: 'search_filter',
  SEARCH_SORT: 'search_sort',
  SEARCH_CLEAR: 'search_clear',
  ADVANCED_SEARCH: 'advanced_search',
  SAVED_SEARCH: 'saved_search',
};

// Social Events
export const SOCIAL_EVENTS = {
  SHARE: 'share',
  SHARE_SUCCESS: 'share_success',
  SHARE_FAILED: 'share_failed',
  INVITE_SENT: 'invite_sent',
  INVITE_ACCEPTED: 'invite_accepted',
  FRIEND_ADDED: 'friend_added',
  FRIEND_REMOVED: 'friend_removed',
  LEADERBOARD_VIEW: 'leaderboard_view',
  COMPARE_START: 'compare_start',
  COMPARE_RESULT: 'compare_result',
};

// Feedback Events
export const FEEDBACK_EVENTS = {
  FEEDBACK_OPEN: 'feedback_open',
  FEEDBACK_SUBMIT: 'feedback_submit',
  FEEDBACK_CANCEL: 'feedback_cancel',
  RATING_SUBMIT: 'rating_submit',
  RATING_SKIP: 'rating_skip',
  REVIEW_WRITE: 'review_write',
  SUPPORT_CONTACT: 'support_contact',
  BUG_REPORT: 'bug_report',
  FEATURE_REQUEST: 'feature_request',
};

// Error Events
export const ERROR_EVENTS = {
  ERROR_OCCURRED: 'error_occurred',
  ERROR_RESOLVED: 'error_resolved',
  NETWORK_ERROR: 'network_error',
  API_ERROR: 'api_error',
  VALIDATION_ERROR: 'validation_error',
  PERMISSION_ERROR: 'permission_error',
  DEVICE_ERROR: 'device_error',
  SYNC_ERROR: 'sync_error',
  CRASH_REPORT: 'crash_report',
};

// Performance Events
export const PERFORMANCE_EVENTS = {
  APP_LOAD_TIME: 'app_load_time',
  SCREEN_LOAD_TIME: 'screen_load_time',
  API_RESPONSE_TIME: 'api_response_time',
  SYNC_TIME: 'sync_time',
  RENDER_TIME: 'render_time',
  MEMORY_USAGE: 'memory_usage',
  BATTERY_USAGE: 'battery_usage',
  NETWORK_SPEED: 'network_speed',
};

// Export all events together
export const ALL_EVENTS = {
  ...APP_EVENTS,
  ...SESSION_EVENTS,
  ...AUTH_EVENTS,
  ...USER_EVENTS,
  ...ONBOARDING_EVENTS,
  ...REGISTRATION_EVENTS,
  ...HEALTH_EVENTS,
  ...ALERT_EVENTS,
  ...PREDICTION_EVENTS,
  ...DOSHA_EVENTS,
  ...GOAL_EVENTS,
  ...ACHIEVEMENT_EVENTS,
  ...LIFESTYLE_EVENTS,
  ...DEVICE_EVENTS,
  ...REPORT_EVENTS,
  ...SUBSCRIPTION_EVENTS,
  ...EDUCATION_EVENTS,
  ...CHATBOT_EVENTS,
  ...SEARCH_EVENTS,
  ...SOCIAL_EVENTS,
  ...FEEDBACK_EVENTS,
  ...ERROR_EVENTS,
  ...PERFORMANCE_EVENTS,
};

// Event categories for grouping
export const EVENT_CATEGORIES = {
  APP: 'app',
  SESSION: 'session',
  AUTH: 'authentication',
  USER: 'user',
  ONBOARDING: 'onboarding',
  REGISTRATION: 'registration',
  HEALTH: 'health',
  ALERT: 'alert',
  PREDICTION: 'prediction',
  DOSHA: 'dosha',
  GOAL: 'goal',
  ACHIEVEMENT: 'achievement',
  LIFESTYLE: 'lifestyle',
  DEVICE: 'device',
  REPORT: 'report',
  SUBSCRIPTION: 'subscription',
  EDUCATION: 'education',
  CHATBOT: 'chatbot',
  SEARCH: 'search',
  SOCIAL: 'social',
  FEEDBACK: 'feedback',
  ERROR: 'error',
  PERFORMANCE: 'performance',
};

// Event priorities for sending
export const EVENT_PRIORITIES = {
  CRITICAL: 'critical',   // Send immediately
  HIGH: 'high',           // Send within 5 seconds
  MEDIUM: 'medium',       // Send within 30 seconds
  LOW: 'low',             // Batch send
};

// Map events to priorities
export const EVENT_PRIORITY_MAP = {
  [APP_EVENTS.APP_CRASH]: EVENT_PRIORITIES.CRITICAL,
  [ERROR_EVENTS.ERROR_OCCURRED]: EVENT_PRIORITIES.HIGH,
  [AUTH_EVENTS.LOGIN]: EVENT_PRIORITIES.HIGH,
  [AUTH_EVENTS.SIGNUP]: EVENT_PRIORITIES.HIGH,
  [SUBSCRIPTION_EVENTS.SUBSCRIPTION_START]: EVENT_PRIORITIES.HIGH,
  [ACHIEVEMENT_EVENTS.ACHIEVEMENT_UNLOCKED]: EVENT_PRIORITIES.MEDIUM,
  [GOAL_EVENTS.GOAL_COMPLETE]: EVENT_PRIORITIES.MEDIUM,
  // Default priority is LOW
};

export default {
  APP_EVENTS,
  SESSION_EVENTS,
  AUTH_EVENTS,
  USER_EVENTS,
  ONBOARDING_EVENTS,
  REGISTRATION_EVENTS,
  HEALTH_EVENTS,
  ALERT_EVENTS,
  PREDICTION_EVENTS,
  DOSHA_EVENTS,
  GOAL_EVENTS,
  ACHIEVEMENT_EVENTS,
  LIFESTYLE_EVENTS,
  DEVICE_EVENTS,
  REPORT_EVENTS,
  SUBSCRIPTION_EVENTS,
  EDUCATION_EVENTS,
  CHATBOT_EVENTS,
  SEARCH_EVENTS,
  SOCIAL_EVENTS,
  FEEDBACK_EVENTS,
  ERROR_EVENTS,
  PERFORMANCE_EVENTS,
  ALL_EVENTS,
  EVENT_CATEGORIES,
  EVENT_PRIORITIES,
  EVENT_PRIORITY_MAP,
};