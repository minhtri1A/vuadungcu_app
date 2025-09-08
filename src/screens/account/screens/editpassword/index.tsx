/* eslint-disable react-hooks/exhaustive-deps */
import { StackNavigationProp } from '@react-navigation/stack';
import Button from 'components/Button';
import Header from 'components/Header';
import IconButton from 'components/IconButton';
import Text from 'components/Text';
import TextInput from 'components/TextInput';
import Touch from 'components/Touch';
import { NAVIGATION_TO_FORGOT_PASSWORD_STACK } from 'const/routes';
import { useFormik } from 'formik';
import { useCustomerSwr, useNavigate, useTheme } from 'hooks';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { themeType } from 'theme';
import * as Yup from 'yup';

interface Props {
    navigation: StackNavigationProp<any, any>;
}

const EditPasswordScreen = memo(function EditPasswordScreen({ navigation }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const navigate = useNavigate();
    //swr
    const { updateOrAddCustomerInfo } = useCustomerSwr('all', { revalidateOnMount: false });
    //value
    //formik
    const editPasswordSchema = Yup.object().shape({
        password: Yup.string().required('Vui lòng nhập mật khẩu củ của bạn !'),
        new_password: Yup.string()
            .required('Mật khẩu không được bỏ trống !')
            .min(6, 'Mật khẩu tối thiểu nhất 6 kí tự'),
        new_password_repeat: Yup.string()
            .required('Vui lòng xác nhận lại mật khẩu của bạn !')
            .min(6, 'Mật khẩu tối thiểu 6 kí tự !')
            .oneOf([Yup.ref('new_password')], 'Nhập lại mật khẩu không đúng'), //confirm_password
    });
    const formik = useFormik({
        initialValues: {
            password: '',
            new_password: '',
            new_password_repeat: '',
        },
        validationSchema: editPasswordSchema,
        onSubmit: (values) => {
            // dispatch(PUT_CUSTOMER_INFO({ type: 'change-password', data: { ...values } }));
            updateOrAddCustomerInfo('change-password', values);
        },
    });

    return (
        <>
            <Header
                centerComponent={{
                    text: 'Chỉnh sửa tài khoản',
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
                containerStyle={{ borderBottomWidth: 1 }}
                shadow
            />
            <View style={styles.view_containerEditScreen}>
                <View style={{ paddingBottom: theme.spacings.small }}>
                    <Text mb="small">Mật khẩu hiện tại</Text>
                    <TextInput
                        autoFocus
                        isPassword
                        value={formik.values.password}
                        onChangeText={formik.handleChange('password')}
                        placeholder="Nhập mật khẩu hiện tại"
                        helperText={
                            formik.touched.password && formik.errors.password
                                ? formik.errors.password
                                : undefined
                        }
                        autoComplete="off"
                    />
                </View>
                <View style={{ paddingBottom: theme.spacings.small }}>
                    <Text>Mật khẩu mới</Text>
                    <TextInput
                        isPassword
                        onChangeText={formik.handleChange('new_password')}
                        value={formik.values.new_password}
                        placeholder="Nhập mật khẩu mới"
                        containerStyle={{
                            // borderColor: theme.colors.main["600"],
                            marginTop: theme.spacings.tiny,
                        }}
                        helperText={
                            formik.touched.new_password && formik.errors.new_password
                                ? formik.errors.new_password
                                : undefined
                        }
                        autoComplete="off"
                    />
                </View>
                <View style={{ paddingBottom: theme.spacings.medium }}>
                    <Text>Nhập lại mật khẩu mới</Text>
                    <TextInput
                        isPassword
                        value={formik.values.new_password_repeat}
                        onChangeText={formik.handleChange('new_password_repeat')}
                        placeholder="Nhập lại mật khẩu mới"
                        containerStyle={{
                            borderColor: theme.colors.main['600'],
                            marginTop: theme.spacings.tiny,
                        }}
                        helperText={
                            formik.touched.new_password_repeat && formik.errors.new_password_repeat
                                ? formik.errors.new_password_repeat
                                : undefined
                        }
                        autoComplete="off"
                    />
                </View>

                <Button
                    title={'Lưu thay đổi'}
                    containerWidth={'100%'}
                    onPress={() => formik.handleSubmit()}
                />
                <Touch
                    mt="medium"
                    onPress={navigate.FORGOT_PASSWORD_ROUTE({ beforeAction: 'goback_2' })}
                >
                    <Text color={theme.colors.main['600']} tD="underline">
                        Quên mật khẩu
                    </Text>
                </Touch>
            </View>
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

export default EditPasswordScreen;
