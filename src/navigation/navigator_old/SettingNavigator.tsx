import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from 'const/index';
import { SettingStackParamsList } from 'navigation/type';
import React from 'react';
import SettingScreen from 'screens/setting';
import DeleteAccountScreen from 'screens/setting/screen/DeleteAccount';
import DeleteAccountConfirm from 'screens/setting/screen/DeleteAccountConfirm';
import IntroductionScreen from 'screens/setting/screen/Introduction';
import SocialScreen from 'screens/social';
import PolicyStack from './PolicyNavigator';

const Stack = createStackNavigator<SettingStackParamsList>();

export default function SettingStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={Routes.NAVIGATION_SETTING_SCREEN}
                component={SettingScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name={Routes.NAVIGATION_SOCIAL_LINK_SCREEN}
                component={SocialScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name={Routes.NAVIGATION_SETTING_INTRODUCTION_SCREEN}
                component={IntroductionScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name={Routes.NAVIGATION_DELETE_ACCOUNT_SCREEN}
                component={DeleteAccountScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name={Routes.NAVIGATION_DELETE_ACCOUNT_CONFIRM_SCREEN}
                component={DeleteAccountConfirm}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name={Routes.NAVIGATION_TO_POLICY_STACK}
                component={PolicyStack}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}
