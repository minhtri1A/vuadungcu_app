import { Header as H, HeaderProps } from '@rneui/themed';
import IconButton from 'components/IconButton';
import { useNavigation, useTheme } from 'hooks';
import { includes, omitBy } from 'lodash';
import React, { memo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated from 'react-native-reanimated';

interface Props extends HeaderProps {
    statusBarColor?: string;
    shadow?: boolean;
    //animated
    colorsAnimated?: any[];
    animated?: boolean;
    bgViewHeaderStyle?: StyleProp<ViewStyle>;
    colorBackIcon?: string;
    centerTitle?: string;
    centerTitleSize?:
        | 'sub1'
        | 'sub2'
        | 'body1'
        | 'body2'
        | 'body3'
        | 'title1'
        | 'title2'
        | 'title3'
        | number;
    viewContainerStyle?: StyleProp<ViewStyle>;
}

const Header = memo(function Header_(props: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles(props);
    const navigation = useNavigation();
    //value
    const {
        shadow,
        colorsAnimated = theme.colors.primaryGradient,
        animated,
        backgroundColor = theme.colors.main['500'],
        statusBarColor = theme.colors.transparent,
        colorBackIcon = theme.colors.black_[10],
        centerTitle,
        centerTitleSize = 'title2',
        viewContainerStyle,
        bgViewHeaderStyle,
    } = props;
    //cstyle
    //shadow
    const shadow1 = shadow ? { ...theme.styles.shadow2, zIndex: 99999, backgroundColor } : {};
    //bar
    //
    const propsButton = omitBy(props, (_, key) =>
        includes(
            [
                'shadow',
                'colorsAnimated',
                'animated',
                'bgViewHeaderStyle',
                'backgroundColor',
                'containerStyle',
                'viewContainerStyle',
            ],
            key
        )
    );
    //style
    const centerTitleSize_ =
        typeof centerTitleSize === 'string' ? theme.typography[centerTitleSize] : centerTitleSize;

    return (
        <View style={[viewContainerStyle, shadow1]}>
            <H
                statusBarProps={{
                    backgroundColor: statusBarColor,
                    barStyle: 'dark-content',
                }}
                backgroundColor={backgroundColor}
                leftComponent={
                    <IconButton
                        type="ionicon"
                        name="arrow-back-outline"
                        onPress={navigation.goBack}
                        size={theme.typography.title4}
                        color={colorBackIcon}
                    />
                }
                centerComponent={{
                    text: centerTitle,
                    style: {
                        color: colorBackIcon,
                        fontSize: centerTitleSize_,
                    },
                }}
                containerStyle={styles.container_style}
                {...propsButton}
                leftContainerStyle={styles.left_container_style}
                centerContainerStyle={styles.center_container_style}
                rightContainerStyle={styles.right_container_style}
            />
            {animated ? (
                <Animated.View style={[styles.bgViewHeader, bgViewHeaderStyle]}>
                    <LinearGradient
                        start={{ x: 0.2, y: 1 }}
                        end={{ x: 0.2, y: 0 }}
                        // start={{ x: 0.7, y: 0.7 }}
                        // end={{ x: 0.3, y: 0.3 }}
                        colors={colorsAnimated}
                        style={{ width: '100%', height: '100%' }}
                    />
                </Animated.View>
            ) : (
                <></>
            )}
        </View>
    );
});

const useStyles = (props: any) =>
    StyleSheet.create({
        bgViewHeader: {
            zIndex: 1,
            position: 'absolute',
            height: '100%',
            right: 0,
            width: '100%',
        },
        container_style: {
            borderBottomWidth: 0,
            ...props.containerStyle,
        },
        left_container_style: {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 0.1,
            ...props.leftContainerStyle,
        },
        center_container_style: {
            flex: 0.8,
            justifyContent: 'center',
            alignItems: 'center',
            ...props.centerContainerStyle,
        },
        right_container_style: {
            flex: 0.1,
            justifyContent: 'center',
            alignItems: 'center',
            ...props.rightContainerStyle,
        },
    });

export default Header;
