import joblib
import numpy as np

# load trained ML model
model = joblib.load("ml_model.pkl")

# diseases predicted by ML model
conditions = [
    "stress",
    "sleep_disorder",
    "hypertension",
    "fatigue",
    "respiratory_issue"
]


def predict_modern_disease(features):

    probabilities = model.predict_proba(features)

    result = {}

    for i, condition in enumerate(conditions):

        try:
            risk = probabilities[i][0][1] * 100
        except:
            risk = 0

        result[condition] = round(risk, 2)

    return result


def run_ml_prediction(user, sensor):
    """
    Run ML prediction for standard sensor format.
    """
    features = np.array([[sensor["heart_rate"], sensor["spo2"], sensor["body_temp"]]])
    risks = predict_modern_disease(features)
    results = []
    for i, label in enumerate(conditions):
        score = risks[label]
        flag = 1 if score > 50 else 0
        disease_id = i + 1
        results.append({
            "label": label,
            "risk_score": score,
            "flag": flag,
            "disease_id": disease_id
        })
    return results
