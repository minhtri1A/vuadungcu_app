import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from 'const/index';
import React from 'react';
import ProductScreen from 'screens/products';
import { ProductStackParamsList } from '../type';

const Stack = createStackNavigator<ProductStackParamsList>();

export default function ProductStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={Routes.NAVIGATION_TO_PRODUCT_DRAWER}
                component={ProductScreen}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}
