/* eslint-disable react/no-unstable-nested-components */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'hooks';
import { forEach } from 'lodash';
import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { themeType } from 'theme';
import { AppTabParamsList, RootStackParamsList } from '../type';
import { NavigatorConfigType, navigatorConfig } from './config';
//RootStack

const RootStackNavigator = memo(() => {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles(theme);
    //value
    const RootStack = createStackNavigator<RootStackParamsList>();
    const Tab = createBottomTabNavigator<AppTabParamsList>();
    let listNavigator: React.ReactNode[] = [];
    //create app navigator
    const createAppNavigator = (
        config: Array<NavigatorConfigType>,
        parent?: 'tab' | 'stack' | 'drawer'
    ) => {
        let localListNavigator: React.ReactNode[] = [];
        forEach(config, (value, index) => {
            // tab
            if (value.type === 'tab') {
                const children = createAppNavigator(value?.child || [], 'tab');
                const TabNav = () => (
                    <Tab.Navigator
                        screenOptions={{
                            tabBarStyle: styles.tabBar_style,
                            tabBarActiveTintColor: theme.colors.main['600'],
                            tabBarInactiveTintColor: theme.colors.grey_[500],
                            tabBarShowLabel: false,
                            headerShown: false,
                            freezeOnBlur: true,
                        }}
                        backBehavior="history"
                    >
                        {children}
                    </Tab.Navigator>
                );
                //đưa tab vào root stack
                listNavigator.push(
                    <RootStack.Screen
                        name={value.name}
                        component={TabNav}
                        options={{
                            headerShown: false,
                        }}
                        key={index}
                    />
                );
            } else {
                //stack and screen
                // lưu ý mốt cần xử lý lại phần này: set type cho từng createStack chứ không để kiểu any
                const Stack = createStackNavigator<any>();
                const Drawer = createDrawerNavigator<any>();
                // stack
                if (value.type === 'stack') {
                    const children = createAppNavigator(value?.child || [], 'stack');
                    const StackNav = () => <Stack.Navigator>{children}</Stack.Navigator>;

                    if (parent === 'tab') {
                        //stack is a child of tab
                        localListNavigator.push(
                            <Tab.Screen
                                name={value.name}
                                component={StackNav}
                                key={index}
                                options={value.bottomOptions}
                            />
                        );
                    } else if (parent === 'stack') {
                        //stack is a child of stack
                        // do đây là stack con nên xử lỹ xong sẽ trả về cho stack cha nên cần đưa vào screen để stack cha hiển thị
                        localListNavigator.push(
                            <Stack.Screen
                                name={value.name}
                                key={index}
                                component={StackNav}
                                options={{
                                    headerShown: false,
                                }}
                            />
                        );
                    } else {
                        //root stack
                        listNavigator.push(
                            <RootStack.Screen
                                name={value.name}
                                component={StackNav}
                                options={{
                                    headerShown: false,
                                }}
                                key={index}
                            />
                        );
                    }
                }
                //drawer
                if (value.type === 'drawer') {
                    const children = createAppNavigator(value?.child || [], 'drawer');
                    const DrawerNav = () => (
                        <Drawer.Navigator
                            screenOptions={{
                                headerShown: false,
                                drawerStyle: { width: theme.dimens.scale(270) },
                                ...(value.drawerOption || {}),
                            }}
                            drawerContent={value.drawerContent}
                            backBehavior="history"
                        >
                            {children}
                        </Drawer.Navigator>
                    );
                    if (parent === 'tab') {
                        //stack is a child of tab
                        localListNavigator.push(
                            <Tab.Screen
                                name={value.name}
                                component={DrawerNav}
                                key={index}
                                options={value.bottomOptions}
                            />
                        );
                    } else if (parent === 'stack') {
                        //stack is a child of stack
                        // do đây là stack con nên xử lỹ xong sẽ trả về cho stack cha nên cần đưa vào screen để stack cha hiển thị
                        localListNavigator.push(
                            <Stack.Screen
                                name={value.name}
                                key={index}
                                component={DrawerNav}
                                options={{
                                    headerShown: false,
                                }}
                            />
                        );
                    } else {
                        //root stack
                        listNavigator.push(
                            <RootStack.Screen
                                name={value.name}
                                component={DrawerNav}
                                options={{
                                    headerShown: false,
                                }}
                                key={index}
                            />
                        );
                    }
                }
                // screen - nếu tồn tại app_link(có component) mới tạo screen
                if (value.type === 'screen' && value.component) {
                    //Screen is a child of stack or tab
                    if (parent === 'stack') {
                        localListNavigator.push(
                            <Stack.Screen
                                name={value.name}
                                component={value.component}
                                options={{
                                    headerShown: false,
                                }}
                                key={index}
                            />
                        );
                    } else if (parent === 'tab') {
                        localListNavigator.push(
                            <Tab.Screen
                                name={value.name}
                                component={value.component}
                                options={value.bottomOptions}
                                key={index}
                            />
                        );
                    } else if (parent === 'drawer') {
                        localListNavigator.push(
                            <Drawer.Screen
                                name={value.name}
                                component={value.component}
                                key={index}
                            />
                        );
                    } else {
                        //screen root stack
                        listNavigator.push(
                            <RootStack.Screen
                                name={value.name}
                                component={value.component}
                                options={{
                                    headerShown: false,
                                    ...value.stackOptions,
                                }}
                                key={index}
                            />
                        );
                    }
                }
            }
        });
        if (parent) {
            return localListNavigator;
        }
        return listNavigator;
    };
    return (
        <RootStack.Navigator screenOptions={{ freezeOnBlur: true }}>
            {createAppNavigator(navigatorConfig)}
        </RootStack.Navigator>
    );
});

const useStyles = (theme: themeType) => {
    return StyleSheet.create({
        tabBar_style: {
            borderTopWidth: 1,
            borderTopColor: theme.colors.grey_[200],
            // backgroundColor: 'red',
            // height: theme.dimens.verticalScale(45) + insets.bottom / 3,
            minHeight: theme.dimens.verticalScale(50),
            // paddingBottom: 0,
            // paddingTop: insets.bottom / 3,
            // paddingTop: 0,
            // margin: 0,
            paddingBottom: 0,
        },
        view_iconStyle: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        ripple_buttonTabStyle: {
            flex: 1,
            paddingLeft: theme.spacings.tiny,
            paddingRight: theme.spacings.tiny,
        },
    });
};

export default RootStackNavigator;
