"""
routers/recommendation_router.py

Standalone endpoints so the Flutter app can reload recommendations
independently without re-triggering a full prediction.

GET /recommendations/diet/{disease_id}
GET /recommendations/yoga/{condition_id}
GET /recommendations/exercise/{condition_id}
GET /recommendations/disease/{disease_id}
GET /recommendations/all-diseases
"""

from fastapi import APIRouter, HTTPException

from database.queries import (
    get_food_recommended,
    get_food_not_recommended,
    get_yoga,
    get_exercise,
    get_disease,
    get_all_diseases,
)

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.get("/diet/{disease_id}")
def diet_for_disease(disease_id: str):
    """
    Recommended and avoid food lists for a disease.
    disease_id: D001 … D010
    """
    rec   = get_food_recommended(disease_id)
    avoid = get_food_not_recommended(disease_id)
    return {
        "disease_id":  disease_id,
        "recommended": rec.data   or [],
        "avoid":       avoid.data or [],
    }


@router.get("/yoga/{condition_id}")
def yoga_for_condition(condition_id: int):
    resp = get_yoga(condition_id)
    if not resp.data:
        raise HTTPException(status_code=404, detail="No yoga found for this condition.")
    return {"condition_id": condition_id, "yoga": resp.data}


@router.get("/exercise/{condition_id}")
def exercise_for_condition(condition_id: int):
    resp = get_exercise(condition_id)
    if not resp.data:
        raise HTTPException(status_code=404, detail="No exercises found for this condition.")
    return {"condition_id": condition_id, "exercise": resp.data}


@router.get("/disease/{disease_id}")
def disease_info(disease_id: str):
    resp = get_disease(disease_id)
    if not resp.data:
        raise HTTPException(status_code=404, detail="Disease not found.")
    return resp.data[0]


@router.get("/all-diseases")
def all_diseases():
    resp = get_all_diseases()
    return {"diseases": resp.data or []}