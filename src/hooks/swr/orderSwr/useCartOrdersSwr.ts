import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message, Routes, Status } from 'const/index';
import { useNavigation } from 'hooks/useCommon';
import { forEach, last } from 'lodash';
import {
    CartItemResponseType,
    CartOrdersResponseType,
    CartSummaryResponseType,
    DataCreateOrderCustomerType,
    OrdersType,
    ParamsGetCartOrdersType,
} from 'models';
import { useState } from 'react';
import { services } from 'services';
import { SWRConfiguration, useSWRConfig } from 'swr';
import useSWRInfinite from 'swr/infinite';
import { addParamsToUrl, isEmpty } from 'utils/helpers';
import showLoadingApp from 'utils/showLoadingApp';
import showMessageApp from 'utils/showMessageApp';
import { sendSentryError } from 'utils/storeHelpers';
import { OrderReturnsType } from '../../../models/resModel';
import { CartOrdersSwrType } from '../../../models/swrModel';
// import { CART_KEY } from 'constants/keySwr';

//key:dynamic key

export default function useCartOrdersSwr(
    params?: ParamsGetCartOrdersType,
    option?: SWRConfiguration,
    fetch = true
): CartOrdersSwrType {
    //hooks
    const [status, setStatus] = useState<string>(Status.DEFAULT);
    const [message, setMessage] = useState(Message.NOT_MESSAGE);
    const { mutate: mutateConfig } = useSWRConfig();
    const navigation = useNavigation();
    //swr
    const {
        data: dt,
        error,
        mutate,
        size,
        setSize,
        isValidating,
    } = useSWRInfinite<any, any>(
        (index) => {
            return fetch ? addParamsToUrl('/carts/orders', { ...params, page: index + 1 }) : null;
        },
        (url) => services.get(url),
        option
    );
    const dt2: any = dt;
    const data: Array<CartOrdersResponseType> = dt2;
    const loadingInit = !data && !error ? Status.LOADING : Status.DEFAULT;
    //pagination
    const { page, page_count, page_size, total_items } = last(data) || {};
    const pagination: any = {
        page,
        page_count,
        page_size,
        total_items,
    };

    const createOrderCustomer = async (
        data_: DataCreateOrderCustomerType,
        listCartItems: CartItemResponseType[],
        cartSummary: CartSummaryResponseType
    ) => {
        showLoadingApp(true, 'Đang xử lý...');
        try {
            const result = await services.customer.createOrderCustomer(data_);
            const cartKey = addParamsToUrl('cart', {});
            if (result.code === 'SUCCESS') {
                //save checkout data to async storage
                await AsyncStorage.setItem(
                    'order-success',
                    JSON.stringify({ listCartItems, cartSummary })
                );
                //navigate
                navigation.replace(Routes.NAVIGATION_TO_ORDER_SUCCESS_SCREEN);
                //reset cart and mini cart
                await mutateConfig(cartKey);
                return true;
            }
            throw result.code;
        } catch (e: any) {
            sendSentryError(e, 'createOrderCustomer');
            showMessageApp(e);
            return false;
        } finally {
            showLoadingApp(false);
        }
    };

    const cancelOrderCustomer = async (order_uuid: string) => {
        setStatus(Status.LOADING);
        try {
            const result = await services.customer.cancelOrderCustomer(order_uuid);
            if (result.code === 'SUCCESS') {
                const cartOrderStatusKey = addParamsToUrl('carts/orders/status-count', {});
                setMessage(Message.CANCEL_ORDER_SUCCESS);
                setStatus(Status.SUCCESS);
                mutate();
                mutateConfig(cartOrderStatusKey);
                return true;
            }
            setMessage(Message.CANCEL_ORDER_FAILED);
            setStatus(Status.ERROR);
            return false;
        } catch (e) {
            setMessage(Message.SYSTEMS_ERROR);
            setStatus(Status.ERROR);
            return false;
        }
    };

    const repurchaseOrderCustomer = async (order_uuid: string) => {
        try {
            showLoadingApp(true);
            const result = await services.customer.repurchaseOrderCustomer(order_uuid);
            if (result.code === 'SUCCESS') {
                navigation.navigate(Routes.NAVIGATION_CART_STACK);
                return true;
            }
            throw result.code;
        } catch (e: any) {
            showMessageApp(e);
            showLoadingApp(false);
            return false;
        }
    };

    //orders data - order returns data
    let orders: Array<OrdersType> = [];
    let orderReturns: Array<OrderReturnsType> = [];
    forEach(data, (values) => {
        if (!isEmpty(values.data.orders)) {
            orders = [...orders, ...values.data.orders];
        }
        if (!isEmpty(values.data.order_returns)) {
            orderReturns = [...orderReturns, ...values.data.order_returns];
        }
    });

    return {
        data,
        orders,
        orderReturns,
        pagination,
        size,
        setSize,
        mutate,
        loadingInit,
        isValidating,
        createOrderCustomer,
        cancelOrderCustomer,
        repurchaseOrderCustomer,
        status,
        message,
        setStatus,
        setMessage,
    };
}
