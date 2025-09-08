import { useTheme } from 'hooks';
import { StyleSheet } from 'react-native';

const useStyles = () => {
    const {
        theme: { colors, spacings, dimens },
    } = useTheme();
    return StyleSheet.create({
        /* --- header --- */
        header_container: {
            borderBottomWidth: 0,
        },
        header_center_container: {
            flex: 0.85,
        },
        header_left_container: {
            flex: 0.15,
            justifyContent: 'center',
        },
        header_right_container: {
            flex: 0,
        },
        touch_container_search: {
            width: '100%',
            backgroundColor: 'rgba(255,255,255,0.4)',
            padding: spacings.small + 2,
            borderRadius: 5,
        },
        /* --- header - image --- */
        view_wrap_header_image: {
            width: dimens.width * 1,
            position: 'absolute',
            zIndex: -1,
        },
        view_shop_info: {
            flexDirection: 'row',
            backgroundColor: 'rgba(255,255,255,0.4)',
            borderRadius: 5,
        },
        view_transparent: {
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0, 0.5)',
            width: '100%',
            height: '100%',
        },
        /* --- header - tabs --- */
        tab_indicator: {
            backgroundColor: colors.main['600'],
            height: dimens.verticalScale(2),
        },
        tab_container: {
            backgroundColor: colors.white_[10],
        },
        tab_view_container: {
            flex: 1,
            zIndex: -2,
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        },
        /* --- store - tabs --- */
        list_container_style: {
            paddingTop: dimens.height * 0.38,
        },
        /* --- info - tabs --- */
        view_info: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: colors.grey_[200],
        },
        txt_label: {
            flex: 0.5,
            color: colors.grey_[500],
            fontWeight: 'bold',
            backgroundColor: colors.grey_[100],
            padding: spacings.small,
        },
        txt_value: {
            flex: 0.5,
            color: colors.grey_[500],
            padding: spacings.small,
        },

        /* --- search modal --- */
        view_container_search: {
            width: '100%',
            backgroundColor: 'rgba(255,255,255,1)',
            flexDirection: 'row',
            alignItems: 'center',
            padding: spacings.small,
            borderRadius: 5,
        },
        input_search: {
            flex: 1,
            padding: 0,
        },
        /* --- common --- */
        tab_item: {
            width: '100%',
            flex: 1,
            backgroundColor: colors.white_[10],
        },
        tab_product_item: {
            width: '100%',
            flex: 1,
            position: 'relative',
        },
        view_filter: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            backgroundColor: colors.white_[10],
        },
    });
};

export default useStyles;
