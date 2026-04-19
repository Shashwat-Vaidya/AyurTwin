from pydantic import BaseModel
from typing import List, Dict, Any


class DiseaseResult(BaseModel):
    label: str
    risk_score: float
    flag: int
    disease_id: int


class PredictionResponse(BaseModel):
    user_id: str
    diseases: List[DiseaseResult]
    active_disease_ids: List[int]
    recommendations: Dict[int, Dict[str, Any]]
    ayurveda: List[DiseaseResult]
    sensor_alerts: List[str]

