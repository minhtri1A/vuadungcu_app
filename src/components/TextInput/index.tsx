import { Icon } from '@rneui/themed';
import Text from 'components/Text';
import { useTheme } from 'hooks';
import { includes, omitBy } from 'lodash';
import React, { memo, useRef, useState } from 'react';
import {
    StyleProp,
    StyleSheet,
    TextInput as T,
    TextInputProps,
    View,
    ViewStyle,
} from 'react-native';
import { themeType } from 'theme';
import IconButton from './../IconButton';

interface Props extends TextInputProps {
    containerStyle?: StyleProp<ViewStyle>;
    helperText?: string;
    inputRef?: React.RefObject<T>;
    viewContainerStyle?: StyleProp<ViewStyle>;
    //nếu input nhập password thì set true
    isPassword?: boolean;
    startIcon?: {
        type: 'ionicon' | 'material' | 'font-awesome' | 'font-awesome5' | 'antdesign' | 'feather';
        name: any;
        size?: number;
        color?: string;
    };
    size?: 'lg' | 'md' | 'sm';
    onClear?: () => void;
}

//eye-off-outline
export default memo(function TextInput(props: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const inputRef = useRef<T>(null);
    const ref = props.inputRef ? props.inputRef : inputRef;
    //state
    const [color, setColor] = useState(theme.colors.grey_[400]);
    //value
    const [iconPassword, setIconPassword] = useState('eye-off-outline');
    const propsTextInput = omitBy(props, (_, key) =>
        includes(['containerStyle', 'helperText', 'startIcon', 'inputRef', 'onClear'], key)
    );
    const {
        containerStyle,
        helperText,
        editable = true,
        isPassword,
        startIcon,
        size = 'md',
        onClear,
    } = props;

    const togglePassword = () => {
        if (iconPassword === 'eye-off-outline') {
            setIconPassword('eye-outline');
            return;
        }
        setIconPassword('eye-off-outline');
    };
    const handleClear = () => {
        ref.current?.clear();
        onClear && onClear();
    };

    const toggleFocusInput = (type: 'focus' | 'blur') => () => {
        if (type === 'focus') {
            setColor(theme.colors.main['600']);
        } else {
            setColor(theme.colors.grey_[400]);
        }
    };

    return (
        <View style={props.viewContainerStyle}>
            <View
                style={[
                    styles.view_input,
                    containerStyle,
                    { borderColor: color, paddingVertical: theme.dimens.sizeElement(size) - 3 },
                ]}
            >
                {startIcon ? (
                    <Icon
                        type={startIcon?.type}
                        name={startIcon?.name}
                        color={startIcon?.color}
                        size={startIcon?.size}
                        style={{ marginRight: theme.spacings.small }}
                    />
                ) : null}

                <T
                    onFocus={toggleFocusInput('focus')}
                    onBlur={toggleFocusInput('blur')}
                    placeholderTextColor={theme.colors.grey_[400]}
                    {...propsTextInput}
                    style={[styles.input_style]}
                    ref={ref}
                    secureTextEntry={
                        isPassword && iconPassword === 'eye-off-outline' ? true : false
                    }
                />
                {isPassword ? (
                    <IconButton
                        type={'ionicon'}
                        name={iconPassword}
                        size={theme.typography.title1}
                        color={theme.colors.grey_[400]}
                        onPress={togglePassword}
                        disable={!editable}
                        activeOpacity={0.7}
                    />
                ) : (
                    false
                )}
                {props.value && (
                    <IconButton
                        type={'ionicon'}
                        name="close-outline"
                        size={theme.typography.title2}
                        color={theme.colors.grey_[400]}
                        onPress={handleClear}
                        disable={!editable}
                        activeOpacity={0.7}
                    />
                )}
            </View>
            {helperText ? <Text style={styles.txt_helperText}>{helperText}</Text> : null}
        </View>
    );
});
const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_input: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.colors.red[200],
            borderRadius: 3,
            paddingLeft: theme.spacings.small,
            paddingRight: theme.spacings.small,
        },
        input_style: {
            flex: 1,
            // height: theme.dimens.inputHeight,
            padding: 0,
            height: 25,
            paddingLeft: theme.spacings.tiny,
            paddingRight: theme.spacings.tiny,
            fontSize: theme.typography.body1,
            color: theme.colors.black_[10],
        },
        txt_helperText: {
            color: theme.colors.red['500'],
            paddingTop: theme.spacings.tiny,
            paddingLeft: theme.spacings.tiny,
        },
    });
