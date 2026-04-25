-- ============================================================================
-- AyurTwin — Dummy user "Sham Jadhav" with COMPLETE realistic registration
-- + 10 minutes of sensor data (one row every 5 s).
--
-- Run AFTER supabase_schema.sql.
-- This script DELETES the existing Sham first, then re-inserts everything fresh
-- so it is safe to run repeatedly.
--
-- Sign in:  username = sham   password = Sham@1234
-- All recommendations, health score, disease risks, alerts are computed live
-- by the backend engines from the inputs below.
-- ============================================================================

-- ── 1. Wipe any prior Sham ─────────────────────────────────────────────────
delete from public.community_posts      where user_id = '11111111-1111-1111-1111-111111111111';
delete from public.alerts               where user_id = '11111111-1111-1111-1111-111111111111';
delete from public.disease_predictions  where user_id = '11111111-1111-1111-1111-111111111111';
delete from public.health_scores        where user_id = '11111111-1111-1111-1111-111111111111';
delete from public.sensor_data          where user_id = '11111111-1111-1111-1111-111111111111';
delete from public.dinacharya_log       where user_id = '11111111-1111-1111-1111-111111111111';
delete from public.prakriti_quiz_results where user_id = '11111111-1111-1111-1111-111111111111';
delete from public.family_links         where patient_id = '11111111-1111-1111-1111-111111111111'
                                            or family_user_id = '11111111-1111-1111-1111-111111111111';
delete from public.health_profile       where user_id = '11111111-1111-1111-1111-111111111111';
delete from public.users                where id = '11111111-1111-1111-1111-111111111111';


-- ── 2. Patient row (basic profile + auth) ──────────────────────────────────
insert into public.users (
    id, email, username, password_hash, role, full_name,
    age, gender, height_cm, weight_kg, diet_type, prakriti,
    last_prakriti_update, last_health_update, created_at, updated_at
) values (
    '11111111-1111-1111-1111-111111111111',
    'sham.jadhav@ayurtwin.app',
    'sham',
    '$2a$10$aqiUHYtubx1ab5Vq9WVLC.f6N4Qu58eHswnpWSV.n3bqiJmvzWmti',  -- bcrypt('Sham@1234')
    'patient',
    'Sham Jadhav',
    34, 'male', 176, 82, 'nonveg', 'pitta-kapha',
    now() - interval '40 days',
    now() - interval '40 days',
    now() - interval '60 days',
    now()
);


-- ── 3. Health profile — every field filled with realistic values ──────────
insert into public.health_profile (
    user_id,

    -- lifestyle
    physical_activity, work_type, smoking, alcohol, water_intake_l,
    junk_food_frequency, exercise_frequency,

    -- sleep + mental
    sleep_hours, sleep_time, wake_time, daytime_sleepiness,
    stress_level, anxiety_level,

    -- family medical history
    fh_diabetes, fh_heart_disease, fh_hypertension, fh_arthritis, fh_asthma,

    -- symptoms
    sym_frequent_thirst, sym_frequent_urination, sym_joint_pain,
    sym_breathing_difficulty, sym_digestive_issue, sym_fatigue_level,

    -- ayurvedic
    digestion_strength, appetite, sweating, body_temp_tendency, stress_response,
    updated_at
) values (
    '11111111-1111-1111-1111-111111111111',

    'moderate', 'mixed', false, 'occasional', 2.4,
    'medium', 3,

    6.5, '23:30', '06:30', 'medium',
    7, 6,

    true, false, true, false, false,

    true, true, false, false, true, 6,

    'medium', 'normal', 'normal', 'hot', 'irritable',
    now()
);


-- ── 4. Prakriti quiz history (40 days ago) ────────────────────────────────
insert into public.prakriti_quiz_results
    (user_id, vata_score, pitta_score, kapha_score, prakriti, answers, taken_at)
values (
    '11111111-1111-1111-1111-111111111111',
    25, 40, 35, 'pitta-kapha',
    '[
        "pitta","kapha","pitta","kapha","pitta","kapha","pitta","kapha",
        "pitta","kapha","vata","pitta","pitta","kapha","pitta","pitta",
        "kapha","pitta","kapha","pitta","kapha","pitta"
    ]'::jsonb,
    now() - interval '40 days'
);


-- ── 5. Today's dinacharya checklist (60% done — affects health score) ────
insert into public.dinacharya_log (user_id, log_date, tasks, completion_pct)
values (
    '11111111-1111-1111-1111-111111111111',
    current_date,
    '{
        "wake_before_6":   true,
        "warm_water":      true,
        "tongue_scraping": true,
        "oil_pulling":     false,
        "abhyanga":        false,
        "yoga":            true,
        "meditation":      true,
        "noon_main_meal":  true,
        "light_dinner":    false,
        "sleep_by_10":     false
    }'::jsonb,
    60
);


-- ── 6. Sensor data: 10 minutes (120 rows, one per 5 s) ─────────────────────
-- Sine-wave + small random noise so the dashboard looks "alive"
insert into public.sensor_data
    (user_id, heart_rate, spo2, body_temperature,
     accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z, recorded_at)
select
    '11111111-1111-1111-1111-111111111111',
    round(75 + 8 * sin(n * 0.15) + (random() * 4 - 2))::int                  as heart_rate,
    round((97 + sin(n * 0.10) + (random() * 0.6 - 0.3))::numeric, 1)         as spo2,
    round((36.8 + 0.2 * sin(n * 0.12) + (random() * 0.2 - 0.1))::numeric, 2) as body_temperature,
    round((sin(n * 0.30) * 0.8 + (random() * 0.3 - 0.15))::numeric, 2)       as accel_x,
    round((cos(n * 0.30) * 0.8 + (random() * 0.3 - 0.15))::numeric, 2)       as accel_y,
    round((9.8 + sin(n * 0.10) * 0.3 + (random() * 0.2 - 0.1))::numeric, 2)  as accel_z,
    round(((random() - 0.5) * 0.6)::numeric, 2)                              as gyro_x,
    round(((random() - 0.5) * 0.6)::numeric, 2)                              as gyro_y,
    round(((random() - 0.5) * 0.6)::numeric, 2)                              as gyro_z,
    now() - ((120 - n) * interval '5 seconds')                               as recorded_at
from generate_series(1, 120) as n;


-- ── 7. Demo community post by Sham ────────────────────────────────────────
insert into public.community_posts (user_id, author_name, title, body, tags, likes, created_at)
values (
    '11111111-1111-1111-1111-111111111111',
    'Sham Jadhav',
    'Pitta-Kapha diet — week 1',
    'Cut oily food, added buttermilk + bitter greens. Feeling lighter already.',
    '{diet,pitta-kapha}',
    12,
    now() - interval '3 days'
);


-- ============================================================================
-- DONE. Sign in with username: sham   password: Sham@1234
-- Backend engines compute health score, disease risks, alerts, diet, yoga,
-- ritucharya, prevention, and chatbot answers live from the inputs above.
-- ============================================================================
