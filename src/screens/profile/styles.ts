import { useTheme } from 'hooks';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const useStyles = () => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    return StyleSheet.create({
        /* ------- screen ------- */
        view_container: {
            flex: 1,
            alignItems: 'center',
            backgroundColor: theme.colors.grey_[200],
        },

        view_header: {
            minHeight: theme.dimens.height * 0.38,
        },

        flatlist_style: {
            flex: 1,
            width: theme.dimens.width,
        },
        /* ------- header ------- */
        headerProfile: {
            flex: 1,
            justifyContent: 'space-between',
            width: theme.dimens.width,
            paddingTop: Platform.OS === 'ios' ? theme.dimens.statusBarHeight : undefined,
            tintColor: 'cyan',
        },
        // top
        view_header_top: {
            position: 'relative',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.spacings.small,
            marginTop: insets.top,
        },
        view_top_icon: {
            flexDirection: 'row',
            position: 'absolute',
            right: theme.spacings.small,
            // top: insets.top,
        },
        // body
        view_header_body: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        // bottom
        view_header_bottom: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            marginBottom: theme.spacings.extraLarge,
        },
        image_User: {
            width: theme.dimens.scale(65),
            height: theme.dimens.scale(65),
            // aspectRatio: 1,
            borderRadius: 100,
            borderWidth: 1,
            borderColor: theme.colors.white_[10],
        },
        view_iconEditImage: {
            position: 'absolute',
            bottom: -theme.dimens.verticalScale(5),
            right: -theme.dimens.scale(5),
            justifyContent: 'center',
            alignItems: 'center',
            // width: theme.dimens.scale(20),
            padding: theme.spacings.tiny,

            aspectRatio: 1,
            borderWidth: 1,
            borderColor: theme.colors.white_[10],
            borderRadius: 100,
            backgroundColor: theme.colors.main['600'],
        },
        image_loading: {
            position: 'absolute',
            zIndex: 10,
            width: theme.dimens.scale(65),
            height: theme.dimens.scale(65),
            borderRadius: 100,
            backgroundColor: theme.colors.grey_[300],
            opacity: 0.5,
            top: 0,
        },

        /* ------- profile LoyalPoint ------- */
        //top list
        view_amlContainer: {
            width: '100%',
            height: theme.dimens.height * 0.22,
            backgroundColor: theme.colors.white_[10],
        },

        //timeExpired

        //tutorial poin
        view_wrapAml: {
            flexDirection: 'row',
            flex: 0.7,
            justifyContent: 'center',
            backgroundColor: theme.colors.grey_['1'],
            marginHorizontal: theme.spacings.medium,
        },
        view_Aml: {
            flexDirection: 'column',
            width: '50%',
            borderRightWidth: 0.3,
            borderRightColor: theme.colors.grey_[200],
        },

        //toolTip style
        view_valueAml: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.grey_['1'],
        },
        w_imgLevel: {
            width: '50%',
            height: '100%',
        },
        view_timeExpired: {
            flex: 0.3,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: theme.spacings.medium,
        },
        /* ------- common ------- */
        view_loginTitle: {
            width: '100%',
            height: '100%',
            alignItems: 'center',
        },
        //modal
        view_containerModal: {
            backgroundColor: theme.colors.white_[10],
            padding: theme.spacings.medium,
        },
        view_titleButtonClose: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: theme.spacings.medium,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey_[200],
        },
        editButton: {
            width: theme.dimens.scale(50),
            aspectRatio: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 100,
            marginRight: 20,
        },
        /* --- bottom --- */

        view_list_container: {
            flex: 1,
            backgroundColor: theme.colors.grey_[100],
        },
        view_list: {
            marginTop: theme.spacings.small,
            backgroundColor: theme.colors.white_[10],
        },
        txt_list_title: {
            padding: theme.spacings.medium,
            borderBottomWidth: 0.7,
            borderBottomColor: theme.colors.grey_[200],
        },

        list_containerStyle: {
            justifyContent: 'space-between',
            padding: theme.spacings.medium,

            paddingRight: theme.spacings.small,
        },
        view_body: {
            padding: theme.spacings.medium,
            // backgroundColor: theme.colors.white_[10],
            flex: 1,
        },
        view_device_info: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: theme.colors.white_[10],
            padding: theme.spacings.medium,
            borderTopWidth: 0.7,
            borderTopColor: theme.colors.grey_[200],
        },
        touch_img: {
            height: theme.dimens.height * 0.15,
            alignItems: 'center',
        },
        img: {
            width: '50%',
            height: '100%',
        },
    });
};

export default useStyles;
