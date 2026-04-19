import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal as RNModal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import colors from '../../utils/constants/colors';
import Button from './Button';

const { width, height } = Dimensions.get('window');

const Modal = ({
  visible = false,
  onClose,
  title,
  subtitle,
  children,
  footer,
  showCloseButton = true,
  closeOnBackdropPress = true,
  animationType = 'slide', // 'slide', 'fade', 'none'
  presentationStyle = 'fullScreen', // 'fullScreen', 'pageSheet', 'formSheet', 'overFullScreen'
  transparent = true,
  blurBackdrop = false,
  blurIntensity = 50,
  position = 'center', // 'center', 'top', 'bottom'
  padding = 20,
  width: modalWidth = width * 0.9,
  maxWidth = 400,
  showHeader = true,
  headerStyle,
  titleStyle,
  contentStyle,
  style,
  onShow,
  onDismiss,
  swipeDirection, // 'up', 'down', 'left', 'right'
  swipeThreshold = 100,
  avoidKeyboard = true,
  scrollable = false,
}) => {
  
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const panY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      showModal();
    } else {
      hideModal();
    }
  }, [visible]);

  const showModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onClose) onClose();
    });
  };

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      hideModal();
    }
  };

  const getTransformStyle = () => {
    switch(animationType) {
      case 'slide':
        return {
          transform: [{ translateY: slideAnim }],
        };
      case 'fade':
        return {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        };
      default:
        return {};
    }
  };

  const getPositionStyle = () => {
    switch(position) {
      case 'top':
        return { justifyContent: 'flex-start', paddingTop: 50 };
      case 'bottom':
        return { justifyContent: 'flex-end', paddingBottom: 20 };
      default:
        return { justifyContent: 'center' };
    }
  };

  const modalContent = (
    <Animated.View
      style={[
        styles.modal,
        {
          width: Math.min(modalWidth, maxWidth),
          padding,
          maxHeight: height * 0.9,
        },
        getTransformStyle(),
        style,
      ]}
    >
      {showHeader && (
        <View style={[styles.header, headerStyle]}>
          <View style={styles.headerLeft}>
            {showCloseButton && (
              <TouchableOpacity onPress={hideModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.headerCenter}>
            {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          <View style={styles.headerRight} />
        </View>
      )}

      {scrollable ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, contentStyle]}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, contentStyle]}>{children}</View>
      )}

      {footer && <View style={styles.footer}>{footer}</View>}
    </Animated.View>
  );

  const backdropContent = blurBackdrop ? (
    <BlurView intensity={blurIntensity} style={styles.backdrop}>
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.backdropTouchable} />
      </TouchableWithoutFeedback>
    </BlurView>
  ) : (
    <TouchableWithoutFeedback onPress={handleBackdropPress}>
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
    </TouchableWithoutFeedback>
  );

  return (
    <RNModal
      visible={visible}
      transparent={transparent}
      animationType="none"
      onShow={onShow}
      onDismiss={onDismiss}
      presentationStyle={presentationStyle}
    >
      <KeyboardAvoidingView
        style={[styles.container, getPositionStyle()]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled={avoidKeyboard}
      >
        {backdropContent}
        {modalContent}
      </KeyboardAvoidingView>
    </RNModal>
  );
};

export const AlertModal = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info', // 'info', 'success', 'warning', 'danger'
  icon,
}) => {
  const typeConfig = {
    info: {
      icon: 'information-circle',
      color: colors.spO2Blue,
      gradient: [colors.spO2Blue, colors.spO2Blue],
    },
    success: {
      icon: 'checkmark-circle',
      color: colors.successGreen,
      gradient: [colors.successGreen, colors.successGreen],
    },
    warning: {
      icon: 'warning',
      color: colors.warningYellow,
      gradient: [colors.warningYellow, colors.warningYellow],
    },
    danger: {
      icon: 'alert-circle',
      color: colors.alertRed,
      gradient: [colors.alertRed, colors.alertRed],
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      showHeader={false}
      padding={24}
      width={320}
    >
      <View style={styles.alertContainer}>
        <LinearGradient
          colors={config.gradient}
          style={[styles.alertIconContainer, { backgroundColor: config.color }]}
        >
          <Ionicons name={icon || config.icon} size={40} color="white" />
        </LinearGradient>
        <Text style={styles.alertTitle}>{title}</Text>
        <Text style={styles.alertMessage}>{message}</Text>
        <View style={styles.alertButtons}>
          <Button
            title={cancelText}
            onPress={onClose}
            style={styles.alertCancelButton}
            outline
          />
          <Button
            title={confirmText}
            onPress={onConfirm}
            style={styles.alertConfirmButton}
            gradient
          />
        </View>
      </View>
    </Modal>
  );
};

export const BottomSheet = ({
  visible,
  onClose,
  title,
  children,
  height: sheetHeight = height * 0.5,
}) => (
  <Modal
    visible={visible}
    onClose={onClose}
    position="bottom"
    animationType="slide"
    width={width}
    maxWidth={width}
    padding={0}
    closeOnBackdropPress
  >
    <View style={[styles.bottomSheet, { height: sheetHeight }]}>
      <View style={styles.bottomSheetHandle} />
      {title && <Text style={styles.bottomSheetTitle}>{title}</Text>}
      <ScrollView style={styles.bottomSheetContent}>{children}</ScrollView>
    </View>
  </Modal>
);

export const ActionSheet = ({ visible, onClose, options, cancelText = 'Cancel' }) => (
  <Modal
    visible={visible}
    onClose={onClose}
    position="bottom"
    animationType="slide"
    width={width}
    maxWidth={width}
    padding={0}
    closeOnBackdropPress
  >
    <View style={styles.actionSheet}>
      <View style={styles.actionSheetHandle} />
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.actionSheetButton,
            index === options.length - 1 && styles.actionSheetLastButton,
          ]}
          onPress={() => {
            option.onPress();
            onClose();
          }}
        >
          {option.icon && (
            <Ionicons
              name={option.icon}
              size={20}
              color={option.color || colors.textPrimary}
              style={styles.actionSheetIcon}
            />
          )}
          <Text style={[styles.actionSheetText, { color: option.color || colors.textPrimary }]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.actionSheetCancel} onPress={onClose}>
        <Text style={styles.actionSheetCancelText}>{cancelText}</Text>
      </TouchableOpacity>
    </View>
  </Modal>
);

export const ImageViewerModal = ({ visible, onClose, imageUrl, title }) => (
  <Modal
    visible={visible}
    onClose={onClose}
    position="center"
    animationType="fade"
    transparent={true}
    blurBackdrop={true}
    showHeader={false}
    width={width}
    maxWidth={width}
  >
    <View style={styles.imageViewer}>
      {title && <Text style={styles.imageViewerTitle}>{title}</Text>}
      <Image source={{ uri: imageUrl }} style={styles.imageViewerImage} />
      <TouchableOpacity style={styles.imageViewerClose} onPress={onClose}>
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>
    </View>
  </Modal>
);

export const LoadingModal = ({ visible, message }) => (
  <Modal
    visible={visible}
    onClose={() => {}}
    position="center"
    animationType="fade"
    showHeader={false}
    closeOnBackdropPress={false}
    width={200}
  >
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primarySaffron} />
      {message && <Text style={styles.loadingMessage}>{message}</Text>}
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    width: 40,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    width: 40,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  footer: {
    marginTop: 16,
  },
  alertContainer: {
    alignItems: 'center',
  },
  alertIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  alertMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  alertButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  alertCancelButton: {
    flex: 1,
    marginRight: 8,
  },
  alertConfirmButton: {
    flex: 1,
    marginLeft: 8,
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  bottomSheetTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  bottomSheetContent: {
    flex: 1,
  },
  actionSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  actionSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  actionSheetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  actionSheetLastButton: {
    borderBottomWidth: 0,
  },
  actionSheetIcon: {
    marginRight: 12,
  },
  actionSheetText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  actionSheetCancel: {
    marginTop: 8,
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  actionSheetCancelText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.alertRed,
  },
  imageViewer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: 'white',
    marginBottom: 16,
  },
  imageViewerImage: {
    width: width * 0.9,
    height: height * 0.6,
    borderRadius: 12,
  },
  imageViewerClose: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingMessage: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
    marginTop: 12,
  },
});

export default Modal;