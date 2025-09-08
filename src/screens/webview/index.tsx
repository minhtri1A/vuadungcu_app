import Clipboard from '@react-native-clipboard/clipboard';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Header, Icon } from '@rneui/themed';
import IconButton from 'components/IconButton';
import Menu, { MenuRef } from 'components/Menu';
import Text from 'components/Text';
import View from 'components/View';
import { useNavigation, useTheme } from 'hooks';
import { RootStackParamsList } from 'navigation/type';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Linking, RefreshControl, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import WebView from 'react-native-webview';
import { themeType } from 'theme';

/* eslint-disable react-hooks/exhaustive-deps */

interface Props {}

const WebviewScreen = memo(function WebviewScreen({}: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const navigation = useNavigation();
    const router = useRoute<RouteProp<RootStackParamsList, 'WebViewScreen'>>();
    //refs
    const webviewRef = useRef<WebView>(null);
    const menuRef = useRef<MenuRef>(null);
    //state
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    //swr

    //value
    const urlParams = router.params.url;

    //effect

    useEffect(() => {
        if (urlParams) {
            setUrl(urlParams);
        }
    }, [urlParams]);

    //handle
    const handleClickCopyUrl = () => {
        Clipboard.setString(url);
        showMessage({
            message: 'Copy Url thành công',
            duration: 1000,
        });
        menuRef.current?.handleVisibleMenu();
    };

    const reloadWebview = () => {
        webviewRef.current?.reload();
        menuRef.current?.handleVisibleMenu();
    };

    const openBrowser = async () => {
        Linking.openURL(url)
            .catch((_) => {})
            .then((_) => {});
        menuRef.current?.handleVisibleMenu();
    };

    //render

    return (
        <View flex={1}>
            <Header
                statusBarProps={{ backgroundColor: theme.colors.main['600'] }}
                backgroundColor={theme.colors.white_[10]}
                leftComponent={
                    <View jC="center" aI="flex-start">
                        <IconButton
                            type="ionicon"
                            name="chevron-back"
                            color={theme.colors.black_[10]}
                            size={theme.typography.size(28)}
                            onPress={navigation.goBack}
                        />
                    </View>
                }
                centerComponent={
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.touch_header_center}
                        // onPress={handleClickCopyUrl}
                    >
                        <Text size={'body2'} fw="bold" numberOfLines={1}>
                            {title}
                        </Text>
                        <View flexDirect="row">
                            <View style={styles.view_center_icon}>
                                <Icon
                                    type="ionicon"
                                    name="lock-closed"
                                    color={theme.colors.grey_[500]}
                                    size={theme.typography.size(13)}
                                />
                            </View>
                            <View ml="tiny">
                                <Text
                                    size={'sub3'}
                                    color={theme.colors.grey_[500]}
                                    numberOfLines={1}
                                >
                                    {url}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                }
                rightComponent={
                    <View jC="center" aI="flex-end">
                        <Menu
                            ref={menuRef}
                            iconButtonProps={{
                                type: 'material-community',
                                name: 'dots-vertical',
                                color: theme.colors.black_[10],
                                size: theme.typography.size(28),
                                activeOpacity: 0.5,
                            }}
                        >
                            <View style={{ minWidth: theme.dimens.scale(200) }}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.touch_right_icon}
                                    onPress={reloadWebview}
                                >
                                    <Icon
                                        type="ionicon"
                                        name="reload"
                                        size={theme.typography.size(20)}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.touch_menu_item}
                                    onPress={handleClickCopyUrl}
                                >
                                    <Icon
                                        type="antdesign"
                                        name="copy1"
                                        size={theme.typography.size(20)}
                                    />
                                    <Text size={'body2'} flex={1} ta="center">
                                        Sao chép
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.touch_menu_item}
                                    onPress={openBrowser}
                                >
                                    <Icon
                                        type="material-community"
                                        name="web"
                                        size={theme.typography.size(20)}
                                    />
                                    <Text size={'body2'} flex={1} ta="center">
                                        Mở bằng trính duyệt
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Menu>
                    </View>
                }
                leftContainerStyle={styles.left_container}
                centerContainerStyle={styles.center_container}
                rightContainerStyle={styles.right_container}
                containerStyle={styles.header_container}
            />
            <ScrollView
                contentContainerStyle={styles.scrollview_content}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => {
                            webviewRef.current?.reload();
                        }}
                    />
                }
            >
                <WebView
                    ref={webviewRef}
                    source={{ uri: url }}
                    onLoadStart={(e) => {
                        if (e.nativeEvent.url !== 'about:blank') {
                            // setUrl(e.nativeEvent.url);
                            setTitle(e.nativeEvent.title);
                            return true;
                        }
                    }}
                    onLoadEnd={(e) => {
                        if (e.nativeEvent.url !== 'about:blank') {
                            setUrl(e.nativeEvent.url);
                            return true;
                        }
                    }}
                    pullToRefreshEnabled
                />
            </ScrollView>
            {/* menu */}
        </View>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        //header
        touch_header_center: {
            width: '100%',
            marginLeft: theme.spacings.medium,
        },
        view_center_icon: {
            justifyContent: 'center',
            borderRadius: 7,
        },
        touch_right_icon: {
            flexDirection: 'row',
            justifyContent: 'center',
            zIndex: 99999,
        },
        touch_menu_item: {
            flexDirection: 'row',
            borderTopWidth: 1,
            marginTop: theme.spacings.small,
            paddingTop: theme.spacings.small,
            borderColor: theme.colors.grey_[200],
        },
        left_container: {
            flex: 0.11,
            justifyContent: 'center',
            margin: 0,
        },
        center_container: {
            flex: 0.78,
        },
        right_container: {
            flex: 0.11,
            justifyContent: 'center',
        },
        header_container: {
            elevation: 2,
            zIndex: 9999,
        },
        scrollview_content: {
            flex: 1,
        },
    });

export default WebviewScreen;

//pending: chờ xử lý
//send,receive(processing): đang xử lý
//success: bảo hành xong
