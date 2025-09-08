import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { DrawerContentComponentProps, DrawerNavigationOptions } from '@react-navigation/drawer';
import { StackNavigationOptions } from '@react-navigation/stack';
import { Theme } from '@rneui/themed';
import Login from 'authentications/Login';
import Register from 'authentications/Register';
import { DrawerContentFilter } from 'components/DrawerContentFilter';
import Image from 'components/Image';
import MiniChat from 'components/MiniChat';
import Text from 'components/Text';
import VideoFullScreen from 'components/Video/VideoFullScreen';
import View from 'components/View';
import { Routes } from 'const/index';
import { useTheme } from 'hooks';
import React from 'react';
import { Dimensions, Platform, StyleSheet } from 'react-native';
import Ripple from 'react-native-material-ripple';
import Icon from 'react-native-vector-icons/Ionicons';
import AccountScreen from 'screens/account';
import EditPasswordScreen from 'screens/account/screens/editpassword';
import { default as EditVerifyScreen } from 'screens/account/screens/editverify';
import EnterReferralScreen from 'screens/account/screens/referral/EnterReferralScreen';
import ReferralInfoScreen from 'screens/account/screens/referral/ReferralInfoScreen';
import AddressScreen from 'screens/address/ui2';
import AddressForm from 'screens/address/ui2/screens/AddressForm';
import AddressFormLocation from 'screens/address/ui2/screens/AddressFormLocation';
import BrandsScreen from 'screens/brands';
import CartScreen from 'screens/cart/ui2';
import CategoriesScreen from 'screens/categories';
import ChatListUser from 'screens/chat';
import ChatMessage from 'screens/chat/screens/ChatMessage';
import CheckoutScreen from 'screens/checkout/ui2/index';
import CoinScreen from 'screens/coin';
import FlashSaleScreen from 'screens/flashsale';
import ForgotPasswordScreen from 'screens/forgotpassword';
import ResetPasswordScreen from 'screens/forgotpassword/screen/ResetPassword';
import GiftScreen from 'screens/gift';
import HomeScreen from 'screens/home/ui_2';
import MediaScreen from 'screens/media';
import NewsScreen, { DrawerContentNewsFilter } from 'screens/news';
import NewsCategory from 'screens/news/screens/NewsCategory';
import NewsDetailScreen from 'screens/news/screens/NewsDetail';
import NotifyScreen from 'screens/notify';
import OrdersScreen from 'screens/orders';
import OrdersDetail from 'screens/orders/screen/OrdersDetail';
import OrdersDetailReturnsScreen from 'screens/orders/screen/OrdersDetailReturns';
import OrdersReturnsScreen from 'screens/orders/screen/OrdersReturns';
import OrdersReturnsOptionsScreen from 'screens/orders/screen/OrdersReturnsOptions';
import OrdersShipping from 'screens/orders/screen/OrdersShipping';
import OrderSuccessScreen from 'screens/ordersuccess/ui2';
import PolicyScreen from 'screens/policy';
import IntroductionScreen from 'screens/policy/screen/Introduction';
import PolicyDetail from 'screens/policy/screen/PolicyDetail';
import PosListScreen from 'screens/pos';
import PosCustomerInfo from 'screens/pos/screen/PosCustomerInfo';
import PosOrderDetail from 'screens/pos/screen/PosOrderDetail';
import PosOrders from 'screens/pos/screen/PosOrders';
import PosScore from 'screens/pos/screen/PosScore';
import PosScoreTransfer from 'screens/pos/screen/PosScoreTransfer';
import PriceComparisonScreen from 'screens/pricecomparison';
import ProductDetailScreen from 'screens/productdetail';
import ReviewScreen from 'screens/productdetail/screens/ReviewScreen';
import ProductScreen from 'screens/products';
import ProfileScreen from 'screens/profile';
import ScanScreen from 'screens/scan';
import SearchScreen from 'screens/search';
import SettingScreen from 'screens/setting';
import DeleteAccountScreen from 'screens/setting/screen/DeleteAccount';
import DeleteAccountConfirm from 'screens/setting/screen/DeleteAccountConfirm';
import ReferralScreen from 'screens/setting/screen/Referral';
import ShopScreen from 'screens/shop';
import ShopProductScreen from 'screens/shop/screens/ShopProductScreen';
import SocialScreen from 'screens/social';
import SpinAttendance from 'screens/spin_attendance';
import TestAnimatedScreen from 'screens/test/TestAnimated';
import TestBiometric from 'screens/test/TestBiometric';
import WarrantyScreen from 'screens/warranty';
import WarrantyDetail from 'screens/warranty/screens/WarrantyDetail';
import WebviewScreen from 'screens/webview';
import { themeType } from 'theme';

//url động cho web
export type NavigatorConfigType = {
    type: 'tab' | 'stack' | 'drawer' | 'screen';
    // tên màn hình trong code - code trong db
    name: any;
    // tên màn hình vietsub - name trong db
    label?: string;
    //dung de check xem screen nay thuoc khach hang hay khong
    //component screen - nếu không truyền sẽ không tạo thêm screen này vào navigator
    component?: any;
    //liên kết deeplink của app
    app_link?: string | null;
    child?: Array<NavigatorConfigType>;

    bottomOptions?: BottomTabNavigationOptions;
    //*Chỉ sử dụng cho stack */
    stackOptions?: StackNavigationOptions;
    //*Chỉ sử dụng cho drawer */
    drawerContent?: ((props: DrawerContentComponentProps) => React.ReactNode) | undefined;
    drawerOption?: DrawerNavigationOptions;
};
//cấu hình main tab
const TabBarIconOption = ({
    icon,
    title,
    color,
}: {
    icon: (theme: Theme) => React.ReactNode;
    title?: string;
    color?: string;
}) => {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles(theme);

    return (
        <View style={styles.view_iconStyle}>
            {icon(theme)}
            {title && (
                <Text
                    style={{ color }}
                    size={'sub3'}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    // adjustsFontSizeToFit={true}
                >
                    {title}
                </Text>
            )}
        </View>
    );
};

const TabBarButtonOption = ({ children, onPress }: { children: React.ReactNode; onPress: any }) => {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles(theme);

    return (
        <Ripple onPress={onPress} style={styles.ripple_buttonTabStyle} rippleCentered>
            {children}
        </Ripple>
    );
};
const tabConfig: NavigatorConfigType = {
    type: 'tab',
    name: Routes.NAVIGATION_TAB_NAV,
    child: [
        // home tab
        {
            type: 'stack',
            name: Routes.NAVIGATION_HOME_STACK,
            child: [
                {
                    type: 'screen',
                    name: Routes.NAVIGATION_TO_HOME_SCREEN,
                    label: 'Trang chủ',
                    component: HomeScreen,
                    app_link: 'home',
                },
            ],
            bottomOptions: {
                tabBarIcon: ({ color, focused }) => {
                    const iconName = focused ? 'home' : 'home-outline';
                    return (
                        <TabBarIconOption
                            color={color}
                            title="Trang chủ"
                            icon={(theme) => (
                                <Icon
                                    name={iconName}
                                    size={theme.typography.size(21)}
                                    color={color}
                                />
                            )}
                        />
                    );
                },
                tabBarButton: ({ children, onPress }) => (
                    <TabBarButtonOption children={children} onPress={onPress} />
                ),
            },
        },
        // new tab
        {
            type: 'stack',
            name: Routes.NAVIGATION_TO_NEWS_STACK,
            child: [
                {
                    type: 'drawer',
                    drawerContent: (props) => <DrawerContentNewsFilter {...props} />,
                    name: Routes.NAVIGATION_TO_NEWS_DRAWER,
                    child: [
                        {
                            type: 'screen',
                            name: Routes.NAVIGATION_TO_NEWS_SCREEN,
                            component: NewsScreen,
                            label: 'Danh sách tin tức',
                            app_link: 'news',
                        },
                    ],
                },
            ],
            bottomOptions: {
                tabBarIcon: ({ color, focused }) => {
                    const iconName = focused ? 'newspaper-sharp' : 'newspaper-outline';
                    return (
                        <TabBarIconOption
                            color={color}
                            title="Review & Ý Tưởng"
                            icon={(theme) => (
                                <Icon
                                    name={iconName}
                                    size={theme.typography.size(21)}
                                    color={color}
                                />
                            )}
                        />
                    );
                },
                tabBarButton: ({ children, onPress }) => (
                    <TabBarButtonOption children={children} onPress={onPress} />
                ),
            },
        },
        // scan
        {
            type: 'stack',
            name: Routes.NAVIGATION_SCAN_STACK,
            app_link: null,
            child: [
                {
                    type: 'screen',
                    name: Routes.NAVIGATION_TO_SCAN_SCREEN,
                    label: 'Quét mã',
                    component: ScanScreen,
                    // app_link: 'qrcode',
                },
            ],
            bottomOptions: {
                tabBarIcon: ({}) => {
                    const size = Platform.OS === 'ios' ? 40 : 45;
                    return (
                        <TabBarIconOption
                            icon={(theme) => (
                                <Image
                                    source={require('asset/img-qr-gif.gif')}
                                    w={theme.typography.size(size)}
                                    h={theme.typography.size(size)}
                                />
                            )}
                        />
                    );
                },
                tabBarButton: ({ children, onPress }) => (
                    <TabBarButtonOption children={children} onPress={onPress} />
                ),
                tabBarStyle: { display: 'none' },
                popToTopOnBlur: true,
            },
        },
        // chat tab
        {
            type: 'screen',
            name: Routes.NAVIGATION_TO_CHAT_LIST_USER,
            component: ChatListUser,
            label: 'Danh sách user chat',
            app_link: 'chat-user',
            bottomOptions: {
                tabBarIcon: ({ color, focused }) => {
                    return (
                        <TabBarIconOption
                            color={color}
                            title="Tin nhắn"
                            icon={() => (
                                <MiniChat
                                    type="tabbar"
                                    iconStyle={{ color: color }}
                                    focused={focused}
                                />
                            )}
                        />
                    );
                },
                tabBarButton: ({ children, onPress }) => (
                    <TabBarButtonOption children={children} onPress={onPress} />
                ),
                popToTopOnBlur: true,
            },
        },
        //profile tab
        {
            type: 'stack',
            name: Routes.NAVIGATION_PROFILE_STACK,
            child: [
                {
                    type: 'screen',
                    name: Routes.NAVIGATION_TO_PROFILE_SCREEN,
                    label: 'Thông tin cá nhân',
                    component: ProfileScreen,
                    app_link: 'profile',
                },
            ],
            bottomOptions: {
                tabBarIcon: ({ color, focused }) => {
                    const iconName = focused ? 'person' : 'person-outline';
                    return (
                        <TabBarIconOption
                            color={color}
                            title="Cá nhân"
                            icon={(theme) => (
                                <Icon
                                    name={iconName}
                                    size={theme.typography.size(21)}
                                    color={color}
                                />
                            )}
                        />
                    );
                },
                tabBarButton: ({ children, onPress }) => (
                    <TabBarButtonOption children={children} onPress={onPress} />
                ),
            },
        },
    ],
};

//cấu hình chính
export const navigatorConfig: Array<NavigatorConfigType> = [
    //tabs
    tabConfig,
    // auth stack(user)
    {
        type: 'stack',
        name: Routes.NAVIGATION_AUTH_STACK,
        child: [
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_LOGIN_SCREEN,
                label: 'Đăng nhập',
                component: Login,
                app_link: 'user/login',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_REGISTER_SCREEN,
                label: 'Đăng ký',
                component: Register,
                app_link: 'user/register',
            },
        ],
    },
    //account stack
    {
        type: 'stack',
        name: Routes.NAVIGATION_ACCOUNT_STACK,
        child: [
            {
                type: 'screen',
                name: Routes.NAVIGATION_ACCOUNT_SCREEN,
                label: 'Thông tin tài khoản',
                component: AccountScreen,
                app_link: 'profile/account',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_EDIT_VERIFY_SCREEN,
                component: EditVerifyScreen,
                // app_link: 'account/verify',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_EDIT_REFERRAL_SCREEN,
                component: EnterReferralScreen,
                // app_link: 'account/password-edit',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_REFERRAL_INFO_SCREEN,
                component: ReferralInfoScreen,
                // app_link: 'account/password-edit',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_EDIT_PASSWORD_SCREEN,
                component: EditPasswordScreen,
                // app_link: 'account/password-edit',
            },
        ],
    },
    // address stack
    {
        type: 'stack',
        name: Routes.NAVIGATION_ADDRESS_STACK,
        child: [
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_ADDRESS_SCREEN,
                label: 'Danh sách địa chỉ',
                component: AddressScreen,
                app_link: 'profile/address',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_ADDRESS_FORM_SCREEN,
                component: AddressForm,
                // app_link: 'address/form',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_ADDRESS_FORM_LOCATION_SCREEN,
                component: AddressFormLocation,
                // app_link: 'address/location',
            },
        ],
    },
    // cart stack
    {
        type: 'stack',
        name: Routes.NAVIGATION_CART_STACK,
        child: [
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_CART_SCREEN,
                label: 'Giỏ hàng',
                component: CartScreen,
                app_link: 'cart',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_CHECKOUT_SCREEN,
                component: CheckoutScreen,
                // app_link: 'cart/checkout',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_ORDER_SUCCESS_SCREEN,
                component: OrderSuccessScreen,
                // app_link: 'cart/success',
            },
        ],
    },
    //checkout
    {
        type: 'stack',
        name: Routes.NAVIGATION_TO_CHECKOUT_STACK,
        child: [
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_CHECKOUT_SCREEN,
                component: CheckoutScreen,
                // app_link: 'cart/checkout',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_ORDER_SUCCESS_SCREEN,
                component: OrderSuccessScreen,
                // app_link: 'cart/success',
            },
        ],
    },
    // setting - policy stack
    {
        type: 'stack',
        name: Routes.NAVIGATION_SETTING_STACK,
        child: [
            {
                type: 'screen',
                name: Routes.NAVIGATION_SETTING_SCREEN,
                label: 'Thiết lập tài khoản',
                component: SettingScreen,
                app_link: 'profile/account/setup',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_SOCIAL_LINK_SCREEN,
                label: 'Liên kết mạng xã hội',
                component: SocialScreen,
                app_link: '/profile/account/social-link',
            },
            // {
            //     type: 'screen',
            //     name: Routes.NAVIGATION_SETTING_INTRODUCTION_SCREEN,
            //     label: 'Giới thiệu',
            //     component: IntroductionScreen,
            //     app_link: 'setting/introduction',
            // },

            {
                type: 'screen',
                name: Routes.NAVIGATION_DELETE_ACCOUNT_SCREEN,
                component: DeleteAccountScreen,
                // app_link: 'setting/delete',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_DELETE_ACCOUNT_CONFIRM_SCREEN,
                component: DeleteAccountConfirm,
                // app_link: 'setting/delete-confirm',
            },

            {
                type: 'screen',
                name: Routes.NAVIGATION_SETTING_REFERRAL_SCREEN,
                label: 'Mã giới thiệu',
                component: ReferralScreen,
                app_link: 'setting/referral',
            },
        ],
    },
    //policy
    {
        type: 'stack',
        name: Routes.NAVIGATION_TO_POLICY_STACK,
        child: [
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_POLICY_SCREEN,
                label: 'Chính sách Vua Dụng Cụ',
                component: PolicyScreen,
                app_link: 'policy/policy',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_POLICY_DETAIL_SCREEN,
                label: 'Chi tiết chính sách',
                component: PolicyDetail,
                app_link: 'help-center/:type',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_SETTING_INTRODUCTION_SCREEN,
                label: 'Giới thiệu',
                component: IntroductionScreen,
                app_link: 'setting/introduction',
            },
        ],
    },

    // forgot password stack
    {
        type: 'stack',
        name: Routes.NAVIGATION_TO_FORGOT_PASSWORD_STACK,
        child: [
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_FORGOT_PASSWORD_SCREEN,
                label: 'Lấy lại mật khẩu',
                component: ForgotPasswordScreen,
                app_link: 'user/forgot-password',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_RESET_PASSWORD_SCREEN,
                component: ResetPasswordScreen,
            },
        ],
    },
    // order stack
    {
        type: 'stack',
        name: Routes.NAVIGATION_ORDERS_STACK,
        child: [
            {
                type: 'screen',
                name: Routes.NAVIGATION_ORDERS_SCREEN,
                label: 'Danh sách đơn hàng',
                component: OrdersScreen,
                app_link: 'profile/orders',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_ORDERS_DETAIL_SCREEN,
                label: 'Chi tiết Đơn Hàng',
                component: OrdersDetail,
                app_link: 'profile/orders/:order_uuid',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_ORDERS_SHIPPING_SCREEN,
                label: 'Chi tiết vận chuyển',
                component: OrdersShipping,
                app_link: 'profile/orders',
            },

            {
                type: 'screen',
                name: Routes.NAVIGATION_ORDERS_RETURNS_SCREEN,
                label: 'Yêu cầu trả hàng',
                component: OrdersReturnsScreen,
                // app_link: 'order/shipping',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_ORDERS_RETURNS_OPTIONS_SCREEN,
                label: 'Tuỳ chon trả hàng',
                component: OrdersReturnsOptionsScreen,
                // app_link: 'order/shipping',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_ORDERS_DETAIL_RETURNS_SCREENS,
                label: 'Chi tiết đơn trả hàng',
                component: OrdersDetailReturnsScreen,
                // app_link: 'order/detail-returns/:memo_uuid',
            },
        ],
    },
    // warranty stack
    {
        type: 'stack',
        name: Routes.NAVIGATION_TO_WARRANTY_STACK,
        child: [
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_WARRANTY_SCREEN,
                label: 'Danh sách bảo hành',
                component: WarrantyScreen,
                app_link: 'profile/warranty',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_WARRANTY_DETAIL_SCREEN,
                label: 'Chi tiết bảo hành',
                component: WarrantyDetail,
                app_link: 'profile/warranty/:warranty_uuid',
            },
        ],
    },
    // qrcode screen
    {
        type: 'screen',
        name: Routes.NAVIGATION_TO_SCAN_SCREEN,
        label: 'Quét mã',
        component: ScanScreen,
        app_link: 'scan',
    },
    // search screen
    {
        type: 'screen',
        name: Routes.NAVIGATION_TO_SEARCH_SCREEN,
        label: 'Tìm kiếm',
        component: SearchScreen,
        app_link: 'search',
    },
    // product stack
    {
        type: 'drawer',
        name: Routes.NAVIGATION_TO_PRODUCT_DRAWER,
        drawerContent: (props) => <DrawerContentFilter {...props} />,
        drawerOption: {
            drawerPosition: 'right',
            drawerStyle: {
                width: Dimensions.get('window').width * 0.85,
            },
        },
        child: [
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_PRODUCT_CATEGORY_SCREEN,
                label: 'Danh sách sản phẩm thuộc danh mục',
                component: ProductScreen,
                app_link: 'product-category/:category_uuid',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_PRODUCT_BRAND_SCREEN,
                label: 'Danh sách sản phẩm thuộc thương hiệu',
                component: ProductScreen,
                app_link: 'product-brand/:brand_uuid',
            },
        ],
    },
    // product detail stack
    {
        type: 'stack',
        name: Routes.NAVIGATION_TO_PRODUCT_DETAIL_STACK,
        child: [
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_PRODUCT_DETAIL_SCREEN,
                label: 'Chi tiết sản phẩm',
                component: ProductDetailScreen,
                app_link: 'detail/:product_uuid/:product_seller_uuid',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_REVIEW_SCREEN,
                label: 'Đánh giá sản phẩm',
                component: ReviewScreen,
                // app_link: 'detail/review',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_COMPARISON_SCREEN,
                component: PriceComparisonScreen,
                label: 'So sánh giá',
                app_link: 'price-comparison/:product_uuid',
            },
        ],
    },
    // shop
    {
        type: 'drawer',
        name: Routes.NAVIGATION_TO_SHOP_DRAWER,
        drawerContent: (props) => <DrawerContentFilter {...props} />,
        drawerOption: {
            drawerPosition: 'right',
            drawerStyle: {
                width: Dimensions.get('window').width * 0.85,
            },
        },
        child: [
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_SHOP_SCREEN,
                component: ShopScreen,
                label: 'Cửa hàng',
                app_link: 'shop/:seller_code',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_SHOP_PRODUCT_SCREEN,
                component: ShopProductScreen,
                label: 'Tìm kiếm sản phẩm cửa hàng',
            },
        ],
    },
    //@POS
    {
        type: 'stack',
        name: Routes.NAVIGATION_TO_POS_STACK,
        child: [
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_POS_LIST_SCREEN,
                component: PosListScreen,
                label: 'Danh sách POS',
                app_link: 'profile/pos',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_POS_SCORE_SCREEN,
                component: PosScore,
                label: 'Chi tiết POS',
                app_link: 'profile/pos/score/:seller_uuid',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_POS_CUSTOMER_INFO_SCREEN,
                component: PosCustomerInfo,
                label: 'Thông tin cá nhân khách hàng Pos',
                app_link: 'profile/pos/:seller_uuid',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_POS_SCORE_TRANSFER_SCREEN,
                label: 'Đổi điểm tích luỹ',
                component: PosScoreTransfer,
                app_link: 'profile/pos/pos-transfer/:seller_uuid',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_POS_ORDERS_SCREEN,
                label: 'Đơn hàng pos',
                component: PosOrders,
                app_link: 'profile/pos/orders/:seller_uuid',
            },
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_POS_ORDER_DETAIL_SCREEN,
                label: 'Chi tiết đơn hàng pos',
                component: PosOrderDetail,
                app_link: 'profile/pos/orders/:seller_uuid/:ticket_id',
            },
        ],
    },

    //news - news detail - news category
    //--di chuyen ra ngoai stack nham khong bi hien tab khi navigate
    {
        type: 'screen',
        name: Routes.NAVIGATION_TO_NEWS_DETAIl,
        component: NewsDetailScreen,
        label: 'Chi tiết tin tức',
        app_link: 'news/:news_uuid',
    },
    {
        type: 'screen',
        name: Routes.NAVIGATION_TO_NEWS_CATEGORY,
        component: NewsCategory,
        label: 'Danh sách tin tức theo danh mục',
        app_link: 'news/:category_uuid',
    },
    //event spin attendance
    {
        type: 'screen',
        name: Routes.NAVIGATION_TO_SPIN_ATTENDANCE_SCREEN,
        component: SpinAttendance,
        label: 'Vòng quay điểm danh',
        app_link: 'event/spin-attendance',
    },
    //gift
    {
        type: 'screen',
        name: Routes.NAVIGATION_TO_GIFT_SCREEN,
        component: GiftScreen,
        label: 'Quà tặng',
        app_link: 'profile/gift',
    },
    //coin
    {
        type: 'screen',
        name: Routes.NAVIGATION_TO_COIN_SCREEN,
        component: CoinScreen,
        label: 'Vdc Xu',
        app_link: 'profile/coin',
    },
    //chat
    {
        type: 'stack',
        name: Routes.NAVIGATION_TO_CHAT_STACK,
        child: [
            {
                type: 'screen',
                name: Routes.NAVIGATION_TO_CHAT_MESSAGE,
                component: ChatMessage,
                label: 'Màn hình chat',
                app_link: 'chat/:user_uuid',
            },
        ],
    },
    //notify
    {
        type: 'screen',
        name: Routes.NAVIGATE_TO_NOTIFY_SCREEN,
        component: NotifyScreen,
        label: 'Thông báo',
        app_link: 'notification',
    },
    //categories
    {
        type: 'screen',
        name: Routes.NAVIGATE_TO_CATEGORIES_SCREEN,
        component: CategoriesScreen,
        label: 'Danh sách danh mục',
        app_link: 'categories',
    },
    //brands
    {
        type: 'screen',
        name: Routes.NAVIGATION_TO_BRANDS_SCREEN,
        component: BrandsScreen,
        label: 'Danh sách thương hiệu',
        app_link: 'brands',
    },
    //brands
    {
        type: 'screen',
        name: Routes.NAVIGATE_TO_FLASH_SALE_SCREEN,
        component: FlashSaleScreen,
        label: 'Flash sale',
        app_link: 'flashsale',
    },
    /* --- cac man hinh khong can luu tru --- */
    //full video screen
    {
        type: 'screen',
        name: Routes.NAVIGATION_TO_VIDEO_FULL_SCREEN,
        label: 'Full video screen',
        component: VideoFullScreen,
        // app_link: '/video-fullscreen',
        stackOptions: {
            //tiep tuc phat video o trang truoc
            detachPreviousScreen: false,
            animation: 'none',
        },
    },
    //media
    {
        type: 'screen',
        name: Routes.NAVIGATION_TO_MEDIA_SCREEN,
        label: 'Media screen',
        component: MediaScreen,
        // app_link: '/list-image',
        stackOptions: {
            //tiep tuc phat video o trang truoc
            // detachPreviousScreen: false,
            // animationEnabled: false,
        },
    },
    //webview
    {
        type: 'screen',
        name: Routes.NAVIGATE_TO_WEBVIEW_SCREEN,
        label: 'WebviewScreen',
        component: WebviewScreen,
        app_link: 'webview/:url',
    },
    //test
    {
        type: 'screen',
        name: Routes.NAVIGATE_TO_TEST_ANIMATED,
        label: 'WebviewScreen',
        component: TestAnimatedScreen,
    },
    {
        type: 'screen',
        name: Routes.NAVIGATE_TO_TEST_BIOMETRIC,
        label: 'WebviewScreen',
        component: TestBiometric,
    },
];

const useStyles = (theme: themeType) => {
    return StyleSheet.create({
        view_iconStyle: {
            justifyContent: 'center',
            alignItems: 'center',
            width: theme.dimens.width / 5,
        },
        ripple_buttonTabStyle: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0,
            margin: 0,
        },
    });
};
