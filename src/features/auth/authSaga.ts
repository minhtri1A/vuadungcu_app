import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Message } from 'const/index';
import DeviceInfo from 'react-native-device-info';
import { LoginManager } from 'react-native-fbsdk-next';
import RNRestart from 'react-native-restart';
import { call, put, takeLatest } from 'redux-saga/effects';
import { services } from 'services';
import {
    AUTH_FAILED,
    AUTH_SUCCESS,
    LOGOUT_CURRENT_USER,
    LOGOUT_CURRENT_USER_SUCCESS,
    SET_USER_LOGIN,
    SIGNIN_WITH_ACCOUNT,
    SIGNIN_WITH_APPLE,
    SIGNIN_WITH_FACEBOOK,
    SIGNIN_WITH_GOOGLE,
} from './../action';

function* customerAuth(action: any): any {
    const { username, password } = action.payload;
    try {
        const resultToken = yield call(services.customer.loginUser, {
            username,
            password,
        });
        if (resultToken) {
            yield call(authSuccess, resultToken, username);
        }
    } catch (error) {
        yield call(authFailed, error);
    }
}

function* googleAuth(action: any): any {
    try {
        const { idToken, referral_code, email } = action.payload;

        if (idToken) {
            const resultToken = yield call(services.customer.loginUser, {
                provider: 'google',
                provider_token: idToken,
                referral_code: referral_code,
            });
            yield call(authSuccess, resultToken, email);
        }
    } catch (error) {
        yield call(authFailed, error);
    }
}

function* facebookAuth(action: any): any {
    try {
        const { username, provider_token, referral_code } = action.payload || {};
        const resultToken = yield call(services.customer?.loginUser, {
            provider: 'facebook',
            provider_token,
            referral_code,
        });

        yield call(authSuccess, resultToken, username);
    } catch (error) {
        yield call(authFailed, error);
    }
}

function* appleAuth(action: any): any {
    try {
        const { username, provider_key, provider_token, referral_code } = action.payload || {};
        const resultToken = yield call(services.customer.loginUser, {
            provider: 'apple',
            provider_key,
            provider_token,
            referral_code,
        });

        yield call(authSuccess, resultToken, username);
    } catch (error) {
        console.log('ERROR apple auth saga ', error);
        yield call(authFailed, error);
    }
}

function* setUserLogin(action: any): any {
    try {
        //set token state if user logged
        const { token } = action.payload;
        yield put(AUTH_SUCCESS({ token }));
    } catch (error) {
        console.log('ERROR set user login');
    }
}

function* authSuccess(token: any, username?: any): any {
    if (token) {
        services.setTokenLocal(token);
        yield put(AUTH_SUCCESS({ token, username }));
        //register or update device

        const fcmToken = yield call(getToken);
        const deviceId = yield call(DeviceInfo.getUniqueId);
        const deviceName = yield call(DeviceInfo.getDeviceName);

        const result = yield call(services.admin.registerDevice, fcmToken, {
            device_unique_id: deviceId,
            device_name: deviceName,
        });

        if (result.code === 'SUCCESS') {
            AsyncStorage.setItem('@fcm_token_expired', `${result.fcm_token_expired}`);
        }
    }
}

const getToken = async () => {
    return await messaging().getToken();
};

function* authFailed(error: any): any {
    console.log('error auth ', error);
    const { status, title } = error || {};
    if (status === 401 && title === 'invalid_grant') {
        yield put(AUTH_FAILED({ message: Message.AUTH_INVALID_GRANT }));
    } else if (status === 401 && title === 'exists_email') {
        yield put(AUTH_FAILED({ message: Message.AUTH_SOCIAL_EXISTS_EMAIL }));
    } else if (status === 400 && title === 'user_deleted') {
        yield put(AUTH_FAILED({ message: Message.AUTH_USER_DELETED }));
    } else {
        yield put(AUTH_FAILED({ message: Message.AUTH_OTHER_ERROR }));
    }
    // yield put(AUTH_FAILED(status.ERROR));
}

export function* logoutCurrentUser(autoNavigation = true): any {
    try {
        //set device auth of user is false
        //clear token
        yield call(AsyncStorage.removeItem, '@token');
        services.setAccessToken(null);
        //signout google if login google
        yield call(GoogleSignin.signOut);
        //signout facebook if login facebook
        yield call(LoginManager.logOut);
        //get token app
        const tokenAppApi = yield call(services.fetchTokenApp);
        if (tokenAppApi && autoNavigation) {
            //reset state
            yield put({ type: LOGOUT_CURRENT_USER_SUCCESS });
            RNRestart.Restart();
        } else if (tokenAppApi) {
            yield put({ type: LOGOUT_CURRENT_USER_SUCCESS });
        }
    } catch (error) {
        console.log('ERROR logout failed', error);
    }
}

export default function* watcherSaga() {
    yield takeLatest(SIGNIN_WITH_ACCOUNT, customerAuth);
    yield takeLatest(SET_USER_LOGIN, setUserLogin);
    yield takeLatest(LOGOUT_CURRENT_USER, logoutCurrentUser);
    yield takeLatest(SIGNIN_WITH_GOOGLE, googleAuth);
    yield takeLatest(SIGNIN_WITH_FACEBOOK, facebookAuth);
    yield takeLatest(SIGNIN_WITH_APPLE, appleAuth);
}
