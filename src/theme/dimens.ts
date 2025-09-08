import { Dimensions, StatusBar } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

declare module '@rneui/themed' {
    export interface Theme {
        dimens: {
            width: number;
            height: number;
            sizeElement: (size: 'lg' | 'md' | 'sm') => number;
            scale(size: number): number;
            verticalScale(size: number): number;
            moderateScale(size: number, factor?: number | undefined): number;
            //
            inputHeight: number;
            statusBarHeight: number;
        };
    }
}

const dimensions = Dimensions.get('screen');

//1wp === 3, 1 hp ===7
const width = dimensions.width > dimensions.height ? dimensions.height : dimensions.width; //width
const height = dimensions.height > dimensions.width ? dimensions.height : dimensions.width; //width;
const baseSpacing = verticalScale(11);

const statusBarHeight: any = StatusBar.currentHeight;
const inputHeight = verticalScale(41);
//kich thuoc cua button, textinput - set padding
const sizeElement = (size: 'lg' | 'md' | 'sm') =>
    size === 'lg' ? baseSpacing * 1.3 : size === 'sm' ? baseSpacing * 0.6 : baseSpacing * 0.9;

export const dimens = {
    width: width,
    height: height,
    sizeElement,
    inputHeight,
    statusBarHeight,
    //dung de responsive khi set with height cac muc nho - khong can dung toi diment.with,height
    scale, //width
    verticalScale, //height
    moderateScale, //scalce font spacing
};
