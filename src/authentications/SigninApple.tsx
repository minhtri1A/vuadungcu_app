import React, { memo } from 'react';
import Config from 'react-native-config';
// import { appleAuthAndroid } from 'config';
import auth from '@react-native-firebase/auth';
import { Icon } from '@rneui/themed';
import Text from 'components/Text';
import Touch from 'components/Touch';
import { appleAuthConfig } from 'config';
import { useTheme } from 'hooks';
import useUser from 'hooks/handle/useUser';
import useReferralInfoSwr from 'hooks/swr/referral/useReferrarInfoSwr';
import { Platform } from 'react-native';
import 'react-native-get-random-values';
import { sendSentryError } from 'utils/storeHelpers';
import useCommonStyles from './styles';
export default memo(function SigninApple() {
    //hooks
    const { theme } = useTheme();
    const styles = useCommonStyles();
    const { login } = useUser();
    //swr
    const { referral } = useReferralInfoSwr();

    const signApple = async () => {
        try {
            /* sign apple - co */
            const response = await appleAuthConfig();
            const idToken = Platform.OS === 'android' ? response.id_token : response.identityToken;
            /* handle with firebase */
            //create credential
            const appleCredential = auth.AppleAuthProvider.credential(idToken, response.nonce);
            //auth with credential - ERROR
            const resultFirebase = await (await auth().signInWithCredential(appleCredential)).user;
            const email: any = resultFirebase.email;
            const token: any = await resultFirebase.getIdToken();
            login(
                'apple',
                {
                    provider_token: token,
                    provider_key:
                        Config.REACT_NATIVE_APP_IS_MODE === 'dev'
                            ? (Config.REACT_NATIVE_APP_FIREBASE_KEY_DEV as string)
                            : (Config.REACT_NATIVE_APP_FIREBASE_KEY_PROD as string),
                    provider: 'apple',
                    referral_code: referral?.referral_code,
                },
                email
            );
        } catch (error) {
            sendSentryError(error, 'signApple');
        }
    };

    return (
        <Touch
            style={styles.touch_social}
            bW={0.8}
            bC={theme.colors.grey_[300]}
            onPress={signApple}
        >
            <Icon
                type="ionicon"
                name="logo-apple"
                color={theme.colors.grey_[600]}
                size={theme.typography.size(18)}
            />
            <Text color={theme.colors.grey_[600]} fw="bold">
                Apple
            </Text>
        </Touch>
    );
});
