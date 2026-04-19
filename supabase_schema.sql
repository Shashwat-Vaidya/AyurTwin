-- =====================================================
-- AYURTWIN - COMPLETE SUPABASE DATABASE SCHEMA v3.0
-- DROP ALL + RECREATE + DUMMY DATA
-- 5 Patients + 2 Parent family members each
-- Sensor data: temperature, spo2, heart_rate, accel_x/y/z
-- Paste this SQL into Supabase SQL Editor and Run
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- DROP ALL EXISTING TABLES (in dependency order)
-- =====================================================
DROP TABLE IF EXISTS user_prevention_plans CASCADE;
DROP TABLE IF EXISTS disease_prevention_protocols CASCADE;
DROP TABLE IF EXISTS chatbot_conversations CASCADE;
DROP TABLE IF EXISTS health_journey CASCADE;
DROP TABLE IF EXISTS meal_tracking CASCADE;
DROP TABLE IF EXISTS dinacharya_tracking CASCADE;
DROP TABLE IF EXISTS social_comments CASCADE;
DROP TABLE IF EXISTS social_likes CASCADE;
DROP TABLE IF EXISTS social_posts CASCADE;
DROP TABLE IF EXISTS leaderboard CASCADE;
DROP TABLE IF EXISTS family_connections CASCADE;
DROP TABLE IF EXISTS recommendations CASCADE;
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS ritucharya_plans CASCADE;
DROP TABLE IF EXISTS dosha_clock_log CASCADE;
DROP TABLE IF EXISTS panchakarma_assessment CASCADE;
DROP TABLE IF EXISTS nadi_pariksha CASCADE;
DROP TABLE IF EXISTS yoga_sessions CASCADE;
DROP TABLE IF EXISTS yoga_recommendations CASCADE;
DROP TABLE IF EXISTS yoga_poses CASCADE;
DROP TABLE IF EXISTS viruddha_ahara_log CASCADE;
DROP TABLE IF EXISTS viruddha_ahara_rules CASCADE;
DROP TABLE IF EXISTS meal_plans CASCADE;
DROP TABLE IF EXISTS food_recommendations CASCADE;
DROP TABLE IF EXISTS food_database CASCADE;
DROP TABLE IF EXISTS dosha_balance CASCADE;
DROP TABLE IF EXISTS disease_predictions CASCADE;
DROP TABLE IF EXISTS sensor_readings CASCADE;
DROP TABLE IF EXISTS health_metrics CASCADE;
DROP TABLE IF EXISTS prakriti_quiz CASCADE;
DROP TABLE IF EXISTS ayurvedic_inputs CASCADE;
DROP TABLE IF EXISTS symptoms CASCADE;
DROP TABLE IF EXISTS family_history CASCADE;
DROP TABLE IF EXISTS sleep_mental_data CASCADE;
DROP TABLE IF EXISTS lifestyle_data CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('patient', 'family_member', 'doctor')),
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    age INT,
    gender VARCHAR(20),
    blood_group VARCHAR(10),
    height_cm FLOAT,
    weight_kg FLOAT,
    bmi FLOAT,
    bmi_category VARCHAR(20),
    relationship VARCHAR(50),
    profile_image_url TEXT,
    location VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. LIFESTYLE DATA
-- =====================================================
CREATE TABLE lifestyle_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    physical_activity VARCHAR(20) CHECK (physical_activity IN ('low', 'moderate', 'high')),
    work_type VARCHAR(20) CHECK (work_type IN ('sitting', 'active', 'mixed')),
    diet_type VARCHAR(50),
    smoking BOOLEAN DEFAULT FALSE,
    alcohol BOOLEAN DEFAULT FALSE,
    water_intake_liters FLOAT,
    junk_food_frequency INT,
    exercise_minutes INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. SLEEP & MENTAL HEALTH DATA
-- =====================================================
CREATE TABLE sleep_mental_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    sleep_duration_hours FLOAT,
    sleep_time TIME,
    wake_time TIME,
    daytime_sleepiness INT CHECK (daytime_sleepiness BETWEEN 0 AND 10),
    stress_level INT CHECK (stress_level BETWEEN 0 AND 10),
    anxiety_level INT CHECK (anxiety_level BETWEEN 0 AND 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. FAMILY HISTORY
-- =====================================================
CREATE TABLE family_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    diabetes BOOLEAN DEFAULT FALSE,
    heart_disease BOOLEAN DEFAULT FALSE,
    hypertension BOOLEAN DEFAULT FALSE,
    asthma BOOLEAN DEFAULT FALSE,
    arthritis BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. SYMPTOMS
-- =====================================================
CREATE TABLE symptoms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    frequent_thirst BOOLEAN DEFAULT FALSE,
    frequent_urination BOOLEAN DEFAULT FALSE,
    joint_pain BOOLEAN DEFAULT FALSE,
    breathing_difficulty BOOLEAN DEFAULT FALSE,
    digestive_issues BOOLEAN DEFAULT FALSE,
    fatigue_level INT CHECK (fatigue_level BETWEEN 0 AND 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. AYURVEDIC INPUTS
-- =====================================================
CREATE TABLE ayurvedic_inputs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    digestion_strength INT CHECK (digestion_strength BETWEEN 0 AND 10),
    appetite INT CHECK (appetite BETWEEN 0 AND 10),
    sweating INT CHECK (sweating BETWEEN 0 AND 10),
    body_temperature VARCHAR(20) CHECK (body_temperature IN ('cold', 'normal', 'hot')),
    stress_response VARCHAR(20) CHECK (stress_response IN ('calm', 'irritable', 'anxious')),
    tongue_coating VARCHAR(30) DEFAULT 'normal',
    pulse_quality VARCHAR(30),
    skin_type VARCHAR(30),
    bowel_regularity VARCHAR(20) DEFAULT 'regular',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. PRAKRITI QUIZ RESULTS
-- =====================================================
CREATE TABLE prakriti_quiz (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    vata_score INT NOT NULL,
    pitta_score INT NOT NULL,
    kapha_score INT NOT NULL,
    vata_percent FLOAT NOT NULL,
    pitta_percent FLOAT NOT NULL,
    kapha_percent FLOAT NOT NULL,
    prakriti VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. HEALTH METRICS (From ESP32 sensors + simulated)
-- =====================================================
CREATE TABLE health_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    heart_rate INT,
    temperature FLOAT,
    spo2 FLOAT,
    stress_index INT,
    sleep_score INT,
    activity_score INT,
    blood_pressure_systolic INT,
    blood_pressure_diastolic INT,
    respiratory_rate INT,
    source VARCHAR(20) DEFAULT 'simulated' CHECK (source IN ('esp32', 'simulated', 'manual')),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. SENSOR READINGS (IoT - Temperature, SpO2, HR, Accelerometer)
-- =====================================================
CREATE TABLE sensor_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(50),
    temperature FLOAT,
    spo2 FLOAT,
    heart_rate INT,
    accel_x FLOAT,
    accel_y FLOAT,
    accel_z FLOAT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. DISEASE PREDICTIONS
-- =====================================================
CREATE TABLE disease_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    diabetes_risk FLOAT,
    hypertension_risk FLOAT,
    heart_disease_risk FLOAT,
    stress_risk FLOAT,
    sleep_disorder_risk FLOAT,
    asthma_risk FLOAT,
    arthritis_risk FLOAT,
    obesity_risk FLOAT,
    digestive_disorder_risk FLOAT,
    fever_risk FLOAT,
    thyroid_risk FLOAT,
    anxiety_disorder_risk FLOAT,
    overall_health_score INT CHECK (overall_health_score BETWEEN 0 AND 100),
    prediction_method VARCHAR(20) DEFAULT 'hybrid' CHECK (prediction_method IN ('rule_based', 'ml', 'hybrid')),
    model_confidence FLOAT,
    predicted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 11. DOSHA BALANCE TRACKING
-- =====================================================
CREATE TABLE dosha_balance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vata_level FLOAT,
    pitta_level FLOAT,
    kapha_level FLOAT,
    agni_strength VARCHAR(20),
    ama_level VARCHAR(20),
    ojas_level VARCHAR(20),
    imbalance_detected BOOLEAN DEFAULT FALSE,
    imbalance_type VARCHAR(50),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 12. FOOD DATABASE
-- =====================================================
CREATE TABLE food_database (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    sanskrit_name VARCHAR(100),
    category VARCHAR(50) NOT NULL,
    rasa VARCHAR(100),
    guna VARCHAR(100),
    virya VARCHAR(20),
    vipaka VARCHAR(30),
    dosha_effect JSONB,
    calories_per_100g FLOAT,
    protein_g FLOAT,
    fat_g FLOAT,
    carbs_g FLOAT,
    fiber_g FLOAT,
    best_season VARCHAR(100),
    best_time VARCHAR(100),
    contraindications TEXT,
    benefits TEXT,
    is_vegetarian BOOLEAN DEFAULT TRUE,
    is_vegan BOOLEAN DEFAULT FALSE,
    glycemic_index INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 13. FOOD RECOMMENDATIONS
-- =====================================================
CREATE TABLE food_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    food_id UUID REFERENCES food_database(id),
    food_name VARCHAR(100) NOT NULL,
    recommendation_type VARCHAR(30) CHECK (recommendation_type IN ('highly_recommended', 'recommended', 'moderate', 'avoid')),
    score INT,
    reasons JSONB,
    meal_time VARCHAR(30),
    serving_size_g FLOAT,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 14. MEAL PLANS
-- =====================================================
CREATE TABLE meal_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_date DATE NOT NULL,
    upon_waking JSONB,
    breakfast JSONB,
    mid_morning JSONB,
    lunch JSONB,
    evening_snack JSONB,
    dinner JSONB,
    before_bed JSONB,
    dietary_guidelines JSONB,
    total_calories INT,
    total_protein_g FLOAT,
    season VARCHAR(30),
    dosha_focus VARCHAR(50),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, plan_date)
);

-- =====================================================
-- 15. VIRUDDHA AHARA RULES
-- =====================================================
CREATE TABLE viruddha_ahara_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    food_a VARCHAR(100) NOT NULL,
    food_b VARCHAR(100) NOT NULL,
    incompatibility_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('mild', 'moderate', 'severe')),
    explanation TEXT NOT NULL,
    reference_text VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 16. VIRUDDHA AHARA LOG
-- =====================================================
CREATE TABLE viruddha_ahara_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    foods_checked JSONB NOT NULL,
    incompatible_pairs JSONB,
    is_compatible BOOLEAN,
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 17. YOGA POSES DATABASE
-- =====================================================
CREATE TABLE yoga_poses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    sanskrit_name VARCHAR(100),
    category VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    dosha_effect JSONB,
    target_muscles JSONB,
    benefits TEXT,
    contraindications TEXT,
    instructions TEXT,
    duration_seconds INT DEFAULT 30,
    image_url TEXT,
    video_url TEXT,
    best_time VARCHAR(50),
    pranayama_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 18. YOGA RECOMMENDATIONS
-- =====================================================
CREATE TABLE yoga_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    pose_id UUID REFERENCES yoga_poses(id),
    pose_name VARCHAR(100) NOT NULL,
    recommendation_reason TEXT,
    priority INT DEFAULT 1,
    session_type VARCHAR(30) CHECK (session_type IN ('morning', 'evening', 'therapeutic', 'seasonal')),
    duration_minutes INT,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 19. YOGA SESSIONS
-- =====================================================
CREATE TABLE yoga_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    session_type VARCHAR(30),
    poses_completed JSONB,
    duration_minutes INT,
    feeling_before INT CHECK (feeling_before BETWEEN 1 AND 10),
    feeling_after INT CHECK (feeling_after BETWEEN 1 AND 10),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 20. NADI PARIKSHA
-- =====================================================
CREATE TABLE nadi_pariksha (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    pulse_rate INT,
    pulse_rhythm VARCHAR(30),
    pulse_volume VARCHAR(20),
    pulse_character VARCHAR(30),
    vata_pulse FLOAT,
    pitta_pulse FLOAT,
    kapha_pulse FLOAT,
    nadi_type VARCHAR(50),
    interpretation TEXT,
    raw_sensor_data JSONB,
    confidence_score FLOAT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 21. PANCHAKARMA ASSESSMENT
-- =====================================================
CREATE TABLE panchakarma_assessment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ama_score INT CHECK (ama_score BETWEEN 0 AND 100),
    ojas_score INT CHECK (ojas_score BETWEEN 0 AND 100),
    agni_score INT CHECK (agni_score BETWEEN 0 AND 100),
    readiness_score INT CHECK (readiness_score BETWEEN 0 AND 100),
    recommended_therapies JSONB,
    contraindicated_therapies JSONB,
    preparatory_steps JSONB,
    dosha_specific_protocol VARCHAR(50),
    assessment_details JSONB,
    assessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 22. DOSHA CLOCK LOG
-- =====================================================
CREATE TABLE dosha_clock_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    time_period VARCHAR(30) NOT NULL,
    dominant_dosha VARCHAR(20) NOT NULL,
    recommendation TEXT NOT NULL,
    activity_type VARCHAR(30),
    followed BOOLEAN DEFAULT FALSE,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 23. RITUCHARYA
-- =====================================================
CREATE TABLE ritucharya_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    season VARCHAR(30) NOT NULL,
    ritu_name VARCHAR(50) NOT NULL,
    diet_plan JSONB,
    lifestyle_plan JSONB,
    exercise_plan JSONB,
    herbs_recommended JSONB,
    foods_to_favor JSONB,
    foods_to_avoid JSONB,
    daily_routine JSONB,
    dosha_considerations JSONB,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 24. ALERTS
-- =====================================================
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    alert_type VARCHAR(30) CHECK (alert_type IN ('critical', 'warning', 'info', 'dosha', 'risk', 'system', 'food', 'yoga')),
    category VARCHAR(30) CHECK (category IN ('stress', 'dosha', 'risk', 'sleep', 'vitals', 'system', 'food', 'yoga', 'panchakarma')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 25. RECOMMENDATIONS
-- =====================================================
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(30) CHECK (recommendation_type IN ('diet', 'exercise', 'lifestyle', 'ayurvedic', 'medical', 'yoga', 'panchakarma', 'seasonal')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority INT DEFAULT 1,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 26. FAMILY CONNECTIONS
-- =====================================================
CREATE TABLE family_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    family_member_id UUID REFERENCES users(id) ON DELETE CASCADE,
    relationship VARCHAR(50),
    status VARCHAR(20) DEFAULT 'accepted' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(patient_id, family_member_id)
);

-- =====================================================
-- 27. LEADERBOARD
-- =====================================================
CREATE TABLE leaderboard (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    health_score INT DEFAULT 0,
    improvement_score INT DEFAULT 0,
    consistency_score INT DEFAULT 0,
    yoga_score INT DEFAULT 0,
    diet_score INT DEFAULT 0,
    total_score INT DEFAULT 0,
    rank INT,
    streak_days INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 28. SOCIAL POSTS
-- =====================================================
CREATE TABLE social_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    post_type VARCHAR(30) CHECK (post_type IN ('achievement', 'milestone', 'tip', 'general', 'yoga', 'recipe', 'challenge')),
    image_url TEXT,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 29. SOCIAL LIKES
-- =====================================================
CREATE TABLE social_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- =====================================================
-- 30. SOCIAL COMMENTS
-- =====================================================
CREATE TABLE social_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 31. DINACHARYA TRACKING
-- =====================================================
CREATE TABLE dinacharya_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    wake_early BOOLEAN DEFAULT FALSE,
    oil_pulling BOOLEAN DEFAULT FALSE,
    tongue_scraping BOOLEAN DEFAULT FALSE,
    drink_water BOOLEAN DEFAULT FALSE,
    exercise BOOLEAN DEFAULT FALSE,
    meditation BOOLEAN DEFAULT FALSE,
    pranayama BOOLEAN DEFAULT FALSE,
    abhyanga BOOLEAN DEFAULT FALSE,
    healthy_breakfast BOOLEAN DEFAULT FALSE,
    healthy_lunch BOOLEAN DEFAULT FALSE,
    healthy_dinner BOOLEAN DEFAULT FALSE,
    early_sleep BOOLEAN DEFAULT FALSE,
    completion_percent FLOAT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- =====================================================
-- 32. MEAL TRACKING
-- =====================================================
CREATE TABLE meal_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    meal_type VARCHAR(20) CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    description TEXT,
    foods JSONB,
    calories INT,
    is_dosha_appropriate BOOLEAN,
    is_seasonal BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 33. HEALTH JOURNEY
-- =====================================================
CREATE TABLE health_journey (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    week_number INT,
    health_score INT,
    weight FLOAT,
    bmi FLOAT,
    stress_level INT,
    sleep_quality INT,
    dosha_balance_score INT,
    yoga_sessions_completed INT DEFAULT 0,
    dinacharya_adherence FLOAT DEFAULT 0,
    notes TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 34. CHATBOT CONVERSATIONS
-- =====================================================
CREATE TABLE chatbot_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    sender VARCHAR(10) CHECK (sender IN ('user', 'bot')),
    context JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 35. DISEASE PREVENTION PROTOCOLS
-- =====================================================
CREATE TABLE disease_prevention_protocols (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disease_name VARCHAR(100) NOT NULL,
    ayurvedic_name VARCHAR(100),
    associated_dosha VARCHAR(100),
    risk_factors JSONB,
    dietary_protocol JSONB,
    lifestyle_protocol JSONB,
    yoga_protocol JSONB,
    herbal_remedies JSONB,
    panchakarma_therapy JSONB,
    warning_signs JSONB,
    prevention_score_weights JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 36. USER DISEASE PREVENTION PLANS
-- =====================================================
CREATE TABLE user_prevention_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    disease_name VARCHAR(100) NOT NULL,
    risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'moderate', 'high', 'critical')),
    risk_score FLOAT,
    prevention_actions JSONB,
    herbs_recommended JSONB,
    yoga_poses JSONB,
    dietary_changes JSONB,
    lifestyle_changes JSONB,
    follow_up_date DATE,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_lifestyle_user ON lifestyle_data(user_id);
CREATE INDEX idx_sleep_user ON sleep_mental_data(user_id);
CREATE INDEX idx_family_hist_user ON family_history(user_id);
CREATE INDEX idx_symptoms_user ON symptoms(user_id);
CREATE INDEX idx_ayurvedic_user ON ayurvedic_inputs(user_id);
CREATE INDEX idx_prakriti_user ON prakriti_quiz(user_id);
CREATE INDEX idx_metrics_user ON health_metrics(user_id);
CREATE INDEX idx_metrics_time ON health_metrics(recorded_at);
CREATE INDEX idx_sensor_user ON sensor_readings(user_id);
CREATE INDEX idx_sensor_time ON sensor_readings(recorded_at);
CREATE INDEX idx_predictions_user ON disease_predictions(user_id);
CREATE INDEX idx_dosha_user ON dosha_balance(user_id);
CREATE INDEX idx_food_db_category ON food_database(category);
CREATE INDEX idx_food_recs_user ON food_recommendations(user_id);
CREATE INDEX idx_meal_plans_user ON meal_plans(user_id, plan_date);
CREATE INDEX idx_yoga_category ON yoga_poses(category);
CREATE INDEX idx_yoga_recs_user ON yoga_recommendations(user_id);
CREATE INDEX idx_yoga_sessions_user ON yoga_sessions(user_id);
CREATE INDEX idx_nadi_user ON nadi_pariksha(user_id);
CREATE INDEX idx_panchakarma_user ON panchakarma_assessment(user_id);
CREATE INDEX idx_dosha_clock_user ON dosha_clock_log(user_id);
CREATE INDEX idx_ritucharya_user ON ritucharya_plans(user_id);
CREATE INDEX idx_alerts_user ON alerts(user_id);
CREATE INDEX idx_alerts_active ON alerts(is_active);
CREATE INDEX idx_recommendations_user ON recommendations(user_id);
CREATE INDEX idx_family_conn_patient ON family_connections(patient_id);
CREATE INDEX idx_family_conn_member ON family_connections(family_member_id);
CREATE INDEX idx_leaderboard_score ON leaderboard(total_score DESC);
CREATE INDEX idx_social_posts_user ON social_posts(user_id);
CREATE INDEX idx_social_posts_time ON social_posts(created_at DESC);
CREATE INDEX idx_dinacharya_user_date ON dinacharya_tracking(user_id, date);
CREATE INDEX idx_meal_user_date ON meal_tracking(user_id, date);
CREATE INDEX idx_journey_user ON health_journey(user_id);
CREATE INDEX idx_chatbot_user ON chatbot_conversations(user_id);
CREATE INDEX idx_prevention_user ON user_prevention_plans(user_id);
CREATE INDEX idx_viruddha_log_user ON viruddha_ahara_log(user_id);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifestyle_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_mental_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayurvedic_inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE prakriti_quiz ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dosha_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_database ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE viruddha_ahara_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE viruddha_ahara_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE yoga_poses ENABLE ROW LEVEL SECURITY;
ALTER TABLE yoga_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE yoga_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nadi_pariksha ENABLE ROW LEVEL SECURITY;
ALTER TABLE panchakarma_assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE dosha_clock_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ritucharya_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE dinacharya_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_journey ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_prevention_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_prevention_plans ENABLE ROW LEVEL SECURITY;

-- Permissive policies for anon key access
CREATE POLICY "Allow all for users" ON users FOR ALL USING (true) WITH CHECK (true);

DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN
        SELECT unnest(ARRAY[
            'lifestyle_data', 'sleep_mental_data', 'family_history',
            'symptoms', 'ayurvedic_inputs', 'prakriti_quiz',
            'health_metrics', 'sensor_readings', 'disease_predictions',
            'dosha_balance', 'food_database', 'food_recommendations',
            'meal_plans', 'viruddha_ahara_rules', 'viruddha_ahara_log',
            'yoga_poses', 'yoga_recommendations', 'yoga_sessions',
            'nadi_pariksha', 'panchakarma_assessment', 'dosha_clock_log',
            'ritucharya_plans', 'alerts', 'recommendations',
            'family_connections', 'leaderboard', 'social_posts',
            'social_likes', 'social_comments', 'dinacharya_tracking',
            'meal_tracking', 'health_journey', 'chatbot_conversations',
            'disease_prevention_protocols', 'user_prevention_plans'
        ])
    LOOP
        EXECUTE format('CREATE POLICY "Allow all for %s" ON %I FOR ALL USING (true) WITH CHECK (true)', tbl, tbl);
    END LOOP;
END $$;

-- =====================================================
-- FUNCTIONS
-- =====================================================
CREATE OR REPLACE FUNCTION increment_likes(p_post_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE social_posts SET likes_count = likes_count + 1 WHERE id = p_post_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_dinacharya_completion()
RETURNS TRIGGER AS $$
DECLARE
    total_tasks INT := 12;
    completed INT := 0;
BEGIN
    completed := (CASE WHEN NEW.wake_early THEN 1 ELSE 0 END) +
                 (CASE WHEN NEW.oil_pulling THEN 1 ELSE 0 END) +
                 (CASE WHEN NEW.tongue_scraping THEN 1 ELSE 0 END) +
                 (CASE WHEN NEW.drink_water THEN 1 ELSE 0 END) +
                 (CASE WHEN NEW.exercise THEN 1 ELSE 0 END) +
                 (CASE WHEN NEW.meditation THEN 1 ELSE 0 END) +
                 (CASE WHEN NEW.pranayama THEN 1 ELSE 0 END) +
                 (CASE WHEN NEW.abhyanga THEN 1 ELSE 0 END) +
                 (CASE WHEN NEW.healthy_breakfast THEN 1 ELSE 0 END) +
                 (CASE WHEN NEW.healthy_lunch THEN 1 ELSE 0 END) +
                 (CASE WHEN NEW.healthy_dinner THEN 1 ELSE 0 END) +
                 (CASE WHEN NEW.early_sleep THEN 1 ELSE 0 END);
    NEW.completion_percent := ROUND((completed::FLOAT / total_tasks) * 100, 1);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_dinacharya_completion
    BEFORE INSERT OR UPDATE ON dinacharya_tracking
    FOR EACH ROW EXECUTE FUNCTION calculate_dinacharya_completion();

-- =====================================================
-- =====================================================
-- DUMMY DATA: 5 PATIENTS + 10 FAMILY MEMBERS (2 parents each)
-- All passwords are plain text for demo. In production, hash server-side.
-- =====================================================
-- =====================================================

-- =====================================================
-- PATIENT 1: Arjun Sharma (arjun / arjun123)
-- =====================================================
INSERT INTO users (id, username, email, password_hash, user_type, first_name, last_name, phone, date_of_birth, age, gender, blood_group, height_cm, weight_kg, bmi, bmi_category)
VALUES ('11111111-1111-1111-1111-111111111111', 'arjun', 'arjun@ayurtwin.com', 'arjun123', 'patient', 'Arjun', 'Sharma', '9876543210', '1995-03-15', 31, 'Male', 'B+', 175, 72, 23.5, 'normal');

-- =====================================================
-- PATIENT 2: Priya Menon (priya / priya123)
-- =====================================================
INSERT INTO users (id, username, email, password_hash, user_type, first_name, last_name, phone, date_of_birth, age, gender, blood_group, height_cm, weight_kg, bmi, bmi_category)
VALUES ('22222222-2222-2222-2222-222222222222', 'priya', 'priya@ayurtwin.com', 'priya123', 'patient', 'Priya', 'Menon', '9876543211', '1998-07-22', 27, 'Female', 'O+', 162, 58, 22.1, 'normal');

-- =====================================================
-- PATIENT 3: Rahul Kapoor (rahul / rahul123)
-- =====================================================
INSERT INTO users (id, username, email, password_hash, user_type, first_name, last_name, phone, date_of_birth, age, gender, blood_group, height_cm, weight_kg, bmi, bmi_category)
VALUES ('33333333-3333-3333-3333-333333333333', 'rahul', 'rahul@ayurtwin.com', 'rahul123', 'patient', 'Rahul', 'Kapoor', '9876543212', '1992-11-08', 33, 'Male', 'A+', 180, 85, 26.2, 'overweight');

-- =====================================================
-- PATIENT 4: Sneha Reddy (sneha / sneha123)
-- =====================================================
INSERT INTO users (id, username, email, password_hash, user_type, first_name, last_name, phone, date_of_birth, age, gender, blood_group, height_cm, weight_kg, bmi, bmi_category)
VALUES ('44444444-4444-4444-4444-444444444444', 'sneha', 'sneha@ayurtwin.com', 'sneha123', 'patient', 'Sneha', 'Reddy', '9876543213', '2000-01-30', 26, 'Female', 'AB+', 158, 52, 20.8, 'normal');

-- =====================================================
-- PATIENT 5: Vikram Tiwari (vikram / vikram123)
-- =====================================================
INSERT INTO users (id, username, email, password_hash, user_type, first_name, last_name, phone, date_of_birth, age, gender, blood_group, height_cm, weight_kg, bmi, bmi_category)
VALUES ('55555555-5555-5555-5555-555555555555', 'vikram', 'vikram@ayurtwin.com', 'vikram123', 'patient', 'Vikram', 'Tiwari', '9876543214', '1988-05-12', 38, 'Male', 'O-', 170, 90, 31.1, 'obese');

-- =====================================================
-- FAMILY MEMBERS: 2 parents per patient (10 total)
-- =====================================================

-- Arjun's parents
INSERT INTO users (id, username, email, password_hash, user_type, first_name, last_name, age, gender, relationship)
VALUES ('a1000001-0000-0000-0000-000000000001', 'rajesh_sharma', 'rajesh.sharma@ayurtwin.com', 'rajesh123', 'family_member', 'Rajesh', 'Sharma', 58, 'Male', 'parent');
INSERT INTO users (id, username, email, password_hash, user_type, first_name, last_name, age, gender, relationship)
VALUES ('a1000002-0000-0000-0000-000000000002', 'sunita_sharma', 'sunita.sharma@ayurtwin.com', 'sunita123', 'family_member', 'Sunita', 'Sharma', 55, 'Female', 'parent');

-- Priya's parents
INSERT INTO users (id, username, email, password_hash, user_type, first_name, last_name, age, gender, relationship)
VALUES ('a2000001-0000-0000-0000-000000000001', 'gopalan_menon', 'gopalan.menon@ayurtwin.com', 'gopalan123', 'family_member', 'Gopalan', 'Menon', 60, 'Male', 'parent');
INSERT INTO users (id, username, email, password_hash, user_type, first_name, last_name, age, gender, relationship)
VALUES ('a2000002-0000-0000-0000-000000000002', 'lata_menon', 'lata.menon@ayurtwin.com', 'lata123', 'family_member', 'Lata', 'Menon', 56, 'Female', 'parent');

-- Rahul's parents
INSERT INTO users (id, username, email, password_hash, user_type, first_name, last_name, age, gender, relationship)
VALUES ('a3000001-0000-0000-0000-000000000001', 'anil_kapoor', 'anil.kapoor@ayurtwin.com', 'anil123', 'family_member', 'Anil', 'Kapoor', 62, 'Male', 'parent');
INSERT INTO users (id, username, email, password_hash, user_type, first_name, last_name, age, gender, relationship)
VALUES ('a3000002-0000-0000-0000-000000000002', 'meena_kapoor', 'meena.kapoor@ayurtwin.com', 'meena123', 'family_member', 'Meena', 'Kapoor', 59, 'Female', 'parent');

-- Sneha's parents
INSERT INTO users (id, username, email, password_hash, user_type, first_name, last_name, age, gender, relationship)
VALUES ('a4000001-0000-0000-0000-000000000001', 'krishna_reddy', 'krishna.reddy@ayurtwin.com', 'krishna123', 'family_member', 'Krishna', 'Reddy', 54, 'Male', 'parent');
INSERT INTO users (id, username, email, password_hash, user_type, first_name, last_name, age, gender, relationship)
VALUES ('a4000002-0000-0000-0000-000000000002', 'padma_reddy', 'padma.reddy@ayurtwin.com', 'padma123', 'family_member', 'Padma', 'Reddy', 51, 'Female', 'parent');

-- Vikram's parents
INSERT INTO users (id, username, email, password_hash, user_type, first_name, last_name, age, gender, relationship)
VALUES ('a5000001-0000-0000-0000-000000000001', 'ramesh_tiwari', 'ramesh.tiwari@ayurtwin.com', 'ramesh123', 'family_member', 'Ramesh', 'Tiwari', 65, 'Male', 'parent');
INSERT INTO users (id, username, email, password_hash, user_type, first_name, last_name, age, gender, relationship)
VALUES ('a5000002-0000-0000-0000-000000000002', 'kamla_tiwari', 'kamla.tiwari@ayurtwin.com', 'kamla123', 'family_member', 'Kamla', 'Tiwari', 61, 'Female', 'parent');

-- =====================================================
-- FAMILY CONNECTIONS (link parents to patients)
-- =====================================================
INSERT INTO family_connections (patient_id, family_member_id, relationship, status) VALUES
('11111111-1111-1111-1111-111111111111', 'a1000001-0000-0000-0000-000000000001', 'parent', 'accepted'),
('11111111-1111-1111-1111-111111111111', 'a1000002-0000-0000-0000-000000000002', 'parent', 'accepted'),
('22222222-2222-2222-2222-222222222222', 'a2000001-0000-0000-0000-000000000001', 'parent', 'accepted'),
('22222222-2222-2222-2222-222222222222', 'a2000002-0000-0000-0000-000000000002', 'parent', 'accepted'),
('33333333-3333-3333-3333-333333333333', 'a3000001-0000-0000-0000-000000000001', 'parent', 'accepted'),
('33333333-3333-3333-3333-333333333333', 'a3000002-0000-0000-0000-000000000002', 'parent', 'accepted'),
('44444444-4444-4444-4444-444444444444', 'a4000001-0000-0000-0000-000000000001', 'parent', 'accepted'),
('44444444-4444-4444-4444-444444444444', 'a4000002-0000-0000-0000-000000000002', 'parent', 'accepted'),
('55555555-5555-5555-5555-555555555555', 'a5000001-0000-0000-0000-000000000001', 'parent', 'accepted'),
('55555555-5555-5555-5555-555555555555', 'a5000002-0000-0000-0000-000000000002', 'parent', 'accepted');

-- =====================================================
-- LIFESTYLE DATA for all 5 patients
-- =====================================================
INSERT INTO lifestyle_data (user_id, physical_activity, work_type, diet_type, smoking, alcohol, water_intake_liters, junk_food_frequency, exercise_minutes) VALUES
('11111111-1111-1111-1111-111111111111', 'high', 'mixed', 'Vegetarian', false, false, 3.0, 2, 45),
('22222222-2222-2222-2222-222222222222', 'moderate', 'sitting', 'Vegetarian', false, false, 2.5, 3, 30),
('33333333-3333-3333-3333-333333333333', 'low', 'sitting', 'Non-vegetarian', false, true, 1.5, 6, 10),
('44444444-4444-4444-4444-444444444444', 'high', 'active', 'Vegan', false, false, 3.5, 1, 60),
('55555555-5555-5555-5555-555555555555', 'low', 'sitting', 'Non-vegetarian', true, true, 1.0, 8, 5);

-- =====================================================
-- SLEEP & MENTAL DATA for all 5 patients
-- =====================================================
INSERT INTO sleep_mental_data (user_id, sleep_duration_hours, sleep_time, wake_time, daytime_sleepiness, stress_level, anxiety_level) VALUES
('11111111-1111-1111-1111-111111111111', 7.5, '22:30', '06:00', 2, 3, 2),
('22222222-2222-2222-2222-222222222222', 7.0, '23:00', '06:00', 3, 4, 3),
('33333333-3333-3333-3333-333333333333', 5.5, '01:00', '06:30', 6, 7, 6),
('44444444-4444-4444-4444-444444444444', 8.0, '22:00', '06:00', 1, 2, 1),
('55555555-5555-5555-5555-555555555555', 5.0, '02:00', '07:00', 8, 9, 8);

-- =====================================================
-- FAMILY HISTORY for all 5 patients
-- =====================================================
INSERT INTO family_history (user_id, diabetes, heart_disease, hypertension, asthma, arthritis) VALUES
('11111111-1111-1111-1111-111111111111', false, false, false, false, false),
('22222222-2222-2222-2222-222222222222', true, false, false, false, false),
('33333333-3333-3333-3333-333333333333', true, true, true, false, false),
('44444444-4444-4444-4444-444444444444', false, false, false, true, false),
('55555555-5555-5555-5555-555555555555', true, true, true, false, true);

-- =====================================================
-- SYMPTOMS for all 5 patients
-- =====================================================
INSERT INTO symptoms (user_id, frequent_thirst, frequent_urination, joint_pain, breathing_difficulty, digestive_issues, fatigue_level) VALUES
('11111111-1111-1111-1111-111111111111', false, false, false, false, false, 2),
('22222222-2222-2222-2222-222222222222', false, false, false, false, true, 3),
('33333333-3333-3333-3333-333333333333', true, true, true, false, true, 7),
('44444444-4444-4444-4444-444444444444', false, false, false, true, false, 1),
('55555555-5555-5555-5555-555555555555', true, true, true, true, true, 9);

-- =====================================================
-- AYURVEDIC INPUTS for all 5 patients
-- =====================================================
INSERT INTO ayurvedic_inputs (user_id, digestion_strength, appetite, sweating, body_temperature, stress_response) VALUES
('11111111-1111-1111-1111-111111111111', 8, 7, 5, 'normal', 'calm'),
('22222222-2222-2222-2222-222222222222', 6, 6, 4, 'normal', 'calm'),
('33333333-3333-3333-3333-333333333333', 4, 8, 7, 'hot', 'irritable'),
('44444444-4444-4444-4444-444444444444', 9, 7, 3, 'cold', 'calm'),
('55555555-5555-5555-5555-555555555555', 3, 9, 8, 'hot', 'anxious');

-- =====================================================
-- PRAKRITI QUIZ for all 5 patients
-- =====================================================
INSERT INTO prakriti_quiz (user_id, answers, vata_score, pitta_score, kapha_score, vata_percent, pitta_percent, kapha_percent, prakriti) VALUES
('11111111-1111-1111-1111-111111111111', '{"q1":"a","q2":"b","q3":"a","q4":"b","q5":"a","q6":"c","q7":"a","q8":"b","q9":"a","q10":"b","q11":"a","q12":"c","q13":"a","q14":"a","q15":"b","q16":"a","q17":"c","q18":"a","q19":"b","q20":"a","q21":"c","q22":"a"}', 10, 7, 5, 45.5, 31.8, 22.7, 'Vata'),
('22222222-2222-2222-2222-222222222222', '{"q1":"b","q2":"b","q3":"b","q4":"b","q5":"a","q6":"b","q7":"b","q8":"b","q9":"b","q10":"a","q11":"b","q12":"b","q13":"b","q14":"a","q15":"b","q16":"b","q17":"a","q18":"b","q19":"b","q20":"a","q21":"b","q22":"b"}', 4, 14, 4, 18.2, 63.6, 18.2, 'Pitta'),
('33333333-3333-3333-3333-333333333333', '{"q1":"b","q2":"b","q3":"c","q4":"b","q5":"b","q6":"b","q7":"c","q8":"b","q9":"b","q10":"b","q11":"c","q12":"b","q13":"b","q14":"c","q15":"b","q16":"b","q17":"b","q18":"c","q19":"b","q20":"c","q21":"b","q22":"b"}', 2, 12, 8, 9.1, 54.5, 36.4, 'Pitta-Kapha'),
('44444444-4444-4444-4444-444444444444', '{"q1":"c","q2":"c","q3":"c","q4":"a","q5":"c","q6":"c","q7":"c","q8":"c","q9":"c","q10":"a","q11":"c","q12":"c","q13":"c","q14":"a","q15":"c","q16":"c","q17":"a","q18":"c","q19":"c","q20":"c","q21":"a","q22":"c"}', 4, 2, 16, 18.2, 9.1, 72.7, 'Kapha'),
('55555555-5555-5555-5555-555555555555', '{"q1":"a","q2":"a","q3":"b","q4":"a","q5":"a","q6":"a","q7":"b","q8":"a","q9":"a","q10":"b","q11":"a","q12":"a","q13":"b","q14":"a","q15":"a","q16":"b","q17":"a","q18":"a","q19":"a","q20":"b","q21":"a","q22":"a"}', 14, 6, 2, 63.6, 27.3, 9.1, 'Vata');

-- =====================================================
-- SENSOR READINGS - Dummy data for all 5 patients
-- Multiple readings per patient simulating real IoT data
-- Sensors: temperature, spo2, heart_rate, accel_x, accel_y, accel_z
-- =====================================================

-- Helper: Generate multiple sensor readings per patient
-- Arjun (healthy patient - normal readings)
INSERT INTO sensor_readings (user_id, device_id, temperature, spo2, heart_rate, accel_x, accel_y, accel_z, recorded_at) VALUES
('11111111-1111-1111-1111-111111111111', 'ATB-200-001', 36.5, 98, 72, 0.02, -0.01, 9.81, NOW() - INTERVAL '25 seconds'),
('11111111-1111-1111-1111-111111111111', 'ATB-200-001', 36.6, 98, 74, 0.05, 0.03, 9.79, NOW() - INTERVAL '20 seconds'),
('11111111-1111-1111-1111-111111111111', 'ATB-200-001', 36.5, 99, 71, -0.01, 0.02, 9.80, NOW() - INTERVAL '15 seconds'),
('11111111-1111-1111-1111-111111111111', 'ATB-200-001', 36.7, 98, 73, 0.03, -0.02, 9.82, NOW() - INTERVAL '10 seconds'),
('11111111-1111-1111-1111-111111111111', 'ATB-200-001', 36.6, 99, 72, 0.01, 0.01, 9.81, NOW() - INTERVAL '5 seconds');

-- Priya (moderate - slightly elevated stress)
INSERT INTO sensor_readings (user_id, device_id, temperature, spo2, heart_rate, accel_x, accel_y, accel_z, recorded_at) VALUES
('22222222-2222-2222-2222-222222222222', 'ATB-200-002', 36.7, 97, 78, 0.10, -0.05, 9.78, NOW() - INTERVAL '25 seconds'),
('22222222-2222-2222-2222-222222222222', 'ATB-200-002', 36.8, 97, 80, 0.15, 0.08, 9.75, NOW() - INTERVAL '20 seconds'),
('22222222-2222-2222-2222-222222222222', 'ATB-200-002', 36.7, 98, 77, 0.08, -0.03, 9.79, NOW() - INTERVAL '15 seconds'),
('22222222-2222-2222-2222-222222222222', 'ATB-200-002', 36.9, 97, 79, 0.12, 0.06, 9.77, NOW() - INTERVAL '10 seconds'),
('22222222-2222-2222-2222-222222222222', 'ATB-200-002', 36.8, 98, 78, 0.09, -0.02, 9.80, NOW() - INTERVAL '5 seconds');

-- Rahul (overweight, stressed - elevated readings)
INSERT INTO sensor_readings (user_id, device_id, temperature, spo2, heart_rate, accel_x, accel_y, accel_z, recorded_at) VALUES
('33333333-3333-3333-3333-333333333333', 'ATB-200-003', 37.0, 96, 88, 0.03, -0.01, 9.82, NOW() - INTERVAL '25 seconds'),
('33333333-3333-3333-3333-333333333333', 'ATB-200-003', 37.1, 96, 90, 0.05, 0.02, 9.80, NOW() - INTERVAL '20 seconds'),
('33333333-3333-3333-3333-333333333333', 'ATB-200-003', 37.0, 95, 87, 0.02, -0.03, 9.83, NOW() - INTERVAL '15 seconds'),
('33333333-3333-3333-3333-333333333333', 'ATB-200-003', 37.2, 96, 91, 0.04, 0.01, 9.81, NOW() - INTERVAL '10 seconds'),
('33333333-3333-3333-3333-333333333333', 'ATB-200-003', 37.1, 96, 89, 0.03, -0.02, 9.82, NOW() - INTERVAL '5 seconds');

-- Sneha (very healthy, active - great readings)
INSERT INTO sensor_readings (user_id, device_id, temperature, spo2, heart_rate, accel_x, accel_y, accel_z, recorded_at) VALUES
('44444444-4444-4444-4444-444444444444', 'ATB-200-004', 36.4, 99, 65, 0.50, -0.30, 9.70, NOW() - INTERVAL '25 seconds'),
('44444444-4444-4444-4444-444444444444', 'ATB-200-004', 36.5, 99, 64, 0.80, 0.40, 9.60, NOW() - INTERVAL '20 seconds'),
('44444444-4444-4444-4444-444444444444', 'ATB-200-004', 36.4, 100, 63, 1.20, -0.60, 9.50, NOW() - INTERVAL '15 seconds'),
('44444444-4444-4444-4444-444444444444', 'ATB-200-004', 36.5, 99, 66, 0.40, 0.20, 9.75, NOW() - INTERVAL '10 seconds'),
('44444444-4444-4444-4444-444444444444', 'ATB-200-004', 36.4, 100, 64, 0.60, -0.25, 9.68, NOW() - INTERVAL '5 seconds');

-- Vikram (obese, smoker, high stress - concerning readings)
INSERT INTO sensor_readings (user_id, device_id, temperature, spo2, heart_rate, accel_x, accel_y, accel_z, recorded_at) VALUES
('55555555-5555-5555-5555-555555555555', 'ATB-200-005', 37.2, 95, 95, 0.01, 0.00, 9.82, NOW() - INTERVAL '25 seconds'),
('55555555-5555-5555-5555-555555555555', 'ATB-200-005', 37.3, 94, 98, 0.02, -0.01, 9.83, NOW() - INTERVAL '20 seconds'),
('55555555-5555-5555-5555-555555555555', 'ATB-200-005', 37.1, 95, 93, 0.01, 0.01, 9.81, NOW() - INTERVAL '15 seconds'),
('55555555-5555-5555-5555-555555555555', 'ATB-200-005', 37.4, 94, 97, 0.02, -0.02, 9.84, NOW() - INTERVAL '10 seconds'),
('55555555-5555-5555-5555-555555555555', 'ATB-200-005', 37.3, 95, 96, 0.01, 0.00, 9.82, NOW() - INTERVAL '5 seconds');

-- =====================================================
-- LEADERBOARD for all 5 patients
-- =====================================================
INSERT INTO leaderboard (user_id, health_score, improvement_score, consistency_score, yoga_score, diet_score, total_score, rank, streak_days) VALUES
('11111111-1111-1111-1111-111111111111', 88, 15, 92, 80, 85, 92, 1, 45),
('22222222-2222-2222-2222-222222222222', 82, 12, 88, 75, 80, 88, 2, 30),
('44444444-4444-4444-4444-444444444444', 90, 18, 95, 90, 88, 85, 3, 60),
('33333333-3333-3333-3333-333333333333', 55, 8, 60, 40, 45, 55, 4, 10),
('55555555-5555-5555-5555-555555555555', 35, 3, 30, 10, 20, 35, 5, 3);

-- =====================================================
-- SOCIAL POSTS from registered patients
-- =====================================================
INSERT INTO social_posts (user_id, content, post_type, likes_count, comments_count, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Just completed 30 days of consistent meditation! My stress score dropped from 78 to 42. AyurTwin tracking really helped me stay motivated!', 'achievement', 24, 5, NOW() - INTERVAL '2 hours'),
('22222222-2222-2222-2222-222222222222', 'My health score reached 88 today! Following Pitta-balancing diet and cooling exercises made a huge difference.', 'milestone', 18, 3, NOW() - INTERVAL '4 hours'),
('33333333-3333-3333-3333-333333333333', 'Tip: Warm turmeric milk before bed has improved my sleep quality by 30%. Try it if you have Vata imbalance!', 'tip', 32, 8, NOW() - INTERVAL '6 hours'),
('44444444-4444-4444-4444-444444444444', 'Started Dinacharya routine today. Woke up at 5:30 AM, did yoga, and had a healthy breakfast. Feeling amazing already!', 'general', 15, 2, NOW() - INTERVAL '8 hours'),
('55555555-5555-5555-5555-555555555555', 'Trying to get my health back on track. AyurTwin showed my stress at 90 - time for some serious lifestyle changes!', 'general', 20, 6, NOW() - INTERVAL '10 hours'),
('11111111-1111-1111-1111-111111111111', 'Morning yoga session complete! Surya Namaskar really boosts energy for the entire day.', 'yoga', 28, 4, NOW() - INTERVAL '1 day'),
('22222222-2222-2222-2222-222222222222', 'Tried a new Pitta-cooling recipe: Cucumber Raita with roasted cumin. Perfect for summer!', 'recipe', 22, 7, NOW() - INTERVAL '1 day 2 hours'),
('44444444-4444-4444-4444-444444444444', '7-day yoga challenge complete! My flexibility has improved and I feel so much calmer.', 'challenge', 35, 9, NOW() - INTERVAL '2 days');

-- =====================================================
-- DONE! All tables created, dummy data inserted.
--
-- LOGIN CREDENTIALS:
-- Patient 1: arjun / arjun123
-- Patient 2: priya / priya123
-- Patient 3: rahul / rahul123
-- Patient 4: sneha / sneha123
-- Patient 5: vikram / vikram123
--
-- Family members can also sign in:
-- rajesh_sharma / rajesh123, sunita_sharma / sunita123
-- gopalan_menon / gopalan123, lata_menon / lata123
-- anil_kapoor / anil123, meena_kapoor / meena123
-- krishna_reddy / krishna123, padma_reddy / padma123
-- ramesh_tiwari / ramesh123, kamla_tiwari / kamla123
-- =====================================================
