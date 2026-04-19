"""
routers/auth_router.py

POST /auth/register  — create new user account
POST /auth/login     — authenticate and return profile
"""

import uuid
import bcrypt
from fastapi import APIRouter, HTTPException

from models.user_models import UserRegister, UserLogin, UserProfile
from database.queries import create_user, get_user_by_username, get_user_by_email, update_user

router = APIRouter(prefix="/auth", tags=["Auth"])


# ─── Helpers ─────────────────────────────────────────────────────────────────

def _hash_pw(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


def _verify_pw(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def _gen_user_id() -> str:
    return "USR" + uuid.uuid4().hex[:10].upper()


def _to_profile(row: dict) -> UserProfile:
    return UserProfile(
        user_id=row["user_id"],
        name=row["name"],
        username=row["username"],
        email=row["email"],
        age=row.get("age"),
        gender=row.get("gender"),
        bmi=row.get("bmi"),
        prakriti_type=row.get("prakriti_type"),
        blood_group=row.get("blood_group"),
    )


# ─── Register ─────────────────────────────────────────────────────────────────

@router.post("/register", response_model=UserProfile, status_code=201)
def register(data: UserRegister):
    # Duplicate checks
    if get_user_by_username(data.username).data:
        raise HTTPException(status_code=400, detail="Username already taken.")
    if get_user_by_email(data.email).data:
        raise HTTPException(status_code=400, detail="Email already registered.")

    user_id = _gen_user_id()

    row = {
        "user_id":       user_id,
        "username":      data.username,
        "email":         data.email,
        "password_hash": _hash_pw(data.password),
        "name":          data.name,
        "age":           data.age,
        "gender":        data.gender.value,
        "height":        data.height,
        "weight":        data.weight,
        "blood_group":   data.blood_group.value,
        "phone_number":  data.phone_number,

        # Lifestyle
        "physical_activity_level": data.physical_activity_level.value,
        "work_type":               data.work_type.value,
        "diet_type":               data.diet_type.value,
        "smoking":                 data.smoking,
        "alcohol_consumption":     data.alcohol_consumption,
        "water_intake":            data.water_intake,
        "junk_food_frequency":     data.junk_food_frequency,
        "exercise_minutes":        data.exercise_minutes,

        # Sleep
        "sleep_duration":     data.sleep_duration,
        "sleep_time":         data.sleep_time,
        "wake_time":          data.wake_time,
        "daytime_sleepiness": data.daytime_sleepiness,

        # Mental health
        "stress_self_score": data.stress_self_score,
        "anxiety_level":     data.anxiety_level,

        # Family history
        "family_history_diabetes":      data.family_history_diabetes,
        "family_history_heart_disease": data.family_history_heart_disease,
        "family_history_hypertension":  data.family_history_hypertension,
        "family_history_asthma":        data.family_history_asthma,

        # Symptoms
        "frequent_thirst":      data.frequent_thirst,
        "frequent_urination":   data.frequent_urination,
        "joint_pain":           data.joint_pain,
        "breathing_difficulty": data.breathing_difficulty,
        "digestive_issues":     data.digestive_issues,
        "fever_symptom":        data.fever_symptom,
        "fatigue_level":        data.fatigue_level,

        # Ayurveda
        "digestion_strength":    data.digestion_strength,
        "appetite_level":        data.appetite_level,
        "sweating_level":        data.sweating_level,
        "body_temperature_feel": data.body_temperature_feel.value,
        "stress_response":       data.stress_response.value,
        "prakriti_type":         data.prakriti_type.value,
    }

    resp = create_user(row)
    if not resp.data:
        raise HTTPException(status_code=500, detail="Failed to create user.")

    return _to_profile(resp.data[0])


# ─── Login ────────────────────────────────────────────────────────────────────

@router.post("/login", response_model=UserProfile)
def login(data: UserLogin):
    resp = get_user_by_username(data.username)
    if not resp.data:
        raise HTTPException(status_code=401, detail="Invalid username or password.")

    user = resp.data[0]

    if not _verify_pw(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid username or password.")

    # Update last_login timestamp
    try:
        from datetime import datetime, timezone
        update_user(user["user_id"], {"last_login": datetime.now(timezone.utc).isoformat()})
    except Exception:
        pass  # non-critical

    return _to_profile(user)