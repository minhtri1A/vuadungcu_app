import { useTheme } from 'hooks';
import { StatusBar, StyleSheet } from 'react-native';

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        /* --- news list --- */
        // news featured
        view_featured_image: {
            width: '100%',
            aspectRatio: 1,
            // borderRadius: 10,
            // overflow: 'hidden',
        },
        // news category
        view_category_section: {
            elevation: 1,
            backgroundColor: theme.colors.white_[10],
            marginTop: theme.spacings.medium,
            padding: theme.spacings.medium,
            borderRadius: 10,
        },
        txt_section_title: {
            borderBottomWidth: 2,
            borderBottomColor: theme.colors.main['600'],
            width: 'auto',
            alignSelf: 'flex-start',
            marginBottom: theme.spacings.extraLarge,
        },
        // news sort
        view_sort_section: {
            backgroundColor: theme.colors.white_[10],
            marginBottom: theme.spacings.medium,
            padding: theme.spacings.small,
            borderRadius: 10,
            elevation: 1,
        },
        view_sort_title: {
            marginBottom: theme.spacings.extraLarge,
            justifyContent: 'center',
            alignItems: 'center',
        },
        txt_sort_title: {
            textAlign: 'center',
            fontSize: theme.typography.title1,
            borderBottomWidth: 2,
            borderBottomColor: theme.colors.main['600'],
        },
        view_sort_items: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
        },
        /* --- news drawer --- */
        view_drawer_container: {
            paddingTop: StatusBar.currentHeight,
            flex: 1,
            padding: theme.spacings.small,
        },
        view_drawer_bot_item: {
            borderTopWidth: 1,
            borderTopColor: theme.colors.grey_[300],
            marginTop: theme.spacings.small,
            alignItems: 'center',
        },
        touch_drawer_item: {
            padding: theme.spacings.small,
            borderWidth: 1,
            borderColor: theme.colors.grey_[300],
            marginTop: theme.spacings.small,
            width: '100%',
            borderRadius: 5,
        },
        /* --- news detail --- */
        // body content
        view_body: {
            flex: 1,
            paddingTop: theme.spacings.large,
            backgroundColor: theme.colors.white_[10],
        },
        view_content: {
            padding: theme.spacings.medium,
            // alignItems: 'center',
        },
        // body tab
        view_bottom_tab: {
            backgroundColor: theme.colors.white_[10],
            borderTopWidth: 1,
            borderTopColor: theme.colors.grey_[100],
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: theme.spacings.medium,
            paddingVertical: theme.spacings.tiny,
            alignItems: 'center',
        },
        // bottom sheet option
        view_option_title: {
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey_[200],
            paddingBottom: theme.spacings.small,
            marginBottom: theme.spacings.small,
        },
        view_option_item: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacings.extraLarge,
        },
        slider_thumb_style: {
            width: theme.dimens.scale(10),
            aspectRatio: 1,
            backgroundColor: theme.colors.main['600'],
        },
        touch_btn_change_1: {
            padding: theme.spacings.tiny,
            flex: 0.5,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
        },
        touch_btn_change_2: {
            padding: theme.spacings.tiny,
            flex: 0.5,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
        },
        //common
        view_swiper: {
            width: '100%',
            // height: 450,
            borderRadius: 10,
            aspectRatio: 0.8,
            // overflow: 'visible',
            backgroundColor: theme.colors.white_[10],
        },
        dotSwiper: {
            backgroundColor: theme.colors.grey_[300],
            width: theme.spacings.medium,
            height: theme.dimens.verticalScale(1.5),
            marginLeft: theme.spacings.tiny,
            marginRight: theme.spacings.tiny,
            marginTop: theme.spacings.tiny,
            marginBottom: theme.spacings.default * 8,
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
            marginBottom: theme.spacings.default * 8,
        },
    });
};

export default useStyles;
