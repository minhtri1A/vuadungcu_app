import { appleAuth, appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import { Platform } from 'react-native';
import { Config } from 'react-native-config';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';

const appleAuthConfig = async () => {
    let response: any = null;
    if (Platform.OS === 'android') {
        appleAuthAndroid.configure({
            clientId: 'com.vuadungcuservice',
            redirectUri:
                Config.REACT_NATIVE_APP_IS_MODE === 'dev'
                    ? 'https://ngothanhloicomtest.firebaseapp.com/__/auth/handler'
                    : 'https://vuadungcucom.firebaseapp.com/__/auth/handler',
            responseType: appleAuthAndroid.ResponseType.ALL,
            scope: appleAuthAndroid.Scope.ALL,
            nonce: uuid(),
            state: uuid(),
        });
        response = await appleAuthAndroid.signIn();
    } else if (Platform.OS === 'ios') {
        response = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
            nonce: uuid(),
            state: uuid(),
        });
    }
    return response;
};

export default appleAuthConfig;
