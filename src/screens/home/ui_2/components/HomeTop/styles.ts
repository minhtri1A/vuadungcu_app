import { useTheme } from 'hooks';
import { StyleSheet } from 'react-native';
import { verticalScale } from 'react-native-size-matters';

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        /* -------top banner------- */
        view_bannerContainer: {
            width: theme.dimens.width,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'visible',
            zIndex: 2,
            paddingTop: theme.dimens.verticalScale(25),
            backgroundColor: theme.colors.white_[10],
        },
        dotSwiper: {
            backgroundColor: theme.colors.grey_[300],
            width: theme.spacings.medium,
            height: theme.dimens.verticalScale(1.5),
            marginLeft: theme.spacings.tiny,
            marginRight: theme.spacings.tiny,
            marginTop: theme.spacings.tiny,
            marginBottom: theme.spacings.tiny,
        },

        swiper_activeDot: {
            backgroundColor: 'transparent',
            width: theme.spacings.small,
            height: theme.spacings.small,
            borderRadius: theme.spacings.tiny,
            borderWidth: 1,
            borderColor: theme.colors.main['600'],
            marginLeft: theme.spacings.tiny,
            marginRight: theme.spacings.tiny,
            marginTop: theme.spacings.tiny,
            marginBottom: theme.spacings.tiny,
        },
        view_swiper: {
            width: '100%',
            height: verticalScale(130),
            borderRadius: 10,
        },
        //sub view
        view_wrapSubview: {
            width: '85%',
            backgroundColor: theme.colors.white_[10],
            position: 'absolute',
            bottom: '-8%',
            zIndex: 10,
            padding: theme.spacings.tiny,
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        view_point: {
            flex: 1,
            borderRightWidth: 1,
            borderRightColor: theme.colors.grey_[200],
            justifyContent: 'center',
            alignItems: 'center',
        },
        view_coin: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        //qr
        view_wrapQr: {
            backgroundColor: theme.colors.black_[10],
            position: 'absolute',
            alignSelf: 'center',
            minWidth: 110,
            // height: '100%',
            top: '-119%',
            // elevation: 2,
            borderRadius: 10,
            padding: theme.spacings.tiny,
            alignItems: 'center',
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: theme.colors.black_[10],
        },
        view_border: {
            width: 1,
            height: '80%',
            backgroundColor: theme.colors.grey_[500],
            opacity: 0.3,
        },
        touch_qrRight: {
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: theme.spacings.small,
        },
    });
};

export default useStyles;
