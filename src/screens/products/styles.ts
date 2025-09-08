import { useTheme } from 'hooks';
import { StyleSheet } from 'react-native';

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        /* ------- screen ------ */
        view_body: {
            flex: 1,
            backgroundColor: theme.colors.grey_[200],
        },
        loading_apiStyle: {
            position: 'absolute',
            left: 0,
            right: 0,
            backgroundColor: 'rgba(255,255,255,0.0)',
        },
        view_titleSearch: {
            padding: theme.spacings.small,
            flexDirection: 'row',
            width: theme.dimens.width * 0.8,
        },
        view_drawer_container: {
            flex: 1,
        },
        /* ------- list filter ------- */
        view_wrap_filter: {
            flexDirection: 'row',
            alignItems: 'center',

            backgroundColor: theme.colors.white_[10],
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey_[200],
        },
        txt_title_filter: {
            textAlign: 'center',
            fontWeight: 'bold',
            color: theme.colors.white_[10],
            fontSize: theme.typography.body3,
            padding: theme.spacings.small,
            backgroundColor: theme.colors.main['600'],
            paddingTop: theme.dimens.statusBarHeight,
        },
        btn_sort_price: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.spacings.medium,
        },

        view_icon: {
            justifyContent: 'center',
            marginLeft: theme.spacings.tiny,

            paddingRight: theme.spacings.medium,
        },
        /* ------- list category ------ */
        view_category_container: {
            backgroundColor: theme.colors.white_[10],
            marginBottom: theme.spacings.small,
        },
        view_wrap_parent: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: theme.spacings.medium,
        },
        view_parent_image: {
            width: theme.dimens.scale(40),
            aspectRatio: 1,
            borderRadius: 5,
        },
        view_parent_info: {
            flex: 1,
            paddingLeft: theme.spacings.small,
            // backgroundColor: colors.grey_[200],
            justifyContent: 'center',
        },
        touch_wrap_item: {
            alignItems: 'center',
            backgroundColor: theme.colors.white_[10],

            borderRadius: 5,
            padding: theme.spacings.medium,
        },
        view_brand_description: {
            borderTopWidth: 0.7,
            borderTopColor: theme.colors.grey_[200],
            padding: theme.spacings.small,
        },
        /* ----- drawer filter ----- */
        view_input_price: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: theme.spacings.medium,
            alignItems: 'center',
            paddingHorizontal: theme.spacings.small,
        },
        input_price: {
            borderWidth: 0.7,
            borderColor: theme.colors.grey_[400],
            width: '47%',
            // paddingVertical: theme.spacings.small,
            paddingVertical: 0,
            height: theme.dimens.inputHeight,
            // lineHeight: 0,
            borderRadius: 5,
            textAlign: 'center',
            color: theme.colors.grey_[500],
            fontSize: theme.typography.body1,
        },
        container_checkbox: {
            padding: 0,
            margin: 0,
        },
        touch_filter_item: {
            flexDirection: 'row',
            alignItems: 'center',
            height: theme.dimens.verticalScale(30),
        },
        //bottom
        key_view: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            backgroundColor: theme.colors.white_[10],
            paddingTop: theme.spacings.medium,
            borderTopWidth: 1,
            borderTopColor: theme.colors.grey_[200],
        },

        //
        // webview_container: {
        //     width: theme.dimens.width * 0.95, // Tương đương với `theme.dimens.width * 0.8`
        //     height: 200, // Có thể điều chỉnh tuỳ nhu cầu
        // },
        // webview: {
        //     flex: 1,
        //     backgroundColor: 'transparent',
        // },
    });
};

export default useStyles;
