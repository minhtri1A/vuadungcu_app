import { CheckBox } from '@rneui/themed';
import BottomSheet from 'components/BottomSheet';
import Button from 'components/Button';
import Text from 'components/Text';
import TextInput from 'components/TextInput';
import View from 'components/View';
import { useFormik } from 'formik';
import { useTheme } from 'hooks';
import { CustomerSwrType } from 'models';
import moment from 'moment';
import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { themeType } from 'theme';
import * as Yup from 'yup';

//chỉnh sửa thông tin cơ bản của kh: họ tên, giới tính

interface Props {
    open?: boolean;
    handleCloseEditModal(): any;
    typeEdit?: string;
    customerSwr: CustomerSwrType;
}

//put customer info - name and gender
export default memo(function EditModal({
    open,
    handleCloseEditModal,
    typeEdit,
    customerSwr,
}: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles(theme);
    //swr
    const {
        customers: { firstname, lastname, gender, dob },
        updateOrAddCustomerInfo,
    } = customerSwr;
    //value
    const personalInfo = { firstname, lastname, gender, dob };

    //formik
    const nameSchema = Yup.object().shape({
        lastname: Yup.string().required('Họ của bạn không được để trống !'),
        firstname: Yup.string().required('Tên của bạn không được để trống !'),
    });
    const genderSchema = Yup.object().shape({
        gender: Yup.string()
            .required('Vui lòng chọn giới tính !')
            .matches(/(M|F|O)/, 'Vui lòng chọn giới tính ! ')
            .nullable(),
    });
    const formik = useFormik({
        initialValues: {
            firstname: personalInfo?.firstname,
            lastname: personalInfo?.lastname,
            gender: personalInfo?.gender,
        },
        onSubmit: (values) => {
            const data = {
                ...personalInfo,
                firstname: values.firstname,
                lastname: values.lastname,
                gender: values.gender,
                dob: moment(personalInfo?.dob ? personalInfo?.dob : undefined).format('YYYY-MM-DD'),
            };
            // dispatch(PUT_CUSTOMER_INFO({ type: 'profile', data }));
            updateOrAddCustomerInfo('profile', data);
            handleCloseEditModal();
        },
        enableReinitialize: true,
        validationSchema: typeEdit === 'gender' ? genderSchema : nameSchema,
    });

    const handleChangeGender = (gender: string) => () => {
        formik.setFieldValue('gender', gender);
    };

    return (
        <BottomSheet isVisible={open} onBackdropPress={handleCloseEditModal} radius>
            {typeEdit !== 'gender' ? (
                /* name */
                <>
                    <Text ta="center" size={'body3'} mb="small">
                        Họ tên
                    </Text>
                    <TextInput
                        placeholder="Nhập họ của bạn"
                        autoFocus
                        containerStyle={{ borderColor: theme.colors.main['600'] }}
                        value={formik.values.lastname}
                        viewContainerStyle={{ paddingTop: theme.spacings.small }}
                        helperText={
                            formik.touched.lastname && formik.errors.lastname
                                ? formik.errors.lastname
                                : undefined
                        }
                        onChangeText={formik.handleChange('lastname')}
                    />
                    <TextInput
                        placeholder="Nhập tên của bạn"
                        autoFocus
                        containerStyle={{ borderColor: theme.colors.main['600'] }}
                        value={formik.values.firstname}
                        viewContainerStyle={{ paddingVertical: theme.spacings.small }}
                        helperText={
                            formik.touched.firstname && formik.errors.firstname
                                ? formik.errors.firstname
                                : undefined
                        }
                        onChangeText={formik.handleChange('firstname')}
                    />
                </>
            ) : (
                /* radio gender */
                <View pv={'small'}>
                    <Text ta="center" size={'body3'}>
                        Giới tính
                    </Text>
                    {/* female */}
                    <CheckBox
                        checked={formik.values.gender === 'F'}
                        onPress={handleChangeGender('F')}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        title={<Text>Nữ</Text>}
                        iconRight
                        containerStyle={styles.radio_container}
                        wrapperStyle={styles.radio_wrapper}
                        checkedColor={theme.colors.main['600']}
                    />
                    {/* male */}
                    <CheckBox
                        checked={formik.values.gender === 'M'}
                        onPress={handleChangeGender('M')}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        title={<Text>Nam</Text>}
                        iconRight
                        containerStyle={styles.radio_container}
                        wrapperStyle={styles.radio_wrapper}
                        checkedColor={theme.colors.main['600']}
                    />
                    {/* other */}
                    <CheckBox
                        checked={formik.values.gender === 'O'}
                        onPress={handleChangeGender('O')}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        title={<Text>Khác</Text>}
                        iconRight
                        containerStyle={styles.radio_container}
                        wrapperStyle={styles.radio_wrapper}
                        checkedColor={theme.colors.main['600']}
                    />
                    {formik.errors.gender ? (
                        <Text pattern="error">{formik.errors.gender}</Text>
                    ) : null}
                </View>
            )}

            <Button
                title={'Lưu thay đổi'}
                width={'100%'}
                onPress={() => formik.handleSubmit()}
                disabled={
                    typeEdit !== 'gender' &&
                    formik.values.firstname === personalInfo?.firstname &&
                    formik.values.lastname === personalInfo?.lastname
                }
            />
        </BottomSheet>
    );
});

const useStyles = (_: themeType) =>
    StyleSheet.create({
        /* -------edit modal------- */
        view_titleButtonClose: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        radio_container: {
            // backgroundColor: 'red',
            // width: theme.dimens.width,
            padding: 0,
        },
        radio_wrapper: {
            justifyContent: 'space-between',
        },
    });
