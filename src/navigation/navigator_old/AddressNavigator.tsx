import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from 'const/index';
import { AddressStackParamsList } from 'navigation/type';
import React from 'react';
import AddressScreen from 'screens/address/ui1';
import AddressForm from 'screens/address/ui1/screens/AddressForm';
import AddressFormLocation from 'screens/address/ui1/screens/AddressFormLocation';

const Stack = createStackNavigator<AddressStackParamsList>();

export default function AddressStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={Routes.NAVIGATION_TO_ADDRESS_SCREEN}
                component={AddressScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name={Routes.NAVIGATION_TO_ADDRESS_FORM_SCREEN}
                component={AddressForm}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name={Routes.NAVIGATION_TO_ADDRESS_FORM_LOCATION_SCREEN}
                component={AddressFormLocation}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}
