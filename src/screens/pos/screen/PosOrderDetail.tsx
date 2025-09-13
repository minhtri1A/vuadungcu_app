import { RouteProp } from '@react-navigation/native';
import Header from 'components/Header2';
import LoadingFetchAPI from 'components/LoadingFetchAPI';
import Text from 'components/Text';
import View from 'components/View';
import { useTheme } from 'hooks';
import usePosCustomerTicketDetailSWR from 'hooks/swr/posSwr/usePosCustomerTicketDetailSWR';
import { useRefreshControl } from 'hooks/useRefreshControl';
import { map } from 'lodash';
import moment from 'moment';
import { PosStackParamsList } from 'navigation/type';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { themeType } from 'theme';
import { currencyFormat } from 'utils/helpers';

interface Props {
    route: RouteProp<PosStackParamsList, 'PosOrderDetail'>;
}

export default function NTLOrderDetailScreen({ route }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);

    //state
    // const [refreshing, setRefreshing] = useState(false);

    //params
    const { seller_uuid, ticket_id } = route.params;
    //swr
    const { posTicketDetail, isValidating, mutate } = usePosCustomerTicketDetailSWR(
        seller_uuid,
        ticket_id
    );
    const { refreshControl } = useRefreshControl(() => {
        mutate();
    });
    //handle
    // const onRefresh = () => {
    //     setRefreshing(true);
    //     const timeout = setTimeout(() => {
    //         setRefreshing(false);
    //         clearTimeout(timeout);
    //     }, 1000);
    // };
    //render
    const renderListItems = () =>
        map(posTicketDetail?.lines, (value, index) => {
            const price = parseFloat(value.price) * parseFloat(value.units);
            const priceDiscount = parseFloat(value.price_discount) * parseFloat(value.units);
            const percentDiscount = ((price - priceDiscount) / price) * 100;
            return (
                <View style={styles.view_wrap_item} key={index}>
                    <Text size={'body2'} fw="bold" numberOfLines={2}>
                        {value.product_name}
                    </Text>
                    <View style={styles.view_item_info}>
                        <View aI="center">
                            <Text>Số lượng</Text>
                            <Text color={theme.colors.grey_[600]}>x{value.units}</Text>
                        </View>
                        <View aI="center">
                            <Text>Giá</Text>
                            <Text color={theme.colors.grey_[600]}>
                                {currencyFormat(value.price)}
                            </Text>
                        </View>

                        <View aI="center">
                            <Text>Tổng</Text>
                            <View flexDirect="row">
                                <Text color={theme.colors.red['500']}>
                                    {currencyFormat(priceDiscount)}
                                </Text>
                                {value.discount_rate > 0 ? (
                                    <Text size="sub2" color={theme.colors.grey_[400]}>
                                        (-{percentDiscount}%)
                                    </Text>
                                ) : null}
                            </View>
                        </View>
                    </View>
                </View>
            );
        });

    return (
        <View>
            <Header
                center={
                    <Text size={'title2'} ta="center">
                        {`Đơn hàng(${posTicketDetail?.ticketid || ''})`}
                    </Text>
                }
                showGoBack
                iconGoBackColor={theme.colors.black_[10]}
                bgColor={theme.colors.white_[10]}
                statusBarColor={theme.colors.main[500]}
            />
            {isValidating ? (
                <LoadingFetchAPI
                    visible={true}
                    styleView={{ justifyContent: 'flex-start' }}
                    size={theme.typography.size(30)}
                />
            ) : (
                <>
                    <View
                        style={{
                            padding: theme.spacings.small,
                            backgroundColor: theme.colors.white_[10],
                            gap: theme.spacings.medium,
                            ...theme.styles.shadow1,
                        }}
                    >
                        <View flexDirect="row" jC="space-between">
                            <Text size={'body2'} fw="bold">
                                Mã đơn
                            </Text>
                            <Text color={theme.colors.grey_[600]}>{posTicketDetail?.ticketid}</Text>
                        </View>

                        <View flexDirect="row" jC="space-between">
                            <Text size={'body2'} fw="bold">
                                Ngày mua
                            </Text>
                            <Text color={theme.colors.grey_[600]}>
                                {moment(posTicketDetail?.datenew).format('DD-MM-YYYY')}
                            </Text>
                        </View>
                        <View flexDirect="row" jC="space-between">
                            <Text size={'body2'} fw="bold">
                                Tổng giá
                            </Text>
                            <View flexDirect="row">
                                {posTicketDetail?.total_price > posTicketDetail?.total_discount ? (
                                    <Text
                                        color={theme.colors.grey_[600]}
                                        tD="line-through"
                                        size={'sub2'}
                                    >
                                        {currencyFormat(posTicketDetail?.total_price)}-
                                    </Text>
                                ) : null}

                                <Text color={theme.colors.red['500']}>
                                    {currencyFormat(posTicketDetail?.total_discount)}
                                </Text>
                            </View>
                        </View>
                        {posTicketDetail?.discount > 0 ? (
                            <View flexDirect="row" jC="space-between">
                                <Text size={'body1'} fw="bold">
                                    Chiết khấu
                                </Text>
                                <Text color={theme.colors.grey_[500]}>
                                    -{currencyFormat(posTicketDetail?.discount)}
                                </Text>
                            </View>
                        ) : null}
                        {/* {parseInt(order?.score_tranfer) > 0 ? (
                            <View flexDirect="row" jC="space-between" pl="small">
                                <Text size={'body1'} fw="bold">
                                    Điểm tích luỹ
                                </Text>
                                <Text size={'sub2'} color={theme.colors.grey_[500]}>
                                    -{currencyFormat(order?.score_tranfer)}
                                </Text>
                            </View>
                        ) : null} */}

                        <View flex={0.03} />
                    </View>
                    <ScrollView refreshControl={refreshControl()}>{renderListItems()}</ScrollView>
                </>
            )}
        </View>
    );
}

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_wrap_item: {
            backgroundColor: theme.colors.white_[10],
            marginTop: theme.spacings.medium,
            padding: theme.spacings.small,
            marginHorizontal: theme.spacings.small,
            borderRadius: 5,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
        },
        view_item_info: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: theme.spacings.small,
            backgroundColor: theme.colors.grey_[100],
            padding: theme.spacings.small,
            borderRadius: 3,
        },
    });
