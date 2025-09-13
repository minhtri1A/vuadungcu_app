/* eslint-disable radix */
/* eslint-disable react-hooks/exhaustive-deps */
import Clipboard from '@react-native-community/clipboard';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Icon } from '@rneui/themed';
import Button from 'components/Button';
import Divider from 'components/Divider';
import Header from 'components/Header2';
import Image from 'components/Image';
import Text from 'components/Text';
import View from 'components/View';
import { useCartOrderDetailSwr, useTheme } from 'hooks';
import { OrdersStackParamsList } from 'navigation/type';
import React, { memo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { showMessage } from 'react-native-flash-message';
import { themeType } from 'theme';
import { currencyFormat } from 'utils/helpers';

interface Props {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<OrdersStackParamsList, 'OrdersDetailScreen'>;
}

const orderConfig = {
    pending: {
        color: 'rgba(248, 158, 0, 1)',
        icon_type: 'material-community',
        icon_name: 'newspaper-variant-outline',
    },
    processing: {
        color: 'rgba(248, 158, 0, 1)',
        icon_type: 'material-community',
        icon_name: 'briefcase-variant-outline',
    },
    shipping: {
        color: 'rgba(114, 226, 204, 1)',
        icon_type: 'material-community',
        icon_name: 'truck-outline',
    },
    complete: {
        color: 'rgba(114, 226, 204, 1)',
        icon_type: 'material-community',
        icon_name: 'truck-check-outline',
    },
    cancel: {
        color: '#F00F',
        icon_type: 'material-community',
        icon_name: 'text-box-remove-outline',
    },
    faulted: {
        color: '#F00F',
        icon_type: 'material-community',
        icon_name: 'text-box-remove-outline',
    },
    returns: {
        color: 'rgba(248, 158, 0, 1)',
        icon_type: 'material-community',
        icon_name: 'cash-refund',
    },
};

export default memo(function OrdersDetailScreen({ route }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    //state
    const orderUuid = route.params.order_uuid;
    //swr
    const { data } = useCartOrderDetailSwr(orderUuid);
    //value

    //handle
    const copyOrderIdToClipboard = (order_id: string) => () => {
        Clipboard.setString(order_id);
        showMessage({
            message: 'Đã sao chép!',
            type: 'success',
            icon: 'success',
        });
    };

    return (
        <>
            <Header
                center={
                    <Text size={'title2'} ta="center">
                        Chi tiết đơn hàng
                    </Text>
                }
                showGoBack
                iconGoBackColor={theme.colors.black_[10]}
                bgColor={theme.colors.white_[10]}
                statusBarColor={theme.colors.main[500]}
            />
            {data ? (
                <ScrollView style={styles.view_container}>
                    {/* Status */}
                    <View w="100%" style={{ backgroundColor: orderConfig[data.status].color }}>
                        <View style={styles.view_status}>
                            <View w="10%">
                                <Icon
                                    type={orderConfig[data.status].icon_type}
                                    name={orderConfig[data.status].icon_name}
                                    size={theme.typography.title2}
                                    color={theme.colors.white_[10]}
                                />
                            </View>
                            <View flex={1} pl={'small'}>
                                <Text color={theme.colors.white_[10]}>{data.status_label}</Text>
                                <Text color={theme.colors.white_[10]} size={'body1'}>
                                    {data.status_description}
                                </Text>
                                {data.status === 'complete' ? (
                                    <Text color={theme.colors.white_[10]} size={'body1'}>
                                        Cảm ơn quý khách đã mua sắm tại Vua Dụng Cụ !
                                    </Text>
                                ) : null}
                                <Text color={theme.colors.white_[10]} size={'body1'}>
                                    Mọi thắc mắc hãy gọi tới 1900 8085 để được hỗ trợ.
                                </Text>
                            </View>
                        </View>
                    </View>
                    {/* Mã đơn hàng */}
                    <View style={{ backgroundColor: theme.colors.white_[10] }}>
                        <View style={styles.view_orderCode}>
                            <View w="50%">
                                <Text mb={5} fw="bold">
                                    Mã đơn hàng:
                                </Text>
                                <Text mb={5} fw="bold">
                                    Ngày đặt hàng:
                                </Text>
                                <Text mb={5} fw="bold">
                                    Ngày giao dự kiến:
                                </Text>
                            </View>
                            <View flex={1} pl="small">
                                <View flexDirect="row" jC="flex-end">
                                    <Text ta="right" mb={5} mr="tiny">
                                        {data.order_id}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={copyOrderIdToClipboard(data.order_id)}
                                    >
                                        <Text color={theme.colors.cyan['500']}>SAO CHÉP</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text ta="right" mb={5}>
                                    {data.created_at}
                                </Text>
                                <Text ta="right"> {data.order_summary.expected_time}</Text>
                            </View>
                        </View>
                    </View>
                    {/* Địa chỉ nhận hàng */}
                    <View style={styles.view_wrapAddress}>
                        <View style={styles.view_address}>
                            <Icon
                                type={'ionicon'}
                                name="location"
                                size={theme.typography.title2}
                                color={theme.colors.grey_[500]}
                            />
                            <View flex={1} pl="small">
                                <Text pb={5} size="body3" fw="bold">
                                    Địa chỉ nhận hàng
                                </Text>
                                <Text>
                                    {data.order_address.lastname +
                                        ' ' +
                                        data.order_address.firstname}
                                </Text>
                                <Text>{data.order_address.telephone}</Text>
                                <Text>{data.order_address.street}</Text>
                                <Text>
                                    {data.order_address.ward +
                                        ', ' +
                                        data.order_address.district +
                                        ', ' +
                                        data.order_address.province}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {/* Thông tin vận chuyển */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.touch_delivery}
                        // onPress={() => {
                        //     navigation.navigate(Routes.NAVIGATION_ORDERS_SHIPPING_SCREEN, {
                        //         order_uuid: orderUuid,
                        //     });
                        // }}
                    >
                        <View style={styles.view_delivery}>
                            <Icon
                                type="material-community"
                                name="truck-outline"
                                size={theme.typography.title2}
                                color={theme.colors.grey_[500]}
                            />
                            <View flex={1} pl="small">
                                <Text pb={5} size="body3" fw="bold">
                                    Thông tin vận chuyển
                                </Text>
                                <View flexDirect="row" jC="space-between">
                                    <View>
                                        <Text>{data.order_summary.delivery}</Text>
                                    </View>
                                    <View pl={'small'}>
                                        <Text ta="right" color={theme.colors.cyan['500']}>
                                            {data.order_summary.shipping_fee > 0
                                                ? currencyFormat(data.order_summary.shipping_fee)
                                                : 'Miễn phí vận chuyển'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {/* SP đặt & tổng thanh toán*/}
                    <View style={styles.view_wrapProduct}>
                        <View flex={1} p="small">
                            <Text size={'body3'} fw="bold" pb={10}>
                                Sản phẩm đặt
                            </Text>
                            <Divider height={1} />
                            <View pt={'small'}>
                                {data.order_items.map((product) => (
                                    <View key={product.product_uuid} style={styles.view_item}>
                                        <View style={styles.view_image}>
                                            <Image
                                                source={{
                                                    uri: product.image,
                                                    priority: FastImage.priority.normal,
                                                }}
                                                resizeMode="contain"
                                                w={'100%'}
                                                h={'100%'}
                                            />
                                        </View>
                                        <View style={styles.view_itemInfo}>
                                            <Text ellipsizeMode="tail" numberOfLines={1}>
                                                {product.name}
                                            </Text>
                                            <Text color={theme.colors.grey_[400]} ta="left">
                                                x{product.qty}
                                            </Text>
                                            {product.is_returns === 'Y' ? (
                                                <Text color="red" size="body1">
                                                    [Trả hàng]
                                                </Text>
                                            ) : null}

                                            <Text color="red" ta="right">
                                                {currencyFormat(parseInt(product.row_total))}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                            <Divider height={1} />
                            {/* Thành tiền */}
                            <View style={styles.view_total}>
                                <View>
                                    <Text color={theme.colors.grey_['600']}>
                                        Tổng tiền sản phẩm
                                    </Text>
                                    <Text color={theme.colors.grey_['600']}>Phí giao hàng</Text>
                                    <Text color={theme.colors.grey_['600']}>
                                        Giảm giá phí giao hàng
                                    </Text>
                                    <Text fw="bold" pt="small">
                                        Tổng thanh toán:
                                    </Text>
                                </View>
                                <View>
                                    <Text color={theme.colors.grey_['600']} ta="right">
                                        {currencyFormat(
                                            parseInt(data.order_summary.total_items_price)
                                        )}
                                    </Text>
                                    <Text color={theme.colors.grey_['600']} ta="right">
                                        {currencyFormat(data.order_summary.shipping_fee)}đ
                                    </Text>
                                    <Text color={theme.colors.grey_['600']} ta="right">
                                        -
                                        {currencyFormat(
                                            parseInt(data.order_summary.shipping_fee_discount)
                                        )}
                                    </Text>
                                    <Text color="red" pt="small" ta="right">
                                        {currencyFormat(
                                            parseInt(data.order_summary.total_order_price)
                                        )}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* Phương thức thanh toán */}
                    <View style={styles.view_wrapPayment}>
                        <View style={styles.view_payment}>
                            <Icon
                                type={'ionicon'}
                                name="card-outline"
                                size={theme.typography.title2}
                                color={theme.colors.grey_[500]}
                            />
                            <View flex={1} pl="small">
                                <Text pb={'tiny'} size="body3" fw="bold">
                                    Phương thức thanh toán
                                </Text>
                                <Text color={theme.colors.grey_['600']}>
                                    Thanh toán khi nhận hàng
                                </Text>
                            </View>
                        </View>
                    </View>
                    {/* button */}
                    <View bg={theme.colors.white_[10]} mt={'small'} p={'small'}>
                        <Button title={'Mua  lại'} />
                    </View>
                </ScrollView>
            ) : null}
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
        view_status: {
            flex: 1,
            padding: theme.spacings.small,
            flexDirection: 'row',
        },
        view_orderCode: {
            flex: 1,
            padding: theme.spacings.small,
            flexDirection: 'row',
        },
        view_wrapAddress: {
            width: '100%',
            backgroundColor: theme.colors.white_[10],
            marginTop: theme.spacings.small,
        },
        view_address: {
            flex: 1,
            padding: theme.spacings.small,
            flexDirection: 'row',
        },
        touch_delivery: {
            width: '100%',
            backgroundColor: theme.colors.white_[10],
            marginTop: theme.spacings.small,
        },
        view_delivery: {
            flex: 1,
            padding: theme.spacings.small,
            flexDirection: 'row',
        },
        view_wrapProduct: {
            width: '100%',
            backgroundColor: theme.colors.white_[10],
            marginTop: theme.spacings.small,
        },
        view_item: {
            flex: 1,
            flexDirection: 'row',
            minHeight: theme.dimens.verticalScale(75),
            marginBottom: theme.spacings.small,
        },
        view_image: {
            width: '20%',
            height: '100%',
            borderWidth: 1,
            borderColor: theme.colors.grey_[100],
            borderRadius: 2,
            justifyContent: 'center',
            alignItems: 'center',
        },
        view_itemInfo: {
            width: '80%',
            height: '100%',
            paddingLeft: theme.spacings.small,
            paddingRight: theme.spacings.small / 2,
            justifyContent: 'center',
        },
        view_total: {
            paddingTop: theme.spacings.small,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        view_wrapPayment: {
            width: '100%',
            backgroundColor: theme.colors.white_[10],
            marginTop: theme.spacings.small,
        },
        view_payment: {
            flex: 1,
            padding: 10,
            flexDirection: 'row',
        },
    });
