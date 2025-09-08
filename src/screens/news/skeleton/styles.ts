import { useTheme } from 'hooks';
import { StyleSheet } from 'react-native';

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        /* --- news featured --- */
        featured_1: {
            width: '100%',
            height: '100%',
            backgroundColor: theme.colors.grey_[400],
        },
        featured_2: {
            width: '20%',
            height: theme.dimens.verticalScale(10),
            marginTop: theme.spacings.small,
            backgroundColor: theme.colors.grey_[400],
        },
        featured_3: {
            width: '100%',
            height: theme.dimens.verticalScale(30),
            marginTop: theme.spacings.small,
            backgroundColor: theme.colors.grey_[400],
        },
        /* --- news category section --- */
        category_section_1: {
            width: '100%',
            height: theme.dimens.verticalScale(30),
            marginLeft: theme.spacings.small,
        },
        category_section_2: {
            width: '100%',
            height: theme.dimens.verticalScale(10),
            marginLeft: theme.spacings.small,
            marginTop: theme.spacings.small,
        },
        category_section_3: {
            width: '30%',
            height: theme.dimens.verticalScale(20),
        },
        /* --- common --- */
        skeleton_style: {
            backgroundColor: theme.colors.grey_[300],
        },
    });
};

export default useStyles;
