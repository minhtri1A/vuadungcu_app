import { useTheme } from 'hooks';
import { StyleSheet } from 'react-native';

const useStyles = () => {
    const {
        theme: { colors, spacings, dimens, typography },
    } = useTheme();
    return StyleSheet.create({
        /* ------- screen ------- */
        view_container: {
            flex: 1,
            backgroundColor: colors.white_[10],
        },
        view_flatlist: {
            flex: 1,
            position: 'absolute',
            top: 0,
            bottom: 0,
            backgroundColor: colors.white_[10],
            zIndex: -1,
        },
        loading_view: {
            width: '100%',
            backgroundColor: colors.white_[10],
        },
        /* ------- header ------- */
        header_container: {
            zIndex: 2,
            borderBottomWidth: 0,
        },
        view_header_left: {
            padding: spacings.tiny,
            aspectRatio: 1,
            borderRadius: 1000,
            justifyContent: 'center',
            alignItems: 'center',
        },
        view_header_right: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        chat_container: {
            marginRight: spacings.small,
            borderRadius: 100,
            padding: spacings.tiny,
        },

        /* ------- section top ------- */
        swiper_child: {
            width: dimens.width,
            aspectRatio: 1,
            // height: dimens.height * 0.5,
        },
        view_wrap_pagination: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '8%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        view_bg_pagination: {
            width: '13%',
            height: '70%',
            backgroundColor: 'rgba(0,0,0, 0.5)',
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
        //share
        view_share: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: colors.grey_[100],
        },
        touch_share: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',

            paddingVertical: spacings.small,
        },
        //product info
        view_main_info: {
            width: '100%',
            paddingHorizontal: spacings.medium,
            justifyContent: 'space-around',
            // borderBottomWidth: 1,
            // borderBottomColor: colors.grey_[100],
        },
        view_wrap_name_info: {
            width: '100%',
            justifyContent: 'center',
            paddingTop: spacings.small,
        },
        view_wrap_rating: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: spacings.tiny,
        },
        view_tag: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        txt_tag: {
            backgroundColor: colors.grey_[100],
            padding: spacings.tiny,
            fontSize: typography.size(9),
            borderRadius: 5,
            marginTop: spacings.tiny,
            marginRight: spacings.small,
            color: colors.grey_[600],
        },
        txt_product_name: {
            fontSize: typography.title1,
        },

        view_wrap_Info_rating: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },

        view_wrap_price_Info: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: spacings.medium,
            marginBottom: spacings.small,
        },
        view_price: {
            // flexDirection: 'row',
            // justifyContent: 'space-around',
            // alignItems: 'center',
        },
        view_fly_image: {
            backgroundColor: 'red',
            borderRadius: 50,
            overflow: 'hidden',
        },
        //option
        touch_wrap_option: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: spacings.small,
            borderWidth: 0.7,
            borderColor: colors.grey_[100],
            marginTop: spacings.large,
            borderRadius: 5,
            backgroundColor: colors.white,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.18,
            shadowRadius: 1.0,

            elevation: 1,
            // backgroundColor: colors.grey_[50],
        },
        view_wrap_option_top: {
            flexDirection: 'row',
            paddingVertical: spacings.small,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: colors.grey_[100],
            marginTop: spacings.medium,
        },
        view_option_list: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingTop: spacings.tiny,
        },
        view_wrap_item_image: {
            flexDirection: 'row',
            position: 'relative',
            borderWidth: 1,
            borderColor: colors.grey_[300],
            backgroundColor: colors.grey_[100],
            minWidth: '48%',
            borderRadius: 5,
            overflow: 'hidden',
            marginTop: spacings.small,
            alignItems: 'center',
        },
        view_wrap_item_text: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            borderWidth: 0.5,
            borderColor: colors.grey_[200],
            backgroundColor: colors.grey_[100],
            marginRight: spacings.medium,
            borderRadius: 4,
            overflow: 'hidden',
            marginTop: spacings.medium,
            paddingLeft: spacings.tiny,
            minWidth: dimens.scale(60),
            height: dimens.verticalScale(33),
        },
        view_wrap_item_active: {
            flexDirection: 'row',
            borderColor: colors.main['600'],
            backgroundColor: colors.main['50'],
        },
        view_triangle_check: {
            position: 'absolute',
            width: 0,
            height: 0,
            backgroundColor: 'transparent',
            borderStyle: 'solid',
            borderTopWidth: typography.size(12),
            borderRightWidth: typography.size(12),
            borderBottomWidth: typography.size(12),
            borderLeftWidth: typography.size(12),
            borderTopColor: 'transparent',
            borderRightColor: colors.main['600'],
            borderBottomColor: colors.main['600'],
            borderLeftColor: 'transparent',
            right: 0,
            bottom: 0,
        },
        view_icon_check: {
            position: 'absolute',
            zIndex: 999,
            bottom: 0,
            right: 0,
        },
        /* ------- section body ------- */
        // shipping
        view_title_section_body: {
            width: '100%',
            height: dimens.height * 0.045,
            justifyContent: 'center',
        },
        view_wrap_Info_shipping: {
            width: '100%',
            backgroundColor: colors.grey_['1'],
            borderLeftWidth: 2,
            borderLeftColor: colors.grey_[300],
            paddingLeft: 4,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        //shop info
        view_shop_left: {
            flex: 1,
            flexDirection: 'row',
        },
        touch_shop_info: {
            flex: 1,
            // justifyContent: 'space-between',
            marginLeft: spacings.small,
        },
        view_shop_info: {
            flexDirection: 'row',
            backgroundColor: colors.grey_[100],
            paddingHorizontal: spacings.small,
            paddingVertical: spacings.tiny,
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 5,
        },
        view_shop_button: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: spacings.medium,
        },

        //view more
        view_viewmore: {
            backgroundColor: 'transparent',
            height: dimens.verticalScale(50),
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 5,
            justifyContent: 'center',
        },
        touch_viewmore: {
            alignItems: 'center',
            height: '100%',
            justifyContent: 'center',
        },
        gradient_viewmore: {
            height: 120,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
        },

        view_title_sheet: {
            alignItems: 'center',
            padding: spacings.medium,
            borderBottomWidth: 1,
            borderBottomColor: colors.grey_[300],
        },

        product_item_container: {
            width: dimens.width * 0.3,
            marginBottom: 0,
            marginRight: spacings.small,
        },
        view_wrap_attribute: {
            borderBottomWidth: 1,
            borderBottomColor: colors.grey_[300],
        },
        view_attribute_label: {
            flex: 0.4,
            justifyContent: 'center',
            backgroundColor: colors.grey_[200],
            padding: spacings.medium,
        },
        view_attribute_value: {
            flex: 0.6,
            backgroundColor: colors.grey_[100],
            justifyContent: 'center',
            paddingHorizontal: spacings.medium,
        },
        /* ------- section bottom ------- */
        view_wrap_preview_info: {
            padding: spacings.medium,
            paddingBottom: 0,
            borderTopWidth: 1,
            borderTopColor: colors.grey_[200],
        },
        /* ------- tabbar fixed ------- */
        view_tabbar_container: {
            backgroundColor: colors.white_[10],
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTopWidth: 0.5,
            borderTopColor: colors.grey_[100],
        },
        btn_buy_now_Icon: {
            width: '40%',
            height: '90%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: spacings.tiny,
        },
        btn_icon_tabbar: {
            width: '30%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        view_wrap_small_icon: {
            flex: 0.7,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            borderBottomWidth: 2,
            borderColor: colors.main['400'],
        },
        view_small_btn: {
            paddingHorizontal: spacings.small,
            paddingTop: 2,
            alignItems: 'center',
            justifyContent: 'center',
            height: dimens.verticalScale(50),
        },
        view_wrap_bargain: {
            marginTop: spacings.small,
            paddingTop: spacings.small,
            borderTopWidth: 1,
            borderTopColor: colors.grey_[200],
        },
        view_wrap_bargain_input: {
            flexDirection: 'row',
            alignItems: 'center',
            height: dimens.verticalScale(35),
        },
        view_bargain_input_left: {
            flex: 0.3,
            backgroundColor: colors.grey_[300],
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: spacings.small,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
        },
        input_bargain_: {
            flex: 0.4,
            padding: 0,
            height: '100%',
            textAlign: 'center',
            borderWidth: 1,
            borderColor: colors.grey_[300],
            fontSize: typography.body1,
            color: colors.grey_[500],
        },
        view_bargain_input_right_qty: {
            flex: 0.3,
            flexDirection: 'row',
            backgroundColor: colors.grey_[300],
            height: '100%',
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
        },
        touch_plush_minus: {
            flex: 0.5,
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        view_bargain_input_right_price: {
            flex: 0.3,
            flexDirection: 'row',
            backgroundColor: colors.grey_[300],
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
        },
        /* ------- review screen ------- */
        view_wrap_review_title: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: spacings.small,
            backgroundColor: colors.main['50'],
        },
        view_wrap_start_filter: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: spacings.medium,
            paddingHorizontal: spacings.small,
        },
        touch_star_filter: {
            flexDirection: 'row',
            backgroundColor: colors.grey_[200],
            paddingVertical: spacings.tiny,
            paddingHorizontal: spacings.medium,
            borderRadius: 10,
            marginRight: spacings.small,
            alignItems: 'center',
            marginBottom: spacings.small,
        },
        touch_star_filter_selected: {
            backgroundColor: colors.main['100'],
        },
        view_order_filter: {
            padding: spacings.small,
            paddingBottom: 0,
        },
        touch_filter: {
            flexDirection: 'row',
            paddingVertical: spacings.tiny,
            paddingHorizontal: spacings.medium,
            borderRadius: 5,
            marginRight: spacings.small,
            alignItems: 'center',
            marginBottom: spacings.small,
            borderWidth: 1,
            borderColor: colors.grey_[400],
        },
        touch_filter_selected: {
            borderWidth: 1,
            borderColor: colors.main['600'],
        },
        /* ------- review item ------- */
        touch_image: {
            width: '22.2%',
            aspectRatio: 1,
            marginRight: spacings.medium,
            borderWidth: 1,
            borderColor: colors.grey_[200],
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
        },
        touch_viewmore_image: {
            width: '22.2%',
            aspectRatio: 1,
            marginRight: spacings.medium,
            borderWidth: 1,
            borderColor: colors.grey_[200],
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.black_['10'],
        },
        view_video: { position: 'absolute' },
        /* ------- common ------- */
        view_title_section: {
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: spacings.medium,
            paddingVertical: spacings.medium,
        },
        // txt_titleSection: {
        //     ...typography.bodyStyle(theme)({ fw: 'bold', color:theme.colors.grey_[500] }),
        // },
    });
};

export default useStyles;
