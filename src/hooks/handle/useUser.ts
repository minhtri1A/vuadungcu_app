import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { setUser } from '@sentry/react-native';
import { Message } from 'const/index';
import { AUTH_SUCCESS, LOGOUT_CURRENT_USER_SUCCESS } from 'features/action';
import { useBiometricAuth } from 'hooks/useBiometricAuth';
import { useAppDispatch } from 'hooks/useCommon';
import { DataLoginType } from 'models';
import DeviceInfo from 'react-native-device-info';
import { LoginManager } from 'react-native-fbsdk-next';
import { showMessage } from 'react-native-flash-message';
import RNRestart from 'react-native-restart';
import { services } from 'services';
import { isEmpty } from 'utils/helpers';
import showLoadingApp from 'utils/showLoadingApp';
import showMessageApp from 'utils/showMessageApp';
import { sendSentryError } from 'utils/storeHelpers';

export default function useUser() {
    //hooks
    const dispatch = useAppDispatch();
    const { getBiometricUsernameFlag, clearCredentials } = useBiometricAuth();
    //state

    const login = async <K extends keyof DataLoginType>(
        action: K,
        data: DataLoginType[K],
        username?: string,
        isBiometric?: boolean
    ) => {
        let isSuccess = false;
        try {
            showLoadingApp(true, 'Đang xử lý');
            const result = await services.customer.login(data, action);
            if (result?.access_token) {
                services.setTokenLocal(result);
                dispatch(AUTH_SUCCESS({ token: result, username }));
                isSuccess = true;
            } else {
                throw '';
            }
        } catch (error: any) {
            const { status, title } = error || {};
            if (status === 401 && title === 'invalid_grant') {
                showMessageApp(Message.AUTH_INVALID_GRANT);
                // clear biometric when username or password change
                if (isBiometric) {
                    await clearCredentials();
                }
            } else if (status === 401 && title === 'exists_email') {
                showMessageApp(Message.AUTH_SOCIAL_EXISTS_EMAIL);
            } else if (status === 400 && title === 'user_deleted') {
                showMessageApp(Message.AUTH_USER_DELETED);
            } else {
                showMessageApp(Message.AUTH_OTHER_ERROR);
                sendSentryError(error, 'Login - other error');
            }
            return;
        } finally {
            showLoadingApp(false);
        }

        // get customer info
        try {
            const response = await services.customer.getCustomers('all');
            const usernameFlag = await getBiometricUsernameFlag(); // set sentry user local
            console.log('username res ', response?.username);
            console.log('username biometric ', usernameFlag);

            if (response?.username) {
                AsyncStorage.setItem('@current-customer', JSON.stringify(response));
                setUser({
                    fullname: `${response?.firstname} ${response?.lastname}`,
                    telephone: response?.telephone || '',
                    username: response?.username,
                });
            }

            //check clear biometric - login other user
            if (usernameFlag && response?.username !== usernameFlag) {
                await clearCredentials();
            }
        } catch (error) {
            sendSentryError(error, 'Login - get sentry user');
        }

        // check guest user
        try {
            const guestAddress = await AsyncStorage.getItem('guest-address');
            if (isEmpty(guestAddress)) {
                const cartAddress = await services.customer.getCartAddress('shipping');
                AsyncStorage.setItem(
                    'guest-address',
                    JSON.stringify({
                        province: {
                            id: cartAddress.province_id,
                            name: cartAddress.province,
                        },
                        district: {
                            id: cartAddress.district_id,
                            name: cartAddress.district,
                        },
                        ward: {
                            id: cartAddress.ward_id,
                            name: cartAddress.ward,
                        },
                    })
                );
            }
        } catch (error) {
            sendSentryError(error, 'Login - Check guest user');
        }

        //register device
        try {
            if (isSuccess) {
                const fcmToken = await messaging().getToken();
                const deviceId = await DeviceInfo.getUniqueId();
                const deviceName = await DeviceInfo.getDeviceName();
                const result2 = await services.admin.registerDevice(fcmToken, {
                    device_unique_id: deviceId,
                    device_name: deviceName,
                });
                if (result2.code === 'SUCCESS') {
                    AsyncStorage.setItem('@fcm_token_expired', `${result2.fcm_token_expired}`);
                }
            }
        } catch (error) {
            sendSentryError(error, 'Login - register device');
        }
    };

    const logout = async (autoNavigation = true) => {
        try {
            showLoadingApp(true, 'Đang đăng xuất');
            await AsyncStorage.removeItem('@token');
            AsyncStorage.removeItem('@current-customer');
            services.setAccessToken(null);
            GoogleSignin.signOut();
            LoginManager.logOut();
            const tokenAppApi = await services.fetchTokenApp();
            if (tokenAppApi && autoNavigation) {
                //reset state
                RNRestart.Restart();
                return;
            }
            if (tokenAppApi) {
                dispatch({ type: LOGOUT_CURRENT_USER_SUCCESS });
                return;
            }
        } catch (error) {
            showMessage({
                message: 'Đã xảy ra lỗi khi đăng xuất. Xin vui lòng thử lại!',
                type: 'danger',
            });
        } finally {
            showLoadingApp(false);
        }
    };

    return {
        login,
        logout,
    };
}
