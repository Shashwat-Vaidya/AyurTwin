from database.queries import get_diet, get_yoga, get_exercise
from utils import get_logger


log = get_logger(__name__)


DISEASE_MAP = {
    "stress": 1,
    "sleep_disorder": 2,
    "hypertension": 3,
    "fatigue": 4,
    "respiratory_issue": 5,
    "inflammation": 6,
    "obesity": 7,
}


def get_recommendations_for_diseases(fused_results, user_age: int = 30):
    """Get diet, yoga, and exercise recommendations for active diseases."""
    recs = {}
    for r in fused_results:
        if r["flag"] == 1:
            label = r["label"]
            disease_id = DISEASE_MAP.get(label.lower(), 1)
            try:
                recs[disease_id] = {
                    "diet": get_diet(disease_id),
                    "yoga": get_yoga(disease_id, user_age),
                    "exercise": get_exercise(disease_id, user_age),
                }
            except Exception as e:
                log.warning(f"Recs for {disease_id}: {e}")
                recs[disease_id] = {"error": str(e)}
    return recs
