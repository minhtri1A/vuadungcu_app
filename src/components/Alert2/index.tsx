import React, { memo } from 'react';
import { Alert, StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
/*
// type: xác định kiểu hiển thị alert
//- default: color primarycor - ntl icon
//- custom: thêm colorCustom và iconCustomProps để chỉnh màu sắc và icon của alert
*/

interface IProps {
    trigger: React.ReactNode;
    triggerStyle?: StyleProp<ViewStyle>;
    title: string;
    okLabel?: string;
    onOk?: () => void;
}

export default memo(function Alert2({
    trigger,
    triggerStyle,
    title,
    okLabel = 'Đồng ý',
    onOk,
}: IProps) {
    //hôk
    // const { theme } = useTheme();

    const showAlert = () =>
        Alert.alert(
            '',
            title,
            [
                {
                    text: 'Huỷ',
                    style: 'cancel',
                },
                {
                    text: okLabel,
                    onPress: onOk,
                    style: 'cancel',
                },
            ],
            {
                cancelable: true,
            }
        );

    return (
        <TouchableOpacity onPress={showAlert} style={triggerStyle}>
            {trigger}
        </TouchableOpacity>
    );
});
