import { Icon } from '@rneui/themed';
import Text from 'components/Text';
import Touch from 'components/Touch';
import View from 'components/View';
import { useNavigate, useTheme } from 'hooks';
import useGiftSwr from 'hooks/swr/gift/useGiftSwr';
import { CartItemsSellerResponseType, DataUpdateCartType } from 'models';
import moment from 'moment';
import React, { memo } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { themeType } from 'theme';
import { currencyFormat } from 'utils/helpers';
import CartItem from './CartItem';

/* eslint-disable react-hooks/exhaustive-deps */

interface Props {
    cartItemsSection: CartItemsSellerResponseType;
    errorCheckout: any;
    updateCartItemQuantity: (cartData: DataUpdateCartType) => any;
    updateCheckedCartItem: (cartData: DataUpdateCartType) => any;
    removeItemFromCart: (product_seller_uuid?: string | undefined) => any;
}

const CartSellerSection = memo(function CartSellerSection({
    cartItemsSection,
    errorCheckout,
    updateCartItemQuantity,
    updateCheckedCartItem,
    removeItemFromCart,
}: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const navigate = useNavigate();
    //swr
    const { gift } = useGiftSwr({
        seller_uuid: cartItemsSection.seller.seller_uuid,
        page_size: 1000,
        status: 'any',
    });
    //value
    const giftFilter = gift.filter(
        (value) => moment(value.expires, 'YYYY-MM-DD HH:mm:ss').valueOf() > Date.now()
    );
    // console.log('cartItemsSection vvvv', cartItemsSection);
    //render
    const renderCartProductItem = () =>
        cartItemsSection.items.map((v, i) => (
            <CartItem
                item={v}
                errorCheckout={errorCheckout}
                key={i}
                updateCartItemQuantity={updateCartItemQuantity}
                updateCheckedCartItem={updateCheckedCartItem}
                removeItemFromCart={removeItemFromCart}
            />
        ));

    return (
        <View
            style={{
                marginTop: theme.spacings.medium,
                marginHorizontal: theme.spacings.medium,
                backgroundColor: theme.colors.white_[10],
                padding: theme.spacings.medium,
                borderRadius: 10,
            }}
        >
            {/* title */}
            <Touch
                flexDirect="row"
                aI="center"
                mb="tiny"
                activeOpacity={0.8}
                onPress={navigate.SHOP_ROUTE({ seller_code: cartItemsSection.seller.seller_code })}
            >
                <Icon
                    type="material-community"
                    name="storefront-outline"
                    color={theme.colors.black_[10]}
                />
                <Text fw="bold" ml={'tiny'} color={theme.colors.black_[10]}>
                    {cartItemsSection.seller.seller_name}
                </Text>
                <Icon
                    type="ionicon"
                    name="chevron-forward"
                    size={theme.typography.body3}
                    color={theme.colors.black_[10]}
                />
            </Touch>
            {/* product item */}
            {renderCartProductItem()}
            <View
                style={{
                    borderTopWidth: 0.7,
                    borderTopColor: theme.colors.main['100'],
                }}
            >
                {/* gift */}
                {giftFilter.length > 0 ? (
                    <View
                        style={{
                            flexDirection: 'row',
                            paddingVertical: theme.spacings.medium,
                            borderBottomWidth: 1,
                            borderBottomColor: theme.colors.main['100'],
                            borderStyle: Platform.OS === 'android' ? 'dashed' : 'solid',
                            justifyContent: 'space-between',
                        }}
                    >
                        <View flexDirect="row" flex={0.9}>
                            <Icon
                                type="ionicon"
                                name="gift"
                                color={theme.colors.red['400']}
                                size={theme.typography.size(18)}
                            />
                            <Text ml={'tiny'} color={theme.colors.grey_['600']} numberOfLines={1}>
                                Bạn có {giftFilter.length} phần quà từ gian hàng này!
                            </Text>
                        </View>
                        {/* <Text ml={'tiny'} color={theme.colors.teal["500"]}>
                            Chọn
                        </Text> */}
                    </View>
                ) : null}

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingTop: theme.spacings.medium,
                    }}
                >
                    <Text color={theme.colors.black_[10]} fw="bold">
                        Tổng tiền
                    </Text>
                    <Text color={theme.colors.pink[500]}>
                        {currencyFormat(cartItemsSection.total_items_price)}
                    </Text>
                </View>
            </View>
        </View>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_top: {
            alignItems: 'center',
            marginTop: theme.spacings.extraLarge,
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
        //qty
        view_wrap_qty: {
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: theme.colors.teal[200],
            borderRadius: 5,
            alignItems: 'center',
        },
        touch_qty_modal: {
            flexDirection: 'row',
            alignItems: 'center',
            height: '100%',
            paddingHorizontal: theme.spacings.medium,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: theme.colors.teal[200],
            backgroundColor: theme.colors.main['50'],
        },
        input_qty_modal: {
            width: '100%',
            height: theme.dimens.verticalScale(40),
            marginVertical: theme.spacings.small,
            backgroundColor: theme.colors.main['50'],
        },
        touch_change_qty: {
            paddingHorizontal: theme.spacings.tiny,
            paddingVertical: theme.spacings.tiny - 1,
            backgroundColor: theme.colors.main['50'],
        },
    });

export default CartSellerSection;
