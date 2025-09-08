import Button from 'components/Button';
import TextInput from 'components/TextInput';
import Touch from 'components/Touch';
import { useFormik } from 'formik';
import useUser from 'hooks/handle/useUser';
import React, { memo } from 'react';
import * as Yup from 'yup';

interface Props {
    username?: string;
}

const SigninUser = memo(function SigninUser({ username = '' }: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles();
    const { login } = useUser();
    const { checkBiometricSupport, getBiometricUsernameFlag, loadCredentialsWithBiometric } =
        useBiometricAuth();

    const navigate = useNavigate();

    //formik
    const signinUserSchema = Yup.object().shape({
        username: Yup.string().required('Tài khoản không được để trống!'),
        password: Yup.string().required('Mật khẩu không được để trống !'),
    });
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            username: username,
            password: '',
        },
        validationSchema: signinUserSchema,
        onSubmit: (values) => {
            // dispatch(SIGNIN_WITH_ACCOUNT(values));
            login('user', values);
        },
    });

    //handle
    const loginWithBiometric = async () => {
        const checkSupport = await checkBiometricSupport();
        const biometricFlag = await getBiometricUsernameFlag();

        if (!checkSupport) {
            showMessage({
                message: 'Thiết bị không hỗ trợ xác thực sinh trắc học!',
            });
            return;
        }

        if (!biometricFlag) {
            showMessage({
                message:
                    'Vui lòng kích hoạt xác thực bằng sinh trắc học trong: "Cài đặt > Thông tin tài khoản" để sử dụng chức năng này!',
            });
            return;
        }
        const credentials = await loadCredentialsWithBiometric();
        if (!credentials) {
            return;
        }

        await login('user', { ...credentials }, credentials.username, true);
    };

    return (
        <>
            <View gap={theme.spacings.medium}>
                <View style={styles.view_inputStyle}>
                    <TextInput
                        value={formik.values.username}
                        onChangeText={formik.handleChange('username')}
                        placeholder={'Nhập tài khoản / email / số điện thoại'}
                        placeholderTextColor={theme.colors.grey_[500]}
                        disableFullscreenUI
                        startIcon={{
                            type: 'font-awesome',
                            name: 'user-o',
                            size: theme.typography.body3,
                            color: theme.colors.grey_[500],
                        }}
                        helperText={
                            formik.errors.username && formik.touched.username
                                ? formik.errors.username
                                : undefined
                        }
                    />
                </View>
                <View style={styles.view_inputStyle}>
                    <TextInput
                        isPassword
                        value={formik.values.password}
                        onChangeText={formik.handleChange('password')}
                        placeholder="Nhập mật khẩu"
                        placeholderTextColor={theme.colors.grey_[500]}
                        disableFullscreenUI
                        startIcon={{
                            type: 'feather',
                            name: 'lock',
                            size: theme.typography.body3,
                            color: theme.colors.grey_[500],
                        }}
                        helperText={
                            formik.errors.password && formik.touched.password
                                ? formik.errors.password
                                : undefined
                        }
                    />
                </View>
                <View style={styles.view_buttonLogin}>
                    <Button
                        title={'Đăng nhập'}
                        onPress={() => formik.handleSubmit()}
                        // containerWidth={'100%'}
                        flex={1}
                    />
                    <Touch style={styles.container} onPress={loginWithBiometric}>
                        <Icon
                            type="ionicon"
                            name="finger-print"
                            color={theme.colors.main[400]}
                            size={theme.typography.size(25)}
                        />
                        {/* 4 góc */}
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </Touch>
                </View>
                {/* register and forgot pass */}
                <Touch activeOpacity={0.6}>
                    <Text
                        color={theme.colors.grey_['500']}
                        tD="underline"
                        onPress={navigate.FORGOT_PASSWORD_ROUTE({ beforeAction: 'login' })}
                    >
                        Lấy lại mật khẩu
                    </Text>
                </Touch>
            </View>
        </>
    );
});

import { Icon } from '@rneui/themed';
import Text from 'components/Text';
import View from 'components/View';
import { useNavigate, useTheme } from 'hooks';
import { useBiometricAuth } from 'hooks/useBiometricAuth';
import { StyleSheet } from 'react-native';
import { showMessage } from 'react-native-flash-message';

const BORDER_LENGTH = 10;
const BORDER_WIDTH = 1;

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        /* ------signin user------ */
        view_signuserContainer: {},
        view_inputStyle: {
            width: '100%',
        },
        view_buttonLogin: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: theme.spacings.medium,
            marginTop: theme.spacings.medium,
        },
        txt_btnOption: {
            color: theme.colors.grey_['500'],
            fontSize: theme.typography.body1,
        },

        // border
        container: {
            padding: theme.spacings.default * 0.65,
            position: 'relative',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: theme.colors.grey_[100],
            borderRadius: 2,
        },
        corner: {
            width: BORDER_LENGTH,
            height: BORDER_LENGTH,
            position: 'absolute',
            borderColor: theme.colors.main['500'],
            borderRadius: 2,
        },
        topLeft: {
            top: 0,
            left: 0,
            borderTopWidth: BORDER_WIDTH,
            borderLeftWidth: BORDER_WIDTH,
        },
        topRight: {
            top: 0,
            right: 0,
            borderTopWidth: BORDER_WIDTH,
            borderRightWidth: BORDER_WIDTH,
        },
        bottomLeft: {
            bottom: 0,
            left: 0,
            borderBottomWidth: BORDER_WIDTH,
            borderLeftWidth: BORDER_WIDTH,
        },
        bottomRight: {
            bottom: 0,
            right: 0,
            borderBottomWidth: BORDER_WIDTH,
            borderRightWidth: BORDER_WIDTH,
        },
    });
};

export default SigninUser;
