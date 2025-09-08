import { useTheme } from 'hooks';
import { StyleSheet } from 'react-native';

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        /*-------top screen------ */
        view_topScreenContainer: {
            flex: 1,
            backgroundColor: theme.colors.white_[10],
            justifyContent: 'flex-end',
            zIndex: 1,
            paddingVertical: theme.spacings.tiny,
            paddingBottom: theme.spacings.medium,
        },
        view_title_category: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: theme.spacings.tiny,
            paddingHorizontal: theme.spacings.medium,
        },

        btn_topCategoryContainer: {
            width: theme.dimens.width * 0.25,
            // marginHorizontal: 5,
            alignItems: 'center',
            marginTop: theme.spacings.small,
            // backgroundColor: 'red',
        },
        view_imageCategory: {
            width: '54%',
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            padding: theme.spacings.tiny1,
            // borderWidth: 1,
            // borderColor: theme.colors.main['100'],
            position: 'relative',
            // borderBottomWidth: 1.3,
            // borderBottomColor: 'rgba(255, 181, 88, 1)',
        },
        txt_name_category: {
            // minHeight: theme.dimens.height * 0.06,
            width: '75%',
            textAlign: 'center',
            color: theme.colors.black_[10],
            fontSize: theme.typography.sub3,
            marginTop: theme.spacings.tiny,
        },
    });
};

export default useStyles;
