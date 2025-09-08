import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import Button from 'components/Button';
import Text from 'components/Text';
import Title from 'components/Title';
import {
    NAVIGATION_ORDERS_SCREEN,
    NAVIGATION_ORDERS_STACK,
    NAVIGATION_PROFILE_STACK,
    NAVIGATION_TAB_NAV,
} from 'const/routes';
import { useTheme } from 'hooks';
import { map } from 'lodash';
import { CartItemResponseType, CartSummaryResponseType } from 'models';
import { reset } from 'navigation/RootNavigation';
import React, { memo, useEffect, useState } from 'react';
import { BackHandler, StatusBar, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { currencyFormat, isEmpty } from 'utils/helpers';
import useStyles from './styles';

interface Props {
    navigation: StackNavigationProp<any, any>;
}

export default memo(function OrderSuccessScreen({ navigation }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles();
    //state
    const [listCartItems, setListCartItems] = useState<CartItemResponseType[]>([]);
    const [cartSummary, setCartSummary] = useState<CartSummaryResponseType>();
    //value
    //swr
    // const {} =
    useEffect(() => {
        //prevent back
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
        //get data order local
        (async () => {
            const orderInfoLocal = await AsyncStorage.getItem('order-success');
            if (orderInfoLocal) {
                const orderInfo = JSON.parse(orderInfoLocal || '{}');
                setListCartItems(orderInfo.listCartItems);
                setCartSummary(orderInfo.cartSummary);
            }
        })();
        return () => backHandler.remove();
    }, []);

    const renderListItems = () =>
        map(listCartItems, (value, index) => (
            <View style={styles.view_item} key={index}>
                <Text>{index + 1}.</Text>
                <Text
                    style={[styles.txt_itemName, { width: '85%' }]}
                    ellipsizeMode={'tail'}
                    numberOfLines={1}
                >
                    {value.name}
                </Text>
                <Text style={styles.txt_itemName}>x{value.qty}</Text>
            </View>
        ));
    return (
        <>
            <StatusBar
                translucent={false}
                barStyle={'light-content'}
                backgroundColor={theme.colors.cyan['500']}
            />
            <View style={styles.container_home}>
                {/* top */}
                <View style={styles.view_message}>
                    <Icon
                        name={'briefcase-check-outline'}
                        size={theme.typography.size(30)}
                        color={theme.colors.cyan['500']}
                    />
                    <Text style={styles.txt_orderSuccess}>
                        Đặt thành công {cartSummary?.seller.length} đơn hàng
                    </Text>
                    <Text style={styles.txt_messageTk} numberOfLines={2}>
                        Cảm ơn khách hàng đã mua hàng tại Vua Dụng Cụ !
                    </Text>
                </View>
                {/* body */}
                <View style={styles.view_body}>
                    <View>
                        <Text
                            size={'body3'}
                            pt="small"
                            pb={'small'}
                            fw="bold"
                            color={theme.colors.slate[900]}
                        >
                            Sản phẩm đã mua
                        </Text>
                        {renderListItems()}
                    </View>
                    <View style={styles.view_bodyInfoCheckout}>
                        <Title
                            titleLeft="Tổng thanh toán"
                            titleRight={`${currencyFormat(cartSummary?.total?.price_total || 0)}`}
                            subTitleLeft={`(${cartSummary?.total?.qty_total} sản phẩm)`}
                            titleLeftProps={{ color: 'red', size: 'body2' }}
                            titleRightProps={{ color: 'red', size: 'body2' }}
                            subTitleLeftProps={{ color: theme.colors.grey_[400] }}
                            viewSubTitleLeftProps={{ aI: 'center' }}
                        />
                        {/* other info */}
                        <View style={styles.view_otherInfo}>
                            <Title
                                titleLeft="Tạm tính"
                                titleRight={`${currencyFormat(
                                    cartSummary?.total?.price_total || 0
                                )}`}
                                titleLeftProps={{
                                    size: 'body1',
                                    fw: 'bold',
                                    color: theme.colors.grey_[500],
                                }}
                                titleRightProps={{ size: 'body1', color: theme.colors.grey_[500] }}
                            />
                            <Title
                                titleLeft="Phí vận chuyển"
                                titleRight={
                                    isEmpty(cartSummary?.total?.shipping_fee)
                                        ? 'Gian hàng liên hệ'
                                        : `${currencyFormat(
                                              cartSummary?.total?.shipping_fee[0]
                                          )} - ${currencyFormat(
                                              cartSummary?.total?.shipping_fee[1]
                                          )}`
                                }
                                titleLeftProps={{
                                    size: 'body1',
                                    fw: 'bold',
                                    color: theme.colors.grey_[500],
                                }}
                                titleRightProps={{ size: 'body1', color: theme.colors.grey_[500] }}
                            />
                            {/* {parseInt(order_summary?.shipping_fee_discount) > 0 ? (
                                <Title
                                    titleLeft="Giảm giá phí vận chuyển"
                                    titleRight={`- ${currencyFormat(
                                        order_summary?.shipping_fee_discount || 0
                                    )}đ`}
                                    titleLeftProps={{ size: 'body1', fw: 'bold', color:theme.colors.grey_[500] }}
                                    titleRightProps={{ size: 'body1', color:theme.colors.grey_[500] }}
                                    titleContainerStyle={{ paddingTop: 0, paddingBottom: 0 }}
                                />
                            ) : null} */}
                            {/* <Title
                                titleLeft="Chiết khấu"
                                titleRight={`- ${currencyFormat(
                                    order_summary?.shipping_fee_discount || 0
                                )}đ`}
                                titleLeftProps={{ size: 'body1', fw: 'bold', color:theme.colors.grey_[500] }}
                                titleRightProps={{ size: 'body1' }}
                                titleContainerStyle={{ paddingTop: 0, paddingBottom: 0 }}
                            /> */}
                        </View>
                        {/* note fee */}
                        <View style={styles.view_subtitle}>
                            <Text color={theme.colors.grey_[500]}>
                                (Giá trên chưa bao gồm phí vận chuyển)
                            </Text>
                        </View>
                    </View>
                </View>
                {/* footer */}
                <View style={styles.view_footer}>
                    <Button
                        title={'Tiếp tục mua sắm'}
                        color={theme.colors.cyan['500']}
                        type="outline"
                        onPress={() => {
                            navigation.navigate('HomeScreen');
                        }}
                    />
                    <Button
                        title={'Xem đơn hàng'}
                        bgColor={theme.colors.cyan['500']}
                        linear={false}
                        onPress={() => {
                            reset(1, [
                                {
                                    key: 'key-0',
                                    name: NAVIGATION_TAB_NAV,
                                    params: { screen: NAVIGATION_PROFILE_STACK },
                                },
                                {
                                    key: 'key-1',
                                    name: NAVIGATION_ORDERS_STACK,
                                    params: {
                                        screen: NAVIGATION_ORDERS_SCREEN,
                                    },
                                },
                            ]);
                        }}
                    />
                </View>
            </View>
        </>
    );
});
