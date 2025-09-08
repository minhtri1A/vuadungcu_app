import Button from 'components/Button';
import { GoogleSignin } from 'config';
import { useAppDispatch, useTheme } from 'hooks';
import useUser from 'hooks/handle/useUser';
import useReferralInfoSwr from 'hooks/swr/referral/useReferrarInfoSwr';
import React, { memo } from 'react';
import { Image, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { sendSentryError } from 'utils/storeHelpers';
import useCommonStyles from './styles';
import Touch from 'components/Touch';
import { Icon } from '@rneui/themed';
import Text from 'components/Text';

const SigninGoogle = memo(function SigninGoogle() {
    //hooks
    const dispatch = useAppDispatch();
    const { theme } = useTheme();
    const styles = useCommonStyles();
    const { login } = useUser();
    //swr
    const { referral } = useReferralInfoSwr();

    const signinGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userGoogleInfo = await GoogleSignin.signIn();
            login(
                'google',
                {
                    provider: 'google',
                    provider_token: userGoogleInfo.data?.idToken || '',
                    referral_code: referral?.referral_code,
                },
                userGoogleInfo.data?.user.email
            );
        } catch (error) {
            showMessage({
                message: 'Đã xảy ra lỗi đăng nhập google. Xin vui lòng thử lại!',
                icon: 'danger',
            });
            sendSentryError(error, 'signinGoogle');
        }
    };

    return (
        <Touch
            style={styles.touch_social}
            bW={0.8}
            bC={theme.colors.grey_[300]}
            onPress={signinGoogle}
        >
            <Icon
                type="ionicon"
                name="logo-google"
                color={theme.colors.red[500]}
                size={theme.typography.size(18)}
            />
            <Text color={theme.colors.red[500]} fw="bold">
                Google
            </Text>
        </Touch>
    );
});

export default SigninGoogle;
