/* eslint-disable react-hooks/exhaustive-deps */
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { captureException, setExtra } from '@sentry/react-native';
import Button from 'components/Button';
import Header from 'components/Header';
import IconButton from 'components/IconButton';
import Loading from 'components/Loading';
import Text from 'components/Text';
import TextInput from 'components/TextInput';
import { Message, Status } from 'const/index';
import { NAVIGATION_TO_REFERRAL_INFO_SCREEN, NAVIGATION_TO_SCAN_SCREEN } from 'const/routes';
import { useCustomerSwr, useNavigate, useTheme } from 'hooks';
import { SettingStackParamsList } from 'navigation/type';
import React, { memo, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { services } from 'services';
import { themeType } from 'theme';
import { isEmpty } from 'utils/helpers';

interface Props {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<SettingStackParamsList, 'ReferralScreen'>;
}

const EnterReferralScreen = memo(function EditReferralScreen({ navigation, route }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const navigate = useNavigate();
    //state
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [status, setStatus] = useState<string>(Status.DEFAULT);
    const [message, setMessage] = useState('');
    //params
    const referral_code_param = route.params?.referral_code;
    //swr
    const { customers, mutate } = useCustomerSwr('all', { revalidateOnMount: false });
    const { referred_status, referred_name } = customers || {};
    //value

    //handle
    //--get name with code
    useEffect(() => {
        if (code.length === 32) {
            (async () => {
                const result = await services.customer.getReferrerNameWithReferrerCode(code);
                if (result.name) {
                    setName(result.name);
                }
            })();
        }
    }, [code]);
    //--status
    useEffect(() => {
        if (status === Status.SUCCESS) {
            showMessage({
                message: 'Thêm mã giới thiêu thành công',
                icon: 'success',
                duration: 3000,
                position: 'top',
            });
        }
    }, [status]);
    //--check referral scan qr
    useEffect(() => {
        if (referral_code_param) {
            setCode(referral_code_param);
        }
    }, [referral_code_param]);

    const handleChangeReferralCode = (text: string) => {
        if (name) {
            setName('');
        }
        if (message) {
            setMessage('');
        }
        setCode(text);
    };

    const saveConnectReferral = async () => {
        if (name && code.length === 32) {
            setStatus(Status.LOADING);
            const result = await services.customer.saveConnectDownloaderAndReferrer(code);
            if (result.code === Message.SUCCESS) {
                mutate();
                setStatus(Status.SUCCESS);
                navigation.goBack();
                return;
            }
            setStatus(Status.ERROR);
            setMessage('Đã xảy ra lỗi vui lòng thử lại');
            setExtra('EditReferralScreen', 'saveConnectReferral');
            captureException(result);
        }
    };
    //navigate
    const navigateQRCodeScreen = () => {
        navigation.navigate(NAVIGATION_TO_SCAN_SCREEN);
    };

    const navigateReferralInfoScreen = () => {
        navigation.navigate(NAVIGATION_TO_REFERRAL_INFO_SCREEN);
    };

    return (
        <>
            <Header
                centerComponent={{
                    text: 'Nhập mã giới thiệu',
                    style: {
                        color: theme.colors.slate[900],
                        fontSize: theme.typography.title2,
                        alignSelf: 'flex-start',
                    },
                }}
                rightComponent={
                    <IconButton
                        type="ionicon"
                        name="help-circle-outline"
                        onPress={navigateReferralInfoScreen}
                        // size={theme.typography.title3}
                        color={theme.colors.black_[10]}
                    />
                }
                backgroundColor={theme.colors.white_[10]}
                statusBarProps={{ backgroundColor: theme.colors.main['600'] }}
                containerStyle={{ borderBottomWidth: 1 }}
                shadow
            />
            {!isEmpty(referred_status) ? (
                <Text p={'small'} fw="bold">
                    Tài khoản bạn đã nhập mã giới thiệu: {referred_name}
                </Text>
            ) : (
                <View style={styles.view_containerEditScreen}>
                    <View style={{ marginBottom: theme.spacings.medium }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    autoFocus
                                    value={code}
                                    onChangeText={handleChangeReferralCode}
                                    placeholder="Nhập mã giới thiệu(gồm 32 ký tự)"
                                    autoComplete="off"
                                />
                            </View>

                            <IconButton
                                type="ionicon"
                                name="qr-code-outline"
                                color={theme.colors.black_[10]}
                                size={theme.typography.size(35)}
                                ml={'small'}
                                onPress={navigateQRCodeScreen}
                            />
                        </View>

                        {name ? (
                            <Text color={theme.colors.grey_[500]}>Người giới thiệu: {name}</Text>
                        ) : null}
                        {isEmpty(name) && code.length === 32 ? (
                            <Text color="red">Không tìm thấy người giới thiệu</Text>
                        ) : null}
                        {message ? <Text color="red">{message}</Text> : null}
                    </View>

                    <Button
                        title={'Lưu thay đổi'}
                        containerWidth={'100%'}
                        disabled={isEmpty(name)}
                        onPress={saveConnectReferral}
                    />
                </View>
            )}

            <Loading visible={status === Status.LOADING} text={'Đang xử lý'} />
            {/* modal */}
        </>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_containerEditScreen: {
            flex: 1,
            backgroundColor: theme.colors.white_[10],
            padding: theme.spacings.medium,
        },
    });

export default EnterReferralScreen;
