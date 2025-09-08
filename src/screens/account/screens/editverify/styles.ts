import { useTheme } from 'hooks';
import { StyleSheet } from 'react-native';

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        /* ------- common ------- */
        view_containerEditScreen: {
            flex: 1,
            backgroundColor: theme.colors.white_[10],
            padding: theme.spacings.medium,
        },
        /* -------email edit------- */
        view_wrapRadioEmail: {
            flexDirection: 'row',
            justifyContent: 'center',
        },

        //email edit
    });
};

export default useStyles;
