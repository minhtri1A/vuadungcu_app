import { useAppSelector, useIsLogin, useNavigation, useTheme } from 'hooks';
import React, { memo, useEffect, useState } from 'react';
// import SwrCacheConfig from 'components/SwrCacheConfig';

/* eslint-disable react-hooks/exhaustive-deps */
// import useStyles from './styles';
// import { StackNavigationProp } from '@react-navigation/stack';
// interface Props {
//     navigation: StackNavigationProp<any, any>;
// }
import IconButton from 'components/IconButton';
import Image from 'components/Image';
import Pressable from 'components/Pressable';
import { NAVIGATION_TO_SPIN_ATTENDANCE_SCREEN } from 'const/routes';
import useSpinAttendanceSwr from 'hooks/swr/spinSwr/useSpinAttendanceSwr';
import { Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isEmpty } from 'utils/helpers';

interface Props {}

// Lấy kích thước màn hình
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BUBBLE_SIZE = 80; // Kích thước bong bóng

const BubbleWheel = memo(function BubbleWheel({}: Props) {
    //hooks
    const { theme } = useTheme();
    const navigation = useNavigation();
    const isLogin = useIsLogin();
    const insets = useSafeAreaInsets();
    //state
    const [isVisible, setIsvisible] = useState(true);
    const isAppStart = useAppSelector((state) => state.apps.isAppStart);
    //swr
    const { data, mutate, isValidating } = useSpinAttendanceSwr({ revalidateOnMount: false });

    // Effect
    useEffect(() => {
        if (isAppStart && !isValidating) {
            mutate();
        }
    }, [isAppStart]);

    //@Drag item
    const offsetX = useSharedValue(SCREEN_WIDTH - BUBBLE_SIZE - 20);
    const offsetY = useSharedValue(SCREEN_HEIGHT - BUBBLE_SIZE - 30 - insets.bottom);

    // Giá trị thay đổi khi kéo
    // const tabNavigationHeight = theme.dimens.verticalScale(50);
    const translateX = useSharedValue(SCREEN_WIDTH - BUBBLE_SIZE - 20);
    const translateY = useSharedValue(SCREEN_HEIGHT - BUBBLE_SIZE - 30 - insets.bottom);

    // Cử chỉ kéo thả
    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            let newX = event.translationX + offsetX.value;
            let newY = event.translationY + offsetY.value;
            // Giới hạn trong màn hình
            newX = Math.max(0, Math.min(newX, SCREEN_WIDTH - BUBBLE_SIZE));
            newY = Math.max(0, Math.min(newY, SCREEN_HEIGHT - BUBBLE_SIZE - insets.bottom));

            translateX.value = newX;
            translateY.value = newY;
        })
        .onEnd(() => {
            // cap nhat vi tri hien tai cua bubble
            offsetX.value = translateX.value;
            offsetY.value = translateY.value;
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    }));

    const handleHideBubble = () => {
        setIsvisible(false);
    };

    // navigate
    const navgateToWheelScreen = () => {
        navigation.navigate(NAVIGATION_TO_SPIN_ATTENDANCE_SCREEN);
    };

    if (data?.spin?.active === 'N' || isEmpty(data?.spin?.active)) {
        return null;
    }

    if (!isVisible) {
        return null;
    }

    if (!isLogin || data?.customer.status !== 'CAN_SPIN') {
        return null;
    }

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View
                style={[
                    {
                        width: BUBBLE_SIZE,
                        aspectRatio: 1,
                        zIndex: 999999,
                        position: 'absolute',
                    },
                    animatedStyle,
                ]}
            >
                <Pressable activeOpacity={0.9} onPress={navgateToWheelScreen}>
                    <Image source={require('asset/wheel.png')} resizeMode="contain" />
                </Pressable>

                <IconButton
                    activeOpacity={0.9}
                    type="antdesign"
                    name="closecircle"
                    color="red"
                    size={theme.typography.size(20)}
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: theme.colors.white_[10],
                        zIndex: 999,
                    }}
                    onPress={handleHideBubble}
                />
            </Animated.View>
        </GestureDetector>
    );
});

export default BubbleWheel;
