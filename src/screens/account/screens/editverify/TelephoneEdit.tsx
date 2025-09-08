import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import VerifyModal from 'components/AccountModal/VerifyModal';
import Button from 'components/Button';
import TextInput from 'components/TextInput';
import { getMessage, useAuthPhoneNumber, useCustomerSwr, useTheme } from 'hooks';
import React, { memo, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Message } from '../../../../const';
import useStyles from './styles';
/* eslint-disable react-hooks/exhaustive-deps */
import Loading from 'components/Loading';
import Text from 'components/Text';
import { trim } from 'lodash';
import Config from 'react-native-config';
import { sendSentryError } from 'utils/storeHelpers';

interface Props {}

//otp code is 150298. U2LXPFFxXee
export default memo(function TelephoneEdit({}: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles();
    const { send, verify } = useAuthPhoneNumber();
    //swr
    const {
        customers: { telephone, telephone_confirm },
        updateOrAddCustomerInfo,
    } = useCustomerSwr('all', { revalidateOnMount: false });
    //state
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState(Message.NOT_MESSAGE);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingVerify, setLoadingVerify] = useState(false);
    const [messageVerify, setMessageVerify] = useState(Message.NOT_MESSAGE);
    //value
    const messageh = getMessage(message);

    const [phoneAuthSnapshotState, setPhoneAuthSnapshotState] =
        useState<FirebaseAuthTypes.PhoneAuthSnapshot | null>(null);

    useEffect(() => {
        //init phone number of user
        const initPhoneRegex = handlePhoneRegex(telephone);
        if (initPhoneRegex) {
            setPhoneNumber(initPhoneRegex);
        }
        if (telephone_confirm === 'Y') {
            setMessage(Message.VERIFY_TELEPHONE_CANNOT_EDIT);
        }
    }, []);

    //validate phone vietnam
    const handlePhoneRegex = (phone: any) => {
        const rx = /^0\d{9}$/;
        const stringRx = rx.exec(trim(phone));
        //neu nhap dung dinh dang vn thi them +84 va space
        if (stringRx) {
            let stringSlice = stringRx.input.slice(1);
            let stringFormat = '';
            for (let i = 0; i < stringSlice.length / 3; i++) {
                stringFormat += `${stringSlice.substr(i * 3, 3)} `;
            }
            return `+84 ${stringFormat}`;
        }
        //neu xoa ki tu thi tra ve dinh dang viet nam
        if (phone?.search(/^(\+84)/) === 0 && phone?.length < 15) {
            setPhoneNumber(phone.replace(/^(\+84)\s(\d{3})\s(\d{3})\s/, '$`0$2$3'));
            return;
        }
        setPhoneNumber(phone);
        return;
    };

    //change phone number - input
    const handleChangePhoneNumber = (text: string) => {
        const phoneRegex = handlePhoneRegex(text);
        if (phoneRegex) {
            setPhoneNumber(trim(phoneRegex));
            setMessage(Message.NOT_MESSAGE);
            return;
        } else {
            setMessage(Message.INPUT_TELEPHONE_NOT_REGEX);
        }
    };

    //send sms phone code - click button
    const handleSendSmsCode = async () => {
        if (message !== Message.INPUT_TELEPHONE_NOT_REGEX) {
            //send sms
            setLoading(true);
            send(
                phoneNumber,
                (result) => {
                    setPhoneAuthSnapshotState(result);
                    setOpenModal(true);
                    setLoading(false);
                },
                (error) => {
                    console.log('error ', error);
                    setLoading(false);
                    if (error?.code === 'auth/too-many-requests') {
                        setMessage(Message.VERIFY_MANY_REQUEST_SMS);
                    } else {
                        setMessage(Message.SYSTEMS_ERROR);
                    }
                }
            );
        }
    };

    //phone code verify - click verify
    const handlePhoneCodeVerify = async (code: string, action: string) => {
        try {
            if (action === 'ok') {
                setLoadingVerify(true);
                //verify sms code with Credential
                await verify(
                    phoneAuthSnapshotState,
                    code,
                    async (response) => {
                        //verify phone code success -> verify telephone -> goback if success
                        await updateOrAddCustomerInfo(
                            'telephone',
                            {
                                telephone: response.user.phoneNumber?.replace(/^(\+84)/, '$`0'),
                                provider_key:
                                    Config.REACT_NATIVE_APP_IS_MODE === 'dev'
                                        ? Config.REACT_NATIVE_APP_FIREBASE_KEY_DEV
                                        : Config.REACT_NATIVE_APP_FIREBASE_KEY_PROD,
                                provider_token: await response.user.getIdToken(), //
                            },
                            true
                        );
                    },
                    (e) => {
                        setMessageVerify(e);
                        sendSentryError(e, 'handlePhoneCodeVerify 1');
                    }
                );
                return;
            }
            setOpenModal(false);
            setMessageVerify(Message.NOT_MESSAGE);
        } catch (error) {
            sendSentryError(error, 'handlePhoneCodeVerify 2');
        } finally {
            setLoadingVerify(false);
        }
    };
    return (
        <>
            {/* text input */}
            <View style={styles.view_containerEditScreen}>
                <Text>Số điện thoại</Text>
                {/* input field */}
                <TextInput
                    placeholder={'Nhập số điện thoại của bạn !'}
                    autoFocus
                    containerStyle={{ borderColor: theme.colors.main['600'] }}
                    value={phoneNumber}
                    viewContainerStyle={{ marginVertical: theme.spacings.medium }}
                    onChangeText={handleChangePhoneNumber}
                    editable={telephone_confirm !== 'Y'}
                    helperText={messageh}
                    keyboardType="numeric"
                    maxLength={15}
                />
                <Button
                    title={'Xác minh'}
                    containerWidth={'100%'}
                    onPress={handleSendSmsCode}
                    disabled={
                        telephone_confirm === 'Y' || message === Message.INPUT_TELEPHONE_NOT_REGEX
                    }
                />
                {openModal ? (
                    <VerifyModal
                        type="telephone"
                        open={openModal}
                        title={'Số điện thoại'}
                        value={phoneNumber}
                        onCloseVerifyModal={handlePhoneCodeVerify}
                        onReSendCode={handleSendSmsCode}
                        onChangeCode={() => setLoadingVerify(false)}
                        message={messageVerify}
                        loading={loadingVerify}
                    />
                ) : null}
            </View>
            {/* loading */}
            <Loading visible={loading} text={'Đang gửi tin nhắn...'} />
        </>
    );
});
