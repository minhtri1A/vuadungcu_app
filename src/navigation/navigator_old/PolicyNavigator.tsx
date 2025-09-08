import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from 'const/index';
import { PolicyStackParamsList } from 'navigation/type';
import React from 'react';
import PolicyScreen from 'screens/policy';
import PolicyDetail from 'screens/policy/screen/PolicyDetail';

const Stack = createStackNavigator<PolicyStackParamsList>();

export default function PolicyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={Routes.NAVIGATION_TO_POLICY_SCREEN}
                component={PolicyScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name={Routes.NAVIGATION_TO_POLICY_DETAIL_SCREEN}
                component={PolicyDetail}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}
