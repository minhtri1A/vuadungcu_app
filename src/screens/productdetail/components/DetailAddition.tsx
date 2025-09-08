/* eslint-disable react-hooks/exhaustive-deps */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from '@rneui/themed';
import BottomSheetAddressLocation from 'components/BottomSheetAddressLocation.tsx';
import Divider from 'components/Divider';
import Text from 'components/Text';
import Title from 'components/Title';
import View from 'components/View';
import { NAVIGATION_TO_COMPARISON_SCREEN } from 'const/routes';
import { LocationState } from 'features/address/addressSlice';
import { useCartAddressSwr, useNavigation, useProductShippingSwr, useTheme } from 'hooks';
import { ProductDetailResponseType } from 'models';
import React, { memo, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { currencyFormat, isEmpty } from 'utils/helpers';

interface Props {
    pds?: ProductDetailResponseType['detail-static'];
    pdc?: ProductDetailResponseType['detail-dynamic'];
    indexOptionSelected?: number;
}

const DetailAddition = memo(function DetailAddition({ pds, pdc, indexOptionSelected }: Props) {
    //hooks
    const {
        theme: { colors, typography, spacings },
    } = useTheme();
    const styles = useStyles();
    const navigation = useNavigation();

    //state
    const [locationLocal, setLocationLocal] = useState<LocationState>();
    //value

    const childrenSelected =
        indexOptionSelected !== undefined && pdc?.children
            ? pdc?.children[indexOptionSelected]
            : undefined;

    const pdi =
        pds?.type_id === 'simple' || childrenSelected === undefined
            ? { ...pdc, ...pds }
            : childrenSelected;

    //swr
    const { cartAddress, isValidating: isValidatingCartAddress } = useCartAddressSwr('shipping');

    //product shipping swr
    const { shipping, mutate: mutateShipping } = useProductShippingSwr(
        pdi.product_seller_uuid || '',
        {
            province_id: locationLocal?.province?.id || '',
            district_id: locationLocal?.district?.id || '',
            ward_id: locationLocal?.ward?.id || '',
        },
        { revalidateOnMount: false }
    );

    //effect
    //--set address local to state
    useEffect(() => {
        (async () => {
            const guestAddress = await AsyncStorage.getItem('guest-address');
            //ưu tiên lấy guest address để tính phí vận chuyển
            if (guestAddress) {
                setLocationLocal(JSON.parse(guestAddress || '{}'));
                return;
            }
            if (cartAddress) {
                setLocationLocal({
                    province: {
                        name: cartAddress.province,
                        id: cartAddress.province_id,
                    },
                    district: {
                        name: cartAddress.district,
                        id: cartAddress.district_id,
                    },
                    ward: {
                        name: cartAddress.ward,
                        id: cartAddress.ward_id,
                    },
                });
                return;
            }
        })();
    }, [cartAddress, isValidatingCartAddress]);

    //--mutate shipping when exists location state
    useEffect(() => {
        if (locationLocal || indexOptionSelected) {
            mutateShipping();
        }
    }, [locationLocal, indexOptionSelected]);

    //handle
    //--location shipping
    const getAddressSuccessFromSheet = (location: LocationState) => {
        AsyncStorage.setItem('guest-address', JSON.stringify(location));
        setLocationLocal(location);
    };

    //navigate
    const navigatePriceComparisonScreen = () => {
        navigation.navigate(NAVIGATION_TO_COMPARISON_SCREEN, {
            product_uuid: pds?.uuid,
        });
    };

    //render

    return (
        <View>
            {/* price comparison */}
            {pdi?.other_seller && pdi?.other_seller?.count > 0 ? (
                <>
                    <Title
                        flexLeft={1}
                        titleLeft={`So sánh giá ${pdi?.other_seller?.count} shop khác`}
                        subTitleLeft={`Giá từ ${currencyFormat(
                            pdi?.other_seller?.min_price || 0
                        )} `}
                        iconLeftProps={{
                            type: 'font-awesome',
                            name: 'balance-scale',
                            color: colors.blue['600'],
                            size: typography.size(20),
                        }}
                        subTitleLeftProps={{ color: colors.grey_['500'], size: 'sub2' }}
                        chevron
                        onPress={navigatePriceComparisonScreen}
                    />
                    <Divider />
                </>
            ) : null}
            {/* Shipping */}
            <BottomSheetAddressLocation
                defaultLocation={locationLocal}
                trigger={
                    <View w={'100%'}>
                        <View
                            bBW={0.7}
                            bBC={colors.grey_[200]}
                            p={'small'}
                            ph={'medium'}
                            w={'100%'}
                            aI="center"
                            flexDirect="row"
                            jC="space-between"
                        >
                            <View flexDirect="row" flex={1} gap={spacings.small}>
                                <Icon
                                    type="material-community"
                                    name="truck-outline"
                                    color={colors.teal['500']}
                                    size={typography.size(22)}
                                />
                                <View flex={1} pr={'small'}>
                                    <Text size={'body1'}>
                                        {locationLocal?.province?.name
                                            ? `${locationLocal?.ward?.name}, ${locationLocal?.district?.name}, ${locationLocal?.province?.name}`
                                            : 'Chưa có địa chỉ'}
                                    </Text>
                                    {isEmpty(shipping?.shipping_fee) ? (
                                        <Text color={colors.teal[500]}>Gian hàng liên hệ</Text>
                                    ) : (
                                        <View flexDirect="row" gap={spacings.tiny}>
                                            <Text
                                                color={
                                                    shipping?.shipping_fee_supported &&
                                                    shipping?.shipping_fee_supported.length > 0
                                                        ? colors.grey_[400]
                                                        : colors.teal[500]
                                                }
                                                tD={
                                                    shipping?.shipping_fee_supported &&
                                                    shipping?.shipping_fee_supported.length > 0
                                                        ? 'line-through'
                                                        : undefined
                                                }
                                            >
                                                {`${
                                                    shipping?.shipping_fee[0] !==
                                                    shipping?.shipping_fee[1]
                                                        ? `${currencyFormat(
                                                              shipping?.shipping_fee[0] || 0
                                                          )} - `
                                                        : ''
                                                } ${currencyFormat(
                                                    shipping?.shipping_fee[1] || 0
                                                )}`}
                                            </Text>
                                            {shipping?.shipping_fee_supported &&
                                                shipping?.shipping_fee_supported.length > 0 && (
                                                    <>
                                                        <Text color={colors.grey_[400]}>-</Text>
                                                        <Text color={colors.teal[500]}>
                                                            {`${
                                                                shipping
                                                                    .shipping_fee_supported[0] !==
                                                                shipping.shipping_fee_supported[1]
                                                                    ? `${shipping.shipping_fee_supported[0]} - `
                                                                    : ''
                                                            }${currencyFormat(
                                                                shipping
                                                                    ?.shipping_fee_supported[1] || 0
                                                            )}`}
                                                        </Text>
                                                    </>
                                                )}
                                        </View>
                                    )}
                                </View>
                            </View>
                            <Icon
                                type={'ionicon'}
                                name="chevron-forward-outline"
                                size={typography.body2}
                                color={colors.grey_[400]}
                            />
                        </View>

                        {shipping?.shipping_fee_support_info && (
                            <Text
                                size={'sub3'}
                                flex={1}
                                color={colors.grey_[500]}
                                pv="small"
                                ph="medium"
                            >
                                Hỗ trợ vận chuyển {shipping?.shipping_fee_support_info?.percent}%
                                tối đa {currencyFormat(shipping?.shipping_fee_support_info.max)} đơn
                                tối thiểu{' '}
                                {currencyFormat(shipping?.shipping_fee_support_info.order_min)}
                            </Text>
                        )}
                    </View>
                }
                triggerStyle={styles.trigger_style}
                onSuccess={getAddressSuccessFromSheet}
            />

            <Divider />
        </View>
    );
});

const useStyles = () => {
    return StyleSheet.create({
        trigger_style: {
            flexDirection: 'row',

            justifyContent: 'space-between',
            alignItems: 'center',
        },
    });
};

export default DetailAddition;
