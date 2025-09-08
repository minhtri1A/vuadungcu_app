/* eslint-disable radix */
/* eslint-disable react-hooks/exhaustive-deps */
import Barcode from '@kichiyaki/react-native-barcode-generator';
import { RouteProp } from '@react-navigation/native';
import Alert from 'components/Alert';
import Button from 'components/Button';
import CountSeconds from 'components/CountSeconds';
import Header from 'components/Header';
import Text from 'components/Text';
import Touch from 'components/Touch';
import View from 'components/View';
import { useTheme } from 'hooks';
import usePosCustomerInfoSWR from 'hooks/swr/posSwr/usePosCustomerInfoSWR';
import { replace } from 'lodash';
import { RootStackParamsList } from 'navigation/type';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, TextInput } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { themeType } from 'theme';
import { currencyFormat, isEmpty } from 'utils/helpers';
import { sendSentryError } from 'utils/storeHelpers';

interface Props {
    route: RouteProp<RootStackParamsList['PosStack'], 'PosScoreTransfer'>;
}

const pointStep = 100000;
const minPoint = 100000;
const pointLimit = 1000000;
export default memo(function PosScoreTransfer({ route }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    //params
    const seller_uuid = route.params.seller_uuid;
    //state
    const [transferData, setTransferData] = useState<{
        code: string;
        score_trans: string;
        expires: string;
    }>();
    const [codeType, setCodeType] = useState('barcode');
    const [codeValue, setCodeValue] = useState('no-code');
    const [point, setPoint] = useState('0');
    //--true dang cho quet ma de thanh toan
    const [isSubmit, setIsSubmit] = useState(false);
    //--show alert khi thanh toan thanh cong
    const [isVisibleAlert, setIsVisibleAlert] = useState(false);
    const inputRef = useRef<TextInput>(null);
    //swr
    const {
        posCustomer,
        createScoreTransfer,
        mutate: mutatePosInfo,
    } = usePosCustomerInfoSWR(seller_uuid);

    //value
    const checkIsTransfer =
        parseInt(posCustomer?.pos_customer.score || '0') >= minPoint ? true : false;
    //state
    //animated
    const animation = useRef(new Animated.Value(0)).current;
    const inputRange = [0, theme.dimens.width * 1.15];
    const outputRange = [0, theme.dimens.width * 1.15];
    const heightAnimation = animation.interpolate({ inputRange, outputRange });

    const slideUp = () => {
        Animated.timing(animation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const slideDown = () => {
        Animated.timing(animation, {
            toValue: theme.dimens.width * 1.15,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    //effect

    //animation heightAnimation
    useEffect(() => {
        if (isSubmit) {
            slideDown();
        } else {
            slideUp();
        }
    }, [isSubmit]);

    //--check show alert transfer success
    useEffect(() => {
        if (transferData?.code === null && isSubmit) {
            setIsVisibleAlert(true);
            //reset local state
            resetState();
        }
    }, [transferData]);

    //handle
    const handleChangeType = (type: 'qrcode' | 'barcode') => () => {
        setCodeType(type);
    };

    const handleChangePoint = (text: string) => {
        const point_ = replace(text, /\./g, '');
        if (
            parseInt(point_) >= 1000000 &&
            parseInt(point_) < parseInt(posCustomer?.pos_customer.score || '0')
        ) {
            setPoint('1000000');
            return;
        }

        if (parseInt(point_ || '0') < parseInt(posCustomer?.pos_customer.score || '0')) {
            setPoint(point_ || '0');
            return;
        }
        //neu diem nhap vao > diem hien co - set diem hien co
        setPoint(
            `${Math.floor(parseInt(posCustomer?.pos_customer.score || '0') / 100000) * 100000}`
        );
    };

    const handleSubmitChangePoint = () => {
        if (parseInt(point) < 100000 && parseInt(point) > 0) {
            setPoint('100000');
            return;
        }
        setPoint((pre) => `${Math.floor(parseInt(pre) / 100000) * 100000}`);
    };

    //submit create qrcode | barcode
    const handleCreateScoreCode = async () => {
        try {
            if (isEmpty(point) || parseInt(point || '0') < 100000) {
                inputRef.current?.focus();
                return;
            }
            const result = await createScoreTransfer(seller_uuid, {
                score: point,
            });
            if (result?.code === 'SUCCESS') {
                setIsSubmit(true);
                setTransferData(result.score_transfer);
                setCodeValue(result?.score_transfer.code);
                return;
            }
            throw result;
        } catch (error) {
            sendSentryError(error, 'handleCreateScoreCode');
        }
    };

    //oke alert
    const handleMutateCustomerLoyalPoint = () => {
        //refetch customer loyal point
        mutatePosInfo();
        //hid alert
        setIsVisibleAlert(false);
        //reser point input
        setPoint('0');
    };

    const resetState = () => {
        setCodeValue('no-code');
        setIsSubmit(false);
        setTransferData(undefined);
    };

    //render
    const renderListSuggest = () => {
        const elements = [];
        for (let i = pointStep; i <= pointLimit; i = i + pointStep) {
            if (i < parseInt(posCustomer?.pos_customer.score || '0')) {
                elements.push(
                    <Touch
                        style={styles.touch_suggest}
                        key={i}
                        onPress={() => handleChangePoint(`${i}`)}
                        disabled={isSubmit}
                    >
                        <Text>{currencyFormat(i)}</Text>
                    </Touch>
                );
            }
        }
        return elements;
    };

    const renderQRCode = () => (
        <Animated.View style={{ height: heightAnimation }}>
            <View flexDirect="row">
                <Touch
                    style={styles.touch_code_type}
                    onPress={handleChangeType('barcode')}
                    activeOpacity={0.8}
                >
                    <Text
                        ta="center"
                        fw="bold"
                        color={
                            codeType === 'barcode'
                                ? theme.colors.main['600']
                                : theme.colors.grey_[400]
                        }
                        size={'body2'}
                    >
                        Mã vạch
                    </Text>
                </Touch>
                <Touch
                    style={styles.touch_code_type}
                    onPress={handleChangeType('qrcode')}
                    activeOpacity={0.8}
                >
                    <Text
                        ta="center"
                        fw="bold"
                        color={
                            codeType === 'qrcode'
                                ? theme.colors.main['600']
                                : theme.colors.grey_[400]
                        }
                        size={'body2'}
                    >
                        Mã QR
                    </Text>
                </Touch>
            </View>
            <View style={styles.view_wrap_qr}>
                {codeType === 'qrcode' ? (
                    <View style={styles.view_qr}>
                        <QRCode value={codeValue} size={theme.dimens.width * 0.8} />
                    </View>
                ) : (
                    <View style={[styles.view_qr, styles.view_barcode]}>
                        {/* <QRCode value="Just some string value" size={theme.dimens.width * 0.8} /> */}
                        <Barcode
                            value={codeValue}
                            style={{ width: theme.dimens.width * 0.8 }}
                            maxWidth={theme.dimens.width * 0.8}
                            textStyle={styles.text_barcode}
                        />
                    </View>
                )}
            </View>
            {/*  */}
            {isSubmit && (
                <View aI="center">
                    <View flexDirect="row">
                        <Text mr="tiny">Mã hết hạn sau:</Text>
                        <CountSeconds
                            second={isSubmit ? 600 : 0}
                            duration={1000}
                            visible={true}
                            textProps={{ color: theme.colors.red[400] }}
                            onFinishCountDown={resetState}
                            textType="minutes"
                        />
                        <Text ml="tiny">giây</Text>
                    </View>
                    <Text size={'sub2'} color={theme.colors.red[400]} mb="small" fw="bold">
                        (Vui lòng đưa nhân viên quét mã để đổi điểm)
                    </Text>
                </View>
            )}
        </Animated.View>
    );

    return (
        <View style={styles.view_container}>
            <Header
                centerTitle="Đổi điểm tích luỹ"
                colorBackIcon="black"
                backgroundColor={theme.colors.white_[10]}
                shadow={true}
                statusBarColor={theme.colors.red['600']}
            />

            <ScrollView>
                {/* qrcode */}
                {renderQRCode()}
                {/* touch change type code */}
                <View style={styles.view_wrap_info}>
                    <View style={styles.view_top_info}>
                        <Text size={'title1'} fw="bold">
                            Điểm tích luỹ:
                        </Text>

                        <Text color={theme.colors.red['500']} size={'body3'} fw="bold">
                            {currencyFormat(posCustomer?.pos_customer.score || '0', false)} điểm
                        </Text>
                    </View>
                    <View style={styles.view_wrap_input}>
                        <View flex={1}>
                            <TextInput
                                ref={inputRef}
                                value={
                                    parseInt(point) > 0
                                        ? `${currencyFormat(parseInt(point), false)}`
                                        : ''
                                }
                                placeholderTextColor={theme.colors.grey_[500]}
                                onSubmitEditing={handleSubmitChangePoint}
                                onBlur={handleSubmitChangePoint}
                                placeholder="Nhập số điểm tích luỹ cần đổi..."
                                keyboardType="numeric"
                                style={styles.input_style}
                                onChangeText={handleChangePoint}
                                editable={isSubmit || !checkIsTransfer ? false : true}
                            />
                        </View>
                        <Text style={styles.text_label_input}>Điểm</Text>
                    </View>

                    <View>
                        <Text size={'sub2'} ta="right" color={theme.colors.grey_[400]} p="tiny">
                            1.000 điểm tích luỹ = 1.000 vnđ
                        </Text>
                    </View>
                    {!isSubmit ? (
                        <>
                            <Text
                                size={'body2'}
                                pl="small"
                                mb="medium"
                                color={theme.colors.grey_[500]}
                            >
                                Gợi ý điểm
                            </Text>
                            <View style={styles.view_suggest}>
                                {checkIsTransfer ? (
                                    <ScrollView
                                        horizontal
                                        style={{ paddingLeft: theme.spacings.medium }}
                                    >
                                        {renderListSuggest()}
                                    </ScrollView>
                                ) : (
                                    <Text ta="center" color={theme.colors.red['500']}>
                                        Bạn cần tối thiểu {currencyFormat(minPoint, false)} điểm để
                                        đổi thưởng!
                                    </Text>
                                )}
                            </View>
                        </>
                    ) : null}

                    {/* bottom button */}
                    <View style={styles.view_bottom_info}>
                        <View>
                            {isSubmit ? (
                                <Button
                                    title={'Huỷ bỏ'}
                                    color={theme.colors.grey_[500]}
                                    type="outline"
                                    minWidth={theme.dimens.width * 0.9}
                                    onPress={resetState}
                                    disabled={!checkIsTransfer}
                                />
                            ) : (
                                <Button
                                    title={'Tạo mã thanh toán'}
                                    color={theme.colors.white_[10]}
                                    bgColor={theme.colors.red['500']}
                                    minWidth={theme.dimens.width * 0.9}
                                    onPress={handleCreateScoreCode}
                                    disabled={!checkIsTransfer}
                                />
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* loading */}
            <Alert
                isVisible={isVisibleAlert}
                // isVisible={true}
                title="Đổi điểm tích luỹ thành công!"
                message={`Bạn đã đổi thành công ${currencyFormat(
                    point || '0',
                    false
                )} điểm tích luỹ để thanh toán đơn hàng!`}
                type="success"
                onOk={handleMutateCustomerLoyalPoint}
                showBtnCan={false}
            />
        </View>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_container: {
            flex: 1,
            // marginTop: StatusBar.currentHeight,
            backgroundColor: theme.colors.grey_[300],
        },
        //
        touch_code_type: {
            flex: 1,
            backgroundColor: theme.colors.white_[10],
            padding: theme.spacings.small,
        },
        // qrcode
        view_wrap_qr: {
            width: '100%',
            alignItems: 'center',
            marginTop: theme.spacings.medium,
            position: 'relative',
        },
        view_qr: {
            borderRadius: 5,
            backgroundColor: theme.colors.white_[10],
            padding: 10,
            marginBottom: theme.spacings.medium,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 8,
            },
            shadowOpacity: 0.44,
            shadowRadius: 10.32,

            elevation: 16,
        },
        view_barcode: {
            aspectRatio: 1,
            width: theme.dimens.width * 0.855,
            justifyContent: 'center',
            alignItems: 'center',
        },
        text_barcode: {
            textAlign: 'right',
            width: '100%',
            color: theme.colors.grey_[400],
            fontSize: theme.typography.body1,
        },
        // info
        view_wrap_info: {
            // borderTopLeftRadius: 20,
            // borderTopRightRadius: 20,
            backgroundColor: theme.colors.white_[10],
            overflow: 'hidden',
            marginTop: theme.spacings.small,
            minHeight: theme.dimens.width * 1,
        },
        view_top_info: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            // backgroundColor: theme.colors.grey_[200],
            padding: theme.spacings.large,
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey_[200],
        },
        //--input
        view_wrap_input: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey_[200],
        },
        input_style: {
            paddingLeft: theme.spacings.small,
            color: theme.colors.main[500],
        },
        text_label_input: {
            fontSize: theme.typography.body3,
            color: theme.colors.grey_[500],
            backgroundColor: theme.colors.grey_[300],
            textAlignVertical: 'center',
            paddingHorizontal: 5,
            paddingVertical: theme.spacings.medium,
        },
        //
        view_suggest: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            flexWrap: 'wrap',
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey_[200],
            paddingBottom: theme.spacings.medium,
        },
        touch_suggest: {
            paddingVertical: theme.spacings.tiny,
            minWidth: 100,
            backgroundColor: theme.colors.grey_[200],
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: theme.spacings.medium,
        },
        view_bottom_info: {
            alignItems: 'center',
            marginTop: theme.spacings.large,
            marginBottom: theme.spacings.medium,
        },
    });
