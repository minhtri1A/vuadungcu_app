import { Animated } from 'react-native';

declare module '@rneui/themed' {
    export interface Theme {
        animation(
            initialValue: any,
            input: Array<any>,
            output: Array<any>
        ): Animated.AnimatedInterpolation<string | number>;
    }
}

const animation = (initialValue: any, input: any = [], output: any = []) => {
    return initialValue.interpolate({
        inputRange: input,
        outputRange: output,
        extrapolate: 'clamp',
    });
};

export type animationType = typeof animation;

export default animation;
