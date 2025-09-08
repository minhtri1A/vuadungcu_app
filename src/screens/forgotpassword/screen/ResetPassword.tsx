import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Button from 'components/Button';
import Header from 'components/Header';
import IconButton from 'components/IconButton';
import Loading from 'components/Loading';
import Text from 'components/Text';
import TextInput from 'components/TextInput';
import { Message } from 'const/index';
import { useFormik } from 'formik';
import { useTheme } from 'hooks';
import useUser from 'hooks/handle/useUser';
import { DataPutCustomerInfoType } from 'models';
import { PasswordStackParamsList } from 'navigation/type';
import React, { memo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { services } from 'services';
import { themeType } from 'theme';
import showMessageApp from 'utils/showMessageApp';
import { sendSentryError } from 'utils/storeHelpers';
import * as Yup from 'yup';

interface Props {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<PasswordStackParamsList, 'ResetPasswordScreen'>;
}

export default memo(function ResetPasswordScreen({ navigation, route }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const { beforeAction, success, ...params } = route.params;
    const { login } = useUser();
    //state
    const [loading, setLoading] = useState(false);
    //value
    //formik
    const passwordSchema = Yup.object().shape({
        new_password: Yup.string()
            .required('Mật khẩu không được bỏ trống !')
            .min(6, 'Mật khẩu tối thiểu nhất 6 kí tự'),
        new_password_repeat: Yup.string()
            .required('Vui lòng xác nhận lại mật khẩu của bạn !')
            .min(6, 'Mật khẩu tối thiểu 6 kí tự !')
            .oneOf([Yup.ref('new_password'), null as any], 'Nhập lại mật khẩu không đúng'), //confirm_password
    });
    const formik = useFormik({
        initialValues: {
            new_password: '',
            new_password_repeat: '',
        },
        onSubmit: (values) => {
            const data = { change_password: true, ...values, ...params };
            // console.log('data ', data);
            //dispatch forgot password with email or username
            handleUpdateNewPassword(data);
        },
        validationSchema: passwordSchema,
    });

    const handleUpdateNewPassword = async (data: DataPutCustomerInfoType) => {
        try {
            setLoading(true);
            const resultUpdate = await services.customer.putCustomers('forgot-password', data);
            //update password success -> login user
            if (resultUpdate.code === 'SUCCESS') {
                if (beforeAction === 'login') {
                    const username = data?.email || data?.telephone;
                    navigation.goBack();
                    navigation.goBack();
                    username &&
                        data?.new_password &&
                        login('user', { username, password: data.new_password });
                }

                if (beforeAction === 'goback_2') {
                    navigation.goBack();
                    navigation.goBack();
                    showMessageApp('Reset mật khẩu thành công!', {
                        type: 'success',
                        valueType: 'message',
                    });
                }
                success && success(data.new_password || '');
                return;
            }

            showMessageApp(Message.PASSWORD_FORGOT_UPDATE_FAILED);
        } catch (err) {
            showMessageApp();
            sendSentryError(err, 'handleSendSmsCode-Catch');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header
                centerComponent={{
                    text: 'Đặt lại mật khẩu',
                    style: {
                        color: theme.colors.slate[900],
                        fontSize: theme.typography.title2,
                        alignSelf: 'flex-start',
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
                <View style={{ paddingBottom: theme.spacings.small }}>
                    <Text>Mật khẩu mới</Text>
                    <TextInput
                        placeholder="Nhập mật khẩu mới"
                        autoFocus
                        containerStyle={{
                            borderColor: theme.colors.main['600'],
                            marginTop: theme.spacings.tiny,
                        }}
                        isPassword
                        value={formik.values.new_password}
                        onChangeText={formik.handleChange('new_password')}
                        helperText={
                            formik.touched.new_password && formik.errors.new_password
                                ? formik.errors.new_password
                                : undefined
                        }
                    />
                </View>
                <View style={{ paddingBottom: theme.spacings.medium }}>
                    <Text>Nhập lại mật khẩu mới</Text>
                    <TextInput
                        placeholder="Nhập lại mật khẩu mới"
                        containerStyle={{
                            borderColor: theme.colors.main['600'],
                            marginTop: theme.spacings.tiny,
                        }}
                        isPassword
                        value={formik.values.new_password_repeat}
                        onChangeText={formik.handleChange('new_password_repeat')}
                        helperText={
                            formik.touched.new_password_repeat && formik.errors.new_password_repeat
                                ? formik.errors.new_password_repeat
                                : undefined
                        }
                    />
                </View>

                <Button
                    title={'Lưu thay đổi'}
                    containerWidth={'100%'}
                    onPress={() => formik.handleSubmit()}
                />
            </View>
            <Loading visible={loading} text={'Đang xử lý'} />
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
