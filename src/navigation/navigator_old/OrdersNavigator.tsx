import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from 'const/index';
import { OrdersStackParamsList } from 'navigation/type';
import React from 'react';
import OrdersScreen from 'screens/orders';
import OrdersDetail from 'screens/orders/screen/OrdersDetail';
import OrdersShipping from 'screens/orders/screen/OrdersShipping';

const Stack = createStackNavigator<OrdersStackParamsList>();

export default function OrdersStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={Routes.NAVIGATION_ORDERS_SCREEN}
                component={OrdersScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name={Routes.NAVIGATION_ORDERS_DETAIL_SCREEN}
                component={OrdersDetail}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name={Routes.NAVIGATION_ORDERS_SHIPPING_SCREEN}
                component={OrdersShipping}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}
