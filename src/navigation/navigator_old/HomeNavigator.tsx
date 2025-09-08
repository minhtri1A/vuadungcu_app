import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from 'const/index';
import React from 'react';
import HomeScreen from 'screens/home/ui_1';
import { HomeStackParamsList } from '../type';

const Stack = createStackNavigator<HomeStackParamsList>();

export default function HomeStack() {
    return (
        <Stack.Navigator
        // headerMode='none'
        // initialRouteName={Routes.NAVIGATION_TO_HOME_SCREEN}
        >
            {/* <Stack.Screen
                name={'NotifyScreen'}
                component={NotifyScreen}
                options={{
                    headerShown: false,
                }}
            /> */}
            <Stack.Screen
                name={Routes.NAVIGATION_TO_HOME_SCREEN}
                component={HomeScreen}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}
