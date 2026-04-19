from typing import List, Dict, Any


def get_ayurvedic_context(user: Dict[str, Any], sensor: Dict[str, float], active_labels: List[str] | None = None):
    """Ayurvedic dosha analysis and conditions.

    `active_labels` is an optional list of disease labels to boost.
    """
    if active_labels is None:
        active_labels = []

    vata = 0
    pitta = 0
    kapha = 0

    heart_rate = sensor["heart_rate"]
    body_temp = sensor["body_temp"]
    bmi = user.get("bmi", 0)

    if heart_rate > 95:
        vata += 20

    if body_temp > 37.5:
        pitta += 25

    if bmi > 28:
        kapha += 30

    ayurvedic_conditions: Dict[str, float] = {}

    if vata > 20:
        ayurvedic_conditions["stress"] = 60

    if pitta > 20:
        ayurvedic_conditions["inflammation"] = 55

    if kapha > 20:
        ayurvedic_conditions["obesity"] = 65

    disease_map = {"stress": 1, "inflammation": 6, "obesity": 7}
    results = []

    for label, score in ayurvedic_conditions.items():
        if label in active_labels:
            score *= 1.2

        flag = 1 if score > 30 else 0
        disease_id = disease_map.get(label, 1)

        results.append(
            {
                "label": label,
                "risk_score": round(score, 2),
                "flag": flag,
                "disease_id": disease_id,
            }
        )

    return results

