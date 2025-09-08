import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Icon } from '@rneui/themed';
import Badge from 'components/Badge';
import Text from 'components/Text';
import Title from 'components/Title';
import { Routes } from 'const/index';
import { useIsLogin, useTheme } from 'hooks';
import { CartOrderStatusSwrType } from 'models';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Ripple from 'react-native-material-ripple';

interface Props {
    cartOrderStatusSwr: CartOrderStatusSwrType;
}

const ProfileOrders = memo(function ProfileOrders({ cartOrderStatusSwr }: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles();
    const navigation = useNavigation<StackNavigationProp<any, any>>();
    const isLogin = useIsLogin();
    //swr
    const { data } = cartOrderStatusSwr;
    //value
    const goToOrdersScreen = (index?: number) => () => {
        navigation.navigate(Routes.NAVIGATION_ORDERS_STACK, {
            screen: Routes.NAVIGATION_ORDERS_SCREEN,
            params: {
                orderIndex: index,
            },
        });
    };

    const renderBadge = (value: number) => {
        return (
            <Badge
                visible={true}
                title={`${value}`}
                top={-theme.dimens.verticalScale(8)}
                right={-theme.dimens.scale(4)}
            />
        );
    };

    const checkRenderOrder = () => {
        if (isLogin) {
            return (
                <View style={styles.ListInfoOders}>
                    <Ripple style={styles.InfoOder} rippleCentered onPress={goToOrdersScreen(0)}>
                        <View>
                            <Icon
                                type="ionicon"
                                name="newspaper-outline"
                                size={theme.typography.size(25)}
                                color={theme.colors.grey_[500]}
                            />
                            {data && data.pending > 0 ? renderBadge(data.pending) : null}
                        </View>
                        <Text ta="center" pt={'medium'} pb="medium">
                            Chờ xử lý
                        </Text>
                    </Ripple>
                    <Ripple style={styles.InfoOder} rippleCentered onPress={goToOrdersScreen(1)}>
                        <View>
                            <Icon
                                type="ionicon"
                                name="briefcase-outline"
                                size={theme.typography.size(25)}
                                color={theme.colors.grey_[500]}
                            />
                            {data && data.processing > 0 ? renderBadge(data.processing) : null}
                        </View>
                        <Text ta="center" pt={'medium'} pb="medium">
                            Chờ vận chuyển
                        </Text>
                    </Ripple>
                    <Ripple style={styles.InfoOder} rippleCentered onPress={goToOrdersScreen(2)}>
                        <View>
                            <Icon
                                type="material-community"
                                name="truck-outline"
                                color={theme.colors.grey_[500]}
                                size={theme.typography.size(28)}
                            />
                            {data && data.shipping > 0 ? renderBadge(data.shipping) : null}
                        </View>
                        <Text ta="center" pt={'medium'} pb="medium">
                            Đang vận chuyển
                        </Text>
                    </Ripple>
                    <Ripple style={styles.InfoOder} rippleCentered onPress={goToOrdersScreen(3)}>
                        <View>
                            <Icon
                                type="material-community"
                                name="calendar-check-outline"
                                size={theme.typography.size(28)}
                                color={theme.colors.grey_[500]}
                            />
                            {data && data.complete > 0 ? renderBadge(data.complete) : null}
                        </View>
                        <Text ta="center" pt={'medium'} pb="medium">
                            Hoàn thành
                        </Text>
                    </Ripple>
                </View>
            );
        }

        return (
            <View style={{ width: '100%', height: '100%', alignItems: 'center' }}>
                <Text color={theme.colors.grey_[500]}>Đăng nhập để xem đơn hàng</Text>
            </View>
        );
    };

    return (
        <View style={styles.WrapInfoOder}>
            <Title
                titleLeft="Đơn hàng"
                titleRight="Xem chi tiết đơn hàng"
                IconLeft={
                    <Icon
                        type="material-community"
                        name="clipboard-text-outline"
                        size={theme.typography.title3}
                        color={theme.colors.main['600']}
                    />
                }
                containerProps={{ ph: 'medium' }}
                wrapperContainerStyle={{
                    marginBottom: theme.spacings.medium,
                }}
                titleLeftProps={{ size: 'body2', ml: 'small' }}
                titleRightProps={{ color: theme.colors.grey_[500], size: 'body1' }}
                chevron
                dividerBottom
                activeOpacity={0.8}
                onPress={goToOrdersScreen(0)}
            />
            {checkRenderOrder()}
        </View>
    );
});

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        WrapInfoOder: {
            backgroundColor: theme.colors.white_[10],
        },

        ListInfoOders: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingTop: theme.spacings.small,
        },
        InfoOder: {
            alignItems: 'center',
            width: '25%',
        },
    });
};

export default ProfileOrders;
