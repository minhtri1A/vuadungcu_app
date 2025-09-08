/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import Badge from 'components/Badge';
import Image from 'components/Image';
import View from 'components/View';
import { Status } from 'const/index';
import { NAVIGATION_CART_STACK, NAVIGATION_TO_CART_SCREEN } from 'const/routes';
import { useAppSelector, useCartSwr, useIsLogin, useNavigation, useTheme } from 'hooks';
import React, { memo, useEffect, useState } from 'react';
import { StyleProp, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSWRConfig } from 'swr';

interface Props {
    // add success
    isFlyToCart?: boolean;
    statusAdd?: string;
    imageAddSuccess?: string;
    duration?: number; //delay
    size?: any;
    badgeBgColor?: string;
    color?: string;
    containerStyle?: StyleProp<ViewStyle>;
    iconStyle?: StyleProp<TextStyle>;
    getPosition?: (px: number, py: number) => void;
}

//note:
//--neu de trong header can set flex cho right component de hien thi het birgde

const TouchAnimated = Animated.createAnimatedComponent(TouchableOpacity);
const IconAnimated = Animated.createAnimatedComponent(Icon);

const MiniCart = memo(function MiniCart({
    statusAdd,
    imageAddSuccess,
    size,
    iconStyle,
    color,
    badgeBgColor,
    containerStyle,
    isFlyToCart,
}: Props) {
    //hook
    const { theme } = useTheme();
    const isLogin = useIsLogin();
    const navigation = useNavigation();
    const isAppStart = useAppSelector((state) => state.apps.isAppStart);
    const { cache } = useSWRConfig();
    //swr
    const { key, data, totalItems, isValidating, mutate } = useCartSwr(undefined, {
        revalidateOnMount: false,
        keepPreviousData: true,
    });
    //state
    const [total, setTotal] = useState(totalItems);

    //animated
    const flyOpacity = useSharedValue(0);
    const flyX = useSharedValue(-100);
    const flyY = useSharedValue(100);
    const flyScale = useSharedValue(1);
    const bounce = useSharedValue(1);

    const flyStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: flyX.value },
            { translateY: flyY.value },
            { scale: flyScale.value },
        ],
        opacity: flyOpacity.value,
    }));

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: bounce.value }],
    }));

    useEffect(() => {
        if (isFlyToCart) {
            if (totalItems === total) {
                return;
            }

            if (statusAdd === Status.SUCCESS) {
                flyOpacity.value = withTiming(1, { duration: 100 });
                flyX.value = withDelay(300, withTiming(30, { duration: 1000 }));
                flyY.value = withDelay(300, withTiming(-35, { duration: 1000 }));
                flyScale.value = withDelay(
                    500,
                    withTiming(0, { duration: 1000 }, (isFinished) => {
                        if (isFinished) {
                        }
                    })
                );
                // bounce
                bounce.value = withDelay(
                    1000,
                    withSpring(1.2, { damping: 5, stiffness: 200 }, (isFinished) => {
                        if (isFinished) {
                            flyOpacity.value = 0;
                            flyX.value = -100;
                            flyY.value = 100;
                            flyScale.value = 1;
                            bounce.value = 1;
                        }
                    })
                );

                const timeout = setTimeout(() => {
                    setTotal(totalItems);
                    clearTimeout(timeout);
                }, 1000);

                return;
            }
        }
        // not animated
        setTotal(totalItems);
    }, [statusAdd, totalItems]);

    //effect

    //--check previous login
    useEffect(() => {
        if (isLogin && isAppStart && !isValidating) {
            mutate();
            return;
        }
        if (!isLogin && data) {
            cache.delete(key);
            setTotal('0');
        }
    }, [isLogin]);

    //navigate
    const navigateToCart = () => {
        navigation.navigate(NAVIGATION_CART_STACK, {
            screens: NAVIGATION_TO_CART_SCREEN,
        });
    };

    return (
        <View style={{ position: 'relative' }}>
            <Animated.View
                style={[
                    {
                        // backgroundColor: bgColor,
                        padding: theme.spacings.tiny,
                        borderRadius: 1000,
                    },
                    containerStyle,
                ]}
            >
                <TouchAnimated
                    style={[
                        {
                            aspectRatio: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                        animatedStyle,
                    ]}
                    onPress={navigateToCart}
                    activeOpacity={0.9}
                >
                    <IconAnimated
                        name={'cart-outline'}
                        size={size ? size : theme.typography.size(27)}
                        color={color || theme.colors.white_[10]}
                        style={[iconStyle]}
                    />
                </TouchAnimated>
                <Badge
                    visible={isLogin && parseInt(total) > 0}
                    bg={badgeBgColor}
                    title={total}
                    top={-theme.dimens.verticalScale(1)}
                    right={-theme.dimens.scale(2)}
                    width={theme.dimens.scale(17)}
                    height={theme.dimens.scale(17)}
                    onPress={navigateToCart}
                />
            </Animated.View>

            {statusAdd === Status.SUCCESS && imageAddSuccess !== undefined && isFlyToCart && (
                <Animated.View
                    style={[
                        {
                            position: 'absolute',
                            zIndex: 1000,
                            height: 100,
                            width: 100,
                            top: 0,
                            right: 0,
                        },
                        flyStyle,
                    ]}
                    // entering={BounceIn.duration(300)}
                >
                    {/* https://image.vuadungcu.com/product/may-khoan-dung-pin-lithium-ion-12v-khong-gom-dau-sac-wadfow-wcds525-1739954216.jpeg */}
                    <Image
                        source={{
                            uri: imageAddSuccess,
                        }}
                        resizeMode="contain"
                        radius={10}
                    />
                </Animated.View>
            )}
        </View>
    );
});

export default MiniCart;
