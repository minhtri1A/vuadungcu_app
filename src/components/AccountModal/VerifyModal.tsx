/* eslint-disable react-hooks/exhaustive-deps */
import OTPInputView from '@twotalltotems/react-native-otp-input';
import BottomSheet from 'components/BottomSheet';
import Button from 'components/Button';
import CountSeconds from 'components/CountSeconds';
import Image from 'components/Image';
import Text from 'components/Text';
import View from 'components/View';
import { getMessage, useTheme } from 'hooks';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Keyboard, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import RNOtpVerify from 'react-native-otp-verify';
import { themeType } from 'theme';
// const stringtest = 'ma xac minh cua ban a 123456 ctdxty';
// const stringrx = stringtest.replace(/(\d)/, '$1');
// console.log('string regex ', stringtest.replace(/.*(\d{6}).*/, '$1'));

interface Props {
    type: 'email' | 'telephone';
    open: boolean;
    title: string;
    value?: string;
    message?: string;
    loading?: boolean;
    onCloseVerifyModal(text: string, action: 'ok' | 'cancel'): void;
    onReSendCode(): any;
    onChangeCode?: (code?: string) => void;
}

//email and phone verify
export default memo(function VerifyModal({
    open,
    title,
    value,
    loading,
    message,
    type,
    onCloseVerifyModal,
    onReSendCode,
    onChangeCode,
}: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles(theme);
    //state
    const [code, setCode] = useState('');
    const [visibleCountDown, setVisibleCountDown] = useState(true);
    const [codeAutoOtp, setCodeAutoOpt] = useState<string | undefined>();
    //input
    const inputRef = useRef<OTPInputView>(null);
    //value
    const messageh = getMessage(message);

    /* --- effect --- */
    //read sms auto enter opt
    useEffect(() => {
        //listener sms
        if (type === 'telephone' && Platform.OS === 'android') {
            RNOtpVerify.getHash().then(console.log).catch(console.log);
            RNOtpVerify.getOtp()
                .then(() => RNOtpVerify.addListener(otpHandler))
                .catch((p) => console.log('error', p));
        }
        return () => {
            if (type === 'telephone') {
                RNOtpVerify.removeListener();
            }
        };
    }, []);
    //auto send verify code
    useEffect(() => {
        if (code.length === 6) {
            handleCloseModal('ok')();
        }
    }, [code]);

    /* --- handle --- */
    //close or verify opt
    const handleCloseModal = (action_: 'cancel' | 'ok') => () => {
        if (action_ === 'cancel' || (action_ === 'ok' && code.length === 6)) {
            onCloseVerifyModal(code, action_);
        }
    };
    //input otp
    const handleChangeInputCode = (c: string) => {
        onChangeCode && onChangeCode(c);
        setCode(c);
    };
    //auto get sms otp
    const otpHandler = (message_: string) => {
        const otp = /(\d{6})/g.exec(message_);
        if (otp) {
            // setCode(otp[0]);
            setCodeAutoOpt(otp[0]);
        }
        RNOtpVerify.removeListener();
        Keyboard.dismiss();
    };
    const closeSheetConfirmAutoOtp = () => {
        setCodeAutoOpt(undefined);
    };
    const acceptSheetConfirmAutoOtp = () => {
        if (codeAutoOtp) {
            setCode(codeAutoOtp);
            setCodeAutoOpt(undefined);
        }
    };

    //count down ===0 then turn off countdown
    const handleFinishCountDown = () => {
        setVisibleCountDown(false);
    };
    //reSend code when time expired
    const handleReSendCode = async () => {
        //send code success then reopen countdown
        if (await onReSendCode()) {
            setVisibleCountDown(true);
        }
    };

    return (
        <>
            <Modal isVisible={open} onBackdropPress={handleCloseModal('cancel')}>
                <View
                    style={{
                        backgroundColor: theme.colors.white_[10],
                        padding: theme.spacings.medium,
                        borderRadius: 10,
                        alignItems: 'center',
                    }}
                >
                    <View w={theme.dimens.scale(50)} ratio={1}>
                        {type === 'telephone' ? (
                            <Image
                                source={require('asset/phone-message.png')}
                                resizeMode="contain"
                            />
                        ) : (
                            <Image
                                source={require('asset/email-message.png')}
                                resizeMode="contain"
                            />
                        )}
                    </View>
                    <View jC="center" aI="center" mt={'medium'}>
                        <Text size={'body3'} color={theme.colors.teal['500']}>
                            Nhập mã xác minh
                        </Text>
                        <Text color={theme.colors.grey_[500]}>
                            Hệ thống đã gửi tới {title.toLocaleLowerCase()}{' '}
                            <Text color={theme.colors.teal['500']}>{value}</Text> một mã xác minh
                            gồm 6 chữ số.
                        </Text>
                    </View>

                    {/*  input */}
                    <View style={styles.view_otpInput}>
                        <OTPInputView
                            style={{ width: '100%', height: theme.dimens.verticalScale(80) }}
                            pinCount={6}
                            code={code}
                            onCodeChanged={handleChangeInputCode}
                            autoFocusOnLoad={false}
                            codeInputHighlightStyle={{
                                borderWidth: 1,
                                borderColor: theme.colors.main['600'],
                            }}
                            selectionColor={theme.colors.main['600']}
                            codeInputFieldStyle={styles.underlineStyleBase}
                            ref={inputRef}
                            keyboardType="number-pad"
                        />
                        {/* <IconButton
                        type="ionicon"
                        name="close-outline"
                        size={theme.typography.title3}
                        color={theme.colors.grey_[400]}
                        style={{ marginLeft: theme.spacings.medium }}
                        onPress={() => {
                            setCode('');
                        }}
                    /> */}
                    </View>
                    {messageh ? (
                        <Text style={styles.txt_errorInput} ellipsizeMode="tail">
                            {messageh}
                        </Text>
                    ) : null}
                    {/* time code  */}

                    {/* button */}
                    {/* <Button title="Huỷ bỏ" onPress={handleCloseModal('cancel')} /> */}
                    <Button
                        title="Xác minh"
                        onPress={handleCloseModal('ok')}
                        size="sm"
                        minWidth={'100%'}
                        loading={loading}
                        disabled={loading}
                    />
                    <View style={styles.view_codeExpired}>
                        <Text size={'body1'} color={theme.colors.grey_[500]}>
                            Nhận mã mới sau:{' '}
                        </Text>
                        <TouchableOpacity onPress={handleReSendCode}>
                            <Text size={'body1'} color={theme.colors.main['600']}>
                                {visibleCountDown ? (
                                    <CountSeconds
                                        second={120}
                                        onFinishCountDown={handleFinishCountDown}
                                        visible={visibleCountDown}
                                        textType="minutes"
                                    />
                                ) : (
                                    'Gửi lại.'
                                )}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* sheet */}
            <BottomSheet isVisible={codeAutoOtp !== undefined}>
                <Text size={'body3'} color={theme.colors.teal['500']}>
                    Tự động điền mã OTP
                </Text>
                <Text lh={18} color={theme.colors.grey_[500]} mt="medium">
                    Để thuận tiện cho việc xác thực tài khoản, bạn có đồng ý cho phép hệ thống tự
                    động đọc mã OTP (mật khẩu một lần) được gửi đến số điện thoại của bạn?
                </Text>
                <View flexDirect="row" jC="flex-end" mt="medium">
                    <Button
                        title={'Huỷ bỏ'}
                        minWidth={theme.dimens.scale(100)}
                        bgColor={theme.colors.grey_[500]}
                        onPress={closeSheetConfirmAutoOtp}
                    />
                    <View ml="medium">
                        <Button
                            title={'Đồng ý'}
                            minWidth={theme.dimens.scale(100)}
                            bgColor={theme.colors.teal['500']}
                            onPress={acceptSheetConfirmAutoOtp}
                        />
                    </View>
                </View>
            </BottomSheet>
        </>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        txt_errorInput: {
            paddingLeft: theme.spacings.small,
            color: theme.colors.red['500'],
            marginBottom: theme.spacings.medium,
            textAlign: 'center',
        },
        underlineStyleBase: {
            // width: theme.dimens.scale(40),
            // height: theme.dimens.scale(40),
            // // aspectRatio: 1,
            borderWidth: 1,
            borderColor: theme.colors.grey_[400],
            color: theme.colors.black_[10],
            fontSize: theme.typography.title1,
            // backgroundColor: theme.colors.grey_[200],
        },
        dialog_title: {
            color: theme.colors.grey_[500],
            fontSize: theme.typography.body3,
            // fontWeight: 'bold',
            paddingBottom: 0,
            textAlign: 'center',
        },
        view_otpInput: {
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-end',
        },
        view_codeExpired: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: theme.spacings.tiny,
        },
    });
