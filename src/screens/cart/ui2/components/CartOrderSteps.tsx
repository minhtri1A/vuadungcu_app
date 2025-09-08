import { Icon } from '@rneui/themed';
import Text from 'components/Text';
import View from 'components/View';
import { useNavigate, useTheme } from 'hooks';
import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { themeType } from 'theme';
/* eslint-disable react-hooks/exhaustive-deps */

interface Props {
    step: number;
}

const CartOrderSteps = memo(function CartOrderSteps({ step }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const navigate = useNavigate();
    //swr

    //render
    const renderDotStep = (num: number, key?: '1' | '2') => {
        return [...Array(num).keys()].map((v, i) => {
            let color__ = '';
            if (key === '1') {
                color__ = //rgba(76, 205, 153, 1) rgba(0, 99, 90, 1)
                    step === 1
                        ? `rgba(${0 + i * 5}, ${99 + i * 10}, ${90 + i * 5}, 1)` //dl
                        : step === 2
                        ? `rgba(${76 - i * 6}, ${205 - i * 12}, ${153 - i * 5}, 1)` //ld
                        : theme.colors.cyan[700];
            }
            if (key === '2') {
                color__ =
                    step === 1
                        ? theme.colors.cyan[700]
                        : step === 2
                        ? `rgba(${0 + i * 5}, ${99 + i * 10}, ${90 + i * 5}, 1)` //dl
                        : `rgba(${76 - i * 6}, ${205 - i * 12}, ${153 - i * 5}, 1)`; //ld
            }
            return (
                <Text
                    style={[
                        styles.txt_step_dot,
                        {
                            color: color__,
                        },
                    ]}
                    key={i}
                >
                    -
                </Text>
            );
        });
    };

    return (
        <View style={styles.view_wrap_step}>
            {/* cart */}
            <View flexDirect="row" jC="space-between" flex={1}>
                <View flexDirect="row">
                    <Icon
                        type="material-community"
                        name={step > 1 ? 'checkbox-marked-circle-outline' : 'radiobox-marked'}
                        size={theme.typography.size(27)}
                        color={step === 1 ? theme.colors.teal[400] : theme.colors.cyan[500]}
                    />
                    <Text
                        style={[
                            styles.txt_step_dot,
                            {
                                color: step === 1 ? theme.colors.teal[400] : theme.colors.cyan[500],
                            },
                        ]}
                    >
                        -
                    </Text>
                </View>
                {renderDotStep(10, '1')}
                <Text
                    style={{
                        position: 'absolute',
                        top: theme.spacings.default * 3.5,
                        color: step === 1 ? theme.colors.teal[400] : theme.colors.cyan[500],
                        fontWeight: 'bold',
                        left: -theme.spacings.default * 1.7,
                    }}
                >
                    Giỏ hàng
                </Text>
            </View>
            {/* address */}
            <View flex={0} flexDirect="row">
                <Icon
                    type="material-community"
                    name={step > 2 ? 'checkbox-marked-circle-outline' : 'radiobox-marked'}
                    size={theme.typography.size(27)}
                    color={step === 2 ? theme.colors.teal[400] : theme.colors.cyan[500]}
                />
                <Text
                    style={{
                        position: 'absolute',
                        top: theme.spacings.default * 3.5,
                        color: step === 2 ? theme.colors.teal[400] : theme.colors.cyan[500],
                        fontWeight: 'bold',
                        left: -theme.spacings.default * 1,
                    }}
                >
                    Địa chỉ
                </Text>
            </View>
            {/* checkout */}
            <View flex={1} flexDirect="row" jC="space-between">
                {renderDotStep(10, '2')}
                <View flexDirect="row">
                    <Text
                        style={[
                            styles.txt_step_dot,
                            {
                                color: step === 3 ? theme.colors.teal[400] : theme.colors.cyan[500],
                            },
                        ]}
                    >
                        -
                    </Text>
                    <Icon
                        type="material-community"
                        name={'radiobox-marked'}
                        size={theme.typography.size(27)}
                        color={step === 3 ? theme.colors.teal[400] : theme.colors.cyan[500]}
                    />
                    <Text
                        style={{
                            position: 'absolute',
                            top: theme.spacings.default * 3.5,
                            color: step === 3 ? theme.colors.teal[400] : theme.colors.cyan[500],
                            fontWeight: 'bold',
                            right: -theme.spacings.default * 1.7,
                        }}
                    >
                        Thanh toán
                    </Text>
                </View>
            </View>
        </View>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.white_[10],
        },
        view_top: {
            alignItems: 'center',
            marginTop: theme.spacings.extraLarge,
        },
        view_wrap_step: {
            width: theme.dimens.width * 0.8,
            height: theme.dimens.verticalScale(50),
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        txt_step_dot: {
            fontWeight: 'bold',
            fontSize: theme.typography.body3,
        },
        //qty
    });

export default CartOrderSteps;
