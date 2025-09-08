/* eslint-disable radix */
/* eslint-disable react-hooks/exhaustive-deps */
import Button from 'components/Button';
import Image from 'components/Image';
import Text from 'components/Text';
import View from 'components/View';
import { Routes } from 'const/index';
import { useNavigate, useNavigation, useTheme } from 'hooks';
import { OrdersType } from 'models';
import React, { memo, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { themeType } from 'theme';
import { currencyFormat } from 'utils/helpers';
import ReviewModal from './ReviewModal';
import Touch from 'components/Touch';
import { Icon } from '@rneui/themed';

interface Props {
    order: OrdersType;
    repurchaseOrderCustomer: (order_uuid: string) => void;
}

const OrderSellerSection = memo(function OrderSellerSection({
    order,
    repurchaseOrderCustomer,
}: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const navigation = useNavigation();
    const navigate = useNavigate();
    //state
    const [isVisiblePreview, setIsVisiblePreview] = useState(false);
    //value
    //check
    // const checkShowTimeDescript = ['pending', 'complete'].includes(order.status);
    const checkReview =
        order.status === 'complete' && order.items.some((v) => v.allow_review === 'Y');

    /* --- handle --- */
    //--visible
    const visiblePreviewModal = () => {
        setIsVisiblePreview((pre) => !pre);
    };
    /* --- navigate --- */
    const navigateOrderDetailReturnsScreen = (memo_uuid: string) => () => {
        navigation.navigate(Routes.NAVIGATION_ORDERS_DETAIL_RETURNS_SCREENS, { memo_uuid });
    };

    return (
        <>
            <Touch
                activeOpacity={0.8}
                // onPress={navigateOrderDetailScreen(item.order_uuid)}
            >
                <View style={styles.view_orderList}>
                    <Touch
                        flexDirect={'row'}
                        aI="center"
                        p={'medium'}
                        bBW={1}
                        bBC={theme.colors.grey_[100]}
                        onPress={navigate.SHOP_ROUTE({ seller_code: order.seller_uuid })}
                    >
                        <Icon
                            type="material-community"
                            name="storefront-outline"
                            size={theme.typography.size(20)}
                        />

                        <Text fw="bold" ml={'tiny'}>
                            Vua Dụng Cụ
                        </Text>
                        <Icon type="ionicon" name="chevron-forward" size={theme.typography.body2} />
                    </Touch>
                    {/* Danh sách sản phẩm */}
                    <View ph="medium" pt="medium">
                        {order.items.map((v, i) => (
                            <TouchableOpacity
                                key={i}
                                style={styles.view_orderProductList}
                                activeOpacity={0.8}
                                onPress={navigate.PRODUCT_DETAIL_ROUTE(
                                    v.product_uuid,
                                    v.product_seller_uuid
                                )}
                            >
                                <View style={styles.view_orderProductImage}>
                                    <Image
                                        source={{
                                            uri: v.image,
                                        }}
                                        resizeMode="contain"
                                    />
                                </View>
                                <View pl={10} pr={5} flex={1}>
                                    <Text
                                        ellipsizeMode="tail"
                                        numberOfLines={2}
                                        color={theme.colors.slate[900]}
                                        size={'body1'}
                                        fw="500"
                                    >
                                        {v.name}
                                    </Text>
                                    <Text color={theme.colors.grey_[500]}>
                                        {currencyFormat(parseInt(v.row_total))}
                                    </Text>
                                    <Text color={theme.colors.grey_[500]}>x{v.qty}</Text>
                                    {v.is_returns === 'Y' ? (
                                        <Text color="red" size="body1">
                                            [Trả hàng]
                                        </Text>
                                    ) : null}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {/* total */}
                    <View
                        gap={theme.spacings.small}
                        ph="medium"
                        bTW={0.7}
                        bTC={theme.colors.grey_[100]}
                        pt={'medium'}
                    >
                        {order?.gift && (
                            <View flexDirect="row" jC="space-between">
                                <Text color={theme.colors.grey_[500]}>Quà tặng</Text>
                                <Text color={theme.colors.grey_[600]}>{order?.gift}</Text>
                            </View>
                        )}
                        {order?.use_score && (
                            <View flexDirect="row" jC="space-between">
                                <Text color={theme.colors.grey_[500]}>Xu sử dụng</Text>
                                <Text color={theme.colors.grey_[600]}>-{order?.use_score}</Text>
                            </View>
                        )}
                        {order?.shipping_fee && (
                            <View flexDirect="row" jC="space-between">
                                <Text color={theme.colors.grey_[500]}>Phí vận chuyển</Text>
                                <Text color={theme.colors.grey_[600]}>
                                    {currencyFormat(parseInt(order?.shipping_fee))}
                                </Text>
                            </View>
                        )}

                        <View flexDirect="row" jC="space-between">
                            <Text fw="bold">Tổng tiền</Text>
                            <Text fw="bold" color={theme.colors.red[500]}>
                                {currencyFormat(parseInt(order.total_items_price))}
                            </Text>
                        </View>
                    </View>

                    {/* button */}
                    <View
                        flexDirect="row"
                        jC="flex-end"
                        aI="center"
                        p="medium"
                        bTW={0.7}
                        bTC={theme.colors.grey_[100]}
                        mt={theme.spacings.medium}
                    >
                        <View flex={1}>
                            {order.status === 'pending' || order.status === 'processing' ? (
                                <Text size={'sub3'} color={theme.colors.grey_[500]}>
                                    Đơn hàng đang được xử lý, mọi thắc mắc về đơn hàng vui lòng liên
                                    hệ gian hàng!
                                </Text>
                            ) : null}
                        </View>

                        {order.status === 'pending' || order.status === 'processing' ? (
                            <Button
                                title={'Liên hệ gian hàng'}
                                size="md"
                                titleSize={'body1'}
                                minWidth={'35%'}
                                type="outline"
                                color={theme.colors.main['600']}
                                onPress={navigate.CHAT_MESSAGE_ROUTE({
                                    user_uuid: order?.seller_uuid || '',
                                })}
                            />
                        ) : order.status === 'cancel' ||
                          (order.status === 'complete' && !checkReview) ? (
                            <>
                                {/* // <Button
                            //     title={'Mua lại'}
                            //     titleSize={'body1'}
                            //     minWidth={'35%'}
                            //     onPress={() => repurchaseOrderCustomer(order.order_uuid)}
                            // />
                            // <Text color={theme.colors.green[500]}>Giao hàng thành công</Text> */}
                            </>
                        ) : order.status === 'complete' && checkReview ? (
                            <Button
                                title={'Đánh giá'}
                                size="md"
                                type="solid"
                                // color={theme.colors.main['600']}
                                titleSize={'body1'}
                                minWidth={'35%'}
                                containerStyle={{ marginLeft: theme.spacings.small }}
                                onPress={visiblePreviewModal}
                            />
                        ) : null}
                    </View>

                    {/* description */}

                    {/* btn view returns */}
                    {/* {order.status === 'complete' &&
                    order.is_allow_returns === 'N' &&
                    order.memo_uuid ? (
                        <View m="small">
                            <Button
                                title={'Xem thông tin trả hàng'}
                                type="outline"
                                color={theme.colors.main['600']}
                                onPress={navigateOrderDetailReturnsScreen(order.memo_uuid)}
                            />
                        </View>
                    ) : null} */}
                </View>
            </Touch>
            <ReviewModal
                isVisible={isVisiblePreview}
                onBackdropPress={visiblePreviewModal}
                order={order}
            />
        </>
    );
});

export default OrderSellerSection;

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_orderList: {
            marginBottom: theme.spacings.small,
            backgroundColor: theme.colors.white_[10],
        },

        view_orderProductList: {
            flex: 1,
            flexDirection: 'row',
            minHeight: theme.dimens.verticalScale(75),
            marginBottom: theme.spacings.medium,
        },
        view_orderProductImage: {
            width: '25%',
            aspectRatio: 1,

            borderRadius: 2,
            overflow: 'hidden',
        },
        touch_view_detail: {
            alignItems: 'center',
            borderBottomWidth: 1,

            borderColor: theme.colors.grey_[200],
            borderStyle: Platform.OS === 'android' ? 'dashed' : 'solid',
            paddingBottom: theme.spacings.medium,
            marginHorizontal: theme.spacings.medium,
            marginBottom: theme.spacings.medium,
        },
    });
