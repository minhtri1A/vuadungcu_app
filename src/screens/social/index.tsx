/* eslint-disable react-hooks/exhaustive-deps */
import auth from '@react-native-firebase/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { Icon } from '@rneui/themed';
import Header from 'components/Header2';
import Switch from 'components/Switch';
import Text from 'components/Text';
import Title from 'components/Title';
import { GoogleSignin, appleAuthConfig } from 'config';
import { useCustomerSwr, useTheme } from 'hooks';
import { isEmpty } from 'lodash';
import React, { memo, useEffect } from 'react';
import Config from 'react-native-config';
import { AccessToken, LoginManager, Settings } from 'react-native-fbsdk-next';
import { sendSentryError } from 'utils/storeHelpers';

interface Props {
    navigation: StackNavigationProp<any, any>;
}

export default memo(function SocialScreen({}: Props) {
    //hook
    const { theme } = useTheme();
    //swr
    const {
        customers: { id_google, id_apple, id_facebook, username },
        updateOrAddCustomerInfo,
        mutate,
    } = useCustomerSwr('all', { revalidateOnMount: false });
    //value

    //not exists mutate
    useEffect(() => {
        if (isEmpty(username)) {
            mutate();
        }
    }, [username]);

    //link with facebook
    const handleAccountLinkWithFacebook = async () => {
        //if user unlinked facebook then handle
        if (isEmpty(id_facebook)) {
            try {
                Settings.initializeSDK();
                await LoginManager.logInWithPermissions(['public_profile', 'email']);
                /* limited */
                // let token: any = '';
                // if (Platform.OS === 'ios') {
                //     const resultToken = await AuthenticationToken.getAuthenticationTokenIOS();
                //     token = resultToken?.authenticationToken;
                // } else {
                //     const resultToken = await AccessToken.getCurrentAccessToken();
                //     token = resultToken?.accessToken;
                // }
                /* normal */
                const resultToken = await AccessToken.getCurrentAccessToken();
                const token = resultToken?.accessToken;
                updateOrAddCustomerInfo('facebook', { provider_token: token });
            } catch (error) {
                sendSentryError(error, 'handleAccountLinkWithFacebook**');
            }
        }
    };

    //link with google
    const handleAccountLinkWithGoogle = async () => {
        try {
            //if user unlinked google then handle
            if (isEmpty(id_google)) {
                await GoogleSignin.hasPlayServices();
                const userGoogleInfo: any = await GoogleSignin.signIn();
                if (userGoogleInfo) {
                    // dispatch(
                    //     PUT_CUSTOMER_INFO({
                    //         type: 'google',
                    //         data: { provider_token: userGoogleInfo.idToken },
                    //     })
                    // );
                    updateOrAddCustomerInfo('google', { provider_token: userGoogleInfo.idToken });
                    return;
                }

                throw userGoogleInfo;
            }
        } catch (error) {
            sendSentryError(error, 'handleAccountLinkWithGoogle');
        }
    };
    //link apple
    const handleAccountLinkWithApple = async () => {
        try {
            //get token apple
            const response: any = await appleAuthConfig();
            //get token firebase
            const appleCredential = auth.AppleAuthProvider.credential(
                response.id_token,
                response.nonce
            );
            //get token firebase
            const resultFirebase = await (await auth().signInWithCredential(appleCredential)).user;
            const token = await resultFirebase.getIdToken();
            //link account api ntl
            if (token) {
                updateOrAddCustomerInfo('apple', {
                    provider_key:
                        Config.REACT_NATIVE_APP_IS_MODE === 'dev'
                            ? Config.REACT_NATIVE_APP_FIREBASE_KEY_DEV
                            : Config.REACT_NATIVE_APP_FIREBASE_KEY_PROD,
                    provider_token: token,
                });
                return;
            }
            throw token;
        } catch (error) {
            sendSentryError(error, 'handleAccountLinkWithApple');
        }
    };

    return (
        <>
            <Header
                center={
                    <Text size={'title2'} ta="center">
                        Liên kết mạng xã hội
                    </Text>
                }
                showGoBack
                iconGoBackColor={theme.colors.black_[10]}
                bgColor={theme.colors.white_[10]}
                statusBarColor={theme.colors.main['600']}
            />
            {/* facebook */}
            <Title
                dividerBottom
                IconLeft={
                    <Icon
                        type="ionicon"
                        name="logo-facebook"
                        color={theme.colors.blue['500']}
                        style={{ borderRadius: 5 }}
                        size={theme.typography.title3}
                    />
                }
                titleLeft="Facebook"
                titleRight={!isEmpty(id_facebook) ? 'Đã liên kết' : undefined}
                titleRightProps={{ color: theme.colors.main['600'] }}
                titleLeftProps={{ ml: 'small' }}
                IconRight={
                    <Switch
                        value={!isEmpty(id_facebook) ? true : false}
                        onChange={handleAccountLinkWithFacebook}
                    />
                }
            />

            {/* google */}
            <Title
                dividerBottom
                IconLeft={
                    <Icon
                        type="ionicon"
                        name="logo-google"
                        color={theme.colors.white_[10]}
                        backgroundColor={'#D6492F'}
                        style={{ borderRadius: 5 }}
                    />
                }
                titleLeft="Google"
                titleRight={!isEmpty(id_google) ? 'Đã liên kết' : undefined}
                titleRightProps={{ color: theme.colors.main['600'] }}
                titleLeftProps={{ ml: 'small' }}
                IconRight={
                    <Switch
                        value={!isEmpty(id_google) ? true : false}
                        onChange={handleAccountLinkWithGoogle}
                    />
                }
            />
            {/* apple */}
            <Title
                dividerBottom
                IconLeft={
                    <Icon
                        type="ionicon"
                        name="logo-apple"
                        color={theme.colors.white_[10]}
                        backgroundColor={theme.colors.slate[900]}
                        style={{ borderRadius: 5 }}
                    />
                }
                titleLeft="Apple"
                titleRight={!isEmpty(id_apple) ? 'Đã liên kết' : undefined}
                titleRightProps={{ color: theme.colors.main['600'] }}
                titleLeftProps={{ ml: 'small' }}
                IconRight={
                    <Switch
                        value={!isEmpty(id_apple) ? true : false}
                        onChange={handleAccountLinkWithApple}
                    />
                }
            />

            {/* loading */}
        </>
    );
});
