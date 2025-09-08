import AsyncStorage from '@react-native-async-storage/async-storage';
import { Routes } from 'const/index';
import {
    EventStackParamsList,
    NTLStoreStackParamsList,
    NewsStackParamsList,
    ProductStackParamsList,
    RootStackParamsList,
} from 'navigation/type';
import { useRef } from 'react';
import { useNavigation } from './useCommon';

export default function useNavigate() {
    const navigation = useNavigation();
    const isPushing = useRef(true);

    const debounceNavigate = () => {
        if (isPushing.current) {
            isPushing.current = false;
            const timer = setTimeout(() => {
                isPushing.current = true;
                clearTimeout(timer);
            }, 1500);
            return true;
        }
        return false;
    };
    const dbn = debounceNavigate;

    return {
        NAVIGATE: (screen: string, params?: object) => {
            navigation.navigate(screen, params);
        },
        //auth
        LOGIN_ROUTE: (redirectValue?: { screen: string; params?: object }) => () => {
            if (redirectValue) {
                AsyncStorage.setItem(
                    'redirect-login-value',
                    JSON.stringify({
                        screen: redirectValue.screen,
                        params: redirectValue?.params,
                    })
                );
            }
            navigation.navigate(Routes.NAVIGATION_AUTH_STACK, {
                screen: Routes.NAVIGATION_TO_LOGIN_SCREEN,
            });
        },
        FORGOT_PASSWORD_ROUTE:
            (params: RootStackParamsList['ForgotPasswordStack']['ForgotPasswordScreen']) => () =>
                navigation.navigate(Routes.NAVIGATION_TO_FORGOT_PASSWORD_STACK, {
                    screen: Routes.NAVIGATION_TO_FORGOT_PASSWORD_SCREEN,
                    params,
                }),
        RESET_PASSWORD_ROUTE:
            (params: RootStackParamsList['ForgotPasswordStack']['ResetPasswordScreen']) => () =>
                navigation.navigate(Routes.NAVIGATION_TO_RESET_PASSWORD_SCREEN, params),
        //news
        NEW_DETAIL_ROUTE: (params: NewsStackParamsList['NewsDetailScreen']) => () =>
            navigation.navigate(Routes.NAVIGATION_TO_NEWS_DETAIl, params),
        NEWS_CATEGORY_ROUTE: (params: NewsStackParamsList['NewsCategoryScreen']) => () =>
            dbn() && navigation.navigate(Routes.NAVIGATION_TO_NEWS_CATEGORY, params),
        //product page
        PRODUCT_CATEGORY_ROUTE: (params: ProductStackParamsList['ProductScreen']) => () =>
            dbn() &&
            navigation.push(Routes.NAVIGATION_TO_PRODUCT_DRAWER, {
                screen: Routes.NAVIGATION_TO_PRODUCT_CATEGORY_SCREEN,
                params,
            }),
        PRODUCT_BRAND_ROUTE: (params: ProductStackParamsList['ProductScreen']) => () =>
            dbn() &&
            navigation.push(Routes.NAVIGATION_TO_PRODUCT_DRAWER, {
                screen: Routes.NAVIGATION_TO_PRODUCT_BRAND_SCREEN,
                params,
            }),

        //product detail
        PRODUCT_DETAIL_ROUTE: (product_uuid: string, product_seller_uuid: string) => () =>
            dbn() &&
            navigation.push(Routes.NAVIGATION_TO_PRODUCT_DETAIL_STACK, {
                screen: Routes.NAVIGATION_TO_PRODUCT_DETAIL_SCREEN,
                params: { product_uuid, product_seller_uuid },
            }),
        //ntl store

        LOYAL_TRANSFER_ROUTE:
            (params?: NTLStoreStackParamsList['LoyalPointTransferScreen']) => () =>
                navigation.navigate(Routes.NAVIGATION_TO_POS_SCORE_TRANSFER_SCREEN, params),
        ORDERS_POS_ROUTE: (params?: NTLStoreStackParamsList['NTLOrdersScreen']) => () =>
            navigation.navigate(Routes.NAVIGATION_TO_POS_ORDERS_SCREEN, params),
        ORDER_DETAIL_POS_ROUTE: (params?: NTLStoreStackParamsList['NTLOrderDetailScreen']) => () =>
            navigation.navigate(Routes.NAVIGATION_TO_POS_ORDER_DETAIL_SCREEN, params),
        //event
        EVENT_DETAIL_ROUTE: (params?: EventStackParamsList['EventDetailScreen']) => () =>
            navigation.navigate(Routes.NAVIGATION_TO_EVENT_STACK, {
                screen: Routes.NAVIGATION_TO_EVENT_DETAIL_SCREEN,
                params,
            }),
        //QRCode
        SCAN_QRCODE_ROUTE: () => () =>
            navigation.navigate(Routes.NAVIGATION_TAB_NAV, {
                screen: Routes.NAVIGATION_SCAN_STACK,
                params: {
                    screen: Routes.NAVIGATION_TO_SCAN_SCREEN,
                },
            }),
        //article
        POLICY_DETAIL_ROUTE:
            (params?: RootStackParamsList['PolicyStack']['PolicyDetailScreen']) => () =>
                navigation.navigate(Routes.NAVIGATION_TO_POLICY_STACK, {
                    screen: Routes.NAVIGATION_TO_POLICY_DETAIL_SCREEN,
                    params,
                }),
        //policy
        POLICY_ROUTE: () => () =>
            navigation.navigate(Routes.NAVIGATION_TO_POLICY_STACK, {
                screen: Routes.NAVIGATION_TO_POLICY_SCREEN,
            }),

        INTRODUCTION_ROUTE: () => () =>
            navigation.navigate(Routes.NAVIGATION_TO_POLICY_STACK, {
                screen: Routes.NAVIGATION_SETTING_INTRODUCTION_SCREEN,
            }),
        // gift
        GIFT_ROUTE: () => navigation.navigate(Routes.NAVIGATION_TO_GIFT_SCREEN),
        // coin
        COIN_ROUTE: () => navigation.navigate(Routes.NAVIGATION_TO_COIN_SCREEN),
        //spin attendance
        SPIN_ATTENDANCE_ROUTE: () =>
            navigation.navigate(Routes.NAVIGATION_TO_SPIN_ATTENDANCE_SCREEN),
        //chat
        CHAT_LIST_USER_ROUTE: (params?: RootStackParamsList['TabNav']['ChatListUser']) => () =>
            navigation.navigate(Routes.NAVIGATION_TO_CHAT_LIST_USER, params),
        CHAT_MESSAGE_ROUTE: (params: RootStackParamsList['ChatStack']['ChatMessage']) => () =>
            navigation.navigate(Routes.NAVIGATION_TO_CHAT_STACK, {
                screen: Routes.NAVIGATION_TO_CHAT_MESSAGE,
                params,
            }),
        //shop
        SHOP_ROUTE: (params: RootStackParamsList['ShopStack']['ShopScreen']) => () =>
            navigation.navigate(Routes.NAVIGATION_TO_SHOP_DRAWER, {
                screen: Routes.NAVIGATION_TO_SHOP_SCREEN,
                params,
            }),
        //notify
        NOTIFY_ROUTE: (params?: RootStackParamsList['NotifyScreen']) => () =>
            navigation.navigate(Routes.NAVIGATE_TO_NOTIFY_SCREEN, params),
        //categories
        CATEROGIES_ROUTE: (params?: RootStackParamsList['CategoriesScreen']) => () =>
            navigation.navigate(Routes.NAVIGATE_TO_CATEGORIES_SCREEN, params),
        //warranty
        WARRANTY_ROUTE: (params?: RootStackParamsList['WarrantyStack']['WarrantyScreen']) => () =>
            navigation.navigate(Routes.NAVIGATION_TO_WARRANTY_STACK, {
                screen: Routes.NAVIGATION_TO_WARRANTY_SCREEN,
                params,
            }),
        //address
        ADDRESS_ROUTE: (params?: RootStackParamsList['AddressStack']['AddressScreen']) => () =>
            navigation.navigate(Routes.NAVIGATION_ADDRESS_STACK, {
                screen: Routes.NAVIGATION_TO_ADDRESS_SCREEN,
                params,
            }),
        //brands
        BRANDS_ROUTE: (params?: RootStackParamsList['BrandsScreen']) => () =>
            navigation.navigate(Routes.NAVIGATION_TO_BRANDS_SCREEN, params),
        //brands
        FLASH_SALE_ROUTE: (params?: RootStackParamsList['FlashSaleScreen']) => () =>
            navigation.navigate(Routes.NAVIGATE_TO_FLASH_SALE_SCREEN, params),
        //search
        SEARCH_ROUTE: () => navigation.navigate(Routes.NAVIGATION_TO_SEARCH_SCREEN),
        //@Pos
        POS_LIST_ROUTE: () =>
            navigation.navigate(Routes.NAVIGATION_TO_POS_STACK, {
                screen: Routes.NAVIGATION_TO_POS_LIST_SCREEN,
            }),
        POS_SCORE_ROUTE: (params?: RootStackParamsList['PosStack']['PosScoreScreen']) => () =>
            navigation.navigate(Routes.NAVIGATION_TO_POS_STACK, {
                screen: Routes.NAVIGATION_TO_POS_SCORE_SCREEN,
                params,
            }),
        POS_CUSTOMER_INFO_ROUTE:
            (params?: RootStackParamsList['PosStack']['PosCustomerInfo']) => () =>
                navigation.navigate(Routes.NAVIGATION_TO_POS_STACK, {
                    screen: Routes.NAVIGATION_TO_POS_CUSTOMER_INFO_SCREEN,
                    params,
                }),
        POS_SCORE_TRANSFER_ROUTE:
            (params?: RootStackParamsList['PosStack']['PosScoreTransfer']) => () =>
                navigation.navigate(Routes.NAVIGATION_TO_POS_STACK, {
                    screen: Routes.NAVIGATION_TO_POS_SCORE_TRANSFER_SCREEN,
                    params,
                }),
        POS_ORDERS_ROUTE: (params?: RootStackParamsList['PosStack']['PosOrders']) => () =>
            navigation.navigate(Routes.NAVIGATION_TO_POS_STACK, {
                screen: Routes.NAVIGATION_TO_POS_ORDERS_SCREEN,
                params,
            }),
        POS_ORDER_DETAIL_ROUTE:
            (params?: RootStackParamsList['PosStack']['PosOrderDetail']) => () =>
                navigation.navigate(Routes.NAVIGATION_TO_POS_STACK, {
                    screen: Routes.NAVIGATION_TO_POS_ORDER_DETAIL_SCREEN,
                    params,
                }),
        // @cart
        CART_ROUTE: () =>
            navigation.navigate(Routes.NAVIGATION_CART_STACK, {
                screens: Routes.NAVIGATION_TO_CART_SCREEN,
            }),

        //support
        LIST_MEDIA_ROUTE: (params: RootStackParamsList['MediaScreen']) => () =>
            navigation.navigate(Routes.NAVIGATION_TO_MEDIA_SCREEN, params),
        VIDEO_FULL_SCREEN_ROUTE: (params: RootStackParamsList['VideoFullScreen']) => () =>
            navigation.navigate(Routes.NAVIGATION_TO_VIDEO_FULL_SCREEN, params),
        WEBVIEW_SCREEN_ROUTE: (params: RootStackParamsList['WebViewScreen']) => () =>
            navigation.navigate(Routes.NAVIGATE_TO_WEBVIEW_SCREEN, params),
        GO_BACK_ROUTE: () => navigation.goBack(),
    };
}
