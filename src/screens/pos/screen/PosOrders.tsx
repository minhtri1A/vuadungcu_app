import { RouteProp } from '@react-navigation/native';
import { Icon } from '@rneui/themed';
import Header from 'components/Header2';
import LoadingFetchAPI from 'components/LoadingFetchAPI';
import Text from 'components/Text';
import Touch from 'components/Touch';
import View from 'components/View';
import { useNavigate, useTheme } from 'hooks';
import usePosCustomerTicketSWRInfinite from 'hooks/swr/posSwr/usePosCustomerTicketSWRInfinite';
import { useRefreshControl } from 'hooks/useRefreshControl';
import { PosTicketType } from 'models';
import moment from 'moment';
import { RootStackParamsList } from 'navigation/type';
import React from 'react';
import { FlatList, ListRenderItem, StyleSheet } from 'react-native';
import { themeType } from 'theme';
import { currencyFormat } from 'utils/helpers';

interface Props {
    route: RouteProp<RootStackParamsList['PosStack'], 'PosOrders'>;
}

export default function NTLOrdersScreen({ route }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const navigate = useNavigate();
    const seller_uuid = route.params.seller_uuid;
    //state
    //swr
    const { posTicketList, size, pagination, isValidating, setSize, mutate } =
        usePosCustomerTicketSWRInfinite(seller_uuid);
    const { refreshControl } = useRefreshControl(() => {
        mutate();
    });
    //handle
    const handleLoadMoreLogs = () => {
        if (pagination.page_count > 1 && !isValidating && size < pagination.page_count) {
            setSize(size + 1);
        }
    };

    //render
    const renderOrdersPos: ListRenderItem<PosTicketType> = ({ item, index }) => (
        <Touch
            activeOpacity={0.8}
            style={styles.view_wrap_item}
            key={index}
            bg={index % 2 === 0 ? theme.colors.white_[10] : theme.colors.main['50']}
            onPress={navigate.POS_ORDER_DETAIL_ROUTE({ seller_uuid, ticket_id: item.id })}
        >
            <View aI="center" flex={0.2}>
                <Text fw="bold">{item.ticketid}</Text>
                {item.tickettype === 'return' && (
                    <Text color={theme.colors.main[500]} size={'sub3'}>
                        (Trả hàng)
                    </Text>
                )}
            </View>
            <View aI="center" flex={0.4}>
                <Text
                    color={
                        item.tickettype === 'return'
                            ? theme.colors.main[600]
                            : theme.colors.red[500]
                    }
                >
                    {currencyFormat(item.total)}
                </Text>
            </View>
            <View aI="center" flex={0.37}>
                <Text color={theme.colors.grey_[500]}>
                    {moment(item.datenew).format('DD-MM-YYYY')}
                </Text>
            </View>
            <View jC="center" flex={0.03} mr={-5}>
                <Icon
                    type={'ionicon'}
                    name="chevron-forward-outline"
                    size={theme.typography.body2}
                    color={theme.colors.grey_[500]}
                />
            </View>
        </Touch>
    );

    //navigate

    return (
        <View flex={1}>
            <Header
                center={
                    <Text size={'title2'} ta="center">
                        Đơn hàng trực tiếp
                    </Text>
                }
                showGoBack
                iconGoBackColor={theme.colors.black_[10]}
                bgColor={theme.colors.white_[10]}
                statusBarColor={theme.colors.main[500]}
            />

            <View flexDirect="row" jC="space-evenly" p={'small'} bg={theme.colors.white_[10]}>
                <View aI="center" flex={0.2}>
                    <Text size={'body3'} fw="bold">
                        Mã đơn
                    </Text>
                </View>
                <View aI="center" flex={0.4}>
                    <Text size={'body3'} fw="bold">
                        Giá
                    </Text>
                </View>
                <View aI="center" flex={0.37}>
                    <Text size={'body3'} fw="bold">
                        Ngày mua
                    </Text>
                </View>
                <View flex={0.03} />
            </View>
            <FlatList
                data={posTicketList}
                renderItem={renderOrdersPos}
                ListFooterComponent={
                    <View h={30}>
                        <LoadingFetchAPI // check xem co lading san pham hk
                            visible={isValidating}
                            size={theme.typography.title1}
                            color={theme.colors.grey_[400]}
                        />
                    </View>
                }
                ListEmptyComponent={
                    <View flex={1} jC="center" aI="center">
                        <Text color={theme.colors.grey_[400]}>Chưa có đơn hàng</Text>
                    </View>
                }
                keyExtractor={(item) => item.id}
                onEndReachedThreshold={0.5}
                onEndReached={handleLoadMoreLogs}
                refreshControl={refreshControl()}
            />
        </View>
    );
}

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_wrap_item: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            padding: theme.spacings.medium,
            marginTop: theme.spacings.small,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey_[300],
        },
    });
