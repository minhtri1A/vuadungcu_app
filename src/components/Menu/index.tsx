/* eslint-disable react-hooks/exhaustive-deps */
import Button, { ButtonCustomProps } from 'components/Button';
import IconButton, { IconButtonProps } from 'components/IconButton';
import View from 'components/View';
import { useTheme } from 'hooks';
import React, { Ref, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Animated, Platform, StyleSheet, TouchableOpacity, UIManager } from 'react-native';
import { themeType } from 'theme';

interface Props {
    children: React.ReactNode;
    buttonProps?: ButtonCustomProps;
    iconButtonProps?: IconButtonProps;
    onVisibleCollapse?: (isVisible: boolean) => void;
}

export interface MenuRef {
    handleVisibleMenu: () => void;
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Menu = forwardRef(function Menu(props: Props, ref: Ref<MenuRef>) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const [visible, setVisible] = useState(false);
    //props
    const { children, buttonProps, iconButtonProps, onVisibleCollapse } = props;
    //animation
    const AnimationTouch = Animated.createAnimatedComponent(TouchableOpacity);
    const animation = useRef(new Animated.Value(0));
    const animationOpacity = useRef(new Animated.Value(0));
    const animationWidth = animation.current.interpolate({
        inputRange: [0, 1],
        outputRange: [0, theme.dimens.width],
        extrapolate: 'clamp',
    });

    const animationHeight = animation.current.interpolate({
        inputRange: [0, 1],
        outputRange: [0, theme.dimens.height],
        extrapolate: 'clamp',
    });

    useEffect(() => {
        if (visible) {
            openAnimation();
        } else {
            hideAnimation();
        }
    }, [visible]);

    //handle
    const handleVisibleMenu = () => {
        // LayoutAnimation.configureNext({
        //     duration: 500,
        //     update: { type: 'linear', property: 'opacity', springDamping: 0.8 },
        // });

        setVisible((pre) => !pre);
    };

    useImperativeHandle(ref, () => ({
        handleVisibleMenu,
    }));

    //fade animation
    const openAnimation = () => {
        Animated.sequence([
            Animated.timing(animation.current, {
                toValue: 1,
                duration: 100,
                useNativeDriver: false,
            }),
            Animated.timing(animationOpacity.current, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start();
    };
    const hideAnimation = () => {
        Animated.sequence([
            Animated.timing(animationOpacity.current, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }),
            Animated.timing(animation.current, {
                toValue: 0,
                duration: 100,
                useNativeDriver: false,
            }),
        ]).start();
    };

    return (
        <View style={{ position: 'relative' }}>
            {iconButtonProps ? (
                <IconButton activeOpacity={0.9} {...iconButtonProps} onPress={handleVisibleMenu} />
            ) : buttonProps ? (
                <Button {...buttonProps} onPress={handleVisibleMenu} />
            ) : null}
            <AnimationTouch
                style={[styles.view_container, { width: animationWidth, height: animationHeight }]}
                onPress={handleVisibleMenu}
                activeOpacity={1}
            >
                <Animated.View
                    style={[
                        styles.view_wrap_content,
                        {
                            transform: [{ scale: animationOpacity.current }],
                        },
                    ]}
                >
                    {children}
                </Animated.View>
            </AnimationTouch>
        </View>
    );
});

// const Menu = memo(function Menu(props: Props) {
//     //hooks
//     const { theme } = useTheme();
//     const styles = useStyles(theme);
//     const [visible, setVisible] = useState(false);
//     //props
//     const { isVisible, children, buttonProps, iconButtonProps, onVisibleCollapse } = props;
//     //animation
//     const AnimationTouch = Animated.createAnimatedComponent(TouchableOpacity);
//     const animation = useRef(new Animated.Value(0));
//     const animationOpacity = useRef(new Animated.Value(0));
//     const animationWidth = animation.current.interpolate({
//         inputRange: [0, 1],
//         outputRange: [0, theme.dimens.width],
//         extrapolate: 'clamp',
//     });

//     const animationHeight = animation.current.interpolate({
//         inputRange: [0, 1],
//         outputRange: [0, theme.dimens.height],
//         extrapolate: 'clamp',
//     });

//     useEffect(() => {
//         if (visible) {
//             openAnimation();
//         } else {
//             hideAnimation();
//         }
//     }, [visible]);
//     useEffect(() => {
//         if (isVisible !== undefined) {
//             setVisible(isVisible);
//         }
//     }, [isVisible]);

//     //handle
//     const handleVisibleMenu = () => {
//         // LayoutAnimation.configureNext({
//         //     duration: 500,
//         //     update: { type: 'linear', property: 'opacity', springDamping: 0.8 },
//         // });

//         setVisible((pre) => !pre);
//     };

//     //fade animation
//     const openAnimation = () => {
//         Animated.sequence([
//             Animated.timing(animation.current, {
//                 toValue: 1,
//                 duration: 100,
//                 useNativeDriver: false,
//             }),
//             Animated.timing(animationOpacity.current, {
//                 toValue: 1,
//                 duration: 200,
//                 useNativeDriver: false,
//             }),
//         ]).start();
//     };
//     const hideAnimation = () => {
//         Animated.sequence([
//             Animated.timing(animationOpacity.current, {
//                 toValue: 0,
//                 duration: 200,
//                 useNativeDriver: false,
//             }),
//             Animated.timing(animation.current, {
//                 toValue: 0,
//                 duration: 100,
//                 useNativeDriver: false,
//             }),
//         ]).start();
//     };

//     return (
//         <View style={{ position: 'relative', zIndex: 9999999 }}>
//             {iconButtonProps ? (
//                 <IconButton {...iconButtonProps} onPress={handleVisibleMenu} activeOpacity={0.9} />
//             ) : buttonProps ? (
//                 <Button {...buttonProps} onPress={handleVisibleMenu} />
//             ) : null}
//             <AnimationTouch
//                 style={[styles.view_container, { width: animationWidth, height: animationHeight }]}
//                 onPress={handleVisibleMenu}
//                 activeOpacity={1}
//             >
//                 <Animated.View
//                     style={[
//                         styles.view_wrap_content,
//                         {
//                             transform: [{ scale: animationOpacity.current }],
//                         },
//                     ]}
//                 >
//                     {children}
//                 </Animated.View>
//             </AnimationTouch>
//         </View>
//     );
// });

const useStyles = (theme: themeType) => {
    return StyleSheet.create({
        view_container: {
            position: 'absolute',
            top: 25,
            right: 0,
            width: theme.dimens.width,
            height: 1000,
            zIndex: 99999999,
            backgroundColor: 'transparent',
        },
        view_wrap_content: {
            backgroundColor: theme.colors.white_[10],
            padding: theme.spacings.small,
            alignSelf: 'flex-end',
            borderRadius: 5,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 5,
            },
            shadowOpacity: 0.34,
            shadowRadius: 6.27,
            elevation: 10,
        },
    });
};

export default Menu;
