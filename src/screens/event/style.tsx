import { useTheme } from 'hooks';
import { StyleSheet } from 'react-native';

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        view_topContainer: {
            width: '100%',
            marginBottom: theme.spacings.medium,
        },
        imageBackground: {
            width: '100%',
            alignItems: 'center',
        },
        view_score: {
            marginTop: 30,
            alignItems: 'center',
        },
        view_wrapQr: {
            backgroundColor: theme.colors.white_[10],
            width: theme.dimens.width * 0.8,
            borderRadius: 10,
            padding: theme.spacings.large,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
            transform: [{ translateY: theme.spacings.small }],
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },

        view_historyContainer: {
            backgroundColor: theme.colors.white_[10],
            width: theme.dimens.width,
            height: theme.dimens.height,
            flex: 1,
        },
        historyTitle: {
            height: theme.dimens.verticalScale(50),
            justifyContent: 'center',
            paddingLeft: 10,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey_[300],
        },

        view_wrapBottomSheet: {
            backgroundColor: theme.colors.white_[10],
        },
        icon_close: {
            position: 'absolute',
            right: theme.spacings.medium,
            top: theme.spacings.small,
        },
        view_wrapHistory: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey_[200],
        },
        //loyal event component
        view_wrap_log: {
            flexDirection: 'row',
            padding: theme.spacings.small,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey_[300],
            justifyContent: 'space-between',
        },
        view_log_left: {
            flexDirection: 'row',
            flex: 0.8,
            alignItems: 'center',
        },
    });
};
export default useStyles;
