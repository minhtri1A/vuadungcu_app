/* eslint-disable react-hooks/exhaustive-deps */
import Text from 'components/Text';
import View from 'components/View';
import { useTheme } from 'hooks';
import React, { memo, useState } from 'react';
import {
    DimensionValue,
    LayoutAnimation,
    Platform,
    StyleSheet,
    TouchableOpacity,
    UIManager,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { themeType } from 'theme';

interface Props {
    viewMoreTitle?: string;
    children: React.ReactNode;
    initHeight?: DimensionValue;
    color?: string;
    liner?: boolean;
    linerHeight?: number;
    viewMoreHeight?: number;
    viewLessHeight?: number;
    disable?: boolean;
    onVisibleCollapse?: (isVisible: boolean) => void;
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Collapse = memo(function Collapse(props: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles(theme, props);
    const [visible, setVisible] = useState(false);
    //props
    const {
        viewMoreTitle = 'Xem thêm',
        children,
        initHeight = 400,
        color = theme.colors.grey_[400],
        liner = true,
        onVisibleCollapse,
        disable,
    } = props;

    //handle
    const handleVisibleCollap = (visible_: boolean) => () => {
        LayoutAnimation.configureNext({
            duration: 500,
            update: { type: 'spring', property: 'opacity', springDamping: 0.8 },
        });

        setVisible(visible_);
        if (onVisibleCollapse) {
            onVisibleCollapse(visible_);
        }
    };

    //render
    const renderViewMore = () => {
        return (
            <View style={styles.view_wrap_viewmore}>
                <View style={styles.view_viewmore}>
                    <TouchableOpacity
                        style={styles.touch_viewmore}
                        onPress={handleVisibleCollap(true)}
                    >
                        <Text color={color}>{viewMoreTitle}</Text>
                    </TouchableOpacity>
                </View>
                {liner && (
                    <LinearGradient
                        style={[styles.gradient_viewmore]}
                        colors={[
                            'rgba(255,255,255,1)',
                            'rgba(255,255,255,0.9)',
                            'rgba(255,255,255,0.7)',
                            'rgba(255,255,255,0)',
                        ]}
                        //colors={['red', 'rgba(255,255,255,0.5)']}
                        start={{ x: 0.2, y: 0.6 }}
                        end={{ x: 0.2, y: 0 }}
                    />
                )}
            </View>
        );
    };

    const renderViewLess = () => {
        return (
            <View style={styles.view_wrap_viewless}>
                <TouchableOpacity
                    style={styles.touch_viewless}
                    onPress={handleVisibleCollap(false)}
                >
                    <Text color={color} ta="center">
                        Thu gọn
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={[styles.view_container, !visible ? { height: initHeight } : null]}>
            {liner ? children : visible ? children : null}
            {disable ? null : visible ? renderViewLess() : renderViewMore()}
        </View>
    );
});

const useStyles = (theme: themeType, { viewLessHeight, viewMoreHeight, linerHeight }: Props) => {
    return StyleSheet.create({
        view_container: {
            overflow: 'hidden',
        },
        view_wrap_viewmore: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
        },

        view_viewmore: {
            backgroundColor: 'transparent',
            height: viewMoreHeight || theme.dimens.verticalScale(50),
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 5,
            justifyContent: 'center',
        },
        touch_viewmore: {
            alignItems: 'center',
            height: '100%',
            justifyContent: 'center',
        },
        view_wrap_viewless: {
            height: viewLessHeight || theme.dimens.verticalScale(120),
            justifyContent: 'flex-end',
        },
        touch_viewless: {
            padding: theme.spacings.medium,
        },
        gradient_viewmore: {
            height: linerHeight || theme.dimens.verticalScale(120),
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
        },
    });
};

export default Collapse;
