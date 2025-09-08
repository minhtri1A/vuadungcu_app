/* eslint-disable react-native/no-inline-styles */
import Text from 'components/Text';
import { useTheme } from 'hooks';
import React, { memo } from 'react';
import { GestureResponderEvent, StyleSheet, TouchableOpacity } from 'react-native';
/*

*/

interface IProps {
    visible: boolean;
    title: string;
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    bg?: string;
    color?: string;
    width?: number;
    height?: number;
    onPress?: ((event: GestureResponderEvent) => void) | undefined;
}

export default memo(function Badge(props: IProps) {
    //hôk
    const styles = useStyles(props);
    const { theme } = useTheme();
    //props
    const { title, color = theme.colors.grey_[100], onPress, visible } = props;
    //color

    if (!visible) {
        return null;
    }

    return (
        <TouchableOpacity activeOpacity={0.9} style={styles.touch} onPress={onPress}>
            <Text ta="center" color={color} size={'sub2'}>
                {title}
            </Text>
        </TouchableOpacity>
    );
});

const useStyles = ({ top, bottom, left, right, bg, width, height }: IProps) => {
    const { theme } = useTheme();

    return StyleSheet.create({
        touch: {
            position: 'absolute',
            top,
            bottom,
            left,
            right,
            backgroundColor: bg || theme.colors.red[500],
            borderRadius: 1000,
            minWidth: width ?? theme.dimens.moderateScale(19),
            height: height ?? theme.dimens.moderateScale(19),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: theme.spacings.tiny,
        },
    });
};
