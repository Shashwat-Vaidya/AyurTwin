-- ============================================================================
-- AyurTwin v4.0 - Clean Supabase Schema
-- Auth-aware, minimal tables, all integrity constraints
-- Run once on a fresh Supabase project. Idempotent where safe.
-- ============================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Drop legacy tables (safe on fresh project)
drop table if exists public.ml_disease_dataset cascade;
drop table if exists public.chatbot_qa cascade;
drop table if exists public.prevention_rules cascade;
drop table if exists public.viruddha_ahar cascade;
drop table if exists public.ritucharya_foods cascade;
drop table if exists public.yoga_practices cascade;
drop table if exists public.foods cascade;
drop table if exists public.leaderboard_dummy cascade;
drop table if exists public.community_posts cascade;
drop table if exists public.dinacharya_log cascade;
drop table if exists public.alerts cascade;
drop table if exists public.disease_predictions cascade;
drop table if exists public.health_scores cascade;
drop table if exists public.sensor_data cascade;
drop table if exists public.family_links cascade;
drop table if exists public.prakriti_quiz_results cascade;
drop table if exists public.health_profile cascade;
drop table if exists public.users cascade;

-- ----------------------------------------------------------------------------
-- USERS (patients + family members unified by role)
-- ----------------------------------------------------------------------------
create table public.users (
    id uuid primary key default uuid_generate_v4(),
    email text unique not null,
    username text unique not null,
    password_hash text not null,
    role text not null default 'patient' check (role in ('patient','family')),
    full_name text,
    age int,
    gender text check (gender in ('male','female','other')),
    height_cm numeric,
    weight_kg numeric,
    bmi numeric generated always as
        (case when height_cm > 0 then round((weight_kg / ((height_cm/100.0)*(height_cm/100.0)))::numeric, 2) else null end) stored,
    diet_type text default 'veg' check (diet_type in ('veg','nonveg')),
    prakriti text check (prakriti in ('vata','pitta','kapha','vata-pitta','pitta-kapha','vata-kapha','tridosha')),
    last_prakriti_update timestamptz,
    last_health_update timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create index idx_users_email on public.users(lower(email));
create index idx_users_username on public.users(lower(username));
create index idx_users_role on public.users(role);

-- ----------------------------------------------------------------------------
-- HEALTH PROFILE
-- ----------------------------------------------------------------------------
create table public.health_profile (
    user_id uuid primary key references public.users(id) on delete cascade,
    physical_activity text check (physical_activity in ('low','moderate','high')),
    work_type text check (work_type in ('sitting','active','mixed')),
    smoking boolean default false,
    alcohol text check (alcohol in ('none','occasional','frequent')),
    water_intake_l numeric,
    junk_food_frequency text check (junk_food_frequency in ('low','medium','high')),
    exercise_frequency int,
    sleep_hours numeric,
    sleep_time text,
    wake_time text,
    daytime_sleepiness text check (daytime_sleepiness in ('low','medium','high')),
    stress_level int check (stress_level between 1 and 10),
    anxiety_level int check (anxiety_level between 1 and 10),
    fh_diabetes boolean default false,
    fh_heart_disease boolean default false,
    fh_hypertension boolean default false,
    fh_arthritis boolean default false,
    fh_asthma boolean default false,
    sym_frequent_thirst boolean default false,
    sym_frequent_urination boolean default false,
    sym_joint_pain boolean default false,
    sym_breathing_difficulty boolean default false,
    sym_digestive_issue boolean default false,
    sym_fatigue_level int check (sym_fatigue_level between 1 and 10),
    digestion_strength text check (digestion_strength in ('weak','medium','strong')),
    appetite text check (appetite in ('low','normal','high')),
    sweating text check (sweating in ('low','normal','high')),
    body_temp_tendency text check (body_temp_tendency in ('cold','normal','hot')),
    stress_response text check (stress_response in ('calm','irritable','anxious')),
    updated_at timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- PRAKRITI QUIZ AUDIT
-- ----------------------------------------------------------------------------
create table public.prakriti_quiz_results (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    vata_score int not null,
    pitta_score int not null,
    kapha_score int not null,
    prakriti text not null,
    answers jsonb,
    taken_at timestamptz default now()
);
create index idx_prakriti_user on public.prakriti_quiz_results(user_id, taken_at desc);

-- ----------------------------------------------------------------------------
-- FAMILY LINKS
-- ----------------------------------------------------------------------------
create table public.family_links (
    id uuid primary key default uuid_generate_v4(),
    patient_id uuid not null references public.users(id) on delete cascade,
    family_user_id uuid references public.users(id) on delete cascade,
    family_email text,
    family_name text,
    family_age int,
    family_role text,
    status text not null default 'pending' check (status in ('pending','approved','rejected')),
    created_at timestamptz default now(),
    responded_at timestamptz,
    unique (patient_id, family_email)
);
create index idx_fl_family on public.family_links(family_user_id);
create index idx_fl_patient on public.family_links(patient_id);

-- ----------------------------------------------------------------------------
-- SENSOR DATA
-- ----------------------------------------------------------------------------
create table public.sensor_data (
    id bigserial primary key,
    user_id uuid not null references public.users(id) on delete cascade,
    heart_rate numeric,
    spo2 numeric,
    body_temperature numeric,
    accel_x numeric, accel_y numeric, accel_z numeric,
    gyro_x numeric,  gyro_y numeric,  gyro_z numeric,
    recorded_at timestamptz default now()
);
create index idx_sensor_user_time on public.sensor_data(user_id, recorded_at desc);

-- ----------------------------------------------------------------------------
-- HEALTH SCORES / DISEASE PREDICTIONS / ALERTS
-- ----------------------------------------------------------------------------
create table public.health_scores (
    id bigserial primary key,
    user_id uuid not null references public.users(id) on delete cascade,
    score int not null check (score between 0 and 500),
    breakdown jsonb,
    computed_at timestamptz default now()
);
create index idx_hs_user_time on public.health_scores(user_id, computed_at desc);

create table public.disease_predictions (
    id bigserial primary key,
    user_id uuid not null references public.users(id) on delete cascade,
    predictions jsonb not null,
    model_version text default 'logreg-v1',
    computed_at timestamptz default now()
);
create index idx_dp_user_time on public.disease_predictions(user_id, computed_at desc);

create table public.alerts (
    id bigserial primary key,
    user_id uuid not null references public.users(id) on delete cascade,
    category text not null,
    severity text not null check (severity in ('info','warning','critical')),
    title text not null,
    message text,
    metadata jsonb,
    read boolean default false,
    created_at timestamptz default now()
);
create index idx_alert_user on public.alerts(user_id, created_at desc);

-- ----------------------------------------------------------------------------
-- DINACHARYA + COMMUNITY + LEADERBOARD
-- ----------------------------------------------------------------------------
create table public.dinacharya_log (
    id bigserial primary key,
    user_id uuid not null references public.users(id) on delete cascade,
    log_date date not null default current_date,
    tasks jsonb not null,
    completion_pct int,
    created_at timestamptz default now(),
    unique (user_id, log_date)
);

create table public.community_posts (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    author_name text,
    title text,
    body text not null,
    tags text[],
    likes int default 0,
    created_at timestamptz default now()
);
create index idx_posts_time on public.community_posts(created_at desc);

create table public.leaderboard_dummy (
    rank int primary key,
    display_name text not null,
    score int not null
);

-- ----------------------------------------------------------------------------
-- REFERENCE DATASETS
-- ----------------------------------------------------------------------------
create table public.foods (
    id bigserial primary key,
    food_name text unique not null,
    category text,
    vata text  check (vata  in ('best','good','moderate','avoid')),
    pitta text check (pitta in ('best','good','moderate','avoid')),
    kapha text check (kapha in ('best','good','moderate','avoid')),
    properties text[],
    calories int,
    veg boolean default true
);
create index idx_foods_name on public.foods(lower(food_name));

create table public.yoga_practices (
    id bigserial primary key,
    name text unique not null,
    type text check (type in ('asana','pranayama','meditation')),
    best_for text[],
    avoid_for text[],
    benefits text[],
    intensity text check (intensity in ('low','medium','high')),
    time_of_day text,
    duration_min int
);

create table public.ritucharya_foods (
    id bigserial primary key,
    food_name text not null,
    seasons text[],
    avoid_in text[],
    vata text,
    pitta text,
    kapha text,
    properties text[]
);

create table public.viruddha_ahar (
    id bigserial primary key,
    food_1 text not null,
    food_2 text not null,
    severity text check (severity in ('low','medium','high')),
    reason text,
    effects text,
    alternatives text[]
);
create index idx_virud_pair on public.viruddha_ahar(lower(food_1), lower(food_2));

create table public.prevention_rules (
    id bigserial primary key,
    disease text unique not null,
    prevention text[],
    lifestyle text[],
    ayurvedic text[]
);

create table public.chatbot_qa (
    id bigserial primary key,
    keywords text[],
    question text not null,
    answer text not null
);

create table public.ml_disease_dataset (
    id bigserial primary key,
    age int, bmi numeric, activity_score numeric, hr numeric, spo2 numeric,
    temp numeric, stress int, anxiety int, sleep_hours numeric,
    junk_food int, smoking int, water_l numeric, exercise_freq int,
    fh_diabetes int, fh_heart int, fh_hypertension int, fh_asthma int, fh_arthritis int,
    sym_thirst int, sym_urination int, sym_joint_pain int, sym_breath int, sym_digestive int,
    label_diabetes int, label_heart int, label_hypertension int, label_stress int,
    label_sleep int, label_asthma int, label_arthritis int, label_obesity int,
    label_digestive int, label_fever int
);

-- ----------------------------------------------------------------------------
-- RLS OFF (backend uses anon/service key directly)
-- ----------------------------------------------------------------------------
alter table public.users disable row level security;
alter table public.health_profile disable row level security;
alter table public.sensor_data disable row level security;
alter table public.health_scores disable row level security;
alter table public.disease_predictions disable row level security;
alter table public.alerts disable row level security;
alter table public.dinacharya_log disable row level security;
alter table public.family_links disable row level security;
alter table public.community_posts disable row level security;

-- ----------------------------------------------------------------------------
-- DEMO SEEDS
-- ----------------------------------------------------------------------------
insert into public.leaderboard_dummy(rank, display_name, score) values
  (1,'Arjun Sharma',478),(2,'Priya Nair',462),(3,'Rohan Iyer',451),
  (4,'Meera Joshi',443),(5,'Aditya Rao',428),(6,'Sneha Kapoor',414),
  (7,'Vikram Desai',401),(8,'Kavya Reddy',389),(9,'Nikhil Menon',376),
  (10,'Tara Pillai',362);

insert into public.community_posts(author_name, title, body, tags, likes) values
  ('Arjun Sharma','3 months on Pitta-balancing diet','Cut spicy/fried foods, added buttermilk and bitter greens. Acidity gone, sleep 7+ hrs.','{diet,pitta,wellness}',128),
  ('Priya Nair','Daily Surya Namaskar changed me','12 rounds every morning. Lost 6kg in 10 weeks and mood is steadier than ever.','{yoga,fitness}',94),
  ('Rohan Iyer','Ritucharya works','Followed seasonal foods strictly through monsoon. Zero flu this year.','{ritucharya,seasonal}',67),
  ('Meera Joshi','Meditation for anxiety','20 min Anulom-Vilom + 10 min silent meditation. Anxiety down from 8 to 3.','{meditation,mental-health}',58),
  ('Aditya Rao','Dinacharya streak - 45 days','Wake 5:30, tongue scrape, oil pulling, warm water. Digestion transformed.','{dinacharya,discipline}',44);
