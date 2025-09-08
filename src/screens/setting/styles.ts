import { useTheme } from 'hooks';
import { StyleSheet } from 'react-native';

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        /* screen */
        view_container: {
            flex: 1,
            backgroundColor: theme.colors.bgMain,
        },
        scrollview: {
            flex: 1,
        },
        list_containerStyle: {
            justifyContent: 'space-between',
            padding: theme.spacings.medium,
            paddingLeft: theme.spacings.small,
            paddingRight: theme.spacings.small,
            backgroundColor: theme.colors.white_[10],
        },
        list_title_style: {
            fontSize: theme.typography.body2,
            color: theme.colors.black_[10],
        },
        list_sub_title_style: {
            fontSize: theme.typography.sub2,
        },
    });
};

export default useStyles;
