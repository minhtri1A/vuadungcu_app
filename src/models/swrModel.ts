import {
    ArticleResponseType,
    CartOrderConfigsResponseType,
    CartOrderDetailResponseType,
    CartOrderDetailReturnsResponseType,
    CartOrdersResponseType,
    CartOrderStatusResponseType,
    CategoriesResponseType,
    CheckoutSummaryResponseType,
    CustomerReviewsResponseType,
    CustomerScoreResponseType,
    EventCoinLogResponseType,
    EventQrCodeConfigResponseType,
    EventQrCodeInfoResponseType,
    EventQrCodeLogResponseType,
    GiftCustomerResponseType,
    LoyalPointHistoryResponseType,
    LoyalPointTransferResponseType,
    NewsCategoryItemsType,
    NewsDetailResponseType,
    NewsItemType,
    NewsPaginationType,
    OrderDetailPosResponseType,
    OrderReturnsType,
    OrdersPosResponseType,
    OrdersType,
    ProductConfigResponseType,
    ProductDetailResponseType,
    ProductFilterResponseType,
    ProductListItemType,
    ProductReviewResponseType,
    ProductReviewSummaryResponseType,
    ProductShippingResponseType,
    ReferrarInfoResponseType,
    SellerInfoResponseType,
    SellerProductCompareResponseType,
    SliderItemsResponseType,
    SpinAttendanceResponseType,
    WarrantiesResponseType,
    WarrantyDetailResponseType,
} from './resModel';
/* eslint-disable no-unused-vars */
import { CartItemResponseType } from 'models';
import { Dispatch, SetStateAction } from 'react';
import { KeyedMutator } from 'swr';
import {
    ActionGetCustomerInfoType,
    DataCreateOrderCustomerType,
    DataPutCartAddressType,
    DataPutCustomerInfoType,
    DataUpdateCartType,
} from './apiModel';
import {
    BrandsResponseType,
    CartAddressResponseType,
    CartSummaryResponseType,
    CustomerInfoResponseType,
} from './resModel';

/* ------ category ------ */
export interface CategorySwrType {
    categories: CategoriesResponseType;
    error: any;
    isValidating: boolean;
    mutate: KeyedMutator<any>;
    loadingInit: string;
    isLoading: boolean;
}
/* ------ product ------ */
export interface ProductSwrInfinityType {
    data: any;
    products: Array<ProductListItemType>;
    pagination: {
        page: number;
        page_count: number;
        page_size: number;
        total_items: number;
    };
    size: number;
    setSize: (size: number | ((_size: number) => number)) => Promise<any[] | undefined>;
    mutate: KeyedMutator<any>;
    loadingInit: string;
    isValidating: boolean;
    message: string;
    setMessage: Dispatch<SetStateAction<string>>;
}

export interface ProductSwrType {
    products: Array<ProductListItemType>;
    pagination: {
        page: number;
        page_count: number;
        page_size: number;
        total_items: number;
    };
    error: any;
    mutate: KeyedMutator<any>;
    isValidating: boolean;
    status: any;
    isLoading: boolean;
}

export interface ProductConfigSwrType {
    productConfig: ProductConfigResponseType;
    error: any;
    mutate: KeyedMutator<any>;
    isValidating: boolean;
}

export interface ProductDetailSwrType {
    productDetail: ProductDetailResponseType;
    loadingInit: string;
    isValidating: boolean;
    mutate: KeyedMutator<any>;
}

export interface ProductShippingSwrType {
    shipping: ProductShippingResponseType;
    loadingInit: string;
    isValidating: boolean;
    mutate: KeyedMutator<any>;
}
export interface ProductFilterSwrType {
    filters: ProductFilterResponseType['filters'];
    error: any;
    mutate: KeyedMutator<any>;
    isValidating: boolean;
    status: string;
}
/* ------ customer ------ */
export interface CustomerSwrType {
    customers: CustomerInfoResponseType;
    error: any;
    isValidating: boolean;
    initFetch: boolean;
    status: string;
    message: string;
    mutate: KeyedMutator<any>;
    setStatus: Dispatch<SetStateAction<string>>;
    setMessage: Dispatch<SetStateAction<string>>;
    updateOrAddCustomerInfo(
        action: ActionGetCustomerInfoType,
        data: DataPutCustomerInfoType,
        isGoBack?: boolean
    ): any;
    deleteCustomer(reason: string): any;
    resetState(): void;
}

export interface EventLoyalPointSwrType {
    data: CustomerScoreResponseType;
    initLoading: string;
    mutate: KeyedMutator<any>;
}

/* ------ LoyalPoint ------ */

export interface AccumulateSwrType {
    accumulate: {
        coin: string;
        score: string;
        loyal_name: string;
    };
    mutate: KeyedMutator<any>;
    error: any;
}

export interface EventLoyalPointTransferSwrType {
    data: LoyalPointTransferResponseType;
    status: string;
    initLoading: string;
    mutate: KeyedMutator<any>;
    setStatus: React.Dispatch<React.SetStateAction<string>>;
    putLoyalPointTransfer(score: string): Promise<LoyalPointTransferResponseType | null>;
}

export interface EventLoyalPointLogSwrType {
    logs: Array<LoyalPointHistoryResponseType>;
    pagination: {
        page: number;
        page_count: number;
        page_size: number;
        total_items: number;
    };
    size: number;
    setSize: (size: number | ((_size: number) => number)) => Promise<any[] | undefined>;
    mutate: KeyedMutator<any>;
    loadingInit: string;
    isValidating: boolean;
    // message: string;
    // setStatus: Dispatch<SetStateAction<string>>;
    // setMessage: Dispatch<SetStateAction<string>>;
}

/* ------ brands ------ */

export interface BrandSwrType {
    brands: BrandsResponseType[];
    error: any;
    isValidating: any;
    mutateBrands: KeyedMutator<any>;
    loadingInit: string;
    isLoading: boolean;
}
export interface BrandDetailSwrType {
    brand: BrandsResponseType;
    error: any;
    isValidating: any;
    mutateBrand: KeyedMutator<any>;
    loadingInit: string;
}

/* ------ address ------ */

export interface CartAddressSwrType {
    cartAddress: CartAddressResponseType;
    error: any;
    mutate: KeyedMutator<any>;
    putCartAddress(
        user_address: DataPutCartAddressType,
        type: 'shipping' | 'billing'
    ): Promise<boolean>;
    initFetch: boolean;
    isValidating: boolean;
}

/* ------ cart ------ */
export interface CartSummarySwrType {
    cartSummary: CartSummaryResponseType;
    error: any;
    mutate: KeyedMutator<any>;
    isValidating: boolean;
    isLoading: boolean;
}

export interface CheckoutSummarySwrType {
    checkoutSummary: CheckoutSummaryResponseType;
    messageInit: string;
    error: any;
    mutate: KeyedMutator<any>;
    isValidating: boolean;
}

export interface CartSwrType {
    //common
    key: string;
    data: any;
    listCartItems: CartItemResponseType[];
    totalItems: string;
    pageSize: string;
    mutate: KeyedMutator<any>;
    error: any;
    statusCart: {
        status: string;
        message: string;
    };
    setStatusCart(status?: string, message?: string): any;
    isValidating: boolean;
    //cartItem update
    cartItemUpdate?: {
        type: 'update' | 'update_checkall' | 'remove';
        item?: CartItemResponseType;
        is_checked_all?: 'Y' | 'N';
    };
    //mini cart
    addProductToCart(product_seller_uuid: string): Promise<any>;
    //remove
    removeItemFromCart(product_seller_uuid?: string): Promise<any>;
    //update
    updateCartItemQuantity(cartData: DataUpdateCartType): any;
    updateCheckedCartItem(cartData: DataUpdateCartType): any;
    //checkout
    checkoutCartItems(): any;
}
//--cart delivery
export interface CartDeliverySwrType<T> {
    // cartDelivery?: CartDeliveryResponseType | CartDeliveryFeeResponseType;
    data: T;
    error: any;
    mutate: KeyedMutator<any>;
    isValidating: boolean;
    loadingInit: string;
    messageInit: string;
    //
    status: string;
    message: string;
    setStatus: Dispatch<SetStateAction<string>>;
    setMessage: Dispatch<SetStateAction<string>>;
    //
    updateCartDelivery(delivery_uuid: string): any;
}
//--cart orders
export interface CartOrdersSwrType {
    data: Array<CartOrdersResponseType>;
    orders: Array<OrdersType>;
    orderReturns: Array<OrderReturnsType>;
    pagination: {
        page: string;
        page_count: string;
        page_size: string;
        total_items: string;
    };
    size: number;
    setSize(size: number | ((_size: number) => number)): Promise<any[] | undefined>;
    mutate: KeyedMutator<any[]>;
    loadingInit: string;
    isValidating: boolean;
    createOrderCustomer(
        data: DataCreateOrderCustomerType,
        listCartItems: CartItemResponseType[],
        cartSummary: CartSummaryResponseType
    ): Promise<boolean>;
    cancelOrderCustomer(order_uuid: string): any;
    repurchaseOrderCustomer(order_uuid: string): any;
    status: string;
    message: string;
    setStatus: Dispatch<SetStateAction<string>>;
    setMessage: Dispatch<SetStateAction<string>>;
}
//--cart order detail
export interface CartOrderDetailSwrType {
    data: CartOrderDetailResponseType;
    mutate: KeyedMutator<any>;
    loadingInit: string;
    isValidating: boolean;
}
//--cart order returns detail
export interface CartOrderDetailReturnsSwrType {
    data: CartOrderDetailReturnsResponseType;
    mutate: KeyedMutator<any>;
    loadingInit: string;
    isValidating: boolean;
}
//--cart order status
export interface CartOrderStatusSwrType {
    data: CartOrderStatusResponseType;
    mutate: KeyedMutator<any>;
    loadingInit: string;
    isValidating: boolean;
}
//--cart order config
export interface CartOrderConfigSwrType {
    data: CartOrderConfigsResponseType;
    mutate: KeyedMutator<any>;
    loadingInit: string;
    isValidating: boolean;
}
/* ------ news ------ */
export interface NewsSwrType {
    news: Array<NewsItemType>;
    pagination: NewsPaginationType;
    mutate: KeyedMutator<any>;
    isValidating: boolean;
    loadingInit: string;
}

export interface NewsDetailSwrType {
    newsDetail: NewsDetailResponseType;
    mutate: KeyedMutator<any>;
    isValidating: boolean;
    loadingInit: string;
}

export interface NewsSwrInfinityType {
    news: Array<NewsItemType>;
    pagination: NewsPaginationType;
    size: number;
    setSize: (size: number | ((_size: number) => number)) => Promise<any[] | undefined>;
    mutate: KeyedMutator<any>;
    loadingInit: string;
    isValidating: boolean;
    message: string;
    setStatus: Dispatch<SetStateAction<string>>;
    setMessage: Dispatch<SetStateAction<string>>;
}

export interface NewsCategoriesSwrType {
    categories: Array<NewsCategoryItemsType>;
    error: any;
    mutate: KeyedMutator<any>;
    loadingInit: string;
    isValidating: boolean;
}

/* ------ slide ------ */
export interface SlideSwrType {
    slides: Array<SliderItemsResponseType>;
    error: any;
    loadingInit: string;
    isValidating: boolean;
    isLoading: boolean;
    mutate: KeyedMutator<any>;
}

/* ------ Event Qr code ------ */
export type EventQrCodeRes = EventQrCodeConfigResponseType | EventQrCodeInfoResponseType;
export interface EventQrCodeSwrType<T extends EventQrCodeRes> {
    data: T;
    qrScanScore: string;
    loadingInit: string;
    isValidating: boolean;
    mutate: KeyedMutator<any>;
    checkQrCodeAndUpdateQrScore(qr_code: string): Promise<void>;
    status: string;
    message: string;
    setStatus: Dispatch<SetStateAction<string>>;
    setMessage: Dispatch<SetStateAction<string>>;
    resetState(): void;
}
export interface EventQrCodeLogSwrInfinityType {
    logs: Array<EventQrCodeLogResponseType>;
    pagination: {
        page: number;
        page_count: number;
        page_size: number;
        total_items: number;
    };
    size: number;
    setSize: (size: number | ((_size: number) => number)) => Promise<any[] | undefined>;
    mutate: KeyedMutator<any>;
    loadingInit: string;
    isValidating: boolean;
    // message: string;
    // setStatus: Dispatch<SetStateAction<string>>;
    // setMessage: Dispatch<SetStateAction<string>>;
}
/* ------ Event coin ------ */
export interface EventCoinSwrType<T> {
    data: T;
    loadingInit: string;
    isValidating: boolean;
    mutate: KeyedMutator<any>;
}
export interface EventCoinLogSwrInfinityType {
    logs: Array<EventCoinLogResponseType>;
    pagination: {
        page: number;
        page_count: number;
        page_size: number;
        total_items: number;
    };
    size: number;
    setSize: (size: number | ((_size: number) => number)) => Promise<any[] | undefined>;
    mutate: KeyedMutator<any>;
    loadingInit: string;
    isValidating: boolean;
    // message: string;
    // setStatus: Dispatch<SetStateAction<string>>;
    // setMessage: Dispatch<SetStateAction<string>>;
}
/* ------ warranty ------ */
export interface WarrantySwrInfinityType {
    data: any;
    warranties: Array<WarrantiesResponseType>;
    pagination: {
        page: number;
        page_count: number;
        page_size: number;
        total_items: number;
    };
    size: number;
    setSize: (size: number | ((_size: number) => number)) => Promise<any[] | undefined>;
    mutate: KeyedMutator<any>;
    loadingInit: string;
    isValidating: boolean;
}
export interface WarrantyDetailSwrType {
    warranty: WarrantyDetailResponseType;
    error: any;
    loadingInit: string;
    isValidating: boolean;
    mutate: KeyedMutator<any>;
}

/* ------ seller ------ */
export interface SellerInfoSwrType {
    seller: SellerInfoResponseType;
    loadingInit: string;
    isValidating: boolean;
    mutate: KeyedMutator<any>;
}

export interface SellerProductCompareSwrType {
    sellerCompare: SellerProductCompareResponseType;
    loadingInit: string;
    isValidating: boolean;
    mutate: KeyedMutator<any>;
}

/* ------ pos ------ */
export interface OrderPosSwrInfinityType {
    orders: Array<OrdersPosResponseType>;
    pagination: {
        page: number;
        page_count: number;
        page_size: number;
        total_items: number;
    };
    size: number;
    setSize: (size: number | ((_size: number) => number)) => Promise<any[] | undefined>;
    mutate: KeyedMutator<any>;
    loadingInit: string;
    isValidating: boolean;
}

export interface OrderDetailPosSwrType {
    order: OrderDetailPosResponseType;
    loadingInit: string;
    isValidating: boolean;
    mutate: KeyedMutator<any>;
}

/* ------ Gift ------ */

export interface GiftSwrInfinityType {
    data: any;
    gift: Array<GiftCustomerResponseType>;
    pagination: {
        page: number;
        page_count: number;
        page_size: number;
        total_items: number;
    };
    size: number;
    setSize: (size: number | ((_size: number) => number)) => Promise<any[] | undefined>;
    mutate: KeyedMutator<any>;
    loadingInit: string;
    isValidating: boolean;
}

export interface GiftSwrType {
    gift: Array<GiftCustomerResponseType>;
    error: any;
    mutate: KeyedMutator<any>;
    loadingInit: string;
    isValidating: boolean;
    pagination: {
        page: number;
        page_count: number;
        page_size: number;
        total_items: number;
    };
}

/* ------ Gift ------ */

export interface SpinAttendanceSwrType {
    data: SpinAttendanceResponseType;
    error: any;
    mutate: KeyedMutator<any>;
    loadingInit: string;
    isValidating: boolean;
}

/* ------ Referral ------ */
export interface ReferralInfoSwrType {
    referral: ReferrarInfoResponseType;
    error: any;
    mutate: KeyedMutator<any>;
    loadingInit: string;
    isValidating: boolean;
}

/* ------ Article ------ */
export interface ArticleSwrType {
    data: ArticleResponseType;
    error: any;
    loadingInit: string;
    isValidating: boolean;
    mutate: KeyedMutator<any>;
}

/* ------ Reviews ------ */
export interface ProductReviewSwrInfinityType {
    data: any;
    reviews: Array<ProductReviewResponseType>;
    pagination: {
        page: number;
        page_count: number;
        page_size: number;
        total_items: number;
    };
    size: number;
    setSize: (size: number | ((_size: number) => number)) => Promise<any[] | undefined>;
    mutate: KeyedMutator<any>;
    loadingInit: string;
    isValidating: boolean;
}

export interface CustomerReviewSwrInfinityType {
    data: any;
    reviews: Array<CustomerReviewsResponseType>;
    pagination: {
        page: number;
        page_count: number;
        page_size: number;
        total_items: number;
    };
    size: number;
    setSize: (size: number | ((_size: number) => number)) => Promise<any[] | undefined>;
    mutate: KeyedMutator<CustomerReviewsResponseType[]>;
    loadingInit: string;
    isValidating: boolean;
}

export interface ProductReviewSwrType {
    reviews: Array<ProductReviewResponseType>;
    pagination: {
        page: number;
        page_count: number;
        page_size: number;
        total_items: number;
    };
    loadingInit: string;
    isValidating: boolean;
    error: any;
    mutate: KeyedMutator<any>;
}

export interface ProductReviewSummarySwrType {
    reviewsSummary: ProductReviewSummaryResponseType['summary'];
    isValidating: boolean;
    error: any;
    mutate: KeyedMutator<any>;
}

/*
0:
orders:(2) [{…}, {…}]
page:"1"
page_count:"1"
page_size:"5"
total_items:"2",
1:...
* Cấu trúc dữ liệu của data:
    - là một mảng với mỗi phần tử là thông tin ds order của một page (phân trang)
    - orders là danh sách đơn hàng của page đó (vd page 1 có 5 đơn hàng) 
 */
