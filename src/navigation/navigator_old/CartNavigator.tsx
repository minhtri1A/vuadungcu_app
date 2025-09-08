import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from 'const/index';
import { CartStackParamsList } from 'navigation/type';
import React from 'react';
import CartScreen from 'screens/cart/ui1';
import CheckoutScreen from 'screens/checkout/ui2';
import OrderSuccessScreen from 'screens/ordersuccess';

const Stack = createStackNavigator<CartStackParamsList>();

export default function CartStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={Routes.NAVIGATION_TO_CART_SCREEN}
                component={CartScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name={Routes.NAVIGATION_TO_CHECKOUT_SCREEN}
                component={CheckoutScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name={Routes.NAVIGATION_TO_ORDER_SUCCESS_SCREEN}
                component={OrderSuccessScreen}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}
