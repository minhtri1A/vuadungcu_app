/* eslint-disable react-hooks/exhaustive-deps */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Routes } from 'const/index';
import { useIsLogin, useNavigation } from 'hooks';
import React, { useLayoutEffect, useState } from 'react';

/*
 * CheckLogin = true -> kiểm tra đăng nhập
 * ---------- = false -> Kiểm tra đăng xuất
 */
export default function withAuth(
    WrapComponent: React.FC | React.NamedExoticComponent<any>,
    CheckLogin: boolean
) {
    return ({ ...props }) => {
        const isLogin = useIsLogin();
        const [isEffect, setIsEffect] = useState(false);
        const navigation = useNavigation();

        useLayoutEffect(() => {
            //kiểm tra đăng nhập - nếu chưa đăng nhập trở về home
            if (CheckLogin && !isLogin) {
                const currentRoute = navigation?.getState().routes;
                const parentRoute = navigation.getParent()?.getState().routes;
                const routes = parentRoute || currentRoute;

                if (routes && routes?.length > 0) {
                    const currentStack = routes[routes?.length - 1];
                    const screen = currentStack?.name;
                    const params = currentStack?.params;
                    AsyncStorage.setItem(
                        'redirect-login-value',
                        JSON.stringify({
                            screen,
                            params,
                        })
                    );
                }

                navigation.replace(Routes.NAVIGATION_AUTH_STACK, {
                    screen: Routes.NAVIGATION_TO_LOGIN_SCREEN,
                });
                return;
            }
            //kiểm tra đăng xuất - nếu đang đăng nhập thì không cho vào (login, register screen)
            if (!CheckLogin && isLogin) {
                (async () => {
                    // check goback previous screen
                    const redirectLoginValueLocal = await AsyncStorage.getItem(
                        'redirect-login-value'
                    );
                    if (redirectLoginValueLocal) {
                        const redirectLoginSuccessValue = JSON.parse(
                            redirectLoginValueLocal || '{}'
                        );
                        AsyncStorage.removeItem('redirect-login-value');
                        navigation.replace(
                            redirectLoginSuccessValue?.screen,
                            redirectLoginSuccessValue?.params
                        );
                        return;
                    }
                    // goback
                    navigation.goBack();
                })();

                return;
            }
            setIsEffect(true);
        }, [isLogin]);
        return isEffect ? <WrapComponent {...props} /> : null;
    };
}
