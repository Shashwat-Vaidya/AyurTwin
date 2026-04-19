"""
routers/user_router.py

GET  /users/{user_id}         — fetch user profile
PUT  /users/{user_id}         — update mutable fields
GET  /users/{user_id}/sensor  — latest sensor reading
GET  /users/{user_id}/history — last N predictions
"""

from fastapi import APIRouter, HTTPException

from models.user_models import UserProfile, UserUpdate
from database.queries import (
    get_user,
    update_user,
    get_latest_sensor,
    get_sensor_history,
    get_user_predictions,
)

router = APIRouter(prefix="/users", tags=["Users"])


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


@router.get("/{user_id}", response_model=UserProfile)
def get_profile(user_id: str):
    resp = get_user(user_id)
    if not resp.data:
        raise HTTPException(status_code=404, detail="User not found.")
    return _to_profile(resp.data[0])


@router.put("/{user_id}", response_model=UserProfile)
def update_profile(user_id: str, data: UserUpdate):
    # Confirm user exists
    resp = get_user(user_id)
    if not resp.data:
        raise HTTPException(status_code=404, detail="User not found.")

    # Only send non-None fields to Supabase
    payload = {
        k: (v.value if hasattr(v, "value") else v)
        for k, v in data.model_dump().items()
        if v is not None
    }

    if not payload:
        raise HTTPException(status_code=400, detail="No fields to update.")

    updated = update_user(user_id, payload)
    if not updated.data:
        raise HTTPException(status_code=500, detail="Update failed.")

    return _to_profile(updated.data[0])


@router.get("/{user_id}/sensor")
def latest_sensor(user_id: str):
    resp = get_latest_sensor(user_id)
    return {"user_id": user_id, "sensor": resp.data[0] if resp.data else None}


@router.get("/{user_id}/sensor/history")
def sensor_history(user_id: str, limit: int = 50):
    resp = get_sensor_history(user_id, limit)
    return {"user_id": user_id, "readings": resp.data or []}


@router.get("/{user_id}/history")
def prediction_history(user_id: str, limit: int = 10):
    resp = get_user_predictions(user_id, limit)
    return {"user_id": user_id, "predictions": resp.data or []}