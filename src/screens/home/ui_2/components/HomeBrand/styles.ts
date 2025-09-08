import { useTheme } from 'hooks';
import { StyleSheet } from 'react-native';

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        view_brandContainer: {
            backgroundColor: theme.colors.white_[10],
            minHeight: theme.dimens.height * 0.26,
        },
        view_brandSlider: {
            width: theme.dimens.width,
            aspectRatio: 16 / 6,
            justifyContent: 'center',
            alignItems: 'center',
        },
        view_brandItemContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: theme.spacings.medium,
            marginBottom: theme.spacings.medium,
        },

        brandTitle: {
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: theme.spacings.small,
            marginTop: theme.spacings.small,
            marginBottom: theme.spacings.small,
        },
        brandItem: {
            marginHorizontal: 9,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: theme.colors.grey_[200],
        },

        ske_brand: {
            aspectRatio: 1,
            width: theme.dimens.width * 0.2,
            borderRadius: 10,
        },
        ske_skeleton: {
            backgroundColor: theme.colors.grey_[200],
        },
    });
};

export default useStyles;
