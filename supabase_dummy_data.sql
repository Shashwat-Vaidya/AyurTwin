-- =====================================================
-- CORRECTED FUNCTION: calculate_dinacharya_completion()
-- =====================================================
CREATE OR REPLACE FUNCTION calculate_dinacharya_completion()
RETURNS TRIGGER AS $$
DECLARE
    total_tasks INTEGER := 12;   -- adjust based on your actual number of checklist items
    completed   INTEGER;
BEGIN
    -- Count completed tasks from the NEW record
    completed :=
        (CASE WHEN NEW.wake_early        THEN 1 ELSE 0 END) +
        (CASE WHEN NEW.oil_pulling       THEN 1 ELSE 0 END) +
        (CASE WHEN NEW.tongue_scraping   THEN 1 ELSE 0 END) +
        (CASE WHEN NEW.drink_water       THEN 1 ELSE 0 END) +
        (CASE WHEN NEW.exercise          THEN 1 ELSE 0 END) +
        (CASE WHEN NEW.meditation        THEN 1 ELSE 0 END) +
        (CASE WHEN NEW.pranayama         THEN 1 ELSE 0 END) +
        (CASE WHEN NEW.abhyanga          THEN 1 ELSE 0 END) +
        (CASE WHEN NEW.healthy_breakfast THEN 1 ELSE 0 END) +
        (CASE WHEN NEW.healthy_lunch     THEN 1 ELSE 0 END) +
        (CASE WHEN NEW.healthy_dinner    THEN 1 ELSE 0 END) +
        (CASE WHEN NEW.early_sleep       THEN 1 ELSE 0 END);

    -- FIX: cast completed to NUMERIC instead of FLOAT
    NEW.completion_percent := ROUND(((completed::NUMERIC / total_tasks) * 100), 1);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- AYURTWIN - REALISTIC DUMMY DATA
-- Run AFTER supabase_schema.sql
-- =====================================================

-- Safety: widen any VARCHAR columns that may have been created too narrow
-- in earlier schema versions. Ignore errors if already wide enough.
DO $$
BEGIN
  BEGIN
    ALTER TABLE disease_prevention_protocols ALTER COLUMN associated_dosha TYPE VARCHAR(100);
  EXCEPTION WHEN others THEN NULL;
  END;
END $$;

-- =====================================================
-- USERS (8 realistic Indian patients + 2 family members)
-- =====================================================
INSERT INTO users (id, username, email, password_hash, user_type, first_name, middle_name, last_name, phone, date_of_birth, age, gender, blood_group, height_cm, weight_kg, bmi, bmi_category, location) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'arjun_sharma', 'arjun.sharma@email.com', 'hashed_pass_1', 'patient', 'Arjun', NULL, 'Sharma', '+91-9876543210', '1995-03-15', 31, 'Male', 'B+', 175.0, 78.0, 25.5, 'overweight', 'Mumbai, Maharashtra'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'priya_patel', 'priya.patel@email.com', 'hashed_pass_2', 'patient', 'Priya', 'Kumari', 'Patel', '+91-9876543211', '1990-08-22', 35, 'Female', 'A+', 160.0, 62.0, 24.2, 'normal', 'Ahmedabad, Gujarat'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'rahul_verma', 'rahul.verma@email.com', 'hashed_pass_3', 'patient', 'Rahul', NULL, 'Verma', '+91-9876543212', '1988-01-10', 38, 'Male', 'O+', 170.0, 92.0, 31.8, 'obese', 'Delhi'),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'sneha_reddy', 'sneha.reddy@email.com', 'hashed_pass_4', 'patient', 'Sneha', NULL, 'Reddy', '+91-9876543213', '1998-12-05', 27, 'Female', 'AB+', 165.0, 55.0, 20.2, 'normal', 'Hyderabad, Telangana'),
('e5f6a7b8-c9d0-1234-efab-345678901234', 'vikram_singh', 'vikram.singh@email.com', 'hashed_pass_5', 'patient', 'Vikram', 'Kumar', 'Singh', '+91-9876543214', '1975-06-20', 50, 'Male', 'B-', 180.0, 88.0, 27.2, 'overweight', 'Jaipur, Rajasthan'),
('f6a7b8c9-d0e1-2345-fabc-456789012345', 'ananya_nair', 'ananya.nair@email.com', 'hashed_pass_6', 'patient', 'Ananya', NULL, 'Nair', '+91-9876543215', '2000-04-18', 26, 'Female', 'O-', 158.0, 48.0, 19.2, 'normal', 'Kochi, Kerala'),
('a7b8c9d0-e1f2-3456-abcd-567890123456', 'dev_gupta', 'dev.gupta@email.com', 'hashed_pass_7', 'patient', 'Dev', NULL, 'Gupta', '+91-9876543216', '1992-11-30', 33, 'Male', 'A-', 172.0, 70.0, 23.7, 'normal', 'Lucknow, UP'),
('b8c9d0e1-f2a3-4567-bcde-678901234567', 'meera_iyer', 'meera.iyer@email.com', 'hashed_pass_8', 'patient', 'Meera', 'Lakshmi', 'Iyer', '+91-9876543217', '1985-07-08', 40, 'Female', 'B+', 155.0, 68.0, 28.3, 'overweight', 'Chennai, Tamil Nadu'),
('c9d0e1f2-a3b4-5678-cdef-789012345678', 'ravi_sharma_fm', 'ravi.sharma.fm@email.com', 'hashed_pass_9', 'family_member', 'Ravi', NULL, 'Sharma', '+91-9876543218', '1965-02-14', 61, 'Male', 'B+', 170.0, 75.0, 26.0, 'overweight', 'Mumbai, Maharashtra'),
('d0e1f2a3-b4c5-6789-defa-890123456789', 'dr_kavitha', 'dr.kavitha@email.com', 'hashed_pass_10', 'doctor', 'Kavitha', NULL, 'Menon', '+91-9876543219', '1980-09-25', 45, 'Female', 'A+', 162.0, 58.0, 22.1, 'normal', 'Bangalore, Karnataka');

-- =====================================================
-- LIFESTYLE DATA
-- =====================================================
INSERT INTO lifestyle_data (user_id, physical_activity, work_type, diet_type, smoking, alcohol, water_intake_liters, junk_food_frequency, exercise_minutes) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'moderate', 'sitting', 'Non-Vegetarian', false, true, 2.5, 5, 30),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'high', 'mixed', 'Vegetarian', false, false, 3.0, 2, 60),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'low', 'sitting', 'Non-Vegetarian', true, true, 1.5, 8, 10),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'high', 'active', 'Vegetarian', false, false, 3.5, 1, 45),
('e5f6a7b8-c9d0-1234-efab-345678901234', 'low', 'sitting', 'Non-Vegetarian', false, true, 2.0, 4, 15),
('f6a7b8c9-d0e1-2345-fabc-456789012345', 'moderate', 'mixed', 'Vegetarian', false, false, 2.8, 3, 40),
('a7b8c9d0-e1f2-3456-abcd-567890123456', 'moderate', 'sitting', 'Vegetarian', false, false, 2.5, 3, 35),
('b8c9d0e1-f2a3-4567-bcde-678901234567', 'low', 'sitting', 'Vegetarian', false, false, 1.8, 6, 20);

-- =====================================================
-- SLEEP & MENTAL DATA
-- =====================================================
INSERT INTO sleep_mental_data (user_id, sleep_duration_hours, sleep_time, wake_time, daytime_sleepiness, stress_level, anxiety_level) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 6.5, '23:30', '06:00', 4, 7, 5),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 7.5, '22:00', '05:30', 2, 4, 3),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 5.0, '01:00', '06:00', 7, 9, 8),
('d4e5f6a7-b8c9-0123-defa-234567890123', 8.0, '22:30', '06:30', 1, 3, 2),
('e5f6a7b8-c9d0-1234-efab-345678901234', 6.0, '23:00', '05:00', 5, 6, 4),
('f6a7b8c9-d0e1-2345-fabc-456789012345', 7.0, '22:00', '05:00', 3, 5, 6),
('a7b8c9d0-e1f2-3456-abcd-567890123456', 7.5, '22:30', '06:00', 2, 4, 3),
('b8c9d0e1-f2a3-4567-bcde-678901234567', 6.0, '00:00', '06:00', 6, 7, 5);

-- =====================================================
-- FAMILY HISTORY
-- =====================================================
INSERT INTO family_history (user_id, diabetes, heart_disease, hypertension, asthma, arthritis) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', true, false, true, false, false),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', false, false, false, false, false),
('c3d4e5f6-a7b8-9012-cdef-123456789012', true, true, true, false, true),
('d4e5f6a7-b8c9-0123-defa-234567890123', false, false, false, true, false),
('e5f6a7b8-c9d0-1234-efab-345678901234', true, true, true, false, true),
('f6a7b8c9-d0e1-2345-fabc-456789012345', false, false, false, false, false),
('a7b8c9d0-e1f2-3456-abcd-567890123456', false, false, true, false, false),
('b8c9d0e1-f2a3-4567-bcde-678901234567', true, false, true, true, false);

-- =====================================================
-- SYMPTOMS
-- =====================================================
INSERT INTO symptoms (user_id, frequent_thirst, frequent_urination, joint_pain, breathing_difficulty, digestive_issues, fatigue_level) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', true, false, false, false, true, 5),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', false, false, false, false, false, 2),
('c3d4e5f6-a7b8-9012-cdef-123456789012', true, true, true, true, true, 8),
('d4e5f6a7-b8c9-0123-defa-234567890123', false, false, false, false, false, 2),
('e5f6a7b8-c9d0-1234-efab-345678901234', true, false, true, false, true, 6),
('f6a7b8c9-d0e1-2345-fabc-456789012345', false, false, false, false, false, 4),
('a7b8c9d0-e1f2-3456-abcd-567890123456', false, false, false, false, true, 3),
('b8c9d0e1-f2a3-4567-bcde-678901234567', true, false, false, true, true, 6);

-- =====================================================
-- AYURVEDIC INPUTS
-- =====================================================
INSERT INTO ayurvedic_inputs (user_id, digestion_strength, appetite, sweating, body_temperature, stress_response, tongue_coating, pulse_quality, skin_type, bowel_regularity) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 6, 7, 6, 'hot', 'irritable', 'yellow', 'bounding', 'oily', 'regular'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 7, 6, 4, 'normal', 'calm', 'normal', 'steady', 'normal', 'regular'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 4, 8, 8, 'hot', 'irritable', 'thick_white', 'heavy', 'oily', 'irregular'),
('d4e5f6a7-b8c9-0123-defa-234567890123', 8, 5, 3, 'cold', 'anxious', 'normal', 'thready', 'dry', 'regular'),
('e5f6a7b8-c9d0-1234-efab-345678901234', 5, 6, 5, 'normal', 'irritable', 'brown', 'moderate', 'normal', 'irregular'),
('f6a7b8c9-d0e1-2345-fabc-456789012345', 6, 5, 3, 'cold', 'anxious', 'thin_white', 'thready', 'dry', 'irregular'),
('a7b8c9d0-e1f2-3456-abcd-567890123456', 7, 6, 4, 'normal', 'calm', 'normal', 'steady', 'normal', 'regular'),
('b8c9d0e1-f2a3-4567-bcde-678901234567', 4, 7, 6, 'hot', 'anxious', 'yellow', 'heavy', 'oily', 'irregular');

-- =====================================================
-- PRAKRITI QUIZ RESULTS
-- =====================================================
INSERT INTO prakriti_quiz (user_id, answers, vata_score, pitta_score, kapha_score, vata_percent, pitta_percent, kapha_percent, prakriti) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '["b","b","a","b","b","c","b","a","b","b","a","b","b","b","a","c","b","b","a","b","b","b"]', 5, 13, 4, 22.7, 59.1, 18.2, 'Pitta'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '["a","b","c","a","b","c","c","b","a","c","b","c","a","b","c","a","b","c","a","c","b","c"]', 7, 7, 8, 31.8, 31.8, 36.4, 'Tridosha'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', '["c","c","b","c","c","c","b","c","c","c","b","c","c","b","c","c","c","b","c","c","c","b"]', 0, 6, 16, 0.0, 27.3, 72.7, 'Kapha'),
('d4e5f6a7-b8c9-0123-defa-234567890123', '["a","a","a","b","a","a","b","a","a","a","b","a","a","a","b","a","a","a","b","a","a","a"]', 17, 5, 0, 77.3, 22.7, 0.0, 'Vata'),
('e5f6a7b8-c9d0-1234-efab-345678901234', '["b","c","b","c","b","b","c","b","c","b","c","b","c","b","b","c","b","c","b","b","c","b"]', 0, 10, 12, 0.0, 45.5, 54.5, 'Kapha-Pitta'),
('f6a7b8c9-d0e1-2345-fabc-456789012345', '["a","a","b","a","a","a","b","a","a","b","a","a","b","a","a","a","b","a","a","b","a","a"]', 16, 6, 0, 72.7, 27.3, 0.0, 'Vata'),
('a7b8c9d0-e1f2-3456-abcd-567890123456', '["b","a","b","a","b","b","a","b","a","b","a","b","a","b","a","b","a","b","a","b","b","a"]', 8, 10, 4, 36.4, 45.5, 18.2, 'Pitta-Vata'),
('b8c9d0e1-f2a3-4567-bcde-678901234567', '["c","b","c","c","b","c","c","b","c","b","c","c","b","c","b","c","c","b","c","c","b","c"]', 0, 7, 15, 0.0, 31.8, 68.2, 'Kapha');

-- =====================================================
-- HEALTH METRICS (Simulated sensor readings over time)
-- =====================================================
INSERT INTO health_metrics (user_id, heart_rate, temperature, spo2, stress_index, sleep_score, activity_score, blood_pressure_systolic, blood_pressure_diastolic, respiratory_rate, source) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 82, 36.8, 97, 65, 60, 55, 132, 85, 18, 'esp32'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 68, 36.5, 99, 30, 85, 80, 118, 75, 16, 'esp32'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 95, 37.1, 95, 85, 35, 20, 145, 95, 22, 'esp32'),
('d4e5f6a7-b8c9-0123-defa-234567890123', 64, 36.3, 99, 25, 90, 75, 110, 70, 15, 'esp32'),
('e5f6a7b8-c9d0-1234-efab-345678901234', 78, 36.7, 97, 55, 55, 30, 138, 88, 19, 'esp32'),
('f6a7b8c9-d0e1-2345-fabc-456789012345', 72, 36.2, 98, 45, 70, 65, 115, 72, 16, 'esp32'),
('a7b8c9d0-e1f2-3456-abcd-567890123456', 70, 36.5, 98, 35, 80, 60, 120, 78, 16, 'esp32'),
('b8c9d0e1-f2a3-4567-bcde-678901234567', 88, 36.9, 96, 70, 50, 25, 140, 90, 20, 'esp32');

-- =====================================================
-- DISEASE PREDICTIONS (Hybrid: ML + Rule-based)
-- =====================================================
INSERT INTO disease_predictions (user_id, diabetes_risk, hypertension_risk, heart_disease_risk, stress_risk, sleep_disorder_risk, asthma_risk, arthritis_risk, obesity_risk, digestive_disorder_risk, fever_risk, thyroid_risk, anxiety_disorder_risk, overall_health_score, prediction_method, model_confidence) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 42, 55, 25, 65, 40, 8, 12, 45, 55, 15, 20, 45, 62, 'hybrid', 0.82),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 12, 15, 8, 30, 15, 5, 8, 18, 10, 8, 10, 20, 88, 'hybrid', 0.90),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 72, 78, 65, 88, 75, 15, 48, 82, 70, 30, 35, 75, 28, 'hybrid', 0.85),
('d4e5f6a7-b8c9-0123-defa-234567890123', 8, 10, 5, 22, 10, 25, 5, 8, 12, 10, 15, 18, 92, 'hybrid', 0.88),
('e5f6a7b8-c9d0-1234-efab-345678901234', 58, 62, 55, 55, 50, 10, 42, 52, 48, 18, 25, 35, 48, 'hybrid', 0.80),
('f6a7b8c9-d0e1-2345-fabc-456789012345', 10, 12, 8, 42, 30, 8, 5, 10, 20, 12, 18, 50, 78, 'hybrid', 0.86),
('a7b8c9d0-e1f2-3456-abcd-567890123456', 15, 25, 12, 32, 18, 5, 10, 22, 30, 10, 12, 25, 82, 'hybrid', 0.87),
('b8c9d0e1-f2a3-4567-bcde-678901234567', 52, 60, 35, 68, 55, 30, 15, 58, 60, 20, 38, 45, 45, 'hybrid', 0.83);

-- =====================================================
-- DOSHA BALANCE
-- =====================================================
INSERT INTO dosha_balance (user_id, vata_level, pitta_level, kapha_level, agni_strength, ama_level, ojas_level, imbalance_detected, imbalance_type) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 30, 65, 25, 'tikshna', 'moderate', 'moderate', true, 'Pitta aggravated'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 35, 32, 38, 'sama', 'low', 'high', false, NULL),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 15, 25, 75, 'manda', 'high', 'low', true, 'Kapha aggravated'),
('d4e5f6a7-b8c9-0123-defa-234567890123', 72, 22, 10, 'vishama', 'moderate', 'moderate', true, 'Vata aggravated'),
('e5f6a7b8-c9d0-1234-efab-345678901234', 18, 42, 55, 'manda', 'moderate', 'moderate', true, 'Kapha-Pitta aggravated'),
('f6a7b8c9-d0e1-2345-fabc-456789012345', 68, 25, 12, 'vishama', 'moderate', 'low', true, 'Vata aggravated'),
('a7b8c9d0-e1f2-3456-abcd-567890123456', 38, 48, 20, 'tikshna', 'low', 'high', false, NULL),
('b8c9d0e1-f2a3-4567-bcde-678901234567', 12, 30, 70, 'manda', 'high', 'low', true, 'Kapha aggravated');

-- =====================================================
-- FOOD DATABASE (75 Ayurvedic foods with full properties)
-- =====================================================
INSERT INTO food_database (name, sanskrit_name, category, rasa, guna, virya, vipaka, dosha_effect, calories_per_100g, protein_g, fat_g, carbs_g, fiber_g, best_season, best_time, contraindications, benefits, is_vegetarian, is_vegan, glycemic_index) VALUES
-- GRAINS
('Basmati Rice', 'Shali', 'Grains', 'Sweet', 'Light, Soft, Smooth', 'Cool', 'Sweet', '{"vata": -1, "pitta": -1, "kapha": 1}', 130, 4.5, 0.5, 28, 0.4, 'All seasons', 'Lunch, Dinner', 'Kapha excess, obesity', 'Nourishing, easy to digest, calms Vata and Pitta', true, true, 58),
('Wheat (Gehun)', 'Godhuma', 'Grains', 'Sweet', 'Heavy, Cool, Smooth', 'Cool', 'Sweet', '{"vata": -1, "pitta": -1, "kapha": 1}', 340, 13.2, 2.5, 72, 10.7, 'Winter, Monsoon', 'Breakfast, Lunch', 'Kapha excess, celiac disease', 'Builds strength, nourishes tissues, grounding', true, true, 54),
('Barley (Jau)', 'Yava', 'Grains', 'Sweet, Astringent', 'Light, Dry, Rough', 'Cool', 'Sweet', '{"vata": 1, "pitta": -1, "kapha": -1}', 354, 12.5, 2.3, 73, 17.3, 'Spring, Summer', 'Breakfast, Lunch', 'Severe Vata imbalance, underweight', 'Best grain for Kapha, reduces fat, cleanses channels', true, true, 28),
('Millet (Bajra)', 'Kangu', 'Grains', 'Sweet, Astringent', 'Light, Dry', 'Warm', 'Pungent', '{"vata": 0, "pitta": 0, "kapha": -1}', 378, 11.0, 4.2, 73, 8.5, 'Winter', 'Lunch', 'Pitta excess in summer', 'Good for weight management, rich in minerals', true, true, 54),
('Oats (Jai)', 'Yavaka', 'Grains', 'Sweet', 'Heavy, Warm, Smooth', 'Warm', 'Sweet', '{"vata": -1, "pitta": 0, "kapha": 1}', 389, 16.9, 6.9, 66, 10.6, 'Winter', 'Breakfast', 'Kapha excess', 'Good for Vata, warming, nourishing', true, true, 55),
('Quinoa', 'NA', 'Grains', 'Sweet, Astringent', 'Light, Dry', 'Cool', 'Sweet', '{"vata": 0, "pitta": -1, "kapha": -1}', 368, 14.1, 6.1, 64, 7.0, 'All seasons', 'Lunch', 'None significant', 'Complete protein, balances all doshas when cooked with ghee', true, true, 53),
('Amaranth (Rajgira)', 'Rajgira', 'Grains', 'Sweet, Astringent', 'Light, Dry', 'Warm', 'Pungent', '{"vata": -1, "pitta": 0, "kapha": -1}', 371, 13.6, 7.0, 65, 6.7, 'All seasons', 'Breakfast', 'None significant', 'High protein, calcium rich, gluten-free', true, true, 35),

-- LEGUMES (Dal)
('Mung Dal (Green Gram)', 'Mudga', 'Legumes', 'Sweet, Astringent', 'Light, Soft, Cool', 'Cool', 'Sweet', '{"vata": -1, "pitta": -1, "kapha": -1}', 347, 23.9, 1.2, 62, 16.3, 'All seasons', 'Lunch, Dinner', 'None - best legume for all', 'King of legumes in Ayurveda, tridoshic, easy to digest', true, true, 31),
('Toor Dal (Pigeon Pea)', 'Adhaki', 'Legumes', 'Sweet, Astringent', 'Light, Dry', 'Warm', 'Sweet', '{"vata": 0, "pitta": 0, "kapha": -1}', 343, 21.7, 1.5, 63, 15.0, 'Winter, Monsoon', 'Lunch', 'Gas-prone individuals', 'Rich in protein, supports digestive fire', true, true, 29),
('Masoor Dal (Red Lentil)', 'Masura', 'Legumes', 'Sweet', 'Light, Warm', 'Warm', 'Sweet', '{"vata": -1, "pitta": 1, "kapha": -1}', 352, 25.4, 1.1, 60, 10.7, 'Winter', 'Lunch', 'Pitta excess, blood disorders', 'Quick cooking, warming, increases Pitta', true, true, 30),
('Chana Dal (Bengal Gram)', 'Chanaka', 'Legumes', 'Sweet, Astringent', 'Light, Dry, Rough', 'Cool', 'Sweet', '{"vata": 1, "pitta": -1, "kapha": -1}', 364, 20.8, 5.3, 61, 12.2, 'Winter', 'Lunch', 'Vata excess, gas issues', 'High fiber, good for Kapha and diabetes', true, true, 28),
('Urad Dal (Black Gram)', 'Masha', 'Legumes', 'Sweet', 'Heavy, Warm, Oily', 'Warm', 'Sweet', '{"vata": -1, "pitta": 1, "kapha": 1}', 341, 25.2, 1.6, 59, 18.3, 'Winter', 'Lunch', 'Kapha excess, obesity, gout', 'Most nourishing dal, builds strength, good for Vata', true, true, 43),

-- VEGETABLES
('Bottle Gourd (Lauki)', 'Alabu', 'Vegetables', 'Sweet', 'Light, Smooth, Cool', 'Cool', 'Sweet', '{"vata": -1, "pitta": -1, "kapha": -1}', 14, 0.6, 0.1, 3.4, 0.5, 'Summer, Monsoon', 'Lunch, Dinner', 'None', 'Tridoshic, excellent for digestion and weight loss', true, true, 15),
('Bitter Gourd (Karela)', 'Karavellaka', 'Vegetables', 'Bitter', 'Light, Dry, Rough', 'Cool', 'Pungent', '{"vata": 1, "pitta": -1, "kapha": -1}', 17, 1.0, 0.2, 3.7, 2.8, 'Monsoon, Summer', 'Lunch', 'Vata excess, pregnancy, low blood sugar', 'Best for diabetes, cleanses blood, reduces Kapha', true, true, 15),
('Ash Gourd (Petha)', 'Kushmanda', 'Vegetables', 'Sweet', 'Light, Smooth, Cool', 'Cool', 'Sweet', '{"vata": -1, "pitta": -1, "kapha": 0}', 10, 0.4, 0.1, 2.0, 0.5, 'Summer', 'Lunch, Dinner', 'Kapha in winter', 'Excellent for mental health, medhya (brain tonic)', true, true, 10),
('Pumpkin (Kaddu)', 'Kurkaru', 'Vegetables', 'Sweet', 'Light, Smooth', 'Warm', 'Sweet', '{"vata": -1, "pitta": -1, "kapha": 0}', 26, 1.0, 0.1, 6.5, 0.5, 'Winter, Autumn', 'Lunch, Dinner', 'None', 'Balances Vata and Pitta, easy to digest', true, true, 75),
('Spinach (Palak)', 'Palakya', 'Vegetables', 'Astringent, Sweet', 'Light, Dry, Rough', 'Cool', 'Pungent', '{"vata": 1, "pitta": -1, "kapha": -1}', 23, 2.9, 0.4, 3.6, 2.2, 'Spring, Winter', 'Lunch', 'Kidney stones, high oxalate', 'Iron rich, cleanses blood, cools Pitta', true, true, 15),
('Okra (Bhindi)', 'Bhandira', 'Vegetables', 'Sweet, Astringent', 'Light, Smooth', 'Cool', 'Sweet', '{"vata": -1, "pitta": -1, "kapha": 0}', 33, 2.0, 0.1, 7.5, 3.2, 'Monsoon, Summer', 'Lunch', 'None', 'Good for digestion, soothes intestines', true, true, 20),
('Drumstick (Moringa)', 'Shigru', 'Vegetables', 'Pungent, Bitter', 'Light, Dry, Sharp', 'Warm', 'Pungent', '{"vata": -1, "pitta": 0, "kapha": -1}', 64, 9.4, 1.4, 8.3, 2.0, 'All seasons', 'Lunch', 'Pitta excess', 'Superb nutritional profile, anti-inflammatory, scrapes toxins', true, true, 20),
('Sweet Potato (Shakarkand)', 'Vidarikanda', 'Vegetables', 'Sweet', 'Heavy, Smooth, Cool', 'Cool', 'Sweet', '{"vata": -1, "pitta": -1, "kapha": 1}', 86, 1.6, 0.1, 20.1, 3.0, 'Winter', 'Lunch', 'Kapha excess, diabetes', 'Nourishing, builds strength, calms Vata', true, true, 63),
('Carrot (Gajar)', 'Grinjana', 'Vegetables', 'Sweet, Bitter', 'Light, Dry', 'Warm', 'Pungent', '{"vata": -1, "pitta": 0, "kapha": -1}', 41, 0.9, 0.2, 9.6, 2.8, 'Winter', 'Lunch, Salad', 'None', 'Good for eyes, digestion, cooked is better for Vata', true, true, 35),

-- FRUITS
('Pomegranate (Anar)', 'Dadima', 'Fruits', 'Sweet, Astringent, Sour', 'Light, Smooth', 'Cool (sweet variety)', 'Sweet', '{"vata": -1, "pitta": -1, "kapha": -1}', 83, 1.7, 1.2, 19, 4.0, 'All seasons', 'Morning, Between meals', 'None - excellent for all', 'Tridoshic fruit par excellence, strengthens heart and blood', true, true, 35),
('Banana (Kela)', 'Kadali', 'Fruits', 'Sweet', 'Heavy, Smooth, Cool', 'Cool', 'Sour', '{"vata": -1, "pitta": -1, "kapha": 1}', 89, 1.1, 0.3, 22.8, 2.6, 'All seasons', 'Morning (not at night)', 'Kapha excess, cold/cough, asthma, at night', 'Nourishing, builds tissue, good for Vata', true, true, 51),
('Apple (Seb)', 'Seba', 'Fruits', 'Sweet, Astringent', 'Light, Dry', 'Cool', 'Sweet', '{"vata": 1, "pitta": -1, "kapha": -1}', 52, 0.3, 0.2, 13.8, 2.4, 'Autumn, Winter', 'Morning', 'Raw apples aggravate Vata (cook for Vata)', 'Good for Pitta and Kapha, fiber rich, cooked apple calms Vata', true, true, 36),
('Mango (Aam)', 'Amra', 'Fruits', 'Sweet, Sour', 'Heavy, Smooth', 'Cool (ripe)', 'Sweet', '{"vata": -1, "pitta": -1, "kapha": 1}', 60, 0.8, 0.4, 15, 1.6, 'Summer', 'Morning, Afternoon', 'Kapha excess, diabetes, excess consumption', 'King of fruits, nourishes all tissues, ripe mango is tridoshic', true, true, 51),
('Papaya (Papita)', 'Erandakarkati', 'Fruits', 'Sweet', 'Light, Warm, Smooth', 'Warm', 'Sweet', '{"vata": -1, "pitta": 0, "kapha": -1}', 43, 0.5, 0.3, 11, 1.7, 'All seasons', 'Morning', 'Pregnancy, excess Pitta', 'Excellent for digestion, papain enzyme, clears constipation', true, true, 60),
('Dates (Khajoor)', 'Kharjura', 'Fruits', 'Sweet', 'Heavy, Smooth, Warm', 'Warm', 'Sweet', '{"vata": -1, "pitta": -1, "kapha": 1}', 277, 1.8, 0.2, 75, 6.7, 'Winter', 'Morning, Pre-workout', 'Kapha excess, obesity, diabetes', 'Builds strength and ojas, excellent for Vata, natural energy', true, true, 42),
('Amla (Indian Gooseberry)', 'Amalaki', 'Fruits', 'All except Salty', 'Light, Dry, Cool', 'Cool', 'Sweet', '{"vata": -1, "pitta": -1, "kapha": -1}', 44, 0.9, 0.6, 10, 4.3, 'All seasons', 'Morning', 'None', 'Richest vitamin C source, tridoshic, rasayana (rejuvenator), in Triphala', true, true, 15),

-- DAIRY
('Cow Milk (Doodh)', 'Ksheera', 'Dairy', 'Sweet', 'Heavy, Smooth, Cool, Oily', 'Cool', 'Sweet', '{"vata": -1, "pitta": -1, "kapha": 1}', 42, 3.4, 1.0, 5.0, 0, 'All seasons', 'Morning (warm), Night (warm with spices)', 'Kapha excess, cold/cough, lactose intolerance', 'Complete food, builds ojas, calms mind, always warm with spices', true, false, 32),
('Ghee (Clarified Butter)', 'Ghrita', 'Dairy', 'Sweet', 'Heavy, Smooth, Soft, Oily', 'Cool', 'Sweet', '{"vata": -1, "pitta": -1, "kapha": 1}', 900, 0, 100, 0, 0, 'All seasons', 'All meals', 'Kapha excess in large amounts', 'King of fats in Ayurveda, enhances digestion, intelligence, memory, ojas', true, false, 0),
('Buttermilk (Chaas)', 'Takra', 'Dairy', 'Sour, Astringent', 'Light, Warm, Dry', 'Warm', 'Sweet', '{"vata": -1, "pitta": 0, "kapha": -1}', 40, 3.3, 0.9, 4.8, 0, 'Summer, All seasons', 'After lunch', 'Bleeding disorders, night time', 'Best post-meal drink, kindles digestion, reduces bloating', true, false, 30),
('Yogurt (Dahi)', 'Dadhi', 'Dairy', 'Sour, Sweet', 'Heavy, Smooth, Warm', 'Warm', 'Sour', '{"vata": -1, "pitta": 1, "kapha": 1}', 59, 10, 0.7, 3.6, 0, 'All seasons', 'Lunch only', 'Night, Kapha excess, Pitta excess, never heat', 'Good for Vata, improves taste and appetite, never at night per Ayurveda', true, false, 36),

-- SPICES & HERBS
('Turmeric (Haldi)', 'Haridra', 'Spices', 'Bitter, Pungent, Astringent', 'Light, Dry, Warm', 'Warm', 'Pungent', '{"vata": -1, "pitta": 0, "kapha": -1}', 312, 9.7, 3.3, 67, 22.7, 'All seasons', 'All meals', 'Pregnancy in excess, blood thinners', 'Universal healer, anti-inflammatory, blood purifier, immune booster', true, true, 15),
('Ginger (Adrak)', 'Ardraka', 'Spices', 'Pungent', 'Light, Dry, Sharp', 'Warm', 'Sweet', '{"vata": -1, "pitta": 1, "kapha": -1}', 80, 1.8, 0.8, 18, 2.0, 'Winter, Monsoon', 'Before meals', 'Pitta excess, bleeding disorders, summer excess', 'Vishwabheshaja (universal medicine), kindles agni, clears ama', true, true, 15),
('Cumin (Jeera)', 'Jeeraka', 'Spices', 'Pungent, Bitter', 'Light, Dry', 'Warm', 'Pungent', '{"vata": -1, "pitta": 0, "kapha": -1}', 375, 17.8, 22.3, 44, 10.5, 'All seasons', 'All meals', 'None significant', 'Excellent digestive, reduces gas, improves absorption', true, true, 15),
('Coriander (Dhania)', 'Dhanyaka', 'Spices', 'Sweet, Astringent, Bitter', 'Light, Smooth, Cool', 'Cool', 'Sweet', '{"vata": -1, "pitta": -1, "kapha": -1}', 298, 12.4, 17.8, 55, 41.9, 'All seasons', 'All meals', 'None - tridoshic', 'Cooling digestive, calms all doshas, supports urinary health', true, true, 15),
('Ashwagandha', 'Ashwagandha', 'Herbs', 'Bitter, Astringent, Sweet', 'Light, Oily', 'Warm', 'Sweet', '{"vata": -1, "pitta": 0, "kapha": -1}', 245, 3.9, 0.3, 50, 32.3, 'Winter', 'Night with warm milk', 'Pitta excess, pregnancy', 'Premier adaptogen, reduces stress, builds strength, promotes sleep', true, true, NULL),
('Brahmi', 'Brahmi', 'Herbs', 'Bitter, Astringent, Sweet', 'Light, Smooth', 'Cool', 'Sweet', '{"vata": -1, "pitta": -1, "kapha": 0}', NULL, NULL, NULL, NULL, NULL, 'All seasons', 'Morning', 'Kapha excess with cold', 'Best brain tonic (medhya), improves memory, calms anxiety', true, true, NULL),
('Tulsi (Holy Basil)', 'Tulasi', 'Herbs', 'Pungent, Bitter', 'Light, Dry, Sharp', 'Warm', 'Pungent', '{"vata": -1, "pitta": 0, "kapha": -1}', NULL, NULL, NULL, NULL, NULL, 'All seasons', 'Morning tea', 'Pitta excess in excess', 'Sacred herb, immune booster, respiratory health, adaptogenic', true, true, NULL),
('Triphala', 'Triphala', 'Herbs', 'All except Salty', 'Light, Dry', 'Neutral', 'Sweet', '{"vata": -1, "pitta": -1, "kapha": -1}', NULL, NULL, NULL, NULL, NULL, 'All seasons', 'Night before bed', 'Pregnancy, diarrhea', 'Best Ayurvedic formula, detoxifies, rejuvenates, tridoshic laxative', true, true, NULL),
('Shatavari', 'Shatavari', 'Herbs', 'Sweet, Bitter', 'Heavy, Smooth, Oily', 'Cool', 'Sweet', '{"vata": -1, "pitta": -1, "kapha": 1}', NULL, NULL, NULL, NULL, NULL, 'All seasons', 'Morning/Night', 'Kapha excess, ama', 'Queen of herbs for women, nourishes reproductive tissue, builds ojas', true, true, NULL),

-- NUTS & SEEDS
('Almonds (Badam)', 'Vatada', 'Nuts', 'Sweet', 'Heavy, Warm, Oily', 'Warm', 'Sweet', '{"vata": -1, "pitta": 0, "kapha": 1}', 579, 21.2, 49.9, 21.6, 12.5, 'Winter, All seasons', 'Morning (soaked overnight, peeled)', 'Kapha excess in large amounts', 'Brain food, builds ojas, soaking removes tamas, peel for Pitta', true, true, 0),
('Walnuts (Akhrot)', 'Akshotaka', 'Nuts', 'Sweet, Astringent', 'Heavy, Warm, Oily', 'Warm', 'Sweet', '{"vata": -1, "pitta": 0, "kapha": 1}', 654, 15.2, 65.2, 13.7, 6.7, 'Winter', 'Morning', 'Kapha excess, summer heat', 'Looks like brain, nourishes brain, omega-3 rich', true, true, 0),
('Flax Seeds (Alsi)', 'Atasi', 'Seeds', 'Sweet', 'Heavy, Warm, Oily', 'Warm', 'Pungent', '{"vata": -1, "pitta": 0, "kapha": 0}', 534, 18.3, 42.2, 28.9, 27.3, 'Winter', 'Morning', 'None in moderate amounts', 'Omega-3 rich, anti-inflammatory, ground form better absorbed', true, true, 0),
('Sesame Seeds (Til)', 'Tila', 'Seeds', 'Sweet, Bitter, Astringent', 'Heavy, Warm, Oily', 'Warm', 'Sweet', '{"vata": -1, "pitta": 0, "kapha": 1}', 573, 17.7, 49.7, 23.4, 11.8, 'Winter', 'Morning', 'Pitta excess, summer', 'Sacred in Ayurveda, calcium rich, nourishes bones, Vata pacifying', true, true, 35),

-- OILS
('Coconut Oil (Nariyal Tel)', 'Narikela Taila', 'Oils', 'Sweet', 'Heavy, Smooth, Cool, Oily', 'Cool', 'Sweet', '{"vata": -1, "pitta": -1, "kapha": 1}', 862, 0, 100, 0, 0, 'Summer, All seasons', 'Cooking, External', 'Kapha excess in winter', 'Best oil for Pitta, cooling, great for skin and hair', true, true, 0),
('Sesame Oil (Til Ka Tel)', 'Tila Taila', 'Oils', 'Sweet, Bitter, Astringent', 'Heavy, Warm, Oily, Sharp', 'Warm', 'Sweet', '{"vata": -1, "pitta": 0, "kapha": 0}', 884, 0, 100, 0, 0, 'Winter, Monsoon', 'Cooking, Abhyanga', 'Pitta excess', 'King of oils in Ayurveda, best for Vata, Abhyanga oil of choice', true, true, 0),
('Mustard Oil (Sarson Ka Tel)', 'Sarshapa Taila', 'Oils', 'Pungent, Bitter', 'Light, Sharp, Warm, Dry', 'Warm', 'Pungent', '{"vata": -1, "pitta": 1, "kapha": -1}', 884, 0, 100, 0, 0, 'Winter', 'Cooking', 'Pitta excess, skin sensitivity', 'Kapha reducer, improves circulation, warming', true, true, 0),

-- BEVERAGES
('Warm Water', 'Ushna Jala', 'Beverages', 'Sweet', 'Light, Warm', 'Warm', 'Sweet', '{"vata": -1, "pitta": 0, "kapha": -1}', 0, 0, 0, 0, 0, 'All seasons', 'Throughout day', 'None', 'Best drink according to Ayurveda, kindles agni, clears ama', true, true, 0),
('Coconut Water', 'Narikela Jala', 'Beverages', 'Sweet', 'Light, Cool, Smooth', 'Cool', 'Sweet', '{"vata": -1, "pitta": -1, "kapha": 1}', 19, 0.7, 0.2, 3.7, 1.1, 'Summer', 'Morning, Afternoon', 'Kapha excess, winter', 'Natural electrolyte, cools Pitta, rehydrates', true, true, 3),
('Tulsi Tea', 'Tulasi Kashaya', 'Beverages', 'Pungent, Bitter', 'Light, Dry, Warm', 'Warm', 'Pungent', '{"vata": -1, "pitta": 0, "kapha": -1}', 0, 0, 0, 0, 0, 'All seasons, esp. Monsoon', 'Morning', 'None', 'Immune booster, respiratory support, stress relief', true, true, 0),
('CCF Tea (Cumin-Coriander-Fennel)', 'Jeeraka-Dhanyaka-Mishreya', 'Beverages', 'Sweet, Pungent', 'Light, Cool', 'Cool', 'Sweet', '{"vata": -1, "pitta": -1, "kapha": -1}', 0, 0, 0, 0, 0, 'All seasons', 'After meals', 'None - tridoshic', 'Best digestive tea, balances all doshas, clears channels', true, true, 0),

-- HONEY & SWEETENERS
('Raw Honey (Shahad)', 'Madhu', 'Sweeteners', 'Sweet, Astringent', 'Light, Dry, Rough', 'Warm (Yogavahi)', 'Sweet', '{"vata": 0, "pitta": 0, "kapha": -1}', 304, 0.3, 0, 82.4, 0.2, 'Spring, All seasons', 'Morning, With herbs', 'NEVER heat honey (forms ama per Ayurveda), not with ghee in equal parts', 'Scrapes Kapha, vehicle for herbs, wound healer. Heating honey is toxic per Charaka Samhita', true, true, 58),
('Jaggery (Gur)', 'Guda', 'Sweeteners', 'Sweet', 'Heavy, Warm, Smooth', 'Warm', 'Sweet', '{"vata": -1, "pitta": 0, "kapha": 1}', 383, 0.4, 0.1, 97, 0, 'Winter', 'After meals', 'Kapha excess, diabetes, obesity', 'Iron rich, aids digestion post-meal, warming', true, true, 84);

-- =====================================================
-- VIRUDDHA AHARA RULES (Incompatible Food Combinations from Charaka Samhita)
-- =====================================================
INSERT INTO viruddha_ahara_rules (food_a, food_b, incompatibility_type, severity, explanation, reference_text) VALUES
('Milk', 'Fish', 'Rasa Viruddha', 'severe', 'Milk is cooling and sweet while fish is heating. This combination vitiates blood and can cause skin diseases (kushtha). Referenced in Charaka Samhita.', 'Charaka Samhita Sutrasthana 26/81'),
('Milk', 'Salt', 'Virya Viruddha', 'moderate', 'Salt has heating potency while milk is cooling. Mixing them creates opposing energies in the body, affecting skin health.', 'Charaka Samhita Sutrasthana 26/84'),
('Milk', 'Sour Fruits', 'Rasa Viruddha', 'severe', 'Sour substances curdle milk in the stomach, creating ama (toxins). This includes oranges, lemons, pineapple with milk.', 'Charaka Samhita Sutrasthana 26/82'),
('Milk', 'Banana', 'Guna Viruddha', 'moderate', 'Both are heavy and cooling but banana has sour vipaka. Together they slow digestion, create ama, and can cause congestion.', 'Ashtanga Hridaya Sutrasthana 7'),
('Milk', 'Radish', 'Virya Viruddha', 'moderate', 'Radish is pungent and heating while milk is sweet and cooling. This opposing combination can cause skin disorders.', 'Charaka Samhita Sutrasthana 26'),
('Honey', 'Ghee (equal parts)', 'Samyoga Viruddha', 'severe', 'Honey and ghee in equal quantities by weight is specifically called out as toxic in Ayurveda. In unequal amounts they are fine.', 'Charaka Samhita Sutrasthana 26/84'),
('Honey', 'Hot Water', 'Samskara Viruddha', 'severe', 'Heating honey produces hydroxymethyl furfuraldehyde (HMF) which is toxic. Charaka says heated honey is like poison (visha).', 'Charaka Samhita Sutrasthana 26/84'),
('Yogurt', 'Hot Foods', 'Virya Viruddha', 'moderate', 'Yogurt should never be heated. Heating yogurt destroys beneficial bacteria and creates ama. Always consume at room temperature.', 'Ashtanga Hridaya Sutrasthana 8/18'),
('Yogurt', 'Night Consumption', 'Kala Viruddha', 'moderate', 'Yogurt consumed at night increases Kapha, causes congestion, and blocks channels (srotas). Always consume before sunset.', 'Charaka Samhita Sutrasthana 7'),
('Melon', 'Any Other Food', 'Krama Viruddha', 'moderate', 'Melons should always be eaten alone. They digest very quickly and when combined with slower-digesting foods, cause fermentation.', 'General Ayurvedic Principle'),
('Nightshades', 'Dairy', 'Samyoga Viruddha', 'mild', 'Nightshades (tomato, potato, eggplant) with dairy products can aggravate inflammation and joint issues in sensitive individuals.', 'Modern Ayurvedic Interpretation'),
('Cold Water', 'After Meals', 'Kala Viruddha', 'moderate', 'Drinking cold water during or immediately after meals extinguishes digestive fire (agni). Sip warm water instead.', 'Ashtanga Hridaya Sutrasthana 5/13'),
('Fruit', 'After Meals', 'Krama Viruddha', 'moderate', 'Fruits digest faster than cooked food. Eating fruit after a meal causes it to ferment in the stomach, producing ama and gas.', 'General Ayurvedic Principle'),
('Ghee', 'Cold Items', 'Virya Viruddha', 'mild', 'Consuming cold items immediately after ghee suppresses digestion. Wait at least 30 minutes between ghee-rich foods and cold drinks.', 'Charaka Samhita'),
('Eggs', 'Milk', 'Samyoga Viruddha', 'moderate', 'Both are heavy proteins that compete for digestive resources. This combination taxes agni and creates ama.', 'Modern Ayurvedic Practice');

-- =====================================================
-- YOGA POSES DATABASE (50 poses with Ayurvedic properties)
-- =====================================================
INSERT INTO yoga_poses (name, sanskrit_name, category, difficulty, dosha_effect, target_muscles, benefits, contraindications, instructions, duration_seconds, best_time, pranayama_type) VALUES
-- VATA-BALANCING POSES (Grounding, calming, warming)
('Mountain Pose', 'Tadasana', 'Standing', 'beginner', '{"vata": -2, "pitta": 0, "kapha": -1}', '["legs", "core", "spine"]', 'Grounds Vata energy, improves posture, calms nervous system, establishes stability', 'Severe low blood pressure', 'Stand with feet hip-width apart. Ground through all four corners of feet. Engage thighs, lengthen spine, relax shoulders. Arms alongside body, palms facing forward. Breathe steadily.', 60, 'Morning', NULL),
('Warrior I', 'Virabhadrasana I', 'Standing', 'beginner', '{"vata": -2, "pitta": -1, "kapha": -1}', '["legs", "hips", "core", "shoulders"]', 'Builds strength and stability, grounds Vata, opens chest, builds confidence', 'Knee injuries, high blood pressure', 'Step one foot back 3-4 feet. Bend front knee to 90 degrees. Hips face forward. Raise arms overhead. Back foot at 45-degree angle. Hold and breathe.', 30, 'Morning', NULL),
('Warrior II', 'Virabhadrasana II', 'Standing', 'beginner', '{"vata": -2, "pitta": -1, "kapha": -2}', '["legs", "hips", "arms", "core"]', 'Strengthens legs, opens hips, builds stamina and endurance, calms Vata anxiety', 'Knee injuries', 'From standing, step feet wide apart. Turn front foot out, back foot slightly in. Bend front knee to 90 degrees. Arms extend parallel to floor. Gaze over front hand.', 30, 'Morning', NULL),
('Tree Pose', 'Vrikshasana', 'Balance', 'beginner', '{"vata": -2, "pitta": 0, "kapha": -1}', '["legs", "core", "hips"]', 'Improves balance and focus, grounds Vata energy, calms the mind, strengthens ankles', 'Severe balance issues', 'Stand on one leg. Place other foot on inner thigh or calf (never on knee). Hands at heart or overhead. Focus gaze on fixed point. Breathe steadily.', 30, 'Morning', NULL),
('Child Pose', 'Balasana', 'Restorative', 'beginner', '{"vata": -2, "pitta": -1, "kapha": 0}', '["back", "hips", "shoulders"]', 'Deeply calming for Vata, relieves anxiety, soothes nervous system, gentle stretch for back', 'Knee injuries, pregnancy (modify)', 'Kneel with big toes touching. Sit back on heels. Fold forward, extending arms or resting them alongside body. Forehead to floor. Breathe deeply.', 60, 'Anytime', NULL),
('Seated Forward Bend', 'Paschimottanasana', 'Seated', 'beginner', '{"vata": -2, "pitta": -1, "kapha": 0}', '["hamstrings", "back", "spine"]', 'Calms nervous system, soothes Vata anxiety, stretches entire back body, massages abdominal organs', 'Disc herniation, sciatica', 'Sit with legs extended. Inhale and lengthen spine. Exhale and fold forward from hips. Reach for feet or shins. Keep spine long, not rounded.', 60, 'Evening', NULL),

-- PITTA-BALANCING POSES (Cooling, non-competitive, heart-opening)
('Moon Salutation', 'Chandra Namaskar', 'Flow', 'intermediate', '{"vata": -1, "pitta": -2, "kapha": -1}', '["full_body"]', 'Cooling sequence for Pitta, calms intensity, balances solar and lunar energies, promotes surrender', 'Back injuries (modify)', 'Series of poses performed in a flowing sequence honoring the moon. Includes side stretches and hip openers. Practice at moderate pace with cooling breath.', 300, 'Evening', NULL),
('Cobra Pose', 'Bhujangasana', 'Backbend', 'beginner', '{"vata": -1, "pitta": -2, "kapha": -1}', '["spine", "chest", "shoulders", "abdomen"]', 'Opens heart center, releases stored Pitta emotions (anger), strengthens spine, stimulates abdominal organs', 'Pregnancy, carpal tunnel, recent abdominal surgery', 'Lie face down. Place palms under shoulders. Press into hands, lift chest. Keep elbows close to body. Shoulders away from ears. Look slightly upward.', 30, 'Morning', NULL),
('Fish Pose', 'Matsyasana', 'Backbend', 'intermediate', '{"vata": -1, "pitta": -2, "kapha": -1}', '["chest", "throat", "spine"]', 'Opens throat and heart chakras, cools Pitta fire, stimulates thyroid, counterpose to shoulderstand', 'Neck injuries, high blood pressure', 'Lie on back. Place hands under hips. Press elbows into floor, lift chest. Drop head back gently. Breathe deeply into opened chest.', 30, 'Morning', NULL),
('Supine Twist', 'Supta Matsyendrasana', 'Twist', 'beginner', '{"vata": -1, "pitta": -2, "kapha": -1}', '["spine", "hips", "abdomen"]', 'Detoxifies liver (seat of Pitta), releases tension, soothes digestive fire, promotes relaxation', 'Disc problems', 'Lie on back. Draw one knee to chest. Guide knee across body. Extend opposite arm. Turn gaze away from knee. Keep both shoulders grounded. Breathe.', 60, 'Evening', NULL),

-- KAPHA-BALANCING POSES (Vigorous, stimulating, opening)
('Sun Salutation', 'Surya Namaskar', 'Flow', 'beginner', '{"vata": -1, "pitta": 0, "kapha": -2}', '["full_body"]', 'Best morning practice for Kapha, generates heat, stimulates metabolism, energizes entire body, builds agni', 'High blood pressure (slow pace), back injuries', '12-pose flowing sequence. Includes forward folds, lunges, plank, cobra. Practice at vigorous pace for Kapha. 12 rounds recommended.', 600, 'Morning (sunrise)', NULL),
('Boat Pose', 'Navasana', 'Core', 'intermediate', '{"vata": 0, "pitta": 0, "kapha": -2}', '["core", "hip_flexors", "spine"]', 'Fires up core and metabolism, reduces Kapha lethargy, strengthens digestive fire, builds willpower', 'Pregnancy, neck injury, low blood pressure', 'Sit with knees bent. Lean back slightly. Lift feet off floor. Straighten legs if possible. Arms parallel to floor. Balance on sit bones. Hold.', 30, 'Morning', NULL),
('Camel Pose', 'Ustrasana', 'Backbend', 'intermediate', '{"vata": -1, "pitta": -1, "kapha": -2}', '["chest", "throat", "spine", "hip_flexors"]', 'Opens chest and lungs (Kapha site), stimulates thyroid, energizes, releases stored emotions', 'Back injuries, neck problems, low blood pressure', 'Kneel with knees hip-width apart. Place hands on lower back. Lift chest up and back. Reach for heels if comfortable. Keep hips over knees.', 30, 'Morning', NULL),
('Bow Pose', 'Dhanurasana', 'Backbend', 'intermediate', '{"vata": -1, "pitta": 0, "kapha": -2}', '["back", "chest", "legs", "abdomen"]', 'Powerful Kapha reducer, stimulates all abdominal organs, opens lungs, increases energy and vitality', 'Pregnancy, hernia, recent abdominal surgery', 'Lie face down. Bend knees. Reach back and grab ankles. Inhale, lift chest and thighs. Rock gently. Keep breathing.', 30, 'Morning', NULL),
('Lion Pose', 'Simhasana', 'Face/Throat', 'beginner', '{"vata": 0, "pitta": -1, "kapha": -2}', '["face", "throat", "jaw"]', 'Clears Kapha from throat and sinuses, releases tension, stimulates throat chakra, builds confidence', 'TMJ disorder', 'Kneel and sit on heels. Place palms on knees, fingers spread. Inhale through nose. Exhale forcefully through mouth with tongue out, eyes wide, roaring sound.', 15, 'Morning', NULL),

-- PRANAYAMA (Breathing)
('Alternate Nostril Breathing', 'Anulom Vilom', 'Pranayama', 'beginner', '{"vata": -2, "pitta": -1, "kapha": -1}', '["respiratory", "nervous_system"]', 'Balances left and right brain, calms Vata, clears nadis (energy channels), reduces anxiety and stress', 'Severe nasal congestion', 'Sit comfortably. Close right nostril with thumb. Inhale left nostril 4 counts. Close left with ring finger. Exhale right 8 counts. Inhale right 4 counts. Close right. Exhale left 8 counts. One round.', 300, 'Morning, Evening', 'Nadi Shodhana'),
('Cooling Breath', 'Sheetali Pranayama', 'Pranayama', 'beginner', '{"vata": 0, "pitta": -2, "kapha": 0}', '["respiratory"]', 'Best pranayama for Pitta, cools body and mind, reduces anger and inflammation, calms burning sensations', 'Asthma, cold weather, Kapha excess', 'Sit comfortably. Curl tongue into tube shape. Inhale through curled tongue. Close mouth. Exhale through nose. If cannot curl tongue, use Sheetkari (teeth together, inhale through teeth).', 180, 'Afternoon, Summer', 'Sheetali'),
('Skull Shining Breath', 'Kapalabhati', 'Pranayama', 'intermediate', '{"vata": 0, "pitta": 0, "kapha": -2}', '["core", "respiratory", "digestive"]', 'Most powerful Kapha cleanser, clears sinuses, stimulates agni, energizes brain, removes lethargy', 'Pregnancy, heart disease, high BP, hernia, recent surgery', 'Sit with spine erect. Take a deep breath. Exhale forcefully through nose contracting abdomen. Inhalation is passive. Start with 30 pumps, build to 120.', 180, 'Morning (empty stomach)', 'Kapalabhati'),
('Bee Breath', 'Bhramari Pranayama', 'Pranayama', 'beginner', '{"vata": -2, "pitta": -2, "kapha": 0}', '["nervous_system", "brain"]', 'Deeply calming for both Vata and Pitta, reduces anxiety, lowers blood pressure, improves sleep', 'Ear infection', 'Sit comfortably. Close ears with thumbs, eyes with fingers (Shanmukhi Mudra). Inhale deeply. Exhale making humming bee sound. Feel vibration in head. 7-11 rounds.', 180, 'Evening, Before sleep', 'Bhramari'),
('Victorious Breath', 'Ujjayi Pranayama', 'Pranayama', 'beginner', '{"vata": -2, "pitta": -1, "kapha": -1}', '["throat", "respiratory", "nervous_system"]', 'Warming and calming, generates internal heat, balances thyroid, focus enhancer for meditation', 'Very low blood pressure', 'Sit tall. Slightly constrict back of throat. Inhale slowly through nose with ocean-like sound. Exhale with same constriction. Equal inhale and exhale.', 300, 'During yoga practice', 'Ujjayi'),

-- MEDITATION
('Mindfulness Meditation', 'Dhyana', 'Meditation', 'beginner', '{"vata": -2, "pitta": -1, "kapha": -1}', '["mind", "nervous_system"]', 'Calms Vata anxiety, reduces Pitta intensity, clears Kapha mental fog, improves focus and clarity', 'None', 'Sit comfortably with spine erect. Close eyes. Focus on natural breath. When mind wanders, gently return to breath. Start with 5 minutes, build to 20.', 600, 'Morning, Evening', NULL),
('Yoga Nidra', 'Yoga Nidra', 'Meditation', 'beginner', '{"vata": -2, "pitta": -2, "kapha": 0}', '["full_body", "mind", "nervous_system"]', 'Deep relaxation technique, repairs Vata damage from stress, cools Pitta fire, 30 min equals 2-3 hours sleep', 'None', 'Lie in Savasana. Follow guided body scan. Rotate awareness through body parts. Set a Sankalpa (intention). Remain awake while body sleeps. 20-40 minutes.', 1800, 'Afternoon, Before sleep', NULL),

-- THERAPEUTIC POSES
('Legs Up The Wall', 'Viparita Karani', 'Restorative', 'beginner', '{"vata": -2, "pitta": -2, "kapha": 0}', '["legs", "back", "nervous_system"]', 'Deeply restorative, reduces anxiety, cools Pitta, grounds Vata, relieves tired legs, promotes lymph drainage', 'Glaucoma, serious neck issues', 'Sit sideways next to a wall. Swing legs up the wall as you lie back. Hips close to wall. Arms out to sides. Close eyes. Stay 5-15 minutes.', 600, 'Evening', NULL),
('Corpse Pose', 'Savasana', 'Restorative', 'beginner', '{"vata": -2, "pitta": -1, "kapha": 0}', '["full_body", "nervous_system"]', 'Essential final relaxation, integrates benefits of practice, deeply calms nervous system, reduces cortisol', 'None', 'Lie flat on back. Feet mat-width apart, falling open. Arms 45 degrees from body, palms up. Close eyes. Systematically relax every body part. Stay 5-15 minutes.', 600, 'End of practice', NULL),
('Bridge Pose', 'Setu Bandhasana', 'Backbend', 'beginner', '{"vata": -1, "pitta": -1, "kapha": -1}', '["glutes", "back", "chest", "legs"]', 'Opens chest, stimulates thyroid, strengthens back, tridoshic when practiced gently', 'Neck injury', 'Lie on back. Bend knees, feet flat on floor hip-width apart. Press feet into floor, lift hips. Interlace fingers under body. Lift chest toward chin. Hold and breathe.', 30, 'Morning', NULL),
('Cat-Cow Stretch', 'Marjaryasana-Bitilasana', 'Warm-up', 'beginner', '{"vata": -2, "pitta": -1, "kapha": -1}', '["spine", "abdomen", "chest"]', 'Warms spine, syncs breath with movement, tridoshic, gently massages organs, releases spinal tension', 'Severe neck injury', 'Start on hands and knees. Inhale: drop belly, lift chest and tailbone (Cow). Exhale: round spine, tuck chin and tailbone (Cat). Flow with breath. 10-20 rounds.', 120, 'Morning warm-up', NULL),
('Shoulder Stand', 'Sarvangasana', 'Inversion', 'intermediate', '{"vata": -1, "pitta": -2, "kapha": -1}', '["shoulders", "core", "thyroid"]', 'Queen of asanas, stimulates thyroid, cools Pitta, improves circulation, calms nervous system', 'Neck injury, high BP, glaucoma, pregnancy, menstruation', 'Lie on back. Lift legs overhead. Support lower back with hands. Walk hands down back toward shoulders. Straighten legs toward ceiling. Hold with steady breath.', 180, 'Evening practice', NULL),
('Headstand', 'Sirsasana', 'Inversion', 'advanced', '{"vata": -1, "pitta": 0, "kapha": -2}', '["core", "shoulders", "brain"]', 'King of asanas, reverses blood flow, increases mental clarity, stimulates pineal and pituitary glands', 'Neck injury, high BP, glaucoma, heart disease, pregnancy', 'Place forearms on floor, interlace fingers. Place crown of head on floor, cradled by hands. Walk feet in. Lift legs up one at a time or together. Hold with control.', 120, 'Morning (advanced)', NULL),
('Pigeon Pose', 'Kapotasana', 'Hip Opener', 'intermediate', '{"vata": -2, "pitta": -1, "kapha": -1}', '["hips", "glutes", "psoas"]', 'Deep hip opener, releases stored emotions and tension, excellent for Vata tension in hips', 'Knee injuries, sacroiliac issues', 'From all fours, bring one knee forward behind same-side wrist. Extend other leg behind. Square hips. Fold forward over front leg. Stay 1-3 minutes each side.', 180, 'Evening', NULL),
('Garland Pose', 'Malasana', 'Squat', 'beginner', '{"vata": -2, "pitta": 0, "kapha": -1}', '["hips", "groin", "ankles"]', 'Natural squatting position, opens hips and groin, grounds Vata, stimulates Apana Vayu (downward energy)', 'Knee injuries', 'Stand with feet slightly wider than hip-width. Turn toes out. Squat down, bringing hips toward floor. Press elbows into inner knees. Palms together at heart.', 60, 'Morning', NULL);

-- =====================================================
-- DISEASE PREVENTION PROTOCOLS
-- =====================================================
INSERT INTO disease_prevention_protocols (disease_name, ayurvedic_name, associated_dosha, risk_factors, dietary_protocol, lifestyle_protocol, yoga_protocol, herbal_remedies, panchakarma_therapy, warning_signs) VALUES
('Diabetes', 'Prameha / Madhumeha', 'Kapha-Pitta', '{"family_history": true, "obesity": true, "sedentary": true, "high_sugar_diet": true, "stress": true}', '{"favor": ["Bitter gourd", "Fenugreek", "Barley", "Turmeric", "Mung dal", "Green leafy vegetables"], "avoid": ["Sugar", "White rice", "Potatoes", "Sweet fruits", "Cold drinks", "Dairy excess"], "guidelines": ["Eat largest meal at noon", "Avoid snacking", "Include bitter and astringent tastes", "Reduce sweet, sour, salty tastes"]}', '{"guidelines": ["Walk 45 min daily", "No daytime sleep", "Reduce sedentary time", "Manage stress actively", "Regular meal times"], "daily_routine": ["Wake before 6am", "Exercise in morning", "Light dinner before 7pm"]}', '{"poses": ["Surya Namaskar", "Dhanurasana", "Paschimottanasana", "Ardha Matsyendrasana", "Mandukasana"], "pranayama": ["Kapalabhati", "Bhastrika", "Anulom Vilom"], "duration": "45 min daily"}', '{"herbs": [{"name": "Gudmar (Gymnema)", "dose": "500mg twice daily", "action": "Destroys sugar taste, regenerates pancreatic beta cells"}, {"name": "Vijaysar (Pterocarpus)", "dose": "Drink water soaked in Vijaysar tumbler", "action": "Reduces blood sugar naturally"}, {"name": "Turmeric", "dose": "1 tsp with warm water", "action": "Improves insulin sensitivity"}, {"name": "Fenugreek Seeds", "dose": "1 tbsp soaked overnight", "action": "Reduces blood glucose and cholesterol"}]}', '{"recommended": ["Vamana (therapeutic emesis) for Kapha Prameha", "Virechana (purgation) for Pitta Prameha", "Basti (medicated enema) for Vata Prameha"], "frequency": "Seasonal (every 3-6 months)"}', '{"early_signs": ["Excessive thirst", "Frequent urination", "Fatigue after meals", "Slow wound healing", "Frequent infections", "Skin darkening"]}'),

('Hypertension', 'Rakta Gata Vata / Uccha Raktachapa', 'Vata-Pitta', '{"family_history": true, "stress": true, "high_salt": true, "obesity": true, "smoking": true, "alcohol": true}', '{"favor": ["Garlic", "Amla", "Pomegranate", "Bottle gourd", "Ash gourd", "Celery", "Watermelon"], "avoid": ["Excess salt", "Red meat", "Fried foods", "Caffeine", "Alcohol", "Spicy food"], "guidelines": ["Reduce sodium to under 2g/day", "Increase potassium-rich foods", "Eat sattvic diet", "Avoid fermented foods"]}', '{"guidelines": ["Meditation 20 min daily", "Avoid anger and arguments", "Regular sleep schedule", "Reduce work stress", "Nature walks"], "daily_routine": ["Gentle morning walk", "Abhyanga with cooling oils", "Evening relaxation practice"]}', '{"poses": ["Savasana", "Viparita Karani", "Balasana", "Sukhasana", "Supta Baddha Konasana"], "pranayama": ["Bhramari", "Sheetali", "Anulom Vilom (slow)"], "avoid": ["Inversions", "Vigorous practice", "Breath retention"], "duration": "30 min gentle practice"}', '{"herbs": [{"name": "Arjuna Bark", "dose": "500mg twice daily", "action": "Cardioprotective, strengthens heart muscle"}, {"name": "Sarpagandha", "dose": "Under physician supervision only", "action": "Potent BP reducer (use cautiously)"}, {"name": "Ashwagandha", "dose": "300mg twice daily", "action": "Reduces stress-induced hypertension"}, {"name": "Brahmi", "dose": "500mg daily", "action": "Calms mind, reduces anxiety component"}]}', '{"recommended": ["Virechana (purgation) to clear Pitta", "Shirodhara (oil pouring on forehead) for calming", "Basti (medicated enema) for Vata component"], "frequency": "Seasonal under supervision"}', '{"early_signs": ["Headaches", "Dizziness", "Nosebleeds", "Chest discomfort", "Vision changes", "Persistent stress"]}'),

('Heart Disease', 'Hridroga', 'Tridoshic', '{"family_history": true, "smoking": true, "obesity": true, "diabetes": true, "high_stress": true, "sedentary": true}', '{"favor": ["Arjuna bark tea", "Garlic", "Pomegranate", "Flax seeds", "Walnuts", "Turmeric", "Green tea"], "avoid": ["Trans fats", "Processed foods", "Excess salt", "Red meat", "Deep fried foods", "Sugar"], "guidelines": ["Eat heart-friendly oils (coconut, olive)", "Include omega-3 sources", "Reduce cholesterol intake", "Favor light, easy to digest foods"]}', '{"guidelines": ["Walk 30 min daily", "Practice stress management", "Quit smoking", "Limit alcohol", "Maintain healthy weight"], "daily_routine": ["Gentle morning exercise", "Pranayama practice", "Regular meal times", "Early dinner"]}', '{"poses": ["Tadasana", "Vrikshasana", "Setu Bandhasana", "Savasana", "Bhujangasana (gentle)"], "pranayama": ["Anulom Vilom", "Bhramari", "Ujjayi"], "avoid": ["Vigorous inversions", "Breath retention if BP high"], "duration": "30-45 min moderate practice"}', '{"herbs": [{"name": "Arjuna", "dose": "500mg twice daily", "action": "Best cardiac tonic in Ayurveda"}, {"name": "Pushkarmool", "dose": "250mg twice daily", "action": "Strengthens heart and lungs"}, {"name": "Guggulu", "dose": "500mg daily", "action": "Reduces cholesterol, scrapes blockages"}]}', '{"recommended": ["Hrid Basti (oil pooling over heart)", "Virechana for Pitta component", "Basti for Vata component"], "frequency": "Under strict supervision"}', '{"early_signs": ["Chest pain or discomfort", "Shortness of breath", "Fatigue", "Swelling in legs", "Irregular heartbeat", "Dizziness"]}'),

('Obesity', 'Sthaulya / Medoroga', 'Kapha', '{"family_history": true, "sedentary": true, "overeating": true, "emotional_eating": true, "poor_sleep": true}', '{"favor": ["Barley", "Millet", "Honey", "Bitter gourd", "Green leafy vegetables", "Ginger", "Hot water"], "avoid": ["Sugar", "Refined flour", "Cold drinks", "Heavy dairy", "Fried foods", "Late night eating"], "guidelines": ["Eat only when hungry", "Lunch should be largest meal", "Dinner before 7pm", "No snacking between meals", "Drink warm water throughout day"]}', '{"guidelines": ["Exercise minimum 45 min daily", "No daytime sleeping", "Stay active throughout day", "Cold water bath in morning", "Reduce sedentary hours"], "daily_routine": ["Wake by 5:30am", "Vigorous exercise", "Light dinner", "Sleep by 10pm"]}', '{"poses": ["Surya Namaskar (12+ rounds)", "Navasana", "Dhanurasana", "Ustrasana", "Kapalabhati"], "pranayama": ["Kapalabhati (120 pumps)", "Bhastrika", "Agnisar Kriya"], "duration": "60 min vigorous daily"}', '{"herbs": [{"name": "Guggulu", "dose": "500mg twice daily", "action": "Fat metabolism, scrapes adipose tissue"}, {"name": "Triphala", "dose": "1 tsp before bed", "action": "Cleanses channels, improves metabolism"}, {"name": "Honey + Warm Water", "dose": "Morning empty stomach", "action": "Scrapes Kapha, reduces fat"}, {"name": "Trikatu", "dose": "500mg before meals", "action": "Ignites digestive fire"}]}', '{"recommended": ["Udvartana (dry powder massage)", "Vamana (if strong constitution)", "Lekhana Basti (fat-scraping enema)"], "frequency": "Seasonal"}', '{"early_signs": ["Increasing waist circumference", "Breathlessness on exertion", "Excessive sweating", "Lethargy", "Joint pain", "Skin fold thickening"]}'),

('Stress & Anxiety', 'Chittodvega / Manasika Roga', 'Vata', '{"high_workload": true, "poor_sleep": true, "irregular_routine": true, "lack_of_support": true, "trauma": true}', '{"favor": ["Warm milk with ashwagandha", "Ghee", "Sweet fruits", "Almonds", "Oats", "Warm soups"], "avoid": ["Caffeine", "Processed foods", "Cold raw foods", "Stimulants", "Alcohol", "Irregular eating"], "guidelines": ["Eat warm, cooked, grounding foods", "Regular meal times", "No skipping meals", "Favor sweet, sour, salty tastes"]}', '{"guidelines": ["Regular daily routine", "Abhyanga (oil massage) daily", "Digital detox 1hr before bed", "Nature exposure", "Social connections"], "daily_routine": ["Wake at same time daily", "Oil massage before shower", "Meditation morning and evening", "Warm bath before bed", "Sleep by 10pm"]}', '{"poses": ["Balasana", "Viparita Karani", "Savasana", "Yoga Nidra", "Paschimottanasana"], "pranayama": ["Bhramari", "Anulom Vilom", "Ujjayi", "4-7-8 Breathing"], "duration": "30-45 min calming practice"}', '{"herbs": [{"name": "Ashwagandha", "dose": "300-600mg before bed", "action": "Premier adaptogen, reduces cortisol"}, {"name": "Brahmi", "dose": "500mg morning", "action": "Calms mind, improves cognitive function"}, {"name": "Jatamansi", "dose": "250mg before bed", "action": "Natural sedative, calms Vata in mind"}, {"name": "Shankhapushpi", "dose": "500mg daily", "action": "Memory enhancer, anti-anxiety"}]}', '{"recommended": ["Shirodhara (oil stream on forehead)", "Nasya (nasal medication)", "Abhyanga (full body oil massage)", "Basti for Vata calming"], "frequency": "Monthly Shirodhara recommended"}', '{"early_signs": ["Persistent worry", "Sleep disturbance", "Appetite changes", "Irritability", "Concentration issues", "Physical tension"]}'),

('Digestive Disorders', 'Agni Mandya / Ajirna', 'Tridoshic', '{"irregular_eating": true, "stress": true, "incompatible_foods": true, "overeating": true, "cold_foods": true}', '{"favor": ["Warm cooked foods", "Ginger", "Cumin", "CCF tea", "Mung dal", "Basmati rice", "Buttermilk"], "avoid": ["Raw cold foods", "Ice water", "Incompatible combinations", "Leftover foods", "Overeating", "Eating when not hungry"], "guidelines": ["Eat only when previous meal is digested", "Largest meal at noon", "Sip warm water", "Include all 6 tastes", "Eat in calm environment"]}', '{"guidelines": ["Regular meal times", "Walk after meals", "No sleeping after lunch", "Manage stress", "Chew food thoroughly"], "daily_routine": ["Warm water on waking", "Ginger before meals", "Walk 100 steps after eating", "No late night eating"]}', '{"poses": ["Vajrasana (after meals)", "Pavanamuktasana", "Ardha Matsyendrasana", "Malasana", "Cat-Cow"], "pranayama": ["Agnisar Kriya", "Kapalabhati (mild)", "Bhastrika (mild)"], "duration": "20-30 min daily"}', '{"herbs": [{"name": "Triphala", "dose": "1 tsp before bed", "action": "Regulates bowels, cleanses GI tract"}, {"name": "Hingvastak Churna", "dose": "1/2 tsp before meals", "action": "Kindles agni, reduces gas"}, {"name": "Ginger + Lemon + Salt", "dose": "Before meals", "action": "Ignites digestive fire"}, {"name": "Trikatu", "dose": "250mg before meals", "action": "Powerful digestive stimulant"}]}', '{"recommended": ["Vamana for Kapha-type indigestion", "Virechana for Pitta-type", "Basti for Vata-type"], "frequency": "Based on type and severity"}', '{"early_signs": ["Bloating after meals", "Gas", "Heartburn", "Irregular bowels", "Coated tongue", "Bad breath", "Low energy after eating"]}');

-- =====================================================
-- LEADERBOARD (Realistic scores)
-- =====================================================
INSERT INTO leaderboard (user_id, health_score, improvement_score, consistency_score, yoga_score, diet_score, total_score, rank, streak_days) VALUES
('d4e5f6a7-b8c9-0123-defa-234567890123', 92, 85, 90, 88, 90, 445, 1, 45),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 88, 78, 85, 72, 82, 405, 2, 32),
('a7b8c9d0-e1f2-3456-abcd-567890123456', 82, 70, 75, 65, 78, 370, 3, 21),
('f6a7b8c9-d0e1-2345-fabc-456789012345', 78, 82, 68, 75, 70, 373, 4, 18),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 62, 55, 60, 40, 55, 272, 5, 12),
('b8c9d0e1-f2a3-4567-bcde-678901234567', 45, 48, 42, 30, 45, 210, 6, 7),
('e5f6a7b8-c9d0-1234-efab-345678901234', 48, 40, 38, 25, 40, 191, 7, 5),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 28, 35, 30, 15, 25, 133, 8, 2);

-- =====================================================
-- SOCIAL POSTS (Realistic community content)
-- =====================================================
INSERT INTO social_posts (user_id, content, post_type, likes_count, comments_count) VALUES
('d4e5f6a7-b8c9-0123-defa-234567890123', 'Just completed 45 days of unbroken Surya Namaskar practice! My Vata imbalance has improved significantly. Energy levels are through the roof. Consistency is key!', 'milestone', 24, 8),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Tip: Try CCF tea (Cumin-Coriander-Fennel) after meals. It is tridoshic and has transformed my digestion. Recipe: 1/2 tsp each, boil in 2 cups water for 5 min. Thank me later!', 'tip', 18, 5),
('a7b8c9d0-e1f2-3456-abcd-567890123456', 'Switched from coffee to Tulsi tea 3 weeks ago. Sleep quality improved from 4/10 to 8/10. My Pitta-Vata constitution responds so well to this change.', 'achievement', 15, 4),
('f6a7b8c9-d0e1-2345-fabc-456789012345', 'Started Abhyanga (self oil massage) with sesame oil for my Vata. The difference in my dry skin and anxiety levels is remarkable. Ancient wisdom works!', 'tip', 12, 3),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Health score jumped from 52 to 62 this month! Reduced alcohol, added 30 min walks, and started Pitta-cooling diet. Small changes, big impact.', 'achievement', 20, 6),
('b8c9d0e1-f2a3-4567-bcde-678901234567', 'Anyone else with Kapha constitution struggling with morning motivation? Found that dry brushing (Garshana) before shower helps wake me up naturally!', 'general', 9, 7),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'My go-to Vata-calming recipe: Warm mung dal khichdi with ghee, cumin, ginger. Simple, sattvic, and deeply nourishing. Perfect for when you feel scattered.', 'recipe', 22, 9),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Week 4 challenge: Practice Bhramari Pranayama (bee breath) for 5 minutes before bed every night. Who is joining? Tag a friend who needs better sleep!', 'challenge', 16, 11),
('e5f6a7b8-c9d0-1234-efab-345678901234', 'Doctor says my BP numbers are improving since I started Arjuna bark tea and daily walking. AyurTwin disease prediction was spot on about my hypertension risk.', 'milestone', 14, 4),
('a7b8c9d0-e1f2-3456-abcd-567890123456', 'Morning yoga flow for Pitta-Vata: Cat-Cow > Surya Namaskar (6 rounds slow) > Warrior I & II > Tree Pose > Forward Fold > Savasana. 30 min and I feel amazing.', 'yoga', 17, 6);

-- =====================================================
-- DINACHARYA TRACKING (Sample data for users)
-- =====================================================
INSERT INTO dinacharya_tracking (user_id, date, wake_early, oil_pulling, tongue_scraping, drink_water, exercise, meditation, pranayama, abhyanga, healthy_breakfast, healthy_lunch, healthy_dinner, early_sleep) VALUES
('d4e5f6a7-b8c9-0123-defa-234567890123', CURRENT_DATE, true, true, true, true, true, true, true, true, true, true, true, true),
('d4e5f6a7-b8c9-0123-defa-234567890123', CURRENT_DATE - 1, true, true, true, true, true, true, true, false, true, true, true, true),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', CURRENT_DATE, true, false, true, true, true, true, true, false, true, true, true, true),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', CURRENT_DATE - 1, true, false, true, true, true, false, true, false, true, true, false, true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', CURRENT_DATE, false, false, false, true, true, false, false, false, true, true, false, false),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', CURRENT_DATE - 1, false, false, false, true, false, false, false, false, false, true, false, false),
('c3d4e5f6-a7b8-9012-cdef-123456789012', CURRENT_DATE, false, false, false, false, false, false, false, false, false, true, false, false),
('f6a7b8c9-d0e1-2345-fabc-456789012345', CURRENT_DATE, true, false, true, true, true, true, false, true, true, true, true, true);

-- =====================================================
-- HEALTH JOURNEY (Weekly progress data)
-- =====================================================
INSERT INTO health_journey (user_id, week_number, health_score, weight, bmi, stress_level, sleep_quality, dosha_balance_score, yoga_sessions_completed, dinacharya_adherence, notes) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 1, 52, 80.0, 26.1, 8, 5, 40, 1, 25, 'Starting AyurTwin journey. High stress from work. Pitta aggravated.'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 2, 55, 79.5, 26.0, 7, 5, 42, 2, 30, 'Started morning walks. Reduced alcohol intake.'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 3, 58, 79.0, 25.8, 7, 6, 45, 2, 35, 'Added Pitta-cooling foods. Better digestion.'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 4, 62, 78.0, 25.5, 6, 6, 50, 3, 42, 'Noticeable improvement. Less acidity. Better sleep.'),
('d4e5f6a7-b8c9-0123-defa-234567890123', 1, 80, 56.0, 20.6, 4, 7, 65, 4, 60, 'Good baseline. Vata dominant - working on grounding routine.'),
('d4e5f6a7-b8c9-0123-defa-234567890123', 2, 84, 55.5, 20.4, 3, 8, 72, 5, 70, 'Sesame oil abhyanga helping with dry skin and anxiety.'),
('d4e5f6a7-b8c9-0123-defa-234567890123', 3, 88, 55.0, 20.2, 3, 8, 78, 6, 80, 'Feeling grounded. Warm foods making a difference.'),
('d4e5f6a7-b8c9-0123-defa-234567890123', 4, 92, 55.0, 20.2, 2, 9, 85, 7, 90, 'Best week yet! Full dinacharya adherence. Vata balanced.'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 1, 22, 93.0, 32.2, 9, 3, 20, 0, 8, 'Very low starting point. Kapha aggravated. Smoking and drinking.'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 2, 24, 92.5, 32.0, 9, 3, 22, 0, 10, 'Trying to cut smoking. Still struggling with routine.'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 3, 26, 92.0, 31.8, 8, 4, 25, 1, 15, 'First yoga session. Started drinking warm water. Small progress.'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 4, 28, 92.0, 31.8, 8, 4, 28, 1, 18, 'Kapha reduction diet started. Honey and warm water in morning.');

-- =====================================================
-- FAMILY CONNECTIONS
-- =====================================================
INSERT INTO family_connections (patient_id, family_member_id, relationship, status) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c9d0e1f2-a3b4-5678-cdef-789012345678', 'Father', 'accepted'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'd0e1f2a3-b4c5-6789-defa-890123456789', 'Doctor', 'accepted'),
('b8c9d0e1-f2a3-4567-bcde-678901234567', 'd0e1f2a3-b4c5-6789-defa-890123456789', 'Doctor', 'pending');

-- =====================================================
-- NADI PARIKSHA (Sample pulse readings)
-- =====================================================
INSERT INTO nadi_pariksha (user_id, pulse_rate, pulse_rhythm, pulse_volume, pulse_character, vata_pulse, pitta_pulse, kapha_pulse, nadi_type, interpretation, confidence_score) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 82, 'regular_strong', 'full', 'bounding', 0.20, 0.60, 0.20, 'Pitta Nadi (Frog-like)', 'Pulse is strong and bounding like a frog (Manduka gati). Indicates Pitta dominance with strong agni. Pitta may be slightly aggravated - observe for acidity and heat symptoms.', 0.85),
('d4e5f6a7-b8c9-0123-defa-234567890123', 64, 'irregular_thin', 'thready', 'snake_like', 0.70, 0.20, 0.10, 'Vata Nadi (Snake-like)', 'Pulse is thin, irregular, and moves like a snake (Sarpa gati). Classic Vata pulse. Indicates sensitivity, creativity but also potential for anxiety. Ground with warm foods and routine.', 0.82),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 68, 'regular_slow', 'heavy', 'swan_like', 0.10, 0.20, 0.70, 'Kapha Nadi (Swan-like)', 'Pulse is slow, steady, and glides like a swan (Hamsa gati). Strong Kapha dominance. Indicates stability but possible sluggishness. Stimulate with exercise and light foods.', 0.88);

-- =====================================================
-- PANCHAKARMA ASSESSMENT
-- =====================================================
INSERT INTO panchakarma_assessment (user_id, ama_score, ojas_score, agni_score, readiness_score, recommended_therapies, contraindicated_therapies, preparatory_steps, dosha_specific_protocol, assessment_details) VALUES
('c3d4e5f6-a7b8-9012-cdef-123456789012', 75, 25, 30, 45, '["Vamana (Therapeutic Emesis) - primary for Kapha excess", "Udvartana (Dry Powder Massage) - fat reduction", "Swedana (Steam Therapy) - channel opening"]', '["Raktamokshana (Blood Letting) - not needed", "Aggressive Basti - too weak currently"]', '["7 days Snehapana (internal oleation with medicated ghee)", "3 days Abhyanga and Swedana", "Light diet for 3 days before", "Reduce smoking and alcohol immediately"]', 'Kapha Shodhana (Kapha purification protocol)', '{"tongue_coating": "thick_white", "digestion": "sluggish", "bowels": "irregular", "skin": "oily", "energy": "low", "weight": "excess", "ama_signs": ["coated tongue", "body heaviness", "joint stiffness", "brain fog", "low appetite despite weight"]}'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 45, 55, 65, 70, '["Virechana (Therapeutic Purgation) - Pitta cleansing", "Shirodhara (Oil Stream on Forehead) - stress relief", "Pitta-pacifying Abhyanga"]', '["Vamana - not primary need"]', '["3 days Snehapana with Pitta-pacifying ghee", "Cooling Abhyanga with coconut oil", "Pitta-reducing diet for 5 days"]', 'Pitta Shodhana (Pitta purification protocol)', '{"tongue_coating": "yellow", "digestion": "sharp_with_acidity", "skin": "sensitive_warm", "energy": "moderate", "pitta_signs": ["occasional heartburn", "warm body temperature", "irritability under stress", "skin sensitivity"]}');

-- =====================================================
-- MEAL TRACKING (Sample meals)
-- =====================================================
INSERT INTO meal_tracking (user_id, date, meal_type, description, foods, calories, is_dosha_appropriate, is_seasonal) VALUES
('d4e5f6a7-b8c9-0123-defa-234567890123', CURRENT_DATE, 'breakfast', 'Warm oatmeal with soaked almonds and stewed apples', '["Oats", "Almonds", "Apple (cooked)", "Cinnamon", "Ghee"]', 350, true, true),
('d4e5f6a7-b8c9-0123-defa-234567890123', CURRENT_DATE, 'lunch', 'Mung dal khichdi with ghee and seasonal vegetables', '["Mung Dal", "Basmati Rice", "Ghee", "Cumin", "Turmeric", "Bottle Gourd"]', 480, true, true),
('d4e5f6a7-b8c9-0123-defa-234567890123', CURRENT_DATE, 'dinner', 'Light vegetable soup with chapati', '["Mixed Vegetables", "Wheat Chapati", "Ginger", "Cumin"]', 320, true, true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', CURRENT_DATE, 'breakfast', 'Poha with peanuts and tea', '["Rice Flakes", "Peanuts", "Turmeric", "Tea"]', 300, false, true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', CURRENT_DATE, 'lunch', 'Dal rice with pickle and salad', '["Toor Dal", "Rice", "Pickle", "Cucumber"]', 550, false, false),
('c3d4e5f6-a7b8-9012-cdef-123456789012', CURRENT_DATE, 'lunch', 'Butter chicken with naan and cola', '["Chicken", "Butter", "Naan", "Cola"]', 850, false, false),
('c3d4e5f6-a7b8-9012-cdef-123456789012', CURRENT_DATE, 'dinner', 'Pizza and french fries', '["Pizza", "French Fries", "Ketchup"]', 1200, false, false);

-- =====================================================
-- CHATBOT CONVERSATIONS (Sample)
-- =====================================================
INSERT INTO chatbot_conversations (user_id, message, sender) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'What should I eat for my Pitta dosha?', 'user'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'For your Pitta constitution, favor cooling foods: cucumber, coconut water, sweet fruits, basmati rice, ghee, and coriander. Avoid spicy, sour, salty, and fermented foods. Eat your largest meal at noon when digestion is strongest.', 'bot'),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'I have been feeling very anxious lately. Any Ayurvedic tips?', 'user'),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'Anxiety is a classic sign of Vata imbalance, which aligns with your Vata prakriti. Try: 1) Warm sesame oil foot massage before bed 2) Ashwagandha milk at night 3) Bhramari pranayama (bee breath) for 5 minutes 4) Regular meal and sleep times 5) Avoid cold, raw foods. Warmth, routine, and grounding are your medicine.', 'bot');

-- =====================================================
-- SENSOR READINGS (temperature, spo2, heart_rate, accel_x/y/z)
-- Multiple readings per patient for real-time display
-- =====================================================
INSERT INTO sensor_readings (user_id, device_id, temperature, spo2, heart_rate, accel_x, accel_y, accel_z, recorded_at) VALUES
-- Arjun (Pitta, moderate stress - slightly warm)
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'ATB-200-001', 36.8, 97, 82, 0.10, -0.05, 9.78, NOW() - INTERVAL '25 seconds'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'ATB-200-001', 36.9, 97, 84, 0.15, 0.08, 9.75, NOW() - INTERVAL '20 seconds'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'ATB-200-001', 36.8, 98, 81, 0.08, -0.03, 9.79, NOW() - INTERVAL '15 seconds'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'ATB-200-001', 36.9, 97, 83, 0.12, 0.06, 9.77, NOW() - INTERVAL '10 seconds'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'ATB-200-001', 36.8, 97, 82, 0.09, -0.02, 9.80, NOW() - INTERVAL '5 seconds'),
-- Priya (Tridosha, balanced)
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'ATB-200-002', 36.5, 99, 68, 0.30, -0.15, 9.72, NOW() - INTERVAL '25 seconds'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'ATB-200-002', 36.5, 99, 70, 0.50, 0.20, 9.65, NOW() - INTERVAL '20 seconds'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'ATB-200-002', 36.6, 99, 67, 0.25, -0.10, 9.74, NOW() - INTERVAL '15 seconds'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'ATB-200-002', 36.5, 99, 69, 0.35, 0.18, 9.70, NOW() - INTERVAL '10 seconds'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'ATB-200-002', 36.5, 99, 68, 0.28, -0.12, 9.73, NOW() - INTERVAL '5 seconds'),
-- Rahul (Kapha, obese, smoker - elevated readings)
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'ATB-200-003', 37.1, 95, 95, 0.02, -0.01, 9.82, NOW() - INTERVAL '25 seconds'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'ATB-200-003', 37.2, 95, 97, 0.03, 0.01, 9.81, NOW() - INTERVAL '20 seconds'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'ATB-200-003', 37.1, 94, 93, 0.01, -0.02, 9.83, NOW() - INTERVAL '15 seconds'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'ATB-200-003', 37.3, 95, 96, 0.02, 0.02, 9.80, NOW() - INTERVAL '10 seconds'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'ATB-200-003', 37.2, 95, 95, 0.02, -0.01, 9.82, NOW() - INTERVAL '5 seconds'),
-- Sneha (Vata, healthy and active)
('d4e5f6a7-b8c9-0123-defa-234567890123', 'ATB-200-004', 36.3, 99, 64, 0.60, -0.30, 9.68, NOW() - INTERVAL '25 seconds'),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'ATB-200-004', 36.4, 99, 63, 0.90, 0.45, 9.55, NOW() - INTERVAL '20 seconds'),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'ATB-200-004', 36.3, 100, 62, 1.10, -0.55, 9.50, NOW() - INTERVAL '15 seconds'),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'ATB-200-004', 36.4, 99, 65, 0.45, 0.22, 9.72, NOW() - INTERVAL '10 seconds'),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'ATB-200-004', 36.3, 100, 64, 0.55, -0.28, 9.70, NOW() - INTERVAL '5 seconds'),
-- Vikram (Kapha-Pitta, overweight, stressed)
('e5f6a7b8-c9d0-1234-efab-345678901234', 'ATB-200-005', 36.7, 97, 78, 0.05, -0.02, 9.80, NOW() - INTERVAL '25 seconds'),
('e5f6a7b8-c9d0-1234-efab-345678901234', 'ATB-200-005', 36.8, 97, 80, 0.06, 0.03, 9.79, NOW() - INTERVAL '20 seconds'),
('e5f6a7b8-c9d0-1234-efab-345678901234', 'ATB-200-005', 36.7, 96, 77, 0.04, -0.01, 9.81, NOW() - INTERVAL '15 seconds'),
('e5f6a7b8-c9d0-1234-efab-345678901234', 'ATB-200-005', 36.8, 97, 79, 0.07, 0.02, 9.78, NOW() - INTERVAL '10 seconds'),
('e5f6a7b8-c9d0-1234-efab-345678901234', 'ATB-200-005', 36.7, 97, 78, 0.05, -0.02, 9.80, NOW() - INTERVAL '5 seconds'),
-- Ananya (Vata, light build)
('f6a7b8c9-d0e1-2345-fabc-456789012345', 'ATB-200-006', 36.2, 98, 72, 0.40, -0.20, 9.72, NOW() - INTERVAL '25 seconds'),
('f6a7b8c9-d0e1-2345-fabc-456789012345', 'ATB-200-006', 36.3, 98, 74, 0.55, 0.28, 9.66, NOW() - INTERVAL '20 seconds'),
('f6a7b8c9-d0e1-2345-fabc-456789012345', 'ATB-200-006', 36.2, 99, 71, 0.35, -0.18, 9.74, NOW() - INTERVAL '15 seconds'),
('f6a7b8c9-d0e1-2345-fabc-456789012345', 'ATB-200-006', 36.3, 98, 73, 0.48, 0.25, 9.68, NOW() - INTERVAL '10 seconds'),
('f6a7b8c9-d0e1-2345-fabc-456789012345', 'ATB-200-006', 36.2, 98, 72, 0.42, -0.22, 9.71, NOW() - INTERVAL '5 seconds'),
-- Dev (Pitta-Vata, balanced)
('a7b8c9d0-e1f2-3456-abcd-567890123456', 'ATB-200-007', 36.5, 98, 70, 0.20, -0.10, 9.76, NOW() - INTERVAL '25 seconds'),
('a7b8c9d0-e1f2-3456-abcd-567890123456', 'ATB-200-007', 36.6, 98, 72, 0.30, 0.15, 9.72, NOW() - INTERVAL '20 seconds'),
('a7b8c9d0-e1f2-3456-abcd-567890123456', 'ATB-200-007', 36.5, 99, 69, 0.18, -0.08, 9.78, NOW() - INTERVAL '15 seconds'),
('a7b8c9d0-e1f2-3456-abcd-567890123456', 'ATB-200-007', 36.6, 98, 71, 0.25, 0.12, 9.74, NOW() - INTERVAL '10 seconds'),
('a7b8c9d0-e1f2-3456-abcd-567890123456', 'ATB-200-007', 36.5, 98, 70, 0.22, -0.10, 9.76, NOW() - INTERVAL '5 seconds'),
-- Meera (Kapha, overweight)
('b8c9d0e1-f2a3-4567-bcde-678901234567', 'ATB-200-008', 36.9, 96, 88, 0.03, -0.01, 9.82, NOW() - INTERVAL '25 seconds'),
('b8c9d0e1-f2a3-4567-bcde-678901234567', 'ATB-200-008', 37.0, 96, 90, 0.04, 0.02, 9.80, NOW() - INTERVAL '20 seconds'),
('b8c9d0e1-f2a3-4567-bcde-678901234567', 'ATB-200-008', 36.9, 96, 87, 0.02, -0.02, 9.83, NOW() - INTERVAL '15 seconds'),
('b8c9d0e1-f2a3-4567-bcde-678901234567', 'ATB-200-008', 37.0, 95, 89, 0.04, 0.01, 9.81, NOW() - INTERVAL '10 seconds'),
('b8c9d0e1-f2a3-4567-bcde-678901234567', 'ATB-200-008', 36.9, 96, 88, 0.03, -0.01, 9.82, NOW() - INTERVAL '5 seconds');