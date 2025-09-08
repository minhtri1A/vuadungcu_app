import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CheckBox } from '@rneui/themed';
import VerifyModal from 'components/AccountModal/VerifyModal';
import Button from 'components/Button';
import Header from 'components/Header';
import IconButton from 'components/IconButton';
import Loading from 'components/Loading';
import Text from 'components/Text';
import TextInput from 'components/TextInput';
import { getMessage, useAuthPhoneNumber, useNavigate, useTheme } from 'hooks';
import { isEmpty, trim } from 'lodash';
import { PasswordStackParamsList } from 'navigation/type';
import React, { memo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Config from 'react-native-config';
import { services } from 'services';
import { themeType } from 'theme';
import showLoadingApp from 'utils/showLoadingApp';
import { sendSentryError } from 'utils/storeHelpers';
import { Message } from '../../const';
// import { RouteProp } from '@react-navigation/native';

interface Props {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<PasswordStackParamsList, 'ForgotPasswordScreen'>;
}
// route: passwordEdit, login -> forgotpassword
export default memo(function ForgotPasswordScreen({ navigation, route }: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const { send, verify } = useAuthPhoneNumber();
    const navigate = useNavigate();
    //state
    const [loading, setLoading] = useState(false);
    //value
    const [type, setType] = useState('email'); //email or phone
    const [openModal, setOpenModal] = useState(false);
    const [value, setValue] = useState(''); //email or phone number
    const [message, setMessage] = useState(Message.NOT_MESSAGE);
    const messageh = getMessage(message);
    //message verify
    const [messageVerify, setMessageVerify] = useState(Message.NOT_MESSAGE);

    //--telephone
    const [phoneAuthSnapshotState, setPhoneAuthSnapshotState] =
        useState<FirebaseAuthTypes.PhoneAuthSnapshot | null>(null);

    //--value check
    const placeholder = type === 'email' ? 'Nhập email của bạn !' : 'Nhập số điện thoại của bạn !';
    //handle
    //*change radio type (email or telephone)
    const handleChangeType = (type_: string) => () => {
        setType(type_);
        //reset state
        setMessage(Message.NOT_MESSAGE);
        setValue('');
        setPhoneAuthSnapshotState(null);
    };
    //*change text input
    const handleChangeText = (text: string) => {
        if (type === 'email') {
            //handle change email
            const stringRegex = /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/.exec(
                text
            );
            if (stringRegex) {
                setMessage(Message.NOT_MESSAGE);
            } else {
                setMessage(Message.INPUT_EMAIL_NOT_REGEX);
            }
        } else {
            //handle change phone number
            const stringRegex = /^0\d{9}$/.exec(text);
            if (stringRegex) {
                let stringSlice = stringRegex.input.slice(1);
                let stringFormat = '';
                for (let i = 0; i < stringSlice.length / 3; i++) {
                    stringFormat += `${stringSlice.substr(i * 3, 3)} `;
                }
                setMessage(Message.NOT_MESSAGE);
                setValue(trim(`+84 ${stringFormat}`));
                return;
            } else {
                setMessage(Message.INPUT_TELEPHONE_NOT_REGEX);
            }
            //neu xoa ki tu thi tra ve dinh dang viet nam
            if (text?.search(/^(\+84)/) === 0 && text?.length < 15) {
                setValue(text.replace(/^(\+84)\s(\d{3})\s(\d{3})\s/, '$`0$2$3'));
                return;
            }
        }
        //reset error if user clear text
        if (isEmpty(text)) {
            setMessage(Message.NOT_MESSAGE);
        }
        setValue(text);
    };
    //*handle send email or firebase sms code
    const handleSendOtpCode = async () => {
        try {
            //check empty value
            if (isEmpty(value)) {
                setMessage(Message.INPUT_EMPTY_VALUE);
                return;
            }
            //check not exits error
            if (message === Message.NOT_MESSAGE) {
                if (type === 'email') {
                    setLoading(true);
                    //send email code
                    const resultSendMail = await services.customer.putCustomers('forgot-password', {
                        send_code: true,
                        email: value,
                        back_url:
                            Config.REACT_NATIVE_APP_IS_MODE === 'dev'
                                ? Config.REACT_NATIVE_APP_REDIRECT_FORGOT_PASSWORD_URL_DEV
                                : Config.REACT_NATIVE_APP_REDIRECT_FORGOT_PASSWORD_URL_PRO,
                    });
                    if (resultSendMail.code === 'SUCCESS') {
                        setOpenModal(true);
                        setLoading(false);
                        return true;
                    } else {
                        setMessage(Message.VERIFY_EMAIL_NOT_SEND);
                        setLoading(false);
                        return false;
                    }
                } else {
                    // send sms code - firebase phone number
                    setLoading(true);
                    send(
                        value,
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

                    // const authInstance = getAuth();
                    // const confirmation = await verifyPhoneNumber(authInstance, value).o;

                    // verifyPhoneNumber(authInstance, value, true)
                    //     .on('state_changed', async (phoneAuthSnapshot) => {
                    //         setLoading(false);
                    //         //check state
                    //         if (phoneAuthSnapshot.state === auth.PhoneAuthState.CODE_SENT) {
                    //             setPhoneAuthSnapshotState(phoneAuthSnapshot);
                    //             setOpenModal(true);
                    //             return true;
                    //         }
                    //     })
                    //     .then(() => {
                    //         //check succesll
                    //         return true;
                    //     })
                    //     .catch((e: any) => {
                    //         setLoading(false);
                    //         //check failed
                    //         if (e.code === 'auth/too-many-requests') {
                    //             setMessage(Message.VERIFY_MANY_REQUEST_SMS);
                    //         } else {
                    //             setMessage(Message.SYSTEMS_ERROR);
                    //         }
                    //         sendSentryError(e, 'handleSendOtpCode*');
                    //         return false;
                    //     });
                }
            }
        } catch (err) {
            sendSentryError(err, 'handleSendOtpCode 2*');
        }
    };
    //*verify code and close modal
    const handleVerifyCode = async (code: string, action: string) => {
        if (action === 'ok') {
            if (type === 'email') {
                // verify email code
                try {
                    showLoadingApp(true);
                    const resultVerifyCode = await services.customer.putCustomers(
                        'forgot-password',
                        {
                            check: 'token',
                            email: value,
                            otp: code,
                        }
                    );

                    if (resultVerifyCode.result) {
                        //reset state
                        setOpenModal(false);
                        //navigate reset password form
                        navigate.RESET_PASSWORD_ROUTE({
                            beforeAction: route.params.beforeAction,
                            email: value,
                            otp: code,
                            success: route.params?.success,
                        })();
                        return;
                    }
                    throw null;
                } catch (err) {
                    setMessageVerify(Message.VERIFY_EMAIL_CODE_FAILED);
                    sendSentryError(err, 'handleVerifyCode*');
                    return;
                } finally {
                    showLoadingApp(false);
                }
            } else {
                //verify phone code
                if (!phoneAuthSnapshotState) {
                    return;
                }
                verify(
                    phoneAuthSnapshotState,
                    code,
                    async (response) => {
                        //verify success
                        ///reset state
                        setOpenModal(false);
                        setPhoneAuthSnapshotState(null);

                        ///verify phone code success -> reset password form
                        const telephone = response?.user.phoneNumber?.replace(/^(\+84)/, '$`0');
                        const provider_key =
                            Config.REACT_NATIVE_APP_IS_MODE === 'dev'
                                ? Config.REACT_NATIVE_APP_FIREBASE_KEY_DEV
                                : Config.REACT_NATIVE_APP_FIREBASE_KEY_PROD;
                        const provider_token = await response?.user.getIdToken();

                        navigate.RESET_PASSWORD_ROUTE({
                            beforeAction: route.params.beforeAction,
                            provider_token,
                            telephone,
                            provider_key,
                            success: route.params?.success,
                        })();
                    },
                    (e) => {
                        //verify failed
                        setMessageVerify(e);
                        sendSentryError(e, 'handleSendSmsCode-Catch');
                    }
                );
            }
            return;
        }
        //click cancel in modal
        setMessage(Message.NOT_MESSAGE);
        setMessageVerify(Message.NOT_MESSAGE);
        setOpenModal(false);
    };

    return (
        <>
            <Header
                centerComponent={{
                    text: 'Nhận lại mật khẩu mới',
                    style: {
                        color: theme.colors.slate[900],
                        fontSize: theme.typography.title1,
                        marginTop: theme.spacings.tiny,
                    },
                }}
                leftComponent={
                    <IconButton
                        type="ionicon"
                        name="arrow-back-outline"
                        onPress={navigation.goBack}
                        size={theme.typography.title3}
                        color={theme.colors.slate[900]}
                    />
                }
                backgroundColor={theme.colors.white_[10]}
                statusBarProps={{ backgroundColor: theme.colors.main['600'] }}
                containerStyle={theme.styles.shadow1}
                shadow
            />
            <View style={styles.view_containerEditScreen}>
                {/* email type */}
                <View style={styles.view_wrapRadioEmail}>
                    <CheckBox
                        checked={type === 'email'}
                        onPress={handleChangeType('email')}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        title={<Text mr={'small'}>Email</Text>}
                        iconRight
                        checkedColor={theme.colors.main['600']}
                    />
                    <CheckBox
                        checked={type === 'phone'}
                        onPress={handleChangeType('phone')}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        title={<Text mr={'small'}>Số điện thoại</Text>}
                        iconRight
                        checkedColor={theme.colors.main['600']}
                    />
                </View>
                {/* input field */}
                <TextInput
                    placeholder={placeholder}
                    autoFocus
                    containerStyle={{ borderColor: theme.colors.main['600'] }}
                    value={value}
                    viewContainerStyle={{ marginVertical: theme.spacings.medium }}
                    onChangeText={handleChangeText}
                    disableFullscreenUI
                    keyboardType={type === 'email' ? 'email-address' : 'numeric'}
                    helperText={messageh}
                />
                <Button title={'Tiếp theo'} containerWidth={'100%'} onPress={handleSendOtpCode} />
            </View>
            {openModal ? (
                <VerifyModal
                    type={type === 'email' ? 'email' : 'telephone'}
                    open={openModal}
                    value={value}
                    message={messageVerify}
                    title={type === 'email' ? 'email' : 'số điện thoại'}
                    onCloseVerifyModal={handleVerifyCode}
                    onReSendCode={handleSendOtpCode}
                />
            ) : null}
            {/* loading */}
            <Loading visible={loading} text={'Đang gửi tin nhắn...'} />
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
        view_wrapRadioEmail: {
            flexDirection: 'row',
            justifyContent: 'center',
        },
    });
