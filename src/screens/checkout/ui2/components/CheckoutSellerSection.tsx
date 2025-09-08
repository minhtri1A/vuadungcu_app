import { CheckBox, Icon } from '@rneui/themed';
import BottomSheet from 'components/BottomSheet';
import Button from 'components/Button';
import Image from 'components/Image';
import Text from 'components/Text';
import Touch from 'components/Touch';
import View from 'components/View';
import { SET_GIFTS_ORDER } from 'features/action';
import { useAppDispatch, useAppSelector, useTheme } from 'hooks';
import useGiftSwr from 'hooks/swr/gift/useGiftSwr';
import { map } from 'lodash';
import { CartItemsSellerResponseType, CartSummaryResponseType } from 'models';
import moment from 'moment';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { ImageBackground, Platform, ScrollView, StyleSheet, TextInput } from 'react-native';
import { themeType } from 'theme';
import { calculatorBetweenTwoTime, currencyFormat, isEmpty } from 'utils/helpers';
/* eslint-disable react-hooks/exhaustive-deps */

interface Props {
    cartItemSeller: CartItemsSellerResponseType;
    handleSetOrderNote: (seller_uuid: string, note: string) => () => void;
    cartSummary: CartSummaryResponseType;
    setSellersUuidPickup: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}

const CheckoutSellerSection = memo(function CheckoutSellerSection({
    cartItemSeller,
    handleSetOrderNote,
    cartSummary,
    setSellersUuidPickup,
}: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const { gift, mutate } = useGiftSwr({
        seller_uuid: cartItemSeller?.seller.seller_uuid,
        page_size: 1000,
        status: 'any',
    });
    const dispatch = useAppDispatch();

    //state
    //--gift
    const [openSheet, setOpenSheet] = useState(false);
    //----gift chon trong sheet
    const [giftUuidSelected, setGiftUuidSelected] = useState<string | undefined>();
    //----gift dang apply vao seller section
    const [giftUuidApply, setGiftUuidApply] = useState<string | undefined>();
    //----danh sach gift apply vao checkout nay
    const orderGifts = useAppSelector((state) => state.apps.orderGifts);
    //--note
    const [note, setNote] = useState('');

    //--Receiving method
    const [receivingMethod, setReceivingMethod] = useState<'shipping' | 'pickup'>('shipping');

    //swr
    const { seller: sellerSummaryList } = cartSummary || {};

    //value
    const indexSummarySeller = sellerSummaryList?.findIndex(
        (value2) => cartItemSeller?.seller.seller_uuid === value2.seller_uuid
    );
    const sellerSummary =
        indexSummarySeller !== undefined ? sellerSummaryList[indexSummarySeller] : undefined;

    //--get expired gift
    const giftFilter = useMemo(
        () =>
            gift.filter(
                (value) => moment(value.expires, 'YYYY-MM-DD HH:mm:ss').valueOf() > Date.now()
            ),
        [gift]
    );
    //
    const indexGiftApply = useMemo(
        () => giftFilter.findIndex((value) => value.uuid === giftUuidApply),
        [giftUuidApply, giftFilter]
    );

    /* --- effect --- */
    useEffect(() => {
        setSellersUuidPickup((pre) =>
            receivingMethod === 'pickup'
                ? [...(pre || []), cartItemSeller?.seller.seller_uuid]
                : [...(pre?.filter((v) => v !== cartItemSeller?.seller.seller_uuid) || [])]
        );
    }, [receivingMethod]);

    /* --- handle --- */
    //--gift
    const handleVisibleSheet = () => {
        mutate();
        setOpenSheet((pre) => !pre);
        //set gift select(radio) neu ton tai giftApply
        if (giftUuidApply !== undefined) {
            setGiftUuidSelected(giftUuidApply);
        }
    };
    //----select gift in sheet
    const changeGiftUuidSelected = (gift_uuid: string) => () => {
        if (gift_uuid === giftUuidSelected) {
            setGiftUuidSelected(undefined);
            return;
        }
        setGiftUuidSelected(gift_uuid);
    };

    //----set giftUuidSelected vao orderGift va giftSeller
    const applyGiftToSeller = () => {
        if (giftUuidSelected !== undefined) {
            //kiem tra xem co ton tai gift thuoc seller nay trong orderGifts khong
            //neu ton tai thi xoa previous gift va them gift hien tai vao orderGifts
            if (giftUuidApply !== undefined) {
                //remove previous gift of seller
                const orderGiftsNew = orderGifts.filter((value) => value !== giftUuidApply);
                //add new gif of seller
                dispatch(SET_GIFTS_ORDER([...orderGiftsNew, giftUuidSelected]));
            } else {
                //not exists previous then add to orderGifts
                dispatch(SET_GIFTS_ORDER([...orderGifts, giftUuidSelected]));
            }
            //set current seller gift
            setGiftUuidApply(giftUuidSelected);
            setOpenSheet(false);
        }
    };
    //----remove gift to order
    const cancelGiftApply = () => {
        //check previous gift of seller if exists then remove from orderGiftsNew
        if (giftUuidApply !== undefined) {
            //remove previous gift of seller
            const orderGiftsNew = orderGifts.filter((value) => value !== giftUuidApply);
            //set state
            dispatch(SET_GIFTS_ORDER(orderGiftsNew));
        }
        //reset seller section state
        setGiftUuidApply(undefined);
        setGiftUuidSelected(undefined);
        setOpenSheet(false);
    };

    //--note
    const handleChangeTextNote = (text: string) => {
        setNote(text);
    };

    //--Receiving method
    const handleChangeReceivingMethod = (value: 'shipping' | 'pickup') => () => {
        setReceivingMethod(value);
    };

    /* --- render --- */
    const renderCartProductItem = () =>
        cartItemSeller.items.map((v, i) => (
            <View style={{ flexDirection: 'row', marginBottom: theme.spacings.extraLarge }} key={i}>
                <View w={'30%'} ratio={1} mt="small" radius={5}>
                    <Image
                        source={{
                            uri: v.image,
                        }}
                        resizeMode="contain"
                        radius={5}
                    />
                </View>
                <View flex={1} ml="small" pt="small">
                    <View>
                        <Text color={theme.colors.slate[900]} numberOfLines={2}>
                            {v.name}
                        </Text>
                        <View flexDirect="row" jC="space-between">
                            <Text color={theme.colors.pink[500]}>{currencyFormat(v.price)}</Text>
                        </View>
                    </View>
                    <View>
                        <Text color={theme.colors.grey_[500]}>x{v.qty}</Text>
                    </View>
                </View>
            </View>
        ));

    const renderListGiftSheet = () =>
        map(giftFilter, (value, i) => {
            const timestamp = moment(value?.expires, 'YYYY-MM-DD HH:mm:ss').valueOf();
            const nowTimeStamp = Date.now();
            const { num, title } = calculatorBetweenTwoTime(nowTimeStamp, timestamp) || {};
            const checkPriceApplyGift =
                parseInt(sellerSummary?.price_total || '0') < parseInt(value.min_order_apply);
            return (
                <Touch
                    activeOpacity={0.7}
                    onPress={changeGiftUuidSelected(value.uuid)}
                    key={i}
                    disabled={checkPriceApplyGift}
                >
                    <ImageBackground
                        source={require('asset/img_voucher.png')}
                        style={styles.img_bg_voucher}
                        resizeMode="stretch"
                    >
                        <View style={styles.view_img_gift}>
                            <Image source={{ uri: value.image }} resizeMode="contain" />
                        </View>
                        <View style={styles.view_info_gift}>
                            <Text size="sub2" fw="bold">
                                {value.gift_name}
                            </Text>
                            <Text size="sub2" color={theme.colors.grey_[500]}>
                                Đơn từ {currencyFormat(value.min_order_apply)}
                            </Text>
                            <Text size="sub2" color={theme.colors.grey_[400]}>
                                Hết hạn sau {`${num} ${title}`} nữa
                            </Text>
                            {checkPriceApplyGift ? (
                                <Text size="sub2" color="red">
                                    Chưa đủ điều kiện!
                                </Text>
                            ) : null}
                        </View>
                        <View jC="center" mh="medium">
                            <CheckBox
                                checked={giftUuidSelected === value.uuid}
                                onPress={changeGiftUuidSelected(value.uuid)}
                                checkedIcon="dot-circle-o"
                                uncheckedIcon="circle-o"
                                checkedColor={theme.colors.main['600']}
                                containerStyle={styles.checkbox_container}
                                disabled={checkPriceApplyGift}
                            />
                            {/* <Button title="Chọn" size="sm" titleSize={'sub2'} /> */}
                        </View>
                    </ImageBackground>
                </Touch>
            );
        });

    return (
        <View
            style={{
                marginTop: theme.spacings.medium,
                marginHorizontal: theme.spacings.medium,
                backgroundColor: theme.colors.white_[10],

                // padding: theme.spacings.small,
                borderRadius: 10,
            }}
        >
            {/* title */}
            <View p="medium">
                <Touch flexDirect="row" aI="center">
                    <Icon
                        type="material-community"
                        name="storefront-outline"
                        color={theme.colors.black_[10]}
                    />
                    <Text fw="bold" ml={'tiny'} color={theme.colors.black_[10]}>
                        {cartItemSeller.seller.seller_name}
                    </Text>
                    <Icon
                        type="ionicon"
                        name="chevron-forward"
                        size={theme.typography.body3}
                        color={theme.colors.black_[10]}
                    />
                </Touch>
            </View>

            {/* shipping */}
            <View style={styles.view_wrap_delivery}>
                <View
                    style={{
                        flexDirection: 'row',
                        // borderWidth: 0.7,
                        // borderColor: theme.colors.grey_[300],
                        backgroundColor: theme.colors.grey_[50],
                        marginBottom: theme.spacings.small,
                        borderRadius: 5,
                    }}
                >
                    <View flex={1} aI="center">
                        <CheckBox
                            checked={receivingMethod === 'shipping'}
                            onPress={handleChangeReceivingMethod('shipping')}
                            checkedIcon={
                                <Icon
                                    type="ionicon"
                                    name="radio-button-on"
                                    color={theme.colors.teal[500]}
                                    size={theme.typography.size(21)}
                                />
                            }
                            uncheckedIcon={
                                <Icon
                                    type="ionicon"
                                    name="radio-button-off"
                                    color={theme.colors.teal[300]}
                                    size={theme.typography.size(21)}
                                />
                            }
                            title={
                                <Text
                                    ml={'tiny'}
                                    color={
                                        receivingMethod === 'shipping'
                                            ? theme.colors.teal[600]
                                            : theme.colors.grey_[500]
                                    }
                                >
                                    Giao tận nơi
                                </Text>
                            }
                            checkedColor={theme.colors.main['600']}
                            containerStyle={{ padding: 0 }}
                        />
                    </View>
                    <View flex={1} aI="center">
                        <CheckBox
                            checked={receivingMethod === 'pickup'}
                            onPress={handleChangeReceivingMethod('pickup')}
                            checkedIcon={
                                <Icon
                                    type="ionicon"
                                    name="radio-button-on"
                                    color={theme.colors.teal[500]}
                                    size={theme.typography.size(21)}
                                />
                            }
                            uncheckedIcon={
                                <Icon
                                    type="ionicon"
                                    name="radio-button-off"
                                    color={theme.colors.teal[300]}
                                    size={theme.typography.size(21)}
                                />
                            }
                            title={
                                <Text
                                    ml={'tiny'}
                                    color={
                                        receivingMethod === 'pickup'
                                            ? theme.colors.teal[600]
                                            : theme.colors.grey_[500]
                                    }
                                >
                                    Nhận tại cửa hàng
                                </Text>
                            }
                            checkedColor={theme.colors.main['600']}
                            containerStyle={{ padding: 0 }}
                        />
                    </View>
                </View>
                <View
                    style={{
                        padding: theme.spacings.small,
                        backgroundColor: theme.colors.teal[50],
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: theme.colors.teal[100],
                    }}
                >
                    <View flexDirect="row" aI="center">
                        <Text color={theme.colors.teal[500]} fw="bold">
                            {receivingMethod === 'shipping'
                                ? 'Phí vận chuyển'
                                : `Nhận hàng tại ${cartItemSeller.seller.stock_name}`}
                        </Text>
                    </View>
                    <View flexDirect="row" jC="space-between">
                        <View>
                            {receivingMethod === 'shipping' ? (
                                <View>
                                    {sellerSummary?.shipping_fee_support_info && (
                                        <Text color={theme.colors.grey_[500]}>
                                            Hỗ trợ vận chuyển{' '}
                                            {sellerSummary?.shipping_fee_support_info?.percent}% tối
                                            đa{' '}
                                            {currencyFormat(
                                                sellerSummary?.shipping_fee_support_info?.max
                                            )}{' '}
                                            đơn tối thiểu{' '}
                                            {currencyFormat(
                                                sellerSummary?.shipping_fee_support_info?.order_min
                                            )}
                                        </Text>
                                    )}
                                    <View mt="small">
                                        {isEmpty(sellerSummary?.shipping_fee) ? (
                                            <Text color={theme.colors.grey_[500]}>
                                                Gian hàng liên hệ
                                            </Text>
                                        ) : (
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    gap: theme.spacings.tiny,
                                                }}
                                            >
                                                <Text
                                                    color={theme.colors.grey_[500]}
                                                    tD={
                                                        sellerSummary?.shipping_fee_supported &&
                                                        sellerSummary?.shipping_fee_supported
                                                            .length > 0
                                                            ? 'line-through'
                                                            : undefined
                                                    }
                                                >
                                                    {`${
                                                        sellerSummary?.shipping_fee[0] !==
                                                        sellerSummary?.shipping_fee[1]
                                                            ? `${currencyFormat(
                                                                  sellerSummary?.shipping_fee[0] ||
                                                                      0
                                                              )} - `
                                                            : ''
                                                    } ${currencyFormat(
                                                        sellerSummary?.shipping_fee[1] || 0
                                                    )}`}
                                                </Text>
                                                {sellerSummary?.shipping_fee_supported &&
                                                    sellerSummary?.shipping_fee_supported.length >
                                                        0 && (
                                                        <>
                                                            <Text color={theme.colors.grey_[400]}>
                                                                -
                                                            </Text>
                                                            <Text color={theme.colors.teal[500]}>
                                                                {`${
                                                                    sellerSummary
                                                                        .shipping_fee_supported[0] !==
                                                                    sellerSummary
                                                                        .shipping_fee_supported[1]
                                                                        ? `${sellerSummary.shipping_fee_supported[0]} - `
                                                                        : ''
                                                                }${currencyFormat(
                                                                    sellerSummary
                                                                        ?.shipping_fee_supported[1] ||
                                                                        0
                                                                )}`}
                                                            </Text>
                                                        </>
                                                    )}
                                            </View>
                                        )}
                                    </View>
                                </View>
                            ) : (
                                <View mt="small">
                                    <Text color={theme.colors.grey_[500]}>
                                        {cartItemSeller.seller.stock_street}
                                    </Text>
                                    <Text color={theme.colors.grey_[600]}>
                                        {`${cartItemSeller.seller.stock_ward} - ${cartItemSeller.seller.stock_district} - ${cartItemSeller.seller.stock_ward}`}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </View>

            {/* product item */}
            <View ph="medium" mt="medium">
                {renderCartProductItem()}
            </View>

            {/* input note */}
            <View style={styles.view_input}>
                <TextInput
                    placeholder="Nhập ghi chú cho đơn hàng"
                    placeholderTextColor={theme.colors.grey_[400]}
                    onChangeText={handleChangeTextNote}
                    onBlur={handleSetOrderNote(cartItemSeller.seller.seller_uuid, note)}
                    style={{
                        fontSize: theme.typography.body1,
                        paddingVertical: theme.dimens.sizeElement('md'),
                    }}
                />
            </View>

            {/* gift */}
            {giftFilter.length > 0 ? (
                <View
                    style={{
                        // paddingVertical: theme.spacings.small,
                        padding: theme.spacings.medium,
                        borderBottomWidth: 1,
                        borderBottomColor: theme.colors.main['100'],
                        borderStyle: Platform.OS === 'android' ? 'dashed' : 'solid',

                        // marginTop: theme.spacings.tiny,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',

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
                                {giftUuidApply
                                    ? 'Đã áp dụng 1 quà tặng'
                                    : `Bạn có ${giftFilter.length} phần quà từ gian hàng này!`}
                            </Text>
                        </View>
                        <Touch onPress={handleVisibleSheet}>
                            <Text ml={'tiny'} color={theme.colors.grey_['400']}>
                                Chọn
                            </Text>
                        </Touch>
                    </View>
                    {/* gift apply */}
                    {giftUuidApply !== undefined ? (
                        <View style={styles.view_select_gift}>
                            <Icon
                                type="feather"
                                name="corner-down-right"
                                color={theme.colors.main['100']}
                                size={theme.typography.size(18)}
                            />
                            <View style={styles.view_gift_apply_img}>
                                <Image
                                    source={{ uri: giftFilter[indexGiftApply].image }}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text
                                size={'sub2'}
                                numberOfLines={2}
                                flex={0.9}
                                color={theme.colors.grey_[500]}
                                ml="tiny"
                            >
                                (quà tặng) {giftFilter[indexGiftApply].gift_name}
                            </Text>
                        </View>
                    ) : null}
                </View>
            ) : null}

            {/* total */}
            <View
                style={{
                    padding: theme.spacings.medium,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Text color={theme.colors.slate[900]} size={'body2'}>
                        Tổng tiền
                    </Text>
                    <Text color={theme.colors.pink[500]}>
                        {currencyFormat(cartItemSeller.total_items_price)}
                    </Text>
                </View>
            </View>

            {/* gift - bottomsheet */}
            <BottomSheet
                isVisible={openSheet}
                onBackdropPress={handleVisibleSheet}
                triggerOnClose={handleVisibleSheet}
                radius={true}
            >
                <View style={styles.view_sheet_title}>
                    <Text ta="center" size={'title1'}>
                        Danh sách quà tặng
                    </Text>
                    <Text ta="center" color={theme.colors.grey_[500]} mb="large">
                        (Mỗi gian hàng chỉ được áp dụng tối đa 1 phần quà)
                    </Text>
                    <View flexDirect="row" jC="space-between" mb="small">
                        <View flexDirect="row" aI="center">
                            <Icon type="material-community" name="storefront-outline" />
                            <Text fw="bold">{cartItemSeller.seller.seller_name}</Text>
                        </View>
                        <Text color="red" fw="bold">
                            {currencyFormat(cartItemSeller.total_items_price)}
                        </Text>
                    </View>
                </View>

                {/* list gift */}
                <View h={400}>
                    <ScrollView contentContainerStyle={{ paddingBottom: theme.spacings.medium }}>
                        {renderListGiftSheet()}
                    </ScrollView>
                </View>
                <View style={styles.view_sheet_btn}>
                    <Button
                        type="outline"
                        title="Huỷ bỏ"
                        onPress={cancelGiftApply}
                        minWidth={'48%'}
                        color={theme.colors.main['600']}
                    />
                    <Button
                        title="Áp dụng"
                        onPress={applyGiftToSeller}
                        minWidth={'48%'}
                        disabled={giftUuidSelected === undefined}
                    />
                </View>
            </BottomSheet>
        </View>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.white_[10],
        },
        view_top: {
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
            overflow: 'hidden',
        },
        touch_qty_modal: {
            flexDirection: 'row',
            alignItems: 'center',
            height: '100%',
            paddingHorizontal: theme.spacings.medium,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: theme.colors.teal[200],
            backgroundColor: theme.colors.white_[10],
        },
        input_qty_modal: {
            width: '100%',
            height: theme.dimens.verticalScale(40),
            marginVertical: theme.spacings.small,
            backgroundColor: theme.colors.white_[10],
        },
        touch_change_qty: {
            paddingHorizontal: theme.spacings.tiny,
            paddingVertical: theme.spacings.tiny - 1,
            backgroundColor: theme.colors.white_[10],
        },
        view_wrap_delivery: {
            // backgroundColor: theme.colors.teal['50'],
            // padding: theme.spacings.small,
            // borderWidth: 1,
            // borderColor: theme.colors.teal['100'],
            // borderRadius: 5,

            marginHorizontal: theme.spacings.medium,
            overflow: 'hidden',
        },
        //bottom sheet
        view_sheet_title: {
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey_[100],
        },
        view_sheet_btn: {
            paddingTop: theme.spacings.medium,
            borderTopWidth: 1,
            borderTopColor: theme.colors.grey_[200],
            flexDirection: 'row',
            justifyContent: 'space-evenly',
        },
        //gift
        touch_title_gift: {
            flexDirection: 'row',
            padding: theme.spacings.small,
            borderTopWidth: 1,
            borderTopColor: theme.colors.grey_[200],
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        view_select_gift: {
            flexDirection: 'row',
            marginTop: theme.spacings.small,
            marginLeft: theme.spacings.small,
        },
        view_gift_apply_img: {
            width: '9%',
            aspectRatio: 1,
            marginLeft: theme.spacings.small,
            borderWidth: 1,
            borderColor: theme.colors.main['100'],
            backgroundColor: theme.colors.main['50'],
            borderRadius: 5,
            padding: 3,
        },
        img_bg_voucher: {
            flexDirection: 'row',
            marginTop: theme.spacings.medium,
        },
        view_img_gift: {
            width: '16%',
            aspectRatio: 1,
            marginVertical: theme.spacings.large,
            marginHorizontal: theme.spacings.medium,
        },
        view_info_gift: {
            flex: 1,
            borderLeftWidth: 1,
            borderLeftColor: theme.colors.teal['800'],
            borderStyle: Platform.OS === 'android' ? 'dashed' : 'solid',
            justifyContent: 'center',
            paddingLeft: theme.spacings.small,
        },
        checkbox_container: {
            padding: 0,
            width: theme.spacings.medium,
            justifyContent: 'center',
        },
        //note
        view_input: {
            borderTopWidth: 0.8,
            borderBottomWidth: 0.8,
            borderColor: theme.colors.grey_[200],
            paddingHorizontal: theme.spacings.medium,
        },
    });

export default CheckoutSellerSection;
