/* eslint-disable radix */
/* eslint-disable react-hooks/exhaustive-deps */
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CheckBox } from '@rneui/themed';
import Button from 'components/Button';
import Header from 'components/Header2';
import Image from 'components/Image';
import Loading from 'components/Loading';
import Text from 'components/Text';
import Title from 'components/Title';
import View from 'components/View';
import { Message, Order, Routes, Status } from 'const/index';
import { getMessage, useAppSelector, useCartOrdersSwr, useTheme } from 'hooks';
import { OrderItemsType, OrderReturnSummaryResponseType } from 'models';
import { OrdersStackParamsList } from 'navigation/type';
import React, { memo, useEffect, useState } from 'react';
import { ListRenderItem, RefreshControl, StyleSheet } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { FlatList } from 'react-native-gesture-handler';
import { services } from 'services';
import { themeType } from 'theme';
import { currencyFormat, isEmpty } from 'utils/helpers';

interface Props {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<OrdersStackParamsList, 'OrdersReturnsScreen'>;
}

export default memo(function OrdersReturnsScreen({ navigation, route }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    //state
    const [orderItems, setOrderItems] = useState([]);
    const [returnsSummary, setReturnsSummary] = useState<
        OrderReturnSummaryResponseType | undefined
    >(undefined);
    const [refresh, setRefresh] = useState(false);
    const [status, setStatus] = useState<string>(Status.DEFAULT);
    const [message, setMessage] = useState(Message.NOT_MESSAGE);
    const messageh = getMessage(message);
    //value
    const { reason, refundMethod } = useAppSelector((state) => state.apps.orderReturnsOptions);
    const orderUuid = route.params.order_uuid;
    const orderStatus = Order.orderStatus;
    //swr
    // const { data } = useCartOrderDetailSwr(orderItems);
    const { mutate: mutateOrderComplete } = useCartOrdersSwr(
        {
            status: orderStatus[3].key as any,
        },
        { revalidateOnMount: false }
    );
    //value
    const checkDisableButton =
        parseInt(returnsSummary?.count_items || '0') > 0 && reason ? false : true;
    //effect
    //--unmount
    useEffect(() => {
        //show message
        return () => {
            //reset all checked item is N
            handleChangeCheckedItem('Y')();
        };
    }, []);
    //-- show message
    useEffect(() => {
        if (messageh) {
            showMessage({
                message: messageh,
                type: status === Status.SUCCESS ? 'success' : 'danger',
                duration: 3000,
                onHide: () => {
                    setMessage(Message.NOT_MESSAGE);
                    setStatus(Status.DEFAULT);
                },
            });
        }
    }, [messageh]);

    useEffect(() => {
        fetchOrderItems();
    }, [orderUuid]);
    //handle
    const refreshList = () => {
        setRefresh(true);
        //code xu ly api...
        setRefresh(false);
    };

    const fetchOrderItems = async () => {
        setStatus(Status.LOADING);
        const result = await services.customer.getOrderItems(orderUuid);
        if (result) {
            setStatus(Status.DEFAULT);
            setOrderItems(result);
            //mỗi lần fetch item sẽ đồng thời fetch summary của order return
            fetchOrderReturnsSummary();
        }
    };

    const fetchOrderReturnsSummary = async () => {
        const result = await services.customer.getMineSummary('returns-summary', orderUuid);
        if (result.code === Message.SUCCESS) {
            setReturnsSummary(result);
        }
    };

    const handleChangeCheckedItem =
        (is_checked: 'Y' | 'N', order_item_uuid?: string) => async () => {
            setStatus(Status.LOADING);
            const requestIsChecked = is_checked === 'Y' ? 'N' : 'Y';
            const result = await services.customer.updateReturnsChecked(orderUuid, {
                is_checked: requestIsChecked,
                order_item_uuid,
            });
            if (result.code === Message.SUCCESS && order_item_uuid) {
                fetchOrderItems();
            } else {
                setStatus(Status.DEFAULT);
            }
        };

    const handleCreateOrderReturns = async () => {
        setStatus(Status.LOADING);
        const result = await services.customer.createOrderReturns(orderUuid, {
            reason,
            refund_method: !isEmpty(refundMethod) ? refundMethod : 'Gian hàng liên hệ',
        });

        if (result.code === Message.SUCCESS) {
            await mutateOrderComplete();
            setStatus(Status.SUCCESS);
            setMessage(Message.RETURNS_ORDER_SUCCESS);
            navigation.goBack();
        } else {
            setStatus(Status.ERROR);
            setMessage(Message.RETURNS_ORDER_FAILED);
        }
    };
    //render
    const renderListOrderItems: ListRenderItem<OrderItemsType> = ({ item, index }) => (
        <View flexDirect="row" pt={'small'} key={index}>
            <CheckBox
                checked={item.is_checked_returns === 'Y'}
                onPress={handleChangeCheckedItem(item.is_checked_returns, item.item_uuid)}
                iconType={'ionicon'}
                checkedIcon="checkbox"
                uncheckedIcon="square-outline"
                containerStyle={styles.checkbox_container}
            />
            <View ratio={1} w={'20%'}>
                <Image
                    source={{
                        uri: item.image,
                    }}
                    resizeMode={'contain'}
                />
            </View>
            <View flex={1}>
                <Text numberOfLines={2}>{item.name}</Text>
                <Text numberOfLines={2} size={'body1'}>
                    Số lượng: {item.qty}
                </Text>
                <Text ta="right" color="red">
                    {currencyFormat(item.row_total)}
                </Text>
            </View>
        </View>
    );
    //navigate
    const navigateToReturnsOptions = (option_type: 'reason' | 'payment') => () => {
        navigation.navigate(Routes.NAVIGATION_ORDERS_RETURNS_OPTIONS_SCREEN, {
            option_type,
        });
    };
    return (
        <>
            <Header
                center={
                    <Text size={'title2'} ta="center">
                        Yêu cầu trả hàng
                    </Text>
                }
                showGoBack
                iconGoBackColor={theme.colors.black_[10]}
                bgColor={theme.colors.white_[10]}
                statusBarColor={theme.colors.main[500]}
            />

            <View flex={1}>
                {/* item */}
                <View flex={1}>
                    <Text p={'small'}>Chọn sản phẩm trả hàng</Text>
                    <View bg={theme.colors.white_[10]} p="small">
                        <FlatList
                            data={orderItems[0]}
                            renderItem={renderListOrderItems}
                            keyExtractor={(item) => item.name}
                            refreshControl={
                                <RefreshControl
                                    onRefresh={refreshList}
                                    refreshing={refresh}
                                    colors={[theme.colors.main['600']]}
                                />
                            }
                        />
                    </View>
                </View>
                {/* bottom  */}
                <View style={styles.view_wrapBottom}>
                    {/* other info */}
                    <View mb={'small'}>
                        <Title
                            titleLeft="Lý do"
                            titleRight={reason ? reason : 'Vui lòng chọn lý do'}
                            titleRightProps={{
                                size: 'body1',
                                color: reason ? theme.colors.grey_[400] : 'red',
                            }}
                            dividerBottom
                            activeOpacity={0.7}
                            chevron
                            titleContainerStyle={{
                                padding: theme.spacings.small,
                            }}
                            flexLeft={0.3}
                            onPress={navigateToReturnsOptions('reason')}
                        />
                        <Title
                            titleLeft="Hình thức hoàn tiền"
                            titleRight={!isEmpty(refundMethod) ? refundMethod : 'Gian hàng liên hệ'}
                            titleRightProps={{ size: 'body1', color: theme.colors.grey_[400] }}
                            dividerBottom
                            activeOpacity={0.7}
                            chevron
                            titleContainerStyle={{
                                padding: theme.spacings.small,
                            }}
                        />
                    </View>
                    {/* summary */}
                    <View p={'small'}>
                        <View flexDirect="row" jC="space-between">
                            <Text>Tổng tiền sản phẩm </Text>
                            <Text color={theme.colors.grey_[500]}>
                                {currencyFormat(returnsSummary?.total_items_price)}
                            </Text>
                        </View>
                        <View flexDirect="row" jC="space-between">
                            <Text>Phí vận chuyển </Text>
                            <Text color={theme.colors.grey_[500]}>
                                {currencyFormat(returnsSummary?.shipping_fee)}
                            </Text>
                        </View>
                        <View flexDirect="row" jC="space-between">
                            <Text>Phí vận chuyển khách trả </Text>
                            <Text color={theme.colors.grey_[500]}>
                                {currencyFormat(returnsSummary?.shipping_fee_paid)}
                            </Text>
                        </View>
                        <View flexDirect="row" jC="space-between" mt={'small'}>
                            <Text size={'body3'}>Tổng tiền hoàn trả </Text>
                            <Text color="red" size={'body3'}>
                                {currencyFormat(returnsSummary?.total_refund_price)}
                            </Text>
                        </View>
                        <View mt={'small'}>
                            <Button
                                title={'Xác nhận trả hàng'}
                                disabled={checkDisableButton}
                                onPress={handleCreateOrderReturns}
                            />
                        </View>
                    </View>
                </View>
            </View>
            <Loading visible={status === Status.LOADING} />
        </>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_container: {
            flex: 1,
            // backgroundColor: theme.colors.white_[10],
            // paddingLeft: theme.spacings.medium,
            // paddingRight: theme.spacings.medium,
        },
        checkbox_container: {
            padding: 0,
            width: theme.spacings.medium,
            justifyContent: 'center',
        },
        view_wrapBottom: {
            backgroundColor: theme.colors.white_[10],
            borderTopWidth: 1,
            borderTopColor: theme.colors.grey_[200],
        },
    });
