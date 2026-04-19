"""
routers/prediction_router.py

POST /predict           — predict diseases for a user from sensor input
                          (does NOT store sensor data — use /sensor/stream for that)
GET  /predict/history/{user_id}  — past prediction records
"""

from fastapi import APIRouter, HTTPException

from models.sensor_models import SensorInput
from models.prediction_models import PredictionResponse
from database.queries import get_user, get_user_predictions
from services.prediction_service import run_ml_prediction
from services.fusion_engine import fuse
from services.recommendation_service import get_recommendations_for_diseases
from services.ayurveda_engine import get_ayurvedic_context
from utils import get_logger

router = APIRouter(prefix="/predict", tags=["Prediction"])
log    = get_logger(__name__)


@router.post("/", response_model=PredictionResponse)
def predict(data: SensorInput):
    """
    Run the full prediction pipeline without storing sensor data.
    Use this endpoint for testing or when the sensor router is unavailable.
    """
    user_id = data.user_id

    # Fetch user
    user_resp = get_user(user_id)
    if not user_resp.data:
        raise HTTPException(status_code=404, detail=f"User '{user_id}' not found.")
    user = user_resp.data[0]

    sensor = {
        "heart_rate": data.heart_rate,
        "spo2":       data.spo2,
        "body_temp":  data.body_temp,
        "accel_x":    data.accel_x,
        "accel_y":    data.accel_y,
        "accel_z":    data.accel_z,
        "gyro_x":     data.gyro_x,
        "gyro_y":     data.gyro_y,
        "gyro_z":     data.gyro_z,
    }

    # ML
    ml_results = run_ml_prediction(user, sensor)

    # Fusion
    fused_results, alerts = fuse(ml_results, sensor, user)

    # Ayurveda
    active_labels = [r["label"] for r in fused_results if r["flag"] == 1]
    ayurveda      = get_ayurvedic_context(user, sensor, active_labels)

    # Recommendations
    recommendations = get_recommendations_for_diseases(fused_results)

    active_disease_ids = [r["disease_id"] for r in fused_results if r["flag"] == 1]

    return PredictionResponse(
        user_id=user_id,
        diseases=fused_results,
        active_disease_ids=active_disease_ids,
        recommendations=recommendations,
        ayurveda=ayurveda,
        sensor_alerts=alerts,
    )


@router.get("/history/{user_id}")
def prediction_history(user_id: str, limit: int = 10):
    resp = get_user_predictions(user_id, limit)
    return {"user_id": user_id, "history": resp.data or []}