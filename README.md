# AyurTwin v4.0

Personalized Ayurvedic health platform. Combines real-time IoT vitals, a Node.js rule-engine backend, an ML-based disease-risk predictor, and an Expo React Native app.

```
Expo RN app  ──HTTPS──▶  Node/Express API  ──▶  Supabase (Postgres)
                               │
                               ├── ML disease predictor (logistic regression)
                               ├── 8 Ayurvedic rule engines
                               └── Sensor simulator (5s tick)
```

---

## Prerequisites

- **Node.js** 18+ and npm
- **Expo CLI** (`npm i -g expo-cli`) or use `npx expo` directly
- **A fresh Supabase project** (free tier is fine)
- A mobile device or emulator (iOS simulator / Android emulator / Expo Go)

---

## 1 — Supabase

1. Create a new project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** → paste the contents of [`supabase_schema.sql`](supabase_schema.sql) → Run.
   - This creates all tables (users, health_profile, sensor_data, alerts, disease_predictions, family_links, community_posts, dinacharya_log, foods, yoga_practices, ritucharya_foods, viruddha_ahar, prevention_rules, chatbot_qa, ml_disease_dataset, leaderboard_dummy).
3. **Project Settings → API** → copy:
   - `Project URL`
   - `anon` key

### Update backend env

Create `backend/.env`:

```
PORT=4000
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_KEY=<your-anon-key>
JWT_SECRET=change-me-to-a-long-random-string
SENSOR_INTERVAL_MS=5000
SENSOR_SIMULATOR_ENABLED=true
```

### Update frontend env

Edit `.env` in the project root (`AyurTwin/.env`):

```
EXPO_PUBLIC_API_URL=http://<your-pc-lan-ip>:4000/api
EXPO_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

> On a physical phone, `localhost` won't resolve — use your machine's LAN IP (e.g. `192.168.1.14`). On Android emulator use `10.0.2.2`.

---

## 2 — Backend

```bash
cd backend
npm install

# (one-time) seed reference data into Supabase
npm run seed

# (one-time) train the ML disease model and write model.json
npm run train

# optional: also upload the 10k synthetic dataset to Supabase
npm run train:upload

# start the API
npm run dev    # or: npm start
```

The server listens on `http://localhost:4000`. Key endpoints:

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/auth/register` | Create patient or family account |
| POST | `/api/auth/login` | Login by email or username |
| GET | `/api/dashboard` | Dashboard aggregate |
| GET | `/api/dashboard/health-score` | Health-score explainer |
| GET | `/api/metrics/:userId?window=daily\|weekly\|monthly` | Averages + stress index |
| GET | `/api/metrics/:userId/hr-trend` | 1-hour heart-rate trend |
| GET | `/api/metrics/:userId/dosha-trend` | Dosha balance over time |
| POST | `/api/predict-risk` | ML disease-risk prediction |
| GET | `/api/diet/recommendations` | Best/Good/Ok/Avoid food list |
| GET | `/api/diet/calories` | BMR/TDEE + meal split |
| GET | `/api/diet/ritucharya` | Seasonal recommendations |
| POST | `/api/diet/check-viruddha` | Food-incompatibility check |
| GET | `/api/yoga/recommendations` | Morning / evening / therapeutic |
| GET | `/api/prevention` | Prevention advice |
| POST | `/api/chat` | Ayurveda chatbot |
| POST | `/api/family/invite` | Invite a family member |
| GET | `/api/family/invites` | (family) pending invites |
| POST | `/api/family/respond` | (family) approve/reject |
| GET | `/api/family/patients` | (family) approved patients |
| GET | `/api/alerts` | Live alerts |
| GET | `/api/social` | Community feed |
| POST | `/api/social` | Create community post |
| GET | `/api/leaderboard` | Top 10 + your rank |
| GET | `/api/education` · `/api/education/panchakarma` | Static Ayurveda content |
| GET | `/api/reports/me` | PDF-friendly JSON report |
| POST | `/api/sensors/ingest` | ESP32 POST target |

All endpoints except `/auth/*`, `/sensors/ingest`, `/chat`, and the public feed read `Authorization: Bearer <jwt>`.

---

## 3 — Frontend (Expo)

From the project root (`AyurTwin/`):

```bash
npm install
npx expo start      # or: npm start
```

- Scan the QR with **Expo Go** on your phone, or press `a` / `i` for emulator.
- Patient flow: Landing → Register → Prakriti Quiz → Dashboard.
- Family-member flow: Landing → Register (role: family) → Login → Family Dashboard (invites + monitor patients).

---

## 4 — ML disease predictor

The model is real logistic regression — no hand-crafted thresholds:

1. `backend/ml/datasetGenerator.js` creates 10,000 synthetic patients with realistic parameter distributions and rule-derived (noise-added) disease labels.
2. `backend/ml/trainer.js` trains 10 binary classifiers (one per disease) via gradient descent with L2 regularization on standardized features.
3. The trained weights + feature means/stds are persisted in `backend/ml/model.json`.
4. `backend/engines/diseaseEngine.js` loads the model and, at request time, standardizes features and computes `σ(w·x + b) × 100` as the risk percentage.
5. If `model.json` is missing, a deterministic rule fallback is used so the app still works.

Retrain at any time (takes ~4 s):

```bash
cd backend
npm run train              # local only
npm run train:upload       # + upload rows to Supabase.ml_disease_dataset
```

The dataset is also written to `backend/ml/dataset.csv` (~800 KB) for any external ML work.

---

## 5 — Sensor simulator

With `SENSOR_SIMULATOR_ENABLED=true`, the backend writes a synthetic sensor row per patient every 5 seconds into `public.sensor_data`. The dashboard's live-vitals widget polls `/api/sensors/latest/:userId` on the same cadence — you don't need hardware to demo.

An ESP32 can replace the simulator by POSTing to `/api/sensors/ingest`:

```json
{
  "user_id": "<uuid>",
  "heart_rate": 74,
  "spo2": 97,
  "body_temperature": 36.7,
  "accel_x": 0.1, "accel_y": 0.0, "accel_z": 9.81,
  "gyro_x": 0.01, "gyro_y": 0.02, "gyro_z": 0.00
}
```

---

## 6 — Project layout

```
AyurTwin/
├── App.js, index.js, app.json, polyfills.js
├── src/                             # React Native (Expo)
│   ├── navigation/                  # Stacks, tabs, family-vs-patient routing
│   ├── screens/                     # auth, main, lifestyle, metrics, social, family, more
│   ├── components/ChatBot.js        # Ayurveda chatbot widget
│   ├── context/AppContext.js        # auth + state store
│   └── services/api.js              # API client (JWT-aware)
├── backend/
│   ├── server.js                    # Express app wiring
│   ├── config/                      # env, supabase
│   ├── middleware/                  # auth, validate, errorHandler
│   ├── services/db.js               # all supabase queries
│   ├── engines/                     # rule engines
│   │   ├── common.js                # shared helpers
│   │   ├── diseaseEngine.js         # ML + rule fallback
│   │   ├── dietEngine.js
│   │   ├── yogaEngine.js
│   │   ├── ritucharyaEngine.js
│   │   ├── viruddhaEngine.js
│   │   ├── preventionEngine.js
│   │   ├── chatbotEngine.js
│   │   ├── healthScoreEngine.js     # 1-500 health score
│   │   ├── calorieEngine.js         # Mifflin-St Jeor
│   │   └── alertsEngine.js
│   ├── datasets/                    # JSON reference data (seeded to Supabase)
│   │   ├── foods.json               # ~110 foods
│   │   ├── yoga.json                # ~55 yoga/pranayama/meditation
│   │   ├── ritucharya.json          # ~80 seasonal foods
│   │   ├── viruddha.json            # ~75 incompatible pairs
│   │   ├── prevention.json          # 20 diseases + prevention
│   │   └── chatbot_qa.json          # 70+ Ayurveda Q&A
│   ├── ml/
│   │   ├── datasetGenerator.js      # synthetic 10k-row generator
│   │   ├── trainer.js               # vanilla logistic regression trainer
│   │   ├── model.json               # (generated) trained coefficients
│   │   └── dataset.csv              # (generated) training data
│   ├── scripts/
│   │   ├── seedDatasets.js          # upload JSON → Supabase
│   │   └── trainModel.js            # train ML model
│   ├── schedulers/sensorSimulator.js
│   └── routes/                      # route modules
├── supabase_schema.sql              # fresh v4 schema
└── README.md                        # you are here
```

---

## 7 — Troubleshooting

| Symptom | Fix |
|---------|-----|
| `users.role does not exist` | You didn't run `supabase_schema.sql` yet. |
| Dashboard shows `-` everywhere | Run the seeder: `cd backend && npm run seed`. |
| Disease risks always 0 | Run `npm run train` so `model.json` exists. |
| Phone can't reach `localhost:4000` | Set `EXPO_PUBLIC_API_URL` to your LAN IP + restart Expo. |
| Can't delete `ayurtwin 3.0/` folder | A Python venv is locking it. Close any Python/VSCode terminal holding it, then delete manually. |
| JWT expired | Token is 7-day. Sign out and log in again. |

---

## 8 — Production notes

- **Rotate** `JWT_SECRET` and use the Supabase **service_role** key (not anon) for the backend in production.
- Enable **Row Level Security** and write policies scoped by `auth.uid()` (currently off for dev ergonomics).
- Deploy backend to Render / Railway / Fly; set the same env vars there.
- For email invites, install `nodemailer` and wire an SMTP provider (Gmail app password, SendGrid, Resend). Ask the backend maintainer for the API key — we intentionally left that off by default.

---

*Developed by Shashwat Developers Group (SDG 2.0).*
