/* eslint-disable react-hooks/exhaustive-deps */
import { Message, Status } from 'const/index';
import {
    NAVIGATION_TO_PRODUCT_DETAIL_SCREEN,
    NAVIGATION_TO_PRODUCT_DETAIL_STACK,
} from 'const/routes';
import { useIsLogin } from 'hooks/useCommon';
import useNavigate from 'hooks/useNavigate';
import { findIndex, isEmpty } from 'lodash';
import { CartItemResponseType, DataUpdateCartType, ParamsGetCartItemType } from 'models';
import { useCallback, useState } from 'react';
import { services } from 'services';
import useSWR, { SWRConfiguration, useSWRConfig } from 'swr';
import { addParamsToUrl } from 'utils/helpers';
import showLoadingApp from 'utils/showLoadingApp';
import showMessageApp from 'utils/showMessageApp';
import { sendSentryError } from 'utils/storeHelpers';

//key
//--addParamsToUrl('cart',{}): get item cart
//--addParamsToUrl('cart',{step:'checkout}): get item checkout
//--addParamsToUrl('cart',{page_size:5}):mini cart
//params:
//--step: lấy item của giỏ hàng hay thanh toán

export type ItemAddToCartListType = {
    name: string;
    product_uuid?: string;
    product_seller_uuid: string;
    price: string | number;
    qty?: string | number;
    image?: string;
};

export default function useCartSwr(
    params?: ParamsGetCartItemType,
    option?: SWRConfiguration,
    isFetch = true
) {
    //hook - chia se status voi component khac
    const [cartItemUpdate, setCartItemUpdate] = useState<
        | {
              type: 'update' | 'update_checkall' | 'remove';
              item?: CartItemResponseType;
              is_checked_all?: 'Y' | 'N';
          }
        | undefined
    >();
    const { mutate: mutateConfig } = useSWRConfig();
    const navigate = useNavigate();
    const isLogin = useIsLogin();

    //state
    const [statusAdd, setStatusAdd] = useState<string>(Status.DEFAULT);

    //key
    const key = addParamsToUrl('cart', params);

    //swr
    const {
        data,
        error,
        mutate: mt,
        isValidating,
        isLoading,
    } = useSWR(isFetch ? key : null, () => services.customer.getCartItems(params), { ...option });

    //value
    const listCartItems: any[] = data?._embedded?.items;

    const mutateCheck = () => (isFetch ? mt() : mutateConfig(key));

    // add to cart
    const addProductToCart = async (item: ItemAddToCartListType, isBuyNow?: boolean) => {
        try {
            const { product_uuid, product_seller_uuid, qty = 1 } = item;
            // check login
            if (!isLogin) {
                navigate.LOGIN_ROUTE({
                    screen: NAVIGATION_TO_PRODUCT_DETAIL_STACK,
                    params: {
                        screen: NAVIGATION_TO_PRODUCT_DETAIL_SCREEN,
                        params: {
                            product_uuid: product_uuid || product_seller_uuid,
                            product_seller_uuid: product_uuid ? product_seller_uuid : undefined,
                        },
                    },
                })();
                return;
            }
            //
            setStatusAdd(Status.LOADING);
            const result = await services.customer.addItemToCart(product_seller_uuid, qty);

            //buy now
            if (isBuyNow) {
                await updateCheckedCartItem({ is_checked_all: 'N' });
                if (result?.product_seller_uuid || result?.code === 'PRODUCT_EXIST_IN_CART') {
                    // await mutateCheck();
                    const res = await updateCheckedCartItem({
                        is_checked: 'Y',
                        product_seller_uuid,
                    });
                    setStatusAdd(Status.DEFAULT);
                    if (res) {
                        navigate.CART_ROUTE();
                    }
                    return;
                }
                throw '';
            }

            //add
            if (result?.product_seller_uuid) {
                mutateCheck();
                setStatusAdd(Status.SUCCESS);
                return item;
            }

            throw result;
        } catch (e: any) {
            console.log('error cart ', e);
            showMessageApp(e?.code || 'ADD_TO_CART_OTHER_ERROR');
            setStatusAdd(Status.ERROR);
            if (!e?.code) {
                sendSentryError(error, 'addProductToCart');
            }
            return undefined;
        }
    };

    // add to cart list
    const addProductListToCart = async (
        items: Array<ItemAddToCartListType>,
        isBuyNow?: boolean
    ) => {
        try {
            if (!isLogin) {
                navigate.LOGIN_ROUTE()();
                return;
            }
            setStatusAdd(Status.LOADING);
            const response = await Promise.all(
                items.map((v) => services.customer.addItemToCart(v.product_seller_uuid, v.qty))
            );
            // buy now
            if (response?.length > 0 && isBuyNow) {
                await updateCheckedCartItem({ is_checked_all: 'N' });
                await mutateCheck();
                const dataUpdateChecked = response
                    .map((v, i) =>
                        v.code ? { ...v, product_seller_uuid: items[i].product_seller_uuid } : v
                    )
                    .filter((v) => v !== undefined);
                // set item buy_now is checked in cart
                if (dataUpdateChecked.length > 0) {
                    const responseChecked = await Promise.all(
                        dataUpdateChecked.map((v) =>
                            updateCheckedCartItem({
                                is_checked: 'Y',
                                product_seller_uuid: v.product_seller_uuid,
                            })
                        )
                    );
                    setStatusAdd(Status.DEFAULT);
                    if (responseChecked.length > 0) {
                        navigate.CART_ROUTE();
                    }
                    return;
                }
                setStatusAdd(Status.DEFAULT);
                return;
            }

            // add
            if (response?.length > 0) {
                const dataAlert = items.map((v, i) => ({
                    ...v,
                    code: response[i]?.code,
                }));
                await mutateCheck();
                setStatusAdd(Status.SUCCESS);
                return dataAlert;
            }
            throw '';
        } catch (e: any) {
            console.log('error cart list', e);
            setStatusAdd(Status.ERROR);
            showMessageApp(e?.code || 'ADD_TO_CART_OTHER_ERROR');
            if (!e?.code) {
                sendSentryError(error, 'addProductListToCart');
            }
            return undefined;
        }
    };

    //handle for cart
    const removeItemFromCart = useCallback(
        async (product_seller_uuid?: string) => {
            try {
                if (product_seller_uuid) {
                    const response = await services.customer.removeItemFromCart(
                        product_seller_uuid
                    );
                    if (isEmpty(response)) {
                        const productIndex = findIndex(
                            data._embedded.items,
                            (value: any) => value.product_seller_uuid === product_seller_uuid
                        );
                        let newItems = [...data._embedded.items];
                        //get item update
                        setCartItemUpdate({
                            type: 'remove',
                            item: newItems[productIndex],
                        });
                        mutateCheck();
                        return response;
                    }
                    showMessageApp(response?.code);
                } else {
                    const response = await services.customer.removeAllItemsFromCart();
                    if (isEmpty(response)) {
                        mutateCheck();
                        return response;
                    }
                    showMessageApp(response?.code);
                }
            } catch (e) {
                sendSentryError(error, 'removeItemFromCart');
                showMessageApp();
                return e;
            }
        },
        [data]
    );

    //update cart item quantity
    //data: product_uuid, qty
    const updateCartItemQuantity = useCallback(
        async (cartData: DataUpdateCartType) => {
            try {
                // setStatus(Status.LOADING);
                const result = await services.customer.updateCartItem('quantity', cartData);
                if (isEmpty(result?.code)) {
                    // setStatus(Status.SUCCESS);
                    // setMessage(Message.NOT_MESSAGE);
                    const productIndex = findIndex(
                        data._embedded.items,
                        (value: any) => value.product_seller_uuid === cartData.product_seller_uuid
                    );
                    let newItems = [...data._embedded.items];

                    //get item update
                    const itemUpdate = {
                        ...newItems[productIndex],
                        qty: result.qty,
                        row_total: result.row_total,
                        price: result.price,
                    };
                    setCartItemUpdate({
                        type: 'update',
                        item: itemUpdate,
                    });

                    mutateCheck();
                    return result;
                }

                showMessageApp(result?.code, {
                    args: { qtyMaxStock: result.stock },
                });
                return result;
            } catch (e) {
                sendSentryError(error, 'updateCartItemQuantity');
                showMessageApp();
                return e;
            }
        },
        [data]
    );

    //update checked cart item
    //data['is_checked', product_seller_uuid]: update checked item
    //data['is_checked_all']: update checked all item
    const updateCheckedCartItem = useCallback(
        async (cartData: DataUpdateCartType) => {
            try {
                showLoadingApp(true);
                const response = await services.customer.updateCartItem('checked', cartData);
                if (isEmpty(response.code)) {
                    let cloneCartItems = [...data._embedded.items];
                    if (cartData.is_checked_all) {
                        //checked all item
                        setCartItemUpdate({
                            type: 'update_checkall', //checed all
                            is_checked_all: cartData.is_checked_all,
                        });
                    } else {
                        //checked item
                        const itemIndex = findIndex(
                            data._embedded.items,
                            (value: any) =>
                                value.product_seller_uuid === cartData.product_seller_uuid
                        );
                        const itemUpdate = {
                            ...cloneCartItems[itemIndex],
                            is_checked: response.is_checked,
                        };
                        setCartItemUpdate({
                            type: 'update',
                            item: itemUpdate,
                        });
                    }
                    mutateCheck();
                    return true;
                }
                throw response?.code;
            } catch (e: any) {
                sendSentryError(error, 'updateCheckedCartItem');
                showMessageApp(e);
                return false;
            } finally {
                showLoadingApp(false);
            }
        },
        [data]
    );

    //trong bước thanh toán sẽ kiểm tra lại giá và số lượng của sản phẩm trong giỏ hàng và sản phẩm kho của hệ thống
    const checkoutCartItems = useCallback(async () => {
        try {
            const result = await services.customer.checkoutCartItems();
            console.log('result checkout api ', result);
            if (result.code === 'CHECKOUT_SUCCESS') {
                return {
                    message: Message.CHECKOUT_SUCCESS,
                };
            } else if (result.code === 'NOT_ENOUGH_STOCK') {
                const dataError = {
                    stock: result.stock,
                    product_seller_uuid: result.product_seller_uuid,
                };
                return {
                    message: Message.CHECKOUT_NOT_ENOUGH_STOCK,
                    data: dataError,
                };
            } else if (result.code === 'NOT_EQUAL_PRICES') {
                const dataError = {
                    product_seller_uuid: result.product_seller_uuid,
                    product_price: result.product_price,
                };
                return {
                    message: Message.CHECKOUT_NOT_EQUAL_PRICES,
                    data: dataError,
                };
            } else {
                return {
                    message: Message.NOT_CHECKOUT,
                };
            }
        } catch (e) {
            sendSentryError(error, 'checkoutCartItems');
            return {
                message: Message.SYSTEMS_ERROR,
            };
        }
    }, []);

    return {
        //common
        key,
        data,
        listCartItems: listCartItems || [],
        totalItems: data?.total_items,
        pageSize: data?.page_size,
        mutate: mutateCheck,
        error,
        isValidating,
        isLoading,
        cartItemUpdate,
        //add
        statusAdd,
        setStatusAdd,
        addProductToCart,
        addProductListToCart,
        //remove
        removeItemFromCart,
        //update
        updateCartItemQuantity,
        updateCheckedCartItem,
        //checkout
        checkoutCartItems,
    };
}

export type CartSwrType = ReturnType<typeof useCartSwr>;
