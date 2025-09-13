import { Icon } from '@rneui/themed';
import Button from 'components/Button';
import Loading from 'components/Loading';
import Text from 'components/Text';
import TextInput from 'components/TextInput';
import View from 'components/View';
import Status from 'const/status';
import { REGISTER_ACCOUNT_CUSTOMER, REGISTER_ACCOUNT_FAILED } from 'features/action';
import { useFormik } from 'formik';
import withAuth from 'hoc/withAuth';
import { getMessage, useAppDispatch, useAppSelector, useTheme } from 'hooks';
import useReferralInfoSwr from 'hooks/swr/referral/useReferrarInfoSwr';
import * as RootNavigation from 'navigation/RootNavigation';
import React, { memo, useEffect } from 'react';
import { Linking, ScrollView } from 'react-native';
import Config from 'react-native-config';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';
import { Message } from '../const';
import useStyles from './styles';
import Header from 'components/Header2';

/* eslint-disable react-hooks/exhaustive-deps */

const Register = memo(function Register() {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles();
    const dispatch = useAppDispatch();
    //swr
    const { referral } = useReferralInfoSwr();
    //value
    const { message, statusRegister } = useAppSelector((state) => state.account.register);
    const messageh = getMessage(message);
    //formik
    const registerSchema = Yup.object().shape({
        lastname: Yup.string().required('Vui lòng nhập họ của bạn !'),
        firstname: Yup.string().required('Vui lòng nhập tên của bạn !'),
        telephone: Yup.string()
            .required('Số điện thoại không được bỏ trống !')
            .trim('Số điện thoại không được chứa khoảng trắng !')
            .matches(
                /^(0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/,
                'Số điện thoại không hợp lệ !'
            ),
        password: Yup.string()
            .required('Mật khẩu không được bỏ trống !')
            .min(6, 'Mật khẩu tối thiểu nhất 6 kí tự'),
        confirm_password: Yup.string()
            .required('Vui lòng xác nhận lại mật khẩu của bạn !')
            .min(6, 'Mật khẩu tối thiểu 6 kí tự !')
            .oneOf([Yup.ref('password'), ''], 'Nhập lại mật khẩu không đúng'), //confirm_password
    });
    const formik = useFormik({
        initialValues: {
            firstname: '',
            lastname: '',
            telephone: '',
            password: '',
            confirm_password: '',
        },
        validationSchema: registerSchema,
        onSubmit: (values) => {
            dispatch(
                REGISTER_ACCOUNT_CUSTOMER({ ...values, referral_code: referral?.referral_code })
            );
        },
    });
    //render message register
    useEffect(() => {
        if (statusRegister === Status.ERROR) {
            showMessage({
                message: messageh,
                type: 'danger',
                duration: 3000,
                onHide: () =>
                    dispatch(
                        REGISTER_ACCOUNT_FAILED({
                            status: Status.DEFAULT,
                            message: Message.NOT_MESSAGE,
                        })
                    ),
            });
        }
    }, [statusRegister]);

    return (
        <View style={styles.view_registerContainer}>
            {/*Header*/}
            <Header
                bgColor={theme.colors.white_[10]}
                left={
                    <Icon
                        type={'ionicon'}
                        name="close-outline"
                        color={theme.colors.main['600']}
                        onPress={RootNavigation.goBack}
                        size={theme.typography.title4}
                    />
                }
                center={
                    <Text size={'title2'} ta="center" color={theme.colors.main['600']}>
                        Đăng ký
                    </Text>
                }
            />
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
                {/*from login*/}
                <View style={styles.view_wrapInput}>
                    {/* input username */}
                    <TextInput
                        autoFocus
                        value={formik.values.telephone}
                        onChangeText={formik.handleChange('telephone')}
                        placeholder={'Nhập số điện thoại của bạn'}
                        containerStyle={theme.styles.inputVariantFilledStyle}
                        viewContainerStyle={{ marginVertical: theme.spacings.large }}
                        disableFullscreenUI
                        keyboardType={'numeric'}
                        startIcon={{
                            type: 'font-awesome',
                            name: 'phone',
                            size: theme.typography.size(23),
                            color: theme.colors.grey_[400],
                        }}
                        helperText={
                            formik.touched.telephone && formik.errors.telephone
                                ? formik.errors.telephone
                                : undefined
                        }
                    />
                    {/* input lastname */}
                    <TextInput
                        value={formik.values.lastname}
                        onChangeText={formik.handleChange('lastname')}
                        placeholder={'Nhập họ của bạn'}
                        containerStyle={theme.styles.inputVariantFilledStyle}
                        viewContainerStyle={{ marginVertical: theme.spacings.large }}
                        disableFullscreenUI
                        startIcon={{
                            type: 'font-awesome',
                            name: 'user-o',
                            size: theme.typography.size(20),
                            color: theme.colors.grey_[400],
                        }}
                        helperText={
                            formik.touched.lastname && formik.errors.lastname
                                ? formik.errors.lastname
                                : undefined
                        }
                    />
                    {/* input first name */}
                    <TextInput
                        value={formik.values.firstname}
                        onChangeText={formik.handleChange('firstname')}
                        placeholder={'Nhập tên của bạn'}
                        containerStyle={theme.styles.inputVariantFilledStyle}
                        viewContainerStyle={{ marginVertical: theme.spacings.large }}
                        disableFullscreenUI
                        startIcon={{
                            type: 'font-awesome',
                            name: 'user',
                            size: theme.typography.size(23),
                            color: theme.colors.grey_[400],
                        }}
                        helperText={
                            formik.touched.firstname && formik.errors.firstname
                                ? formik.errors.firstname
                                : undefined
                        }
                    />
                    {/* input password */}
                    <TextInput
                        isPassword
                        value={formik.values.password}
                        onChangeText={formik.handleChange('password')}
                        placeholder={'Nhập mật khẩu'}
                        containerStyle={theme.styles.inputVariantFilledStyle}
                        viewContainerStyle={{ marginVertical: theme.spacings.large }}
                        disableFullscreenUI
                        startIcon={{
                            type: 'feather',
                            name: 'lock',
                            size: theme.typography.size(20),
                            color: theme.colors.grey_[400],
                        }}
                        helperText={
                            formik.touched.password && formik.errors.password
                                ? formik.errors.password
                                : undefined
                        }
                    />
                    {/* input confirm password */}
                    <TextInput
                        isPassword
                        value={formik.values.confirm_password}
                        onChangeText={formik.handleChange('confirm_password')}
                        placeholder={'Nhập lại mật khẩu'}
                        containerStyle={theme.styles.inputVariantFilledStyle}
                        viewContainerStyle={{
                            marginVertical: theme.spacings.large,
                            marginBottom: theme.spacings.extraLarge,
                        }}
                        disableFullscreenUI
                        startIcon={{
                            type: 'font-awesome5',
                            name: 'lock',
                            size: theme.typography.size(23),
                            color: theme.colors.grey_[400],
                        }}
                        helperText={
                            formik.touched.confirm_password && formik.errors.confirm_password
                                ? formik.errors.confirm_password
                                : undefined
                        }
                    />
                    {/* referral */}
                    {referral?.referral_code ? (
                        <View style={styles.view_wrap_referral}>
                            <View flexDirect="row">
                                <Icon
                                    type="font-awesome"
                                    name="users"
                                    size={theme.typography.size(17)}
                                    color={theme.colors.teal['900']}
                                />
                                <Text ml="small" size={'body2'} color={theme.colors.teal['900']}>
                                    Người giới thiệu: {referral.name}
                                </Text>
                            </View>

                            {/* <TextInput
                                value={referrarCode}
                                onChangeText={handleChangeReferrarCode}
                                placeholder={'Nhập mã giới thiệu'}
                                containerStyle={{ padding: theme.spacings.tiny }}
                                disableFullscreenUI
                            /> */}
                        </View>
                    ) : null}

                    <Button
                        title={'Đăng ký'}
                        containerWidth={'100%'}
                        onPress={() => formik.handleSubmit()}
                    />
                </View>
                {/*border*/}
                <View style={styles.createBorder}>
                    <View style={styles.borders} />
                    <Text style={styles.txtOtherLogin}>Hoặc</Text>
                    <View style={styles.borders} />
                </View>
                {/* <SigninGoogle/> */}
                {/* accept policy */}
                <View aI="center" jC="center" p="large">
                    <Text>
                        Bằng việc đăng nhập / đăng ký tài khoản, bạn đã đồng ý với{' '}
                        <Text
                            onPress={() => {
                                Linking.openURL(
                                    `${Config.REACT_NATIVE_APP_APP_SCHEME}help-center/general`
                                );
                            }}
                            color={theme.colors.blue['500']}
                        >
                            điều khoản sử dụng
                        </Text>{' '}
                        và{' '}
                        <Text
                            onPress={() => {
                                Linking.openURL('https://vuadungcu.com/help-center/privacy');
                            }}
                            color={theme.colors.blue['500']}
                        >
                            chính sách sách bảo mật
                        </Text>{' '}
                        của Vua dụng cụ.
                    </Text>
                </View>
            </ScrollView>
            {/* loading */}
            <Loading
                visible={statusRegister === Status.LOADING ? true : false}
                text={'Đang tạo tài khoản'}
            />
        </View>
    );
});

export default withAuth(Register, false);
// export default Register;
