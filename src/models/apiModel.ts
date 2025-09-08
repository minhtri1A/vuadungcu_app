import { Slide } from 'const/index';

/*---admin---*/
export type ParamsGetPoliciesType = 'privacy' | 'receive' | 'warranty-return' | 'payment';
//product
export interface ParamsGetProductType {
    page?: any;
    category_uuid?: any;
    keyword?: any;
    sort?: 'price-asc' | 'price-desc' | 'created-desc';
    page_size?: any;
    discount?: 'Y' | 'N';
    brand?: any;
    //tag params
    price?: string;
    seller_uuid?: string;
}
export interface ParamsGetProductShippingType {
    province_id: string;
    district_id: string;
    ward_id: string;
}
//product
export interface ParamsGetCategoryType {
    category_uuid?: any;
}
export interface ParamsGetProductFiltersType {
    category_uuid?: string;
    keyword?: string;
    brand?: string;
}

export interface ParamsGetCategoriesType {
    seller_uuid?: string;
    brand_uuid?: string;
}

/*----- customer ----- */
export interface DataRegisterType {
    firstname: string;
    lastname: string;
    telephone: string;
    password: string;
    confirm_password: string;
    referral_code?: string;
}
//customers/{type}
export type ActionGetCustomerInfoType =
    | 'all'
    | 'email'
    | 'username'
    | 'telephone'
    | 'google'
    | 'facebook'
    | 'apple'
    | 'profile'
    | 'pos'
    | 'score'
    | 'name'
    | 'email-confirm'
    | 'image'
    | 'change-password'
    | 'forgot-password';
//customers - data{}
export interface DataPutCustomerInfoType {
    /* -common- */
    username?: string;
    telephone?: string;
    provider_key?: string; //key firebase
    provider_token?: string; //link with social
    email?: string;
    otp?: string;
    new_password?: string;
    new_password_repeat?: string;

    /* -profile- */
    firstname?: string;
    lastname?: string;
    dob?: string;
    gender?: string;

    /* -email verify- */
    //*send:
    send_code?: boolean;
    back_url?: string;
    //*verify
    token?: string; //link
    ///-email//link
    ///-otp//input

    /* telephone verify */
    ///telephone
    ///provider_key
    ///provider_token

    /* -forgot password()- */
    change_password?: boolean;
    //new_password
    //new_password_repeat
    ///-email or telephone
    ///email: input: otp & link: token
    ///telephone: provider_key & provider_token
    ///- check: verify token or otp - check exits telephone or email when send
    check?: 'token' | 'telephone' | 'email';
    /* *change password */
    password?: string;
    //new_password
    //new_password_repeat
    image?: string;
}
//-customer address
export interface DataAddressType {
    firstname: string;
    lastname: string;
    telephone: string;
    street: string;
    province_id: string;
    district_id: string;
    ward_id: string;
    vat_id?: string;
    is_default_shipping?: string;
    is_default_billing?: string;
}
export interface ParamsGetListCustomerAddressType {}
export interface DataUpdateCustomerAddressType extends DataAddressType {
    update_type: 'update_address' | 'update_default_address';
}
export interface DataCreateCustomerAddressType extends DataAddressType {}
/* ----- Auth ----- */
export interface DataLoginUserType {
    username?: string;
    password?: string;
    provider?: 'google' | 'facebook' | 'apple';
    provider_key?: string;
    provider_token?: string;
    register?: boolean;
    referral_code?: string;
}

export interface DataLoginType {
    user: {
        username: string;
        password: string;
    };
    google: {
        provider: 'google';
        provider_token: string;
        referral_code?: string;
    };
    facebook: {
        provider: 'facebook';
        provider_token: string;
        referral_code?: string;
    };
    apple: {
        provider: 'apple';
        provider_token: string;
        provider_key: string;
        referral_code?: string;
    };
}
/* ----- Cart ----- */
export interface ParamsGetCartItemType {
    page_size?: any;
    step?: 'cart' | 'checkout';
}
//cart address
export interface DataPutCartAddressType extends DataAddressType {}
export interface DataUpdateCartType {
    qty?: number;
    is_checked?: 'Y' | 'N';
    is_checked_all?: 'Y' | 'N';
    product_seller_uuid?: string;
}
export type ActionTypeUpdateCartItemType = 'quantity' | 'checked';

export type ParamsGetCartSummaryType = {
    [key: string]: 'store_pickup' | 'home_delivery';
};

//--cart order
export interface ParamsGetCartOrdersType {
    page?: any;
    status: 'pending' | 'processing' | 'shipping' | 'complete' | 'cancel' | 'returns';
}
export interface DataCreateOrderCustomerType {
    customer_note?: string;
    use_coin?: number;
    use_gift?: string;
    [key: string]: 'store_pickup' | 'home_delivery' | string | number | undefined;
}
export interface DataUpdateReturnsCheckedType {
    is_checked: 'Y' | 'N';
    order_item_uuid?: string;
}
export interface DataCreateOrderReturnsType {
    reason: string;
    refund_method: string;
}

/* ----- Brands ----- */
export interface ParamsGetBrandsType {
    type?: 'featured' | 'all';
    page_size?: any;
}

/* ----- Slides ----- */
//--slide group type
export type HomeGroupSlideType =
    | 'home_sub_slide'
    | 'home_sale_slide'
    | 'home_main_slide'
    | 'home_brand_slide';

export type CartGroupSlideType = 'cart_main_slide' | 'cart_sub_slide';
export type BrandGroupSlideType = 'brand_product_slide';
export type BrandFeaturedSlideType = 'brand_featured_product_slide';
export type NewsListSlideType = 'news_body_right_slide_1';

export interface ParamsGetSlidesType {
    group?: Slide.Slide_Group_Type;
}
//config page
export type PageCodeConfigType = 'home' | 'brand' | 'cart';
/*-----news -----*/
export interface ParamsGetNewsType {
    type?: 'featured' | 'new' | 'most_viewed';
    category_uuid?: string;
    page_size?: number;
    page?: any;
}
/*-----event qr code -----*/
export type ActionTypeGetEventQrCode = 'info' | 'config';
/*-----event coin -----*/
export type ActionTypeGetEventCoinType = 'info' | 'config';

/*-----policy -----*/
export type ParamsArticleType =
    | 'general_mobile'
    | 'privacy'
    | 'shipping'
    | 'check-return'
    | 'payment'
    | 'warranty'
    | 'dispute'
    | 'event-coin'
    | 'event-loyal'
    | 'event-referral';

/*----- system ----- */
export interface DataRegisterDeviceType {
    device_unique_id: string;
    device_name: string;
}
/*----- warranty ----- */
export interface ParamsGetCustomerWarranties {
    // status?: 'pending' | 'processing' | 'success';
    status?: string;
}

/*----- seller ----- */
export interface ParamsGetSellersType {
    page_size?: any;
    page?: any;
}

/*----- gift ----- */
export interface ParamsGetListGiftCustomer {
    seller_uuid?: string; //1,2
    status?: 'applying' | 'applied' | 'any';
    page_size?: number;
}

/*----- referral ----- */
export interface DataSaveDeviceInfoDownloader {
    ip_internet: string;
    ip_local: string;
    os_name: string;
    os_version: string;
    model: string;
    referral_code: string;
}
export interface ParamsGetReferrerInfoWithDataDevice {
    ip_internet: string;
    ip_local: string;
    os_name: string;
    os_version: string;
    model: string;
}
/*----- review ----- */
export interface DataProductReviewType {
    product_seller_uuid?: string;
    customer_anonymous: 'Y' | 'N';
    order_uuid?: string;
    review_score: number;
    review_content: string;
    image?: string;
    video?: string;
}
export interface DataUpdateProductReviewType {
    //base info
    customer_anonymous?: 'Y' | 'N';
    review_score?: number;
    review_content?: string;
    // review_shipping_score?: number;
    // review_shipping_content?: string;
    //media
    action?: 'add_media' | 'delete_media';
    type?: 'image' | 'video';
    //--base64 (với image) hoặc file tạm với video
    media?: string;
    //--delete media
    media_uuid?: string;
}

/*----- Pos ----- */
export interface DataEditCustomerPosInfoType {
    name: string; //Tên KH. Với action editInfo. Required
    region?: string; //Với action editInfo
    city?: string; //Với action editInfo
    address?: string; //Với action editInfo
}

export interface DataCreateScoreTransfer {
    score: string | number;
}
