import { Alert } from 'react-native';

export default function showAlertApp(
    title: string,
    okLabel = 'Đồng ý',
    canLabel = 'Huỷ',
    onOk?: () => void,
    onCancel?: () => void
) {
    Alert.alert(
        '',
        title,
        [
            {
                text: canLabel,
                style: 'cancel',
                onPress: onCancel,
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
}
