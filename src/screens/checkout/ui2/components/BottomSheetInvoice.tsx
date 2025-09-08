/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable radix */
import { Icon } from '@rneui/themed';
import BottomSheet from 'components/BottomSheet';
import BottomSheetAddressLocation from 'components/BottomSheetAddressLocation.tsx';
import Button from 'components/Button';
import Text from 'components/Text';
import TextInput from 'components/TextInput';
import Touch from 'components/Touch';
import View from 'components/View';
import { NAVIGATION_ADDRESS_STACK, NAVIGATION_TO_ADDRESS_SCREEN } from 'const/routes';
import { LocationState } from 'features/address/addressSlice';
import { useFormik } from 'formik';
import { useNavigation, useTheme } from 'hooks';
import { CartAddressSWRType } from 'hooks/swr/cartSwr/useCartAddressSwr';
import { DataAddressType } from 'models';
import React, { memo, useEffect, useState } from 'react';
import { ScrollView, StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

interface Props {
    trigger: React.ReactNode;
    triggerStyle: StyleProp<ViewStyle>;
    cartBillingSWR: CartAddressSWRType;
}

const BottomSheetInvoice = memo(function BottomSheetInvoice({
    trigger,
    triggerStyle,
    cartBillingSWR,
}: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles();
    const navigation = useNavigation();
    //state
    const [visible, setVisible] = useState(false);
    const [openSheetLocation, setOpenSheetLocation] = useState(false);
    const [locationName, setLocationName] = useState({
        province: '',
        district: '',
        ward: '',
    });
    //swr
    const { cartAddress: billingAddress, putCartAddress } = cartBillingSWR;
    //form
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            firstname: '',
            lastname: '',
            telephone: '',
            street: '',
            province_id: '',
            district_id: '',
            ward_id: '',
            vat_id: '',
            is_default_shipping: 'N',
            is_default_billing: 'N',
        },
        onSubmit: async (values: DataAddressType) => {
            const checkUpdate = await putCartAddress(values, 'billing');
            if (checkUpdate) {
                visibleBottomSheet();
            }
        },
    });

    //Effect
    useEffect(() => {
        if (billingAddress && visible) {
            formik.setValues({
                firstname: billingAddress.firstname,
                lastname: billingAddress.lastname,
                telephone: billingAddress.telephone,
                street: billingAddress.street,
                province_id: billingAddress.province_id,
                district_id: billingAddress.district_id,
                ward_id: billingAddress.ward_id,
                vat_id: billingAddress.vat_id,
                is_default_shipping: billingAddress.is_default_shipping,
                is_default_billing: billingAddress.is_default_billing,
            });
            setLocationName({
                province: billingAddress.province,
                district: billingAddress.district,
                ward: billingAddress.ward,
            });
        }
    }, [billingAddress, visible]);
    //handle
    const visibleBottomSheet = () => {
        setVisible((pre) => !pre);
    };

    const visibleSheetLocation = () => {
        setOpenSheetLocation((pre) => !pre);
    };

    const handleChangeLocation = (address: LocationState) => {
        formik.setFieldValue('province_id', address.province?.id);
        formik.setFieldValue('district_id', address.district?.id);
        formik.setFieldValue('ward_id', address.ward?.id);
        setLocationName({
            province: address.province?.name || '',
            district: address.district?.name || '',
            ward: address.ward?.name || '',
        });
    };

    // navigate
    const navigateAddressList = () => {
        navigation.push(NAVIGATION_ADDRESS_STACK, {
            screen: NAVIGATION_TO_ADDRESS_SCREEN,
            params: { type: 'billing' },
        });
        visibleBottomSheet();
    };

    return (
        <>
            <TouchableOpacity style={triggerStyle} activeOpacity={0.7} onPress={visibleBottomSheet}>
                {trigger}
            </TouchableOpacity>
            <BottomSheet
                isVisible={visible}
                radius
                onBackdropPress={visibleBottomSheet}
                triggerOnClose={visibleBottomSheet}
                viewContainerStyle={{ padding: 0 }}
            >
                <View
                    style={{
                        padding: theme.spacings.medium,
                        borderBottomWidth: 1,
                        borderBottomColor: theme.colors.grey_[200],
                        position: 'relative',
                    }}
                >
                    <Text
                        style={{
                            fontWeight: 'bold',

                            fontSize: theme.typography.body2,
                            textAlign: 'center',
                        }}
                    >
                        Hoá đơn
                    </Text>
                    <Touch
                        style={{
                            position: 'absolute',
                            left: theme.spacings.medium,
                            top: theme.spacings.medium,
                        }}
                        onPress={navigateAddressList}
                    >
                        <Text color={theme.colors.main[600]} fw="bold">
                            Sổ địa chỉ
                        </Text>
                    </Touch>
                </View>

                {/* form */}

                <ScrollView>
                    <View p="medium" gap={theme.spacings.medium}>
                        <View>
                            <Text fw="bold" mb="small">
                                Tên của bạn
                            </Text>
                            <TextInput
                                size="md"
                                onChangeText={formik.handleChange('firstname')}
                                onBlur={formik.handleBlur('firstname')}
                                value={formik.values.firstname}
                            />
                            {formik.errors.firstname && formik.touched.firstname && (
                                <Text color={theme.colors.red['500']} size={'sub3'}>
                                    {formik.errors.firstname}
                                </Text>
                            )}
                        </View>
                        <View>
                            <Text fw="bold" mb="small">
                                Họ và tên đệm
                            </Text>
                            <TextInput
                                size="md"
                                onChangeText={formik.handleChange('lastname')}
                                onBlur={formik.handleBlur('lastname')}
                                value={formik.values.lastname}
                            />
                            {formik.errors.lastname && formik.touched.lastname && (
                                <Text color={theme.colors.red['500']} size={'sub3'}>
                                    {formik.errors.lastname}
                                </Text>
                            )}
                        </View>
                        <View>
                            <Text fw="bold" mb="small">
                                Địa chỉ
                            </Text>
                            <TextInput
                                size="md"
                                onChangeText={formik.handleChange('street')}
                                onBlur={formik.handleBlur('street')}
                                value={formik.values.street}
                            />
                            {formik.errors.street && formik.touched.street && (
                                <Text color={theme.colors.red['500']} size={'sub3'}>
                                    {formik.errors.street}
                                </Text>
                            )}
                        </View>
                        <View>
                            <Text fw="bold" mb="small">
                                Mã số thuế
                            </Text>
                            <TextInput
                                size="md"
                                onChangeText={formik.handleChange('vat_id')}
                                onBlur={formik.handleBlur('vat_id')}
                                value={formik.values.vat_id}
                            />
                        </View>
                        <View>
                            <Text fw="bold" mb="small">
                                Tỉnh thành
                            </Text>
                            <Touch style={styles.touch_location} onPress={visibleSheetLocation}>
                                <Text>{locationName.province}</Text>
                                <Icon
                                    type="ionicon"
                                    name="chevron-forward"
                                    color={theme.colors.grey_[400]}
                                    size={theme.typography.size(17)}
                                />
                            </Touch>
                        </View>
                        <View>
                            <Text fw="bold" mb="small">
                                Quận huyện
                            </Text>
                            <Touch style={styles.touch_location} onPress={visibleSheetLocation}>
                                <Text>{locationName.district}</Text>
                                <Icon
                                    type="ionicon"
                                    name="chevron-forward"
                                    color={theme.colors.grey_[400]}
                                    size={theme.typography.size(17)}
                                />
                            </Touch>
                        </View>
                        <View>
                            <Text fw="bold" mb="small">
                                Xã phường
                            </Text>
                            <Touch style={styles.touch_location} onPress={visibleSheetLocation}>
                                <Text>{locationName.ward}</Text>
                                <Icon
                                    type="ionicon"
                                    name="chevron-forward"
                                    color={theme.colors.grey_[400]}
                                    size={theme.typography.size(17)}
                                />
                            </Touch>
                        </View>
                    </View>
                    <View flexDirect="row" ph={'medium'} gap={theme.spacings.medium}>
                        <Button
                            title={'Đóng'}
                            type="outline"
                            flex={1}
                            color={theme.colors.grey_[300]}
                        />
                        <Button
                            title={'Lưu'}
                            type="solid"
                            flex={1}
                            bgColor={theme.colors.main[600]}
                            onPress={() => formik.handleSubmit()}
                        />
                    </View>
                </ScrollView>
                <BottomSheetAddressLocation
                    open={openSheetLocation}
                    onSuccess={handleChangeLocation}
                    onClose={visibleSheetLocation}
                />
            </BottomSheet>
        </>
    );
});

export default BottomSheetInvoice;

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        touch_location: {
            paddingVertical: theme.dimens.sizeElement('md'),
            borderWidth: 1,
            paddingHorizontal: theme.spacings.medium,
            borderRadius: 5,
            borderColor: theme.colors.grey_[500],
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
    });
};
