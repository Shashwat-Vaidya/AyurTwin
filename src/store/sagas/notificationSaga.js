import { put, takeLatest, call, delay, select } from 'redux-saga/effects';
import * as Notifications from 'expo-notifications';
import localNotifications from '../../services/notifications/localNotifications';
import pushNotifications from '../../services/notifications/pushNotifications';
import { addAlert } from '../slices/alertsSlice';

function* handleNotificationReceived(action) {
  try {
    const { notification } = action.payload;
    const { data } = notification.request.content;
    
    if (data.type === 'health_alert') {
      yield put(addAlert(data));
    }
    
    // Log notification received
    console.log('Notification received:', data);
  } catch (error) {
    console.error('Error handling notification:', error);
  }
}

function* handleNotificationResponse(action) {
  try {
    const { response } = action.payload;
    const { data } = response.notification.request.content;
    
    // Navigate based on notification data
    if (data.screen) {
      // Navigate to screen
    }
    
    // Mark notification as opened
    yield call(localNotifications.markAsOpened, data.notificationId);
  } catch (error) {
    console.error('Error handling notification response:', error);
  }
}

function* handleScheduleReminder(action) {
  try {
    const { reminder } = action.payload;
    yield call(localNotifications.scheduleReminder, reminder);
  } catch (error) {
    console.error('Error scheduling reminder:', error);
  }
}

function* handleCancelNotification(action) {
  try {
    const { notificationId } = action.payload;
    yield call(localNotifications.cancelNotification, notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
}

function* handleCheckPermissions() {
  try {
    const settings = yield call(Notifications.getPermissionsAsync);
    return settings;
  } catch (error) {
    console.error('Error checking permissions:', error);
    return null;
  }
}

function* watchNotifications() {
  yield takeLatest('NOTIFICATION_RECEIVED', handleNotificationReceived);
  yield takeLatest('NOTIFICATION_RESPONSE', handleNotificationResponse);
  yield takeLatest('SCHEDULE_REMINDER', handleScheduleReminder);
  yield takeLatest('CANCEL_NOTIFICATION', handleCancelNotification);
  yield takeLatest('CHECK_NOTIFICATION_PERMISSIONS', handleCheckPermissions);
}

export default function* notificationSaga() {
  yield watchNotifications();
}