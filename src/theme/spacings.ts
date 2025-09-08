import { moderateScale } from 'react-native-size-matters';

declare module '@rneui/themed' {
    export interface Theme {
        spacings: {
            tiny: number;
            tiny1: number;
            small: number;
            medium: number;
            large: number;
            extraLarge: number;
            default: number;
            spacing: (size?: number) => any;
        };
    }
}

const baseSpacing = moderateScale(10);
export const spacings = {
    tiny: baseSpacing * 0.4,
    tiny1: baseSpacing * 0.6,
    small: baseSpacing * 0.8,
    medium: baseSpacing * 1.2,
    large: baseSpacing * 1.6,
    extraLarge: baseSpacing * 2.4,
    default: baseSpacing,
    spacing: (size?: number) => (size ? moderateScale(size) : undefined),
};
