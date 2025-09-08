import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Image from 'components/Image';
import Text from 'components/Text';
import { Routes } from 'const/index';
import { useTheme } from 'hooks';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import Icon from 'react-native-vector-icons/Ionicons';
import ProductDetailScreen from 'screens/productdetail';
import QRCodeScreen from 'screens/qrcode';
import SearchScreen from 'screens/search';
import { themeType } from 'theme';
import { AppTabParamsList, RootStackParamsList } from '../type';
import AccountStack from './AccountNavigator';
import AddressStack from './AddressNavigator';
import AuthStack from './AuthNavigator';
import CartStack from './CartNavigator';
import HomeStack from './HomeNavigator';
import OrdersStack from './OrdersNavigator';
import PasswordStack from './PasswordNavigator';
import ProductStack from './ProductNavigator';
import ProfileStack from './ProfileNavigator';
import QRCodeStack from './QRCodeNavigator';
import EventStack from './ScoreNavigator';
import SettingStack from './SettingNavigator';
import WarrantyStack from './WarrantyNavigator';

const Tab = createBottomTabNavigator<AppTabParamsList>();
const Stack = createStackNavigator<RootStackParamsList>();

const AppTab = () => {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    // const bs = theme.typography.bodyStyle(theme);
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: styles.tabBar_style,
                tabBarActiveTintColor: theme.colors.main['600'],
                tabBarInactiveTintColor: theme.colors.grey_[500],
                tabBarShowLabel: false,
                headerShown: false,
            }}
            backBehavior="history"
        >
            {/* home */}
            <Tab.Screen
                name={Routes.NAVIGATION_HOME_STACK}
                component={HomeStack}
                // options={({ navigation }) => ({
                //     tabBarIcon: ({ color }) => {
                //         const nameIcon = navigation.isFocused() ? 'home' : 'home-outline';
                //         return (
                //             <Icon name={nameIcon} size={theme.typography.size(21)} color={color} />
                //         );
                //     },
                //     tabBarLabel: 'Trang Chủ',
                // })}
                options={{
                    tabBarIcon: ({ color, focused }) => {
                        const nameIcon = focused ? 'home' : 'home-outline';
                        return (
                            <View style={styles.view_iconStyle}>
                                <Icon
                                    name={nameIcon}
                                    size={theme.typography.size(18)}
                                    color={color}
                                />
                                {/* <IconsCustom
                                    name="logo-ntl"
                                    size={theme.typography.size(17)}
                                    color={color}
                                /> */}
                                <Text
                                    style={{ color }}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    adjustsFontSizeToFit={true}
                                >
                                    Trang chủ
                                </Text>
                            </View>
                        );
                    },
                    tabBarButton: ({ children, onPress }) => (
                        <Ripple onPress={onPress} style={styles.ripple_buttonTabStyle}>
                            {children}
                        </Ripple>
                    ),
                }}
            />
            {/* product */}
            <Tab.Screen
                name={Routes.NAVIGATION_PRODUCT_STACK}
                component={ProductStack}
                options={{
                    tabBarIcon: ({ color, focused }) => {
                        const nameIcon = focused ? 'basket' : 'basket-outline';
                        return (
                            // <Icon name={nameIcon} size={theme.typography.size(21)} color={color} />
                            <View style={styles.view_iconStyle}>
                                <Icon
                                    name={nameIcon}
                                    size={theme.typography.size(18)}
                                    color={color}
                                />

                                <Text
                                    style={{ color }}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    adjustsFontSizeToFit={true}
                                >
                                    Sản phẩm
                                </Text>
                            </View>
                        );
                    },
                    tabBarButton: ({ children, onPress }) => (
                        <Ripple onPress={onPress} style={styles.ripple_buttonTabStyle}>
                            {children}
                        </Ripple>
                    ),
                }}
            />
            {/* qr */}
            <Tab.Screen
                name={Routes.NAVIGATION_QR_CODE_STACK}
                component={QRCodeStack}
                options={{
                    tabBarIcon: ({}) => {
                        return (
                            <View style={{}}>
                                <Image source={require('asset/img-qr-gif-4.gif')} w={45} h={45} />
                            </View>
                        );
                    },
                    tabBarButton: ({ children, onPress }) => (
                        <Ripple onPress={onPress} style={styles.ripple_buttonTabStyle}>
                            {children}
                        </Ripple>
                    ),
                    tabBarStyle: { display: 'none' },
                    unmountOnBlur: true,
                }}
            />
            {/* search */}
            <Tab.Screen
                name={Routes.NAVIGATION_TO_SEARCH_SCREEN}
                component={SearchScreen}
                options={{
                    tabBarIcon: ({ color }) => {
                        return (
                            // <Icon name={nameIcon} size={theme.typography.size(21)} color={color} />
                            <View style={styles.view_iconStyle}>
                                <Icon
                                    name={'search'}
                                    size={theme.typography.size(18)}
                                    color={color}
                                />

                                <Text
                                    style={{ color }}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    adjustsFontSizeToFit={true}
                                >
                                    Tìm Kiếm
                                </Text>
                            </View>
                        );
                    },
                    tabBarButton: ({ children, onPress }) => (
                        <Ripple onPress={onPress} style={styles.ripple_buttonTabStyle}>
                            {children}
                        </Ripple>
                    ),
                }}
            />
            {/* profile */}
            <Tab.Screen
                name={Routes.NAVIGATION_PROFILE_STACK}
                component={ProfileStack}
                options={{
                    tabBarIcon: ({ color, focused }) => {
                        const nameIcon = focused ? 'person' : 'person-outline';
                        return (
                            // <Icon name={nameIcon} size={theme.typography.size(21)} color={color} />
                            <View style={styles.view_iconStyle}>
                                <Icon
                                    name={nameIcon}
                                    size={theme.typography.size(18)}
                                    color={color}
                                />

                                <Text
                                    style={{ color }}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    adjustsFontSizeToFit={true}
                                >
                                    Cá nhân
                                </Text>
                            </View>
                        );
                    },
                    tabBarButton: ({ children, onPress }) => (
                        <Ripple onPress={onPress} style={styles.ripple_buttonTabStyle}>
                            {children}
                        </Ripple>
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default function RootStack() {
    return (
        <Stack.Navigator>
            {/* app */}
            <Stack.Screen
                name={Routes.NAVIGATION_TAB_NAV}
                component={AppTab}
                options={{
                    headerShown: false,
                }}
            />
            {/* auth */}
            <Stack.Screen
                name={Routes.NAVIGATION_AUTH_STACK}
                component={AuthStack}
                options={{
                    headerShown: false,
                }}
            />
            {/* account */}
            <Stack.Screen
                name={Routes.NAVIGATION_ACCOUNT_STACK}
                component={AccountStack}
                options={{
                    headerShown: false,
                }}
            />
            {/* address */}
            <Stack.Screen
                name={Routes.NAVIGATION_ADDRESS_STACK}
                component={AddressStack}
                options={{
                    headerShown: false,
                }}
            />
            {/* cart */}
            <Stack.Screen
                name={Routes.NAVIGATION_CART_STACK}
                component={CartStack}
                options={{
                    headerShown: false,
                }}
            />
            {/* setting */}
            <Stack.Screen
                name={Routes.NAVIGATION_SETTING_STACK}
                component={SettingStack}
                options={{
                    headerShown: false,
                }}
            />
            {/* password */}
            <Stack.Screen
                name={Routes.NAVIGATION_TO_FORGOT_PASSWORD_STACK}
                component={PasswordStack}
                options={{
                    headerShown: false,
                }}
            />
            {/* order */}
            <Stack.Screen
                name={Routes.NAVIGATION_ORDERS_STACK}
                component={OrdersStack}
                options={{
                    headerShown: false,
                }}
            />
            {/* score */}
            <Stack.Screen
                name={Routes.NAVIGATION_TO_EVENT_STACK}
                component={EventStack}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name={Routes.NAVIGATION_TO_WARRANTY_STACK}
                component={WarrantyStack}
                options={{
                    headerShown: false,
                }}
            />
            {/* product detail */}
            <Stack.Screen
                name={Routes.NAVIGATION_TO_PRODUCT_DETAIL_SCREEN}
                component={ProductDetailScreen}
                options={{
                    headerShown: false,
                }}
            />
            {/* qr */}
            <Stack.Screen
                name={Routes.NAVIGATION_TO_QRCODE_SCREEN}
                component={QRCodeScreen}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        tabBar_style: {
            // backgroundColor: theme.colors.red,
            borderTopWidth: 1,
            borderTopColor: theme.colors.grey_[200],
        },
        view_iconStyle: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        ripple_buttonTabStyle: {
            flex: 1,
            paddingLeft: theme.spacings.tiny,
            paddingRight: theme.spacings.tiny,
        },
    });

// export const navigatorConfig: Array<NavigatorConfigType> = [
//     // tabs
//     {
//         type: 'tab',
//         name: Routes.NAVIGATION_TAB_NAV,
//         child: [
//             // home tab
//             {
//                 type: 'stack',
//                 name: Routes.NAVIGATION_HOME_STACK,
//                 child: [
//                     {
//                         type: 'screen',
//                         name: Routes.NAVIGATION_TO_HOME_SCREEN,
//                         component: HomeScreen,
//                         link: 'home',
//                     },
//                 ],
//             },
//             // product tab
//             {
//                 type: 'stack',
//                 name: Routes.NAVIGATION_PRODUCT_STACK,
//                 child: [
//                     {
//                         type: 'screen',
//                         name: Routes.NAVIGATION_TO_PRODUCT_DRAWER,
//                         component: ProductScreen,
//                         link: 'product',
//                     },
//                 ],
//             },
//             // qrcode tab
//             {
//                 type: 'stack',
//                 name: Routes.NAVIGATION_QR_CODE_STACK,
//                 child: [
//                     {
//                         type: 'screen',
//                         name: Routes.NAVIGATION_TO_QRCODE_SCREEN,
//                         component: QRCodeScreen,
//                         link: 'qrcode',
//                     },
//                 ],
//             },
//             // search tab
//             {
//                 type: 'screen',
//                 name: Routes.NAVIGATION_TO_SEARCH_SCREEN,
//                 component: SearchScreen,
//                 link: 'search',
//             },
//             //profile tab
//             {
//                 type: 'stack',
//                 name: Routes.NAVIGATION_PROFILE_STACK,
//                 child: [
//                     {
//                         type: 'screen',
//                         name: Routes.NAVIGATION_TO_PROFILE_SCREEN,
//                         component: ProfileScreen,
//                         link: 'profile',
//                     },
//                 ],
//             },
//         ],
//     },
//     // auth stack
//     {
//         type: 'stack',
//         name: Routes.NAVIGATION_AUTH_STACK,
//         child: [
//             {
//                 type: 'screen',
//                 name: Routes.NAVIGATION_TO_LOGIN_SCREEN,
//                 component: Login,
//                 link: 'auth/login',
//             },
//             {
//                 type: 'screen',
//                 name: Routes.NAVIGATION_TO_REGISTER_SCREEN,
//                 component: Register,
//                 link: 'auth/register',
//             },
//         ],
//     },
//     //account stack
//     {
//         type: 'stack',
//         name: Routes.NAVIGATION_ACCOUNT_STACK,
//         child: [
//             {
//                 type: 'screen',
//                 name: Routes.NAVIGATION_ACCOUNT_SCREEN,
//                 component: AccountScreen,
//                 link: 'screens/account/account',
//             },
//             {
//                 type: 'screen',
//                 name: Routes.NAVIGATION_EDIT_VERIFY_SCREEN,
//                 component: EditVerifyScreen,
//                 link: 'account/verify',
//             },
//             {
//                 type: 'screen',
//                 name: Routes.NAVIGATION_TO_EDIT_PASSWORD_SCREEN,
//                 component: EditPasswordScreen,
//                 link: 'account/password-edit',
//             },
//         ],
//     },
//     // address stack
//     {
//         type: 'stack',
//         name: Routes.NAVIGATION_ADDRESS_STACK,
//         child: [
//             {
//                 type: 'screen',
//                 name: Routes.NAVIGATION_TO_ADDRESS_SCREEN,
//                 component: AddressScreen,
//                 link: 'screens/address/address',
//             },
//             {
//                 type: 'screen',
//                 name: Routes.NAVIGATION_TO_ADDRESS_FORM_SCREEN,
//                 component: AddressForm,
//                 link: 'address/form',
//             },
//             {
//                 type: 'screen',
//                 name: Routes.NAVIGATION_TO_ADDRESS_FORM_LOCATION_SCREEN,
//                 component: AddressFormLocation,
//                 link: 'address/location',
//             },
//         ],
//     },
//     // cart stack
//     {
//         type: 'stack',
//         name: Routes.NAVIGATION_CART_STACK,
//         child: [
//             {
//                 type: 'screen',
//                 name: Routes.NAVIGATION_TO_CART_SCREEN,
//                 component: CartScreen,
//                 link: 'cart/cart',
//             },
//             {
//                 type: 'screen',
//                 name: Routes.NAVIGATION_TO_CHECKOUT_SCREEN,
//                 component: CheckoutScreen,
//                 link: 'cart/checkout',
//             },
//             {
//                 type: 'screen',
//                 name: Routes.NAVIGATION_TO_ORDER_SUCCESS_SCREEN,
//                 component: OrderSuccessScreen,
//                 link: 'cart/success',
//             },
//         ],
//     },
//     // setting stack
//     {
//         type: 'stack',
//         name: Routes.NAVIGATION_SETTING_STACK,
//         child: [
//             {
//                 type: 'screen',
//                 name: Routes.NAVIGATION_SETTING_SCREEN,
//                 component: SettingScreen,
//                 link: 'setting/setting',
//             },
//             {
//                 type: 'screen',
//                 name: Routes.NAVIGATION_SOCIAL_LINK_SCREEN,
//                 component: SocialScreen,
//                 link: 'setting/social-link',
//             },
//             {
//                 type: 'screen',
//                 name: Routes.NAVIGATION_SETTING_INTRODUCTION_SCREEN,
//                 component: IntroductionScreen,
//                 link: 'setting/introduction',
//             },
//             {
//                 type: 'screen',
//                 name: Routes.NAVIGATION_DELETE_ACCOUNT_SCREEN,
//                 component: DeleteAccountScreen,
//                 link: 'setting/delete',
//             },
//             {
//                 type: 'screen',
//                 name: Routes.NAVIGATION_DELETE_ACCOUNT_CONFIRM_SCREEN,
//                 component: DeleteAccountConfirm,
//                 link: 'setting/delete-confirm',
//             },
//             {
//                 type: 'stack',
//                 name: Routes.NAVIGATION_TO_POLICY_STACK,
//                 child: [
//                     {
//                         type: 'screen',
//                         name: Routes.NAVIGATION_TO_POLICY_SCREEN,
//                         component: PolicyScreen,
//                         link: 'policy/policy',
//                     },
//                     {
//                         type: 'screen',
//                         name: Routes.NAVIGATION_TO_POLICY_DETAIL_SCREEN,
//                         component: PolicyDetail,
//                         link: 'policy/detail/:uuid',
//                     },
//                 ],
//             },
//         ],
//     },
//     //forgot password stack
//     {
//         type: 'stack',
//         name: Routes.NAVIGATION_TO_FORGOT_PASSWORD_STACK,
//         child: [
//             {
//                 type: 'screen',
//                 name: Routes.NAVIGATION_TO_FORGOT_PASSWORD_SCREEN,
//                 component: ForgotPasswordScreen,
//                 link: 'forgot/forgot',
//             },
//             {
//                 type: 'screen',
//                 name: Routes.NAVIGATION_TO_RESET_PASSWORD_SCREEN,
//                 component: ResetPasswordScreen,
//                 link: 'forgot/reset',
//             },
//         ],
//     },
//     // order stack
//     {
//         type: 'stack',
//         name: Routes.NAVIGATION_ORDERS_STACK,
//         child: [
//             {
//                 type: 'screen',
//                 name: Routes.NAVIGATION_ORDERS_SCREEN,
//                 component: OrdersScreen,
//                 link: 'order/order',
//             },
//             {
//                 type: 'screen',
//                 name: Routes.NAVIGATION_ORDERS_DETAIL_SCREEN,
//                 component: OrdersDetail,
//                 link: 'order/detail/:uuid',
//             },
//             {
//                 type: 'screen',
//                 name: Routes.NAVIGATION_ORDERS_SHIPPING_SCREEN,
//                 component: OrdersShipping,
//                 link: 'order/shipping',
//             },
//         ],
//     },
//     //score stack
//     {
//         type: 'stack',
//         name: Routes.NAVIGATION_TO_EVENT_STACK,
//         child: [
//             {
//                 type: 'screen',
//                 name: Routes.NAVIGATION_TO_EVENT_SCREEN,
//                 component: EventScreen,
//                 link: 'score/score',
//             },
//             {
//                 type: 'screen',
//                 name: Routes.NAVIGATION_TO_EVENT_DETAIL_SCREEN,
//                 component: EventDetail,
//                 link: 'score/detail/:uuid',
//             },
//         ],
//     },
//     //warranty stack
//     {
//         type: 'stack',
//         name: Routes.NAVIGATION_TO_WARRANTY_STACK,
//         child: [
//             {
//                 type: 'screen',
//                 name: Routes.NAVIGATION_TO_WARRANTY_SCREEN,
//                 component: WarrantyScreen,
//                 link: 'warranty/warranty',
//             },
//             {
//                 type: 'screen',
//                 name: Routes.NAVIGATION_TO_WARRANTY_DETAIL_SCREEN,
//                 component: WarrantyDetail,
//                 link: 'warranty/detail/:warranty_uuid',
//             },
//         ],
//     },
//     // product detail screen
//     {
//         type: 'screen',
//         name: Routes.NAVIGATION_TO_PRODUCT_DETAIL_SCREEN,
//         component: ProductDetailScreen,
//         link: 'detail/:uuid',
//     },
//     //qrcode screen
//     {
//         type: 'screen',
//         name: Routes.NAVIGATION_TO_QRCODE_SCREEN,
//         component: QRCodeScreen,
//         link: 'qrcode',
//     },
// ];
