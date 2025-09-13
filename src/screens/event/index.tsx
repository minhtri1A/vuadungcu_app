import { RouteProp, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from 'components/Header2';
import IconButton from 'components/IconButton';
import Text from 'components/Text';
import { Routes } from 'const/index';
import withAuth from 'hoc/withAuth';
import { useEventCoinSwr, useEventQrCodeSwr, useTheme } from 'hooks';
import useEventQrCodeLogSwrInfinity from 'hooks/swr/eventSwr/useEventQrCodeLogSwrInfinity';
import { EventCoinInfoResponseType, EventQrCodeInfoResponseType } from 'models';
import { EventStackParamsList } from 'navigation/type';
import React, { memo } from 'react';
import EventCoin from './components/EventCoint';
import EventQRCode from './components/EventQRCode';

interface Props {
    navigation: StackNavigationProp<any, any>;
}

const EventScreen = memo(function EventScreen({ navigation }: Props) {
    //hooks
    const { theme } = useTheme();
    const route = useRoute<RouteProp<EventStackParamsList, 'EventScreen'>>();
    //swr
    const eventQrCodeSwr = useEventQrCodeSwr<EventQrCodeInfoResponseType>('info');
    const eventQrCodeLog = useEventQrCodeLogSwrInfinity('log', 'all');
    const eventCoinInfoSwr = useEventCoinSwr<EventCoinInfoResponseType>('info');

    //value
    const eventType = route.params.type;

    const textTitle =
        eventType === 'qr_code' ? 'Quét mã tích điểm' : eventType === 'coin' ? 'NTL xu' : undefined;

    //animation
    const gotoScoreDetailScreen = () => {
        navigation.navigate(Routes.NAVIGATION_TO_EVENT_DETAIL_SCREEN, { type: eventType });
    };

    return (
        <>
            <Header
                center={
                    <Text size={'title2'} ta="center">
                        {textTitle}
                    </Text>
                }
                right={
                    <IconButton
                        type="ionicon"
                        name="help-circle-outline"
                        onPress={gotoScoreDetailScreen}
                        size={theme.typography.title3}
                        color={theme.colors.white_[10]}
                    />
                }
                showGoBack
                bgColor={'#f59423'}
            />
            {/* event */}
            {eventType === 'qr_code' ? (
                <EventQRCode eventQrCodeLogSwr={eventQrCodeLog} eventQrCodeSwr={eventQrCodeSwr} />
            ) : eventType === 'coin' ? (
                <EventCoin eventCoinInfoSwr={eventCoinInfoSwr} />
            ) : null}
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
//                 height: height: theme.dimens.verticalScale(2),,
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

export default withAuth(EventScreen, true);
