import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Alert, Platform } from 'react-native';

import permissionHelper from '../utils/helpers/permissionHelper';

export const useCamera = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedVideo, setCapturedVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(0);
  const [pictureSize, setPictureSize] = useState(null);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const cameraStatus = await Camera.getCameraPermissionsAsync();
    setHasCameraPermission(cameraStatus.status === 'granted');

    const mediaStatus = await MediaLibrary.getPermissionsAsync();
    setHasMediaLibraryPermission(mediaStatus.status === 'granted');
  };

  const requestCameraPermission = async () => {
    setIsLoading(true);
    try {
      const result = await permissionHelper.requestCameraPermission();
      setHasCameraPermission(result.granted);
      return result.granted;
    } catch (error) {
      setError('Failed to request camera permission');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const requestMediaLibraryPermission = async () => {
    setIsLoading(true);
    try {
      const result = await permissionHelper.requestMediaLibraryPermission();
      setHasMediaLibraryPermission(result.granted);
      return result.granted;
    } catch (error) {
      setError('Failed to request media library permission');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const takePicture = useCallback(async () => {
    if (!cameraRef) {
      setError('Camera not ready');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const photo = await cameraRef.takePictureAsync({
        quality: 0.8,
        base64: true,
        exif: true,
        skipProcessing: Platform.OS === 'android',
      });

      setCapturedImage(photo);
      
      // Save to media library if permission granted
      if (hasMediaLibraryPermission) {
        const asset = await MediaLibrary.createAssetAsync(photo.uri);
        await MediaLibrary.createAlbumAsync('AyurTwin', asset, false);
      }

      setIsLoading(false);
      return photo;
    } catch (error) {
      setError('Failed to take picture');
      setIsLoading(false);
      return null;
    }
  }, [cameraRef, hasMediaLibraryPermission]);

  const startRecording = useCallback(async () => {
    if (!cameraRef) {
      setError('Camera not ready');
      return;
    }

    setIsRecording(true);
    setError(null);

    try {
      const video = await cameraRef.recordAsync({
        maxDuration: 60,
        quality: Camera.Constants.VideoQuality['720p'],
        mute: false,
      });

      setCapturedVideo(video);
      
      // Save to media library if permission granted
      if (hasMediaLibraryPermission) {
        const asset = await MediaLibrary.createAssetAsync(video.uri);
        await MediaLibrary.createAlbumAsync('AyurTwin', asset, false);
      }

      setIsRecording(false);
      return video;
    } catch (error) {
      setError('Failed to record video');
      setIsRecording(false);
      return null;
    }
  }, [cameraRef, hasMediaLibraryPermission]);

  const stopRecording = useCallback(() => {
    if (cameraRef && isRecording) {
      cameraRef.stopRecording();
    }
  }, [cameraRef, isRecording]);

  const pickImage = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled) {
        setCapturedImage(result.assets[0]);
        setIsLoading(false);
        return result.assets[0];
      }

      setIsLoading(false);
      return null;
    } catch (error) {
      setError('Failed to pick image');
      setIsLoading(false);
      return null;
    }
  }, []);

  const pickVideo = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setCapturedVideo(result.assets[0]);
        setIsLoading(false);
        return result.assets[0];
      }

      setIsLoading(false);
      return null;
    } catch (error) {
      setError('Failed to pick video');
      setIsLoading(false);
      return null;
    }
  }, []);

  const toggleCameraType = useCallback(() => {
    setCameraType(current => 
      current === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  }, []);

  const toggleFlash = useCallback(() => {
    setFlashMode(current => {
      switch (current) {
        case Camera.Constants.FlashMode.off:
          return Camera.Constants.FlashMode.on;
        case Camera.Constants.FlashMode.on:
          return Camera.Constants.FlashMode.auto;
        case Camera.Constants.FlashMode.auto:
          return Camera.Constants.FlashMode.torch;
        case Camera.Constants.FlashMode.torch:
          return Camera.Constants.FlashMode.off;
        default:
          return Camera.Constants.FlashMode.off;
      }
    });
  }, []);

  const handleZoom = useCallback((zoomValue) => {
    setZoom(Math.max(0, Math.min(1, zoomValue)));
  }, []);

  const resetCapture = useCallback(() => {
    setCapturedImage(null);
    setCapturedVideo(null);
    setError(null);
  }, []);

  const getCameraInfo = useCallback(async () => {
    if (!cameraRef) return null;

    try {
      const ratios = await cameraRef.getSupportedRatiosAsync();
      const sizes = await cameraRef.getAvailablePictureSizesAsync();
      return { ratios, sizes };
    } catch (error) {
      console.error('Error getting camera info:', error);
      return null;
    }
  }, [cameraRef]);

  const checkCameraAvailability = useCallback(async () => {
    const hasPermission = hasCameraPermission || await requestCameraPermission();
    const devices = await Camera.getAvailableCameraTypesAsync();
    return {
      hasPermission,
      hasBackCamera: devices.includes(Camera.Constants.Type.back),
      hasFrontCamera: devices.includes(Camera.Constants.Type.front),
    };
  }, [hasCameraPermission]);

  return {
    // State
    hasCameraPermission,
    hasMediaLibraryPermission,
    cameraRef,
    isRecording,
    cameraType,
    flashMode,
    capturedImage,
    capturedVideo,
    isLoading,
    error,
    zoom,
    pictureSize,

    // Methods
    setCameraRef,
    requestCameraPermission,
    requestMediaLibraryPermission,
    takePicture,
    startRecording,
    stopRecording,
    pickImage,
    pickVideo,
    toggleCameraType,
    toggleFlash,
    handleZoom,
    resetCapture,
    getCameraInfo,
    checkCameraAvailability,
  };
};

export default useCamera;