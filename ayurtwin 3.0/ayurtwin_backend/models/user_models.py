from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, EmailStr


class Gender(str, Enum):
    male = "male"
    female = "female"
    other = "other"


class BloodGroup(str, Enum):
    A_POS = "A+"
    A_NEG = "A-"
    B_POS = "B+"
    B_NEG = "B-"
    AB_POS = "AB+"
    AB_NEG = "AB-"
    O_POS = "O+"
    O_NEG = "O-"


class PhysicalActivityLevel(str, Enum):
    sedentary = "sedentary"
    light = "light"
    moderate = "moderate"
    high = "high"


class WorkType(str, Enum):
    desk = "desk"
    field = "field"
    mixed = "mixed"


class DietType(str, Enum):
    vegetarian = "vegetarian"
    non_vegetarian = "non_vegetarian"
    vegan = "vegan"


class BodyTemperatureFeel(str, Enum):
    cold = "cold"
    normal = "normal"
    warm = "warm"


class StressResponse(str, Enum):
    calm = "calm"
    reactive = "reactive"
    highly_reactive = "highly_reactive"


class PrakritiType(str, Enum):
    vata = "vata"
    pitta = "pitta"
    kapha = "kapha"
    vata_pitta = "vata_pitta"
    pitta_kapha = "pitta_kapha"
    vata_kapha = "vata_kapha"


class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: str
    age: int
    gender: Gender
    height: float
    weight: float
    blood_group: BloodGroup
    phone_number: Optional[str] = None

    # Lifestyle
    physical_activity_level: PhysicalActivityLevel
    work_type: WorkType
    diet_type: DietType
    smoking: bool = False
    alcohol_consumption: bool = False
    water_intake: int = Field(..., description="Glasses per day")
    junk_food_frequency: int = Field(..., description="Times per week")
    exercise_minutes: int = Field(..., description="Per day")

    # Sleep
    sleep_duration: float = Field(..., description="Hours per night")
    sleep_time: str
    wake_time: str
    daytime_sleepiness: bool = False

    # Mental health
    stress_self_score: int = Field(..., ge=0, le=10)
    anxiety_level: int = Field(..., ge=0, le=10)

    # Family history
    family_history_diabetes: bool = False
    family_history_heart_disease: bool = False
    family_history_hypertension: bool = False
    family_history_asthma: bool = False

    # Symptoms
    frequent_thirst: bool = False
    frequent_urination: bool = False
    joint_pain: bool = False
    breathing_difficulty: bool = False
    digestive_issues: bool = False
    fever_symptom: bool = False
    fatigue_level: int = Field(..., ge=0, le=10)

    # Ayurveda
    digestion_strength: int = Field(..., ge=0, le=10)
    appetite_level: int = Field(..., ge=0, le=10)
    sweating_level: int = Field(..., ge=0, le=10)
    body_temperature_feel: BodyTemperatureFeel
    stress_response: StressResponse
    prakriti_type: PrakritiType


class UserLogin(BaseModel):
    username: str
    password: str


class UserProfile(BaseModel):
    user_id: str
    name: str
    username: str
    email: EmailStr
    age: Optional[int] = None
    gender: Optional[str] = None
    bmi: Optional[float] = None
    prakriti_type: Optional[str] = None
    blood_group: Optional[str] = None


class UserUpdate(BaseModel):
    """
    Partial update model for user profile.
    All fields are optional so the client can send only what changed.
    """

    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[Gender] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    blood_group: Optional[BloodGroup] = None
    phone_number: Optional[str] = None

    physical_activity_level: Optional[PhysicalActivityLevel] = None
    work_type: Optional[WorkType] = None
    diet_type: Optional[DietType] = None
    smoking: Optional[bool] = None
    alcohol_consumption: Optional[bool] = None
    water_intake: Optional[int] = None
    junk_food_frequency: Optional[int] = None
    exercise_minutes: Optional[int] = None

    sleep_duration: Optional[float] = None
    sleep_time: Optional[str] = None
    wake_time: Optional[str] = None
    daytime_sleepiness: Optional[bool] = None

    stress_self_score: Optional[int] = None
    anxiety_level: Optional[int] = None

    family_history_diabetes: Optional[bool] = None
    family_history_heart_disease: Optional[bool] = None
    family_history_hypertension: Optional[bool] = None
    family_history_asthma: Optional[bool] = None

    frequent_thirst: Optional[bool] = None
    frequent_urination: Optional[bool] = None
    joint_pain: Optional[bool] = None
    breathing_difficulty: Optional[bool] = None
    digestive_issues: Optional[bool] = None
    fever_symptom: Optional[bool] = None
    fatigue_level: Optional[int] = None

    digestion_strength: Optional[int] = None
    appetite_level: Optional[int] = None
    sweating_level: Optional[int] = None
    body_temperature_feel: Optional[BodyTemperatureFeel] = None
    stress_response: Optional[StressResponse] = None
    prakriti_type: Optional[PrakritiType] = None

