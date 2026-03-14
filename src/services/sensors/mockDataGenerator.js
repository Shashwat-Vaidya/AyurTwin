/**
 * Mock Data Generator for Sensor Readings
 * Simulates real-time health data from wristband
 */

class MockDataGenerator {
  constructor() {
    this.baseValues = {
      heartRate: 72,
      hrv: 45,
      spo2: 98,
      temperature: 36.6,
      stress: 45,
      steps: 5234,
      sleep: 7.2,
      calories: 1850,
    };

    this.variationRanges = {
      heartRate: { min: 5, max: 15 }, // ±5-15 bpm variation
      hrv: { min: 3, max: 10 },       // ±3-10 ms variation
      spo2: { min: 1, max: 2 },        // ±1-2% variation
      temperature: { min: 0.2, max: 0.5 }, // ±0.2-0.5°C variation
      stress: { min: 5, max: 20 },      // ±5-20 variation
    };

    this.listeners = [];
    this.intervalId = null;
    this.isRunning = false;
  }

  // Generate random value within range
  randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Generate random integer
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Generate random variation based on time of day and activity
  generateVariation(type, currentValue) {
    const hour = new Date().getHours();
    const range = this.variationRanges[type];

    if (!range) return 0;

    // Time-based variation
    let timeFactor = 1;
    if (type === 'heartRate' || type === 'stress') {
      // Higher during day, lower at night
      if (hour >= 22 || hour <= 6) timeFactor = 0.5; // Night
      else if (hour >= 8 && hour <= 18) timeFactor = 1.5; // Day active
    }

    if (type === 'temperature') {
      // Slightly higher in evening
      if (hour >= 18 && hour <= 22) timeFactor = 1.3;
    }

    const variation = this.randomInRange(range.min, range.max) * timeFactor;
    
    // Random direction
    return Math.random() > 0.5 ? variation : -variation;
  }

  // Generate complete sensor reading
  generateReading() {
    const reading = {};
    
    for (const [key, baseValue] of Object.entries(this.baseValues)) {
      if (key === 'steps') {
        // Steps increase throughout the day
        const hour = new Date().getHours();
        const stepsPerHour = 400; // Average steps per hour
        reading.steps = Math.min(10000, hour * stepsPerHour + this.randomInt(-200, 200));
      } else if (key === 'sleep') {
        // Sleep is from previous night
        reading.sleep = this.randomInRange(6, 8.5);
      } else if (key === 'calories') {
        // Calories based on steps
        reading.calories = Math.round(reading.steps * 0.04 + this.randomInt(-50, 50));
      } else {
        // Apply variation to sensor values
        const variation = this.generateVariation(key, baseValue);
        let newValue = baseValue + variation;
        
        // Ensure values stay within realistic ranges
        switch (key) {
          case 'heartRate':
            newValue = Math.max(40, Math.min(120, newValue));
            break;
          case 'hrv':
            newValue = Math.max(20, Math.min(100, newValue));
            break;
          case 'spo2':
            newValue = Math.max(90, Math.min(100, newValue));
            break;
          case 'temperature':
            newValue = Math.max(35.5, Math.min(38.5, newValue));
            break;
          case 'stress':
            newValue = Math.max(10, Math.min(90, newValue));
            break;
        }
        
        reading[key] = Math.round(newValue * 10) / 10;
      }
    }

    return {
      ...reading,
      timestamp: new Date().toISOString(),
      batteryLevel: this.randomInt(60, 100),
      deviceConnected: true,
    };
  }

  // Generate historical data for charts
  generateHistoricalData(days = 7, pointsPerDay = 24) {
    const data = [];
    const now = new Date();

    for (let i = days * pointsPerDay; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * (3600000 / pointsPerDay));
      const hour = timestamp.getHours();

      // Create realistic patterns
      let heartRate = 60 + hour * 0.5 + this.randomInt(-3, 3);
      if (hour >= 22 || hour <= 6) heartRate = 50 + this.randomInt(-5, 5); // Night

      let stress = 30 + hour * 0.3 + this.randomInt(-5, 8);
      if (hour >= 9 && hour <= 17) stress += 10; // Work hours

      data.push({
        timestamp: timestamp.toISOString(),
        heartRate: Math.round(heartRate),
        hrv: Math.round(40 + this.randomInt(-5, 10)),
        spo2: Math.min(100, Math.max(95, 97 + this.randomInt(-1, 2))),
        temperature: 36.5 + this.randomInRange(-0.3, 0.3),
        stress: Math.min(100, Math.max(0, Math.round(stress))),
        steps: this.randomInt(0, 200),
        calories: this.randomInt(50, 150),
      });
    }

    return data;
  }

  // Generate disease risk predictions
  generateRiskPredictions() {
    const diseases = [
      'Diabetes',
      'Hypertension',
      'Stress/Anxiety',
      'Sleep Disorder',
      'Asthma',
      'Arthritis',
      'Obesity',
      'Digestive Disorder',
      'Heart Disease',
      'Fever/Infection',
    ];

    return diseases.map((disease) => {
      let risk = this.randomInt(5, 95);
      let level;

      if (risk < 30) level = 'very low';
      else if (risk < 50) level = 'low';
      else if (risk < 70) level = 'medium';
      else if (risk < 85) level = 'high';
      else level = 'very high';

      return {
        name: disease,
        risk,
        level,
        trend: ['up', 'down', 'stable'][this.randomInt(0, 2)],
      };
    }).sort((a, b) => b.risk - a.risk); // Sort by risk descending
  }

  // Generate alerts based on current readings
  generateAlerts(currentReading) {
    const alerts = [];
    const now = new Date();

    // Check for abnormal readings
    if (currentReading.heartRate > 100) {
      alerts.push({
        id: `alert-${now.getTime()}-1`,
        title: 'High Heart Rate Detected',
        message: `Your heart rate is ${currentReading.heartRate} bpm, above normal range.`,
        timestamp: now.toISOString(),
        severity: 'high',
        type: 'health',
        read: false,
      });
    } else if (currentReading.heartRate < 50) {
      alerts.push({
        id: `alert-${now.getTime()}-1`,
        title: 'Low Heart Rate Detected',
        message: `Your heart rate is ${currentReading.heartRate} bpm, below normal range.`,
        timestamp: now.toISOString(),
        severity: 'medium',
        type: 'health',
        read: false,
      });
    }

    if (currentReading.spo2 < 95) {
      alerts.push({
        id: `alert-${now.getTime()}-2`,
        title: 'Low Oxygen Level',
        message: `Your SpO₂ is ${currentReading.spo2}%. Consider deep breathing exercises.`,
        timestamp: now.toISOString(),
        severity: currentReading.spo2 < 90 ? 'high' : 'medium',
        type: 'health',
        read: false,
      });
    }

    if (currentReading.temperature > 37.5) {
      alerts.push({
        id: `alert-${now.getTime()}-3`,
        title: 'Elevated Temperature',
        message: `Your temperature is ${currentReading.temperature}°C. Monitor for fever.`,
        timestamp: now.toISOString(),
        severity: currentReading.temperature > 38 ? 'high' : 'medium',
        type: 'health',
        read: false,
      });
    }

    if (currentReading.stress > 70) {
      alerts.push({
        id: `alert-${now.getTime()}-4`,
        title: 'High Stress Level',
        message: 'Your stress levels are high. Try taking a break or deep breathing.',
        timestamp: now.toISOString(),
        severity: 'medium',
        type: 'stress',
        read: false,
      });
    }

    // Battery alert
    if (currentReading.batteryLevel < 20) {
      alerts.push({
        id: `alert-${now.getTime()}-5`,
        title: 'Low Battery',
        message: `Device battery is at ${currentReading.batteryLevel}%. Please charge.`,
        timestamp: now.toISOString(),
        severity: 'low',
        type: 'device',
        read: false,
      });
    }

    return alerts;
  }

  // Start real-time data simulation
  startSimulation(callback, interval = 5000) {
    if (this.isRunning) return;

    this.isRunning = true;
    
    // Send initial reading
    const initialReading = this.generateReading();
    callback(initialReading);

    // Send updates at interval
    this.intervalId = setInterval(() => {
      const reading = this.generateReading();
      const alerts = this.generateAlerts(reading);
      
      callback({
        ...reading,
        alerts: alerts.length > 0 ? alerts : null,
      });
    }, interval);
  }

  // Stop simulation
  stopSimulation() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  // Add listener for data updates
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Remove listener
  removeListener(callback) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  // Notify all listeners
  notifyListeners(data) {
    this.listeners.forEach((listener) => listener(data));
  }
}

// Create singleton instance
const mockDataGenerator = new MockDataGenerator();

export default mockDataGenerator;

// Export individual functions for direct use
export const generateMockReading = () => mockDataGenerator.generateReading();
export const generateMockHistoricalData = (days, pointsPerDay) =>
  mockDataGenerator.generateHistoricalData(days, pointsPerDay);
export const generateMockRiskPredictions = () => mockDataGenerator.generateRiskPredictions();
export const startMockSimulation = (callback, interval) =>
  mockDataGenerator.startSimulation(callback, interval);
export const stopMockSimulation = () => mockDataGenerator.stopSimulation();