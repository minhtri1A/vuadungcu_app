import { useTheme } from 'hooks';
import { StyleSheet } from 'react-native';

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        /* -------screen------- */
        view_container: {
            flex: 1,
        },
        scrollview: {
            flex: 1,
        },
        list_titleValue: {
            flex: 1,
            textAlign: 'right',
        },
        view_titleStyle: {
            padding: theme.spacings.tiny,
        },
        list_title_style: {
            fontSize: theme.typography.body2,
        },
        list_sub_title_style: {
            fontSize: theme.typography.sub2,
        },
    });
};

export default useStyles;
