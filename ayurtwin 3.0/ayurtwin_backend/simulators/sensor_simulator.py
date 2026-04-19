"""
simulators/sensor_simulator.py
Simulates DS18B20 + MAX30102 + MPU6050 sensor data for local testing
without physical hardware.

Usage (from project root):
    python -m simulators.sensor_simulator --user_id USR001
    python -m simulators.sensor_simulator --user_id USR001 --profile stressed --count 5
"""

import argparse
import random
import time
import requests


# ─── Sensor profiles ─────────────────────────────────────────────────────────

def _normal():
    return {
        "heart_rate": random.uniform(62, 82),
        "spo2":       random.uniform(96.5, 99.0),
        "body_temp":  random.uniform(36.4, 37.2),
        "accel_x":    random.uniform(-0.3, 0.3),
        "accel_y":    random.uniform(-0.3, 0.3),
        "accel_z":    random.uniform(9.5, 10.1),
        "gyro_x":     random.uniform(-3, 3),
        "gyro_y":     random.uniform(-3, 3),
        "gyro_z":     random.uniform(-3, 3),
    }


def _stressed():
    """High HR, slightly low SpO2, elevated temp."""
    return {
        "heart_rate": random.uniform(95, 118),
        "spo2":       random.uniform(93.0, 96.0),
        "body_temp":  random.uniform(37.4, 38.3),
        "accel_x":    random.uniform(-1.2, 1.2),
        "accel_y":    random.uniform(-1.2, 1.2),
        "accel_z":    random.uniform(8.8, 10.5),
        "gyro_x":     random.uniform(-18, 18),
        "gyro_y":     random.uniform(-18, 18),
        "gyro_z":     random.uniform(-18, 18),
    }


def _hypoxia():
    """Critical low SpO2."""
    return {
        "heart_rate": random.uniform(88, 110),
        "spo2":       random.uniform(85.0, 91.5),
        "body_temp":  random.uniform(36.0, 37.0),
        "accel_x":    random.uniform(-0.5, 0.5),
        "accel_y":    random.uniform(-0.5, 0.5),
        "accel_z":    random.uniform(9.4, 9.9),
        "gyro_x":     random.uniform(-5, 5),
        "gyro_y":     random.uniform(-5, 5),
        "gyro_z":     random.uniform(-5, 5),
    }


def _fever():
    """High body temperature."""
    return {
        "heart_rate": random.uniform(95, 115),
        "spo2":       random.uniform(94.0, 97.0),
        "body_temp":  random.uniform(38.2, 39.5),
        "accel_x":    random.uniform(-0.4, 0.4),
        "accel_y":    random.uniform(-0.4, 0.4),
        "accel_z":    random.uniform(9.5, 10.0),
        "gyro_x":     random.uniform(-4, 4),
        "gyro_y":     random.uniform(-4, 4),
        "gyro_z":     random.uniform(-4, 4),
    }


PROFILES = {
    "normal":   _normal,
    "stressed": _stressed,
    "hypoxia":  _hypoxia,
    "fever":    _fever,
}


# ─── Runner ───────────────────────────────────────────────────────────────────

def run(
    user_id:  str,
    base_url: str,
    profile:  str = "normal",
    interval: int = 5,
    count:    int = 10,
    endpoint: str = "stream",   # "stream" or "ingest"
):
    gen = PROFILES.get(profile, _normal)
    url = f"{base_url}/sensor/{endpoint}"

    print(f"\n[simulator] user={user_id}  profile={profile}  "
          f"endpoint={endpoint}  interval={interval}s  count={count}")
    print(f"[simulator] → {url}\n")

    for i in range(1, count + 1):
        payload = {"user_id": user_id, **gen()}

        print(f"[{i:02d}/{count}] "
              f"HR={payload['heart_rate']:.1f}  "
              f"SpO2={payload['spo2']:.1f}%  "
              f"Temp={payload['body_temp']:.1f}°C", end="  ")

        try:
            r = requests.post(url, json=payload, timeout=15)
            data = r.json()

            if endpoint == "stream":
                active = data.get("active_disease_ids", [])
                alerts = data.get("sensor_alerts", [])
                print(f"→ {r.status_code}  active={active}")
                for alert in alerts:
                    print(f"           ⚡ {alert}")
            else:
                print(f"→ {r.status_code}")

        except requests.exceptions.ConnectionError:
            print(f"→ CONNECTION ERROR — is the server running at {base_url}?")
        except Exception as e:
            print(f"→ ERROR: {e}")

        if i < count:
            time.sleep(interval)

    print("\n[simulator] Done.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AyurTwin Sensor Simulator")
    parser.add_argument("--user_id",  default="USR001",  help="Target user_id")
    parser.add_argument("--url",      default="http://localhost:8000")
    parser.add_argument("--profile",  default="normal",  choices=list(PROFILES.keys()))
    parser.add_argument("--interval", type=int, default=5,  help="Seconds between readings")
    parser.add_argument("--count",    type=int, default=10, help="Number of readings to send")
    parser.add_argument("--endpoint", default="stream",  choices=["stream", "ingest"])
    args = parser.parse_args()

    run(args.user_id, args.url, args.profile, args.interval, args.count, args.endpoint)