/* eslint-disable react-native/no-inline-styles */
import { Colors, Icon, IconProps } from '@rneui/themed';
import Button, { ButtonCustomProps } from 'components/Button';
import Image from 'components/Image';
import Text, { TextCustomProps } from 'components/Text';
import View from 'components/View';
import { useTheme } from 'hooks';
import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { themeType } from 'theme';
/*
// type: xác định kiểu hiển thị alert
//- default: color primarycor - ntl icon
//- custom: thêm colorCustom và iconCustomProps để chỉnh màu sắc và icon của alert
*/

interface IProps {
    isVisible: boolean;
    type?: 'success' | 'error' | 'default' | 'custom';
    onBackdropPress?: (() => void) | undefined;
    //modal
    modalProps?: {
        backdropOpacity?: number;
    };
    //body
    bodyChildren?: React.ReactNode;
    title?: string;
    message?: string;
    titleProps?: TextCustomProps;
    messageProps?: TextCustomProps;
    //button
    showBtnOk?: boolean;
    showBtnCan?: boolean;
    okBtnTitle?: string;
    canBtnTitle?: string;
    onOk?: () => any;
    onCancel?: () => any;
    okBtnProps?: ButtonCustomProps;
    canBtnProps?: ButtonCustomProps;
    //custom
    colorCustom?: keyof Colors;
    iconCustomProps?: IconProps;
}

export default memo(function Alert(props: IProps) {
    //hôk
    const { theme } = useTheme();
    const styles = useStyles(theme);
    //props
    const {
        isVisible,
        type = 'default',
        onBackdropPress,
        //modal
        modalProps,
        //body
        bodyChildren,
        title = '',
        message = '',
        titleProps,
        messageProps,
        //btn
        showBtnOk = true,
        showBtnCan = true,
        okBtnTitle = 'Đồng ý',
        canBtnTitle = 'Huỷ bỏ',
        onOk,
        onCancel,
        okBtnProps,
        canBtnProps,
        //custom
        colorCustom = 'transparent',
        iconCustomProps,
    } = props;
    // const propsButton = omitBy(props, (value, key) => includes(['children', 'isVisible'], key));
    //check
    const color =
        type === 'success'
            ? theme.colors.green['500']
            : type === 'error'
            ? theme.colors.red['50']
            : type === 'default'
            ? theme.colors.main['600']
            : colorCustom;

    const icon: any =
        type === 'success' ? 'checkmark-circle-sharp' : type === 'error' ? 'alert-circle' : null;
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onBackdropPress}
            {...modalProps}
            useNativeDriver={true}
        >
            <View bg={theme.colors.white_[10]} style={styles.view_container}>
                <View style={[styles.view_wrap, { borderTopColor: color }]}>
                    {/* message */}
                    <View style={styles.view_body}>
                        {bodyChildren ? (
                            bodyChildren
                        ) : (
                            <>
                                <Text
                                    p={'small'}
                                    size="title1"
                                    ta="center"
                                    color={color}
                                    {...titleProps}
                                >
                                    {title}
                                </Text>
                                <Text p={'small'} size="body2" {...messageProps}>
                                    {message}
                                </Text>
                            </>
                        )}
                    </View>
                    {/* button */}
                    <View ph={'small'}>
                        {showBtnOk ? (
                            <View pb="small">
                                <Button
                                    title={okBtnTitle}
                                    bgColor={color}
                                    onPress={onOk}
                                    {...okBtnProps}
                                />
                            </View>
                        ) : null}

                        {showBtnCan ? (
                            <View pb={'small'}>
                                <Button
                                    title={canBtnTitle}
                                    bgColor={theme.colors.grey_[300]}
                                    onPress={onCancel}
                                    {...canBtnProps}
                                />
                            </View>
                        ) : null}
                    </View>
                    {/* absolute icon */}
                    <View style={styles.view_icon} bg={color}>
                        {type === 'default' ? (
                            <Image
                                source={require('asset/img_icon_vdc_grey.png')}
                                w={30}
                                h={30}
                                resizeMode="center"
                            />
                        ) : type === 'custom' && iconCustomProps ? (
                            <Icon {...iconCustomProps} />
                        ) : (
                            <Icon type="ionicon" name={icon} color={theme.colors.white_[10]} />
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_container: {
            minHeight: theme.dimens.height * 0.1,
            position: 'relative',
            borderRadius: 10,
        },
        view_wrap: {
            borderTopWidth: 6,

            borderRadius: 10,
        },
        view_body: {
            alignItems: 'center',
            marginTop: theme.spacings.default * 3.5,
            marginBottom: theme.spacings.default * 3,
        },
        view_icon: {
            position: 'absolute',
            alignSelf: 'center',
            top: 0,
            padding: theme.spacings.tiny,
            paddingLeft: theme.spacings.medium,
            paddingRight: theme.spacings.medium,
            borderBottomEndRadius: 10,
            borderBottomStartRadius: 10,
        },
    });
