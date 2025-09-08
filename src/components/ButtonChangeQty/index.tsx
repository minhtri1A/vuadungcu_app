/* eslint-disable react-hooks/exhaustive-deps */
import { Icon } from '@rneui/themed';
import BottomSheet from 'components/BottomSheet';
import Button from 'components/Button';
import Text from 'components/Text';
import TextInput from 'components/TextInput';
import View from 'components/View';
import { useTheme } from 'hooks';
import React, { memo, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity as Touch } from 'react-native';
import { themeType } from 'theme';
import { isEmpty } from 'utils/helpers';
import showMessageApp from 'utils/showMessageApp';

interface Props {
    value?: number;
    maxValue?: number;
    showBorder?: boolean;
    color?: string;
    bg?: string;
    radius?: number;
    size?: number;
    onSuccess: (qty: number) => void;
}

// value: khi truyen gia tri nay thi se thay doi gia tri qty dua vao value cua parent thong qua success
//          neu khong truyen thi xu ly local roi truyen ve parent thong qua success

const ButtonChangeQty = memo(function ButtonChangeQty(props: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme, props);

    //props
    const { size = theme.typography.size(17), value, maxValue, onSuccess } = props;

    //state
    const [isEffect, setIsEffect] = useState(false);
    const [visibleQtyInput, setVisibleQtyInput] = useState(false);
    const [qtyItem, setQtyItem] = useState(1);
    const [qtyInput, setQtyInput] = useState('1');

    //value

    //--init
    useEffect(() => {
        if (value) {
            setQtyInput(`${value}`);
        }
    }, [value]);

    //--success local
    useEffect(() => {
        // set effect component
        if (!isEffect) {
            setIsEffect(true);
            return;
        }
        if (value === undefined) {
            onSuccess(qtyItem);
        }
    }, [qtyItem, isEffect]);

    //handle
    const changeVisibleQtyInputInput = () => {
        if (!visibleQtyInput) {
            setQtyInput(`${qtyItem}`);
        }
        setVisibleQtyInput((pre) => !pre);
    };

    const changeQtyInput = (value_: string) => {
        if (parseInt(value_)) {
            setQtyInput(value_);
            return;
        }
        setQtyInput('');
    };
    const updateQtyInputToItem = () => {
        const isParent = value !== undefined;
        const currentQty = isParent ? value! : qtyItem;

        if (!isEmpty(maxValue, false) && currentQty >= maxValue) {
            showMessageApp(`Số lượng tối đa ${maxValue}`, { valueType: 'message' });
        } else {
            if (isParent) {
                onSuccess(parseInt(qtyInput));
            } else {
                setQtyItem(parseInt(qtyInput));
            }
        }

        changeVisibleQtyInputInput();
    };
    const changeQtyItemButton = (type: 'in' | 'de') => () => {
        //in
        if (type === 'in') {
            console.log('value ', value);
            console.log('maxValue ', maxValue);
            // parent in
            if (value !== undefined) {
                if (!isEmpty(maxValue, false) && value >= maxValue) {
                    showMessageApp(`Số lượng tối đa ${maxValue}`, { valueType: 'message' });
                    return;
                }
                onSuccess(value + 1);
                return;
            }

            // local in
            if (!isEmpty(maxValue, false) && qtyItem >= maxValue) {
                showMessageApp(`Số lượng tối đa ${maxValue}`, { valueType: 'message' });
                return;
            }
            setQtyItem((pre) => pre + 1);
            return;
        }
        // de
        //--parent de
        if (value !== undefined) {
            value > 1 && onSuccess(value - 1);
            return;
        }
        //--local de
        setQtyItem((pre) => (pre > 1 ? pre - 1 : pre));
        return;
    };

    return (
        <>
            <View style={styles.view_wrap_qty_btn}>
                <Touch
                    style={styles.touch_qty}
                    onPress={changeQtyItemButton('de')}
                    activeOpacity={0.5}
                >
                    <Icon
                        type="ionicon"
                        name="remove"
                        color={qtyItem > 1 ? theme.colors.grey_[400] : theme.colors.grey_[300]}
                        size={size}
                    />
                </Touch>
                <Touch
                    style={styles.touch_visible_input_qty}
                    onPress={changeVisibleQtyInputInput}
                    activeOpacity={0.5}
                >
                    <Text>{value !== undefined ? value : qtyItem}</Text>
                </Touch>
                <Touch
                    style={styles.touch_qty}
                    onPress={changeQtyItemButton('in')}
                    activeOpacity={0.5}
                >
                    <Icon
                        type="ionicon"
                        name="add-outline"
                        color={
                            !maxValue || (!isEmpty(maxValue, false) && qtyItem < maxValue)
                                ? theme.colors.grey_[400]
                                : theme.colors.grey_[300]
                        }
                        size={size}
                    />
                </Touch>
            </View>
            {/* change qty modal */}
            <BottomSheet
                isVisible={visibleQtyInput}
                radius
                backdropStyle={{ opacity: 0 }}
                onBackdropPress={changeVisibleQtyInputInput}
            >
                <Text ta="center" mb="medium" size={'body3'} fw="bold">
                    Nhập số lượng
                </Text>
                <View>
                    <TextInput size="md" value={qtyInput} onChangeText={changeQtyInput} />
                </View>
                <View flexDirect="row" gap={theme.spacings.medium} mt={'medium'}>
                    <Button flex={1} type="outline" color={theme.colors.grey_[400]}>
                        Đóng
                    </Button>
                    <Button
                        flex={1}
                        type="solid"
                        color={theme.colors.white_[10]}
                        onPress={updateQtyInputToItem}
                    >
                        Cập nhật
                    </Button>
                </View>
            </BottomSheet>
        </>
    );
});

const useStyles = (theme: themeType, props: Props) => {
    const {
        bg = theme.colors.white_.grey1,
        color = theme.colors.grey_[300],
        radius = 5,
        showBorder = true,
    } = props;
    return StyleSheet.create({
        //bottom
        view_wrap_qty_btn: {
            borderWidth: showBorder ? 0.7 : undefined,
            borderColor: color,
            flexDirection: 'row',
            flex: 1,
            borderRadius: radius,
            backgroundColor: bg,
        },
        touch_qty: {
            flex: 0.35,
            alignItems: 'center',
            justifyContent: 'center',
        },
        touch_visible_input_qty: {
            flex: 0.3,
            borderRadius: showBorder ? undefined : 5,
            borderWidth: showBorder ? undefined : 0.7,
            borderLeftWidth: showBorder ? 0.7 : undefined,
            borderRightWidth: showBorder ? 0.7 : undefined,
            borderColor: color,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
};

export default ButtonChangeQty;
