/* eslint-disable react-native/no-inline-styles */
import notifee, { EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@rneui/themed';
import * as Sentry from '@sentry/react-native';
import LoadingApp from 'components/LoadingApp';
import { SENTRY_KEY } from 'const/keysConfig';
import { SocketProvider } from 'context/SocketContext';
import { SET_CONNECTED_INTERNET } from 'features/action';
import linking from 'navigation/linking';
import RootStackNavigator from 'navigation/navigator/RootStackNavigator';
import React, { useEffect } from 'react';
import { ActivityIndicator, Linking, Platform, StatusBar, useColorScheme } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import Config from 'react-native-config';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setCustomText } from 'react-native-global-props';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SWRConfig } from 'swr';
import theme from 'theme';
import { sendSentryError } from 'utils/storeHelpers';
import { navigationRef } from './navigation/RootNavigation';
import { onAppStart } from './utils/onAppStart';
import { persistor, store } from 'app/store';

/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

Sentry.init({
    dsn: SENTRY_KEY,
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production.
    tracesSampleRate: 0.5,
    // environment: 'development',
});

const App = () => {
    const scheme = useColorScheme();
    console.log('scheme ', scheme);

    //set font app
    const customTextProps = {
        style: {
            fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'Roboto',
        },
    };

    //start app
    useEffect(() => {
        (async () => {
            //initial start - loading api and token

            await onAppStart(store);
            // config app
            setCustomText(customTextProps);
            console.log('check config env ', Config.REACT_NATIVE_APP_IS_MODE);
            // set sentry user
            try {
                const currentCustomerLocal = await AsyncStorage.getItem('@current-customer');
                const customer = currentCustomerLocal ? JSON.parse(currentCustomerLocal) : null;
                Sentry.setUser(
                    customer
                        ? {
                              fullname: `${customer?.firstname} ${customer?.lastname}`,
                              telephone: customer?.telephone || '',
                              username: customer?.username,
                          }
                        : {
                              username: 'Guest user',
                          }
                );
            } catch (error) {
                sendSentryError(error, 'App set sentry user');
            }
        })();
    }, []);

    //handle click notify foreground
    useEffect(() => {
        try {
            const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
                switch (type) {
                    case EventType.DISMISSED:
                        break;
                    case EventType.PRESS:
                        const data = detail.notification?.data;
                        const { app_link, web_link }: any = data || {};
                        if (app_link || web_link) {
                            const web_url =
                                Config.REACT_NATIVE_APP_IS_MODE === 'dev'
                                    ? Config.REACT_NATIVE_APP_WEB_URL_DEV
                                    : Config.REACT_NATIVE_APP_WEB_URL_PRO;
                            const app_scheme = Config.REACT_NATIVE_APP_APP_SCHEME;

                            const link =
                                app_link === web_link //external link
                                    ? web_link
                                    : app_link
                                    ? `${app_scheme}${app_link}` //applink
                                    : `${web_url}${web_link}`; //vdc web link

                            //check neu la lien ket ngoai thi mo bang webview
                            if (app_link === web_link) {
                                Linking.openURL(
                                    `${app_scheme}webview/${link.replace(/^https?:\/\//, '')}`
                                );
                            } else {
                                Linking.openURL(link);
                            }
                        }
                        break;
                    case EventType.ACTION_PRESS:
                        break;
                }
            });
            return () => unsubscribe();
        } catch (error) {
            sendSentryError(error, 'Effect in App(click notify)');
        }
    });

    console.log('hihihihi', SENTRY_KEY);
    return (
        <SafeAreaProvider>
            <StatusBar backgroundColor="transparent" />
            <FlashMessage
                position="top"
                statusBarHeight={StatusBar.currentHeight}
                style={{
                    zIndex: 1000,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    // alignItems: 'center',
                }}
                duration={3000}
            />
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <GestureHandlerRootView>
                        <PersistGate
                            loading={<ActivityIndicator size="small" />}
                            persistor={persistor}
                        >
                            <SWRConfig
                                value={{
                                    provider: () => new Map(),
                                    initReconnect(reValidation) {
                                        const unsubscribe = NetInfo.addEventListener(
                                            async (state) => {
                                                const isInternet =
                                                    store?.getState().apps.isConnectedInternet;
                                                if (state.isConnected && !isInternet) {
                                                    //check start app
                                                    //mutate all
                                                    store.dispatch(SET_CONNECTED_INTERNET(true));
                                                    reValidation();
                                                    showMessage({
                                                        message: 'Đã khôi phục kết nối internet!',
                                                        icon: 'success',
                                                        duration: 3000,
                                                        position: 'bottom',
                                                    });
                                                }
                                                if (!state.isConnected) {
                                                    store.dispatch(SET_CONNECTED_INTERNET(false));
                                                    showMessage({
                                                        message: 'Không tìm thấy kết nối internet!',
                                                        icon: 'warning',
                                                        duration: 3000,
                                                        position: 'bottom',
                                                    });
                                                }
                                            }
                                        );
                                        return () => {
                                            unsubscribe();
                                        };
                                    },
                                    revalidateOnFocus: true,
                                    // shouldRetryOnError: false,
                                    dedupingInterval: 5000,

                                    onErrorRetry: (error, _, __, revalidate, { retryCount }) => {
                                        // console.log('retry swr global ', error);
                                        if (error?.status === 401) return; //loi lien quan user
                                        if (retryCount >= 4) return;
                                        const timeout = setTimeout(() => {
                                            revalidate({ retryCount });
                                            clearTimeout(timeout);
                                        }, 5000);
                                    },
                                }}
                            >
                                <NavigationContainer
                                    linking={linking}
                                    ref={navigationRef}
                                    onReady={() => {
                                        BootSplash.hide();
                                    }}
                                >
                                    <LoadingApp />
                                    {/* <RootStack /> */}
                                    <SocketProvider>
                                        <RootStackNavigator />
                                    </SocketProvider>
                                </NavigationContainer>
                            </SWRConfig>
                        </PersistGate>
                    </GestureHandlerRootView>
                </ThemeProvider>
            </Provider>
        </SafeAreaProvider>
    );
};

// let codePushOptions = {
//     checkFrequency: CodePush.CheckFrequency.MANUAL,
// };

// export default CodePush(codePushOptions)();
// export default CodePush(codePushOptions)(Sentry.wrap(App));
export default App;
