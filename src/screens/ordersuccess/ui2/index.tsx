import Button from 'components/Button';
import Image from 'components/Image';
import Text from 'components/Text';
import View from 'components/View';
import {
    NAVIGATION_ORDERS_SCREEN,
    NAVIGATION_ORDERS_STACK,
    NAVIGATION_PROFILE_STACK,
    NAVIGATION_TAB_NAV,
} from 'const/routes';
import withAuth from 'hoc/withAuth';
import { useNavigate, useNavigation, useTheme } from 'hooks';
import { reset } from 'navigation/RootNavigation';
import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { themeType } from 'theme';

/* eslint-disable react-hooks/exhaustive-deps */

interface Props {}

const OrderSuccessScreen = memo(function OrderSuccessScreen({}: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const navigate = useNavigate();
    const navigation = useNavigation();
    //swr

    //value

    /* --- effect --- */

    /* --- handle --- */

    /* --- render --- */

    //--alert check qty and price before checkout

    return (
        <View style={styles.container}>
            {/* <Header
                backgroundColor={theme.colors.transparent}
                centerComponent={{
                    text: 'Giỏ hàng',
                    style: { fontSize: theme.typography.title2},
                }}
                leftComponent={
                    <IconButton
                        type="ionicon"
                        name="close"
                        onPress={navigate.GO_BACK_ROUTE}
                        size={theme.typography.title4}
                    />
                }
                rightComponent={
                    <Text size={'body2'}  fw="bold">
                        (1/3)
                    </Text>
                }
                leftContainerStyle={{ flex: 0.2, alignItems: 'flex-start' }}
                centerContainerStyle={{ flex: 0.8 }}
                rightContainerStyle={{ flex: 0.2 }}
            /> */}
            <View flex={0.7} jC="center" aI="center" ph="small">
                <View w={theme.dimens.scale(200)} ratio={1}>
                    <Image source={require('asset/order-success.png')} resizeMode="contain" />
                </View>
                <View aI="center">
                    <Text size={'title2'} color={theme.colors.teal[500]} mt="small">
                        Đặt hàng thành công
                    </Text>
                    <Text color={theme.colors.grey_[600]} mt="small">
                        Cảm ơn quý khách đã mua hàng tại Vua Dụng Cụ.
                    </Text>
                    <Text color={theme.colors.grey_[600]} ta="center">
                        Mọi thắc mắc về đơn hàng xin quý khách vui lòng liên hệ qua hotline 1900
                        8085.
                    </Text>
                </View>
            </View>
            <View flex={0.3} jC="flex-end" p={'medium'}>
                <Button
                    title={'Tiếp tục mua hàng'}
                    type="outline"
                    color={theme.colors.teal[500]}
                    onPress={() => {
                        navigation.navigate('HomeScreen');
                    }}
                />
                <Button
                    title={'Xem đơn hàng'}
                    bgColor={theme.colors.teal[500]}
                    containerStyle={{ marginTop: theme.spacings.medium }}
                    onPress={() => {
                        reset(1, [
                            {
                                key: 'key-0',
                                name: NAVIGATION_TAB_NAV,
                                params: { screen: NAVIGATION_PROFILE_STACK },
                            },
                            {
                                key: 'key-1',
                                name: NAVIGATION_ORDERS_STACK,
                                params: {
                                    screen: NAVIGATION_ORDERS_SCREEN,
                                },
                            },
                        ]);
                    }}
                />
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
        view_wrap_qty: {
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: theme.colors.teal[200],
            borderRadius: 5,
            alignItems: 'center',
        },
        touch_qty_modal: {
            flexDirection: 'row',
            alignItems: 'center',
            height: '100%',
            paddingHorizontal: theme.spacings.medium,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: theme.colors.teal[200],
            backgroundColor: theme.colors.main['50'],
        },
        input_qty_modal: {
            width: '100%',
            height: theme.dimens.verticalScale(40),
            marginVertical: theme.spacings.small,
            backgroundColor: theme.colors.main['50'],
        },
        touch_change_qty: {
            paddingHorizontal: theme.spacings.tiny,
            paddingVertical: theme.spacings.tiny - 1,
            backgroundColor: theme.colors.main['50'],
        },
    });

export default withAuth(OrderSuccessScreen, true);
// export default OrderSuccessScreen;
