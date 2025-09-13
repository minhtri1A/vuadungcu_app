/* eslint-disable react-hooks/exhaustive-deps */
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Icon } from '@rneui/themed';
import BottomSheet from 'components/BottomSheet';
import Button from 'components/Button';
import Header from 'components/Header2';
import Text from 'components/Text';
import TextInput from 'components/TextInput';
import Touch from 'components/Touch';
import View from 'components/View';
import { useFormik } from 'formik';
import withAuth from 'hoc/withAuth';
import { useNavigate, useTheme } from 'hooks';
import usePosCustomerInfoSWR from 'hooks/swr/posSwr/usePosCustomerInfoSWR';
import { RootStackParamsList } from 'navigation/type';
import React, { memo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { themeType } from 'theme';
import { currencyFormat } from 'utils/helpers';
import * as Yup from 'yup';

interface Props {
    route: RouteProp<RootStackParamsList['PosStack'], 'PosCustomerInfo'>;
    navigation: StackNavigationProp<any, any>;
}

type DataEditType = {
    key?: string;
    label: string;
    value?: string;
};

const PosCustomerInfo = memo(function PosCustomerInfo({ route }: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const navigate = useNavigate();
    //params
    const { seller_uuid, seller_name } = route.params;
    //state
    const [openSheetEdit, setOpenSheetEdit] = useState(false);
    //swr
    const { posCustomer, editCustomerInfo } = usePosCustomerInfoSWR(seller_uuid);

    // data
    const posInfo = [
        {
            label: 'Mã khách hàng',
            value: posCustomer?.pos_customer.taxid,
        },
        {
            label: 'Mã thẻ khách hàng',
            value: posCustomer?.pos_customer.card,
        },
    ];
    const posInfoEdit: Array<DataEditType> = [
        {
            key: 'name',
            label: 'Tên khách hàng',
            value: posCustomer?.pos_customer.name,
        },

        {
            key: 'region',
            label: 'Tỉnh thành',
            value: posCustomer?.pos_customer.region,
        },
        {
            key: 'city',
            label: 'Quận huyện',
            value: posCustomer?.pos_customer.city,
        },
        {
            key: 'address',
            label: 'Địa chỉ',
            value: posCustomer?.pos_customer.address,
        },
    ];

    // form
    const signinUserSchema = Yup.object().shape({
        name: Yup.string().required('Tên khách hàng không được trống!'),
    });
    const formik = useFormik({
        initialValues: {
            name: '',
            region: '',
            city: '',
            address: '',
        },
        validationSchema: signinUserSchema,
        onSubmit: async (values) => {
            const result = await editCustomerInfo(seller_uuid, values);
            if (result) {
                visibleSheetEdit();
            }
        },
    });

    //effect

    //handle
    const visibleSheetEdit = () => {
        if (!openSheetEdit) {
            formik.setValues({
                address: posCustomer?.pos_customer.address || '',
                city: posCustomer?.pos_customer.city || '',
                name: posCustomer?.pos_customer.name || '',
                region: posCustomer?.pos_customer.region || '',
            });
        }
        setOpenSheetEdit((pre) => !pre);
    };

    return (
        <>
            <Header
                center={
                    <Text size={'title2'} ta="center" color={theme.colors.white_[10]}>
                        Thông tin khách hàng
                    </Text>
                }
                showGoBack
                iconGoBackColor={theme.colors.black_[10]}
                bgColor={'#f59423'}
            />

            {/* event */}
            <View bg={theme.colors.bgMain}>
                <Text
                    fw="bold"
                    p={theme.spacings.medium}
                    color={theme.colors.grey_[500]}
                    bg={theme.colors.grey_[200]}
                >
                    Thông tin chung
                </Text>
                {posInfo.map((v, i) => (
                    <View style={styles.view_list} key={i}>
                        <Text fw="bold" p={theme.spacings.medium}>
                            {v.label}
                        </Text>
                        <View
                            flexDirect={'row'}
                            gap={theme.spacings.medium}
                            p={theme.spacings.medium}
                            aI="flex-end"
                        >
                            <Text color={theme.colors.grey_[600]}>{v.value}</Text>
                        </View>
                    </View>
                ))}
                <View bg={theme.colors.grey_[200]} flexDirect="row" jC="space-between">
                    <Text fw="bold" p={theme.spacings.medium} color={theme.colors.grey_[500]}>
                        Thông tin cá nhân
                    </Text>
                    <Touch
                        flexDirect={'row'}
                        gap={theme.spacings.medium}
                        p={theme.spacings.medium}
                        aI="flex-end"
                        activeOpacity={0.7}
                        onPress={visibleSheetEdit}
                    >
                        <Icon
                            type="material-community"
                            name="circle-edit-outline"
                            size={theme.typography.size(17)}
                            color={theme.colors.grey_[500]}
                        />
                    </Touch>
                </View>
                {posInfoEdit.map((v, i) => (
                    <View style={styles.view_list} key={i}>
                        <Text fw="bold" p={theme.spacings.medium}>
                            {v.label}
                        </Text>
                        <Text color={theme.colors.grey_[600]} p={theme.spacings.medium}>
                            {v.value}
                        </Text>
                    </View>
                ))}
                <View bg={theme.colors.grey_[200]}>
                    <Text fw="bold" p={theme.spacings.medium} color={theme.colors.grey_[500]}>
                        Tiện ích
                    </Text>
                </View>
                <Touch
                    style={styles.view_list}
                    pr={'small'}
                    activeOpacity={0.7}
                    onPress={navigate.POS_SCORE_ROUTE({
                        seller_uuid: seller_uuid,
                        seller_name: seller_name,
                    })}
                >
                    <Text fw="bold" p={theme.spacings.medium}>
                        Điểm tích luỹ
                    </Text>
                    <View flexDirect="row" aI="center">
                        <Text color={theme.colors.grey_[600]}>
                            {currencyFormat(posCustomer?.pos_customer.score || 0, false)} điểm
                        </Text>
                        <Icon
                            type="ionicon"
                            name="chevron-forward"
                            size={theme.typography.size(17)}
                            color={theme.colors.grey_[400]}
                        />
                    </View>
                </Touch>
                <Touch
                    style={styles.view_list}
                    pr={'small'}
                    activeOpacity={0.7}
                    onPress={navigate.POS_ORDERS_ROUTE({
                        seller_uuid,
                    })}
                >
                    <Text fw="bold" p={theme.spacings.medium}>
                        Đơn hàng
                    </Text>
                    <Icon
                        type="ionicon"
                        name="chevron-forward"
                        size={theme.typography.size(17)}
                        color={theme.colors.grey_[400]}
                    />
                </Touch>
            </View>

            <BottomSheet
                isVisible={openSheetEdit}
                viewContainerStyle={{ padding: 0 }}
                radius
                onBackdropPress={visibleSheetEdit}
                triggerOnClose={visibleSheetEdit}
            >
                <View>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            borderBottomWidth: 1,
                            padding: theme.spacings.medium,
                            borderBottomColor: theme.colors.grey_[300],
                            fontSize: theme.typography.body2,
                            textAlign: 'center',
                        }}
                    >
                        Chỉnh sửa thông tin
                    </Text>
                    <View
                        style={{
                            padding: theme.spacings.medium,
                            paddingBottom: 0,
                            gap: theme.spacings.medium,
                        }}
                    >
                        <View>
                            <Text fw="bold" mb="small">
                                Tên khách hàng<Text color={theme.colors.red[500]}>*</Text>
                            </Text>
                            <TextInput
                                size="md"
                                value={formik.values.name}
                                onChangeText={formik.handleChange('name')}
                                helperText={
                                    formik.errors.name && formik.touched.name
                                        ? formik.errors.name
                                        : undefined
                                }
                            />
                        </View>
                        <View>
                            <Text fw="bold" mb="small">
                                Tỉnh thành
                            </Text>
                            <TextInput
                                size="md"
                                value={formik.values.city}
                                onChangeText={formik.handleChange('city')}
                            />
                        </View>
                        <View>
                            <Text fw="bold" mb="small">
                                Quận huyện
                            </Text>
                            <TextInput
                                size="md"
                                value={formik.values.region}
                                onChangeText={formik.handleChange('region')}
                            />
                        </View>
                        <View>
                            <Text fw="bold" mb="small">
                                Địa chỉ
                            </Text>
                            <TextInput
                                size="md"
                                value={formik.values.address}
                                onChangeText={formik.handleChange('address')}
                            />
                        </View>
                        <Button title={'Lưu'} onPress={() => formik.handleSubmit()} />
                    </View>
                </View>
            </BottomSheet>
        </>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_list: {
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey_[200],
            justifyContent: 'space-between',
        },
    });

export default withAuth(PosCustomerInfo, true);
// export default PosCustomerInfo;
