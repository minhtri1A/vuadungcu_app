import { Icon } from '@rneui/themed';
import Alert from 'components/Alert';
import Button from 'components/Button';
import Header from 'components/Header2';
import Image from 'components/Image';
import ThreeDot from 'components/Spinner/ThreeDot';
import Switch from 'components/Switch';
import Text from 'components/Text';
import Touch from 'components/Touch';
import View from 'components/View';
import { NAVIGATION_ACCOUNT_STACK, NAVIGATION_EDIT_VERIFY_SCREEN } from 'const/routes';
import { SET_GIFTS_ORDER } from 'features/action';
import withAuth from 'hoc/withAuth';
import {
    useAppDispatch,
    useAppSelector,
    useCartAddressSwr,
    useCartOrdersSwr,
    useCartSummarySwr,
    useCartSwr,
    useCustomerSwr,
    useNavigate,
    useNavigation,
    useTheme,
} from 'hooks';
import { useRefreshControl } from 'hooks/useRefreshControl';
import { CartItemResponseType, CartItemsSellerResponseType } from 'models';
import React, { memo, useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { services } from 'services';
import { themeType } from 'theme';
import { currencyFormat, isEmpty } from 'utils/helpers';
import showLoadingApp from 'utils/showLoadingApp';
import BottomSheetInvoice from './components/BottomSheetInvoice';
import CheckoutSellerSection from './components/CheckoutSellerSection';
/* eslint-disable react-hooks/exhaustive-deps */

interface Props {}

const CheckoutScreen = memo(function CheckoutScreen({}: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const navigate = useNavigate();
    const navigation = useNavigation();
    const dispatch = useAppDispatch();

    //state
    const [cartItemsSeller, setCartItemsSeller] = useState<Array<CartItemsSellerResponseType>>([]);
    const [ordersNote, setOrdersNote] = useState<
        Array<{
            seller_uuid: string;
            note: string;
        }>
    >();
    const [openAlertPhoneConfirm, setOpenAlertPhoneConfirm] = useState(false);
    const [openAlertAddress, setOpenAlertAddress] = useState(false);
    const [checkUseCoin, setCheckUseCoin] = useState(false);
    //--gift
    const orderGifts = useAppSelector((state) => state.apps.orderGifts);
    //--receiving method
    const [sellersUuidPickup, setSellersUuidPickup] = useState<Array<string>>();

    //refresh
    const { refreshControl } = useRefreshControl(() => {
        mutateAddress();
        mutateCart();
        mutateCartSummary();
    });

    //swr
    const {
        cartAddress,
        mutate: mutateAddress,
        initFetch: initFetchCartAddress,
    } = useCartAddressSwr('shipping');

    const cartBillingSWR = useCartAddressSwr('billing');
    // [`delivery_option[${v}]`]: 'store_pickup'
    const {
        listCartItems,
        isLoading: isLoadingCart,
        error: errorCart,
        mutate: mutateCart,
    } = useCartSwr({ step: 'checkout' }, { revalidateOnMount: false });

    const {
        cartSummary,
        mutate: mutateCartSummary,
        isLoading: isLoadingSummary,
    } = useCartSummarySwr(
        sellersUuidPickup
            ? {
                  ...sellersUuidPickup.reduce(
                      (pre, cur) => ({ ...pre, [`delivery_option[${cur}]`]: 'store_pickup' }),
                      {}
                  ),
              }
            : undefined,
        {
            revalidateOnMount: false,
        }
    );

    const { createOrderCustomer } = useCartOrdersSwr(undefined, undefined, false);

    const {
        customers: { telephone_confirm, username },
        initFetch: initFetchCustomer,
    } = useCustomerSwr('all');

    //value

    /* --- effect --- */
    //--unmount
    useEffect(() => {
        // phai mutate nham lay du lieu moi nhat
        mutateCart();
        mutateCartSummary();
        dispatch(SET_GIFTS_ORDER([]));
    }, []);

    //--init data
    useEffect(() => {
        if (isLoadingCart) {
            showLoadingApp(true);
        }
        if (errorCart) {
            showLoadingApp(false);
        }
        if (!isLoadingCart && !isEmpty(listCartItems)) {
            createCartSellerData(listCartItems);
            return;
        }
    }, [listCartItems, isLoadingCart]);

    //--phone confirm
    useEffect(() => {
        if (
            username &&
            (telephone_confirm === null || telephone_confirm === 'N') &&
            initFetchCartAddress &&
            cartAddress
        ) {
            setOpenAlertPhoneConfirm(true);
        }
    }, [telephone_confirm, initFetchCustomer, initFetchCartAddress]);

    //--address alert
    useEffect(() => {
        if (initFetchCartAddress && cartAddress === null) {
            setOpenAlertAddress(true);
        }
    }, [cartAddress, initFetchCartAddress]);

    /* --- handle --- */
    const createCartSellerData = async (cartItems: Array<CartItemResponseType>) => {
        try {
            showLoadingApp(true);
            let cartItemsSeller_: Array<CartItemsSellerResponseType> = [];
            for (const v of cartItems) {
                const indexFind = cartItemsSeller_.findIndex((v2) => {
                    return v.seller_uuid === v2.seller.seller_uuid;
                });

                if (indexFind !== -1) {
                    cartItemsSeller_[indexFind] = {
                        ...cartItemsSeller_[indexFind],
                        total_items_price:
                            cartItemsSeller_[indexFind].total_items_price + parseInt(v.row_total),
                        items: [...(cartItemsSeller_[indexFind]?.items || []), v],
                    };
                } else {
                    //chưa có sellter thì thêm mới
                    const result = await services.admin.getSellerInfo(
                        'seller_uuid',
                        v?.seller_uuid
                    );
                    cartItemsSeller_ = [
                        ...cartItemsSeller_,
                        {
                            seller: result,
                            total_items_price: parseInt(v?.row_total),
                            items: [...(cartItemsSeller_[indexFind]?.items || []), v],
                        },
                    ];
                }
            }
            setCartItemsSeller(cartItemsSeller_);
        } catch (error: any) {
            showMessage({
                message: 'Đã xảy ra lỗi lấy thông tin gian hàng, xin vui lòng thử lại!',
                icon: 'danger',
            });
            // sendSentryError(error,"createCartSellerData Checkout" )
            navigate.GO_BACK_ROUTE();
        } finally {
            showLoadingApp(false);
        }
    };

    //--note
    const handleSetOrderNote = (seller_uuid: string, note: string) => () => {
        setOrdersNote((pre) => {
            const newPre = pre?.filter((v) => v.seller_uuid !== seller_uuid);

            return [...(newPre || []), { seller_uuid, note }];
        });
    };

    //--coin
    const setOrderUseCoin = () => {
        if (cartSummary?.max_score_use > 0) {
            setCheckUseCoin((pre) => !pre);
            return;
        }
        showMessage({
            message: 'Bạn không có đủ xu để thanh toán!',
            icon: 'danger',
        });
    };

    //--submit
    const createOrderCustomer_ = () => {
        if (cartAddress === null) {
            setOpenAlertAddress(true);
            return;
        }
        if ((telephone_confirm === null || telephone_confirm === 'N') && cartAddress) {
            setOpenAlertPhoneConfirm(true);
            return;
        }
        createOrderCustomer(
            {
                use_gift: orderGifts.join(','),
                use_coin:
                    checkUseCoin && cartSummary?.max_score_use > 0
                        ? cartSummary?.max_score_use
                        : undefined,
                ...(sellersUuidPickup
                    ? sellersUuidPickup.reduce(
                          (pre, cur) => ({ ...pre, [`delivery_option[${cur}]`]: 'store_pickup' }),
                          {}
                      )
                    : {}),
                ...(ordersNote
                    ? ordersNote.reduce(
                          (pre, cur) => ({
                              ...pre,
                              [`customer_note[${cur.seller_uuid}]`]: cur.note,
                          }),
                          {}
                      )
                    : {}),
            },
            listCartItems,
            cartSummary
        );
    };

    /* --- render --- */
    const renderCheckoutItemSeller = () =>
        cartItemsSeller.map((v, i) => (
            <CheckoutSellerSection
                cartItemSeller={v}
                cartSummary={cartSummary}
                handleSetOrderNote={handleSetOrderNote}
                setSellersUuidPickup={setSellersUuidPickup}
                key={i}
            />
        ));

    /* --- navigate --- */
    const navigateToPhoneConfirm = () => {
        setOpenAlertPhoneConfirm(false);
        navigation.navigate(NAVIGATION_ACCOUNT_STACK, {
            screen: NAVIGATION_EDIT_VERIFY_SCREEN,
            params: {
                type: 'telephone',
                title: 'Số điện thoại',
            },
        });
    };

    return (
        <View style={styles.container}>
            <Header
                center={
                    <Text size={'title2'} ta="center">
                        Thanh Toán
                    </Text>
                }
                showGoBack
                iconGoBackColor={theme.colors.black_[10]}
                bgColor={theme.colors.white_[10]}
            />

            {/* body */}
            <View flex={1}>
                {/* body item */}
                {/* <View style={{ padding: theme.spacings.medium }}>{renderCheckoutItemSeller()}</View> */}

                <ScrollView
                    contentContainerStyle={{ paddingBottom: theme.spacings.medium }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={refreshControl()}
                >
                    <View style={styles.view_top}>
                        {/* address */}
                        {cartAddress && (
                            <View style={styles.view_address}>
                                <View flexDirect="row" jC="space-between" aI="center">
                                    <View flexDirect="row" aI="center">
                                        <Icon
                                            type="ionicon"
                                            name="location"
                                            color={theme.colors.red['400']}
                                        />
                                        <Text
                                            ml={'tiny'}
                                            color={theme.colors.black_[10]}
                                            size={'body2'}
                                        >
                                            Địa chỉ giao hàng
                                        </Text>
                                    </View>
                                    <Touch onPress={navigate.ADDRESS_ROUTE({ type: 'shipping' })}>
                                        <Icon
                                            type="material-community"
                                            name="circle-edit-outline"
                                            color={theme.colors.grey_[400]}
                                            size={theme.typography.size(18)}
                                        />
                                    </Touch>
                                </View>
                                <View ph={'medium'} pv={'small'}>
                                    <Text
                                        color={theme.colors.grey_['600']}
                                    >{`${cartAddress.lastname} ${cartAddress.firstname} | ${cartAddress.telephone}`}</Text>
                                    <Text color={theme.colors.grey_['600']}>
                                        {cartAddress.street}
                                    </Text>
                                    <Text>{`${cartAddress.ward}, ${cartAddress.district}, ${cartAddress.province}`}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                    {renderCheckoutItemSeller()}

                    {/* coin */}
                    <View style={styles.view_section}>
                        <View flexDirect="row" jC="space-between" aI="center">
                            <View flexDirect="row" aI="center">
                                <View w={theme.typography.title2} ratio={1}>
                                    <Image
                                        source={require('asset/img-icon-coin.png')}
                                        resizeMode="contain"
                                    />
                                </View>

                                <Text ml={'small'} color={theme.colors.black_[10]} size={'body2'}>
                                    Xu tích luỹ{' '}
                                    <Text color={theme.colors.grey_[500]}>
                                        ({currencyFormat(cartSummary?.max_score_use, false)})
                                    </Text>
                                </Text>
                            </View>

                            <Switch value={checkUseCoin} onChange={setOrderUseCoin} />
                        </View>
                    </View>
                    {/* export invoice */}

                    <BottomSheetInvoice
                        trigger={
                            <View flexDirect="row" jC="space-between" aI="center">
                                <View flexDirect="row" aI="center">
                                    <Icon
                                        type="font-awesome-5"
                                        name="clipboard-list"
                                        size={theme.typography.size(20)}
                                        color={theme.colors.pink[500]}
                                    />

                                    <Text
                                        ml={'small'}
                                        color={theme.colors.black_[10]}
                                        size={'body2'}
                                    >
                                        Hoá đơn
                                    </Text>
                                </View>

                                <View flexDirect="row">
                                    {cartBillingSWR?.cartAddress?.address_uuid && (
                                        <Text color={theme.colors.grey_[500]} size={'body1'}>
                                            Chỉnh sửa
                                        </Text>
                                    )}
                                    <Icon
                                        type="ionicon"
                                        name="chevron-forward"
                                        size={theme.typography.size(20)}
                                        color={theme.colors.grey_[300]}
                                    />
                                </View>
                            </View>
                        }
                        triggerStyle={styles.view_section}
                        cartBillingSWR={cartBillingSWR}
                    />

                    {/* checkout */}
                    <View style={styles.view_checkout}>
                        <View flexDirect="row" jC="space-between" aI="center">
                            <View flexDirect="row" aI="center">
                                <View>
                                    <Icon
                                        type="entypo"
                                        name="credit-card"
                                        size={theme.typography.size(20)}
                                        color={theme.colors.blue[500]}
                                    />
                                </View>
                                <Text size={'body2'} ml={'small'} color={theme.colors.black_[10]}>
                                    Thanh toán
                                </Text>
                            </View>
                            <Text size={'sub3'} color={theme.colors.grey_[500]}>
                                Thanh toán khi nhận hàng
                            </Text>
                        </View>
                        <View
                            style={{
                                borderTopWidth: 1,
                                borderTopColor: theme.colors.blue['100'],
                                marginTop: theme.spacings.small,
                                borderStyle: Platform.OS === 'android' ? 'dashed' : 'solid',
                            }}
                        >
                            <View flexDirect="row" jC="space-between" mt={'small'}>
                                <Text>Tiền hàng</Text>
                                <Text color={theme.colors.grey_[500]}>
                                    {currencyFormat(cartSummary?.total.price_total)}
                                </Text>
                            </View>
                            {checkUseCoin ? (
                                <View flexDirect="row" jC="space-between" mt={'small'}>
                                    <Text>Xu</Text>
                                    <Text color={theme.colors.main['600']}>
                                        -{currencyFormat(cartSummary?.max_score_use)}
                                    </Text>
                                </View>
                            ) : null}

                            <View flexDirect="row" jC="space-between" mt={'small'}>
                                <Text>Vận chuyển</Text>
                                <Text color={theme.colors.teal[500]}>
                                    {isEmpty(cartSummary?.total.shipping_fee)
                                        ? 'Gian hàng liên hệ'
                                        : `${
                                              cartSummary?.total.shipping_fee[0] !==
                                              cartSummary?.total.shipping_fee[1]
                                                  ? `${currencyFormat(
                                                        cartSummary?.total.shipping_fee[0]
                                                    )} - `
                                                  : ''
                                          }${currencyFormat(cartSummary?.total.shipping_fee[1])}`}
                                </Text>
                            </View>
                            <View flexDirect="row" jC="space-between" mt={'small'}>
                                <Text fw="bold">
                                    {cartSummary?.total.shipping_is_temp
                                        ? 'Tổng thanh toán tạm'
                                        : 'Tổng thanh toán'}
                                </Text>
                                {isLoadingSummary ? (
                                    <ThreeDot size={7} />
                                ) : (
                                    <Text color={theme.colors.red[500]}>
                                        {currencyFormat(
                                            checkUseCoin
                                                ? cartSummary?.total.total_apply_score
                                                : cartSummary?.total.shipping_is_temp
                                                ? cartSummary?.total?.price_total
                                                : cartSummary?.total?.total
                                        )}
                                    </Text>
                                )}
                            </View>
                            {cartSummary?.total.shipping_is_temp && (
                                <View mt={'small'}>
                                    <Text ta="center" color={theme.colors.grey_[500]}>
                                        (Giá trên chưa bao gồm phí vận chuyển)
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>

                {/* tabBar */}
                <View style={styles.view_tabbar}>
                    <View flexDirect="row" jC="space-between">
                        <Text size={'body2'} fw="bold">
                            {cartSummary?.total.shipping_is_temp
                                ? 'Tổng thanh toán tạm'
                                : 'Tổng thanh toán'}
                        </Text>

                        {isLoadingSummary ? (
                            <ThreeDot size={10} />
                        ) : (
                            <Text size={'body2'} color={theme.colors.red[500]}>
                                {currencyFormat(
                                    checkUseCoin
                                        ? cartSummary?.total.total_apply_score
                                        : cartSummary?.total.shipping_is_temp
                                        ? cartSummary?.total?.price_total
                                        : cartSummary?.total?.total
                                )}
                            </Text>
                        )}
                    </View>
                    {cartSummary?.total.shipping_is_temp && (
                        <View mt="tiny">
                            <Text ta="center" color={theme.colors.grey_[500]}>
                                (Giá trên chưa bao gồm phí vận chuyển)
                            </Text>
                        </View>
                    )}

                    <Button
                        title={'Đặt hàng'}
                        containerStyle={{ marginTop: theme.spacings.small }}
                        onPress={createOrderCustomer_}
                    />
                </View>
            </View>

            {/* alert phone confirm */}
            <Alert
                title="Thêm số điện thoại cho tài khoản"
                message="Bạn cần thêm và xác minh số điện thoại cho tài khoản của mình để tiến hành mua sản phẩm này. Nhấn vào bên dưới để thêm số điện thoại!"
                isVisible={openAlertPhoneConfirm}
                messageProps={{ ta: 'center' }}
                modalProps={{ backdropOpacity: 0.4 }}
                okBtnTitle="Thêm số điện thoại"
                onOk={navigateToPhoneConfirm}
                onCancel={() => {
                    setOpenAlertPhoneConfirm(false);
                    navigate.GO_BACK_ROUTE();
                }}
            />
            {/* alert add address */}
            <Alert
                title="Thêm địa chỉ giao hàng"
                message="Bạn chưa có địa chỉ giao hàng, vui lòng thêm địa chỉ giao hàng để tiếp tục thành toán!"
                isVisible={openAlertAddress}
                messageProps={{ ta: 'center' }}
                modalProps={{ backdropOpacity: 0.4 }}
                okBtnTitle="Thêm địa chỉ"
                onOk={navigate.ADDRESS_ROUTE({ type: 'shipping' })}
                onCancel={() => {
                    setOpenAlertAddress(false);
                    navigate.GO_BACK_ROUTE();
                }}
            />
        </View>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.bgMain,
        },
        view_top: {},
        //header
        header_left: {
            flex: 0.2,
            alignItems: 'flex-start',
        },
        header_center: { flex: 0.8 },
        header_right: { flex: 0.2 },
        //address
        view_address: {
            marginTop: theme.spacings.medium,
            marginHorizontal: theme.spacings.medium,
            backgroundColor: theme.colors.white_[10],
            padding: theme.spacings.small,
            borderRadius: 10,
            borderColor: theme.colors.main['400'],
        },
        //coin
        view_section: {
            marginTop: theme.spacings.medium,
            marginHorizontal: theme.spacings.medium,
            backgroundColor: theme.colors.white_[10],
            paddingLeft: theme.spacings.medium,
            height: theme.dimens.verticalScale(40),
            justifyContent: 'center',
            borderRadius: 10,
            borderColor: theme.colors.main['400'],
        },
        //checkout
        view_checkout: {
            marginTop: theme.spacings.medium,
            marginHorizontal: theme.spacings.medium,
            backgroundColor: theme.colors.white_[10],
            padding: theme.spacings.medium,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.colors.blue['100'],
        },
        //tabbar
        view_tabbar: {
            padding: theme.spacings.medium,
            backgroundColor: theme.colors.white_[10],
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            borderTopWidth: 1,
            borderTopColor: theme.colors.main['50'],
        },
    });

export default withAuth(CheckoutScreen, true);
// export default CheckoutScreen;
