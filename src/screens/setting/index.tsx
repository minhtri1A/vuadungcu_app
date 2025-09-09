import { StackNavigationProp } from '@react-navigation/stack';
import { ListItem } from '@rneui/themed';
import Button from 'components/Button';
import Header from 'components/Header';
import IconButton from 'components/IconButton';
import Text from 'components/Text';
import Touch from 'components/Touch';
import View from 'components/View';
import {
    NAVIGATION_ACCOUNT_STACK,
    NAVIGATION_DELETE_ACCOUNT_SCREEN,
    NAVIGATION_SETTING_REFERRAL_SCREEN,
    NAVIGATION_SOCIAL_LINK_SCREEN,
} from 'const/routes';
import { useIsLogin, useNavigate, useTheme } from 'hooks';
import useUser from 'hooks/handle/useUser';
import React, { memo } from 'react';
import { Alert, ScrollView } from 'react-native';
import useStyles from './styles';
/* eslint-disable react-hooks/exhaustive-deps */

interface Props {
    navigation: StackNavigationProp<any, any>;
}

export default memo(function SettingScreen({ navigation }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles();
    const isLogin = useIsLogin();
    const { logout } = useUser();
    const navigate = useNavigate();
    //value

    //logout main
    const logutCurrentUser = () => {
        Alert.alert(
            'Đăng xuất ',
            'Bạn có chắc chắn muốn đăng xuất tài khoản!',
            [
                {
                    text: 'Trở lại',
                    style: 'cancel',
                },
                {
                    text: 'Đồng ý',
                    onPress: () => logout(),
                },
            ],
            { cancelable: true }
        );
    };
    return (
        <>
            <Header
                leftComponent={
                    <IconButton
                        type="ionicon"
                        name="arrow-back-outline"
                        onPress={navigation.goBack}
                        size={theme.typography.title3}
                        color={theme.colors.white_[10]}
                    />
                }
                centerComponent={{
                    text: 'Cài đặt',
                    style: { color: theme.colors.white_[10], fontSize: theme.typography.title2 },
                }}
            />
            <View style={styles.view_container}>
                <ScrollView style={styles.scrollview}>
                    {isLogin ? (
                        <>
                            {/* share - group */}
                            <Text
                                p="small"
                                fw="bold"
                                size={'body2'}
                                color={theme.colors.grey_[400]}
                            >
                                Tài khoản
                            </Text>
                            {/* account info */}
                            <ListItem
                                bottomDivider
                                containerStyle={styles.list_containerStyle}
                                onPress={() => {
                                    navigation.navigate(NAVIGATION_ACCOUNT_STACK);
                                }}
                            >
                                <ListItem.Title style={styles.list_title_style}>
                                    Thông tin tài khoản
                                </ListItem.Title>
                                <ListItem.Chevron size={theme.typography.body3} />
                            </ListItem>
                            {/* address */}
                            <ListItem
                                bottomDivider
                                containerStyle={styles.list_containerStyle}
                                onPress={navigate.ADDRESS_ROUTE({ type: 'customer' })}
                            >
                                <ListItem.Title style={styles.list_title_style}>
                                    Địa chỉ
                                </ListItem.Title>
                                <ListItem.Chevron size={theme.typography.body3} />
                            </ListItem>
                            {/* social */}
                            <ListItem
                                containerStyle={styles.list_containerStyle}
                                onPress={() => {
                                    navigation.navigate(NAVIGATION_SOCIAL_LINK_SCREEN);
                                }}
                            >
                                <ListItem.Title style={styles.list_title_style}>
                                    Liên kết mạng xã hội
                                </ListItem.Title>
                                <ListItem.Chevron size={theme.typography.body3} />
                            </ListItem>
                        </>
                    ) : null}
                    {/* share - group */}
                    {isLogin ? (
                        <>
                            <Text
                                p="small"
                                fw="bold"
                                size={'body2'}
                                color={theme.colors.grey_[400]}
                            >
                                Chia sẻ
                            </Text>
                            {/* referral */}
                            <ListItem
                                containerStyle={styles.list_containerStyle}
                                onPress={() => {
                                    navigation.navigate(NAVIGATION_SETTING_REFERRAL_SCREEN);
                                }}
                            >
                                <ListItem.Title style={styles.list_title_style}>
                                    Chia sẻ ứng dụng tích xu
                                </ListItem.Title>
                                <ListItem.Chevron size={theme.typography.body3} />
                            </ListItem>
                        </>
                    ) : null}

                    {isLogin ? (
                        <Touch
                            ml="small"
                            mt="small"
                            onPress={() => {
                                navigation.navigate(NAVIGATION_DELETE_ACCOUNT_SCREEN);
                            }}
                        >
                            <Text>Xoá tài khoản.</Text>
                        </Touch>
                    ) : null}
                </ScrollView>
                {/* button logout */}
                {isLogin ? (
                    <View p="small">
                        <Button
                            type="outline"
                            title={'Đăng xuất'}
                            bgColor="transparent"
                            activeOpacity={0.8}
                            onPress={logutCurrentUser}
                            color={theme.colors.grey_[500]}
                        />
                    </View>
                ) : null}
            </View>
            {/* loading */}
        </>
    );
});
