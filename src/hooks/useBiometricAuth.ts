/* eslint-disable react-hooks/exhaustive-deps */
import * as Keychain from 'react-native-keychain';

const BIOMETRIC_CREDENTIALS_KEY = 'biometric_vdc_app_key';
const BIOMETRIC_FLAG_KEY = 'biometric_username_marker';

export const useBiometricAuth = () => {
    const checkBiometricSupport = async () => {
        const supported = await Keychain.getSupportedBiometryType();
        // trả về: 'FaceID', 'TouchID', 'Biometrics', hoặc null
        return supported;
    };

    const saveCredentialsWithBiometric = async (username: string, password: string) => {
        return Keychain.setGenericPassword(username, password, {
            accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
            accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
            service: BIOMETRIC_CREDENTIALS_KEY,
        });
    };

    const loadCredentialsWithBiometric = async () => {
        try {
            const credentials = await Keychain.getGenericPassword({
                authenticationPrompt: {
                    title: 'Xác thực sinh trắc học để đăng nhập',
                    subtitle: 'Vui lòng xác thực để truy cập tài khoản',
                    description: '',
                    cancel: 'Huỷ',
                },
                service: BIOMETRIC_CREDENTIALS_KEY,
            });

            if (credentials) {
                const { username, password } = credentials;
                return { username, password };
            }

            throw '';
        } catch (error) {
            return null;
        }
    };

    const saveBiometricUsernameFlag = async (username: string) => {
        return await Keychain.setInternetCredentials(BIOMETRIC_FLAG_KEY, 'username', username);
    };

    const getBiometricUsernameFlag = async (): Promise<string | null> => {
        try {
            const creds = await Keychain.getInternetCredentials(BIOMETRIC_FLAG_KEY);
            return creds ? creds?.password : null;
        } catch (error) {
            console.warn('Failed to get biometric flag:', error);
            return null;
        }
    };

    const clearCredentials = async () => {
        try {
            await Keychain.resetGenericPassword({ service: BIOMETRIC_CREDENTIALS_KEY });
            await Keychain.resetInternetCredentials({
                server: BIOMETRIC_FLAG_KEY,
            });
        } catch (error) {
            console.log('Failed to clear biometric flag:', error);
        }
    };

    return {
        checkBiometricSupport,
        saveCredentialsWithBiometric,
        loadCredentialsWithBiometric,
        saveBiometricUsernameFlag,
        getBiometricUsernameFlag,
        clearCredentials,
    };
};
