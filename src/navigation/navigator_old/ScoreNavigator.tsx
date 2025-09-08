import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from 'const/index';
import { EventStackParamsList } from 'navigation/type';
import React from 'react';
import EventScreen from 'screens/event';
import EventDetail from 'screens/event/screen/EventDetail';

const Stack = createStackNavigator<EventStackParamsList>();

export default function EventStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={Routes.NAVIGATION_TO_EVENT_SCREEN}
                component={EventScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name={Routes.NAVIGATION_TO_EVENT_DETAIL_SCREEN}
                component={EventDetail}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}
