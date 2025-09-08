/* eslint-disable react-hooks/exhaustive-deps */
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Button from 'components/Button';
import Header from 'components/Header';
import IconButton from 'components/IconButton';
import TextInput from 'components/TextInput';
import Title from 'components/Title';
import View from 'components/View';
import { SET_ORDER_RETURNS_OPTIONS } from 'features/action';
import { useAppDispatch, useAppSelector, useCartOrderConfigsSwr, useTheme } from 'hooks';
import { map } from 'lodash';
import { OrdersStackParamsList } from 'navigation/type';
import React, { memo, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, TextInput as T } from 'react-native';
import { isEmpty } from 'utils/helpers';

interface Props {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<OrdersStackParamsList, 'OrdersReturnsOptionsScreen'>;
}

export default memo(function OrdersReturnsOptionsScreen({ navigation, route }: Props) {
    //hook
    const { theme } = useTheme();
    const dispatch = useAppDispatch();
    const { reason, refundMethod } = useAppSelector((state) => state.apps.orderReturnsOptions);
    //swr
    const { data } = useCartOrderConfigsSwr({ revalidateOnMount: false });
    //value
    const reasonList = JSON.parse(data.order_returns_reason);
    const otherReason = 'Lý do khác';
    //---check reason
    const initReason = !reason ? '' : reasonList.includes(reason) ? reason : otherReason;
    const initRefundMethod = !refundMethod ? '' : refundMethod;
    const initValue = route.params.option_type === 'reason' ? initReason : initRefundMethod;
    const initValueInput = initReason === otherReason ? reason : '';

    //state
    const [value, setValue] = useState(initValue);
    const [valueInput, setValueInput] = useState(initValueInput);
    const inputRef = useRef<T>(null);
    //swr
    //value
    const optionType = route.params.option_type;
    const headerTitle = optionType === 'reason' ? 'Lý do trả hàng' : 'Hình thức hoàn tiền';
    const checkOtherReason = value === otherReason;

    //check focus input
    useEffect(() => {
        let timeout: any = null;
        if (checkOtherReason) {
            //set nhằm khắc phục editable chưa mở mà focus vào
            timeout = setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
        return () => {
            clearTimeout(timeout);
        };
    }, [checkOtherReason]);
    //handle
    const selectReason = (reason_: string) => () => {
        setValue(reason_);
        setValueInput('');
    };
    const handleChangeText = (text: string) => {
        setValueInput(text);
    };
    const handleConfirmOptions = () => {
        //reason
        if (optionType === 'reason') {
            const reason = !isEmpty(valueInput) ? valueInput : value;
            dispatch(SET_ORDER_RETURNS_OPTIONS({ reason, refundMethod: '' }));
        }
        navigation.goBack();
    };
    return (
        <>
            <Header
                centerComponent={{
                    text: headerTitle,
                    style: {
                        color: theme.colors.slate[900],
                        fontSize: theme.typography.title1,
                    },
                }}
                leftComponent={
                    <IconButton
                        type="ionicon"
                        name="arrow-back-outline"
                        onPress={navigation.goBack}
                        size={theme.typography.title3}
                        color={theme.colors.slate[900]}
                    />
                }
                backgroundColor={theme.colors.white_[10]}
                statusBarProps={{ backgroundColor: theme.colors.main['600'] }}
                containerStyle={{ borderBottomWidth: 1 }}
            />
            <View p={'small'} bg={theme.colors.white_[10]} flex={1}>
                <View flex={1}>
                    {map(reasonList, (value_, index) => (
                        <Title
                            titleLeft={value_}
                            flexLeft={0.9}
                            dividerTop
                            key={index}
                            iconRightProps={
                                value === value_
                                    ? {
                                          type: 'ionicon',
                                          name: 'checkmark-sharp',
                                          color: theme.colors.green['500'],
                                      }
                                    : undefined
                            }
                            onPress={selectReason(value_)}
                        />
                    ))}
                    <Title
                        titleLeft={otherReason}
                        flexLeft={0.9}
                        dividerTop
                        iconRightProps={
                            checkOtherReason
                                ? {
                                      type: 'ionicon',
                                      name: 'checkmark-sharp',
                                      color: theme.colors.green['500'],
                                  }
                                : undefined
                        }
                        onPress={selectReason(otherReason)}
                    />
                    <TextInput
                        inputRef={inputRef}
                        placeholder="Nhập lý do của bạn"
                        editable={checkOtherReason}
                        containerStyle={{
                            borderColor: checkOtherReason
                                ? theme.colors.main['600']
                                : theme.colors.grey_[200],
                        }}
                        placeholderTextColor={
                            checkOtherReason ? theme.colors.grey_[500] : theme.colors.grey_[200]
                        }
                        value={valueInput}
                        onChangeText={handleChangeText}
                        viewContainerStyle={{ paddingVertical: theme.spacings.small }}
                    />
                </View>
                {/* button */}
                <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}>
                    <View p={'small'}>
                        <Button title={'Đồng ý'} onPress={handleConfirmOptions} />
                    </View>
                </KeyboardAvoidingView>
            </View>
        </>
    );
});

// const useStyles = () =>
//     StyleSheet.create({
//         view_container: {
//             flex: 1,
//             // backgroundColor: theme.colors.white_[10],
//             // paddingLeft: theme.spacings.medium,
//             // paddingRight: theme.spacings.medium,
//         },
//     });
