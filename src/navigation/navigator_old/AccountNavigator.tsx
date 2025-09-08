import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from 'const/index';
import { AccountStackParamsList } from 'navigation/type';
import React from 'react';
import AccountScreen from 'screens/account';
import EditPasswordScreen from 'screens/account/screens/editpassword';
import EditVerifyScreen from 'screens/account/screens/editverify';

const Stack = createStackNavigator<AccountStackParamsList>();

export default function AccountStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={Routes.NAVIGATION_ACCOUNT_SCREEN}
                component={AccountScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name={Routes.NAVIGATION_EDIT_VERIFY_SCREEN}
                component={EditVerifyScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name={Routes.NAVIGATION_TO_EDIT_PASSWORD_SCREEN}
                component={EditPasswordScreen}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}
