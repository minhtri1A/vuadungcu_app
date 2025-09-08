/* eslint-disable react-native/no-inline-styles */
import Button from 'components/Button';
import { useTheme } from 'hooks';
import useUser from 'hooks/handle/useUser';
import useReferralInfoSwr from 'hooks/swr/referral/useReferrarInfoSwr';
import React, { memo } from 'react';
import { View } from 'react-native';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import { sendSentryError } from 'utils/storeHelpers';
import useCommonStyles from './styles';
import Touch from 'components/Touch';
import Text from 'components/Text';
import { Icon } from '@rneui/themed';
/* eslint-disable react-hooks/exhaustive-deps */

export default memo(function SigninFacebook() {
    //hook
    const { theme } = useTheme();
    const styles = useCommonStyles();
    const { login } = useUser();

    //value
    //swr
    const { referral } = useReferralInfoSwr();

    const signinFacebook = async () => {
        try {
            //login facebook
            await LoginManager.logInWithPermissions(['public_profile', 'email']);
            /* limited */
            // if (Platform.OS === 'ios') {
            //     const resultToken = await AuthenticationToken.getAuthenticationTokenIOS();
            //     dispatchLoginFacebook(resultToken?.authenticationToken);
            // } else {
            //     const resultToken = await AccessToken.getCurrentAccessToken();
            //     dispatchLoginFacebook(resultToken?.accessToken);
            // }
            /* normal */
            const resultToken = await AccessToken.getCurrentAccessToken();
            login('facebook', {
                provider: 'facebook',
                provider_token: resultToken?.accessToken || '',
                referral_code: referral?.referral_code,
            });
        } catch (error) {
            sendSentryError(error, 'signinFacebook');
        }
    };

    return (
        <Touch
            style={styles.touch_social}
            bW={0.8}
            bC={theme.colors.grey_[300]}
            onPress={signinFacebook}
        >
            <Icon
                type="ionicon"
                name="logo-facebook"
                color={theme.colors.blue[500]}
                size={theme.typography.size(18)}
            />
            <Text color={theme.colors.blue[500]} fw="bold">
                Facebook
            </Text>
        </Touch>
    );
});
