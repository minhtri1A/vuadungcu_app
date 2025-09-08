import { CheckBox } from '@rneui/themed';
import ButtonChangeQty from 'components/ButtonChangeQty';
import IconButton from 'components/IconButton';
import Image from 'components/Image';
import Text from 'components/Text';
import View from 'components/View';
import { Status } from 'const/index';
import { useNavigate, useTheme } from 'hooks';
import { CartItemResponseType, DataUpdateCartType } from 'models';
import React, { memo, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { themeType } from 'theme';
import { currencyFormat } from 'utils/helpers';

interface Props {
    item: CartItemResponseType;
    errorCheckout: any;
    updateCartItemQuantity: (cartData: DataUpdateCartType) => any;
    updateCheckedCartItem: (cartData: DataUpdateCartType) => any;
    removeItemFromCart: (product_seller_uuid?: string | undefined) => any;
}

const CartItem = memo(
    function CartItem({
        item,
        updateCartItemQuantity,
        updateCheckedCartItem,
        removeItemFromCart,
    }: // message,
    // status,
    Props) {
        //hook
        const { theme } = useTheme();
        const styles = useStyles(theme);
        const navigate = useNavigate();
        //swr

        //state
        //--update cart status
        const [status, setStatus] = useState<string>(Status.DEFAULT);
        const [qtyInit, setQtyInit] = useState<number>();

        //value
        const disableButton = status === Status.LOADING ? true : false;

        /* --- effect --- */
        useEffect(() => {
            setQtyInit(parseInt(item.qty));
        }, [item.qty]);

        /* --- handle --- */
        const handleUpdateQuantity = async (qty: number) => {
            if (qty < 1 || disableButton) {
                return;
            }
            setStatus(Status.LOADING);
            await updateCartItemQuantity({
                product_seller_uuid: item.product_seller_uuid,
                qty: qty,
            });
            setStatus(Status.DEFAULT);
        };

        const removeItemInCart = () => {
            Alert.alert(
                '',
                'Bạn có muốn xoá sản phẩm này ?',
                [
                    {
                        text: 'Huỷ',
                        style: 'cancel',
                    },
                    {
                        text: 'Xoá sản phẩm',
                        onPress: async () => {
                            setStatus(Status.LOADING);
                            await removeItemFromCart(item.product_seller_uuid);
                            setStatus(Status.SUCCESS);
                        },
                        style: 'cancel',
                    },
                ],
                {
                    cancelable: true,
                }
            );
        };
        const handleUpdateCheckedItem = () => {
            const checked = item.is_checked === 'Y' ? 'N' : 'Y';
            updateCheckedCartItem({
                is_checked: checked,
                product_seller_uuid: item.product_seller_uuid,
            });
        };

        return (
            <View style={{ flexDirection: 'row', marginBottom: theme.spacings.extraLarge }}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        width: '30%',
                        aspectRatio: 1,
                        marginTop: theme.spacings.small,
                        borderRadius: 5,
                        // backgroundColor: theme.colors.cyan['100'],
                    }}
                    onPress={navigate.PRODUCT_DETAIL_ROUTE(
                        item.product_uuid,
                        item.product_seller_uuid
                    )}
                >
                    <Image
                        source={{
                            uri: item.image,
                        }}
                        resizeMode="contain"
                        radius={5}
                    />
                    {item.allow_update === 'N' ? (
                        <View style={styles.view_bargain_label}>
                            <Text style={styles.touch_bargain_label}>Trả giá</Text>
                        </View>
                    ) : null}
                    {disableButton ? (
                        <View
                            style={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                left: 0,
                                right: 0,
                                backgroundColor: theme.colors.black_[10],
                                borderRadius: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <ActivityIndicator color={theme.colors.grey_[200]} />
                        </View>
                    ) : null}
                </TouchableOpacity>
                <View flex={1} ml="small" jC="space-between">
                    <View w={'90%'}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={navigate.PRODUCT_DETAIL_ROUTE(
                                item.product_uuid,
                                item.product_seller_uuid
                            )}
                        >
                            <Text color={theme.colors.slate[900]} numberOfLines={2} mt="small">
                                {item.name}
                            </Text>
                        </TouchableOpacity>

                        <View flexDirect="row" jC="space-between">
                            <Text color={theme.colors.pink[500]}>
                                {currencyFormat(item.price)}
                                <Text size="sub2" color={theme.colors.grey_[500]}>
                                    {item.allow_update === 'N' ? `x${item.qty}` : ''}
                                </Text>
                            </Text>
                        </View>
                    </View>
                    {/* qty */}
                    <View>
                        <View flexDirect="row">
                            {item.allow_update === 'Y' && (
                                <View flex={0.5} h={theme.dimens.scale(23)}>
                                    <ButtonChangeQty
                                        value={qtyInit}
                                        onSuccess={handleUpdateQuantity}
                                        bg={theme.colors.transparent}
                                        color={theme.colors.grey_[400]}
                                    />
                                </View>
                            )}

                            <View ml="small">
                                <IconButton
                                    type="ionicon"
                                    name="trash-outline"
                                    color={theme.colors.grey_[300]}
                                    onPress={removeItemInCart}
                                    size={theme.dimens.scale(22)}
                                />
                            </View>
                        </View>
                    </View>
                </View>
                {/* check item */}
                <View style={{ position: 'absolute', right: 0, top: '50%' }}>
                    <CheckBox
                        checked={item.is_checked === 'Y' ? true : false}
                        style={{ padding: 0, margin: 0 }}
                        containerStyle={{
                            padding: 0,
                            margin: 0,
                            marginLeft: 0,
                            marginRight: 0,
                        }}
                        size={theme.typography.size(25)}
                        iconType={'ionicon'}
                        checkedIcon="checkbox"
                        uncheckedIcon="square-outline"
                        uncheckedColor={theme.colors.main['300']}
                        checkedColor={theme.colors.main['600']}
                        onPress={handleUpdateCheckedItem}
                    />
                </View>
            </View>
        );
    }
    // (pre, next) => {
    //     // console.log('pre ', pre);
    //     // console.log('next ', next);
    //     console.log('is equal cart ', isEqual(pre.item, next.item));
    //     console.log(
    //         'is equal updateCartItemQuantity ',
    //         isEqual(pre.updateCartItemQuantity, next.updateCartItemQuantity)
    //     );
    //     console.log(
    //         'is equal removeItemFromCart ',
    //         isEqual(pre.removeItemFromCart, next.removeItemFromCart)
    //     );
    //     console.log(
    //         'is equal updateCheckedCartItem ',
    //         isEqual(pre.updateCheckedCartItem, next.updateCheckedCartItem)
    //     );

    //     console.log('is equal errorCheckout ', isEqual(pre.errorCheckout, next.errorCheckout));
    //     return false;
    // }
);

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
            borderWidth: 0.7,
            borderColor: theme.colors.grey_[400],
            borderRadius: 5,
            alignItems: 'center',
            overflow: 'hidden',
        },
        touch_qty_modal: {
            flexDirection: 'row',
            alignItems: 'center',
            height: '100%',
            paddingHorizontal: theme.spacings.medium,
            borderLeftWidth: 0.7,
            borderRightWidth: 0.7,
            borderColor: theme.colors.grey_[400],
            backgroundColor: theme.colors.white_[10],
        },
        input_qty_modal: {
            width: '100%',
            height: theme.dimens.verticalScale(40),
            marginVertical: theme.spacings.small,
            backgroundColor: theme.colors.main['50'],
            textAlign: 'center',
        },
        touch_change_qty: {
            paddingHorizontal: theme.spacings.tiny,
            paddingVertical: theme.spacings.tiny - 1,
        },

        view_bargain_label: {
            position: 'absolute',
            left: 0,
            flexDirection: 'row',
        },
        touch_bargain_label: {
            backgroundColor: theme.colors.red['400'],
            color: theme.colors.white_[10],
            paddingHorizontal: theme.spacings.small,
            paddingVertical: 2,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 10,
            borderBottomLeftRadius: 10,
            fontSize: theme.typography.sub1,
        },
    });

export default CartItem;
