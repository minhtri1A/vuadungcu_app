import { Icon } from '@rneui/themed';
import Touch from 'components/Touch';
import { useNavigate, useTheme } from 'hooks';
import useHeightMetrics from 'hooks/useHeightMetrics';
import React, { memo } from 'react';
import { StatusBar, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { themeType } from 'theme';

interface Props {
    left?: React.ReactNode;
    center?: React.ReactNode;
    right?: React.ReactNode;

    //

    bgColor?: string;
    statusBarColor?: string;
    showGoBack?: boolean;
    iconGoBackColor?: string;
    isShadow?: boolean;
    animatedStyle?: StyleProp<ViewStyle>;
    //
    containerStyle?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    leftStyle?: StyleProp<ViewStyle>;
    centerStyle?: StyleProp<ViewStyle>;
    rightStyle?: StyleProp<ViewStyle>;
}

const Header = memo((props: Props) => {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const { headerBaseHeight, statusBarHeight, headerHeight } = useHeightMetrics();
    const navigate = useNavigate();

    const {
        left,
        center,
        right,

        bgColor = theme.colors.main[500],
        statusBarColor,
        showGoBack,
        iconGoBackColor = theme.colors.white_[10],
        isShadow = true,
        animatedStyle,

        containerStyle,
        contentStyle,
        leftStyle,
        centerStyle,
        rightStyle,
    } = props || {};

    return (
        <View
            style={[
                styles.view_container,
                isShadow ? styles.shadow : {},
                {
                    backgroundColor: statusBarColor ? statusBarColor : bgColor,
                    paddingTop: statusBarHeight,
                },
                containerStyle,
            ]}
        >
            <StatusBar translucent={true} barStyle={'dark-content'} />
            <View
                style={[
                    styles.view_content,
                    { height: headerBaseHeight, backgroundColor: bgColor },
                    contentStyle,
                ]}
            >
                <View style={[styles.view_left, leftStyle]}>
                    {showGoBack && (
                        <Touch onPress={navigate.GO_BACK_ROUTE} activeOpacity={0.75}>
                            <Icon type="ionicon" name="arrow-back" color={iconGoBackColor} />
                        </Touch>
                    )}
                    {left}
                </View>
                <View style={[styles.view_center, centerStyle]}>{center}</View>

                <View style={[styles.view_right, rightStyle]}>{right}</View>
            </View>
            {animatedStyle && (
                <Animated.View
                    style={[styles.view_animated, { height: headerHeight }, animatedStyle]}
                />
            )}
        </View>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_container: {
            flexDirection: 'row',
            alignItems: 'flex-end',
        },
        shadow: { borderBottomColor: theme.colors.grey_[200], borderBottomWidth: 1 },
        view_content: {
            flexDirection: 'row',
            gap: theme.spacings.medium,
            flex: 1,
            alignItems: 'center',
            paddingHorizontal: theme.spacings.medium,
            zIndex: 9999,
        },
        view_left: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        view_center: {
            flex: 1,
        },
        view_right: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        view_animated: {
            position: 'absolute',
            inset: 1,
        },
    });

export default Header;
