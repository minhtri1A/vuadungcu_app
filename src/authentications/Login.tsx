import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from 'components/Header';
import Image from 'components/Image';
import Loading from 'components/Loading';
import Text from 'components/Text';
import View from 'components/View';
import Status from 'const/status';
import withAuth from 'hoc/withAuth';
import { AuthStackParamsList } from 'navigation/type';
import React, { memo, useEffect, useState } from 'react';
import { Linking, ScrollView } from 'react-native';
import Config from 'react-native-config';
import { showMessage } from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { AUTH_FAILED, REGISTER_ACCOUNT_FAILED } from '../features/action';
import { getMessage, useAppDispatch, useAppSelector, useTheme } from '../hooks';
import { Message } from '../const';
import SigninApple from './SigninApple';
import SigninFacebook from './SigninFacebook';
import SigninGoogle from './SigninGoogle';
import SigninUser from './SigninUser';
import useStyles from './styles';
import Touch from 'components/Touch';
import { NAVIGATION_TO_REGISTER_SCREEN } from 'const/routes';
/* eslint-disable react-hooks/exhaustive-deps */

interface Props {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<AuthStackParamsList, 'LoginScreen'>;
}

const Login = memo(({ navigation }: Props) => {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles();
    const dispatch = useAppDispatch();
    //value
    const [customerUsername, setCustomerUsername] = useState('');
    const { statusSignin, message } = useAppSelector((state) => state.auth);
    const registerState = useAppSelector((state) => state.account.register);
    const messagehLogin = getMessage(message);
    const messagehRegister = getMessage(registerState.message, {
        telephone: registerState.telephone_,
    });

    //message login and register
    useEffect(() => {
        if (statusSignin === Status.ERROR || registerState.statusRegister === Status.SUCCESS) {
            showMessage({
                message: messagehLogin || messagehRegister,
                // type: registerState.statusRegister === Status.SUCCESS ? 'success' : 'warning',
                icon: registerState.statusRegister === Status.SUCCESS ? 'success' : 'warning',
                onHide: () => {
                    dispatch(AUTH_FAILED({ status: Status.DEFAULT, message: Message.NOT_MESSAGE }));
                    if (registerState.statusRegister === Status.SUCCESS) {
                        dispatch(
                            REGISTER_ACCOUNT_FAILED({
                                status: Status.DEFAULT,
                                message: Message.NOT_MESSAGE,
                            })
                        );
                    }
                },
            });
        }
    }, [statusSignin, registerState]);

    //message change username
    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                const usernameLocal = await AsyncStorage.getItem('@customer-username');
                if (usernameLocal) {
                    const { username } = JSON.parse(usernameLocal);
                    setCustomerUsername(username);
                    showMessage({
                        message: `Bạn đã chỉnh sửa thành công tài khoản ${username}, bạn vui lòng đăng nhập lại để hoàn tất quá trình chỉnh sửa và tiếp tục sử dụng dịch vụ. Xin cảm ơn !`,
                        type: 'success',
                        onHide: () => {
                            AsyncStorage.removeItem('@customer-username');
                        },
                        duration: 8000,
                    });
                }
            })();
            return () => {
                setCustomerUsername('');
            };
        }, [])
    );
    //goback
    const goBack = () => {
        navigation.goBack();
    };
    const goRegister = () => {
        navigation.navigate(NAVIGATION_TO_REGISTER_SCREEN);
    };

    return (
        <View style={styles.view_loginContainer}>
            <Loading visible={statusSignin === Status.LOADING} text={'Đang xử lý...'} />
            <Header
                leftComponent={
                    <Icon
                        name="close-outline"
                        color={theme.colors.main['600']}
                        onPress={goBack}
                        size={theme.typography.title4}
                    />
                }
                backgroundColor={theme.colors.white_[10]}
            />
            {/* end-loading */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.view_loginHeader}>
                    {/* <IconsCustom
                        name={'logo-ntl'}
                        size={theme.typography.title4}
                        color={theme.colors.main["600"]}
                    /> */}
                    <View w={'40%'} ratio={373 / 238}>
                        <Image
                            source={require('asset/img_icon_vdc_black.png')}
                            resizeMode="stretch"
                        />
                    </View>

                    <Text size={'sub2'}>Đối tác toàn diện Ngô Thành Lợi</Text>
                </View>
                <View gap={theme.spacings.extraLarge} p={theme.spacings.medium}>
                    {/* signin user */}
                    <SigninUser
                        username={
                            customerUsername !== '' ? customerUsername : registerState.telephone_
                        }
                    />
                    {/* border orther */}
                    <View style={styles.createBorder}>
                        <View style={styles.borders} />
                        <Text style={styles.txtOtherLogin}>Hoặc</Text>
                        <View style={styles.borders} />
                    </View>
                    {/* register */}
                    <View jC="center" aI="center">
                        <Touch activeOpacity={0.6} onPress={goRegister}>
                            <Text color={theme.colors.main['600']} tD="underline">
                                Đăng ký tài khoản mới
                            </Text>
                        </Touch>
                    </View>
                    {/* signin social */}
                    <View flexDirect="row" gap={theme.spacings.medium}>
                        <SigninGoogle />
                        <SigninFacebook />
                        <SigninApple />
                    </View>

                    {/* accept policy */}
                    <View aI="center" jC="center">
                        <Text>
                            Bằng việc đăng nhập / đăng ký tài khoản, bạn đã đồng ý với{' '}
                            <Text
                                onPress={() => {
                                    Linking.openURL(
                                        `${Config.REACT_NATIVE_APP_APP_SCHEME}help-center/general`
                                    );
                                }}
                                tD="underline"
                                color={theme.colors.blue['500']}
                            >
                                điều khoản sử dụng
                            </Text>{' '}
                            và{' '}
                            <Text
                                onPress={() => {
                                    Linking.openURL('https://vuadungcu.com/help-center/privacy');
                                }}
                                tD="underline"
                                color={theme.colors.blue['500']}
                            >
                                chính sách sách bảo mật
                            </Text>{' '}
                            của Vua dụng cụ.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
});

export default withAuth(Login, false);
// export default Login;
