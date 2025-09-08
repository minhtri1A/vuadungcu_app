import { useTheme } from 'hooks';
import { StyleSheet } from 'react-native';

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        //container home
        container_home: {
            flex: 1,
            alignItems: 'center',
            backgroundColor: theme.colors.white_[10],
        },
        view_message: {
            height: theme.dimens.height * 0.35,
            width: theme.dimens.width,
            backgroundColor: theme.colors.white_[10],
            justifyContent: 'center',
            alignItems: 'center',
        },
        txt_orderSuccess: {
            fontSize: theme.typography.title2,
            color: theme.colors.slate[900],
        },
        txt_messageTk: {
            fontSize: theme.typography.body2,
            textAlign: 'center',
            color: theme.colors.grey_[400],
        },
        //body
        view_body: {
            width: theme.dimens.width,
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingHorizontal: theme.spacings.tiny,
        },
        view_bodyInfoCheckout: {
            width: '100%',
            paddingTop: theme.spacings.large,
            padding: theme.spacings.small,
        },
        view_item: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTopWidth: 0.15,
            borderTopColor: theme.colors.grey_[400],
            width: '100%',
            paddingHorizontal: theme.spacings.small,
        },
        txt_itemName: {
            fontSize: theme.typography.body1,
            paddingVertical: theme.spacings.small,
        },
        view_subtitle: {
            width: '100%',
            alignItems: 'center',
            marginTop: theme.spacings.small,
        },
        // bottom
        view_footer: {
            flexDirection: 'row',
            //backgroundColor: 'red',
            width: '100%',
            marginTop: 30,
            position: 'absolute',
            bottom: theme.spacings.extraLarge,
            justifyContent: 'space-evenly',
        },
        style_containerList: {
            padding: 0,
            width: '100%',
            paddingTop: theme.spacings.small,
        },
        txt_totalPrice: {
            fontSize: theme.typography.body2,
            color: theme.colors.red['500'],
        },
        //
        view_otherInfo: {
            paddingLeft: theme.spacings.large,
        },
    });
};

export default useStyles;
