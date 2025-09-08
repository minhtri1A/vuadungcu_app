import '@rneui/themed';
import { lightColors } from './colors';
import { spacings } from './spacings';
import { typography } from './typography';

declare module '@rneui/themed' {
    export interface Theme {
        styles: {
            iconStyle: {};
            shadow1: {};
            shadow2: {};
            shadow3: {};
            inputVariantFilledStyle: {};
            inputVariantFilledYellowStyle: {};
            checkbox_container: {};
        };
    }
}

export const styles = {
    iconStyle: {
        textAlignVertical: 'center',
        fontSize: typography.title1,
    },
    //shadow
    shadow1: {
        shadowColor: lightColors.black_['10'],
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
    },
    shadow2: {
        shadowColor: lightColors.black_['10'],
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    shadow3: {
        shadowColor: lightColors.black_['10'],
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    inputVariantFilledStyle: {
        borderWidth: 0,
        borderBottomWidth: 1,
        borderColor: lightColors.grey_[400],
    },
    inputVariantFilledYellowStyle: {
        borderWidth: 0,
        borderBottomWidth: 1,
        borderColor: lightColors.main['600'],
    },

    checkbox_container: {
        padding: 0,
        margin: 0,
        marginLeft: 0,
        marginRight: 0,
    },

    list_containerStyle: {
        justifyContent: 'space-between',
        padding: spacings.medium,
        paddingLeft: spacings.small,
        paddingRight: spacings.small,
        backgroundColor: lightColors.white_[10],
    },
};
