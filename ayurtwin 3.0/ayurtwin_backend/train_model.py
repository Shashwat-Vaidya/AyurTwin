
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.multioutput import MultiOutputClassifier
import joblib

# =========================
# LOAD DATASET
# =========================

data = pd.read_csv("D:\downloads\health_training_data_rows.csv")

print("Dataset loaded successfully")
print("Columns:", data.columns)

# =========================
# TARGET HEALTH CONDITIONS
# =========================

target_columns = [
    "stress_anxiety",
    "sleep_disorder",
    "hypertension_risk",
    "fever_infection",
    "fatigue_low_energy",
    "low_oxygen_respiratory_stress",
    "asthma_risk",
    "obesity_risk",
    "poor_cardiovascular_fitness",
    "dosha_imbalance"
]

# =========================
# REMOVE NON-FEATURE COLUMNS
# =========================

drop_columns = target_columns + ["id", "created_at"]

X = data.drop(columns=drop_columns)
y = data[target_columns]

# =========================
# HANDLE TEXT DATA
# =========================

X = pd.get_dummies(X)

# =========================
# TRAIN MODEL
# =========================

model = MultiOutputClassifier(RandomForestClassifier(n_estimators=200))

model.fit(X, y)

# =========================
# SAVE MODEL
# =========================

joblib.dump(model, "ml_model.pkl")

print("Model trained successfully")