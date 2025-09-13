import { CheckBox } from '@rneui/themed';
import AfterInteractions from 'components/AfterInteractions';
import Button from 'components/Button';
import IconButton from 'components/IconButton';
import Image from 'components/Image';
import Loading from 'components/Loading';
import LoadingFetchAPI from 'components/LoadingFetchAPI';
import ThreeDot from 'components/Spinner/ThreeDot';
import Text from 'components/Text';
import Touch from 'components/Touch';
import View from 'components/View';
import { Message, Status } from 'const/index';
import { NAVIGATION_TO_CHECKOUT_SCREEN, NAVIGATION_TO_CHECKOUT_STACK } from 'const/routes';
import withAuth from 'hoc/withAuth';
import { useCartSummarySwr, useCartSwr, useNavigate, useNavigation, useTheme } from 'hooks';
import { useRefreshControl } from 'hooks/useRefreshControl';
import { every, filter } from 'lodash';
import { CartItemResponseType, CartItemsSellerResponseType, SellerInfoResponseType } from 'models';
import * as RootNavigation from 'navigation/RootNavigation';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Alert, FlatList, ListRenderItem, StyleSheet } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { services } from 'services';
import { themeType } from 'theme';
import { currencyFormat, isEmpty } from 'utils/helpers';
import { sendSentryError } from 'utils/storeHelpers';
import CartSellerSection from './components/CartSellerSection';
import Header from 'components/Header2';

/* eslint-disable react-hooks/exhaustive-deps */

interface Props {}

const CartScreen = memo(function CartScreen({}: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const navigate = useNavigate();
    const navigation = useNavigation();
    //swr
    const cartSwrObject = useCartSwr();
    const {
        cartItemUpdate,
        listCartItems,
        mutate: mutateCart,
        isValidating: isValidatingCart,
        checkoutCartItems,
        updateCheckedCartItem,
        removeItemFromCart,
        updateCartItemQuantity,
    } = cartSwrObject;

    const {
        cartSummary,
        isValidating: isValidatingSummary,
        mutate: mutateSummary,
    } = useCartSummarySwr(undefined, { revalidateOnMount: false });

    // refresh
    const { refreshControl } = useRefreshControl(() => {
        mutateCart();
        mutateSummary();
    });

    //state
    //--checkout
    const [errorCheckout, setErrorCheckout] = useState<any>({});
    const [statusCheckout, setStatusCheckout] = useState<string>(Status.DEFAULT);
    //--data
    const [cartSeller, setCartSeller] = useState<Array<CartItemsSellerResponseType>>([]);
    const totalItem = useRef<number | undefined>(undefined);
    //--check all
    const [checkedAll, setCheckedAll] = useState(false);
    const [countItemsChecked, setCountItemsChecked] = useState(0);
    //value

    /* --- effect --- */
    //-- unmounted
    useEffect(() => {
        return () => {
            setCartSeller([]);
            setErrorCheckout({});
            setCheckedAll(false);
            setCountItemsChecked(0);
        };
    }, []);

    //-- handle listCartItem change
    useEffect(() => {
        //check checked all
        const checkedAll_ = every(listCartItems, (value) => {
            return value.is_checked === 'Y';
        });
        setCheckedAll(checkedAll_);

        //count items checked
        const count = filter(listCartItems, (value) => value.is_checked === 'Y').length;
        setCountItemsChecked(count);

        //mutate summary
        if (listCartItems) {
            mutateSummary();
        }
        //create init cart seller data
        if (listCartItems && cartSeller.length === 0) {
            createCartSellerData(listCartItems);
        }
    }, [JSON.stringify(listCartItems)]);

    //-- handle update cartItem
    useEffect(() => {
        if (cartItemUpdate) {
            updateItemInCartSellerData();
        }
    }, [cartItemUpdate]);

    //--alert checkout
    useEffect(() => {
        if (!isEmpty(errorCheckout)) {
            renderAlertCheckout();
        }
    }, [errorCheckout]);

    /* --- handle --- */
    //-- xu ly khoi tao data cart item va seller
    const createCartSellerData = async (cartItems: Array<CartItemResponseType>) => {
        try {
            let cartSeller_: Array<CartItemsSellerResponseType> = [];
            for (const v of cartItems) {
                //check xem co ton tai seller chua
                const indexSeller = cartSeller_.findIndex((v2) => {
                    return v.seller_uuid === v2.seller.seller_uuid;
                });
                //neu ton tai thi add or update item vao seller hien tai
                if (indexSeller !== -1) {
                    //--add new items to the cart seller
                    cartSeller_[indexSeller] = {
                        ...cartSeller_[indexSeller],
                        total_items_price:
                            v.is_checked === 'Y'
                                ? cartSeller_[indexSeller].total_items_price + parseInt(v.row_total)
                                : cartSeller_[indexSeller].total_items_price,
                        items: [...(cartSeller_[indexSeller]?.items || []), v],
                    };
                } else {
                    //chưa có seller thì thêm mới seller
                    const result: SellerInfoResponseType = await services.admin.getSellerInfo(
                        'seller_uuid',
                        v.seller_uuid
                    );

                    cartSeller_ = [
                        ...cartSeller_,
                        {
                            seller: result,
                            total_items_price: v.is_checked === 'Y' ? parseInt(v.row_total) : 0,
                            items: [...(cartSeller_[indexSeller]?.items || []), v],
                        },
                    ];
                }
            }
            totalItem.current = listCartItems.length;
            setCartSeller(cartSeller_);
        } catch (error) {
            showMessage({
                message: 'Đã xảy ra lỗi lấy thông tin gian hàng, xin vui lòng thử lại!',
                icon: 'danger',
            });
            // sendSentryError(error,"createCartSellerData Checkout" )
            navigate.GO_BACK_ROUTE();
        }
    };
    //--xu ly update data cart item va seller
    const updateItemInCartSellerData = async () => {
        const { type, item, is_checked_all } = cartItemUpdate || {};
        //update
        setCartSeller((pre) => {
            let cloneCartSeller = [...pre];
            //update or remove handle
            if (type === 'update' || type === 'remove') {
                cloneCartSeller.forEach((v, sellerIndex) => {
                    if (v.seller.seller_uuid === item?.seller_uuid) {
                        //su dung spred thay vi update truc tiep vi mot so truong hop khi update truc tiep component se khong re render lai
                        const itemUpdateIndex = v.items.findIndex(
                            (v2) => v2.product_seller_uuid === item.product_seller_uuid
                        );
                        let cloneItems = [...cloneCartSeller[sellerIndex].items];
                        //update qty or checked item
                        if (type === 'update') {
                            //update new item in seller data
                            cloneItems[itemUpdateIndex] = item;
                        }
                        //remove item
                        if (type === 'remove') {
                            if (cloneItems.length === 1) {
                                cloneCartSeller.splice(sellerIndex, 1);
                                return;
                            }
                            cloneItems.splice(itemUpdateIndex, 1);
                        }

                        //total price item
                        const totalItemPrice = cloneItems.reduce(
                            (num, curr) =>
                                curr.is_checked === 'Y' ? num + parseInt(curr.row_total) : num,
                            0
                        );
                        cloneCartSeller[sellerIndex] = {
                            ...cloneCartSeller[sellerIndex],
                            total_items_price: totalItemPrice,
                            items: cloneItems,
                        };
                    }
                });
                return cloneCartSeller;
            }

            //checked all handle
            if (type === 'update_checkall' && is_checked_all) {
                return cloneCartSeller.map((v) => ({
                    ...v,
                    items: v.items.map((v2) => ({
                        ...v2,
                        is_checked: is_checked_all,
                    })),
                    total_items_price: v.items.reduce(
                        (total, curr) =>
                            is_checked_all === 'Y' ? total + parseInt(curr.row_total) : 0,
                        0
                    ),
                }));
            }
            //type invalid
            return pre;
        });
    };
    //--xu ly truoc khi checkout
    const handleCheckoutCart = async () => {
        try {
            //check cart before checkout
            setStatusCheckout(Status.LOADING);
            const resultCheckout = await checkoutCartItems();
            const { message, data } = resultCheckout;
            if (message === Message.CHECKOUT_SUCCESS) {
                setStatusCheckout(Status.SUCCESS);
                navigation.navigate(NAVIGATION_TO_CHECKOUT_STACK, {
                    screen: NAVIGATION_TO_CHECKOUT_SCREEN,
                });
                return;
            }
            if (
                message === Message.CHECKOUT_NOT_ENOUGH_STOCK ||
                message === Message.CHECKOUT_NOT_EQUAL_PRICES
            ) {
                setStatusCheckout(Status.ERROR);
                setErrorCheckout(data);
            }
        } catch (error: any) {
            sendSentryError(error, 'handleCheckoutCart');
        }
    };
    //--checked all
    const handleUpdateCheckedAllCartItems = () => {
        const checked = checkedAll ? 'N' : 'Y';
        updateCheckedCartItem({ is_checked_all: checked });
    };
    //--remove all
    const removeAllItemsFromCart = () => {
        Alert.alert(
            '',
            'Bạn có muốn xoá tất cả sản phẩm này ?',
            [
                {
                    text: 'Huỷ',
                    style: 'cancel',
                },
                {
                    text: 'Xoá sản phẩm',
                    onPress: () => {
                        // dispatch(REMOVE_ITEM_IN_CART({}));
                        (async () => {
                            const result = await removeItemFromCart();
                            if (isEmpty(result)) {
                                setCartSeller([]);
                            }
                        })();
                    },
                    style: 'cancel',
                },
            ],
            {
                cancelable: true,
            }
        );
    };

    /* --- render --- */

    //--alert check qty and price before checkout
    const renderMessageAlert = (): string => {
        const itemErr = filter(
            listCartItems,
            (value) => value.product_seller_uuid === errorCheckout?.product_seller_uuid
        );
        console.log('errorCheckout ', errorCheckout);
        let messageAlert = '';
        if (errorCheckout?.stock) {
            messageAlert = `Sản phẩm "${itemErr[0]?.name}" chỉ còn lại "${errorCheckout?.stock} sản phẩm" , xin vui lòng thử lại !`;
        } else if (errorCheckout?.product_price) {
            messageAlert = `Sản phẩm "${
                itemErr[0]?.name
            }" đã được cập nhật giá mới là "${currencyFormat(
                parseInt(errorCheckout.product_price)
            )}".`;
        }

        const messageAlertParse = messageAlert;

        return messageAlertParse;
    };
    const renderAlertCheckout = () => {
        errorCheckout?.product_price
            ? Alert.alert('Thông báo', renderMessageAlert(), [
                  {
                      text: 'Xem giỏ hàng',
                      style: 'cancel',
                      onPress: () => {
                          //xu ly update lai gia san pham trong gio hang(xu ly sau)
                          mutateCart();
                      },
                  },

                  {
                      text: 'Tiếp tục mua hàng',
                      onPress: () => {
                          RootNavigation.navigate(NAVIGATION_TO_CHECKOUT_SCREEN);
                      },
                  },
              ])
            : Alert.alert('Thông báo', renderMessageAlert(), [
                  {
                      text: 'Xem lại giỏ hàng',
                      style: 'cancel',
                      onPress: () => {
                          mutateCart();
                      },
                  },
              ]);
    };

    const renderCartItemSeller: ListRenderItem<CartItemsSellerResponseType> = ({ item, index }) => (
        <CartSellerSection
            cartItemsSection={item}
            key={index}
            errorCheckout={errorCheckout}
            updateCartItemQuantity={updateCartItemQuantity}
            updateCheckedCartItem={updateCheckedCartItem}
            removeItemFromCart={removeItemFromCart}
        />
    );

    return (
        <View style={styles.container}>
            <Header
                center={
                    <Text size={'title2'} ta="center">
                        Giỏ hàng
                    </Text>
                }
                showGoBack
                iconGoBackColor={theme.colors.black_[10]}
                bgColor={theme.colors.white_[10]}
            />
            <AfterInteractions>
                {!isEmpty(cartSeller) ? (
                    <>
                        <View style={styles.view_head_title}>
                            <Touch
                                flexDirect="row"
                                aI="center"
                                onPress={handleUpdateCheckedAllCartItems}
                                activeOpacity={0.8}
                            >
                                <CheckBox
                                    checked={checkedAll}
                                    style={styles.check_head_style}
                                    containerStyle={styles.check_head_container}
                                    iconType={'ionicon'}
                                    size={theme.typography.size(25)}
                                    checkedIcon="checkbox"
                                    uncheckedIcon="square-outline"
                                    uncheckedColor={theme.colors.main['300']}
                                    checkedColor={theme.colors.main['600']}
                                    onPress={handleUpdateCheckedAllCartItems}
                                />
                                <Text color={theme.colors.grey_[700]} size={'body1'} fw="bold">
                                    Tất cả(Đã chọn {countItemsChecked} sản phẩm)
                                </Text>
                            </Touch>
                            <IconButton
                                type="ionicon"
                                name="trash-outline"
                                color={theme.colors.grey_[300]}
                                size={theme.typography.size(23)}
                                onPress={removeAllItemsFromCart}
                            />
                        </View>
                    </>
                ) : null}
                {/* body item */}
                <FlatList
                    data={cartSeller}
                    // keyExtractor={(_, index) => `${index}`}
                    renderItem={renderCartItemSeller}
                    showsVerticalScrollIndicator={false}
                    // ListHeaderComponent={

                    // }
                    ListEmptyComponent={
                        !isEmpty(listCartItems) || isValidatingCart ? (
                            <View>
                                <LoadingFetchAPI
                                    visible={true}
                                    color={theme.colors.main['200']}
                                    size={theme.typography.size(30)}
                                />
                            </View>
                        ) : (
                            <View
                                flex={1}
                                h={theme.dimens.verticalScale(500)}
                                jC="center"
                                aI="center"
                            >
                                <View w={theme.dimens.scale(150)} ratio={1}>
                                    <Image source={require('asset/empty-cart1.png')} />
                                </View>
                                <Text color={theme.colors.grey_[500]} size={'body2'}>
                                    Bạn chưa có đơn hàng nào
                                </Text>
                            </View>
                        )
                    }
                    contentContainerStyle={{ paddingBottom: theme.spacings.medium }}
                    keyboardDismissMode="none"
                    keyboardShouldPersistTaps="never"
                    refreshControl={refreshControl()}
                />
                {/* bottom */}
                <View style={styles.view_bottom_tab}>
                    <View flexDirect="row" jC="space-between" mb="medium">
                        <Text size={'body2'} fw="bold">
                            Tạm tính
                            {cartSummary?.total?.item_count > 0
                                ? `(${cartSummary?.total?.item_count})`
                                : ''}
                        </Text>
                        <View>
                            {isValidatingSummary ? (
                                <ThreeDot
                                    color={theme.colors.main[400]}
                                    size={theme.typography.size(9)}
                                />
                            ) : (
                                <Text size={'body2'} color={theme.colors.red[500]}>
                                    {currencyFormat(cartSummary?.total?.price_total)}
                                </Text>
                            )}
                        </View>
                    </View>
                    <Button
                        title={'Xác nhận'}
                        onPress={handleCheckoutCart}
                        disabled={isEmpty(cartSummary?.total?.item_count)}
                    />
                </View>
            </AfterInteractions>
            {/* loading */}
            <Loading visible={statusCheckout === Status.LOADING} text={'Đang xử lý'} />
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
            alignItems: 'center',
        },
        header_left: {
            flex: 0.2,
            alignItems: 'flex-start',
        },
        header_center: {
            flex: 0.8,
        },
        header_right: {
            flex: 0.2,
        },
        //head
        view_head_title: {
            flexDirection: 'row',
            backgroundColor: theme.colors.white_[10],
            padding: theme.spacings.medium,

            width: '100%',
            justifyContent: 'space-between',
        },
        check_head_style: {
            padding: 0,
            margin: 0,
        },
        check_head_container: {
            padding: 0,
            margin: 0,
            marginLeft: 0,
            marginRight: 0,
        },
        //
        view_bottom_tab: {
            backgroundColor: theme.colors.white_[10],
            padding: theme.spacings.medium,
            borderTopWidth: 1,
            borderTopColor: theme.colors.main['50'],
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
        },
    });

export default withAuth(CartScreen, true);
// export default CartScreen;
