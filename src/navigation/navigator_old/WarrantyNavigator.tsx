import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from 'const/index';
import { WarrantyStackParamsList } from 'navigation/type';
import React from 'react';
import WarrantyScreen from 'screens/warranty';
import WarrantyDetail from 'screens/warranty/screens/WarrantyDetail';

const Stack = createStackNavigator<WarrantyStackParamsList>();

export default function WarrantyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={Routes.NAVIGATION_TO_WARRANTY_SCREEN}
                component={WarrantyScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name={Routes.NAVIGATION_TO_WARRANTY_DETAIL_SCREEN}
                component={WarrantyDetail}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}
