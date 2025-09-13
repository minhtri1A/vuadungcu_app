/* eslint-disable react-hooks/exhaustive-deps */
import { getMessage, useAppDispatch, useCustomerSwr, useTheme } from 'hooks';
import React, { memo, useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
import { CheckBox } from '@rneui/themed';
import Button from 'components/Button';
import Header from 'components/Header2';
import Loading from 'components/Loading';
import Text from 'components/Text';
import View from 'components/View';
import { Message, Status } from 'const/index';
import { LOGOUT_CURRENT_USER } from 'features/action';
import DropDownPicker from 'react-native-dropdown-picker';
import { showMessage } from 'react-native-flash-message';
import { isEmpty } from 'utils/helpers';

interface Props {}

export default memo(function DeleteAccountConfirmScreen({}: Props) {
    //hook
    const { theme } = useTheme();
    const dispatch = useAppDispatch();
    //state
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const [checked, setChecked] = useState(false);
    //swr
    const { deleteCustomer, status, message, setMessage, setStatus } = useCustomerSwr('all', {
        revalidateOnMount: false,
    });
    //value
    const messageh = getMessage(message);
    //message and logout
    useEffect(() => {
        //message
        if (status === Status.ERROR || status === Status.SUCCESS) {
            showMessage({
                message: messageh,
                type: status === Status.ERROR ? 'danger' : 'success',
                duration: 3000,
                onHide: () => {
                    //delete success logout
                    if (status === Status.SUCCESS) {
                        dispatch(LOGOUT_CURRENT_USER());
                    } else {
                        //reset status
                        setStatus(Status.DEFAULT);
                        setMessage(Message.NOT_MESSAGE);
                    }
                },
            });
        }
    }, [status]);

    //handle
    const handleDeleteCustomer = () => {
        if (!isEmpty(value)) {
            deleteCustomer(value);
        }
    };
    return (
        <>
            <Header
                center={
                    <Text size={'title2'} ta="center">
                        Xoá tài khoản
                    </Text>
                }
                showGoBack
                iconGoBackColor={theme.colors.black_[10]}
                bgColor={theme.colors.white_[10]}
                statusBarColor={theme.colors.main[500]}
            />
            {/* body */}
            <View flex={1}>
                <View p={'small'}>
                    <Text>Vui lòng chọn lý do xoá tài khoản:</Text>
                </View>
                <View ph={'medium'}>
                    <DropDownPicker
                        open={open}
                        value={value}
                        items={[
                            {
                                label: '1. Tôi muốn thay đổi email, số điện thoại',
                                value: 'Tôi muốn thây đổi email, số điện thoại',
                            },
                            {
                                label: '2. Tôi không muốn tiếp tục sử dụng ứng dụng Vua Dụng Cụ',
                                value: 'Tôi không muốn tiếp tục sử dụng ứng dụng Vua Dụng Cụ',
                            },
                            {
                                label: '3. khác',
                                value: 'khác',
                            },
                        ]}
                        placeholder="Lý do xoá tài khoản"
                        setOpen={setOpen}
                        setValue={setValue}
                        style={{ borderColor: theme.colors.grey_[400] }}
                        dropDownContainerStyle={{
                            borderColor: theme.colors.grey_[400],
                        }}
                    />
                </View>
                <View style={{ zIndex: -100 }}>
                    <CheckBox
                        checked={checked}
                        onPress={() => {
                            setChecked((pre) => !pre);
                        }}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        title={
                            <Text ml={'small'} color={theme.colors.grey_[500]}>
                                Bạn có chắc chắn muốn xoá tài khoản này ?
                            </Text>
                        }
                    />
                </View>
            </View>
            {/* button */}
            <View p={'small'}>
                <Button
                    title={'Xác nhận xoá'}
                    bgColor="red"
                    disabled={isEmpty(value) || !checked || status === Status.SUCCESS}
                    onPress={handleDeleteCustomer}
                />
            </View>
            {/* loading */}
            <Loading visible={status === Status.LOADING} text="Đang xoá tài khoản" />
        </>
    );
});
