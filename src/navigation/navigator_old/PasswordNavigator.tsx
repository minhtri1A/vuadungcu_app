import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from 'const/index';
import React from 'react';
import ForgotPasswordScreen from 'screens/forgotpassword';
import ResetPasswordScreen from 'screens/forgotpassword/screen/ResetPassword';
import { PasswordStackParamsList } from '../type';

const Stack = createStackNavigator<PasswordStackParamsList>();

export default function PasswordStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={Routes.NAVIGATION_TO_FORGOT_PASSWORD_SCREEN}
                component={ForgotPasswordScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name={Routes.NAVIGATION_TO_RESET_PASSWORD_SCREEN}
                component={ResetPasswordScreen}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}
