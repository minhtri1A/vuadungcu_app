import { Icon, IconProps } from '@rneui/themed';
import Text, { TextCustomProps } from 'components/Text';
import View, { ViewCustomProps } from 'components/View';
import { useTheme } from 'hooks';
import React, { memo } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { themeType } from 'theme';
import Divider from '../Divider';

interface Props {
    containerProps?: ViewCustomProps;
    wrapperContainerProps?: ViewCustomProps;
    size?: 'lg' | 'md' | 'sm';
    wrapperContainerStyle?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    titleContainerStyle?: StyleProp<ViewStyle>;
    flexLeft?: number;
    viewLeftStyle?: StyleProp<ViewStyle>;
    viewRightStyle?: StyleProp<ViewStyle>;
    viewSubTitleLeftProps?: ViewCustomProps;

    titleLeft?: string;
    titleRight?: string;
    subTitleLeft?: string;
    subTitleRight?: string;
    titleLeftProps?: TextCustomProps;
    titleRightProps?: TextCustomProps;
    subTitleLeftProps?: TextCustomProps;
    subTitleRightProps?: TextCustomProps;

    IconLeft?: any;
    IconRight?: any;
    iconLeftProps?: IconProps;
    iconRightProps?: IconProps;
    chevron?: boolean;
    chevronSize?: any;
    chevronColor?: any;
    onPress?(): any;
    dividerTop?: boolean;
    dividerOutTop?: boolean;
    dividerBottom?: boolean;
    dividerOutBottom?: boolean;
    activeOpacity?: number;
    //
}
//Để điều chỉnh width của title left or right set flex trong view_left or view_left

const Title = memo(function Title(props: Props) {
    //hook
    const { theme } = useTheme();

    //value
    const {
        containerProps,
        wrapperContainerProps,
        size,
        wrapperContainerStyle,
        containerStyle,
        titleContainerStyle,
        flexLeft = 0.5,
        viewLeftStyle,
        viewRightStyle,
        viewSubTitleLeftProps,

        titleLeft,
        titleRight,
        subTitleLeft,
        subTitleRight,
        titleLeftProps,
        titleRightProps,
        subTitleLeftProps,
        subTitleRightProps,

        IconLeft,
        IconRight,
        iconLeftProps,
        iconRightProps,
        chevron,
        chevronSize,
        chevronColor,
        onPress,
        dividerTop,
        dividerOutTop,
        dividerBottom,
        dividerOutBottom,
        activeOpacity = 1,
    } = props;
    const styles = useStyles(theme, { size });
    return (
        <View style={wrapperContainerStyle} {...wrapperContainerProps}>
            {dividerOutTop ? <Divider /> : null}
            {dividerTop ? <Divider height={0.7} /> : null}
            <View style={containerStyle} bg={theme.colors.white_[10]} {...containerProps}>
                <TouchableOpacity
                    style={[styles.title_containerStyle, titleContainerStyle]}
                    onPress={onPress}
                    activeOpacity={activeOpacity}
                >
                    {/* left */}
                    <View style={[styles.view_left, viewLeftStyle]} flex={flexLeft}>
                        <View style={styles.view_leftWrapTitle}>
                            {iconLeftProps ? (
                                <View style={styles.view_Icon}>
                                    <Icon {...iconLeftProps} />
                                </View>
                            ) : null}
                            {IconLeft ? IconLeft : null}
                            <View>
                                <Text numberOfLines={1} {...titleLeftProps}>
                                    {titleLeft}
                                </Text>
                                {subTitleLeft ? (
                                    <View {...viewSubTitleLeftProps}>
                                        <Text
                                            ellipsizeMode="tail"
                                            numberOfLines={1}
                                            {...subTitleLeftProps}
                                        >
                                            {subTitleLeft}
                                        </Text>
                                    </View>
                                ) : null}
                            </View>
                        </View>
                    </View>
                    {/* right */}
                    <View style={[styles.view_right, viewRightStyle]} flex={1 - flexLeft}>
                        <View style={styles.view_rightWrapTitle}>
                            {iconRightProps ? (
                                <View style={styles.view_Icon}>
                                    <Icon size={theme.typography.title1} {...iconRightProps} />
                                </View>
                            ) : null}

                            {titleRight ? (
                                <Text ellipsizeMode="tail" numberOfLines={1} {...titleRightProps}>
                                    {titleRight}
                                </Text>
                            ) : null}
                            {IconRight ? IconRight : null}
                            {chevron ? (
                                <View style={styles.view_chevronIcon}>
                                    <Icon
                                        type={'ionicon'}
                                        name="chevron-forward-outline"
                                        size={chevronSize ? chevronSize : theme.typography.body2}
                                        color={
                                            chevronColor ? chevronColor : theme.colors.grey_[400]
                                        }
                                        // containerStyle={{ marginRight: -5 }}
                                    />
                                </View>
                            ) : null}
                        </View>
                        {subTitleRight ? (
                            <Text {...subTitleRightProps}>{subTitleRight}</Text>
                        ) : null}
                    </View>
                </TouchableOpacity>
            </View>
            {dividerBottom ? <Divider height={1} /> : null}
            {dividerOutBottom ? <Divider /> : null}
        </View>
    );
});

const useStyles = (theme: themeType, { size = 'md' }: Props) => {
    return StyleSheet.create({
        title_containerStyle: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: theme.dimens.sizeElement(size),
            paddingHorizontal: theme.spacings.medium,
        },
        //left
        view_left: {
            justifyContent: 'center',
            marginRight: theme.spacings.extraLarge,
        },
        view_leftWrapTitle: {
            flexDirection: 'row',
            alignItems: 'center',
        },

        txt_titleLeft: {
            fontSize: theme.typography.body2,
            color: theme.colors.slate[900],
        },
        //right
        view_rightWrapTitle: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        txt_titleRight: {},
        //chervon
        view_chevronIcon: {},
        //common
        view_Icon: {
            marginRight: theme.spacings.small,
        },
        view_right: {
            justifyContent: 'center',
            alignItems: 'flex-end',
        },
    });
};
export default Title;
