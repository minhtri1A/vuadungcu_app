/* eslint-disable react-hooks/exhaustive-deps */
import { useTheme } from 'hooks';
import React, { memo, useEffect, useState } from 'react';
import { ActivityIndicator, InteractionManager, StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface Props {
    children: React.ReactNode;
    skeleton?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

//hiện loading khi navigate giữa các trang - chặn tình trạng delay khi navigate
const AfterInteractions = memo(function AfterInteractions({ children, skeleton, style }: Props) {
    const [interactionsComplete, setInteractionsComplete] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        const interactionSubscription = InteractionManager.runAfterInteractions(() => {
            setInteractionsComplete(true);
        });

        return () => {
            interactionSubscription.cancel();
        };
    }, []);

    // useEffect(() => {
    //     if (interactionsComplete) {
    //         Animated.timing(animateTransition, {
    //             toValue: 1,
    //             duration: 100, // Adjust the duration as needed
    //             easing: Easing.ease,
    //             useNativeDriver: false, // Adjust as needed
    //         }).start();
    //     }
    // }, [interactionsComplete]);

    return (
        <>
            {interactionsComplete ? (
                <Animated.View
                    style={[{ flex: 1, backgroundColor: 'transparent' }, style]}
                    entering={FadeIn.duration(300)}
                >
                    {/* <FocusAwareStatusBar
                        translucent={true}
                        backgroundColor="transparent"
                        barStyle={'dark-content'}
                    /> */}
                    {children}
                </Animated.View>
            ) : skeleton ? (
                skeleton
            ) : (
                <ActivityIndicator
                    color={theme.colors.main['600']}
                    size={theme.typography.size(35)}
                    style={{ flex: 0.3 }}
                />
            )}
        </>
    );
});

export default AfterInteractions;
