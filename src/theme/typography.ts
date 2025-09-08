import '@rneui/themed';
import { Platform } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

export type fontWeightType =
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | undefined;

export type textAlignType = 'auto' | 'left' | 'right' | 'center' | 'justify' | undefined;

declare module '@rneui/themed' {
    export interface Theme {
        typography: {
            //size
            size: (size: number) => number;

            title4: number;

            title3: number;

            title2: number; // 20px

            title1: number;

            body3: number;

            body2: number; //app

            body1: number; //app

            sub3: number;

            sub2: number;

            sub1: number;

            //font style
            fontFamily: string;
            ///any
            // fontStyleIcon: any;
            //shadow
            // shadow1: any;
            //input
            // inputVariantFilledStyle: any;
            // inputVariantFilledYellowStyle: any;
        };
    }
}

export const typography = {
    size: (size: any) => moderateScale(size),
    title4: moderateScale(24), // normalize(25), //30

    title3: moderateScale(22), // normalize(22.5), //27

    title2: moderateScale(20), // normalize(20), // 24px

    title1: moderateScale(18), // normalize(18), //21//chuan

    body3: moderateScale(16), // normalize(15.5), //18px

    body2: moderateScale(14), // normalize(14), //16px//chuan

    body1: moderateScale(12.5), // normalize(12.5), //14px

    sub3: moderateScale(11), // normalize(11.5), //12px

    sub2: moderateScale(10), // normalize(11.5), //12px

    sub1: moderateScale(8), // normalize(9), //10px

    fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'Roboto',
    //icon
    // fontStyleIcon: {
    //     textAlignVertical: 'center',
    //     fontSize: normalize(18),
    // },
    // //shadow
    // shadow1: {
    //     shadowColor: '#000',
    //     shadowOffset: {
    //         width: 0,
    //         height: 1,
    //     },
    //     shadowOpacity: 0.22,
    //     shadowRadius: 2.22,
    //     elevation: 1,
    // },
    //input
    // inputVariantFilledStyle: {
    //     borderWidth: 0,
    //     borderBottomWidth: 1,
    //     borderColor: 'rgba(189, 189, 189, 1)',
    // },
    // inputVariantFilledYellowStyle: {
    //     borderWidth: 0,
    //     borderBottomWidth: 1,
    //     borderColor: 'rgb(248,158,0)',
    // },
};
