import { getMessage } from 'hooks';
import { ArgsMessageType } from 'hooks/getMessage';
import { showMessage } from 'react-native-flash-message';

interface OptionsType {
    args?: ArgsMessageType;
    onHide?: () => void;
    type?: 'danger' | 'success';
    valueType?: 'code' | 'message';
}

export default function showMessageApp(value = 'SYSTEMS_ERROR', option?: OptionsType) {
    const { args, type = 'danger', valueType = 'code', onHide } = option || {};
    const message = valueType === 'code' ? getMessage(value, args) : value;

    showMessage({
        message,
        icon: type,
        onHide,
    });
}
