import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import { StyleProp, View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';

interface Props {
    color?: string;
    size?: number;
    style?: StyleProp<ViewStyle>;
}

const PulseIndicator = ({ color, size = 20, style }: Props) => {
    const scale = useSharedValue(0);

    useEffect(() => {
        scale.value = withRepeat(
            withTiming(2, { duration: 1000, easing: Easing.linear }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: 0.5,
    }));

    return (
        <View
            style={[
                {
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                },
                style,
            ]}
        >
            <Animated.View
                style={[
                    {
                        width: size,
                        height: size,
                        backgroundColor: color,
                        borderRadius: 10000,
                        position: 'absolute',
                    },
                    animatedStyle,
                ]}
            />
            <Animated.View
                style={[
                    {
                        width: size / 1,
                        height: size / 1,
                        backgroundColor: color,
                        borderRadius: 10000,
                        position: 'absolute',
                        opacity: 0.8,
                    },
                    animatedStyle,
                ]}
            />
        </View>
    );
};

export default PulseIndicator;
