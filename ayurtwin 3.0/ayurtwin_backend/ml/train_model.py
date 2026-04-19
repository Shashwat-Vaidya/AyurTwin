import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

data = pd.read_csv("D:\downloads\health_training_data_rows.csv")

X = data.drop("disease", axis=1)
y = data["disease"]

model = RandomForestClassifier()

model.fit(X, y)

joblib.dump(model, "ml_model.pkl")

print("Model trained successfully")