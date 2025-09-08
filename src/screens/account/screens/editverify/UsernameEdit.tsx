import Button from 'components/Button';
import Text from 'components/Text';
import TextInput from 'components/TextInput';
import { Message } from 'const/index';
import { getMessage, useCustomerSwr, useTheme } from 'hooks';
import React, { memo, useEffect, useState } from 'react';
import { View } from 'react-native';
import useStyles from './styles';
/* eslint-disable react-hooks/exhaustive-deps */

interface Props {}

export default memo(function AccountEditScreen({}: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles();
    //swr
    const {
        customers: { username, not_edit_username },
        updateOrAddCustomerInfo,
    } = useCustomerSwr('all', { revalidateOnMount: false });
    //value
    const [value, setValue] = useState(username);
    const [message, setMessage] = useState(Message.NOT_MESSAGE);
    const messageh = getMessage(message);
    ///local api

    useEffect(() => {
        if (not_edit_username === 'Y') {
            setMessage(Message.ACCOUNT_CANNOT_EDIT_USERNAME);
        }
    }, []);
    ///submit api
    const handleSubmitEditUsername = () => {
        if (message === Message.NOT_MESSAGE) {
            updateOrAddCustomerInfo('username', { username: value });
        }
    };

    //handle change username
    const handleChangeUsername = (text: string) => {
        const stringRegex = /^[a-z]+[a-z0-9_]+$/.exec(text);
        if (!stringRegex) {
            setMessage(Message.INPUT_USERNAME_NOT_REGEX);
        } else {
            setMessage(Message.NOT_MESSAGE);
        }
        setValue(text);
    };

    return (
        <>
            {/* text input */}
            <View style={styles.view_containerEditScreen}>
                <Text>Tài khoản</Text>
                {/* input field */}
                <TextInput
                    placeholder={'Nhập tài khoản của bạn !'}
                    autoFocus
                    containerStyle={{ borderColor: theme.colors.main['600'] }}
                    value={value}
                    viewContainerStyle={{ marginVertical: theme.spacings.medium }}
                    onChangeText={handleChangeUsername}
                    editable={not_edit_username !== 'Y'}
                    helperText={messageh}
                />
                <Button
                    title={'Lưu thay đổi'}
                    containerWidth={'100%'}
                    onPress={handleSubmitEditUsername}
                    disabled={not_edit_username === 'Y' || username === value}
                />
            </View>
        </>
    );
});
