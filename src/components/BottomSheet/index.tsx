/* eslint-disable react-native/no-inline-styles */
import { BottomSheet as B, BottomSheetProps } from '@rneui/themed';
import IconButton from 'components/IconButton';
import View from 'components/View';
import { useTheme } from 'hooks';
import { includes, omitBy } from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { themeType } from 'theme';

interface IProps extends BottomSheetProps {
    viewContainerStyle?: StyleProp<ViewStyle>;
    children: React.ReactNode;
    radius?: boolean;
    //hàm được kích hoạt khi bấm close button
    triggerOnClose?: () => any;
}

export default memo(function BottomSheet(props: IProps) {
    //hôk
    const { theme } = useTheme();
    const styles = useStyles(theme, props.radius);
    const insets = useSafeAreaInsets();

    //props
    const { children, viewContainerStyle, isVisible, triggerOnClose = () => {} } = props;
    //state
    const [open, setOpen] = useState<any>(isVisible);
    //value
    const propsOmit = omitBy(props, (_, key) =>
        includes(
            ['children', 'viewContainerStyle', 'closeButton', 'isVisible', 'triggerOnClose'],
            key
        )
    );
    useEffect(() => {
        setOpen(isVisible);
    }, [isVisible]);

    // render
    const renderBody = () => (
        <View
            pb={Platform.OS === 'ios' ? insets.bottom : 'medium'}
            style={[styles.view_container, viewContainerStyle]}
        >
            {children}
            {triggerOnClose ? (
                <View style={styles.view_btnIcon}>
                    <IconButton
                        type="ionicon"
                        name="close-outline"
                        size={theme.typography.size(25)}
                        color={theme.colors.grey_[300]}
                        onPress={() => {
                            triggerOnClose();
                            setOpen(false);
                        }}
                    />
                </View>
            ) : null}
        </View>
    );

    return (
        <B
            {...propsOmit}
            containerStyle={[
                {
                    marginBottom: Platform.OS === 'ios' ? -insets.bottom : 0,
                },
                propsOmit.containerStyle,
            ]}
            isVisible={open}
            scrollViewProps={{ showsVerticalScrollIndicator: false, ...propsOmit.scrollViewProps }}
        >
            {Platform.OS === 'ios' ? (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={'position'}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            height: theme.dimens.height,
                            backgroundColor: theme.colors.transparent,
                            justifyContent: 'flex-end',
                        }}
                        activeOpacity={1}
                        onPress={propsOmit.onBackdropPress}
                    >
                        <TouchableWithoutFeedback>{renderBody()}</TouchableWithoutFeedback>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            ) : (
                renderBody()
            )}
        </B>
    );
});

const useStyles = (theme: themeType, radius?: boolean) => {
    const insets = useSafeAreaInsets();
    return StyleSheet.create({
        view_container: {
            // width: theme.dimens.width,
            backgroundColor: theme.colors.white_[10],
            padding: theme.spacings.medium,
            position: 'relative',
            borderTopLeftRadius: radius ? 10 : 0,
            borderTopRightRadius: radius ? 10 : 0,
            marginBottom: Platform.OS === 'ios' ? insets.bottom : 0,
        },
        view_btnIcon: {
            position: 'absolute',
            top: theme.spacings.small,
            right: theme.spacings.small,
        },
    });
};
