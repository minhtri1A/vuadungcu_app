/* eslint-disable radix */
/* eslint-disable react-hooks/exhaustive-deps */
import Clipboard from '@react-native-community/clipboard';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Icon } from '@rneui/themed';
import Divider from 'components/Divider';
import Header from 'components/Header';
import IconButton from 'components/IconButton';
import Image from 'components/Image';
import Text from 'components/Text';
import Title from 'components/Title';
import View from 'components/View';
import { useCartOrderDetailReturnsSwr, useTheme } from 'hooks';
import { OrdersStackParamsList } from 'navigation/type';
import React, { memo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { showMessage } from 'react-native-flash-message';
import { themeType } from 'theme';
import { currencyFormat, getDateWithTimeStamp } from 'utils/helpers';

interface Props {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<OrdersStackParamsList, 'OrdersDetailReturnsScreen'>;
}

export default memo(function OrdersDetailReturnsScreen({ navigation, route }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    //state
    const memoUuid = route.params.memo_uuid;
    //swr
    const { data } = useCartOrderDetailReturnsSwr(memoUuid);
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
                centerComponent={{
                    text: 'Chi tiết đơn trả hàng',
                    style: {
                        color: theme.colors.slate[900],
                        fontSize: theme.typography.title1,
                    },
                }}
                leftComponent={
                    <IconButton
                        type="ionicon"
                        name="arrow-back-outline"
                        onPress={navigation.goBack}
                        size={theme.typography.title3}
                        color={theme.colors.slate[900]}
                    />
                }
                backgroundColor={theme.colors.white_[10]}
                statusBarProps={{ backgroundColor: theme.colors.main['600'] }}
                shadow={true}
            />
            {data ? (
                <ScrollView style={styles.view_container}>
                    {/* Status */}
                    <View w="100%" bg={theme.colors.main['600']}>
                        <View style={styles.view_status}>
                            <View w="10%">
                                <Icon
                                    type={'material-community'}
                                    name={'cash-refund'}
                                    size={theme.typography.title2}
                                    color={theme.colors.white_[10]}
                                />
                            </View>
                            <View flex={1} pl={'small'}>
                                <Text color={theme.colors.white_[10]}>Trả hàng</Text>
                                <Text color={theme.colors.white_[10]} size={'body1'}>
                                    {data.status === 'returned'
                                        ? 'Trả hàng thành công !'
                                        : data.status === 'failed'
                                        ? 'Trả hàng thất bại'
                                        : 'Đang xử lý trả hàng !'}
                                </Text>
                                <Text color={theme.colors.white_[10]} size={'body1'}>
                                    Mọi thắc mắc hãy gọi tới 1900 8085 để được hỗ trợ.
                                </Text>
                            </View>
                        </View>
                    </View>
                    {/* Mã đơn hàng */}
                    <View style={{ backgroundColor: theme.colors.white_[10] }}>
                        <View style={styles.view_orderCode}>
                            <View flex={1}>
                                <View style={styles.view_orderInfo}>
                                    <Text fw="bold">Mã đơn hàng:</Text>
                                    <View flexDirect="row">
                                        <Text mr={'tiny1'}>{data.memo_id}</Text>
                                        <TouchableOpacity
                                            onPress={copyOrderIdToClipboard(data.memo_id)}
                                        >
                                            <Text color={colors.cyan['500']}>SAO CHÉP</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.view_orderInfo}>
                                    <Text fw="bold">Ngày trả hàng:</Text>
                                    <Text>
                                        {getDateWithTimeStamp(data.created_at, 0, 'LocaleDateTime')}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* SP đặt & tổng thanh toán*/}
                    <View style={styles.view_wrapProduct}>
                        <View flex={1} p="small">
                            <Text size={'body3'} fw="bold" pb={10}>
                                Sản phẩm trả hàng
                            </Text>
                            <Divider height={theme.dimens.verticalScale(1)} />
                            <View pt={'small'}>
                                {data.memo_items.map((item) => (
                                    <View key={item.item_uuid} style={styles.view_item}>
                                        <View style={styles.view_image}>
                                            <Image
                                                source={{
                                                    uri: item.image,
                                                    priority: FastImage.priority.normal,
                                                }}
                                                resizeMode="contain"
                                                w={'100%'}
                                                h={'100%'}
                                            />
                                        </View>
                                        <View style={styles.view_itemInfo}>
                                            <Text ellipsizeMode="tail" numberOfLines={1}>
                                                {item.name}
                                            </Text>
                                            <Text color={theme.colors.grey_[400]} ta="left">
                                                x{item.qty}
                                            </Text>
                                            <Text color="red" ta="right">
                                                {currencyFormat(parseInt(item.row_total))}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                            <Divider height={theme.dimens.verticalScale(1)} />
                            {/* Thành tiền */}
                            <View style={styles.view_total}>
                                <View flex={1}>
                                    <View style={styles.view_orderInfo}>
                                        <Text>Tổng tiền sản phẩm</Text>
                                        <Text color={theme.colors.grey_[500]}>
                                            {currencyFormat(data.memo_summary.total_items_price)}
                                        </Text>
                                    </View>
                                    <View style={styles.view_orderInfo}>
                                        <Text>Phí vận chuyển</Text>
                                        <Text color={theme.colors.grey_[500]}>
                                            {currencyFormat(data.memo_summary.shipping_fee_paid)}
                                        </Text>
                                    </View>
                                    <View style={styles.view_orderInfo}>
                                        <Text size={'body3'}>Tổng tiền hoàn</Text>
                                        <Text size={'body3'} color="red">
                                            {currencyFormat(data.memo_summary.total_refund_price)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* Phương thức thanh toán */}
                    <Title
                        titleLeft="Lý do trả hàng"
                        titleRight={data.reason}
                        wrapperContainerProps={{ pt: 'small' }}
                        containerProps={{ ph: 'small' }}
                        titleRightProps={{ color: theme.colors.grey_[500] }}
                    />
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
                                    Phương thức hoàn tiền
                                </Text>
                                <Text color={theme.colors.grey_['600']}>{data.refund_method}</Text>
                            </View>
                        </View>
                    </View>
                    {/* button */}
                    {/* <View mt={'small'} p={'small'}>
                        <Button title={'Mua  lại'} />
                    </View> */}
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
            minHeight: 75,
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
        view_orderInfo: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: theme.spacings.tiny,
        },
    });
