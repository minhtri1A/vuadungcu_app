import { useTheme } from 'hooks';
import { StyleSheet } from 'react-native';

const useStyles = () => {
    const {
        theme: { spacings, colors, dimens },
    } = useTheme();
    return StyleSheet.create({
        /* --- news category section --- */
        category_section_1: {
            width: '30%',
            height: dimens.verticalScale(20),
            backgroundColor: colors.grey_[200],
        },
        category_section_2: {
            width: '100%',
            height: dimens.verticalScale(60),
            backgroundColor: colors.grey_[200],
            marginTop: spacings.small,
        },
        category_section_3: {
            width: '18%',
            backgroundColor: colors.grey_[200],
            height: dimens.verticalScale(70),
        },
        /* --- product section --- */
        view_product_wrap: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            flexWrap: 'wrap',
        },
        view_product_1: {
            backgroundColor: colors.white_[10],
            width: '48%',
            marginTop: spacings.small,
            borderRadius: 5,
            overflow: 'hidden',
            height: dimens.verticalScale(250),
        },
        product_1: {
            width: '100%',
            height: '60%',
            backgroundColor: colors.grey_[200],
        },
        product_2: {
            width: '100%',
            height: dimens.verticalScale(20),
            marginTop: spacings.small,
            backgroundColor: colors.grey_[200],
        },
        product_3: {
            width: '40%',
            height: dimens.verticalScale(20),
            marginTop: spacings.small,
            backgroundColor: colors.grey_[200],
        },
        /* --- common --- */
        skeleton_style: {
            backgroundColor: colors.grey_[300],
        },
    });
};

export default useStyles;
