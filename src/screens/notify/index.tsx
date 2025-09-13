import { Icon } from '@rneui/themed';
import Header from 'components/Header2';
import Menu from 'components/Menu';
import MiniCart from 'components/MiniCart';
import Text from 'components/Text';
import View from 'components/View';
import withAuth from 'hoc/withAuth';
import { useTheme } from 'hooks';
import React, { memo } from 'react';
import { FlatList, ListRenderItem, StyleSheet, TouchableOpacity } from 'react-native';
import { themeType } from 'theme';
import NotifyItem from './components/NotifyItem';
/* eslint-disable react-hooks/exhaustive-deps */
// import { StackNavigationProp } from '@react-navigation/stack';

// interface Props {
//     navigation: StackNavigationProp<any, any>;
// }

const NotifyScreen = memo(function NotifyScreen() {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles(theme);

    //render

    //handle
    const renderListNotifyItem: ListRenderItem<number> = ({ index }) => <NotifyItem key={index} />;

    return (
        <View style={styles.view_container}>
            {/* <FocusAwareStatusBar
                translucent={true}
                backgroundColor={'transparent'}
                barStyle={'dark-content'}
            /> */}
            {/* header */}

            <Header
                center={
                    <Text size={'title2'} ta="center">
                        Thông báo
                    </Text>
                }
                right={
                    <View flex={1} flexDirect="row" aI="center">
                        <MiniCart color={theme.colors.grey_['600']} />
                        <Menu
                            iconButtonProps={{
                                type: 'ionicon',
                                name: 'settings',
                                color: theme.colors.grey_['600'],
                                ml: 'small',
                                size: theme.typography.size(23),
                            }}
                        >
                            <TouchableOpacity onPress={() => {}}>
                                <Text p={'small'}>Đánh dấu đã đọc</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {}}>
                                <Text p={'small'}>Đánh dấu đã đọc</Text>
                            </TouchableOpacity>
                        </Menu>
                    </View>
                }
                showGoBack
                iconGoBackColor={theme.colors.black_[10]}
                bgColor={theme.colors.white_[10]}
            />
            <View style={styles.view_body}>
                <FlatList
                    data={[1, 2, 3]}
                    keyExtractor={(value) => `${value}`}
                    renderItem={renderListNotifyItem}
                    contentContainerStyle={{ paddingBottom: theme.spacings.medium }}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <View flexDirect="row" aI="center">
                            <Icon
                                type="ionicon"
                                name="notifications"
                                color={theme.colors.grey_[400]}
                                size={theme.typography.size(18)}
                            />
                            <Text style={styles.txt_title_notify}>Hệ thống</Text>
                        </View>
                    }
                    ListFooterComponent={
                        <View flexDirect="row" aI="center" mt="medium">
                            <Icon
                                type="font-awesome-5"
                                name="clipboard-list"
                                color={theme.colors.grey_[400]}
                                size={theme.typography.size(18)}
                            />
                            <Text style={styles.txt_title_notify}>Đơn hàng</Text>
                        </View>
                    }
                />
            </View>
        </View>
    );
});

const useStyles = (theme: themeType) => {
    return StyleSheet.create({
        /* ------- screen ------- */
        view_container: {
            flex: 1,
            backgroundColor: theme.colors.bgMain,
        },
        view_body: {
            flex: 1,
            marginTop: theme.spacings.spacing(15),
            padding: theme.spacings.medium,
            zIndex: -1,
        },
        header_left: {
            flex: 0.25,
            alignItems: 'flex-start',
        },
        header_center: {
            flex: 1,
        },
        header_right: {
            flex: 0.25,
        },
        txt_title_notify: {
            borderRadius: 5,
            fontWeight: 'bold',
            color: theme.colors.grey_[400],
            // fontSize: theme.typography.body2,
            marginLeft: theme.spacings.tiny,
        },
    });
};

export default withAuth(NotifyScreen, true);
// export default NotifyScreen;
