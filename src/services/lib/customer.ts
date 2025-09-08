import { AxiosRequestHeaders } from 'axios';
import {
    ActionGetCustomerInfoType,
    ActionTypeGetEventCoinType,
    ActionTypeGetEventQrCode,
    CartAddressResponseType,
    CustomerAddressListResponseType,
    DataCreateCustomerAddressType,
    DataCreateOrderCustomerType,
    DataCreateOrderReturnsType,
    DataEditCustomerPosInfoType,
    DataLoginType,
    DataLoginUserType,
    DataProductReviewType,
    DataPutCartAddressType,
    DataPutCustomerInfoType,
    DataRegisterType,
    DataSaveDeviceInfoDownloader,
    DataUpdateCartType,
    DataUpdateCustomerAddressType,
    DataUpdateProductReviewType,
    DataUpdateReturnsCheckedType,
    LoginResponseType,
    ParamsGetCartItemType,
    ParamsGetCartOrdersType,
    ParamsGetCustomerWarranties,
    ParamsGetListCustomerAddressType,
    ParamsGetListGiftCustomer,
    ParamsGetReferrerInfoWithDataDevice,
    PosCustomerInfoResponseType,
    PosCustomerScoreHistoryListResponseType,
    PosCustomerTicketDetailResponseType,
    PosCustomerTicketListResponseType,
    PosListResponseType,
    StartSpinResponseType,
} from 'models';
import Config from 'react-native-config';
import { ServiceType } from '..';
import { DataCreateScoreTransfer, ParamsGetCartSummaryType } from './../../models/apiModel';

export interface customerApiType {
    //user
    login<K extends keyof DataLoginType>(
        data: DataLoginType[K],
        action: K,
        register?: boolean
    ): Promise<LoginResponseType>;
    loginUser(data: DataLoginUserType): any;
    registerAccount(dataRegister: DataRegisterType): any;
    //customer
    getCurrentCustomer(): any;
    getPointCustomer(): any;
    getCustomers(action: ActionGetCustomerInfoType): any;
    putCustomers(action: ActionGetCustomerInfoType, data: DataPutCustomerInfoType): any;
    deleteCustomer(reason: string): any;
    //cart
    getCartItems(params?: ParamsGetCartItemType): any;
    addItemToCart(
        product_seller_uuid: string,
        qty?: string | number
    ): Promise<{
        code?: string;
        product_seller_uuid?: string;
        qty?: number;
    }>;
    updateCartItem(
        action_type: 'quantity' | 'checked' | 'checked_all',
        data: DataUpdateCartType
    ): any;
    removeItemFromCart(product_seller_uuid: string): any;
    removeAllItemsFromCart(): any;
    checkoutCartItems(): any;
    getMineSummary(
        action_type: 'cart-summary' | 'checkout-summary' | 'returns-summary',
        order_uuid?: string,
        params?: ParamsGetCartSummaryType
    ): any;

    //cart addrees
    getCartAddress(type: 'shipping' | 'billing'): Promise<CartAddressResponseType>;
    putCartAddress(type: 'shipping' | 'billing', address: DataPutCartAddressType): any;
    // cart delivery
    getCartDelivery(action?: 'delivery' | 'delivery-fee', headers?: AxiosRequestHeaders): any;
    updateCartDelivery(delivery_uuid: string): any;
    //customer address
    getListCustomerAddress(
        params?: ParamsGetListCustomerAddressType
    ): Promise<CustomerAddressListResponseType>;
    createCustomerAddress(data: DataCreateCustomerAddressType): any;
    updateCustomerAddress(address_uuid: string, data: DataUpdateCustomerAddressType): any;
    deleteCustomerAddress(address_uuid: string): any;
    //order
    createOrderCustomer(data?: DataCreateOrderCustomerType): any;
    getCartOrders(params?: ParamsGetCartOrdersType): any;
    getCartOrderDetail(order_uuid: string): any;
    cancelOrderCustomer(order_uuid: string): any;
    repurchaseOrderCustomer(order_uuid: string): any;
    getStatusCountOrderCustomer(): any;
    getOrderItems(order_uuid: string): any;
    getOrderConfig(): any;
    getCartOrderDetailReturns(memo_uuid: string): any;
    updateReturnsChecked(order_uuid: string, data: DataUpdateReturnsCheckedType): any;
    createOrderReturns(order_uuid: string, data: DataCreateOrderReturnsType): any;
    //event qr code
    getEventQrCode(action: ActionTypeGetEventQrCode): any;
    getEventQrCodeLog(action: 'log', log_type: 'in' | 'all' | 'out'): any;
    checkQrCodeAndUpdateQrScore(qr_code: string): any;
    //event coin
    getEventCoin(action: ActionTypeGetEventCoinType): any;
    getEventCoinLog(action: 'log', log_type: 'in' | 'all' | 'out'): any;
    //event loyal point
    getEventLoyalHistory(): any;
    //warranty
    getCustomerWarranties(params: ParamsGetCustomerWarranties): any;
    getCustomerWarrantyDetail(warranty_uuid: string): any;
    //loyal point transfer
    putLoyalPointTransfer(data: { score: string }): any;
    getLoyalPointTransfer(): any;

    //gift
    getListGiftCustomer(params?: ParamsGetListGiftCustomer): any;
    //spin
    getSpinAttendance(): any;
    startSpinWheel(): Promise<StartSpinResponseType>;
    //referral
    getCustomerReferralCode(): Promise<{ referral_code: string }>;
    getReferrerInfoWithDataDevice(params: ParamsGetReferrerInfoWithDataDevice): any;
    getConnectedReferralCode(): any;
    getReferrerNameWithReferrerCode(referral_code: string): any;
    saveDeviceInfoDownloader(data: DataSaveDeviceInfoDownloader): any;
    saveConnectDownloaderAndReferrer(referral_code: string): any;
    //preview
    getProductReviews(params: {
        product_seller_uuid: string;
        page?: number;
        page_size?: number;
        score?: string;
        has_media?: 'Y' | 'N';
    }): any;
    getCustomerReviews(params: { page?: number; page_size?: number }): any;
    getProductReviewsSummary(params: { product_seller_uuid: string }): any;
    createProductPreview(data: DataProductReviewType): {
        result: 'SUCCESS' | 'ERROR';
        code?: string;
    };
    updateProductReview(
        review_uuid: string,
        data: DataUpdateProductReviewType
    ): {
        result: 'SUCCESS' | 'ERROR';
        code?: string;
    };
    //pos
    getCheckConnectPos(): Promise<{ result: 'Y' | 'N' }>;
    connectCustomerPos(): any;
    getOrdersCustomerPos(): any;
    getOrderDetailCustomerPos(id: string): any;
    //pos new
    getPosList(): Promise<PosListResponseType>;
    getPosCustomerInfo(seller_uuid: string): Promise<PosCustomerInfoResponseType>;
    getPosCustomerScoreHistoryList(
        seller_uuid: string
    ): Promise<PosCustomerScoreHistoryListResponseType>;
    getPosCustomerTicketList(seller_uuid: string): Promise<PosCustomerTicketListResponseType>;
    getPosCustomerTicketDetail(
        seller_uuid: string,
        ticket_id: string
    ): Promise<PosCustomerTicketDetailResponseType>;
    connectCustomerWebAndPos(seller_uuid: string): Promise<{
        code: string;
    }>;
    editCustomerPosInfo(
        seller_uuid: string,
        data: DataEditCustomerPosInfoType
    ): Promise<{
        code: string;
    }>;
    createScoreTransfer(
        seller_uuid: string,
        data: DataCreateScoreTransfer
    ): Promise<{
        code: string;
        score_transfer: { code: string; score_trans: string; expires: string };
    }>;
}

export default function customers(service: ServiceType): customerApiType {
    return {
        login: (data, _, register = true) =>
            service.post('/oauth', {
                ...data,
                register,
                grant_type: 'password',
                client_id: Config.REACT_NATIVE_APP_CLIENT_ID,
                client_secret: Config.REACT_NATIVE_APP_CLIENT_SECRET,
            }),
        loginUser: ({
            username,
            password,
            provider,
            provider_key,
            provider_token,
            referral_code,
            register = true,
        }) => {
            const client_id = Config.REACT_NATIVE_APP_CLIENT_ID;
            const client_secret = Config.REACT_NATIVE_APP_CLIENT_SECRET;
            const grant_type = 'password';
            return service.post('/oauth', {
                username,
                password,
                provider,
                provider_key,
                provider_token,
                client_id,
                client_secret,
                grant_type,
                referral_code,
                register,
            });
        },
        //
        registerAccount: (dataRegister) => service.post('/customers', dataRegister),
        getCurrentCustomer: () => service.get('/customers/name'),
        getPointCustomer: () => service.get('/customers/loyal-pos'),
        getCustomers: (action) => service.get(`customers/${action}`),
        putCustomers: (action, data) => service.put(`customers/${action}`, data),
        deleteCustomer: (reason) => service.put('customers/delete-customer', { reason }),
        //cart
        getCartItems: (params) => service.get('/carts/items', undefined, { ...params }),
        addItemToCart: (product_seller_uuid, qty) =>
            service.post('/carts/items', { product_seller_uuid, qty }),
        removeAllItemsFromCart: () => service.delete('/carts/items'),
        updateCartItem: (action_type, data) => service.put(`/carts/items/${action_type}`, data),
        removeItemFromCart: (product_seller_uuid: any) =>
            service.delete(`/carts/items/${product_seller_uuid}`),
        checkoutCartItems: () => service.get('/carts/items/checkout'),
        //cart summary
        getMineSummary: (action_type, Orderuuid, params) =>
            service.get(`/carts/mine/${action_type}`, undefined, params, { Orderuuid }),
        //cart address
        getCartAddress: (type) => service.get(`/carts/address/${type}`),
        putCartAddress: (type, address) => service.put(`/carts/address/${type}`, address),
        //cart delivery
        getCartDelivery: (action, headers?: AxiosRequestHeaders) => {
            return action
                ? service.get(`carts/deliveries/${action}`, undefined, undefined, headers)
                : service.get(`carts/deliveries`, undefined);
        },
        updateCartDelivery: (delivery_uuid) => service.put(`carts/deliveries/${delivery_uuid}`),
        //customer address
        getListCustomerAddress: (params) => service.get('/address', undefined, params),
        createCustomerAddress: (data) => service.post('/address', data),
        updateCustomerAddress: (address_uuid, data) => service.put(`address/${address_uuid}`, data),
        deleteCustomerAddress: (address_uuid) => service.delete(`/address/${address_uuid}`),
        //order
        getCartOrders: (params) => service.get('/carts/orders', undefined, params),
        getCartOrderDetail: (Orderuuid) =>
            service.get('/carts/orders/detail', undefined, undefined, { Orderuuid }),
        createOrderCustomer: ($data) => service.post('/carts/orders', $data),
        cancelOrderCustomer: (Orderuuid) =>
            service.put('/carts/orders/cancel-order', undefined, { Orderuuid }),
        repurchaseOrderCustomer: (Orderuuid) =>
            service.put('/carts/orders/repurchase', undefined, { Orderuuid }),
        getStatusCountOrderCustomer: () => service.get('/carts/orders/status-count'),
        getOrderItems: (Orderuuid) =>
            service.get('/carts/orders/order-items', undefined, undefined, {
                Orderuuid,
            }),
        getOrderConfig: () => service.get('/carts/orders/configs'),
        getCartOrderDetailReturns: (Memouuid) =>
            service.get('/carts/orders/detail-returns', undefined, undefined, { Memouuid }),
        updateReturnsChecked: (Orderuuid, data) =>
            service.put('/carts/orders/returns-checked', data, { Orderuuid }),
        createOrderReturns: (Orderuuid, data) =>
            service.put('/carts/orders/returns-order', data, { Orderuuid }),
        //event qr code
        getEventQrCode: (action) => service.get(`/event/qr-scan/${action}`),
        getEventQrCodeLog: (action, log_type) =>
            service.get(`/event/qr-scan`, undefined, { action, log_type }),
        checkQrCodeAndUpdateQrScore: (qr_code) => service.put('/event/qr-scan/scan', { qr_code }),
        //event coin
        getEventCoin: (action) => service.get(`/event/coin/${action}`),
        getEventCoinLog: (action, log_type) =>
            service.get('/event/coin', undefined, { action, log_type }),
        //event loyal
        getEventLoyalHistory: () => service.get('/pos/scores?type=history'),
        //warranty
        getCustomerWarranties: (params) => service.get('/warranty', undefined, params),
        getCustomerWarrantyDetail: (warranty_uuid) => service.get(`/warranty/${warranty_uuid}`),
        //loyal point transfer
        putLoyalPointTransfer: (data) => service.put('/pos/scores/transfer', data),
        getLoyalPointTransfer: () => service.get('/pos/scores/transfer'),
        //pos
        getCheckConnectPos: () => service.get('/customers/check-pos-connect'),
        connectCustomerPos: () => service.put('/customers/connect-pos'),
        getOrdersCustomerPos: () => service.get('/pos/orders'),
        getOrderDetailCustomerPos: (id) => service.get(`/pos/orders/${id}`),
        //gift
        getListGiftCustomer: (params) => service.get('/gifts', undefined, params),
        //spin
        getSpinAttendance: () => service.get('/spins/attendance'),
        startSpinWheel: () => service.post('/spins/attendance'),
        //referral
        getCustomerReferralCode: () => service.get('/customers/referral'),
        getReferrerInfoWithDataDevice: (params) =>
            service.get('/devices/share/sharer', undefined, params),
        getConnectedReferralCode: () => service.get('/customers/connect-referral'),
        getReferrerNameWithReferrerCode: (referral_code) =>
            service.get('/customers/sharer', undefined, { referral_code }),
        saveDeviceInfoDownloader: (data) => service.post('/devices/share', data),
        saveConnectDownloaderAndReferrer: (referral_code) =>
            service.put('/customers/connect-referral', { referral_code }),
        //preview
        getProductReviews: (params) => service.get('/products/reviews', undefined, params),
        getCustomerReviews: (params) =>
            service.get('/products/reviews', undefined, { object: 'customer', ...params }),
        getProductReviewsSummary: (params) =>
            service.get('/products/reviews/summary', undefined, params),
        createProductPreview: (data) => service.post('/products/reviews', data),
        updateProductReview: (review_uuid, data) =>
            service.put(`/products/reviews/${review_uuid}`, data),
        //pos new
        getPosList: () => service.get('/pos/connects'),
        getPosCustomerInfo: (seller_uuid) => service.get(`/pos/customers/${seller_uuid}`),
        getPosCustomerScoreHistoryList: (seller_uuid) =>
            service.get(`/pos/customers?type=score_history&seller_uuid=${seller_uuid}`),
        getPosCustomerTicketList: (seller_uuid) => service.get(`/pos/tickets/${seller_uuid}`),
        getPosCustomerTicketDetail: (seller_uuid, ticket_id) =>
            service.get(`/pos/tickets/${seller_uuid}/${ticket_id}`),
        connectCustomerWebAndPos: (seller_uuid) => service.post('/pos/connects', { seller_uuid }),
        editCustomerPosInfo: (seller_uuid, data) =>
            service.put(`/pos/customers/${seller_uuid}`, { action: 'editInfo', ...data }),
        createScoreTransfer: (seller_uuid, data) =>
            service.put(`/pos/customers/${seller_uuid}`, {
                action: 'createScoreTransfer',
                ...data,
            }),
    };
}
