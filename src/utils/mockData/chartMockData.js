/**
 * Mock chart data for development and testing
 */

/**
 * Generate mock heart rate data
 * @param {number} days - Number of days
 * @param {Object} options - Generation options
 * @returns {Object} Heart rate chart data
 */
export const generateHeartRateData = (days = 7, options = {}) => {
  const {
    min = 60,
    max = 100,
    variability = 5,
    includeResting = true,
  } = options;

  const labels = [];
  const data = [];
  const restingData = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));

    // Generate heart rate with some randomness
    const baseValue = min + Math.random() * (max - min);
    const value = Math.round(baseValue + (Math.random() - 0.5) * variability);
    data.push(value);

    if (includeResting) {
      const resting = Math.round(baseValue * 0.85 + (Math.random() - 0.5) * 3);
      restingData.push(resting);
    }
  }

  const datasets = [
    {
      data,
      color: (opacity = 1) => `rgba(255, 77, 109, ${opacity})`,
      strokeWidth: 2,
    },
  ];

  if (includeResting) {
    datasets.push({
      data: restingData,
      color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
      strokeWidth: 2,
      strokeDash: [5, 5],
    });
  }

  return {
    labels,
    datasets,
    legend: includeResting ? ['Heart Rate', 'Resting HR'] : ['Heart Rate'],
  };
};

/**
 * Generate mock SpO2 data
 * @param {number} days - Number of days
 * @param {Object} options - Generation options
 * @returns {Object} SpO2 chart data
 */
export const generateSpO2Data = (days = 7, options = {}) => {
  const {
    min = 95,
    max = 100,
    variability = 2,
  } = options;

  const labels = [];
  const data = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));

    const value = Math.min(max, Math.max(min, 
      Math.round((min + Math.random() * (max - min)) * 10) / 10
    ));
    data.push(value);
  }

  return {
    labels,
    datasets: [{
      data,
      color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
      strokeWidth: 2,
    }],
    legend: ['SpO₂'],
  };
};

/**
 * Generate mock temperature data
 * @param {number} days - Number of days
 * @param {Object} options - Generation options
 * @returns {Object} Temperature chart data
 */
export const generateTemperatureData = (days = 7, options = {}) => {
  const {
    min = 36.1,
    max = 37.2,
    variability = 0.3,
  } = options;

  const labels = [];
  const data = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));

    const value = Math.round((min + Math.random() * (max - min)) * 10) / 10;
    data.push(value);
  }

  return {
    labels,
    datasets: [{
      data,
      color: (opacity = 1) => `rgba(255, 140, 66, ${opacity})`,
      strokeWidth: 2,
    }],
    legend: ['Temperature (°C)'],
  };
};

/**
 * Generate mock stress data
 * @param {number} days - Number of days
 * @param {Object} options - Generation options
 * @returns {Object} Stress chart data
 */
export const generateStressData = (days = 7, options = {}) => {
  const {
    min = 20,
    max = 80,
    variability = 10,
  } = options;

  const labels = [];
  const data = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));

    const value = Math.round(min + Math.random() * (max - min));
    data.push(value);
  }

  return {
    labels,
    datasets: [{
      data,
      color: (opacity = 1) => `rgba(155, 107, 158, ${opacity})`,
      strokeWidth: 2,
    }],
    legend: ['Stress Level'],
  };
};

/**
 * Generate mock sleep data
 * @param {number} days - Number of days
 * @param {Object} options - Generation options
 * @returns {Object} Sleep chart data
 */
export const generateSleepData = (days = 7, options = {}) => {
  const {
    minDuration = 6,
    maxDuration = 9,
    includeStages = true,
  } = options;

  const labels = [];
  const duration = [];
  const deep = [];
  const rem = [];
  const light = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));

    const total = Math.round((minDuration + Math.random() * (maxDuration - minDuration)) * 10) / 10;
    duration.push(total);

    if (includeStages) {
      const deepHours = Math.round((total * (0.2 + Math.random() * 0.2)) * 10) / 10;
      const remHours = Math.round((total * (0.2 + Math.random() * 0.15)) * 10) / 10;
      const lightHours = Math.round((total - deepHours - remHours) * 10) / 10;
      
      deep.push(deepHours);
      rem.push(remHours);
      light.push(lightHours);
    }
  }

  const datasets = [{
    data: duration,
    color: (opacity = 1) => `rgba(94, 75, 140, ${opacity})`,
    strokeWidth: 2,
  }];

  if (includeStages) {
    datasets.push({
      data: deep,
      color: (opacity = 1) => `rgba(94, 75, 140, ${opacity})`,
      strokeWidth: 2,
    });
    datasets.push({
      data: rem,
      color: (opacity = 1) => `rgba(155, 107, 158, ${opacity})`,
      strokeWidth: 2,
    });
    datasets.push({
      data: light,
      color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
      strokeWidth: 2,
    });
  }

  return {
    labels,
    datasets,
    legend: includeStages ? ['Total', 'Deep', 'REM', 'Light'] : ['Sleep Duration'],
  };
};

/**
 * Generate mock activity data
 * @param {number} days - Number of days
 * @param {Object} options - Generation options
 * @returns {Object} Activity chart data
 */
export const generateActivityData = (days = 7, options = {}) => {
  const {
    minSteps = 3000,
    maxSteps = 12000,
    includeCalories = true,
    includeDistance = true,
  } = options;

  const labels = [];
  const steps = [];
  const calories = [];
  const distance = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));

    const stepCount = Math.floor(minSteps + Math.random() * (maxSteps - minSteps));
    steps.push(stepCount);

    if (includeCalories) {
      calories.push(Math.floor(stepCount * 0.04));
    }

    if (includeDistance) {
      distance.push(Math.round(stepCount * 0.0008 * 10) / 10);
    }
  }

  const datasets = [{
    data: steps,
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    strokeWidth: 2,
  }];

  if (includeCalories) {
    datasets.push({
      data: calories,
      color: (opacity = 1) => `rgba(255, 140, 66, ${opacity})`,
      strokeWidth: 2,
    });
  }

  if (includeDistance) {
    datasets.push({
      data: distance,
      color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
      strokeWidth: 2,
    });
  }

  return {
    labels,
    datasets,
    legend: ['Steps', ...(includeCalories ? ['Calories'] : []), ...(includeDistance ? ['Distance (km)'] : [])],
  };
};

/**
 * Generate mock dosha balance data
 * @param {number} days - Number of days
 * @returns {Object} Dosha chart data
 */
export const generateDoshaData = (days = 7) => {
  const labels = [];
  const vata = [];
  const pitta = [];
  const kapha = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));

    const v = Math.floor(20 + Math.random() * 40);
    const p = Math.floor(20 + Math.random() * 40);
    const k = 100 - v - p;
    
    vata.push(v);
    pitta.push(p);
    kapha.push(k);
  }

  return {
    labels,
    datasets: [
      {
        data: vata,
        color: (opacity = 1) => `rgba(123, 110, 143, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: pitta,
        color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: kapha,
        color: (opacity = 1) => `rgba(107, 166, 166, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Vata', 'Pitta', 'Kapha'],
  };
};

/**
 * Generate mock hourly data
 * @param {number} hours - Number of hours
 * @param {string} metric - Metric type
 * @returns {Object} Hourly chart data
 */
export const generateHourlyData = (hours = 24, metric = 'heart') => {
  const labels = [];
  const data = [];

  for (let i = 0; i < hours; i++) {
    const hour = i % 24;
    labels.push(hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : `${hour % 12 || 12} ${hour < 12 ? 'AM' : 'PM'}`);

    let value;
    switch (metric) {
      case 'heart':
        value = Math.floor(60 + Math.random() * 40);
        break;
      case 'stress':
        value = Math.floor(20 + Math.random() * 60);
        break;
      case 'activity':
        value = Math.floor(0 + Math.random() * 1000);
        break;
      default:
        value = Math.floor(0 + Math.random() * 100);
    }
    data.push(value);
  }

  return {
    labels,
    datasets: [{
      data,
      color: (opacity = 1) => `rgba(255, 153, 51, ${opacity})`,
      strokeWidth: 2,
    }],
  };
};

/**
 * Generate mock comparison data
 * @param {string} metric - Metric type
 * @returns {Object} Comparison chart data
 */
export const generateComparisonData = (metric = 'heart') => {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const getData = () => {
    switch (metric) {
      case 'heart':
        return {
          current: [72, 75, 78, 74, 76, 73, 71],
          previous: [70, 73, 75, 72, 74, 71, 69],
        };
      case 'steps':
        return {
          current: [5234, 6123, 4876, 7234, 6543, 8234, 4321],
          previous: [4890, 5900, 4650, 6900, 6200, 7800, 4100],
        };
      case 'sleep':
        return {
          current: [7.2, 6.8, 7.5, 7.0, 7.8, 8.2, 7.5],
          previous: [6.8, 6.5, 7.2, 6.8, 7.5, 7.8, 7.0],
        };
      default:
        return {
          current: [70, 72, 71, 73, 72, 74, 71],
          previous: [68, 70, 69, 71, 70, 72, 69],
        };
    }
  };

  const data = getData();

  return {
    labels,
    datasets: [
      {
        data: data.current,
        color: (opacity = 1) => `rgba(255, 153, 51, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: data.previous,
        color: (opacity = 1) => `rgba(90, 107, 122, ${opacity})`,
        strokeWidth: 2,
        strokeDash: [5, 5],
      },
    ],
    legend: ['This Week', 'Last Week'],
  };
};

/**
 * Generate mock distribution data (pie chart)
 * @param {string} type - Distribution type
 * @returns {Array} Distribution data
 */
export const generateDistributionData = (type = 'sleep') => {
  switch (type) {
    case 'sleep':
      return [
        { name: 'Deep Sleep', population: 2.5, color: '#5E4B8C' },
        { name: 'Light Sleep', population: 3.8, color: '#9B6B9E' },
        { name: 'REM Sleep', population: 1.5, color: '#FF9933' },
        { name: 'Awake', population: 0.4, color: '#FF5A5F' },
      ];
    case 'activity':
      return [
        { name: 'Walking', population: 45, color: '#4CAF50' },
        { name: 'Running', population: 15, color: '#FF4D6D' },
        { name: 'Cycling', population: 10, color: '#4A90E2' },
        { name: 'Other', population: 30, color: '#FFB347' },
      ];
    case 'calories':
      return [
        { name: 'Breakfast', population: 550, color: '#FF9933' },
        { name: 'Lunch', population: 750, color: '#4CAF50' },
        { name: 'Dinner', population: 650, color: '#4A90E2' },
        { name: 'Snacks', population: 350, color: '#FFB347' },
      ];
    default:
      return [
        { name: 'Category A', population: 30, color: '#4CAF50' },
        { name: 'Category B', population: 25, color: '#4A90E2' },
        { name: 'Category C', population: 20, color: '#FF9933' },
        { name: 'Category D', population: 15, color: '#FFB347' },
        { name: 'Category E', population: 10, color: '#9B6B9E' },
      ];
  }
};

/**
 * Generate mock trend data with prediction
 * @param {string} metric - Metric type
 * @param {number} days - Number of days
 * @returns {Object} Trend data with prediction
 */
export const generateTrendData = (metric = 'heart', days = 30) => {
  const labels = [];
  const actual = [];
  const predicted = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

    let value;
    switch (metric) {
      case 'heart':
        value = 70 + Math.sin(i * 0.5) * 5 + Math.random() * 5;
        break;
      case 'stress':
        value = 50 + Math.cos(i * 0.3) * 10 + Math.random() * 10;
        break;
      default:
        value = 50 + Math.random() * 30;
    }
    actual.push(Math.round(value));

    // Generate prediction for last 7 days
    if (i >= days - 7) {
      predicted.push(Math.round(value * (1 + (Math.random() * 0.1 - 0.05))));
    } else {
      predicted.push(null);
    }
  }

  return {
    labels,
    datasets: [
      {
        data: actual,
        color: (opacity = 1) => `rgba(255, 153, 51, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: predicted,
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2,
        strokeDash: [5, 5],
      },
    ],
    legend: ['Actual', 'Predicted'],
  };
};

/**
 * Pre-configured mock datasets
 */
export const MOCK_CHARTS = {
  weeklyHeartRate: generateHeartRateData(7),
  monthlyHeartRate: generateHeartRateData(30),
  weeklySpO2: generateSpO2Data(7),
  weeklyTemperature: generateTemperatureData(7),
  weeklyStress: generateStressData(7),
  weeklySleep: generateSleepData(7),
  weeklyActivity: generateActivityData(7),
  doshaTrend: generateDoshaData(7),
  hourlyHeartRate: generateHourlyData(24, 'heart'),
  comparisonHeartRate: generateComparisonData('heart'),
  sleepDistribution: generateDistributionData('sleep'),
  activityDistribution: generateDistributionData('activity'),
  calorieDistribution: generateDistributionData('calories'),
  heartRateTrend: generateTrendData('heart', 30),
};

export default {
  generateHeartRateData,
  generateSpO2Data,
  generateTemperatureData,
  generateStressData,
  generateSleepData,
  generateActivityData,
  generateDoshaData,
  generateHourlyData,
  generateComparisonData,
  generateDistributionData,
  generateTrendData,
  MOCK_CHARTS,
};