from pydantic import BaseModel


class SensorInput(BaseModel):
    user_id: str
    heart_rate: float
    spo2: float
    body_temp: float
    accel_x: float
    accel_y: float
    accel_z: float
    gyro_x: float
    gyro_y: float
    gyro_z: float


class SensorData(SensorInput):
    """Alias kept for backward compatibility."""
    pass