import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Icon } from '@rneui/themed';
import Header from 'components/Header2';
import LoadingFetchAPI from 'components/LoadingFetchAPI';
import Text from 'components/Text';
import Touch from 'components/Touch';
import View from 'components/View';
import withAuth from 'hoc/withAuth';
import { useNavigate, useTheme } from 'hooks';
import usePosCustomerInfoSWR from 'hooks/swr/posSwr/usePosCustomerInfoSWR';
import usePosCustomerScoreHistorySWRInfinite from 'hooks/swr/posSwr/usePosCustomerScoreHistorySWRInfinitie';
import { useRefreshControl } from 'hooks/useRefreshControl';
import { ScoreHistoryType } from 'models';
import moment from 'moment';
import { RootStackParamsList } from 'navigation/type';
import React, { memo } from 'react';
import { FlatList, ImageBackground, ListRenderItem } from 'react-native';
import { currencyFormat } from 'utils/helpers';
import useStyles from '../style';

interface Props {
    route: RouteProp<RootStackParamsList['PosStack'], 'PosScoreScreen'>;
    navigation: StackNavigationProp<any, any>;
}

const PosScoreScreen = memo(function PosScoreScreen({ route }: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles();
    const navigate = useNavigate();

    //params
    const { seller_uuid, seller_name } = route.params;

    //swr
    const {
        posScoreHistory,
        size,
        pagination,
        isValidating,
        setSize,
        mutate: mutateHistory,
    } = usePosCustomerScoreHistorySWRInfinite(seller_uuid);
    const { posCustomer, mutate: mutateInfo } = usePosCustomerInfoSWR(seller_uuid);
    const { score, name } = posCustomer?.pos_customer || {};

    //refresh
    const { refreshControl } = useRefreshControl(() => {
        mutateHistory();
        mutateInfo();
    });

    const renderScoreHistory: ListRenderItem<ScoreHistoryType> = ({ item, index }) => (
        <Touch
            style={styles.view_wrap_log}
            key={index}
            onPress={
                item.ticket
                    ? navigate.POS_ORDER_DETAIL_ROUTE({ seller_uuid, ticket_id: item.ticket })
                    : undefined
            }
        >
            <View style={styles.view_log_left}>
                <Icon type="entypo" name="dot-single" size={30} color={theme.colors.grey_[500]} />
                <View style={{ paddingLeft: theme.spacings.small }}>
                    <Text size={'body1'} numberOfLines={2}>
                        {item.content || 'Giao dịch trực tiếp tại cửa hàng'}
                    </Text>
                    <Text size={'sub2'} color={theme.colors.grey_[400]}>
                        {moment(item.date).format('HH:mm:ss DD-MM-YYYY')}
                        {/* {item.date} */}
                    </Text>
                </View>
            </View>

            <View jC="center">
                <Text
                    size={'body1'}
                    color={
                        parseInt(item.score) > 0 ? theme.colors.green['500'] : theme.colors.red[600]
                    }
                >
                    {`${parseInt(item.score) > 0 ? '+' : ''}${currencyFormat(item.score)}`}
                </Text>
            </View>
        </Touch>
    );

    //handle

    //navigate

    const navigateToOrderDetailPosScreen = (id?: string) => () => {
        if (id) {
            navigate.ORDER_DETAIL_POS_ROUTE({ order_id: id })();
        }
    };

    const handleLoadMoreLogs = () => {
        if (pagination.page_count > 1 && !isValidating && size < pagination.page_count) {
            setSize(size + 1);
        }
    };

    return (
        <>
            <Header
                center={
                    <Text size={'title2'} ta="center" color={theme.colors.white_[10]}>
                        {seller_name}
                    </Text>
                }
                showGoBack
                bgColor={'#f59423'}
            />
            {/* event */}
            <>
                <View style={styles.view_topContainer}>
                    <ImageBackground
                        source={require('asset/background.png')}
                        resizeMode="cover"
                        style={styles.imageBackground}
                        imageStyle={{ borderBottomLeftRadius: 50, borderBottomRightRadius: 50 }}
                    >
                        <View style={styles.view_score}>
                            <View mb={'medium'} flexDirect="row" aI="flex-end">
                                <Text size={'body2'} color={theme.colors.white_[10]}>
                                    Xin chào! {name ? name : 'Khách hàng'}
                                </Text>
                            </View>

                            {/* <Text
                                color={theme.colors.white_[10]}
                                style={{ fontSize: theme.typography.size(35) }}
                            >
                                {score ? currencyFormat(parseInt(score), false) : '0'}
                            </Text> */}
                            <Text color={theme.colors.grey_[100]} size={'body3'}>
                                Bạn đang có{' '}
                                <Text color={'#6aff65'} size={'title2'}>
                                    {score ? currencyFormat(parseInt(score || '0'), false) : '0'}{' '}
                                </Text>
                                điểm tích luỹ
                            </Text>
                        </View>
                        <Touch
                            style={styles.view_wrapQr}
                            onPress={navigate.POS_SCORE_TRANSFER_ROUTE({ seller_uuid })}
                            activeOpacity={1}
                        >
                            <View>
                                <View
                                    flexDirect="row"
                                    jC="center"
                                    aI="center"
                                    gap={theme.spacings.medium}
                                >
                                    <Icon
                                        type="ionicon"
                                        name={'gift-outline'}
                                        size={theme.typography.size(21)}
                                    />
                                    <Text size={'body2'}>Đổi điểm tích luỹ</Text>
                                </View>
                            </View>
                            <Icon
                                type="ionicon"
                                name="chevron-forward"
                                size={theme.typography.size(18)}
                                color={theme.colors.grey_[400]}
                            />
                        </Touch>
                    </ImageBackground>
                </View>
                {/* History */}
                <View style={styles.view_historyContainer}>
                    <View style={styles.historyTitle}>
                        <Text size={'body3'} fw="bold">
                            Lịch sử
                        </Text>
                    </View>

                    <FlatList
                        data={posScoreHistory}
                        renderItem={renderScoreHistory}
                        ListFooterComponent={
                            <View h={30}>
                                <LoadingFetchAPI // check xem co lading san pham hk
                                    visible={isValidating}
                                    size={theme.typography.title1}
                                    styleView={{
                                        height: theme.dimens.height * 0.05,
                                    }}
                                />
                            </View>
                        }
                        ListEmptyComponent={
                            <View flex={1} jC="center" aI="center">
                                <Text color={theme.colors.grey_[400]}>Chưa có lịch sử</Text>
                            </View>
                        }
                        keyExtractor={(item, index) => `${item.date}${index}`}
                        onEndReachedThreshold={0.5}
                        refreshControl={refreshControl()}
                        onEndReached={handleLoadMoreLogs}
                    />
                </View>
            </>
        </>
    );
});

// const useStyles = (theme: themeType) =>
//     StyleSheet.create({
//         view_topContainer: {
//             width: theme.dimens.width,
//             height: theme.dimens.height * 0.262,
//         },
//         imageBackground: {
//             width: '100%',
//             height: '100%',
//             alignItems: 'center',
//         },
//         view_wrapQr: {
//             backgroundColor: theme.colors.white_[10],
//             width: theme.dimens.width * 0.8,
//             borderRadius: 10,
//             padding: theme.spacings.large,
//             flexDirection: 'row',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             marginTop: 30,
//             marginLeft: 10,
//             marginRight: 10,

//             shadowColor: '#000',
//             shadowOffset: {
//                 width: 0,
//                 height: 2,
//             },
//             shadowOpacity: 0.25,
//             shadowRadius: 3.84,

//             elevation: 5,
//         },

//         view_historyContainer: {
//             backgroundColor:theme.colors.white_[10],
//             width: theme.dimens.width,
//             height: theme.dimens.height,
//             marginTop: '13%',
//             flex: 1,
//         },
//         historyTitle: {
//             height: 50,
//             justifyContent: 'center',
//             paddingLeft: 10,
//             borderBottomWidth: 1,
//             borderBottomColor: theme.colors.grey_[300],
//         },

//         view_wrapBottomSheet: {
//             backgroundColor: theme.colors.white_[10],
//         },
//         icon_close: {
//             position: 'absolute',
//             right: theme.spacings.medium,
//             top: theme.spacings.small,
//         },
//     });

export default withAuth(PosScoreScreen, true);
// export default PosScoreScreen;
