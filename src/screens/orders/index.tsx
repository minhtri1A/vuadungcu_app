/* eslint-disable radix */
/* eslint-disable react-hooks/exhaustive-deps */
import { RouteProp, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Icon, Tab, TabView } from '@rneui/themed';
import AfterInteractions from 'components/AfterInteractions';
import Button from 'components/Button';
import Divider from 'components/Divider';
import Image from 'components/Image';
import Loading from 'components/Loading';
import LoadingFetchAPI from 'components/LoadingFetchAPI';
import Text from 'components/Text';
import View from 'components/View';
import { Order, Routes, Status } from 'const/index';
import { SET_INDEX_ORDER_TAB } from 'features/action';
import {
    getMessage,
    useAppDispatch,
    useAppSelector,
    useCartOrderConfigsSwr,
    useCartOrdersSwr,
    useTheme,
} from 'hooks';
import { map } from 'lodash';
import { OrderReturnsType, OrdersType } from 'models';
import { OrdersStackParamsList } from 'navigation/type';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Alert, ListRenderItem, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { FlatList } from 'react-native-gesture-handler';
import Ripple from 'react-native-material-ripple';
import { themeType } from 'theme';
import { currencyFormat } from 'utils/helpers';
import OrderSellerSection from './components/OrderSellerSection';
import ReviewHistory from './components/ReviewHistory';
import Header from 'components/Header2';

interface Props {
    navigation: StackNavigationProp<any, any>;
}

const OrdersScreen = memo(function OrdersScreen({ navigation }: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const [index, setIndex] = useState(0);
    const route = useRoute<RouteProp<OrdersStackParamsList, 'OrdersScreen'>>();
    const dispatch = useAppDispatch();
    //state
    const [refreshing, setRefreshing] = useState(false);
    const indexOrderTab = useAppSelector((state) => state.apps.indexOrderTab);
    //value
    const orderStatus = Order.orderStatus;
    const orderStatusKey: any =
        orderStatus[index].key !== 'preview-history' ? orderStatus[index].key : undefined;
    //swr
    const {
        orders,
        orderReturns,
        size,
        setSize,
        pagination,
        isValidating,
        status,
        message,
        cancelOrderCustomer,
        repurchaseOrderCustomer,
    } = useCartOrdersSwr({
        status: orderStatusKey,
    });
    const cartOrderConfigsSwr = useCartOrderConfigsSwr();

    //value
    const messageh = getMessage(message);
    //check
    useEffect(() => {
        if (route.params?.orderIndex) {
            handleChangeTabIndex(route.params?.orderIndex);
        }
    }, [route.params?.orderIndex]);

    useEffect(() => {
        if (status !== Status.DEFAULT && messageh) {
            showMessage({
                message: messageh,
                type: status === Status.SUCCESS ? 'success' : 'danger',
                icon: status === Status.SUCCESS ? 'success' : 'danger',
            });
        }
    }, [status]);

    //--check set indexOrderTab(global state use in review)
    useEffect(() => {
        if (indexOrderTab) {
            setIndex(indexOrderTab);
            dispatch(SET_INDEX_ORDER_TAB(undefined));
        }
    }, [indexOrderTab]);

    /* --- handle --- */

    //--refresh
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await cartOrderConfigsSwr.mutate();
        setRefreshing(false);
    }, []);

    //--order
    const cancelOrderAlert = (order_uuid: string) => () =>
        Alert.alert(
            '',
            'Bạn có muốn huỷ đơn hàng này không?',
            [
                {
                    text: 'Huỷ bỏ',
                    onPress: () => null,
                    style: 'cancel',
                },
                {
                    text: 'Đồng ý',
                    onPress: async () => {
                        await cancelOrderCustomer(order_uuid);
                    },
                },
            ],
            { cancelable: true }
        );

    const handleChangeTabIndex = (value: number) => {
        setIndex(value);
    };

    /* --- render --- */
    const renderTabItems = () => {
        return orderStatus.map((item) => (
            <Tab.Item
                key={item.key}
                title={item.label}
                titleStyle={(active) => ({
                    color: active ? theme.colors.main['600'] : theme.colors.grey_[600],
                    fontSize: theme.typography.body2,
                    fontWeight: '500',
                })}
            />
        ));
    };

    const renderTabViewItems = () => {
        return orders.length > 0 ? (
            <FlatList
                data={orders}
                renderItem={renderOrderSellerSection}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListFooterComponent={
                    <View h={30}>
                        <LoadingFetchAPI // check xem co loading san pham hk
                            visible={isValidating}
                            size={theme.typography.title1}
                            styleView={{
                                height: theme.dimens.height * 0.05,
                                backgroundColor: theme.colors.grey_[200],
                            }}
                        />
                    </View>
                }
                keyExtractor={(item) => item?.order_uuid}
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                    console.log('onEndReached ', pagination);
                    parseInt(pagination.page) < parseInt(pagination.page_count) &&
                        setSize(size + 1);
                }}
                showsVerticalScrollIndicator={false}
            />
        ) : orderReturns.length > 0 ? (
            <FlatList
                data={orderReturns}
                renderItem={renderOrderReturnsItems}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListFooterComponent={
                    <View h={30}>
                        <LoadingFetchAPI // check xem co loading san pham hk
                            visible={isValidating}
                            size={theme.typography.title1}
                            styleView={{
                                height: theme.dimens.height * 0.05,
                                backgroundColor: theme.colors.grey_[200],
                            }}
                        />
                    </View>
                }
                keyExtractor={(item) => item.memo_uuid}
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                    pagination.page < pagination.page_count && setSize(size + 1);
                }}
                showsVerticalScrollIndicator={false}
            />
        ) : (
            <View flex={1} jC="center" aI="center">
                <View w={50} ratio={1}>
                    <Image source={require('asset/no-content.png')} resizeMode="contain" />
                </View>

                <Text mt={20} size="body3" color={theme.colors.grey_[500]}>
                    Không có đơn hàng nào
                </Text>
            </View>
        );
    };

    //--render item của đơn hàng bình thường
    const renderOrderSellerSection: ListRenderItem<OrdersType> = ({ item, index: index_ }) => (
        <OrderSellerSection
            order={item}
            repurchaseOrderCustomer={repurchaseOrderCustomer}
            key={index_}
        />
    );

    //--render item của đơn hàng trả
    const renderOrderReturnsItems: ListRenderItem<OrderReturnsType> = ({ item, index: index_ }) => {
        return (
            <TouchableOpacity
                key={index_}
                activeOpacity={0.8}
                onPress={navigateOrderDetailReturnsScreen(item.memo_uuid)}
            >
                <View style={styles.view_orderList}>
                    <Ripple
                        rippleColor={theme.colors.grey_[300]}
                        rippleDuration={600}
                        style={{ marginBottom: 10 }}
                        onPress={navigateOrderDetailReturnsScreen(item.memo_uuid)}
                    >
                        <View style={styles.view_orderItemTop}>
                            <Text color={theme.colors.main['600']} size={theme.typography.body1}>
                                Xem chi tiết
                            </Text>
                            <Icon
                                type={'ionicon'}
                                name="chevron-forward-outline"
                                size={theme.typography.body3}
                                color={theme.colors.main['600']}
                                containerStyle={{ marginRight: -5 }}
                            />
                        </View>
                        <Divider height={theme.dimens.verticalScale(1)} />
                    </Ripple>
                    {/* Danh sách sản phẩm */}
                    {/* SP 1 */}
                    <View>
                        {item.items.map((product, i) => (
                            <View key={i} style={styles.view_orderProductList}>
                                <View style={styles.view_orderProductImage}>
                                    <Image source={{ uri: product.image }} resizeMode="contain" />
                                </View>
                                <View w={'80%'} h={'100%'} pl={10} pr={5} jC="center">
                                    <Text ellipsizeMode="tail" numberOfLines={1}>
                                        {product.name}
                                    </Text>
                                    <Text color={theme.colors.grey_[400]} ta="left">
                                        x{product.qty}
                                    </Text>
                                    <Text color="red" ta="right">
                                        {currencyFormat(parseInt(product.row_total))}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                    <Divider height={theme.dimens.verticalScale(1)} />
                    <View h={40} flexDirect="row" jC="space-evenly" aI="center" pl={10} pr={10}>
                        <View w={'30%'}>
                            <Text color={theme.colors.grey_['600']} ta="left">
                                {item.items.length} sản phẩm
                            </Text>
                        </View>
                        <View w={'70%'} flexDirect="row" jC="flex-end">
                            <Text color={theme.colors.grey_['600']}>Hoàn tiền: </Text>
                            <Text color="red">
                                {currencyFormat(parseInt(item.total_refund_price))}
                            </Text>
                        </View>
                    </View>
                    {/* Xem chi tiết vận chuyển */}
                    <Divider height={theme.dimens.verticalScale(1)} />
                    <View p="small">
                        <Text
                            color={
                                item.status === 'returned'
                                    ? 'green'
                                    : item.status === 'failed'
                                    ? 'red'
                                    : theme.colors.grey_[500]
                            }
                        >
                            {item.status_description} !
                        </Text>
                    </View>
                    {/* Bottom button */}
                    <Divider height={theme.dimens.verticalScale(1)} />
                    <View p="small">
                        <Button
                            title="Xem đơn hoàn thành"
                            type="outline"
                            color={theme.colors.main['600']}
                            onPress={navigateOrderDetailScreen(item.order_uuid)}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    /* --- navigate --- */
    const navigateOrderDetailScreen = (order_uuid: string) => () => {
        navigation.navigate(Routes.NAVIGATION_ORDERS_DETAIL_SCREEN, { order_uuid });
    };

    const navigateOrderDetailReturnsScreen = (memo_uuid: string) => () => {
        navigation.navigate(Routes.NAVIGATION_ORDERS_DETAIL_RETURNS_SCREENS, { memo_uuid });
    };

    return (
        <>
            <Header
                center={
                    <Text size={'title2'} ta="center">
                        Đơn hàng
                    </Text>
                }
                showGoBack
                iconGoBackColor={theme.colors.black_[10]}
                bgColor={theme.colors.white_[10]}
            />
            {/* tabs */}
            <View flex={1}>
                <Tab
                    value={index}
                    onChange={handleChangeTabIndex}
                    indicatorStyle={styles.tab_indicatorStyle}
                    containerStyle={styles.tab_containerStyle}
                    scrollable={true}
                    style={styles.tab_style}
                >
                    {renderTabItems()}
                </Tab>
                <AfterInteractions>
                    <TabView value={index} onChange={setIndex}>
                        {map(orderStatus, (value, index_) => {
                            return value.key === 'preview-history' ? (
                                <ReviewHistory key={index_} />
                            ) : (
                                <TabView.Item key={index_} style={styles.tab_item}>
                                    {index === index_ ? renderTabViewItems() : null}
                                </TabView.Item>
                            );
                        })}
                    </TabView>
                </AfterInteractions>
            </View>
            {/* loading and modal */}
            <Loading visible={status === Status.LOADING} text="Đang xử lý" />
        </>
    );
});

export default OrdersScreen;

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        list_containerStyle: {
            justifyContent: 'space-between',
            padding: theme.spacings.medium,
            paddingLeft: theme.spacings.small,
            paddingRight: theme.spacings.small,
        },
        view_orderList: {
            marginTop: 10,
            backgroundColor: theme.colors.white_[10],
            padding: theme.spacings.medium,
        },
        view_orderItemTop: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
        view_orderProductList: {
            flex: 1,
            flexDirection: 'row',
            minHeight: theme.dimens.verticalScale(75),
            marginBottom: 10,
        },
        view_orderProductImage: {
            width: '25%',
            aspectRatio: 1,
            backgroundColor: theme.colors.grey_[100],
            borderRadius: 2,
            overflow: 'hidden',
        },
        //tab
        tab_style: {
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey_[100],
        },
        tab_containerStyle: {
            backgroundColor: theme.colors.white_[10],
        },
        tab_indicatorStyle: {
            backgroundColor: theme.colors.main['600'],
            height: 2,
        },
        tab_item: {
            width: '100%',
        },
    });
