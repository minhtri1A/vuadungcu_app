import { ButtonProps, Button as RNEButton } from '@rneui/themed';
import { useTheme } from 'hooks';
import React, { memo } from 'react';
import { DimensionValue, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { fontWeightType } from 'theme/typography';

export interface ButtonCustomProps extends ButtonProps {
    styleProps?: StyleProp<ViewStyle>;
    titleSize?:
        | 'sub1'
        | 'sub2'
        | 'sub3'
        | 'body1'
        | 'body2'
        | 'body3'
        | 'title1'
        | 'title2'
        | 'title3'
        | number;
    bgColor?: string;
    flex?: number;
    colors?: string[];
    containerWidth?: DimensionValue;
    color?: string;
    border?: number;
    linear?: boolean;
    minWidth?: DimensionValue;
    fw?: fontWeightType;
}

const Button = memo((props: ButtonCustomProps) => {
    const { theme } = useTheme();

    const {
        title,
        disabled = false,
        colors = theme.colors.primaryGradient,
        flex,
        linear = true,
        type = 'solid',
        containerWidth,
        border = 0.8,
        bgColor = theme.colors.main['600'],
        color = theme.colors.white_[10],
        loading = false,
        ...rest
    } = props;

    const styles = useStyles(props, theme);
    const isDisabled = disabled || loading;
    const color_ = isDisabled ? theme.colors.grey_[400] : color;

    const gradientProps =
        !isDisabled && linear && type === 'solid' && !bgColor
            ? {
                  linearGradientProps: {
                      colors,
                      start: { x: 0.2, y: 0 },
                      end: { x: 0.2, y: 1 },
                  },
                  ViewComponent: LinearGradient,
              }
            : {};

    const outlineStyle =
        type === 'outline'
            ? {
                  borderWidth: border,
                  borderColor: color_,
              }
            : {};

    return (
        <RNEButton
            title={title}
            disabled={isDisabled}
            disabledStyle={styles.disableStyle}
            loading={false}
            {...gradientProps}
            {...rest}
            // icon={
            //     loading ? (
            //         <ActivityIndicator color={color_} />
            //     ) : icon ? (
            //         { ...(icon as any), color: color_ }
            //     ) : undefined
            // }
            containerStyle={[{ width: containerWidth, flex }, props.containerStyle]}
            buttonStyle={[styles.buttonStyle, outlineStyle, props.buttonStyle]}
            titleProps={{
                style: [styles.titleStyle, props.titleStyle],
            }}
        />
    );
});

const useStyles = (props: ButtonCustomProps, theme: ReturnType<typeof useTheme>['theme']) => {
    const {
        bgColor = theme.colors.main['600'],
        type = 'solid',
        size = 'md',
        minWidth,
        fw,
        color = theme.colors.white_[10],
        titleSize = 'body2',
        disabled = false,
        loading = false,
    } = props;

    const fontSize = typeof titleSize === 'string' ? theme.typography[titleSize] : titleSize;
    const isDisabled = disabled || loading;

    return StyleSheet.create({
        buttonStyle: {
            backgroundColor: type === 'solid' ? bgColor : undefined,
            paddingVertical: theme.dimens.sizeElement(size),
            paddingHorizontal: theme.spacings.small,
            minWidth,
            borderRadius: 5,
        },
        titleStyle: {
            fontWeight: fw,
            color: color,
            fontSize,
        },
        disableStyle: {
            opacity: 0.5,
            backgroundColor: isDisabled && type === 'solid' ? bgColor : undefined,
        },
    });
};

export default Button;
