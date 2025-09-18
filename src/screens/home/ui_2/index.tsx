import { useScrollToTop } from '@react-navigation/native';
import Disconnect from 'components/Disconnect';
import ListProductsWrapper from 'components/ListProductsWrapper';
import {
    useAppSelector,
    useInternet,
    usePreventAppExist,
    useProductSwrInfinity,
    useTheme,
} from 'hooks';
import React, { memo, useEffect, useRef } from 'react';
import { ActivityIndicator, Linking, ScrollView, StyleSheet } from 'react-native';
import { getParamsWithCustomUrl, isEmpty } from 'utils/helpers';
import { sendSentryError } from 'utils/storeHelpers';
import HomeBrand from './components/HomeBrand';
import HomeCategory from './components/HomeCategory';
import HomeHeader from './components/HomeHeader';
import HomeSales from './components/HomeSales';
import HomeTop from './components/HomeTop';
// import SwrCacheConfig from 'components/SwrCacheConfig';
import FocusAwareStatusBar from 'components/FocusAwareStatusBar';
import View from 'components/View';
import DeviceInfo from 'react-native-device-info';

/* eslint-disable react-hooks/exhaustive-deps */
// import useStyles from './styles';
// import { StackNavigationProp } from '@react-navigation/stack';
// interface Props {
//     navigation: StackNavigationProp<any, any>;
// }
import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { StackNavigationProp } from '@react-navigation/stack';
import AfterInteractions from 'components/AfterInteractions';
import BubbleWheel from 'components/BubbleWheel';
import Divider from 'components/Divider';
import SpinAttendanceModal from 'components/SpinAttendanceModal';
import Text from 'components/Text';
import { useRefreshControl } from 'hooks/useRefreshControl';
import Config from 'react-native-config';
import { requestNotifications } from 'react-native-permissions';
import { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { services } from 'services';
import HomeProductCategory from './components/HomeProductCategory';
import { getAnalytics, logEvent, firebase } from '@react-native-firebase/analytics';
import Button from 'components/Button';

interface Props {
    navigation: StackNavigationProp<any, any>;
}

const HomeScreen = memo(
    function HomeScreen({}: Props) {
        //hooks
        const { theme } = useTheme();
        const isInternet = useInternet();
        const isAppStart = useAppSelector((state) => state.apps.isAppStart);
        const styles = useStyles();
        //state
        //swr
        const {
            products: productsSuggest,
            isValidating: isValidSuggest,
            pagination,
            size,
            setSize,
            mutate: mutateProductInfinity,
        } = useProductSwrInfinity({}, { revalidateOnMount: false });

        const { refreshing, refreshControl } = useRefreshControl(() => {
            if (!isValidSuggest) {
                mutateProductInfinity();
            }
        });
        //ref
        const refList = useRef(null);

        //animated
        const initValueAnimated = useSharedValue(0);
        const onScroll = useAnimatedScrollHandler({
            onScroll: (event) => {
                initValueAnimated.value = event.contentOffset.y;
            },
        });

        //scroll to top - click tabbar
        useScrollToTop(refList);

        //prevent goback exit
        usePreventAppExist();

        //effect
        //--start with deeplink
        useEffect(() => {
            (async () => {
                try {
                    await firebase.analytics().setAnalyticsCollectionEnabled(true);
                    // await BootSplash.hide({ fade: true });
                    if (isAppStart) {
                        //check token fcm start app
                        handleInitialTokenFcm();
                        //deeplink
                        handleDeepLink();
                        //refresh data
                        mutateProductInfinity();
                    }
                } catch (error) {
                    sendSentryError(error, 'Effect HomeScreen Link');
                }
            })();
        }, [isAppStart]);

        /* --- system --- */
        //--token fcm init
        const handleInitialTokenFcm = async () => {
            //khoi chay xin quyen lan dau mo app
            const startedApp = await AsyncStorage.getItem('@started-app');
            if (isEmpty(startedApp)) {
                requestNotifications(['alert', 'sound']).then(async ({ status }) => {
                    if (status === 'granted') {
                        if (!messaging().isDeviceRegisteredForRemoteMessages) {
                            await messaging().registerDeviceForRemoteMessages();
                        }

                        if (messaging().isDeviceRegisteredForRemoteMessages) {
                            //register device first time
                            try {
                                const fcmToken = await messaging().getToken();
                                const deviceId = await DeviceInfo.getUniqueId();
                                const deviceName = await DeviceInfo.getDeviceName();
                                const result = await services.admin.registerDevice(fcmToken, {
                                    device_unique_id: deviceId,
                                    device_name: deviceName,
                                });

                                if (result.code === 'SUCCESS') {
                                    AsyncStorage.setItem(
                                        '@fcm_token_expired',
                                        `${result.fcm_token_expired}`
                                    );
                                }
                            } catch (error) {
                                sendSentryError(error, 'handleInitialTokenFcm 1*');
                            }

                            messaging()
                                .subscribeToTopic('ntl')
                                .then(() => {});
                            await AsyncStorage.setItem('@started-app', 'YES');
                        }
                    }

                    // …
                });
            }
        };

        const handleDeepLink = async () => {
            //deeplink notification
            // await notifee.requestPermission();
            const initialNotification = await notifee.getInitialNotification();
            const deeplinkNotifi: any = initialNotification?.notification?.data?.link;
            if (deeplinkNotifi) {
                Linking.openURL(deeplinkNotifi);
            }
            //deeplink app --- 'c' | 'pd' | 'nd' | 'pb'
            const initLink = await Linking.getInitialURL();
            if (initLink) {
                const scheme = Config.REACT_NATIVE_APP_APP_SCHEME;
                const { type, id, searchParams } = getParamsWithCustomUrl(initLink || '');
                let deeplink = '';
                switch (type) {
                    case 'pd':
                        deeplink = `${scheme}detail/${id}/${searchParams.psu || '0'}`;
                        break;
                    case 'c':
                        deeplink = `${scheme}product-category/${id}`;
                        break;
                    case 'pb':
                        deeplink = `${scheme}product-brand/${id}`;
                        break;
                    case 'nd':
                        deeplink = `${scheme}/news/${id}`;
                        break;
                    default:
                        deeplink = initLink;
                }
                if (await Linking.canOpenURL(deeplink)) {
                    Linking.openURL(deeplink);
                }
            }
        };

        /* --- handle --- */
        //--get more product
        const handleGetMoreProducts = ({ distanceFromEnd }: any) => {
            if (distanceFromEnd < 152) {
                return;
            }
            if (!isValidSuggest && pagination.page < pagination.page_count && size < 5) {
                setSize(size + 1);
            }
        };

        const reConnectInternet = () => {};

        //render
        //--top section -> check internet
        const renderTopSection = () => (
            <>
                <HomeTop refreshControl={refreshing} isAppStart={isAppStart} />
                <HomeCategory refreshControl={refreshing} isAppStart={isAppStart} />
            </>
        );

        // const openStoreUpdate = () => {
        //     const update =
        //         'Ứng dụng Vua Dụng Cụ đã cập nhật phiên bản mới, quý khách vui lòng cập nhật trong thời gian sớm nhất để trải nghiệm những tính năng mới nhất từ chúng tôi và tránh phát sinh lỗi không mong muốn. Xin cảm ơn !';

        //     Alert.alert(
        //         'Chuyển đổi ứng dụng',
        //         update,
        //         [
        //             {
        //                 text: 'Để sau',
        //                 style: 'cancel',
        //             },
        //             {
        //                 text: 'Tải ứng dụng ngay',
        //                 onPress: () => {
        //                     if (Platform.OS === 'android') {
        //                         Linking.openURL('market://details?id=com.ngothanhloiapp');
        //                     }
        //                 },
        //             },
        //         ],
        //         { cancelable: true }
        //     );
        // };

        // const getRefresh = (refresh: boolean) => {
        //     // setRefreshControl(refresh);
        // };

        const testSendGTM = async () => {
            const analyticsInstance = getAnalytics();

            await logEvent(analyticsInstance, 'login', {
                method: 'user-tri-login-ios',
            }).then((v) => console.log('then analytics ', v));
        };

        return (
            <View style={styles.container}>
                <FocusAwareStatusBar
                    translucent={true}
                    backgroundColor="transparent"
                    barStyle={'light-content'}
                />
                <HomeHeader initValueAnimated={initValueAnimated} />
                <Button title={'test send GTM'} onPress={testSendGTM} />

                {/*Section List ScrollView*/}
                {!isInternet ? (
                    <ScrollView style={styles.scrollview}>
                        {renderTopSection()}
                        <Disconnect
                            reConnectedInternetProps={reConnectInternet}
                            height={theme.dimens.height * 0.4}
                        />
                    </ScrollView>
                ) : (
                    <View style={styles.view_list}>
                        <ListProductsWrapper
                            refProps={refList}
                            data={productsSuggest}
                            scrollEventThrottle={16}
                            numColumns={2}
                            fontSize={theme.typography.body2}
                            onEndReached={handleGetMoreProducts}
                            loadMore={isValidSuggest && !isEmpty(productsSuggest)}
                            onScroll={onScroll}
                            ListHeaderComponent={
                                <View>
                                    {renderTopSection()}
                                    <HomeSales
                                        refreshControl={refreshing}
                                        isAppStart={isAppStart}
                                    />
                                    {/* <Button
                                        title={'get token'}
                                        onPress={navigate.WEBVIEW_SCREEN_ROUTE({
                                            url: 'http://192.168.1.51:3000',
                                        })}
                                    /> */}
                                    <HomeBrand
                                        refreshControl={refreshing}
                                        isAppStart={isAppStart}
                                    />
                                    <AfterInteractions
                                        skeleton={
                                            <View bg={theme.colors.white_[10]}>
                                                <ActivityIndicator
                                                    color={theme.colors.main['600']}
                                                    size={theme.typography.size(35)}
                                                    style={{ flex: 0.3 }}
                                                />
                                            </View>
                                        }
                                    >
                                        <HomeProductCategory
                                            refreshControl={refreshing}
                                            isAppStart={isAppStart}
                                        />
                                    </AfterInteractions>

                                    <View
                                        bg={theme.colors.white_[10]}
                                        bTW={1}
                                        bTC={theme.colors.grey_[100]}
                                    >
                                        <Text
                                            color={theme.colors.main['600']}
                                            size={'body2'}
                                            ph={'small'}
                                            pv="medium"
                                            fw="bold"
                                        >
                                            GỢI Ý SẢN PHẨM
                                        </Text>
                                    </View>

                                    <Divider />
                                </View>
                            }
                            isAddToCart
                            refreshControl={refreshControl()}
                        />
                    </View>
                )}
                {/* bulble */}
                <BubbleWheel />
                {/* spin attendance modal */}
                <SpinAttendanceModal />
            </View>
        );
    }
    // (pre, next) => {
    //     console.log('pre home index ', pre);
    //     console.log('next home index', next);
    //     return true;
    // }
);

const useStyles = () => {
    const { theme } = useTheme();

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'transparent',
        },
        scrollview: {
            flex: 1,
        },
        view_list: {
            flex: 1,
            height: theme.dimens.height,
        },
    });
};

export default HomeScreen;
