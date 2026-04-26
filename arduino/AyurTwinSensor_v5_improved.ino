/**
 * AyurTwin v5 ESP32 sensor firmware (IMPROVED)
 * Sensors: MAX30102 (HR + SpO2)  +  MPU6050 (accel + gyro)  +  DS18B20 (skin temp)
 *
 * IMPROVEMENTS:
 *   - 10-second sensor warmup to avoid startup garbage data
 *   - Data validation before upload (rejects invalid readings)
 *   - Better error logging for debugging
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
 *   4. USER_ID       (UUID from Supabase  →  select id from users where username = 'shashwat';)
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
const char* WIFI_SSID     = "Airtel_vira_5835";
const char* WIFI_PASSWORD = "air42636";

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
const unsigned long PRINT_INTERVAL_MS  = 3000;

// ── VALIDATION STATUS ──────────────────────────────────────────────────────
unsigned long validReadings = 0;
unsigned long rejectedReadings = 0;

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

// ── DATA VALIDATION ────────────────────────────────────────────────────────
bool isValidHeartRate(int hr) {
    return hr >= 40 && hr <= 180;  // Typical wearable range (resting 40, max 180)
}

bool isValidSpO2(int spo2) {
    return spo2 >= 80 && spo2 <= 100;  // Acceptable blood oxygen range
}

bool isValidTemperature(float temp) {
    return temp >= 35.0 && temp <= 40.5;  // Human body temp range
}

bool isValidMotion(float val) {
    return val >= -50 && val <= 50;  // Reasonable accel/gyro range (m/s² or °/s)
}

bool validateAllSensorData(bool fingerOnSensor) {
    // Validate vital signs if finger is present
    if (fingerOnSensor) {
        if (!isValidHeartRate(avgBPM)) {
            Serial.printf("[REJECT] Invalid HR: %d bpm (valid: 40-180)\n", avgBPM);
            rejectedReadings++;
            return false;
        }
        if (!isValidSpO2(spo2Value)) {
            Serial.printf("[REJECT] Invalid SpO2: %d%% (valid: 80-100)\n", spo2Value);
            rejectedReadings++;
            return false;
        }
    }
    
    // Always validate temperature
    if (!isValidTemperature(bodyTemp)) {
        Serial.printf("[REJECT] Invalid temp: %.2f°C (valid: 35.0-40.5)\n", bodyTemp);
        rejectedReadings++;
        return false;
    }
    
    // Validate motion sensors
    float accelX = scaleAccel(ax);
    float accelY = scaleAccel(ay);
    float accelZ = scaleAccel(az);
    float gyroX = scaleGyro(gx);
    float gyroY = scaleGyro(gy);
    float gyroZ = scaleGyro(gz);
    
    if (!isValidMotion(accelX) || !isValidMotion(accelY) || !isValidMotion(accelZ)) {
        Serial.printf("[REJECT] Invalid accel: X=%.2f Y=%.2f Z=%.2f\n", accelX, accelY, accelZ);
        rejectedReadings++;
        return false;
    }
    
    if (!isValidMotion(gyroX) || !isValidMotion(gyroY) || !isValidMotion(gyroZ)) {
        Serial.printf("[REJECT] Invalid gyro: X=%.2f Y=%.2f Z=%.2f\n", gyroX, gyroY, gyroZ);
        rejectedReadings++;
        return false;
    }
    
    validReadings++;
    return true;
}

void uploadSensorRow(bool fingerOnSensor) {
    // VALIDATE before uploading
    if (!validateAllSensorData(fingerOnSensor)) {
        return;  // Skip upload if validation fails
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
    if (fingerOnSensor) {
        doc["heart_rate"]   = avgBPM;
        doc["spo2"]         = spo2Value;
    } else {
        doc["heart_rate"]   = nullptr;
        doc["spo2"]         = nullptr;
    }
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
        Serial.printf("[upload] ✓ HR=%d SpO2=%d T=%.2f | Valid: %lu, Rejected: %lu\n",
                      fingerOnSensor ? avgBPM : 0,
                      fingerOnSensor ? spo2Value : 0,
                      bodyTemp,
                      validReadings, rejectedReadings);
    } else {
        Serial.printf("[upload] ✗ HTTP %d\n  body: %s\n  resp: %s\n",
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
    if (!mpu.testConnection()) Serial.println("⚠ MPU6050 not responding");

    if (!maxSensor.begin(Wire)) {
        Serial.println("✗ MAX30102 not found — halting");
        while (1) delay(1000);
    }
    maxSensor.setup(0x1F, 4, 2, 100, 411, 4096);

    tempSensor.begin();

    connectWiFi();
    ArduinoOTA.begin();

    Serial.println("\n===== AyurTwin v5 sensor node ready =====");
    Serial.println("Posting to: " + String(SUPABASE_URL));
    Serial.println("As user_id: " + String(USER_ID));
    Serial.println("\nWarming up sensors for 10 seconds...");
    
    // ── SENSOR WARMUP (prevents startup garbage data) ────
    for (int i = 0; i < 10; i++) {
        delay(1000);
        Serial.print(".");
    }
    Serial.println("\n✓ Sensors ready! Starting data collection...\n");
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

        Serial.printf(
            "HR=%3d SpO2=%3d T=%.2f finger=%-3s | AX=%+6.2f AY=%+6.2f AZ=%+6.2f | GX=%+6.2f GY=%+6.2f GZ=%+6.2f\n",
            avgBPM, spo2Value, bodyTemp,
            fingerOn ? "yes" : "no",
            scaleAccel(ax), scaleAccel(ay), scaleAccel(az),
            scaleGyro(gx), scaleGyro(gy), scaleGyro(gz)
        );
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
