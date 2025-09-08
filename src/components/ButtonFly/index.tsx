/* eslint-disable react-hooks/exhaustive-deps */
import Button, { ButtonCustomProps } from 'components/Button';
import IconButton, { IconButtonProps } from 'components/IconButton';
import View from 'components/View';
import { Status } from 'const/index';
import React, { memo, useEffect, useRef, useState } from 'react';
import {
    Animated,
    LayoutChangeEvent,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Ripple, { RippleProps } from 'react-native-material-ripple';

interface Props {
    //status === success se kich hoat animated
    status?: string;
    //click se hien animated khong rang buoc status - false se dua vao status de trigger animated
    isFreeFly?: boolean;
    type?: 'button' | 'icon_button' | 'touch' | 'ripple';
    buttonProps?: ButtonCustomProps;
    iconButtonProps?: IconButtonProps;
    rippleProps?: RippleProps;
    btnChildren?: React.ReactNode;
    toY: number;
    toX: number;
    duration?: number;
    rotate?: boolean;
    viewFlyStyle?: StyleProp<ViewStyle>;
    isLoadingButton?: boolean;
    //la thanh phan se fly
    children: React.ReactNode;
    //interpolateX 0 < 1
    inputRangeX?: Array<number>;
    outputRangeX?: Array<number>;
    inputRangeY?: Array<number>;
    outputRangeY?: Array<number>;
    onPress?: () => void;
    //kich hoat khi animated ket thuc - dung reset status ve default
    onEnd?: () => void;
}

const ButtonFly = memo(function ButtonFly({
    isFreeFly = true,
    status,
    type = 'button',
    buttonProps,
    iconButtonProps,
    isLoadingButton,
    rippleProps,
    btnChildren,
    toY = 0,
    toX = 0,
    duration = 1000,
    children,
    viewFlyStyle,
    rotate = true,
    inputRangeX,
    outputRangeX,
    inputRangeY,
    outputRangeY,
    onPress,
    onEnd,
}: Props) {
    //hooks
    const styles = useStyles();
    //state
    const [finishAnimated, setFinishAnimated] = useState(true);
    //animated
    const fromX = useRef(0);
    const fromY = useRef(0);

    const xAnimated = useRef(new Animated.Value(fromX.current || 0));
    const yAnimated = useRef(new Animated.Value(fromY.current || 0));
    // const [opacityAnimated, setPacityAnimated] = useState(new Animated.Value(0));
    const opacityAnimated = useRef(new Animated.Value(0));
    const rotateAnimated = useRef(new Animated.Value(0));
    const opacityAnimated_ = opacityAnimated.current.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 1, 0],
        extrapolate: 'clamp',
    });
    const rotateAnimated_ = rotateAnimated.current.interpolate({
        inputRange: [0, 0.8],
        outputRange: ['0deg', '360deg'],
        extrapolate: 'clamp',
    });
    //--interpo x-y
    // input phai nho hon 1 vi 1 la gia tri cua vi tri can fly den
    const toValueX = fromX.current > toX ? -(fromX.current - toX) : toX - fromX.current;
    const toValueY = fromY.current > toY ? -(fromY.current - toY) : toY - fromY.current;

    const inputRangeX_ = inputRangeX ? [...inputRangeX, 1] : [0, 1];
    const outputRangeX_ = outputRangeX ? [...outputRangeX, toValueX] : [0, toValueX];

    const inputRangeY_ = inputRangeY ? [...inputRangeY, 1] : [0, 1];
    const outputRangeY_ = outputRangeY ? [...outputRangeY, toValueY] : [0, toValueY];

    const xAnimated_ = rotateAnimated.current.interpolate({
        inputRange: inputRangeX_,
        outputRange: outputRangeX_,
        extrapolate: 'clamp',
    });
    const yAnimated_ = rotateAnimated.current.interpolate({
        inputRange: inputRangeY_,
        outputRange: outputRangeY_,
        extrapolate: 'clamp',
    });

    //effect
    //--kich hoat animated khi status success(call api success)
    useEffect(() => {
        if (status === Status.SUCCESS) {
            flyAnimated();
        }
    }, [status]);

    const flyAnimated = () => {
        Animated.parallel([
            Animated.timing(yAnimated.current, {
                toValue: 1,
                duration: duration,
                useNativeDriver: true,
            }),
            Animated.timing(xAnimated.current, {
                toValue: 1,
                duration: duration,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnimated.current, {
                toValue: 1,
                duration: duration,
                useNativeDriver: true,
            }),
            Animated.timing(rotateAnimated.current, {
                toValue: 1,
                duration: duration,
                useNativeDriver: true,
            }),
        ]).start(() => {
            xAnimated.current.setValue(0);
            yAnimated.current.setValue(0);
            opacityAnimated.current.setValue(0);
            rotateAnimated.current.setValue(0);

            //ngan chan bam khi animated chua finish
            setFinishAnimated(true);
            if (onEnd) {
                onEnd();
            }
            showMessage({
                message: 'Thêm sản phẩm vào giỏ hàng thành công!',
                type: 'success',
                icon: 'success',
            });
        });
    };

    const handleOnPress = () => {
        if (onPress) {
            onPress();
            if (isFreeFly) {
                setFinishAnimated(false);
                if (finishAnimated) {
                    flyAnimated();
                }
            }
        }
    };

    const handleEventLayout = (event: LayoutChangeEvent) => {
        event.currentTarget.measure((_, __, ___, ____, px, py) => {
            fromY.current = py ? py : 0;
            fromX.current = px ? px : 0;
        });
    };

    //render

    const renderButton = () =>
        type === 'button' ? (
            <Button
                {...buttonProps}
                onPress={handleOnPress}
                onLayout={handleEventLayout}
                loading={isLoadingButton && status === Status.LOADING}
                // loading={true}
                style={styles.btn_fly}
            />
        ) : type === 'icon_button' ? (
            <IconButton
                {...(iconButtonProps as any)}
                onPress={handleOnPress}
                onLayout={handleEventLayout}
                activeOpacity={0.9}
                loading={isLoadingButton && status === Status.LOADING}
                style={styles.btn_fly}
            />
        ) : type === 'touch' ? (
            <TouchableOpacity
                onPress={handleOnPress}
                onLayout={handleEventLayout}
                activeOpacity={0.9}
                style={styles.btn_fly}
            >
                {btnChildren}
            </TouchableOpacity>
        ) : (
            <Ripple
                rippleCentered
                onPress={handleOnPress}
                onLayout={handleEventLayout}
                style={styles.btn_fly}
                {...rippleProps}
            >
                {btnChildren}
            </Ripple>
        );

    const renderAnimatedView = () => (
        <Animated.View
            style={[
                {
                    transform: [
                        { translateY: yAnimated_ },
                        { translateX: xAnimated_ },
                        { rotate: rotate ? rotateAnimated_ : '0deg' },
                    ],
                    opacity: opacityAnimated_,
                },
                styles.view_fly,
                viewFlyStyle,
            ]}
        >
            {children}
        </Animated.View>
    );

    return (
        <View style={styles.view_button}>
            {renderButton()}
            {renderAnimatedView()}
        </View>
    );
});

const useStyles = () => {
    // const { theme } = useTheme();
    return StyleSheet.create({
        view_contaier: {
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
        },
        view_button: {
            position: 'relative',
        },
        btn_fly: {
            zIndex: 1000,
        },
        view_fly: {
            position: 'absolute',
            zIndex: 999,
        },
    });
};

export default ButtonFly;
