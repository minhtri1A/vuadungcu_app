export interface TokenType {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    token_type: string;
    scope: any;
    timeout?: string;
}

/*--------- Auth --------- */

export interface LoginResponseType extends TokenType {}

/* ------ category ------ */
export interface CategoryType {
    uuid: string;
    name: string;
    image: string;
}
export interface CategoriesResponseType {
    parent: Array<CategoryType>;
    children: Array<CategoryType>;
}

/* ------ product ------ */
export interface ProductListItemType {
    uuid: string;
    seller_uuid: string;
    sku: string;
    type_id: 'configurable' | 'simple';
    product_seller_uuid: string;
    name: string;
    image: string;
    video: null;
    qty: number;

    // simple
    price?: number;
    special_price?: number;
    special_from_date?: string;
    special_to_date?: string;

    in_stock?: 'Y' | 'N';

    //config
    min_price?: number;
    max_price?: number;
    max_special_price?: number;
    min_special_price?: number;
    max_discount_percent?: number;

    // price all
    discount_percent: number | null;
}

export interface ProductListResponseType {
    page: number;
    page_count: number;
    page_size: number;
    total_items: number;
    _embedded: {
        products: Array<ProductListItemType>;
    };
}

export interface ProductDetailResponseType____ {
    uuid: string;
    product_seller_uuid: string;
    type_id: 'configurable' | 'simple';
    sku: string;
    name: string;
    brand: string;
    brand_uuid: string;
    description: string;
    category_uuid: string;
    category_name: string;
    country_of_manufacture: string;
    warranty_period: string;
    video: string;
    image: string;
    //cac gia trị chi xuat hien o san pham don
    qty?: string;
    price?: string;
    special_price: string;
    special_from_date?: any;
    special_to_date?: any;
    other_seller?: {
        count: string;
        min_price: string;
    };
    //id cua san pham cau hinh con - chi xuat hien khi truy cap vao san pham cau hinh con
    product_select?: string;
    //
    images: any[];
    attributes: any[];
    seller: {
        seller_uuid: string;
        seller_code: string;
        seller_name: string;
        image: string;
    };
}

export interface ProductDetailResponseType {
    'detail-static': {
        uuid: string;
        type_id: 'simple' | 'configurable';
        sku: string;
        product_seller_uuid: string;
        name: string;
        brand_uuid: string;
        brand: string;
        description: string;
        category_uuid: string;
        category_name: string;
        country_of_manufacture: string;
        warranty_period: string | null;
        video: string;
        images: Array<{
            url: string;
            label: string;
            position: number;
            is_default: 'Y' | 'N';
        }>;
        attributes: Array<{
            attribute_code: string;
            frontend_label: string;
            value: string;
        }>;
        seller: {
            seller_uuid: string;
            seller_code: string;
            seller_name: string;
            image: string;
        };
    };
    'detail-dynamic': {
        // config
        attribute_config?: Array<{
            attribute_code: string;
            label: string;
            is_color: 'Y' | 'N';
            option: Array<{
                option_uuid: 'b9dac0c6380c4740af71a6cd4c14176a';
                option_label: '6"';
            }>;
        }>;

        min_price?: number;
        max_price?: number;
        min_special_price?: number;
        max_special_price?: number;
        children?: Array<{
            product_uuid: string;
            product_seller_uuid: string;
            sku: string;
            name: string;
            price: number;
            special_price: number;
            special_from_date: string | null;
            special_to_date: string | null;
            qty: number;
            video: string | null;
            images: Array<{
                url: string;
                label: string;
                position: number;
                is_default: 'Y' | 'N';
            }>;
            option: Array<{
                attribute_code: string;
                option_uuid: string;
            }>;
            other_seller: { count: number; min_price: string };
        }>;

        // simple
        price?: number;
        special_price?: number;
        special_from_date?: string;
        special_to_date?: string;
        qty?: number;

        // common
        sellers: Array<{
            product_seller_uuid: string;
            seller_code: string;
            seller_name: string;
            image: string;

            // config
            min_price: number;
            max_price: number;
            min_special_price: number;
            max_special_price: number;

            // simple
            price?: number;
            special_price?: number;
            qty?: number;
            special_from_date?: string;
            special_to_date?: string;
        }>;

        other_seller: { count: number; min_price: string };
    };
}

export interface ProductDiscountResponseType {
    uuid: string;
    name: string;
    special_price: string;
    image: string;
    discount_percent: string;
}

export interface ProductDetailPosResponseType {
    pos_product_id: string;
    product_uuid: string | null;
    name: string;
    pricesell: string;
    image: string | null;
}

export interface ProductShippingResponseType {
    shipping_fee: Array<number>;
    shipping_fee_support_info?: {
        max: string;
        order_min: string;
        percent: string;
    };
    shipping_fee_supported?: Array<number>;
}

export interface ProductConfigAttributeType {
    attribute_uuid: string;
    label: string;
    is_color: 'Y';
    option: Array<{
        option_uuid: string;
        option_label: string;
    }>;
}

export interface ProductConfigChildrenType {
    product_uuid: string;
    product_seller_uuid: string;
    sku: string;
    name: string;
    price: string;
    special_price: string;
    special_from_date: string | null;
    special_to_date: string | null;
    qty: string;
    video: string;
    option: Array<{
        attribute_uuid: string;
        option_uuid: string;
    }>;
    images: Array<{
        url: string;
        label: string;
        position: string;
        is_default: string;
    }>;
    other_seller: {
        count: number;
        min_price: string;
    };
}

export interface ProductConfigResponseType {
    attribute: Array<ProductConfigAttributeType>;
    children: Array<ProductConfigChildrenType>;
    price: {
        min: string;
        max: string;
    };
    other_seller: {
        count: number;
        min_price: string;
    };
}

export interface FilterItemType {
    attribute_code: string;
    attribute_label: string;
    type: 'select' | 'number';
    min_value?: string;
    max_value?: string;
    option?: Array<{
        option_key: string;
        option_label: string;
    }>;
}

export interface ProductFilterResponseType {
    filters: Array<FilterItemType>;
    _links: any;
}

/* ------ customer ------ */
export interface CustomerInfoResponseType {
    //personal info
    lastname?: string;
    firstname?: string;
    fullname?: string;
    image?: string;
    gender?: string;
    dob?: Date | null;
    coin: string;
    //verify info
    username?: string;
    not_edit_username?: string;
    email?: string;
    telephone?: string;
    email_confirm?: string;
    telephone_confirm?: string;
    is_admin: 'Y' | 'N';
    //link social
    id_google?: string;
    id_facebook?: string;
    id_apple?: string;
    id_zalo?: string;
    //error
    code?: string;
    //referral
    referral_code?: string;
    referred_code?: string;
    referred_name?: string;
    referred_status?: 'success' | 'pending';
}
//customer score
export interface CustomerScoreResponseType {
    score?: string;
    loyal_name?: string;
    coin?: string;
    discount?: string;
    code?: string;
}
//loyal point transfer
export interface LoyalPointTransferResponseType {
    expired?: 'Y' | 'N';
    code: string;
    score_trans: string;
    expires: string;
}

export interface LoyalPointHistoryResponseType {
    object: string;
    score: string;
    content: string;
    date: string;
    ticket: string;
    ticketid: string;
}

// customer address
export interface CustomerAddressType {
    address_uuid: string;
    is_default_billing: 'Y' | 'N';
    is_default_shipping: 'Y' | 'N';
    firstname: string;
    lastname: string;
    telephone: string;
    street: string;
    province_id: string;
    district_id: string;
    ward_id: string;
    province: string;
    district: string;
    ward: string;
    vat_id?: string;
    code?: 'ADDRESS_NOT_SET';
}

export interface CartAddressResponseType extends CustomerAddressType {}

export interface CustomerAddressListResponseType {
    page: number;
    page_count: number;
    page_size: number;
    total_items: number;
    _embedded: {
        address: Array<CustomerAddressType>;
    };
}

/* ------ brand ------ */

export interface BrandsResponseType {
    brand_uuid: string;
    is_active: string;
    brand_name: string;
    logo: string;
    is_featured: string;
    count_product_brands?: string;
    image: string;
    description: string;
    _links: any;
}

export interface PageConfigResponseType {
    page_code: string;
    meta: {
        title: string;
        meta_description: string;
        meta_image: string;
        meta_type: string;
        meta_sitename: string;
        meta_url: string;
    };
    is_active: string;
}
/* --------- cart --------- */

export interface CartItemResponseType {
    product_uuid: string;
    product_seller_uuid: string;
    seller_uuid: string;
    sku: string;
    name: string;
    image: string;
    product_type: string;
    qty: string;
    weight: string;
    price: string;
    row_total: string;
    is_checked: 'Y' | 'N';
    allow_update: 'Y' | 'N';
    created_at: string;
}
export interface CartItemsSellerResponseType {
    seller: SellerInfoResponseType;
    total_items_price: number;
    items: Array<CartItemResponseType>;
}
/* mine */
export interface CartSummaryResponseType {
    seller: Array<{
        seller_uuid: string;
        qty_total: string;
        price_total: string;
        item_count: string;
        shipping_fee: Array<number>;
        shipping_fee_support_info?: {
            max: string;
            order_min: string;
            percent: string;
        };
        shipping_fee_supported?: Array<number>;
    }>;
    total: {
        qty_total: number;
        price_total: number;
        item_count: number;
        shipping_fee: Array<number>;
        total_apply_score: number;
        shipping_is_temp?: boolean;
        total?: string;
    };
    max_score_use: number;
}

export interface CheckoutSummaryResponseType {
    code?: string;
    total_items_price: string;
    shipping_fee: string;
    shipping_fee_discount_percent: string;
    shipping_fee_discount: string;
    total_order_price: string;
    count_items: string;
}
export interface OrderReturnSummaryResponseType {
    code?: string;
    shipping_fee: string;
    shipping_fee_percent: string;
    shipping_fee_paid: string;
    total_items_price: string;
    total_refund_price: string;
    count_items: string;
}

/*--------- delivery --------- */
type deliveryType = {
    delivery_uuid: string;
    delivery_code: string;
    name: string;
    fee: {
        service_fee: number;
        total: number;
        order_min_discount: number;
        order_percent_discount: number;
        fee_message: string;
        is_show_fee: 'Y' | 'N';
        is_show_fee_message: 'Y' | 'N';
    };
    expected_time: {
        leadtime: number;
        order_date: number;
        leadtime_message: string;
        is_show_leadtime: 'Y' | 'N';
        is_show_leadtime_message: 'Y' | 'N';
    };
};

export interface CartDeliveryResponseType extends deliveryType {
    code: string;
}

export interface CartDeliveryFeeResponseType {
    code: 'SUCCESS';
    name: string;
    fee: {
        service_fee: number;
        total: number;
    };
}

export interface CartDeliveriesResponseType {
    code: string;
    deliveries: deliveryType[];
}

/*--------- order --------- */
export interface OrderItemsType {
    item_uuid: string;
    order_uuid: string;
    product_uuid: string;
    product_seller_uuid: string;
    name: string;
    image: string;
    price: string;
    qty: string;
    row_total: string;
    is_checked_returns: 'Y' | 'N';
    is_returns: 'Y' | 'N';
    allow_review: 'Y' | 'N';
}

export interface OrdersType {
    seller_name: string;
    seller_uuid: string;
    order_uuid: string;
    items: Array<OrderItemsType>;
    status: 'pending' | 'processing' | 'shipping' | 'complete' | 'cancel' | 'faulted' | 'returns';
    status_label: string;
    status_description: string;
    shipment_status: string;
    invoice_status: string;
    shipping_fee: string;
    total_items_price: string;
    total_order_price: string;
    memo_uuid: string | null;
    is_allow_returns: 'Y' | 'N';
    is_cancel: 'Y' | 'N';
    is_repurchase: 'Y' | 'N';
    updated_at: string;
    use_score: string | null;
    gift: string | null;
}
export interface OrderReturnsType {
    memo_uuid: string;
    order_uuid: string;
    items: Array<OrderItemsType>;
    status: 'pending' | 'processing' | 'returning' | 'refunding' | 'returned' | 'failed';
    status_description: string;
    total_items_price: string;
    total_refund_price: string;
}
export interface CartOrdersResponseType {
    data: {
        orders: Array<OrdersType>;
        order_returns: Array<OrderReturnsType>;
    };
    page: string;
    page_count: string;
    page_size: string;
    total_items: string;
}
/*--------- order detail --------- */
export interface CartOrderDetailResponseType {
    order_id: string;
    status: 'pending' | 'processing' | 'shipping' | 'complete' | 'cancel' | 'faulted' | 'returns';
    shipment_status: string;
    invoice_status: string;
    status_label: string;
    status_description: string;
    memo_uuid: string | null;
    is_allow_returns: 'Y' | 'N';
    is_cancel: 'Y' | 'N';
    is_repurchase: 'Y' | 'N';
    created_at: string;
    order_address: {
        address_uuid: string;
        firstname: string;
        lastname: string;
        telephone: string;
        province: string;
        district: string;
        ward: string;
        street: string;
    };
    order_items: Array<OrderItemsType>;
    order_summary: {
        total_items_price: string;
        shipping_fee: number;
        shipping_fee_discount: string;
        total_order_price: string;
        delivery: string;
        expected_time: string;
    };
}
/*--------- order detail returns --------- */
export interface OrderReturnsItemsType {
    item_uuid: string;
    product_uuid: string;
    name: string;
    qty: string;
    price: string;
    row_total: string;
    image: string;
}
export interface CartOrderDetailReturnsResponseType {
    memo_items: Array<OrderReturnsItemsType>;
    memo_summary: {
        shipping_fee: string;
        shipping_fee_paid: string;
        total_items_price: string;
        total_refund_price: string;
    };
    memo_id: string;
    reason: string;
    refund_method: string;
    status: 'pending' | 'processing' | 'returning' | 'refunding' | 'returned' | 'failed';
    created_at: string;
}
/*--------- order status --------- */
export interface CartOrderStatusResponseType {
    cancel: number;
    complete: number;
    pending: number;
    processing: number;
    returns: number;
    shipping: number;
}
/*--------- order config --------- */
export interface CartOrderConfigsResponseType {
    order_returns_time: string;
    order_returns_fee_percent: string;
    order_returns_reason: string;
    order_returns_delivery: string;
}
/*--------- news --------- */
//--news data
export interface NewsItemType {
    news_uuid: string;
    category_uuid: string;
    title: string;
    description: string;
    content: string;
    image: string;
    author: string;
    author_uuid: string;
    viewed: string;
    is_featured: string;
    updated_at: string;
}
export interface NewsPaginationType {
    page: number;
    page_count: number;
    page_size: number;
    total_items: number;
}
export interface NewsDetailResponseType {
    news_uuid: string;
    category_uuid: string;
    category_name: string;
    content_heading: string;
    content: string;
    title: string;
    author: string;
    meta_description: string;
    meta_image: string;
    updated_at: string;
    meta_type: string;
    meta_sitename: string;
    meta_url: string;
    viewed: number;
}
export interface NewsCategoryItemsType {
    category_uuid: string;
    category_name: string;
}
export interface NewsCategoriesResponseType {
    categories: Array<NewsCategoryItemsType>;
}
/*--------- slide --------- */
export interface SliderItemsResponseType {
    id: string;
    group_code: string;
    image: string;
    small_image: string;
    label: string;
    web_link: string;
    app_link: string;
    min_width: string;
    position_min: string;
    small_slide: 'Y' | 'N';
    width_small_slide?: string;
}

/*--------- brand --------- */
export interface BrandsResponseType {
    brand_uuid: string;
    is_active: string;
    brand_name: string;
    logo: string;
    is_featured: string;
    count_product_brands?: string;
    image: string;
    _links: any;
}
/*--------- Event qr code --------- */
export interface EventQrCodeConfigResponseType {
    qr_scan_score: string;
    qr_scan_time: string;
    qr_description: string;
    qr_auth_string: string;
    qr_active: 'Y' | 'N';
    code?: string;
}
export interface EventQrCodeInfoResponseType {
    event_uuid: string;
    available_score: string;
    updated_at: string;
    code?: string;
}
export interface EventQrCodeLogResponseType {
    event_uuid: string;
    score_amount: string;
    name: string;
    type: 'in' | 'out';
    image: string | null;
    content: string | null;
    created_at: string;
}
/*--------- Event coin --------- */
export interface EventCoinInfoResponseType {
    event_uuid: string;
    available_coin: string;
    updated_at: string;
}
export interface EventCoinConfigResponseType {
    coin_active: 'Y' | 'N';
    coin_description: string;
}
export interface EventCoinLogResponseType {
    log_uuid: string;
    name: string;
    coin_amount: string;
    type: 'in' | 'out';
    image: string | null;
    content: string | null;
    item_count: string | null;
    created_at: string;
}
/* ------ warranty ------ */
export interface WarrantiesResponseType {
    warranty_uuid: string;
    product_name: string;
    product_status: string | null;
    product_qty: string;
    status: 'pending' | 'processing' | 'success';
    product_image: string;
}

export interface WarrantyDetailResponseType {
    warranty_uuid: string;
    product_name: string;
    product_status: string;
    product_images: string | null;
    customer_name: string;
    receiver: string;
    product_qty: string;
    cust_received_date: string;
    cust_return_date: string;
    repair_cost: string;
    status: 'pending' | 'processing' | 'success';
    product_image: string;
}

/*--------- seller --------- */
export interface SellerInfoResponseType {
    seller_uuid: string;
    seller_code: string;
    created_at: string;
    seller_name: string;
    stock_name: string;
    image: string;
    stock_province: string;
    stock_district: string;
    stock_ward: string;
    stock_street: string;
    product_count: string;
    business_info: {
        address: { label: string; value: string };
        business: { label: string; value: string };
        lience: { label: string; value: string };
        owner: { label: string; value: string };
    };
}

export interface SellerComparisonType {
    product_seller_uuid: string;
    seller_code: string;
    seller_name: string;
    image: string;
    price: string;
}

export interface SellerProductCompareResponseType {
    seller: Array<SellerComparisonType>;
}

/*--------- Gift --------- */

export interface GiftCustomerResponseType {
    uuid: string;
    gift_name: string;
    seller_uuid: string;
    min_order_apply: string;
    expires: string;
    status: string;
    image: string;
    seller_name: string;
}

/*--------- Spin --------- */
export interface SpinItemsType {
    item_uuid: string;
    label: string;
    image: string;
    type: 'score' | 'gift';
}

export interface SpinAttendanceResponseType {
    spin: {
        spin_name: string;
        time_start: string;
        time_end: string;
        date_start: string;
        date_end: string;
        active: 'Y' | 'N';
    };
    spin_item: Array<SpinItemsType>;
    customer: {
        status: string;
        code: string;
    };
}

export interface StartSpinResponseType {
    result: string;
    win: string;
}

/*--------- Referrar --------- */
export interface ReferrarInfoResponseType {
    referral_code: string;
    name: string;
}
/*--------- Referrar --------- */
export interface ArticleResponseType {
    article_uuid: string;
    category_uuid: string;
    article_code: string;
    title: string;
    content: string;
    updated_at: string;
}
/*--------- Soccket --------- */
//--data response chat
export interface ChatDataSocketResponseType {
    action: 'send_message' | 'receive_message';
    message: any;
    message_uuid: string;
    result: 'success' | 'error';
    result_code: 'RECEIVE_MESSAGE_SUCCESS' | 'SEND_MESSAGE_SUCCESS';
    send_at: string;
    user_uuid: string;
    message_client_id: string;
    reply_from?: {
        uuid: string;
        user_type_send: 'C' | 'S';
        message_shortcut: {
            text?: string;
            media?: {
                type: 'image' | 'video';
                url: string;
            };
        };
    };
}

//--list message
export interface MessageChatBargainType {
    price: number;
    status: '' | 'cancel' | 'yes' | 'no';
    qty_bargain: number;
    product_uuid: string;
    product_name: string;
    price_bargain: number;
    product_seller_uuid: string;
    product_image: string;
}
export interface MessageChatReplyType {
    uuid: string;
    user_type_send: 'C' | 'S';
    message_shortcut: {
        title?: string;
        text?: string;
        media?: {
            type: 'image' | 'video';
            url: string;
        };
    };
}
export interface MessageChatType {
    action: 'send_message' | 'receive_message';
    message: Array<{
        type: 'text' | 'image' | 'video' | 'bargain' | 'confirm_bargain';
        message:
            | string
            | MessageChatBargainType
            | {
                  status: 'yes' | 'no';
              };
    }>;
    message_uuid: string;
    send_at: string;
    user_uuid: string;
    message_client_id: string;
    reply_from?: MessageChatReplyType;
}

export interface MessageDataSocketResponseType {
    action: 'get_list_message';
    list: Array<MessageChatType>;
    result: 'success' | 'error';
    result_code: string;
}
//--user
export interface UserChatType {
    allow_chat: 'Y' | 'N';
    last_is_view: 'Y' | 'N';
    last_message: Array<{
        type: 'text' | 'image' | 'video';
        message: string;
    }>;
    last_send_at: string;
    num_not_view: string;
    user_image: string;
    user_name: string;
    user_uuid: string;
}

export interface ListUserDataSocketResponseType {
    action: 'get_list_user';
    list: Array<UserChatType>;
    result: 'success' | 'error';
    result_code: string;
}

export interface UserDataSocketResponseType {
    action: 'get_user';
    result: 'success' | 'error';
    result_code: string;
    user: {
        allow_chat: 'Y' | 'N';
        user_image: string;
        user_name: string;
        user_uuid: string;
    };
}
//--view all
export interface ViewAllMessageResponseType {
    action: 'view_all_message';
    result: 'success' | 'error';
    result_code: string;
    user_uuid: string;
}

//--bargain
export interface BargainChatType {
    action: 'bargain';
    result: 'success' | 'error';
    result_code: string;
    user_uuid: string; //gh
    message_uuid: string;
    reply_from: any;
    message: {
        type: 'bargain';
        message: {
            product_uuid: string;
            product_seller_uuid: string;
            product_name: string;
            price: number;
            product_image: string;
            price_bargain: number;
            qty_bargain: number;
            status: '' | 'cancel' | 'yes' | 'no';
            qty: number;
        };
    };
    send_at: string;
}
export interface BargainDataSocketResponseType {}

/*--------- device --------- */
export interface RegisterDeviceResponseType {
    code: 'ERROR' | 'SUCCESS';
    fcm_token_expired: number;
}

/*--------- reviews --------- */
export interface ProductReviewResponseType {
    review_uuid: string;
    product_seller_uuid: string;
    customer_name: string;
    review_score: string;
    review_content: string;
    review_date: string;
    feedback_content: string;
    feedback_date: string;
    images: string;
}
export interface CustomerReviewsResponseType {
    review_uuid: string;
    review_score: string;
    review_content: string;
    review_images: string;
    review_date: string;
    is_active: 'Y' | 'N';
    allow_edit: 'Y' | 'N';
    feedback_content: string | null;
    feedback_date: string | null;
    customer_anonymous: 'Y' | 'N';
    product_name: string;
    product_seller_uuid: string;
    product_image: string;
    order_uuid: string;
}
export interface ProductReviewSummaryResponseType {
    summary: Array<{
        review_score: string;
        num_review: string;
    }>;
}

/*--------- location --------- */
export interface ProvinceResponseType {
    page: number;
    page_count: number;
    page_size: number;
    total_items: number;
    _embedded: {
        provinces: Array<{
            id: string;
            name: string;
        }>;
    };
}

export interface DistrictResponseType {
    page: number;
    page_count: number;
    page_size: number;
    total_items: number;
    _embedded: {
        districts: Array<{
            id: string;
            name: string;
        }>;
    };
}

export interface WardResponseType {
    page: number;
    page_count: number;
    page_size: number;
    total_items: number;
    _embedded: {
        wards: Array<{
            id: string;
            name: string;
        }>;
    };
}

/*--------- pos --------- */

export interface OrdersPosResponseType {
    ticketid: string;
    tickettype: string;
    total: string;
    datenew: string;
    id: string;
}

export interface OrderDetailPosResponseType {
    tickettype: string;
    ticketid: string;
    datenew: string;
    total_price: number;
    discount: number;
    total_discount: number;
    total_total: number;
    score_tranfer: string;
    lines: Array<{
        units: string;
        price: number;
        product_name: string;
        product_ref: string;
        discount_rate: number;
        price_discount: string;
    }>;
}

export type PostListType = Array<{
    seller_uuid: string;
    pos_name: string;
    is_connect: 'Y' | 'N';
    is_active: 'Y' | 'N';
}>;

export interface PosListResponseType {
    page: number;
    page_count: number;
    page_size: number;
    total_items: number;
    _embedded: {
        pos_connects: PostListType;
    };
}
export interface PosCustomerInfoResponseType {
    pos_customer: {
        taxid: string; //Mã KH
        name: string; //Tên KH
        card: string; //Mã thẻ KH
        region: string; //Tỉnh | Thành phố thuộc trung ương
        city: string; //Huyện | Quận | Thị xã | Thành phố thuộc tình | Thành phố thuộc thành phố
        address: string; // Địa danh, số nhà, tên đường, ấp (khóm), xã (phường | thị trấn)
        score: string; //Điểm tích lũy
    };
}

export type ScoreHistoryType = {
    score: string;
    content: string;
    date: string;
    ticket: string;
    ticketid: string;
};

export interface PosCustomerScoreHistoryListResponseType {
    page: number;
    page_count: number;
    page_size: number;
    total_items: number;
    _embedded: {
        pos_customers: Array<ScoreHistoryType>;
    };
}

export type PosTicketType = {
    id: string;
    ticketid: string;
    tickettype: 'order' | 'return';
    total: string;
    datenew: string;
};

export interface PosCustomerTicketListResponseType {
    page: number;
    page_count: number;
    page_size: number;
    total_items: number;
    _embedded: {
        pos_tickets: Array<PosTicketType>;
    };
}

export interface PosCustomerTicketDetailResponseType {
    tickettype: 'order' | 'return';
    ticketid: string;
    datenew: string;
    lines: Array<{
        units: string;
        price: string;
        product_ref: string;
        product_name: string;
        discount_rate: string;
        price_discount: string;
    }>;
    total_price: string;
    discount: string;
    total_discount: string;
    total_total: string;
}
