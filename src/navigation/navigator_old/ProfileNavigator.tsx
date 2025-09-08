import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from 'const/index';
import React from 'react';
import ProfileScreen from 'screens/profile';

const Stack = createStackNavigator();

export default function ProfileStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={Routes.NAVIGATION_TO_PROFILE_SCREEN}
                component={ProfileScreen}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}
