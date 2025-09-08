/* eslint-disable react-hooks/exhaustive-deps */
import { Icon, ListItem } from '@rneui/themed';
import BottomSheet from 'components/BottomSheet';
import Button from 'components/Button';
import Switch from 'components/Switch';
import Text from 'components/Text';
import TextInput from 'components/TextInput';
import Touch from 'components/Touch';
import View from 'components/View';
import {
    NAVIGATION_TO_EDIT_PASSWORD_SCREEN,
    NAVIGATION_TO_EDIT_REFERRAL_SCREEN,
} from 'const/routes';
import { useNavigate, useTheme } from 'hooks';
import { useBiometricAuth } from 'hooks/useBiometricAuth';
import { CustomerSwrType } from 'models';
import React, { memo, useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { services } from 'services';
import { themeType } from 'theme';
import { isEmpty } from 'utils/helpers';

interface Props {
    customerSwr: CustomerSwrType;
}

export default memo(function ExtraInfo({ customerSwr }: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const navigate = useNavigate();
    //stateßß
    //--biometric
    const {
        checkBiometricSupport,
        clearCredentials,
        saveCredentialsWithBiometric,
        saveBiometricUsernameFlag,
        getBiometricUsernameFlag,
    } = useBiometricAuth();
    const [isTriggerBiometric, setIsTriggerBiometric] = useState(false);
    const [isOpenSheetBiometricPassword, setIsOpenSheetBiometricPassword] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    //swr
    const { customers, mutate } = customerSwr || {};
    const { referred_name, referred_status, referred_code, telephone_confirm, username } =
        customers || {};

    //effect
    //--update referred_status when verify telephone
    useEffect(() => {
        if (referred_status === 'pending' && telephone_confirm === 'Y' && referred_code) {
            (async () => {
                const result = await services.customer.saveConnectDownloaderAndReferrer(
                    referred_code
                );
                if (result.code === 'SUCCESS') {
                    mutate();
                }
            })();
        }
    }, [telephone_confirm, referred_status, referred_code]);

    //--check user trigger biometric
    useEffect(() => {
        (async () => {
            const biometricUsernameFlag = await getBiometricUsernameFlag();
            if (biometricUsernameFlag === username) {
                setIsTriggerBiometric(true);
            }
        })();
    }, []);

    //handle
    const checkTriggerBiometric = async (value: boolean) => {
        if (!value) {
            const biometricFlag = await getBiometricUsernameFlag();
            if (biometricFlag) {
                Alert.alert(
                    '',
                    'Bạn có muốn tắt xác thực sinh trắc học?',
                    [
                        {
                            text: 'Huỷ',
                            style: 'cancel',
                        },
                        {
                            text: 'Đồng ý',
                            onPress: async () => {
                                await clearCredentials();
                                setIsTriggerBiometric(false);
                            },
                            style: 'cancel',
                        },
                    ],
                    {
                        cancelable: true,
                    }
                );
            }

            return;
        }

        const isCheck = await checkBiometricSupport();
        if (!isCheck) {
            showMessage({
                message: 'Thiết bị không hỗ trợ xác thực sinh trắc học!',
                icon: 'danger',
                type: 'danger',
            });
            return;
        }
        setIsOpenSheetBiometricPassword(true);
        // setIsTriggerBiometric(isCheck);
    };

    const submitActiveBiometric = async () => {
        setLoadingSubmit(true);
        try {
            if (!passwordInput || !username) {
                showMessage({
                    message: 'Vui lòng nhập mật khẩu để kích hoạt xác thực sinh trắc học!',
                    icon: 'danger',
                    type: 'danger',
                });
                return;
            }
            // check password

            const response = await services.customer.login(
                {
                    username,
                    password: passwordInput,
                },
                'user'
            );

            if (response && response.access_token) {
                const result1 = await saveCredentialsWithBiometric(username, passwordInput);
                const result2 = await saveBiometricUsernameFlag(username);

                if (!result1 || !result2) {
                    throw '';
                }
                setPasswordInput('');
                setIsTriggerBiometric(true);
                setIsOpenSheetBiometricPassword(false);
                showMessage({
                    message: 'Kích hoạt xác thực sinh trắc học thành công!',
                    icon: 'success',
                    type: 'success',
                });
                return;
            }
        } catch (error: any) {
            // console.log('error save biometric ', error.message);
            // console.log('error save biometric ', error);
            if (error?.status === 401) {
                showMessage({
                    message: 'Mật khẩu không chính xác, xin vui lòng thử lại!',
                    icon: 'danger',
                    type: 'danger',
                });
                return;
            }

            if (error?.message.includes('code: 10') || error?.message.includes('code: 13')) {
                setIsOpenSheetBiometricPassword(false);
                setPasswordInput('');
                return;
            }

            console.log('error save biometric ', JSON.stringify(error));

            showMessage({
                message: 'Đã xảy ra lỗi xác thực sinh trắc học, xin vui lòng thử lại!',
                icon: 'danger',
                type: 'danger',
            });
        } finally {
            setLoadingSubmit(false);
        }
    };

    const changeOpenSheetBiometricPassword = (value: boolean) => () => {
        setIsOpenSheetBiometricPassword(value);
    };

    const navigateForgotPassword = () => {
        setIsOpenSheetBiometricPassword(false);
        navigate.FORGOT_PASSWORD_ROUTE({
            beforeAction: 'goback_2',
            success: callbackForgotPassword,
        })();
    };

    const callbackForgotPassword = (new_password: string) => {
        console.log('forgot password success', new_password);
        setIsOpenSheetBiometricPassword(true);
        setPasswordInput(new_password);
    };

    return (
        <>
            {/* Password */}
            <View style={styles.view_titleStyle}>
                <Text fw="bold" color={theme.colors.grey_[400]}>
                    Khác
                </Text>
            </View>
            <ListItem
                bottomDivider
                containerStyle={styles.list_containerStyle}
                onPress={() => {
                    navigate.NAVIGATE(NAVIGATION_TO_EDIT_PASSWORD_SCREEN);
                }}
                hasTVPreferredFocus
            >
                <ListItem.Title style={styles.list_title_style}>Đổi mật khẩu</ListItem.Title>
                <ListItem.Chevron size={theme.typography.body2} />
            </ListItem>
            <ListItem
                containerStyle={styles.list_containerStyle}
                onPress={() => {
                    if (isEmpty(referred_status)) {
                        navigate.NAVIGATE(NAVIGATION_TO_EDIT_REFERRAL_SCREEN);
                    }
                }}
                hasTVPreferredFocus
                bottomDivider
            >
                <View style={styles.view_listContent}>
                    <ListItem.Title style={styles.list_title_style}>
                        {referred_name ? 'Người giới thiệu' : 'Nhập mã giới thiệu'}
                    </ListItem.Title>
                    <Icon
                        type="ionicon"
                        name={
                            referred_status === 'success'
                                ? 'checkmark-circle-outline'
                                : 'alert-outline'
                        }
                        size={theme.typography.body2}
                        color={
                            referred_status === 'success'
                                ? theme.colors.green['500']
                                : theme.colors.main['600']
                        }
                    />
                </View>

                {referred_name ? (
                    <ListItem.Title style={styles.list_titleValue}>{referred_name}</ListItem.Title>
                ) : null}
                {isEmpty(referred_status) ? (
                    <ListItem.Chevron size={theme.typography.body2} />
                ) : null}
            </ListItem>
            {/*  */}
            <ListItem containerStyle={styles.list_containerStyle}>
                <ListItem.Title style={styles.list_title_style}>
                    Xác thực sinh trắc học
                </ListItem.Title>
                <Switch value={isTriggerBiometric} onValueChange={checkTriggerBiometric} />
            </ListItem>

            {/* sheet biometric */}
            <BottomSheet
                isVisible={isOpenSheetBiometricPassword}
                radius
                triggerOnClose={changeOpenSheetBiometricPassword(false)}
            >
                <View>
                    <Text ta="center" size={'body3'}>
                        Nhập mật khẩu
                    </Text>
                    <Text ta="center" size={'sub2'} color={theme.colors.red[500]}>
                        (Vui lòng nhập mật khẩu để kích hoạt xác thực sinh trắc học)
                    </Text>
                </View>
                <View mv={'large'}>
                    <TextInput
                        value={passwordInput}
                        placeholder="Nhập mật khẩu"
                        isPassword
                        onChangeText={(v) => {
                            console.log('onchange text ', v);
                            setPasswordInput(v);
                        }}
                    />
                    <Touch mt={'tiny'} onPress={navigateForgotPassword}>
                        <Text color={theme.colors.main['600']} tD="underline">
                            Quên mật khẩu
                        </Text>
                    </Touch>
                </View>

                <View flexDirect="row" gap={theme.spacings.medium}>
                    <Button
                        type="outline"
                        color={theme.colors.grey_[400]}
                        title={'Đóng'}
                        flex={0.5}
                        onPress={changeOpenSheetBiometricPassword(false)}
                    />
                    <Button
                        title={'Xác nhận'}
                        flex={0.5}
                        loading={loadingSubmit}
                        onPress={submitActiveBiometric}
                    />
                </View>
            </BottomSheet>
        </>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_titleStyle: {
            padding: theme.spacings.small,
        },
        list_containerStyle: {
            justifyContent: 'space-between',
            padding: theme.spacings.medium,
            paddingLeft: theme.spacings.small,
            paddingRight: theme.spacings.small,
            backgroundColor: theme.colors.white_[10],
        },
        view_listContent: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        list_titleValue: {
            flex: 1,
            textAlign: 'right',
            color: theme.colors.grey_[500],
            fontSize: theme.typography.body2,
        },
        list_title_style: {
            fontSize: theme.typography.body2,
            color: theme.colors.black_[10],
        },
        list_sub_title_style: {
            fontSize: theme.typography.sub2,
        },
    });
