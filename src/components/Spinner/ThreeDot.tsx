/* eslint-disable react-native/no-inline-styles */
import View from 'components/View';
import { useTheme } from 'hooks';
import React, { memo } from 'react';
import { ViewStyle } from 'react-native';
import { StyleProp } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

interface Props {
    color?: string;
    size?: number;
    style?: StyleProp<ViewStyle>;
}

export default memo(function ThreeDot(props: Props) {
    const { theme } = useTheme();
    const { color = theme.colors.main[500], size = theme.typography.size(10), style } = props;

    const opacity1 = useSharedValue(0.3);
    const opacity2 = useSharedValue(0.3);
    const opacity3 = useSharedValue(0.3);

    React.useEffect(() => {
        opacity1.value = withRepeat(withTiming(1, { duration: 400 }), -1, true);

        setTimeout(() => {
            opacity2.value = withRepeat(withTiming(1, { duration: 500 }), -1, true);
        }, 200);

        setTimeout(() => {
            opacity3.value = withRepeat(withTiming(1, { duration: 600 }), -1, true);
        }, 400);
    }, []);

    return (
        <View
            style={[
                { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
                style,
            ]}
        >
            {[opacity1, opacity2, opacity3].map((opacity, i) => (
                <Animated.View
                    key={i}
                    style={[
                        {
                            width: size,
                            height: size,
                            margin: 5,
                            backgroundColor: color,
                            borderRadius: 5,
                        },
                        useAnimatedStyle(() => ({ opacity: opacity.value })),
                    ]}
                />
            ))}
        </View>
    );
});
