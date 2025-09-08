import { createStackNavigator } from '@react-navigation/stack';
import Login from 'authentications/Login';
import Register from 'authentications/Register';
import { Routes } from 'const/index';
import React from 'react';
import { AuthStackParamsList } from '../type';

const Stack = createStackNavigator<AuthStackParamsList>();

export default function AuthStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={Routes.NAVIGATION_TO_LOGIN_SCREEN}
                component={Login}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name={Routes.NAVIGATION_TO_REGISTER_SCREEN}
                component={Register}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}
