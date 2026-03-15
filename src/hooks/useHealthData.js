import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import healthService from '../services/api/healthService';
import websocketService from '../services/sensors/websocketService';
import { 
  updateCurrentReadings,
  addHistoricalData,
  updateDiseaseRisks,
  updateDoshaBalance,
  setHealthDataLoading,
  setHealthDataError,
} from '../store/slices/healthDataSlice';

export const useHealthData = () => {
  const dispatch = useDispatch();
  const { 
    currentReadings,
    historicalData,
    diseaseRisks,
    doshaBalance,
    isLoading,
    error,
  } = useSelector(state => state.healthData);

  const [isLive, setIsLive] = useState(false);

  // Fetch current readings
  const fetchCurrentReadings = useCallback(async () => {
    dispatch(setHealthDataLoading(true));
    try {
      const data = await healthService.getCurrentReadings();
      dispatch(updateCurrentReadings(data));
      return data;
    } catch (error) {
      dispatch(setHealthDataError(error.message));
      return null;
    } finally {
      dispatch(setHealthDataLoading(false));
    }
  }, [dispatch]);

  // Fetch historical data
  const fetchHistoricalData = useCallback(async (type, period) => {
    dispatch(setHealthDataLoading(true));
    try {
      const data = await healthService.getHistoricalData(type, period);
      dispatch(addHistoricalData({ type, data }));
      return data;
    } catch (error) {
      dispatch(setHealthDataError(error.message));
      return null;
    } finally {
      dispatch(setHealthDataLoading(false));
    }
  }, [dispatch]);

  // Fetch disease risks
  const fetchDiseaseRisks = useCallback(async () => {
    try {
      const data = await healthService.getDiseaseRisks();
      dispatch(updateDiseaseRisks(data));
      return data;
    } catch (error) {
      console.error('Error fetching disease risks:', error);
      return null;
    }
  }, [dispatch]);

  // Fetch dosha balance
  const fetchDoshaBalance = useCallback(async () => {
    try {
      const data = await healthService.getDoshaBalance();
      dispatch(updateDoshaBalance(data));
      return data;
    } catch (error) {
      console.error('Error fetching dosha balance:', error);
      return null;
    }
  }, [dispatch]);

  // Start live monitoring
  const startLiveMonitoring = useCallback(() => {
    if (isLive) return;

    websocketService.on('health_data', (data) => {
      dispatch(updateCurrentReadings(data));
    });

    websocketService.on('alert', (alert) => {
      // Handle alert
      console.log('Health alert:', alert);
    });

    setIsLive(true);
  }, [dispatch, isLive]);

  // Stop live monitoring
  const stopLiveMonitoring = useCallback(() => {
    websocketService.off('health_data');
    websocketService.off('alert');
    setIsLive(false);
  }, []);

  // Get heart rate data
  const getHeartRateData = useCallback(async (range = 'day') => {
    return fetchHistoricalData('heart', range);
  }, [fetchHistoricalData]);

  // Get SpO2 data
  const getSpO2Data = useCallback(async (range = 'day') => {
    return fetchHistoricalData('spo2', range);
  }, [fetchHistoricalData]);

  // Get temperature data
  const getTemperatureData = useCallback(async (range = 'day') => {
    return fetchHistoricalData('temperature', range);
  }, [fetchHistoricalData]);

  // Get stress data
  const getStressData = useCallback(async (range = 'day') => {
    return fetchHistoricalData('stress', range);
  }, [fetchHistoricalData]);

  // Get sleep data
  const getSleepData = useCallback(async (range = 'week') => {
    return fetchHistoricalData('sleep', range);
  }, [fetchHistoricalData]);

  // Get activity data
  const getActivityData = useCallback(async (range = 'week') => {
    return fetchHistoricalData('activity', range);
  }, [fetchHistoricalData]);

  // Get daily summary
  const getDailySummary = useCallback(async (date) => {
    try {
      return await healthService.getDailySummary(date);
    } catch (error) {
      console.error('Error fetching daily summary:', error);
      return null;
    }
  }, []);

  // Get weekly summary
  const getWeeklySummary = useCallback(async () => {
    try {
      return await healthService.getWeeklySummary();
    } catch (error) {
      console.error('Error fetching weekly summary:', error);
      return null;
    }
  }, []);

  // Get health score
  const getHealthScore = useCallback(async () => {
    try {
      return await healthService.getHealthScore();
    } catch (error) {
      console.error('Error fetching health score:', error);
      return null;
    }
  }, []);

  // Refresh all data
  const refreshAllData = useCallback(async () => {
    await Promise.all([
      fetchCurrentReadings(),
      fetchDiseaseRisks(),
      fetchDoshaBalance(),
    ]);
  }, [fetchCurrentReadings, fetchDiseaseRisks, fetchDoshaBalance]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (isLive) {
        stopLiveMonitoring();
      }
    };
  }, [isLive, stopLiveMonitoring]);

  return {
    // State
    currentReadings,
    historicalData,
    diseaseRisks,
    doshaBalance,
    isLoading,
    error,
    isLive,

    // Methods
    fetchCurrentReadings,
    fetchHistoricalData,
    fetchDiseaseRisks,
    fetchDoshaBalance,
    startLiveMonitoring,
    stopLiveMonitoring,
    getHeartRateData,
    getSpO2Data,
    getTemperatureData,
    getStressData,
    getSleepData,
    getActivityData,
    getDailySummary,
    getWeeklySummary,
    getHealthScore,
    refreshAllData,
  };
};

export default useHealthData;