import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ListItem } from '@rneui/themed';
import BottomSheetAddressLocation from 'components/BottomSheetAddressLocation.tsx';
import Button from 'components/Button';
import Header from 'components/Header';
import Switch from 'components/Switch';
import Text from 'components/Text';
import { RESET_LOCATION_VALUE } from 'features/action';
import { LocationState } from 'features/address/addressSlice';
import { useFormik } from 'formik';
import { useAppDispatch, useCartAddressSwr, useCustomerAddress, useTheme } from 'hooks';
import { isEmpty } from 'lodash';
import { DataAddressType, DataUpdateCustomerAddressType } from 'models';
import { AddressStackParamsList } from 'navigation/type';
import React, { memo, useEffect, useState } from 'react';
import { View } from 'react-native';
import * as Yup from 'yup';
import useStyles from './styles';
/* eslint-disable react-hooks/exhaustive-deps */

interface Props {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<AddressStackParamsList, 'AddressForm'>;
}

const AddressForm = memo(function AddressForm({ route }: Props) {
    //hook
    const dispatch = useAppDispatch();
    const { theme } = useTheme();
    const styles = useStyles();

    //params
    const type = route.params.type;

    //swr
    const { createCustomerAddress, updateCustomerAddress } = useCustomerAddress();
    const { putCartAddress } = useCartAddressSwr('shipping', { revalidateOnMount: false });

    //state
    const [locationSelected, setLocationSelected] = useState<LocationState>();

    //--location
    const [openLocationSheet, setOpenLocationSheet] = useState(false);
    //value
    const addressEdit = route.params?.addressEdit;

    //formik
    const phoneRegexp = /^0\d{9}$/;
    const [initValue, setInitValue] = useState<DataAddressType>({
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
    });

    //formik
    const addressSchema = Yup.object().shape({
        firstname: Yup.string().required('Họ và tên đệm không được trống !'),
        lastname: Yup.string().required('Tên không được trống !'),
        telephone: Yup.string()
            .required('Số điện thoại không được trống !')
            .matches(phoneRegexp, 'Số điện thoại không hợp lệ'),
        street: Yup.string().required('địa chỉ không được trống !'),
        province_id: Yup.string().required('Vui lòng chọn tỉnh thành !'),
        district_id: Yup.string().required('Vui lòng chọn Quận/Huyện !'),
        ward_id: Yup.string().required('Vui lòng chọn Xã/Phường !'),
    });
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initValue,
        validationSchema: addressSchema,
        onSubmit: async (values: DataAddressType) => {
            //@ customer address
            if (type === 'customer') {
                // create
                if (isEmpty(addressEdit)) {
                    createCustomerAddress(values, locationSelected);
                    return;
                }
                //update
                const address_uuid: any = addressEdit?.address_uuid;
                const addressUpdate: DataUpdateCustomerAddressType = {
                    ...values,
                    update_type: 'update_address',
                };
                updateCustomerAddress(address_uuid, addressUpdate);
                return;
            }

            //@ type shipping address or billing adderss
            //-- create
            if (isEmpty(addressEdit)) {
                createCustomerAddress(values, locationSelected, true, false);
                //update cart address
                putCartAddress(values, type);
                //create customer address

                return;
            }
            //-- update
            //---update customer address
            const address_uuid: any = addressEdit?.address_uuid;
            const addressUpdate: DataUpdateCustomerAddressType = {
                ...values,
                update_type: 'update_address',
            };
            putCartAddress(values, type);
            updateCustomerAddress(address_uuid, addressUpdate, true, false);
            //---update cart address
        },
    });

    //effect
    useEffect(() => {
        //handle edit address
        if (!isEmpty(addressEdit)) {
            const address: any = addressEdit;
            setInitValue(address);
            return;
        }
        // check local address
        (async () => {
            const guestAddressLocal = await AsyncStorage.getItem('guest-address');
            //ưu tiên lấy guest address để tính phí vận chuyển
            if (guestAddressLocal) {
                const guestAddress = JSON.parse(guestAddressLocal);
                setInitValue({
                    ...formik.values,
                    province_id: guestAddress?.province?.id || '',
                    district_id: guestAddress?.district?.id || '',
                    ward_id: guestAddress?.ward?.id || '',
                });
                setLocationSelected(guestAddress);
                return;
            }
        })();

        return () => {
            dispatch(RESET_LOCATION_VALUE());
        };
    }, []);

    useEffect(() => {
        if (addressEdit) {
            setLocationSelected({
                province: {
                    id: addressEdit.province_id,
                    name: addressEdit.province,
                },
                district: {
                    id: addressEdit.district_id,
                    name: addressEdit.district,
                },
                ward: {
                    id: addressEdit.ward_id,
                    name: addressEdit.ward,
                },
            });
        }
    }, [addressEdit]);

    //handle
    const visibleLocationSheet = () => {
        setOpenLocationSheet((pre) => !pre);
    };

    const getAddressSuccessFromSheet = (location: LocationState) => {
        if (location) {
            setInitValue({
                ...formik.values,
                province_id: location?.province?.id || '',
                district_id: location?.district?.id || '',
                ward_id: location?.ward?.id || '',
            });
            setLocationSelected(location);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <Header
                backgroundColor={theme.colors.white_[10]}
                centerComponent={{
                    text: isEmpty(addressEdit) ? 'Thêm mới địa chỉ' : 'Cập nhật địa chỉ',
                    style: { fontSize: theme.typography.title1, color: theme.colors.black_[10] },
                }}
                shadow
                statusBarColor={theme.colors.main['600']}
            />
            {/* from */}
            <View>
                {/* name */}
                <ListItem bottomDivider containerStyle={styles.list_container} hasTVPreferredFocus>
                    <ListItem.Content>
                        <ListItem.Title style={styles.list_title_style}>
                            Họ và tên đệm<Text color={theme.colors.red[500]}>*</Text>
                        </ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Input
                        placeholder={'Nhập họ và tên đệm'}
                        style={styles.list_input_style}
                        onChangeText={formik.handleChange('lastname')}
                        onBlur={formik.handleBlur('lastname')}
                        value={formik.values.lastname}
                        autoFocus
                    />
                </ListItem>
                {formik.errors.lastname && formik.touched.lastname ? (
                    <View style={styles.v_errorFormik}>
                        <ListItem.Subtitle style={{ color: theme.colors.red['500'] }}>
                            {formik.errors.lastname}
                        </ListItem.Subtitle>
                    </View>
                ) : null}
                {/* lastname  */}

                <ListItem bottomDivider containerStyle={styles.list_container} hasTVPreferredFocus>
                    <ListItem.Title style={styles.list_title_style}>
                        Tên<Text color={theme.colors.red[500]}>*</Text>
                    </ListItem.Title>
                    <ListItem.Input
                        placeholder={'Nhập tên của bạn'}
                        style={styles.list_input_style}
                        onChangeText={formik.handleChange('firstname')}
                        onBlur={formik.handleBlur('firstname')}
                        value={formik.values.firstname}
                    />
                </ListItem>
                {formik.errors.firstname && formik.touched.firstname ? (
                    <View style={styles.v_errorFormik}>
                        <ListItem.Subtitle style={{ color: theme.colors.red['500'] }}>
                            {formik.errors.firstname}
                        </ListItem.Subtitle>
                    </View>
                ) : null}
                {/* mobile */}
                <ListItem bottomDivider containerStyle={styles.list_container} hasTVPreferredFocus>
                    <ListItem.Title style={styles.list_title_style}>
                        Số điện thoại<Text color={theme.colors.red[500]}>*</Text>
                    </ListItem.Title>
                    <ListItem.Input
                        placeholder={'Nhập số điện thoại'}
                        style={styles.list_input_style}
                        onChangeText={formik.handleChange('telephone')}
                        onBlur={formik.handleBlur('telephone')}
                        value={formik.values.telephone}
                    />
                </ListItem>
                {formik.errors.telephone && formik.touched.telephone ? (
                    <View style={styles.v_errorFormik}>
                        <ListItem.Subtitle style={{ color: theme.colors.red['500'] }}>
                            {formik.errors.telephone}
                        </ListItem.Subtitle>
                    </View>
                ) : null}
                {/* vat */}
                <ListItem bottomDivider containerStyle={styles.list_container} hasTVPreferredFocus>
                    <ListItem.Title style={styles.list_title_style}>Mã số thuế</ListItem.Title>
                    <ListItem.Input
                        placeholder={'Mã số thuế'}
                        style={styles.list_input_style}
                        onChangeText={formik.handleChange('vat_id')}
                        onBlur={formik.handleBlur('vat_id')}
                        value={formik.values.vat_id}
                    />
                </ListItem>
                {formik.errors.telephone && formik.touched.telephone ? (
                    <View style={styles.v_errorFormik}>
                        <ListItem.Subtitle style={{ color: theme.colors.red['500'] }}>
                            {formik.errors.telephone}
                        </ListItem.Subtitle>
                    </View>
                ) : null}
                {/* address */}
                <ListItem bottomDivider containerStyle={styles.list_container} hasTVPreferredFocus>
                    <ListItem.Title style={styles.list_title_style}>
                        Địa chỉ<Text color={theme.colors.red[500]}>*</Text>
                    </ListItem.Title>
                    <ListItem.Input
                        placeholder={'Nhập số nhà, tên đường,...'}
                        style={styles.list_input_style}
                        onChangeText={formik.handleChange('street')}
                        onBlur={formik.handleBlur('street')}
                        value={formik.values.street}
                    />
                </ListItem>
                {formik.errors.street && formik.touched.street ? (
                    <View style={styles.v_errorFormik}>
                        <ListItem.Subtitle style={{ color: theme.colors.red['500'] }}>
                            {formik.errors.street}
                        </ListItem.Subtitle>
                    </View>
                ) : null}
                {/* region */}
                <ListItem
                    hasTVPreferredFocus
                    bottomDivider
                    containerStyle={styles.list_container}
                    onPress={visibleLocationSheet}
                >
                    <ListItem.Title style={styles.list_title_location_style}>
                        Tỉnh / Thành Phố<Text color={theme.colors.red[500]}>*</Text>
                    </ListItem.Title>
                    <ListItem.Input
                        style={styles.list_input_style}
                        value={locationSelected?.province?.name || addressEdit?.province}
                        disabled
                    />
                    <ListItem.Chevron size={theme.typography.body2} />
                </ListItem>
                {formik.errors.province_id && formik.touched.province_id ? (
                    <View style={styles.v_errorFormik}>
                        <ListItem.Subtitle style={{ color: theme.colors.red['500'] }}>
                            {formik.errors.province_id}
                        </ListItem.Subtitle>
                    </View>
                ) : null}
                {/* districts */}
                <ListItem
                    bottomDivider={true}
                    containerStyle={styles.list_container}
                    onPress={visibleLocationSheet}
                >
                    <ListItem.Title style={styles.list_title_location_style}>
                        Quận / Huyện<Text color={theme.colors.red[500]}>*</Text>
                    </ListItem.Title>
                    <ListItem.Input
                        style={styles.list_input_style}
                        value={locationSelected?.district?.name || addressEdit?.district}
                        disabled
                    />
                    <ListItem.Chevron size={theme.typography.body3} />
                </ListItem>
                {formik.errors.district_id && formik.touched.district_id ? (
                    <View style={styles.v_errorFormik}>
                        <ListItem.Subtitle style={{ color: theme.colors.red['500'] }}>
                            {formik.errors.district_id}
                        </ListItem.Subtitle>
                    </View>
                ) : null}
                {/* ward */}
                <ListItem
                    bottomDivider
                    containerStyle={styles.list_container}
                    onPress={visibleLocationSheet}
                >
                    <ListItem.Title style={styles.list_title_location_style}>
                        Xã / Phường<Text color={theme.colors.red[500]}>*</Text>
                    </ListItem.Title>
                    <ListItem.Input
                        style={styles.list_input_style}
                        value={locationSelected?.ward?.name || addressEdit?.ward}
                        disabled
                    />
                    <ListItem.Chevron size={theme.typography.body2} />
                </ListItem>
                {formik.errors.ward_id && formik.touched.ward_id ? (
                    <View style={styles.v_errorFormik}>
                        <ListItem.Subtitle style={{ color: theme.colors.red['500'] }}>
                            {formik.errors.ward_id}
                        </ListItem.Subtitle>
                    </View>
                ) : null}
            </View>
            {/* default address */}
            <ListItem bottomDivider containerStyle={styles.list_defaultAddress}>
                <ListItem.Title style={styles.list_title_style}>Vận chuyển mặc định</ListItem.Title>
                <Switch
                    value={formik.values.is_default_shipping === 'Y' ? true : false}
                    onValueChange={(value) => {
                        const isDefault = value ? 'Y' : 'N';
                        formik.setFieldValue('is_default_shipping', isDefault);
                    }}
                />
            </ListItem>
            {/* default address */}
            <ListItem bottomDivider containerStyle={styles.list_defaultAddress}>
                <ListItem.Title style={styles.list_title_style}>Thanh toán mặc định</ListItem.Title>
                <Switch
                    value={formik.values.is_default_billing === 'Y' ? true : false}
                    onValueChange={(value) => {
                        const isDefault = value ? 'Y' : 'N';
                        formik.setFieldValue('is_default_billing', isDefault);
                    }}
                />
            </ListItem>

            {/* button add new */}
            <View style={styles.v_btnAddnew}>
                <Button
                    title={isEmpty(addressEdit) ? 'Thêm mới' : 'Cập nhật'}
                    containerWidth={'100%'}
                    onPress={() => formik.handleSubmit()}
                />
            </View>

            {/* modal */}
            <BottomSheetAddressLocation
                open={openLocationSheet}
                defaultLocation={locationSelected}
                onSuccess={getAddressSuccessFromSheet}
                onClose={visibleLocationSheet}
            />
        </View>
    );
});

export default AddressForm;
