/**
 * AyurTwin v4 ESP32 sensor firmware
 * Sensors: MAX30102 (HR + SpO2)  +  MPU6050 (accel + gyro)  +  DS18B20 (skin temp)
 *
 * POSTs to Supabase REST every 5 seconds:
 *   table   : public.sensor_data
 *   columns : user_id, heart_rate, spo2, body_temperature,
 *             accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z, recorded_at
 *
 * BEFORE FLASHING — fill in the four placeholders below:
 *   1. WIFI_SSID / WIFI_PASSWORD
 *   2. SUPABASE_URL  (use REST endpoint  /rest/v1/sensor_data )
 *   3. SUPABASE_KEY  (anon key from Supabase → Project Settings → API)
 *   4. USER_ID       (UUID from Supabase  →  select id from users where username = 'sham';)
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <ArduinoOTA.h>
#include <Wire.h>
#include <MPU6050.h>
#include "MAX30105.h"
#include "spo2_algorithm.h"
#include <OneWire.h>
#include <DallasTemperature.h>

// ── CONFIG (FILL THESE) ────────────────────────────────────────────────────
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Supabase project — REST endpoint for sensor_data table
const char* SUPABASE_URL  = "https://vfmskkfcsxbsvghbqbrk.supabase.co/rest/v1/sensor_data";
const char* SUPABASE_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmbXNra2Zjc3hic3ZnaGJxYnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNDUxMjcsImV4cCI6MjA5MjYyMTEyN30.iuvEeedrrij_4UnJ2xmO3OjFIDgjH_42nFi5J5K-OTQ";

// Patient UUID (run `select id from users where username='shashwat';` in Supabase)
const char* USER_ID       = "8fca9a37-6120-4e70-bcf1-6c57c1e41cfb";
// ───────────────────────────────────────────────────────────────────────────

// ── HARDWARE PINS ──────────────────────────────────────────────────────────
#define ONE_WIRE_BUS 4   // DS18B20 data pin
// MAX30102 + MPU6050 share I2C (SDA = 21, SCL = 22 on most ESP32 boards)

// ── SENSOR OBJECTS ─────────────────────────────────────────────────────────
MPU6050 mpu;
MAX30105 maxSensor;
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature tempSensor(&oneWire);

// ── HEART-RATE STATE ───────────────────────────────────────────────────────
long lastBeat = 0, prevIR = 0;
bool rising = false;
const byte RATE_SIZE = 4;
byte rates[RATE_SIZE] = {0,0,0,0};
byte rateSpot = 0;
int  avgBPM = 0;

// ── SpO2 STATE ─────────────────────────────────────────────────────────────
#define BUFFER_SIZE 100
uint32_t irBuffer[BUFFER_SIZE], redBuffer[BUFFER_SIZE];
int32_t  spo2, heartRateSpo2;
int8_t   validSPO2, validHeartRate;
int      spo2Value = 0, spo2Index = 0;

// ── MOTION + TEMP ──────────────────────────────────────────────────────────
int16_t ax, ay, az, gx, gy, gz;
float   bodyTemp = 36.8;

// ── TIMING ─────────────────────────────────────────────────────────────────
unsigned long lastUpload = 0;
unsigned long lastPrint  = 0;
const unsigned long UPLOAD_INTERVAL_MS = 5000;
const unsigned long PRINT_INTERVAL_MS  = 2000;

// ── HELPERS ────────────────────────────────────────────────────────────────
void connectWiFi() {
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Connecting Wi-Fi");
    int tries = 0;
    while (WiFi.status() != WL_CONNECTED && tries < 30) {
        delay(500); Serial.print("."); tries++;
    }
    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\nWi-Fi connected: " + WiFi.localIP().toString());
    } else {
        Serial.println("\nWi-Fi failed - will retry next upload");
    }
}

// Convert raw MPU6050 ints (default ±2g, ±250°/s scale) into SI-ish floats
// to match the backend's accel/gyro magnitudes.
float scaleAccel(int16_t v) { return v / 16384.0 * 9.81; }   // m/s^2
float scaleGyro(int16_t v)  { return v / 131.0;        }     // °/s

// ── DATA VALIDATION ───────────────────────────────────────────────────────
bool isValidHeartRate(int hr) {
    return hr >= 40 && hr <= 180;  // Typical wearable range
}

bool isValidSpO2(int spo2) {
    return spo2 >= 80 && spo2 <= 100;  // Acceptable blood oxygen range
}

bool isValidTemperature(float temp) {
    return temp >= 35.0 && temp <= 40.5;  // Human body temp range
}

bool isValidMotion(float val) {
    return val >= -50 && val <= 50;  // Reasonable accel/gyro range
}

void uploadSensorRow(bool fingerOnSensor) {
    // SKIP upload if data looks corrupted
    if (fingerOnSensor && !isValidHeartRate(avgBPM)) {
        Serial.printf("[upload SKIP] Invalid HR: %d\n", avgBPM);
        return;
    }
    if (fingerOnSensor && !isValidSpO2(spo2Value)) {
        Serial.printf("[upload SKIP] Invalid SpO2: %d\n", spo2Value);
        return;
    }
    if (!isValidTemperature(bodyTemp)) {
        Serial.printf("[upload SKIP] Invalid temp: %.2f\n", bodyTemp);
        return;
    }
    if (!isValidMotion(scaleAccel(ax)) || !isValidMotion(scaleAccel(ay)) || !isValidMotion(scaleAccel(az))) {
        Serial.printf("[upload SKIP] Invalid accel values\n");
        return;
    }

    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("[upload] Wi-Fi down, reconnecting...");
        connectWiFi();
        if (WiFi.status() != WL_CONNECTED) return;
    }

    HTTPClient http;
    http.begin(SUPABASE_URL);
    http.setTimeout(8000);
    http.addHeader("Content-Type",  "application/json");
    http.addHeader("apikey",        SUPABASE_KEY);
    http.addHeader("Authorization", String("Bearer ") + SUPABASE_KEY);
    http.addHeader("Prefer",        "return=minimal");

    StaticJsonDocument<512> doc;
    doc["user_id"]          = USER_ID;
    doc["heart_rate"]       = fingerOnSensor ? avgBPM     : nullptr;
    doc["spo2"]             = fingerOnSensor ? spo2Value  : nullptr;
    doc["body_temperature"] = bodyTemp;
    doc["accel_x"]          = scaleAccel(ax);
    doc["accel_y"]          = scaleAccel(ay);
    doc["accel_z"]          = scaleAccel(az);
    doc["gyro_x"]           = scaleGyro(gx);
    doc["gyro_y"]           = scaleGyro(gy);
    doc["gyro_z"]           = scaleGyro(gz);
    // recorded_at omitted — Supabase column has DEFAULT now()

    String body;
    serializeJson(doc, body);
    int code = http.POST(body);

    if (code == 201 || code == 200 || code == 204) {
        Serial.printf("[upload] OK  HR=%d  SpO2=%d  T=%.2f\n",
                      fingerOnSensor ? avgBPM : 0,
                      fingerOnSensor ? spo2Value : 0,
                      bodyTemp);
    } else {
        Serial.printf("[upload] HTTP %d\n  body: %s\n  resp: %s\n",
                      code, body.c_str(), http.getString().c_str());
    }
    http.end();
}

// ── SETUP ──────────────────────────────────────────────────────────────────
void setup() {
    Serial.begin(115200);
    delay(200);

    Wire.begin(21, 22);
    Wire.setClock(100000);

    mpu.initialize();
    if (!mpu.testConnection()) Serial.println("MPU6050 not responding");

    if (!maxSensor.begin(Wire)) {
        Serial.println("MAX30102 not found — halting");
        while (1) delay(1000);
    }
    maxSensor.setup(0x1F, 4, 2, 100, 411, 4096);

    tempSensor.begin();

    connectWiFi();
    ArduinoOTA.begin();

    Serial.println("===== AyurTwin sensor node ready =====");
    Serial.println("Posting to: " + String(SUPABASE_URL));
    Serial.println("As user_id: " + String(USER_ID));
    
    // Allow sensors to warm up and stabilize before first upload
    Serial.println("Warming up sensors for 10 seconds...");
    for (int i = 0; i < 10; i++) {
        delay(1000);
        Serial.print(".");
    }
    Serial.println("\nSensors ready!");
}

// ── LOOP ───────────────────────────────────────────────────────────────────
void loop() {
    ArduinoOTA.handle();

    while (!maxSensor.available()) maxSensor.check();
    long ir  = maxSensor.getIR();
    long red = maxSensor.getRed();
    maxSensor.nextSample();

    bool fingerOn = (ir > 50000);

    if (fingerOn) {
        // beat detection
        if (ir > prevIR) rising = true;
        if (ir < prevIR && rising) {
            long now = millis();
            float bpm = 60.0 / ((now - lastBeat) / 1000.0);
            lastBeat = now;
            if (bpm > 50 && bpm < 130) {
                rates[rateSpot++] = (byte)bpm;
                rateSpot %= RATE_SIZE;
                int sum = 0;
                for (int i = 0; i < RATE_SIZE; i++) sum += rates[i];
                avgBPM = sum / RATE_SIZE;
            }
            rising = false;
        }
        prevIR = ir;

        // SpO2 over rolling window
        redBuffer[spo2Index] = red;
        irBuffer[spo2Index]  = ir;
        spo2Index++;
        if (spo2Index >= BUFFER_SIZE) {
            maxim_heart_rate_and_oxygen_saturation(
                irBuffer, BUFFER_SIZE, redBuffer,
                &spo2, &validSPO2, &heartRateSpo2, &validHeartRate);
            if (validSPO2 && spo2 > 80 && spo2 <= 100) spo2Value = spo2;
            spo2Index = 0;
        }
    } else {
        avgBPM = 0; lastBeat = 0; rising = false;
    }

    unsigned long now = millis();

    if (now - lastPrint > PRINT_INTERVAL_MS) {
        lastPrint = now;
        mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
        tempSensor.requestTemperatures();
        float t = tempSensor.getTempCByIndex(0);
        if (t > 20 && t < 45) bodyTemp = t;

        Serial.printf("HR=%d  SpO2=%d  T=%.2f  finger=%s\n",
                      avgBPM, spo2Value, bodyTemp, fingerOn ? "yes" : "no");
    }

    if (now - lastUpload > UPLOAD_INTERVAL_MS) {
        lastUpload = now;
        // refresh motion + temp once more right before send
        mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
        tempSensor.requestTemperatures();
        float t = tempSensor.getTempCByIndex(0);
        if (t > 20 && t < 45) bodyTemp = t;

        uploadSensorRow(fingerOn);
    }

    delay(5);
}
