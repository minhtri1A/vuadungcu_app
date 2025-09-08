import { useTheme } from 'hooks';
import { StyleSheet } from 'react-native';

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        view_sales_banner: {
            flex: 1,
            // height: theme.dimens.verticalScale(130),
            aspectRatio: 4 / 1.2,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.white_[10],
            padding: theme.spacings.small,
        },
        view_salesContainer: {
            flex: 1,
            width: '100%',
            backgroundColor: theme.colors.red['400'],
            paddingBottom: theme.spacings.small,
        },

        // product
        view_productItemContainer: {
            width: theme.dimens.width * 0.95,
        },
        view_imageProduct: {
            aspectRatio: 1,
            width: '100%',
            // borderWidth: 1,
        },

        touch_wrap_item: {
            width: theme.dimens.width * 0.3,
            marginLeft: theme.spacings.small,
            // backgroundColor: theme.colors.white_[10],
            borderWidth: 3,
            borderColor: theme.colors.main['600'],
            borderRadius: 5,
        },

        //badge
        view_badgeContainer: {
            position: 'absolute',
            top: 0,
            right: 0,
            width: theme.dimens.scale(35),
            aspectRatio: 1,
        },
        view_badgeText: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
};

export default useStyles;
