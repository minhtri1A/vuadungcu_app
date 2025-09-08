import { Colors, createTheme, Theme } from '@rneui/themed';
import animation from './animation';
import { lightColors } from './colors';
import { dimens } from './dimens';
import { spacings } from './spacings';
import { styles } from './styles';
import { typography } from './typography';

const theme = createTheme({
    components: {
        Skeleton(props, theme_) {
            return {
                style: {
                    backgroundColor: theme_.colors.grey_[300],
                },
            };
        },
        CheckBox: {
            containerStyle: {
                backgroundColor: 'transparent',
            },
        },
    },
    lightColors: {
        ...lightColors,
    },
    darkColors: {
        ...lightColors,
    },
    typography,
    dimens,
    styles,
    spacings,
    animation: animation,
    mode: 'light', // your light or dark mode value
});

export type themeType = {
    colors: Colors;
} & Theme;

export default theme;
