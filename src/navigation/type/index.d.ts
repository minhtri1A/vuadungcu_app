import { CustomerAddressType, ParamsArticleType } from 'models';
import { ProductDetailResponseType } from './../../models/resModel';

//auth
export type AuthStackParamsList = {
    LoginScreen: {
        routeGoback?: string;
    };
    RegisterScreen: undefined;
};
//address
export type AddressStackParamsList = {
    AddressScreen: { type: 'shipping' | 'customer' | 'billing' };
    AddressForm: {
        addressEdit?: CustomerAddressType;
        type: 'shipping' | 'customer' | 'billing';
    };
    AddressFormLocation: undefined;
};
//cart
export type CartStackParamsList = {
    CartScreen: undefined;
    CheckoutScreen: undefined;
    OrderSuccessScreen: undefined;
};
//home
export type HomeStackParamsList = {
    HomeScreen: undefined;
    // NotifyScreen: undefined;
};
//qr code
export type QRCodeStackParamsList = {
    QRCodeScreen: undefined;
};
//product
export interface FilterType {
    attribute_code: string;
    //select filter
    options?: Array<string>;
    //price filter
    min?: string;
    max?: string;
}
export type ProductStackParamsList = {
    ProductScreen: {
        category_uuid?: any;
        brand_uuid?: any;
        search?: any;
        filters?: Array<FilterType>;
    };
    // ProductDrawer
};

//profile -> setting -> account
export type ProfileStackParamsList = {
    ProfileScreen: undefined;
};

export type OrdersStackParamsList = {
    OrdersScreen: {
        orderIndex?: number;
    };
    OrdersDetailScreen: {
        order_uuid: string;
    };
    OrdersShippingScreen: {
        order_uuid: string;
    };
    OrdersReturnsScreen: {
        order_uuid: string;
    };
    OrdersReturnsOptionsScreen: {
        option_type: 'reason' | 'payment';
    };
    OrdersDetailReturnsScreen: {
        memo_uuid: string;
    };
};

//policy

export type PolicyStackParamsList = {
    PolicyScreen: undefined;
    PolicyDetailScreen: {
        type: ParamsArticleType;
    };
    IntroductionScreen: undefined;
};

//score
export type EventStackParamsList = {
    EventScreen: {
        type: 'qr_code' | 'coin';
    };
    EventDetailScreen: {
        type: 'qr_code' | 'coin' | 'loyal_point';
    };
};

//setting
export type SettingStackParamsList = {
    SettingScreen: undefined;
    SocialScreen: undefined;
    IntroductionScreen: undefined;
    DeleteAccountScreen: undefined;
    DeleteAccountConfirmScreen: undefined;

    ReferralScreen: {
        referral_code?: string;
    };
};

export type AccountStackParamsList = {
    AccountScreen: undefined;
    EditVerifyScreen: {
        type: string;
        title: string;
    };
    EditPasswordScreen: undefined;
};
//password
export type PasswordStackParamsList = {
    ForgotPasswordScreen: {
        beforeAction: 'login' | 'goback_2';
        success?: (new_password: string) => void;
    };
    ResetPasswordScreen: {
        beforeAction: 'login' | 'goback_2';
        success?: (new_password: string) => void;
        // telephone
        telephone?: string;
        provider_key?: string;
        provider_token?: string;
        // emain
        email?: string;
        otp?: string;
    };
};
//warranty
export type WarrantyStackParamsList = {
    WarrantyScreen: undefined;
    WarrantyDetailScreen: {
        warranty_uuid: string;
    };
};
//product detail
export type ProductDetailStackParamsList = {
    ProductDetailScreen: {
        product_uuid: string;
        product_seller_uuid?: string;
    };
    ReviewScreen: {
        pds: ProductDetailResponseType['detail-static'];
        message_init_delivery: string;
    };
    PriceComparisonScreen: {
        product_uuid: string;
    };
};
//shop
export type ShopStackParamsList = {
    ShopScreen: {
        seller_code: string;
        seller_uuid?: string;
        filters?: Array<FilterType>;
    };
    ShopProductScreen: {
        seller_uuid: string;
        keyword?: string;
        newest?: boolean;
        discount?: boolean;
    };
};

//new
export type NewsStackParamsList = {
    NewsScreen: undefined;
    NewsDetailScreen: {
        news_uuid: string;
    };
    NewsCategoryScreen: {
        category_uuid?: string;
        type?: 'new' | 'most_viewed';
        name: string;
    };
};

//chat
export type ChatStackParamsList = {
    ChatMessage: {
        user_uuid: string;
    };
};

//ntl store
export type NTLStoreStackParamsList = {
    NTLStoreScreen: undefined;
    LoyalPointTransferScreen: undefined;
    NTLOrdersScreen: undefined;
    NTLOrderDetailScreen: {
        order_id: string;
    };
};

export type PosStackParamsList = {
    PosListScreen: undefined;
    PosScoreScreen: {
        seller_uuid: string;
        seller_name: string;
    };
    PosCustomerInfo: {
        seller_uuid: string;
        seller_name: string;
    };
    PosScoreTransfer: {
        seller_uuid: string;
    };
    PosOrders: {
        seller_uuid: string;
    };
    PosOrderDetail: {
        seller_uuid: string;
        ticket_id: string;
    };
};

//tabbar
export type AppTabParamsList = {
    HomeStack: HomeStackParamsList;
    ProductStack: ProductStackParamsList;
    QRCodeStack: QRCodeStackParamsList;
    ChatListUser: undefined;
    ProfileStack: ProfileStackParamsList;
};

//common screen - hide tabbar in stack
export type RootStackParamsList = {
    PosStack: PosStackParamsList;
    TabNav: AppTabParamsList;
    AuthStack: AuthStackParamsList;
    AccountStack: AccountStackParamsList;
    QRCodeScreen: any;
    AddressStack: AddressStackParamsList;
    CartStack: CartStackParamsList;
    SettingStack: SettingStackParamsList;
    ForgotPasswordStack: PasswordStackParamsList;
    OrdersStack: OrdersStackParamsList;
    EventStack: EventStackParamsList;
    WarrantyStack: WarrantyStackParamsList;
    ProductDetailStack: ProductDetailStackParamsList;
    ShopStack: ShopStackParamsList;
    ChatStack: ChatStackParamsList;
    CategoriesScreen: undefined;
    BrandsScreen: undefined;
    SpinAttendanceScreen: undefined;
    FlashSaleScreen: undefined;
    PolicyStack: PolicyStackParamsList;
    //sss
    Article: {
        type: ParamsArticleType;
    };
    //notify
    NotifyScreen: any;
    //support screen
    VideoFullScreen: {
        source: any;
        pause: boolean;
        currentTime: number;
        muted: boolean;
        durationVideo: number;
    };

    MediaScreen: {
        media: Array<{
            url: string;
            type: 'image' | 'video';
        }>;
        startIndex: number;
    };
    //webview
    WebViewScreen: {
        url: string;
    };
};

//any type
