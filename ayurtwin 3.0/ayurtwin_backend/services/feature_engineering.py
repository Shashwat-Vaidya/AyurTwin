import numpy as np

def build_feature_vector(user, sensor):

    age = user["age"]
    height = user["height_cm"]
    weight = user["weight_kg"]
    bmi = user["bmi"]

    heart_rate = sensor["heart_rate"]
    spo2 = sensor["spo2"]
    body_temp = sensor["body_temp"]

    movement = abs(sensor["accel_x"]) + abs(sensor["accel_y"]) + abs(sensor["accel_z"])

    return np.array([
        age,
        height,
        weight,
        bmi,
        heart_rate,
        spo2,
        body_temp,
        movement
    ]).reshape(1,-1)