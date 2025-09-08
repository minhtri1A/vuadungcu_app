import { CheckBox } from '@rneui/themed';
import VerifyModal from 'components/AccountModal/VerifyModal';
import Button from 'components/Button';
import Loading from 'components/Loading';
import Text from 'components/Text';
import TextInput from 'components/TextInput';
import Status from 'const/status';
import { getMessage, useCustomerSwr, useTheme } from 'hooks';
import { isEmpty } from 'lodash';
import { goBack } from 'navigation/RootNavigation';
import React, { memo, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import Config from 'react-native-config';
import { showMessage } from 'react-native-flash-message';
import { services } from 'services';
import showLoadingApp from 'utils/showLoadingApp';
import { sendSentryError } from 'utils/storeHelpers';
import { Message } from '../../../../const';
import useStyles from './styles';

/* eslint-disable react-hooks/exhaustive-deps */

interface Props {}

export default memo(function AccountEditScreen({}: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles();
    //swr
    const {
        customers: { email, email_confirm },
        updateOrAddCustomerInfo,
        mutate,
    } = useCustomerSwr('all', {
        revalidateOnMount: false,
    });
    //value
    const [openModal, setOpenModal] = useState(false);
    const interval = useRef<any>(null);
    ///email
    const [emailChangeType, setEmailChangeType] = useState('E');
    ///input
    const [value, setValue] = useState(email);
    const [message, setMessage] = useState(Message.NOT_MESSAGE); //message input screen
    const messageh = getMessage(message);
    ///local api
    const [statusLocalApi, setStatusLocalApi] = useState<string>(Status.DEFAULT);
    const [messageLocalApi, setMessageLocalApi] = useState(Message.NOT_MESSAGE);

    //show message api
    useEffect(() => {
        //check show message
        if (statusLocalApi === Status.ERROR) {
            showMessage({
                message: messageLocalApi,
                icon: 'danger',
            });
        }
        //check email is verify
        if (email_confirm === 'Y') {
            setMessage(Message.VERIFY_EMAIL_CANNOT_EDIT);
        }
        return () => {
            if (statusLocalApi === Status.ERROR) {
                setStatusLocalApi(Status.DEFAULT);
            }
        };
    }, [statusLocalApi]);

    ///Xác nhận thây đổi email
    const handleSubmitChangeEmail = () => {
        if (message === Message.NOT_MESSAGE) {
            //edit username
            if (emailChangeType === 'E') {
                //change email
                updateOrAddCustomerInfo('email', { email: value });
            } else if (emailChangeType === 'V') {
                //verify email
                handleSendEmailCode();
            }
        }
    };

    // gửi mã xác minh đến email
    const handleSendEmailCode = async () => {
        setStatusLocalApi(Status.LOADING);
        try {
            const result = await services.customer.putCustomers('email-confirm', {
                send_code: true,
                back_url:
                    Config.REACT_NATIVE_APP_IS_MODE === 'dev'
                        ? Config.REACT_NATIVE_APP_REDIRECT_EMAIL_VERIFY_URL_DEV
                        : Config.REACT_NATIVE_APP_REDIRECT_EMAIL_VERIFY_URL_PRO,
            });
            if (result.code === 'SUCCESS') {
                setOpenModal(true);
                setStatusLocalApi(Status.DEFAULT);
                //prevent duplicate check email link when resend email.
                if (interval.current === null) {
                    //check verify with link
                    checkEmailVerify();
                }
                return true;
            } else {
                setMessageLocalApi(Message.VERIFY_EMAIL_NOT_SEND);
                setStatusLocalApi(Status.ERROR);
                sendSentryError(result, 'handleSendEmailCode');
                return false;
            }
        } catch (err) {
            setMessageLocalApi(Message.SYSTEMS_ERROR);
            setStatusLocalApi(Status.ERROR);
            sendSentryError(err, 'handleSendEmailCode-Catch');
            return false;
        }
    };
    //thây dổi email input
    const handleChangeText = (text: string) => {
        const stringRegex = /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/.exec(
            text
        );
        //check valid
        if (!stringRegex) {
            setMessage(Message.INPUT_EMAIL_NOT_REGEX);
        } else {
            setMessage(Message.NOT_MESSAGE);
        }
        setValue(text);
    };
    //xác minh code
    const handleVerifyEmailCode = async (code: string, action: string) => {
        //turn off check email verify with link
        try {
            if (action === 'ok') {
                showLoadingApp(true);
                const result = await services.customer.putCustomers('email-confirm', {
                    otp: code,
                });
                if (result.code === 'SUCCESS') {
                    //clear check verify
                    clearInterval(interval.current);
                    interval.current = null;
                    verifyEmailSuccess();
                } else if (result.code === 'TOKEN_EXPIRES') {
                    setMessage(Message.VERIFY_EMAIL_CODE_EXPIRED);
                } else if (result.code === 'INVALID_PARAM') {
                    setMessage(Message.VERIFY_EMAIL_CODE_INVALID);
                } else {
                    setMessage(Message.SYSTEMS_ERROR);
                }
                return;
            }
            //click cancel
            clearInterval(interval.current);
            interval.current = null;
            setOpenModal(false);
            setMessage(Message.NOT_MESSAGE);
        } catch (err: any) {
            setMessage(Message.SYSTEMS_ERROR);
            showLoadingApp(false);
            sendSentryError(err, 'handleVerifyEmailCode');
        }
    };
    // interval kiểm tra trong trường hợp người dùng click vào link xác minh trên email thây vì nhập code
    const checkEmailVerify = () => {
        try {
            interval.current = setInterval(async () => {
                const { email_confirm } = await services.customer.getCustomers('email');
                if (email_confirm === 'Y') {
                    verifyEmailSuccess();
                    clearInterval(interval.current);
                    interval.current = null;
                    return;
                }
            }, 2500);
        } catch (error: any) {
            clearInterval(interval.current);
            interval.current = null;
            sendSentryError(error, 'checkEmailVerify');
        }
    };
    //dispatch customer info
    const verifyEmailSuccess = () => {
        //update state
        mutate();
        //success goback
        goBack();
    };

    return (
        <>
            {/* text input */}
            <View style={styles.view_containerEditScreen}>
                {/* email type */}
                <View style={styles.view_wrapRadioEmail}>
                    <CheckBox
                        checked={emailChangeType === 'E'}
                        onPress={() => setEmailChangeType('E')}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        title={<Text mr={'small'}>Thay đổi email</Text>}
                        iconRight
                        checkedColor={theme.colors.main['600']}
                    />
                    <CheckBox
                        checked={emailChangeType === 'V'}
                        onPress={() => setEmailChangeType('V')}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        title={<Text mr={'small'}>Xác minh email</Text>}
                        iconRight
                        disabled={isEmpty(email) || value !== email}
                        checkedColor={theme.colors.main['600']}
                    />
                </View>
                {/* input field */}
                <TextInput
                    placeholder={'Nhập email của bạn !'}
                    autoFocus
                    containerStyle={{ borderColor: theme.colors.main['600'] }}
                    value={value}
                    viewContainerStyle={{ marginVertical: theme.spacings.medium }}
                    onChangeText={handleChangeText}
                    editable={
                        email_confirm === 'Y' ? false : emailChangeType === 'V' ? false : true
                    }
                    helperText={messageh}
                />
                <Button
                    title={emailChangeType === 'E' ? 'Lưu thay đổi' : 'Xác minh'}
                    containerWidth={'100%'}
                    onPress={handleSubmitChangeEmail}
                    disabled={email_confirm === 'Y' ? true : false}
                    // size="md"
                />
            </View>
            {/* modal */}
            {openModal ? (
                <VerifyModal
                    type="email"
                    open={openModal}
                    onCloseVerifyModal={handleVerifyEmailCode}
                    onReSendCode={handleSendEmailCode}
                    title={'email'}
                    value={value}
                    message={message}
                />
            ) : null}

            <Loading visible={statusLocalApi === Status.LOADING} text={'Đang xử lý...'} />
        </>
    );
});
