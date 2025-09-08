import Button from 'components/Button';
import IconButton from 'components/IconButton';
import Image from 'components/Image';
import Text from 'components/Text';
import View from 'components/View';
import WheelOfFortune from 'components/WheelOfFortune';
import { Status } from 'const/index';
import {
    NAVIGATION_AUTH_STACK,
    NAVIGATION_TO_COIN_SCREEN,
    NAVIGATION_TO_GIFT_SCREEN,
    NAVIGATION_TO_LOGIN_SCREEN,
} from 'const/routes';
import withAuth from 'hoc/withAuth';
import { useIsLogin, useNavigation, useTheme } from 'hooks';
import useSpinAttendanceSwr from 'hooks/swr/spinSwr/useSpinAttendanceSwr';
import React, { memo, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { ImageBackground, Platform, StatusBar, StyleSheet } from 'react-native';
// import { Confetti } from 'react-native-fast-confetti';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { services } from 'services';
import { themeType } from 'theme';

/* eslint-disable react-hooks/exhaustive-deps */

interface Props {}

const SpinAttendance = memo(function SpinAttendance({}: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const navigation = useNavigation();
    const isLogin = useIsLogin();
    const insets = useSafeAreaInsets();
    //state
    const [winner, setWinner] = useState<any>(undefined);
    const [status, setStatus] = useState<any>(Status.DEFAULT);
    const [openModal, setOpenModal] = useState(false);
    const [openConfetti, setOpenConfetti] = useState(false);
    //swr
    const { data, isValidating, mutate } = useSpinAttendanceSwr();
    const { spin, spin_item = [], customer } = data || {};
    //value

    //effect
    useEffect(() => {
        mutate();
    }, [isLogin]);

    //handle
    const getWinnerApi = async () => {
        setStatus(Status.LOADING);
        const result_ = await services.customer.startSpinWheel();
        const { result, win } = result_;
        if (result === 'SUCCESS') {
            const indexWinner = spin_item.findIndex((value) => value.item_uuid === win);
            setWinner(indexWinner);
            setStatus(Status.SUCCESS);
            return;
        }
        setStatus(Status.ERROR);
    };

    const finishSpinWheel = () => {
        //status default stop spin
        setStatus(Status.DEFAULT);
        setOpenModal(true);

        mutate();
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setOpenConfetti(false);
    };

    const handlePressTitle = () => {
        if (customer.code === 'CUSTOMER_NOT_FOUND') {
            navigation.navigate(NAVIGATION_AUTH_STACK, { screen: NAVIGATION_TO_LOGIN_SCREEN });
        }
    };

    //navigate
    const navigateToGiftScreen = () => {
        setOpenConfetti(false);

        if (spin_item[winner].type === 'gift') {
            navigation.navigate(NAVIGATION_TO_GIFT_SCREEN);
        } else {
            navigation.navigate(NAVIGATION_TO_COIN_SCREEN);
        }
    };

    return (
        <>
            <StatusBar backgroundColor={'transparent'} translucent={true} />
            <ImageBackground
                source={require('asset/bg-wheel-2.png')}
                style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? insets.top : 0 }}
            >
                <View style={styles.view_header}>
                    <IconButton
                        type="ionicon"
                        name="arrow-back-outline"
                        onPress={navigation.goBack}
                        size={theme.typography.title4}
                    />
                    <Text size={'title1'} color={theme.colors.white_[10]}>
                        {spin.spin_name}
                    </Text>
                    <View />
                </View>

                {!isValidating && spin_item.length > 0 ? (
                    <View style={styles.view_wheel}>
                        <WheelOfFortune
                            rewards={spin_item}
                            status={status}
                            winner={winner}
                            onFinish={finishSpinWheel}
                            width={theme.dimens.width * 0.85}
                            height={theme.dimens.width * 0.85}
                            onPlay={getWinnerApi}
                            disable={customer.status !== 'CAN_SPIN'}
                            disableTitle={
                                customer.code === 'CUSTOMER_NOT_FOUND'
                                    ? 'Vui lòng đăng nhập để quay thưởng'
                                    : 'Bạn đã hết lượt quay hôm nay!'
                            }
                            disableSubTitle={
                                customer.code === 'CUSTOMER_NOT_FOUND'
                                    ? '(bấm vào để đăng nhập)'
                                    : undefined
                            }
                            onPressDisableTitle={handlePressTitle}
                        />
                        {customer.status === 'CAN_SPIN' ? (
                            <View mt="large">
                                <Text color={theme.colors.white_[10]} size={'body2'}>
                                    Bạn còn lượt quay hôm nay!
                                </Text>
                            </View>
                        ) : null}
                        <TouchableOpacity
                            onPress={() => {
                                setOpenModal(true);
                            }}
                        ></TouchableOpacity>
                    </View>
                ) : null}
            </ImageBackground>
            {/* modal */}
            <Modal
                isVisible={openModal}
                animationIn={'fadeIn'}
                animationOut={'fadeOut'}
                // animationOut={'fadeOut'}
                onBackdropPress={handleCloseModal}
                onModalShow={() => {
                    setOpenConfetti(true);
                }}
                useNativeDriver={true}
            >
                {/* <Confetti
                    isInfinite={false}
                    count={50}
                    onAnimationEnd={() => setOpenConfetti(false)}
                /> */}
                <View style={styles.view_modal}>
                    <Text
                        ta="center"
                        fw="bold"
                        size="title1"
                        mb="extraLarge"
                        color={theme.colors.red['500']}
                    >
                        {spin.spin_name}
                    </Text>
                    <View w={'30%'} ratio={1} mb="medium">
                        <Image
                            source={{
                                uri: spin_item[winner]?.image,
                            }}
                            resizeMode="contain"
                        />
                    </View>
                    {spin_item[winner]?.label !== 'Chúc bạn may mắn lần sau' ? (
                        <Text ta="center" fw="bold">
                            Chúc mừng quý khách đã trúng thưởng
                        </Text>
                    ) : null}

                    <Text ta="center" mb="medium" color={theme.colors.grey_[500]}>
                        ({spin_item[winner]?.label})
                    </Text>
                    <View flexDirect="row">
                        <Button
                            title="Đóng"
                            size="sm"
                            minWidth={'40%'}
                            bgColor={theme.colors.red['500']}
                            containerStyle={{ marginRight: theme.spacings.small }}
                            onPress={handleCloseModal}
                        />
                        <Button
                            title="Xem ngay"
                            size="sm"
                            minWidth={'40%'}
                            bgColor={theme.colors.red['500']}
                            onPress={navigateToGiftScreen}
                        />
                    </View>
                </View>
            </Modal>
        </>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_header: {
            flexDirection: 'row',
            padding: theme.spacings.medium,
            justifyContent: 'space-between',
            marginTop: StatusBar.currentHeight,
            zIndex: 999,
        },
        view_wheel: {
            padding: theme.spacings.medium,
            // justifyContent: 'center',
            alignItems: 'center',
        },
        //modal
        view_modal: {
            backgroundColor: theme.colors.white_[10],
            padding: theme.spacings.medium,
            alignItems: 'center',
            borderRadius: 10,
        },
    });

export default withAuth(SpinAttendance, true);
// export default SpinAttendance;

//pending: chờ xử lý
//send,receive(processing): đang xử lý
//success: bảo hành xong
