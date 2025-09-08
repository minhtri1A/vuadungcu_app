/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useState } from 'react';
// import { Header } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from 'components/Button';
import Image from 'components/Image';
import Text from 'components/Text';
import View from 'components/View';
import { NAVIGATION_TO_PRODUCT_DETAIL_SCREEN } from 'const/routes';
import { useCartAddressSwr, useNavigation, useProductShippingSwr, useTheme } from 'hooks';
import { isEmpty } from 'lodash';
import { ParamsGetProductShippingType, ProductDetailResponseType } from 'models';
import { StyleSheet } from 'react-native';
import { currencyFormat } from 'utils/helpers';

interface Props {
    sellerItems: ProductDetailResponseType['detail-dynamic']['sellers'][number];
    uuid?: string;
    // shippingParams?: ParamsGetProductShippingType;
}

const SellerItems = memo(function SellerItems({ uuid, sellerItems }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles();
    const navigation = useNavigation();
    //params
    //state
    const [shippingParams, setShippingParams] = useState<
        ParamsGetProductShippingType | undefined
    >();
    //swr
    const { cartAddress } = useCartAddressSwr('shipping');
    const { shipping, mutate: mutateShipping } = useProductShippingSwr(
        sellerItems.product_seller_uuid,
        shippingParams as any,
        { revalidateOnMount: false }
    );
    //value

    //effect
    useEffect(() => {
        (async () => {
            const guestAddressLocal = await AsyncStorage.getItem('guest-address');
            //ưu tiên lấy guest address để tính phí vận chuyển
            if (guestAddressLocal) {
                const guestAddress: any = JSON.parse(guestAddressLocal);
                setShippingParams({
                    province_id: guestAddress.province_id,
                    district_id: guestAddress.district_id,
                    ward_id: guestAddress.ward_id,
                });
            } else if (cartAddress) {
                setShippingParams({
                    province_id: cartAddress.province_id,
                    district_id: cartAddress.district_id,
                    ward_id: cartAddress.ward_id,
                });
            }
        })();
    }, []);
    //--mutate shipping
    useEffect(() => {
        if (shippingParams) {
            mutateShipping();
        }
    }, [shippingParams]);

    useEffect(() => {
        (async () => {
            if (cartAddress) {
                setShippingParams({
                    province_id: cartAddress.province_id,
                    district_id: cartAddress.district_id,
                    ward_id: cartAddress.ward_id,
                });
            } else {
                const guestAddressLocal = await AsyncStorage.getItem('guest-address');
                if (guestAddressLocal) {
                    const guestAddressParse = JSON.parse(guestAddressLocal || '{}');
                    setShippingParams({
                        province_id: guestAddressParse?.province_id,
                        district_id: guestAddressParse?.district_id,
                        ward_id: guestAddressParse?.ward_id,
                    });
                }
            }
        })();
    }, [cartAddress]);

    //render
    //navigate
    const navigateToProductDetail = () => {
        navigation.push(NAVIGATION_TO_PRODUCT_DETAIL_SCREEN, {
            product_uuid: uuid,
            product_seller_uuid: sellerItems.product_seller_uuid,
        });
    };

    return (
        <View style={styles.view_wrap_seller}>
            {/* top info */}
            <View style={styles.view_top_seller}>
                <View w={'18%'} ratio={1}>
                    <Image source={{ uri: sellerItems.image }} radius={3} />
                </View>
                <View ml="tiny" jC="center">
                    <Text fw="bold" size={'body2'}>
                        {sellerItems.seller_name}
                    </Text>
                    {/* <Text color={theme.colors.grey_[400]}>Trà vinh</Text> */}
                </View>
            </View>
            {/* body info */}
            <View style={styles.view_body_seller}>
                <View jC="center" aI="center">
                    <Text fw="bold" color={theme.colors.grey_[500]}>
                        Giá bán
                    </Text>
                    <Text color="red">{currencyFormat(sellerItems.special_price)}</Text>
                </View>
                <View jC="center" aI="center">
                    {/* <Text fw="bold" color={theme.colors.grey_[500]}>
                    Đã bán
                </Text> */}
                    <Text color={theme.colors.grey_[500]}>-</Text>
                </View>
                <View jC="center" aI="center">
                    <Text fw="bold" color={theme.colors.grey_[500]}>
                        Vận chuyển
                    </Text>
                    <Text color={theme.colors.teal[500]}>
                        {isEmpty(shipping?.shipping_fee)
                            ? 'Gian hàng liên hệ'
                            : `${currencyFormat(shipping.shipping_fee[0])} - ${currencyFormat(
                                  shipping.shipping_fee[1]
                              )}`}
                    </Text>
                </View>
            </View>
            {/* bottom button */}
            <View>
                <Button
                    title={'Xem chi tiết'}
                    type="outline"
                    color={theme.colors.main['600']}
                    size="md"
                    onPress={navigateToProductDetail}
                />
            </View>
        </View>
    );
});

export default SellerItems;

const useStyles = () => {
    const {
        theme: { colors, spacings, styles: s },
    } = useTheme();
    return StyleSheet.create({
        /* ------- screen ------- */
        view_name: {
            borderBottomWidth: 1,
            borderBottomColor: colors.grey_[200],
            padding: spacings.small,
        },
        view_wrap_seller: {
            width: '97%',
            borderRadius: 5,
            backgroundColor: colors.white_[10],
            padding: spacings.small,
            marginBottom: spacings.small,
            ...s.shadow1,
        },
        view_top_seller: {
            flexDirection: 'row',
            paddingBottom: spacings.small,
            // marginBottom: spacings.small,
        },
        view_body_seller: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            backgroundColor: colors.grey_[100],
            marginBottom: spacings.small,
            padding: spacings.small,
        },
    });
};
