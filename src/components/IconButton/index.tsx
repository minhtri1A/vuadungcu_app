/* eslint-disable react-native/no-inline-styles */
import { Icon, Theme } from '@rneui/themed';
import { useTheme } from 'hooks';
import React, { memo } from 'react';
import {
    ActivityIndicator,
    GestureResponderEvent,
    LayoutChangeEvent,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';

export interface IconButtonProps {
    variant?: 'solid' | 'clear' | 'outline';
    type:
        | 'ionicon'
        | 'material'
        | 'font-awesome'
        | 'font-awesome-5'
        | 'antdesign'
        | 'feather'
        | 'entypo'
        | 'material-community'
        | 'simple-line-icon';
    name: string;
    size?: number;
    color?: string;
    bgColor?: string;
    onPress?: ((event: GestureResponderEvent) => void) | undefined;
    onLayout?: (event: LayoutChangeEvent) => void;
    activeOpacity?: number;
    disable?: boolean;
    style?: StyleProp<ViewStyle>;
    ml?: keyof Theme['spacings'] | number;
    mr?: keyof Theme['spacings'] | number;
    width?: any;
    height?: any;
    loading?: boolean;
    ratio?: number;
}

//touch + icon
export default memo(function IconButton(props: IconButtonProps) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles(props);
    //props
    const {
        type,
        name,
        size,
        color = theme.colors.white_[10],
        activeOpacity,
        disable,
        loading,
        style,
        onPress,
        onLayout,
    } = props;
    //

    //

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={activeOpacity}
            disabled={disable}
            style={[styles.main_style, style]}
            onLayout={onLayout}
        >
            {loading ? (
                <ActivityIndicator size={size} color={color} />
            ) : (
                <Icon type={type} name={name} size={size} color={color} />
            )}
        </TouchableOpacity>
    );
});

const useStyles = (props: IconButtonProps) => {
    //hooks
    const { theme } = useTheme();
    //props
    const {
        variant = 'clear',
        color = theme.colors.white_[10],
        bgColor = theme.colors.main['600'],
        ml,
        mr,
        width,
        height,
        ratio,
    } = props;
    //

    //
    const marginLeft = typeof ml === 'string' ? theme.spacings[ml] : theme.spacings.spacing(ml);
    const marginRight = typeof mr === 'string' ? theme.spacings[mr] : theme.spacings.spacing(mr);
    return StyleSheet.create({
        main_style: {
            width,
            height,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 100,
            backgroundColor: variant === 'solid' ? bgColor : undefined,
            //border
            borderWidth: variant === 'outline' ? 1 : undefined,
            borderColor: color,
            marginLeft,
            marginRight,
            padding: variant === 'solid' ? theme.spacings.tiny1 : 0,
            aspectRatio: ratio,
        },
    });
};
