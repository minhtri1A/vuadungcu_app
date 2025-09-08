import { Icon } from '@rneui/themed';
import LoadingFetchAPI from 'components/LoadingFetchAPI';
import Text from 'components/Text';
import View from 'components/View';
import { NAVIGATION_TO_SCAN_SCREEN } from 'const/routes';
import { useNavigation, useTheme } from 'hooks';
import {
    EventQrCodeInfoResponseType,
    EventQrCodeLogResponseType,
    EventQrCodeLogSwrInfinityType,
    EventQrCodeSwrType,
} from 'models';
import moment from 'moment';
import React, { memo } from 'react';
import { FlatList, ImageBackground, ListRenderItem } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { currencyFormat } from 'utils/helpers';
import useStyles from '../style';

interface Props {
    eventQrCodeSwr: EventQrCodeSwrType<EventQrCodeInfoResponseType>;
    eventQrCodeLogSwr: EventQrCodeLogSwrInfinityType;
}

const EventQRCode = memo(function EventQRCode({ eventQrCodeSwr, eventQrCodeLogSwr }: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles();
    const navigation = useNavigation();
    //swr
    const { data: eventQrCodeInfo } = eventQrCodeSwr;
    const { available_score } = eventQrCodeInfo;
    const { logs, isValidating: isValidatingLogs, pagination, size, setSize } = eventQrCodeLogSwr;
    //handle
    //render
    const renderListHistory: ListRenderItem<EventQrCodeLogResponseType> = ({ item, index }) => (
        <View style={styles.view_wrapHistory} key={index}>
            <View flex={1} flexDirect="row" aI="center">
                <Icon
                    type="ionicon"
                    name="ribbon-outline"
                    color={theme.colors.main['600']}
                    size={theme.typography.title3}
                />
                <View ml={10} flex={1}>
                    <Text numberOfLines={1} ellipsizeMode={'tail'}>
                        {item.name}
                    </Text>
                    <Text size={'sub2'} color={theme.colors.grey_[400]}>
                        {/* 10:00 12-12-2022 */}
                        {moment(item.created_at).format('HH:mm DD-MM-YYYY')}
                    </Text>
                </View>
            </View>
            <Text color={theme.colors.main['600']}>+{item.score_amount}</Text>
        </View>
    );

    return (
        <>
            <View style={styles.view_topContainer}>
                <ImageBackground
                    source={require('asset/background.png')}
                    resizeMode="cover"
                    style={styles.imageBackground}
                    imageStyle={{ borderBottomLeftRadius: 50, borderBottomRightRadius: 50 }}
                >
                    <View style={styles.view_score}>
                        <Text
                            color={theme.colors.white_[10]}
                            size={'body3'}
                            pv={theme.dimens.moderateScale(10)}
                        >
                            Điểm hiện tại
                        </Text>
                        <Text
                            color={theme.colors.white_[10]}
                            style={{ fontSize: theme.typography.size(48) }}
                        >
                            {available_score ? currencyFormat(parseInt(available_score)) : '0'}
                            <Text color={theme.colors.white_[10]} size={'title1'}>
                                điểm
                            </Text>
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.view_wrapQr}
                        onPress={() => {
                            navigation.navigate(NAVIGATION_TO_SCAN_SCREEN);
                        }}
                        activeOpacity={0.95}
                    >
                        <View flexDirect="row" jC="center" aI="center">
                            <Icon
                                type="ionicon"
                                name={'qr-code-outline'}
                                size={theme.typography.size(35)}
                                style={{ marginRight: theme.spacings.extraLarge }}
                            />
                            <View>
                                <Text>Quét ngay để nhận thưởng</Text>
                            </View>
                        </View>
                        <View style={{ paddingLeft: theme.spacings.tiny }}>
                            <Icon
                                type="ionicon"
                                name="chevron-forward"
                                size={theme.typography.size(20)}
                                color={theme.colors.grey_[500]}
                            />
                        </View>
                    </TouchableOpacity>
                </ImageBackground>
            </View>
            {/* History */}
            <View style={styles.view_historyContainer}>
                <View style={styles.historyTitle}>
                    <Text size={'body3'} fw="bold">
                        Lịch sử
                    </Text>
                </View>
                {logs.length > 0 ? (
                    <FlatList
                        data={logs}
                        renderItem={renderListHistory}
                        ListFooterComponent={
                            <View h={30}>
                                <LoadingFetchAPI // check xem co lading san pham hk
                                    visible={isValidatingLogs}
                                    size={theme.typography.title1}
                                    styleView={{
                                        height: theme.dimens.height * 0.05,
                                        backgroundColor: theme.colors.grey_[200],
                                    }}
                                />
                            </View>
                        }
                        keyExtractor={(item) => item?.created_at}
                        onEndReachedThreshold={0.5}
                        onEndReached={() => {
                            pagination.page < pagination.page_count && setSize(size + 1);
                        }}
                    />
                ) : (
                    <View flex={1} jC="center" aI="center">
                        <Text color={theme.colors.grey_[400]}>Chưa có lịch sử</Text>
                    </View>
                )}
            </View>
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
//             height: theme.dimens.verticalScale(50),
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

export default EventQRCode;
