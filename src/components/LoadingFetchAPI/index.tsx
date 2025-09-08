import Text from 'components/Text';
import { useTheme } from 'hooks';
import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface Props {
    styleView?: StyleProp<ViewStyle>;
    styleText?: any;
    titleText?: any;
    color?: string;
    size?: any;
    visible: any;
}

const LoadingFetchAPI = ({ styleView, titleText = null, size, visible, color }: Props) => {
    const { theme } = useTheme();
    const styles = useStyles();

    return visible ? (
        <View style={[styles.view_container, styleView]}>
            <ActivityIndicator size={size} color={color || theme.colors.main['600']} />
            {titleText ? (
                <Text size={'body1'} ta="center" color={color}>
                    {titleText}
                </Text>
            ) : null}
        </View>
    ) : (
        <></>
    );
};

export default LoadingFetchAPI;

const useStyles = () =>
    StyleSheet.create({
        view_container: {
            width: '100%',
            height: '100%',
            justifyContent: 'center',
        },
    });
