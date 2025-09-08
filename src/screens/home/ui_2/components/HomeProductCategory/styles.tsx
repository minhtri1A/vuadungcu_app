import { useTheme } from 'hooks';
import { StyleSheet } from 'react-native';

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        /*------home body----- */
        //-body section category
        wrapperSectionCateProduct: {
            flex: 1,
            width: '100%',
            backgroundColor: theme.colors.white_[10],
        },
        view_error: {
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        },

        view_wrapListProduct: {
            minHeight: theme.dimens.height * 0.4,
        },

        scroll_listProduct: {
            paddingLeft: theme.spacings.medium,
            marginTop: theme.spacings.small,
            marginBottom: theme.spacings.small,
        },
        //
        view_emptyProduct: {
            width: theme.dimens.width * 0.93,
            marginRight: theme.spacings.small,
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: theme.spacings.small,
        },

        activeChildCate: {
            backgroundColor: theme.colors.slate[900],
        },
        deActiveChildCate: {
            backgroundColor: theme.colors.white_[10],
        },

        ///-product item
        view_productItemContainer: {
            width: theme.dimens.width * 0.29,
            justifyContent: 'center',
            marginRight: theme.spacings.medium,
            marginBottom: theme.spacings.tiny,
            paddingVertical: 5,
        },

        view_imageProduct: {
            aspectRatio: 1,
            width: '89%',
        },

        view_nameProduct: {
            justifyContent: 'flex-end',
            marginTop: theme.spacings.tiny,
        },
        view_priceProduct: {
            justifyContent: 'flex-start',
        },
        //-list sub category
        childCateProduct: {
            borderWidth: 1,
            justifyContent: 'center',
            borderColor: theme.colors.grey_[200],
            borderRadius: theme.spacings.tiny,
            marginRight: theme.spacings.small - 2,
            marginLeft: theme.spacings.medium,
            padding: theme.spacings.small,
        },
    });
};

export default useStyles;
