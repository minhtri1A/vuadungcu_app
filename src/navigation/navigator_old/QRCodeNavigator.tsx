import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from 'const/index';
import React from 'react';
import QRCodeScreen from 'screens/qrcode';
import { QRCodeStackParamsList } from '../type';

const Stack = createStackNavigator<QRCodeStackParamsList>();

export default function QRCodeStack() {
    return (
        <Stack.Navigator
        // headerMode='none'
        >
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
