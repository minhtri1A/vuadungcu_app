import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { notifyConfigs } from 'config';
import { AppConstants } from 'const/index';
import { SET_APP_START, SET_USER_LOGIN } from 'features/action';
import DeviceInfo from 'react-native-device-info';
import { services } from '../services';
import { sendSentryError } from './storeHelpers';

console.log('on app start ');

//lấy token remote, đăng ký token vào topics và lưu vào database
async function onAppBootstrap() {
    try {
        // statedApp kiem tra xin quyen lan dau trong home - de tranh bi loi khi xin quyen ben ios
        const statedApp = await AsyncStorage.getItem('@started-app');
        if (statedApp === 'YES') {
            if (!messaging().isDeviceRegisteredForRemoteMessages) {
                await messaging().registerDeviceForRemoteMessages();
            }
            if (messaging().isDeviceRegisteredForRemoteMessages) {
                const fcmToken = await messaging().getToken();
                if (!fcmToken) {
                    throw new Error('Failed to get FCM token');
                }

                //kiểm tra xem register-device-expires hết hạn thì cập nhật lại
                const fcmTokenExpired = await AsyncStorage.getItem('@fcm_token_expired');
                const now = Date.now();

                //neu fcmTokenExpired het han thi gui update lai device
                if (fcmTokenExpired && parseInt(fcmTokenExpired) * 1000 < now) {
                    const deviceId = await DeviceInfo.getUniqueId();
                    const deviceName = await DeviceInfo.getDeviceName();
                    await services.admin.registerDevice(fcmToken, {
                        device_unique_id: deviceId,
                        device_name: deviceName,
                    });
                }
                // messaging()
                //     .subscribeToTopic('ntl')
                //     .then(() => console.log('Subscribed to topic!'));
                return fcmToken;
            }
        }
        return '';
    } catch (error) {
        sendSentryError(error, 'onAppBootstrap');
    }
}
//xử lý thông báo remote notify title title title title title title title title  😀 😃 😄
export async function onForegroundMessageReceived(message: any) {
    try {
        if (message.data) {
            const data = JSON.parse(message.data.data);
            if (data.foreground !== false) {
                await notifyConfigs.onShowNotification(JSON.parse(message.data.data));
            }
        }
    } catch (error) {
        console.log('ERROR onMessageReceived - onAppStart', error);
        sendSentryError(error, 'onMessageReceived');
    }
}

export const onAppStart = async (store: any) => {
    try {
        // SplashScreen.hide();
        const start = await services.init(store);
        onAppBootstrap();
        if (start) {
            //get token succeess
            store.dispatch({ type: SET_APP_START.type, payload: true });
            //handle login user
            if (start === AppConstants.APP_START_USER_SUCCESS) {
                const token = await services.getTokenLocal();
                store.dispatch({ type: SET_USER_LOGIN, payload: { token } });
            }
            //update cms_page
            // const dataConfigs = getConfigCmsPage();
            // const resultCmsPage = await services.admin.updateCmsPageConfig(dataConfigs);
            // console.log('result update cms page ', resultCmsPage);
            // console.log('dataConfigs update cms page ', dataConfigs.length);
        }
    } catch (error) {
        sendSentryError(error, 'onAppStart');
    }
};

messaging().onMessage(onForegroundMessageReceived);
