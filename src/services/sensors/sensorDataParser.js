import { Buffer } from 'buffer';

class SensorDataParser {
  
  // Parse heart rate data from various formats
  parseHeartRate(data) {
    try {
      if (typeof data === 'number') {
        return {
          value: data,
          unit: 'bpm',
          quality: this.getHeartRateQuality(data),
          timestamp: Date.now(),
        };
      }

      if (Buffer.isBuffer(data)) {
        return {
          value: data.readUInt16LE(0),
          unit: 'bpm',
          quality: this.getHeartRateQuality(data.readUInt16LE(0)),
          timestamp: Date.now(),
        };
      }

      if (typeof data === 'string') {
        const buffer = Buffer.from(data, 'base64');
        return {
          value: buffer.readUInt16LE(0),
          unit: 'bpm',
          quality: this.getHeartRateQuality(buffer.readUInt16LE(0)),
          timestamp: Date.now(),
        };
      }

      if (typeof data === 'object' && data.value) {
        return {
          value: data.value,
          unit: data.unit || 'bpm',
          quality: this.getHeartRateQuality(data.value),
          timestamp: data.timestamp || Date.now(),
        };
      }

      throw new Error('Invalid heart rate data format');
    } catch (error) {
      console.error('Error parsing heart rate:', error);
      return null;
    }
  }

  getHeartRateQuality(value) {
    if (value < 40 || value > 180) return 'invalid';
    if (value < 50 || value > 150) return 'poor';
    if (value < 55 || value > 120) return 'fair';
    if (value < 60 || value > 100) return 'good';
    return 'excellent';
  }

  // Parse SpO2 data
  parseSpO2(data) {
    try {
      if (typeof data === 'number') {
        return {
          value: data,
          unit: '%',
          quality: this.getSpO2Quality(data),
          timestamp: Date.now(),
        };
      }

      if (Buffer.isBuffer(data)) {
        return {
          value: data.readUInt8(0),
          unit: '%',
          quality: this.getSpO2Quality(data.readUInt8(0)),
          timestamp: Date.now(),
        };
      }

      if (typeof data === 'string') {
        const buffer = Buffer.from(data, 'base64');
        return {
          value: buffer.readUInt8(0),
          unit: '%',
          quality: this.getSpO2Quality(buffer.readUInt8(0)),
          timestamp: Date.now(),
        };
      }

      if (typeof data === 'object' && data.value) {
        return {
          value: data.value,
          unit: data.unit || '%',
          quality: this.getSpO2Quality(data.value),
          timestamp: data.timestamp || Date.now(),
        };
      }

      throw new Error('Invalid SpO2 data format');
    } catch (error) {
      console.error('Error parsing SpO2:', error);
      return null;
    }
  }

  getSpO2Quality(value) {
    if (value < 70) return 'critical';
    if (value < 80) return 'poor';
    if (value < 90) return 'fair';
    if (value < 95) return 'good';
    return 'excellent';
  }

  // Parse temperature data
  parseTemperature(data) {
    try {
      if (typeof data === 'number') {
        return {
          value: data,
          unit: '°C',
          quality: this.getTemperatureQuality(data),
          timestamp: Date.now(),
        };
      }

      if (Buffer.isBuffer(data)) {
        return {
          value: data.readFloatLE(0),
          unit: '°C',
          quality: this.getTemperatureQuality(data.readFloatLE(0)),
          timestamp: Date.now(),
        };
      }

      if (typeof data === 'string') {
        const buffer = Buffer.from(data, 'base64');
        return {
          value: buffer.readFloatLE(0),
          unit: '°C',
          quality: this.getTemperatureQuality(buffer.readFloatLE(0)),
          timestamp: Date.now(),
        };
      }

      if (typeof data === 'object' && data.value) {
        return {
          value: data.value,
          unit: data.unit || '°C',
          quality: this.getTemperatureQuality(data.value),
          timestamp: data.timestamp || Date.now(),
        };
      }

      throw new Error('Invalid temperature data format');
    } catch (error) {
      console.error('Error parsing temperature:', error);
      return null;
    }
  }

  getTemperatureQuality(value) {
    if (value < 35 || value > 38.5) return 'critical';
    if (value < 35.5 || value > 38) return 'poor';
    if (value < 36 || value > 37.5) return 'fair';
    if (value < 36.1 || value > 37.2) return 'good';
    return 'excellent';
  }

  // Parse stress data (GSR)
  parseStress(data) {
    try {
      if (typeof data === 'number') {
        return {
          value: data,
          unit: '',
          level: this.getStressLevel(data),
          quality: this.getStressQuality(data),
          timestamp: Date.now(),
        };
      }

      if (Buffer.isBuffer(data)) {
        return {
          value: data.readUInt8(0),
          unit: '',
          level: this.getStressLevel(data.readUInt8(0)),
          quality: this.getStressQuality(data.readUInt8(0)),
          timestamp: Date.now(),
        };
      }

      if (typeof data === 'string') {
        const buffer = Buffer.from(data, 'base64');
        return {
          value: buffer.readUInt8(0),
          unit: '',
          level: this.getStressLevel(buffer.readUInt8(0)),
          quality: this.getStressQuality(buffer.readUInt8(0)),
          timestamp: Date.now(),
        };
      }

      if (typeof data === 'object' && data.value) {
        return {
          value: data.value,
          unit: data.unit || '',
          level: this.getStressLevel(data.value),
          quality: this.getStressQuality(data.value),
          timestamp: data.timestamp || Date.now(),
        };
      }

      throw new Error('Invalid stress data format');
    } catch (error) {
      console.error('Error parsing stress:', error);
      return null;
    }
  }

  getStressLevel(value) {
    if (value < 30) return 'low';
    if (value < 50) return 'moderate';
    if (value < 70) return 'high';
    return 'severe';
  }

  getStressQuality(value) {
    if (value < 20) return 'excellent';
    if (value < 40) return 'good';
    if (value < 60) return 'fair';
    if (value < 80) return 'poor';
    return 'critical';
  }

  // Parse activity data
  parseActivity(data) {
    try {
      if (Buffer.isBuffer(data) && data.length >= 10) {
        return {
          steps: data.readUInt32LE(0),
          calories: data.readUInt16LE(4),
          distance: data.readFloatLE(6),
          unit: 'steps',
          timestamp: Date.now(),
        };
      }

      if (typeof data === 'string') {
        const buffer = Buffer.from(data, 'base64');
        if (buffer.length >= 10) {
          return {
            steps: buffer.readUInt32LE(0),
            calories: buffer.readUInt16LE(4),
            distance: buffer.readFloatLE(6),
            unit: 'steps',
            timestamp: Date.now(),
          };
        }
      }

      if (typeof data === 'object' && data.steps) {
        return {
          steps: data.steps,
          calories: data.calories || this.estimateCalories(data.steps),
          distance: data.distance || this.estimateDistance(data.steps),
          unit: data.unit || 'steps',
          timestamp: data.timestamp || Date.now(),
        };
      }

      throw new Error('Invalid activity data format');
    } catch (error) {
      console.error('Error parsing activity:', error);
      return null;
    }
  }

  estimateCalories(steps) {
    // Rough estimate: 0.04 calories per step
    return Math.round(steps * 0.04);
  }

  estimateDistance(steps) {
    // Rough estimate: 0.8 meters per step
    return Number((steps * 0.0008).toFixed(2));
  }

  // Parse sleep data
  parseSleep(data) {
    try {
      if (Buffer.isBuffer(data) && data.length >= 8) {
        return {
          duration: data.readFloatLE(0),
          deep: data.readFloatLE(4),
          quality: data.readUInt8(8),
          timestamp: Date.now(),
        };
      }

      if (typeof data === 'string') {
        const buffer = Buffer.from(data, 'base64');
        if (buffer.length >= 8) {
          return {
            duration: buffer.readFloatLE(0),
            deep: buffer.readFloatLE(4),
            quality: buffer.readUInt8(8),
            timestamp: Date.now(),
          };
        }
      }

      if (typeof data === 'object' && data.duration) {
        return {
          duration: data.duration,
          deep: data.deep || data.duration * 0.3,
          light: data.light || data.duration * 0.5,
          rem: data.rem || data.duration * 0.2,
          quality: data.quality || 70,
          timestamp: data.timestamp || Date.now(),
        };
      }

      throw new Error('Invalid sleep data format');
    } catch (error) {
      console.error('Error parsing sleep:', error);
      return null;
    }
  }

  // Parse battery data
  parseBattery(data) {
    try {
      if (typeof data === 'number') {
        return {
          level: data,
          unit: '%',
          status: this.getBatteryStatus(data),
          timestamp: Date.now(),
        };
      }

      if (Buffer.isBuffer(data)) {
        return {
          level: data.readUInt8(0),
          unit: '%',
          status: this.getBatteryStatus(data.readUInt8(0)),
          timestamp: Date.now(),
        };
      }

      if (typeof data === 'string') {
        const buffer = Buffer.from(data, 'base64');
        return {
          level: buffer.readUInt8(0),
          unit: '%',
          status: this.getBatteryStatus(buffer.readUInt8(0)),
          timestamp: Date.now(),
        };
      }

      throw new Error('Invalid battery data format');
    } catch (error) {
      console.error('Error parsing battery:', error);
      return null;
    }
  }

  getBatteryStatus(level) {
    if (level <= 5) return 'critical';
    if (level <= 15) return 'low';
    if (level <= 30) return 'medium';
    if (level <= 70) return 'good';
    return 'full';
  }

  // Parse device info
  parseDeviceInfo(data) {
    try {
      const result = {};

      if (Buffer.isBuffer(data)) {
        const str = data.toString('utf8');
        try {
          return JSON.parse(str);
        } catch {
          return { raw: str };
        }
      }

      if (typeof data === 'string') {
        try {
          return JSON.parse(data);
        } catch {
          return { raw: data };
        }
      }

      if (typeof data === 'object') {
        return data;
      }

      throw new Error('Invalid device info format');
    } catch (error) {
      console.error('Error parsing device info:', error);
      return null;
    }
  }

  // Parse raw sensor data
  parseRawSensorData(data, sensorType) {
    switch (sensorType) {
      case 'heartRate':
        return this.parseHeartRate(data);
      case 'spo2':
        return this.parseSpO2(data);
      case 'temperature':
        return this.parseTemperature(data);
      case 'stress':
        return this.parseStress(data);
      case 'activity':
        return this.parseActivity(data);
      case 'sleep':
        return this.parseSleep(data);
      case 'battery':
        return this.parseBattery(data);
      default:
        return { raw: data, timestamp: Date.now() };
    }
  }

  // Convert Celsius to Fahrenheit
  celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
  }

  // Convert Fahrenheit to Celsius
  fahrenheitToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5/9;
  }

  // Calculate HRV from RR intervals
  calculateHRV(rrIntervals) {
    if (!rrIntervals || rrIntervals.length < 2) return null;

    // Calculate SDNN (standard deviation of NN intervals)
    const mean = rrIntervals.reduce((a, b) => a + b, 0) / rrIntervals.length;
    const squaredDiffs = rrIntervals.map(value => Math.pow(value - mean, 2));
    const sdnn = Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / rrIntervals.length);

    // Calculate RMSSD (root mean square of successive differences)
    let sumSquaredDiffs = 0;
    for (let i = 1; i < rrIntervals.length; i++) {
      const diff = rrIntervals[i] - rrIntervals[i - 1];
      sumSquaredDiffs += diff * diff;
    }
    const rmssd = Math.sqrt(sumSquaredDiffs / (rrIntervals.length - 1));

    return {
      sdnn: Math.round(sdnn * 10) / 10,
      rmssd: Math.round(rmssd * 10) / 10,
    };
  }
}

export default new SensorDataParser();