/* eslint-disable react-hooks/exhaustive-deps */
import { Icon } from '@rneui/themed';
import AfterInteractions from 'components/AfterInteractions';
import BottomSheet from 'components/BottomSheet';
import Button from 'components/Button';
import Disconnect from 'components/Disconnect';
import Header from 'components/Header';
import Image from 'components/Image';
import Text from 'components/Text';
import View from 'components/View';
import { Status } from 'const/index';
import { useSocket } from 'context/SocketContext';
import { SET_CHAT_STATE } from 'features/action';
import {
    useAppDispatch,
    useAppSelector,
    useCustomerSwr,
    useInternet,
    useIsLogin,
    useNavigate,
    useTheme,
} from 'hooks';
import { last } from 'lodash';
import { ListUserDataSocketResponseType, UserChatType } from 'models';
import moment from 'moment';
import React, { memo, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Linking,
    ListRenderItem,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import Config from 'react-native-config';
import LinearGradient from 'react-native-linear-gradient';
import { calculatorBetweenTwoTime } from 'utils/helpers';
import ChatSearchModal from './components/ChatSearchModal';

const ChatListUser = memo(function ChatListUser() {
    //hook
    const styles = useStyles();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const { socket, event } = useSocket();
    const dispatch = useAppDispatch();
    const isLogin = useIsLogin();
    const isInternet = useInternet();
    //state
    //--redux state
    const totalCountUnreadMessage = useAppSelector(
        (state) => state.apps.chat.totalCountUnreadMessage
    );
    //--visible
    const [openSheet, setOpenSheet] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [statusGetListUser, setStatusGetListUser] = useState<string>(Status.DEFAULT);
    //--socket data
    //---user data socket
    const [userDataSocket, setUserDataSocket] = useState<ListUserDataSocketResponseType>();
    //--search
    //swr
    const { customers, mutate } = useCustomerSwr('all', { revalidateOnMount: false });
    //value

    //effect
    //--login
    useEffect(() => {
        if (isLogin) {
            mutate();
        }
    }, [isLogin]);
    //--effect init socket
    useEffect(() => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            //get list user init
            getListUserSocket();
        }
    }, [socket]);
    //--handle when event data change
    useEffect(() => {
        if (event) {
            const data = JSON.parse(event.data);
            switch (data.result_code) {
                case 'GET_LIST_USER_SUCCESS':
                    setUserDataSocket(data);
                    setStatusGetListUser(Status.DEFAULT);
                    break;
                case 'GET_LIST_USER_ERROR':
                    setUserDataSocket(data);
                    setStatusGetListUser(Status.ERROR);
                    break;
            }
        }
    }, [event]);

    //handle
    //--visible
    const visibleBottomSheet = () => {
        if (!isLogin) {
            navigate.LOGIN_ROUTE()();
            return;
        }
        setOpenSheet((pre) => !pre);
    };
    const visibleModalChat = () => {
        //visible search
        setOpenModal((pre) => !pre);
    };

    //send data socket
    const getListUserSocket = () => {
        if (socket) {
            setStatusGetListUser(Status.LOADING);
            socket.send(
                JSON.stringify({
                    action: 'get_list_user',
                })
            );
        }
    };

    //render
    const renderListRecentUser: ListRenderItem<UserChatType> = ({ item, index }) => {
        // return
        const lastLastMessage = last(item.last_message);
        const currentTime = Date.now();
        const timeMoment = moment(item?.last_send_at, 'hh:mm DD-MM-YYYY');
        const userTime = timeMoment.valueOf();
        const {
            num = 0,
            type = '',
            title = '',
        } = calculatorBetweenTwoTime(userTime, currentTime) || {};

        const timeShow =
            type === 'minute' || type === 'hours' || (type === 'day' && num <= 7)
                ? `${num || 1} ${title}`
                : type === 'day' ||
                  (type === 'month' &&
                      new Date(timeMoment.valueOf()).getFullYear() === new Date().getFullYear())
                ? timeMoment.format('DD/MM')
                : timeMoment.format('DD/MM/YYYY');

        return (
            <TouchableOpacity
                style={styles.touch_item_seller}
                key={index}
                onPress={navigateChatMessage(item.user_uuid, item.num_not_view)}
                activeOpacity={0.9}
            >
                <View flexDirect="row" flex={1}>
                    <View style={styles.view_img_seller_item}>
                        <Image
                            source={{ uri: item.user_image }}
                            radius={100}
                            resizeMode="contain"
                            style={styles.img_item_seller}
                        />
                    </View>
                    <View ml="medium">
                        <Text size={'body2'} numberOfLines={1}>
                            {item.user_name}
                        </Text>
                        <Text color={theme.colors.grey_[400]} numberOfLines={1}>
                            {lastLastMessage?.type === 'text'
                                ? lastLastMessage.message || `Chat với ${item.user_name}...`
                                : lastLastMessage?.type === 'image'
                                ? '[Hình ảnh]'
                                : lastLastMessage?.type === 'video'
                                ? '[Video]'
                                : `Chat với ${item.user_name}...`}
                        </Text>
                    </View>
                </View>

                <View>
                    <Text color={theme.colors.grey_[400]}>{timeShow}</Text>
                    {parseInt(item.num_not_view) > 0 ? (
                        <Text style={styles.txt_bagde}>{item.num_not_view}</Text>
                    ) : null}
                </View>
            </TouchableOpacity>
        );
    };

    //handle

    //navigate
    const handleOpenSocialChat = (url: string) => () => {
        Linking.openURL(url);
    };
    const navigateChatMessage = (user_uuid: string, num_not_view: string) => () => {
        if (totalCountUnreadMessage && totalCountUnreadMessage > 0 && parseInt(num_not_view) > 0) {
            dispatch(
                SET_CHAT_STATE({
                    totalCountUnreadMessage: totalCountUnreadMessage - parseInt(num_not_view),
                })
            );
        }
        navigate.CHAT_MESSAGE_ROUTE({ user_uuid })();
    };

    return (
        <View style={styles.view_container}>
            <Header
                centerTitle="Chat"
                rightComponent={
                    <TouchableOpacity
                        style={styles.touch_img_user_header}
                        onPress={visibleBottomSheet}
                    >
                        <Image
                            resizeMode="contain"
                            ratio={1}
                            source={
                                customers.image
                                    ? { uri: customers.image }
                                    : require('asset/default-user.png')
                            }
                            radius={100}
                        />
                    </TouchableOpacity>
                }
                backgroundColor={theme.colors.white_[10]}
                shadow={true}
            />
            <AfterInteractions>
                {/* contact chat */}
                <View style={styles.view_wrap_contact}>
                    <Text size={'body2'} mb="medium" fw="bold">
                        Liên hệ hỗ trợ
                    </Text>
                    <View style={styles.view_wrapIcon}>
                        <TouchableOpacity
                            style={styles.btn_iconSocial}
                            activeOpacity={0.8}
                            onPress={handleOpenSocialChat('https://zalo.me/1291488396020194562')}
                        >
                            <View style={styles.view_image}>
                                <Image
                                    source={require('asset/icon_zalo.png')}
                                    style={styles.img_social}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text size={'body1'} color={theme.colors.grey_[500]} fw="bold">
                                Zalo
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.btn_iconSocial}
                            activeOpacity={0.8}
                            onPress={handleOpenSocialChat('fb-messenger://user/108122111694904')}
                        >
                            <View style={styles.view_image}>
                                <Image
                                    source={require('asset/icon_messenger.png')}
                                    style={styles.img_social}
                                    resizeMode="contain"
                                />
                            </View>

                            <Text size={'body1'} color={theme.colors.grey_[500]} fw="bold">
                                Messenger
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.btn_iconSocial}
                            activeOpacity={0.8}
                            onPress={handleOpenSocialChat(
                                `tel: ${Config.REACT_NATIVE_APP_HOTLINE}`
                            )}
                        >
                            <LinearGradient
                                style={styles.liner_phone}
                                start={{ x: 0.2, y: 1 }}
                                end={{ x: 0.2, y: 0 }}
                                colors={['rgba(255, 98, 0, 1)', 'rgba(255, 214, 0, 1)']}
                            >
                                <Icon
                                    type="font-awesome-5"
                                    name="phone-alt"
                                    color={theme.colors.grey_[100]}
                                />
                            </LinearGradient>

                            <Text size={'body1'} color={theme.colors.grey_[500]} fw="bold">
                                Hotline
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* seller chat */}
                {!isInternet ? (
                    <View style={styles.view_wrap_sellers_chat}>
                        <Disconnect
                            reConnectedInternetProps={() => {}}
                            height={theme.dimens.height * 0.4}
                        />
                    </View>
                ) : (
                    <View style={styles.view_wrap_sellers_chat}>
                        <Text size={'body2'} fw="bold" mb="medium">
                            Gian hàng chat
                        </Text>
                        {!isLogin ? (
                            <View aI="center">
                                <Image
                                    source={require('asset/img-empty-chat.png')}
                                    w={theme.dimens.scale(250)}
                                    h={'auto'}
                                    ratio={1}
                                />
                                <Text
                                    size={'body3'}
                                    mb="medium"
                                    color={theme.colors.grey_[500]}
                                    ta="center"
                                >
                                    Chat trực tuyến với Vua Dụng Cụ!
                                </Text>
                                <Button
                                    title="Đăng nhập"
                                    containerWidth={theme.dimens.scale(250)}
                                    onPress={navigate.LOGIN_ROUTE()}
                                />
                            </View>
                        ) : statusGetListUser === Status.LOADING ? (
                            <View flex={0.8}>
                                <ActivityIndicator color={theme.colors.grey_[500]} />
                            </View>
                        ) : statusGetListUser === Status.ERROR ? (
                            <View flex={0.8} jC="center" aI="center">
                                <Icon
                                    type="material"
                                    name="error"
                                    color={theme.colors.grey_[500]}
                                />
                                <Text mv={'tiny'}>Đã xảy ra lỗi. Nhấn vào để thử lại!</Text>
                                <Button
                                    type="clear"
                                    title="Thử lại"
                                    size="sm"
                                    color={theme.colors.main['600']}
                                    onPress={getListUserSocket}
                                />
                            </View>
                        ) : userDataSocket && userDataSocket?.list?.length < 0 ? (
                            <View jC="center" aI="center" flex={0.5}>
                                <View w={theme.dimens.scale(80)} ratio={1} aS="center">
                                    <Image
                                        source={require('asset/img-history-chat.png')}
                                        resizeMode="contain"
                                    />
                                </View>
                                <Text size={'body2'} color={theme.colors.grey_[500]}>
                                    Chưa có lịch sử chat
                                </Text>
                            </View>
                        ) : (
                            <>
                                {/* search */}
                                <TouchableOpacity
                                    style={styles.touch_search_seller_chat}
                                    onPress={visibleModalChat}
                                >
                                    <Icon
                                        type="ionicon"
                                        name="search"
                                        color={theme.colors.grey_[400]}
                                        size={theme.typography.size(20)}
                                    />
                                    <Text color={theme.colors.grey_[400]} ml="small">
                                        Tìm kiếm gian hàng chat...
                                    </Text>
                                </TouchableOpacity>
                                {/* list user */}
                                <FlatList
                                    data={userDataSocket?.list || []}
                                    renderItem={renderListRecentUser}
                                    keyExtractor={(value) => `${value.user_uuid}`}
                                />
                            </>
                        )}
                    </View>
                )}

                {/* modal chat */}
                <ChatSearchModal
                    openModal={openModal}
                    visibleModalChat={visibleModalChat}
                    image={customers.image}
                    userDataSocket={userDataSocket}
                />
                {/* bottom sheet */}
                <BottomSheet
                    isVisible={openSheet}
                    radius
                    onBackdropPress={visibleBottomSheet}
                    triggerOnClose={visibleBottomSheet}
                >
                    <View flexDirect="row" aI="center">
                        <Image
                            w={theme.dimens.scale(60)}
                            resizeMode="contain"
                            ratio={1}
                            source={
                                customers.image
                                    ? { uri: customers.image }
                                    : require('asset/default-user.png')
                            }
                            radius={100}
                        />
                        <Text size={'body3'} ml="small">
                            {customers.fullname}
                        </Text>
                    </View>
                </BottomSheet>
            </AfterInteractions>
        </View>
    );
});

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        view_container: {
            flex: 1,
        },
        touch_img_user_header: {
            borderRadius: 100,
            width: theme.dimens.scale(25),
            aspectRatio: 1,
            backgroundColor: theme.colors.white_[10],
            ...theme.styles.shadow1,
        },
        //contact style
        view_wrap_contact: {
            backgroundColor: theme.colors.white_[10],
            zIndex: 1,
            padding: theme.spacings.medium,
        },
        view_wrapIcon: {
            flexDirection: 'row',
            justifyContent: 'space-around',
        },
        btn_iconSocial: {
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        view_image: {
            width: theme.dimens.scale(45),
            aspectRatio: 1,
        },
        img_social: {
            height: '100%',
            width: '100%',
        },

        liner_phone: {
            width: theme.dimens.scale(38),
            aspectRatio: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
        },
        //list user chat
        view_wrap_sellers_chat: {
            flex: 1,
            backgroundColor: theme.colors.white_[10],
            marginTop: theme.spacings.small,
            padding: theme.spacings.medium,
        },
        touch_search_seller_chat: {
            flexDirection: 'row',
            padding: theme.dimens.sizeElement('sm'),
            alignItems: 'center',
            marginBottom: theme.spacings.small,
            borderWidth: 1,
            borderColor: theme.colors.grey_[500],
            borderRadius: 5,
        },
        touch_item_seller: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            // padding: theme.spacings.small,
            marginTop: theme.spacings.large,
        },
        view_img_seller_item: {
            width: theme.dimens.moderateScale(60),
            aspectRatio: 1,
            borderRadius: 100,
            overflow: 'hidden',
            backgroundColor: theme.colors.white_[10],
            padding: 1,
            ...theme.styles.shadow1,
        },
        img_item_seller: {
            transform: [{ translateX: -0.8 }, { translateY: -0.2 }],
        },
        txt_bagde: {
            backgroundColor: theme.colors.main['200'],
            alignSelf: 'flex-start',
            aspectRatio: 1,
            borderRadius: 10,
            textAlign: 'center',
            color: theme.colors.white_[10],
            marginTop: theme.spacings.small,
        },
    });
};

export default ChatListUser;
