import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Icon } from '@rneui/themed';
import Alert2 from 'components/Alert2';
import Button from 'components/Button';
import Header from 'components/Header';
import IconButton from 'components/IconButton';
import Text from 'components/Text';
import Touch from 'components/Touch';
import View from 'components/View';
import { NAVIGATION_TO_ADDRESS_FORM_SCREEN } from 'const/routes';
import withAuth from 'hoc/withAuth';
import { useCartAddressSwr, useCustomerAddress, useNavigate, useTheme } from 'hooks';
import { useRefreshControl } from 'hooks/useRefreshControl';
import {
    CartAddressResponseType,
    CustomerAddressType,
    DataUpdateCustomerAddressType,
} from 'models';
import { AddressStackParamsList } from 'navigation/type';
import React, { memo } from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { themeType } from 'theme';
import { isEmpty } from 'utils/helpers';

/* eslint-disable react-hooks/exhaustive-deps */

interface Props {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<AddressStackParamsList, 'AddressScreen'>;
}

const AddressScreen = memo(function AddressScreen({ navigation, route }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const navigate = useNavigate();

    //params
    const type = route.params.type;
    //swr
    const {
        listCustomerAddress,
        updateCustomerAddress,
        deleteCustomerAddress,
        mutate: mutateCustomerAddress,
    } = useCustomerAddress();
    const {
        cartAddress: cartShipping,
        putCartAddress,
        mutate: mutateShippingAddress,
    } = useCartAddressSwr('shipping');
    const {
        cartAddress: cartBilling,
        putCartAddress: putCartAddressBillingAddress,
        mutate: mutateBillingAddress,
    } = useCartAddressSwr('billing');
    // refresh
    const { refreshControl } = useRefreshControl(() => {
        mutateCustomerAddress();
        type === 'shipping' && mutateShippingAddress();
        type === 'billing' && mutateBillingAddress();
    });

    //state
    //value

    //ref

    /* --- handle --- */
    //-- chọn địa chỉ cho giỏ hàng từ danh sách địa chỉ
    const updateCartShipping = (customer_address: CustomerAddressType) => async () => {
        const checkUpdate = await putCartAddress(customer_address, 'shipping');
        if (checkUpdate) {
            navigation.goBack();
        }
    };
    //-- chọn địa chỉ xuat hoa don từ danh sách địa chỉ
    const updateCartBilling = (customer_address: CustomerAddressType) => async () => {
        const checkUpdate = await putCartAddressBillingAddress(customer_address, 'billing');
        if (checkUpdate) {
            navigation.goBack();
        }
    };

    //--default address
    const updateDefaultCustomerAddress =
        (
            default_type: 'is_default_billing' | 'is_default_shipping',
            customer_address: CustomerAddressType
        ) =>
        () => {
            const address: DataUpdateCustomerAddressType = {
                ...customer_address,
                [default_type]: 'Y',
                update_type: 'update_default_address',
            };
            updateCustomerAddress(customer_address.address_uuid, address, false);
        };
    //--remove address
    const handleDeleteCustomerAddress = (address_uuid: string) => () => {
        deleteCustomerAddress(address_uuid);
    };

    /* --- render --- */
    const renderListAddress = () =>
        listCustomerAddress.map((v, i) => (
            <View style={styles.view_item} key={i}>
                <View flexDirect="row" jC="space-between" aI="center">
                    <View flexDirect="row" aI="center">
                        <Icon type="ionicon" name="location" color={theme.colors.red['400']} />
                        <Text fw="bold" ml={'tiny'} color={theme.colors.black_[10]}>
                            {v?.firstname} {v?.lastname}
                        </Text>
                    </View>
                    <View flexDirect="row" gap={theme.spacings.medium}>
                        {v.is_default_shipping === 'N' && v.is_default_billing === 'N' && (
                            <Alert2
                                title="Bạn chắc chắn muốn xoá địa chỉ này?"
                                trigger={
                                    <Icon
                                        type="ionicon"
                                        name="trash-outline"
                                        color={theme.colors.grey_[400]}
                                        size={theme.typography.size(17)}
                                    />
                                }
                                onOk={handleDeleteCustomerAddress(v.address_uuid)}
                            />
                        )}

                        <Touch activeOpacity={0.8} onPress={navigateEditAddress(v)}>
                            <Icon
                                type="material-community"
                                name="circle-edit-outline"
                                color={theme.colors.grey_[500]}
                                size={theme.typography.size(17)}
                            />
                        </Touch>
                    </View>
                </View>
                <View ph={'medium'} pv={'small'}>
                    <Text color={theme.colors.grey_['600']}>{v.telephone}</Text>
                    <Text color={theme.colors.grey_['600']}>{v.street}</Text>
                    <Text>
                        {v?.ward}, {v?.district}, {v?.province}
                    </Text>
                </View>
                {type === 'shipping' ? (
                    <Button
                        title="Giao tới địa chỉ này"
                        type="outline"
                        titleSize={'body2'}
                        linear={false}
                        color={theme.colors.main['500']}
                        onPress={updateCartShipping(v)}
                        size="sm"
                    />
                ) : type === 'billing' ? (
                    <Button
                        title="Chọn xuất hoá đơn"
                        type="outline"
                        titleSize={'body2'}
                        linear={false}
                        color={theme.colors.main['500']}
                        onPress={updateCartBilling(v)}
                        size="sm"
                    />
                ) : (
                    <View flexDirect="row" jC="center" gap={theme.spacings.medium}>
                        {v.is_default_shipping === 'Y' && (
                            <Text color={theme.colors.teal['500']} ta="right">
                                [Vận chuyển mặc định]
                            </Text>
                        )}
                        {v.is_default_billing === 'Y' && (
                            <Text color={theme.colors.cyan['500']} ta="right">
                                [Thanh toán mặc định]
                            </Text>
                        )}
                        {v.is_default_shipping === 'N' && (
                            <Touch
                                style={styles.touch_set_default}
                                onPress={updateDefaultCustomerAddress('is_default_shipping', v)}
                                activeOpacity={0.6}
                            >
                                <Text color={theme.colors.main[600]}>Đặt vận chuyển</Text>
                            </Touch>
                        )}
                        {v.is_default_billing === 'N' && (
                            <Touch
                                style={styles.touch_set_default}
                                onPress={updateDefaultCustomerAddress('is_default_billing', v)}
                                activeOpacity={0.6}
                            >
                                <Text color={theme.colors.main[600]}>Đặt thanh toán</Text>
                            </Touch>
                        )}
                    </View>
                )}
            </View>
        ));

    const renderAddressSelected = (address: CartAddressResponseType) =>
        !isEmpty(address) ? (
            <View
                style={{
                    marginTop: theme.spacings.medium,
                    marginHorizontal: theme.spacings.medium,
                    backgroundColor: theme.colors.white_[10],
                    padding: theme.spacings.small,
                    borderRadius: 10,
                    borderColor: theme.colors.main['600'],
                    borderWidth: 1,
                }}
            >
                <View>
                    <View flexDirect="row" jC="space-between" aI="center">
                        <View flexDirect="row" aI="center">
                            <Icon type="ionicon" name="location" color={theme.colors.red['400']} />
                            <Text fw="bold" ml={'tiny'} color={theme.colors.black_[10]}>
                                {`${address?.lastname} ${address?.firstname}`}
                            </Text>
                        </View>
                        <Text color={theme.colors.main['600']}>[Đang chọn]</Text>
                    </View>
                    <View ph={'medium'} pv={'small'}>
                        <Text color={theme.colors.grey_['600']}>{address?.telephone}</Text>
                        <Text color={theme.colors.grey_['600']}>{address?.street}</Text>
                        <Text>
                            {address?.ward}, {address?.district}, {address?.province}
                        </Text>
                    </View>
                </View>
                {/* product item */}
            </View>
        ) : (
            <Text ta="center" mt="small" color={theme.colors.grey_[500]}>
                Bạn chưa có địa chỉ giao hàng
            </Text>
        );

    /* --- navigate --- */
    const navigateAddNewAddress = () => () => {
        navigation.navigate(NAVIGATION_TO_ADDRESS_FORM_SCREEN, {
            type: type,
        });
    };
    const navigateEditAddress = (value: CustomerAddressType) => () => {
        navigation.navigate(NAVIGATION_TO_ADDRESS_FORM_SCREEN, {
            addressEdit: value,
            type: type,
        });
    };

    return (
        <View style={styles.container}>
            <Header
                backgroundColor={theme.colors.white_[10]}
                centerComponent={{
                    text: type === 'customer' ? 'Danh sách địa chỉ' : 'Chọn địa chỉ',
                    style: { fontSize: theme.typography.title2, color: theme.colors.black_[10] },
                }}
                leftComponent={
                    <IconButton
                        type="ionicon"
                        name="arrow-back-outline"
                        color={theme.colors.black_[10]}
                        onPress={navigate.GO_BACK_ROUTE}
                        size={theme.typography.title4}
                    />
                }
                shadow
            />
            {/* order address */}
            {isEmpty(listCustomerAddress) ? (
                <>
                    {type === 'shipping' ? (
                        <View style={styles.view_top}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    backgroundColor: theme.colors.main['100'],
                                    marginTop: theme.spacings.default * 4,
                                    padding: theme.spacings.medium,
                                    width: '100%',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <View flexDirect="row">
                                    <Text
                                        color={theme.colors.grey_['600']}
                                        size={'body2'}
                                        fw="bold"
                                    >
                                        Địa chỉ giao hàng
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ) : null}

                    <View style={styles.v_emptyListAddress}>
                        <Text>Bạn chưa có địa chỉ nào !!!</Text>
                    </View>
                    <View style={styles.view_wrapAddNew}>
                        <TouchableOpacity
                            onPress={navigateAddNewAddress()}
                            activeOpacity={0.8}
                            style={styles.btn_addNew}
                        >
                            <Text style={styles.txt_addNew}>Thêm địa chỉ mới</Text>
                            <Icon
                                name={'add-circle-outline'}
                                type={'ionicon'}
                                color={theme.colors.main['600']}
                            />
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <View flex={1}>
                    {/* lít address section */}
                    <ScrollView
                        contentContainerStyle={{ paddingBottom: theme.spacings.medium }}
                        showsVerticalScrollIndicator={false}
                        refreshControl={refreshControl()}
                    >
                        {/* cart address */}
                        {type === 'shipping' ? (
                            <View style={styles.view_top}>
                                <View style={styles.view_address_selected}>
                                    <View flexDirect="row">
                                        <Text
                                            color={theme.colors.grey_['600']}
                                            size={'body2'}
                                            fw="bold"
                                        >
                                            Địa chỉ giao hàng
                                        </Text>
                                    </View>
                                </View>
                                {renderAddressSelected(cartShipping)}
                            </View>
                        ) : null}
                        {type === 'billing' && (
                            <View>
                                <View style={styles.view_address_selected}>
                                    <View flexDirect="row">
                                        <Text
                                            color={theme.colors.grey_['600']}
                                            size={'body2'}
                                            fw="bold"
                                        >
                                            Địa chỉ xuất hoá đơn
                                        </Text>
                                    </View>
                                </View>
                                {renderAddressSelected(cartBilling)}
                            </View>
                        )}
                        {/* customer address */}
                        <View mt="large">
                            {type !== 'customer' ? (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        paddingHorizontal: theme.spacings.medium,
                                        width: '100%',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <View flexDirect="row">
                                        <Text
                                            color={theme.colors.grey_['600']}
                                            size={'body2'}
                                            fw="bold"
                                        >
                                            Danh sách địa chỉ
                                        </Text>
                                    </View>
                                    <Touch
                                        flexDirect="row"
                                        aI="center"
                                        onPress={navigateAddNewAddress()}
                                    >
                                        <Icon
                                            type="ionicon"
                                            name="add-circle-outline"
                                            size={theme.typography.title1}
                                            color={theme.colors.grey_[500]}
                                        />
                                        <Text color={theme.colors.grey_[500]}>Thêm mới</Text>
                                    </Touch>
                                </View>
                            ) : null}

                            {renderListAddress()}
                        </View>
                    </ScrollView>
                    {/* button section */}
                    {type === 'customer' ? (
                        <View style={styles.view_wrapAddNew}>
                            <TouchableOpacity
                                onPress={navigateAddNewAddress()}
                                activeOpacity={0.8}
                                style={styles.btn_addNew}
                            >
                                <Text style={styles.txt_addNew}>Thêm địa chỉ mới</Text>
                                <Icon
                                    name={'add-circle-outline'}
                                    type={'ionicon'}
                                    color={theme.colors.main['600']}
                                />
                            </TouchableOpacity>
                        </View>
                    ) : null}
                    {type === 'shipping' ? (
                        <View
                            style={{
                                backgroundColor: theme.colors.white_[10],
                                padding: theme.spacings.medium,
                                borderTopWidth: 1,
                                borderTopColor: theme.colors.grey_[100],
                            }}
                        >
                            {isEmpty(cartShipping) ? (
                                <Text ta="center" color={theme.colors.grey_[500]} mb="small">
                                    (Vui lòng thêm địa chỉ giao hàng)
                                </Text>
                            ) : null}
                        </View>
                    ) : null}
                </View>
            )}
        </View>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.bgMain,
        },
        view_top: {
            // alignItems: 'center',
        },
        view_wrap_step: {
            width: theme.dimens.width * 0.8,
            height: theme.dimens.verticalScale(50),
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        txt_step_dot: {
            fontWeight: 'bold',
            fontSize: theme.typography.body3,
        },

        btn_addNew: {
            borderWidth: 1,
            borderStyle: Platform.OS === 'android' ? 'dashed' : 'solid',
            borderColor: theme.colors.main['600'],
            width: '90%',
            height: '80%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(240, 174, 1, 0.1)',
            borderRadius: 1,
        },
        txt_addNew: {
            color: theme.colors.main['600'],
            fontWeight: 'bold',
            fontSize: theme.typography.body2,
        },
        v_emptyListAddress: {
            height: '15%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        //
        view_wrapAddNew: {
            justifyContent: 'center',
            alignItems: 'center',
            width: theme.dimens.width,
            height: theme.dimens.width * 0.3,
        },
        view_item: {
            marginTop: theme.spacings.medium,
            marginHorizontal: theme.spacings.medium,
            backgroundColor: theme.colors.white_[10],
            padding: theme.spacings.small,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.colors.grey_[200],
        },
        view_address_selected: {
            flexDirection: 'row',
            marginTop: theme.spacings.medium,
            paddingHorizontal: theme.spacings.medium,
            width: '100%',
            justifyContent: 'space-between',
        },
        touch_set_default: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 0.7,
            borderColor: theme.colors.main[200],
            paddingHorizontal: theme.spacings.tiny,
            borderRadius: 5,
            backgroundColor: theme.colors.main[50],
        },
    });

export default withAuth(AddressScreen, true);
// export default AddressScreen;
