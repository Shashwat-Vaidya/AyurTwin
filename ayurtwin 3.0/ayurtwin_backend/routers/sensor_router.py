"""
routers/sensor_router.py

POST /sensor/ingest      — store raw sensor reading only
POST /sensor/stream      — store + run full prediction + recommendations
GET  /sensor/{user_id}   — latest reading for a user
"""

from fastapi import APIRouter, HTTPException


from models.prediction_models import PredictionResponse
from database.queries import get_user, insert_sensor_data
from services.prediction_service import run_ml_prediction
from services.fusion_engine import fuse
from services.recommendation_service import get_recommendations_for_diseases
from services.ayurveda_engine import get_ayurvedic_context
from database.queries import save_predictions
from utils import get_logger

from models.sensor_models import SensorData as SensorInput  # ← alias it

router = APIRouter(prefix="/sensor", tags=["Sensor"])
log    = get_logger(__name__)


# ─── Store only (no prediction) ───────────────────────────────────────────────

@router.post("/ingest", status_code=201)
def ingest_sensor(data: SensorInput):
    """Store a raw sensor reading into sensor_data table."""
    row = {
        "user_id":          data.user_id,
        "heart_rate":       data.heart_rate,
        "spo2":             data.spo2,
        "body_temperature": data.body_temp,
        "accel_x":          data.accel_x,
        "accel_y":          data.accel_y,
        "accel_z":          data.accel_z,
        "gyro_x":           data.gyro_x,
        "gyro_y":           data.gyro_y,
        "gyro_z":           data.gyro_z,
    }
    resp = insert_sensor_data(row)
    if not resp.data:
        raise HTTPException(status_code=500, detail="Failed to store sensor data.")
    return {"message": "Sensor data stored.", "id": resp.data[0].get("id")}


# ─── Store + Full prediction pipeline ────────────────────────────────────────

@router.post("/stream", response_model=PredictionResponse)
def sensor_stream(data: SensorInput):
    """
    Full pipeline triggered by a live sensor reading:
      1. Store sensor reading
      2. Fetch user profile
      3. ML prediction (10 diseases)
      4. Sensor rule overrides + Ayurveda fusion
      5. Fetch diet / yoga / exercise recommendations
      6. Return complete response + save predictions to DB
    """
    user_id = data.user_id

    # ── 1. Store sensor reading ───────────────────────────────────────────
    row = {
        "user_id":          user_id,
        "heart_rate":       data.heart_rate,
        "spo2":             data.spo2,
        "body_temperature": data.body_temp,
        "accel_x":          data.accel_x,
        "accel_y":          data.accel_y,
        "accel_z":          data.accel_z,
        "gyro_x":           data.gyro_x,
        "gyro_y":           data.gyro_y,
        "gyro_z":           data.gyro_z,
    }
    insert_sensor_data(row)

    # ── 2. Fetch user ─────────────────────────────────────────────────────
    user_resp = get_user(user_id)
    if not user_resp.data:
        raise HTTPException(status_code=404, detail=f"User '{user_id}' not found.")
    user = user_resp.data[0]

    # ── 3. Build sensor dict for services ────────────────────────────────
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

    # ── 4. ML prediction ──────────────────────────────────────────────────
    ml_results = run_ml_prediction(user, sensor)
    log.info(f"[{user_id}] ML done. Active: "
             f"{[r['label'] for r in ml_results if r['flag']]}")

    # ── 5. Fusion (sensor rules + Ayurveda boost) ─────────────────────────
    fused_results, alerts = fuse(ml_results, sensor, user)

    # ── 6. Ayurvedic context ──────────────────────────────────────────────
    active_labels = [r["label"] for r in fused_results if r["flag"] == 1]
    ayurveda      = get_ayurvedic_context(user, sensor, active_labels)

    # ── 7. Recommendations ────────────────────────────────────────────────
    recommendations = get_recommendations_for_diseases(fused_results)

    # ── 8. Persist predictions (non-blocking, best-effort) ────────────────
    try:
        pred_rows = [
            {
                "user_id":    user_id,
                "disease_id": r["disease_id"],
                "flag":       r["flag"],
                "risk_score": r["risk_score"],
            }
            for r in fused_results
        ]
        save_predictions(user_id, pred_rows)
    except Exception as e:
        log.warning(f"[{user_id}] Could not save predictions: {e}")

    # ── 9. Build response ─────────────────────────────────────────────────
    active_disease_ids = [r["disease_id"] for r in fused_results if r["flag"] == 1]

    return PredictionResponse(
        user_id=user_id,
        diseases=fused_results,
        active_disease_ids=active_disease_ids,
        recommendations=recommendations,
        ayurveda=ayurveda,
        sensor_alerts=alerts,
    )