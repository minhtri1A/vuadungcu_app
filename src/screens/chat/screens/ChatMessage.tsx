/* eslint-disable react-hooks/exhaustive-deps */
import { RouteProp, useRoute } from '@react-navigation/native';
import { Icon } from '@rneui/themed';
import AfterInteractions from 'components/AfterInteractions';
import BottomSheet from 'components/BottomSheet';
import Button from 'components/Button';
import Disconnect from 'components/Disconnect';
import IconButton from 'components/IconButton';
import Image from 'components/Image';
import Text from 'components/Text';
import Touch from 'components/Touch';
import Video_ from 'components/Video';
import View from 'components/View';
import { REACT_NATIVE_APP_API_IMAGE } from 'const/env';
import { Status } from 'const/index';
import { useSocket } from 'context/SocketContext';
import withAuth from 'hoc/withAuth';
import { useInternet, useNavigate, useSellerSwr, useTheme } from 'hooks';
import { last } from 'lodash';
import {
    ChatDataSocketResponseType,
    MessageChatType,
    MessageDataSocketResponseType,
    UserDataSocketResponseType,
} from 'models';
import moment from 'moment';
import { ChatStackParamsList } from 'navigation/type';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    FlatList,
    KeyboardAvoidingView,
    ListRenderItem,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import ImagePicker, { ImageOrVideo, Options } from 'react-native-image-crop-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { services } from 'services';
import { sendSentryError } from 'utils/storeHelpers';
import { v4 as uuidv4 } from 'uuid';
import ChatMessageItem from '../components/ChatMessageItem';
import useStyles from './useStyles';
import Header from 'components/Header2';

const ChatMessage = memo(function ChatMessage() {
    //hook
    const styles = useStyles();
    const { theme } = useTheme();
    const router = useRoute<RouteProp<ChatStackParamsList, 'ChatMessage'>>();
    const navigate = useNavigate();
    const isInternet = useInternet();
    const { socket, event } = useSocket();
    //ref
    const flatlistRef = useRef<FlatList>(null);
    //params
    const user_uuid = router?.params?.user_uuid || '';
    //state
    //---visible
    const [openSheetImage, setOpenSheetImage] = useState(false);
    const [openSheetSeller, setOpenSheetSeller] = useState(false);
    const [showArrowScrollEnd, setShowArrowScrollEnd] = useState(false);
    const [countUnreadMessageUserSelected, setCountUnreadMessageUserSelected] = useState<number>(0);
    //--reply
    const [replyItem, setReplyItem] = useState<{
        message_uuid: string;
        user: string;
        user_type_send: 'C' | 'S';
        text?: any;
        bargain?: string;
        media?: {
            type: 'image' | 'video';
            message: any;
        };
        media_length: number;
    }>();
    const [indexReply, setIndexReply] = useState<number | undefined>();
    //--user
    //--data chat
    const [textChat, setTextChat] = useState('');
    const [userSelectedChat, setUserSelectedChat] = useState<UserDataSocketResponseType | null>(
        null
    );
    //--message data socket
    const [messageDataSocket, setMessageDataSocket] = useState<MessageDataSocketResponseType>();
    const [chatDataSocket, setChatDataSocket] = useState<ChatDataSocketResponseType>();
    //--image chat
    const [statusImageSelect, setStatusImageSelect] = useState<string>(Status.DEFAULT);
    const [listImageSelecte, setListImageSelect] = useState<
        Array<{ type: 'image' | 'video'; message: string }>
    >([]);
    //--status
    const [statusSendMessage, setStatusSendMessage] = useState<
        'default' | 'sending' | 'success' | 'error'
    >('default');
    const [statusGetMessage, setStatusGetMessage] = useState<string>(Status.DEFAULT);
    //swr
    const { seller } = useSellerSwr('seller_uuid', user_uuid);
    //value
    let preDateChat = '';
    let videoTemp = '/video/temp';
    //animation
    const bounceAnimation = useRef(new Animated.Value(0));
    const bounceAnimation_ = bounceAnimation.current.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, -10, 0],
        extrapolate: 'clamp',
    });
    const loopAnimationBounce = Animated.loop(
        Animated.timing(bounceAnimation.current, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        })
    );
    const replyBackgroundAnimation = useRef(new Animated.Value(0));
    const replyBackgroundAnimation_ = theme.animation(
        replyBackgroundAnimation.current,
        [0, 1],
        [theme.colors.main['100'], 'transparent']
    );
    //effect
    //--mounted
    useEffect(() => {
        return () => {
            //get news list user when return
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(
                    JSON.stringify({
                        action: 'get_list_user',
                    })
                );
            }
        };
    }, []);
    //--message image select
    useEffect(() => {
        if (statusImageSelect === Status.ERROR) {
            showMessage({
                message: 'Kích thước file tối đa 15mb và chiều dài tối đa 15 giây!',
                icon: 'danger',
                duration: 3000,
                onHide: () => setStatusImageSelect(Status.DEFAULT),
                position: 'bottom',
            });
        }
    }, [statusImageSelect]);
    //--effect socket
    useEffect(() => {
        if (socket && socket.readyState === WebSocket.OPEN && user_uuid) {
            //lay danh sach tin nhan va current user seller chat
            socket.send(
                JSON.stringify({
                    action: 'get_user',
                    user_uuid: user_uuid,
                })
            );
            //get message init
            if (messageDataSocket === undefined) {
                getListMessageSocket();
            }
            //presen socket error
            preSendErrorSocket();
        }
    }, [socket, user_uuid]);
    //--handle when event data change
    useEffect(() => {
        if (event) {
            const data = JSON.parse(event.data);

            switch (data.result_code) {
                case 'GET_LIST_MESSAGE_SUCCESS':
                    setMessageDataSocket({ ...data, list: data.list.reverse() });
                    setStatusGetMessage(Status.DEFAULT);
                    break;
                case 'GET_USER_SUCCESS':
                    //get current user
                    setUserSelectedChat(data);
                    break;
                case 'SEND_MESSAGE_SUCCESS':
                    setChatDataSocket(data);
                    setStatusSendMessage('success');
                    break;
                case 'RECEIVE_MESSAGE_SUCCESS':
                    setChatDataSocket(data);
                    break;
                case 'CONFIRM_BARGAIN_SUCCESS':
                    setMessageDataSocket((pre) => {
                        if (pre) {
                            const object = {
                                ...pre,
                                list: [
                                    {
                                        action: 'receive_message' as any,
                                        message: [
                                            {
                                                message: { status: data.message.value },
                                                type: data.action,
                                            },
                                        ],
                                        message_uuid: data.message_uuid,
                                        reply_from: data.reply_from,
                                        message_client_id: '',
                                        send_at: data.send_at,
                                        user_uuid: data.user_uuid,
                                    },
                                    ...pre?.list,
                                ],
                            };
                            return object;
                        }
                        return pre;
                    });

                    break;
                case 'NOT_SEND_MESSAGE':
                    setStatusSendMessage('error');
                    break;
                case 'USER_UUID_ERROR':
                    setStatusSendMessage('error');
                    break;
                case 'ERROR_UPLOAD_IMAGE':
                    setStatusSendMessage('error');
                    break;
                case 'ERROR_UPLOAD_VIDEO':
                    setStatusSendMessage('error');
                    break;
                case 'INVALID_MESSAGE':
                    setStatusSendMessage('error');
                    break;
                case 'NOT_GET_LIST_MESSAGE':
                    setStatusGetMessage(Status.ERROR);
                    break;
            }
        }
    }, [event]);

    //--messageDataSocket
    useEffect(() => {
        if (messageDataSocket) {
            //scroll khi gui tin nhan
            if (!showArrowScrollEnd || last(messageDataSocket.list)?.action === 'send_message') {
                // handleScrollToBottomChat();
            }
        }
    }, [messageDataSocket]);

    //--bounc arrow scroll end
    useEffect(() => {
        if (showArrowScrollEnd) {
            loopAnimationBounce.start();
        } else {
            loopAnimationBounce.stop();
        }
    }, [showArrowScrollEnd]);

    //--handle when send or receive success
    useEffect(() => {
        if (chatDataSocket && socket) {
            //neu nhan duoc tin nhan moi(chatDataSocket) phai la cua user dang chon(userSelectedChat) thi moi can phai them vao messageDataSocket
            if (chatDataSocket.user_uuid === userSelectedChat?.user.user_uuid) {
                //se khong goi lai get_list_message ma xu ly chatDataSocket de them message moi vao messageDataSocket
                let newMessageDataList: MessageDataSocketResponseType['list'] = [];
                if (chatDataSocket.action === 'send_message') {
                    //-- xoa temp_message(message tam duoc them vao khi gui)
                    newMessageDataList =
                        messageDataSocket?.list.filter(
                            (value) => value.message_client_id !== chatDataSocket.message_client_id
                        ) || [];
                } else {
                    //--neu nhan thi chi can clone lai list
                    newMessageDataList = [...(messageDataSocket?.list || [])];
                    //--dem tin nhan user_selected chua xem trong truong hop user scroll len tren
                    if (showArrowScrollEnd) {
                        setCountUnreadMessageUserSelected((pre) => pre + 1);
                    }
                }
                //--them message moi nhan duoc tu chatDataSocket vao messageDataSocket
                newMessageDataList = [
                    {
                        action: chatDataSocket.action,
                        user_uuid: chatDataSocket.user_uuid,
                        message_uuid: chatDataSocket.message_uuid,
                        message: chatDataSocket.message,
                        send_at: chatDataSocket.send_at,
                        message_client_id: chatDataSocket.message_client_id,
                        reply_from: chatDataSocket.reply_from,
                    },
                    ...newMessageDataList,
                ];
                let newMessageData = {
                    ...(messageDataSocket as any),
                    list: newMessageDataList,
                };
                setMessageDataSocket(newMessageData);
            }
        }
    }, [chatDataSocket]);

    //--animation reply
    useEffect(() => {
        if (indexReply !== undefined) {
            Animated.timing(replyBackgroundAnimation.current, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: false,
            }).start(() => {
                setIndexReply(undefined);
                replyBackgroundAnimation.current = new Animated.Value(0);
            });
        }
    }, [indexReply]);

    //render
    const renderFlatlist = useCallback(
        () => (
            <FlatList
                ref={flatlistRef}
                data={messageDataSocket?.list}
                renderItem={renderListContentChat}
                keyExtractor={(value, index) =>
                    value.message_uuid === 'temp_message' ? `${index}` : `${value.message_uuid}`
                }
                contentContainerStyle={{
                    padding: theme.spacings.small,
                    paddingBottom: theme.spacings.extraLarge,
                }}
                inverted={true}
                onScroll={visibleShowScrollToEndIcon}
                initialNumToRender={10}
                removeClippedSubviews={true}
                showsVerticalScrollIndicator={false}
            />
        ),
        [messageDataSocket, userSelectedChat, statusSendMessage, indexReply, seller]
    );

    const renderListContentChat: ListRenderItem<MessageChatType> = ({ item, index }) => {
        const currentDate = item?.send_at
            ? moment(item?.send_at, 'hh:mm DD-MM-YYYY').format('DD-MM-YYYY')
            : '';
        // preDateChat =  moment(value?.send_at, 'hh:mm DD-MM-YYYY').format('DD-MM-YYYY');
        const dateChatShow =
            preDateChat === ''
                ? ''
                : currentDate !== preDateChat || index + 1 === messageDataSocket?.list.length
                ? preDateChat
                : '';
        preDateChat = currentDate;
        const listLength = messageDataSocket?.list.length || 0;
        const nextSendAt = messageDataSocket?.list[index + 1]?.send_at || '';

        return (
            <>
                {index > 0 &&
                index + 1 !== listLength &&
                item?.send_at !== nextSendAt &&
                dateChatShow ? (
                    <Text color={theme.colors.grey_[400]} ta="center">
                        {dateChatShow}
                    </Text>
                ) : null}
                <Animated.View
                    style={{
                        backgroundColor:
                            indexReply === index ? replyBackgroundAnimation_ : undefined,
                    }}
                >
                    <ChatMessageItem
                        seller={seller}
                        item={item}
                        statusSendMessage={statusSendMessage}
                        key={item.message_uuid}
                        onPreSendError={handleClickPreSendMessageSocket}
                        onReplyMessage={handleReplyMessage}
                        scrollToMessageReply={scrollToMessageReply}
                    />
                </Animated.View>

                {index > 0 &&
                index + 1 === listLength &&
                item?.send_at !== nextSendAt &&
                dateChatShow ? (
                    <Text color={theme.colors.grey_[400]} ta="center">
                        {dateChatShow}
                    </Text>
                ) : null}
            </>
        );
    };

    //handle
    //--visible
    const visibleSheetImage = () => {
        setOpenSheetImage((pre) => !pre);
    };

    const visibleSheetSeller = () => {
        setOpenSheetSeller((pre) => !pre);
    };
    //--set state
    const handleSetTextChat = (text: string) => {
        setTextChat(text);
    };
    //--send message
    const handleSendMessage = () => {
        //send message socket
        if (
            socket &&
            (textChat.replace(/\s/g, '') !== '' || listImageSelecte.length > 0) &&
            userSelectedChat
        ) {
            setStatusSendMessage('sending');
            let data: Array<any> = [];
            data = listImageSelecte.length > 0 ? [...data, ...listImageSelecte] : data;
            data =
                textChat.replace(/\s/g, '') !== ''
                    ? [...data, { type: 'text', message: textChat }]
                    : data;
            const message_client_id = uuidv4().replace(/-/g, '');
            sendMessageSocket(data, message_client_id, replyItem?.message_uuid);
            //add temp data
            let cloneListMessage: MessageDataSocketResponseType['list'] = [
                ...(messageDataSocket?.list || []),
            ];

            cloneListMessage = [
                {
                    action: 'send_message',
                    message: data,
                    message_uuid: 'temp_message',
                    send_at: '',
                    user_uuid: userSelectedChat?.user.user_uuid,
                    message_client_id,
                    reply_from: replyItem
                        ? {
                              uuid: replyItem?.message_uuid,
                              user_type_send: replyItem?.user_type_send,
                              message_shortcut: {
                                  media: replyItem.media && {
                                      type: replyItem.media.type,
                                      url: replyItem.media.message,
                                  },
                                  text: replyItem?.text,
                                  title: replyItem.bargain,
                              },
                          }
                        : undefined,
                },
                ...cloneListMessage,
            ];
            const newMessageData = {
                ...(messageDataSocket as any),
                list: cloneListMessage,
            };
            setMessageDataSocket(newMessageData);
        }
        if (textChat !== '') {
            //reset input
            setTextChat('');
        }
        if (listImageSelecte.length > 0) {
            //reset image
            setListImageSelect([]);
        }

        if (replyItem) {
            setReplyItem(undefined);
        }
    };

    //--scroll
    const visibleShowScrollToEndIcon = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (e.nativeEvent.contentOffset.y > 5) {
            setShowArrowScrollEnd(true);
        } else {
            setCountUnreadMessageUserSelected(0);
            setShowArrowScrollEnd(false);
        }
    };
    const handleScrollToBottomChat = () => {
        flatlistRef.current?.scrollToOffset({ offset: 0 });
    };

    //--image picker
    const toggleImagePicker = (type: 'album' | 'camera') => async () => {
        const option: Options = {
            width: theme.dimens.scale(300),
            height: theme.dimens.scale(300),
            cropping: false,
            useFrontCamera: true,
            cropperToolbarTitle: 'Chọn hình ảnh / video chat',
            cropperCircleOverlay: true,
            showCropGuidelines: false,
            mediaType: 'any',
            includeBase64: true,
            multiple: true,
        };
        try {
            if (type === 'album') {
                ImagePicker.openPicker(option)
                    .then((image) => {
                        handleUploadImageVideo(image);
                    })
                    .catch((e) => {
                        if (e.code !== 'E_PICKER_CANCELLED') {
                        }
                    });
            }
            if (type === 'camera') {
                ImagePicker.openCamera(option)
                    .then((image) => {
                        handleUploadImageVideo([image]);
                    })
                    .catch((e) => {
                        if (e.code !== 'E_PICKER_CANCELLED') {
                        }
                    });
            }
        } catch (error) {
            setStatusImageSelect(Status.DEFAULT);
            sendSentryError(error, 'toggleImagePicker');
        }
    };

    const handleUploadImageVideo = (image: any) => {
        visibleSheetImage();
        try {
            const image_: Array<ImageOrVideo> = image as any;
            image_.forEach(async (value) => {
                const media_type = value.mime.split('/')[0];
                if (media_type === 'image') {
                    const imgBase64 = (value as any).data;
                    const imageData = `data:${value.mime};base64,${imgBase64}`;
                    setListImageSelect((pre) => [...pre, { type: 'image', message: imageData }]);
                }
                if (media_type === 'video') {
                    setStatusImageSelect(Status.LOADING);
                    let formData = new FormData();
                    formData.append('file', {
                        uri: value.path,
                        type: value.mime,
                        size: value.size,
                        name: last(value.path.split('/')),
                    });

                    const result = await services.admin.uploadImageTemp(formData);
                    if (result.code === 'SUCCESS') {
                        const videoSplit = result.video.split('/');
                        const name = last(videoSplit) || '';
                        videoSplit.pop();
                        videoTemp = videoSplit.join('/');
                        setListImageSelect((pre) => [...pre, { type: 'video', message: name }]);
                        setStatusImageSelect(Status.DEFAULT);
                    } else {
                        setStatusImageSelect(Status.ERROR);
                    }
                }
            });
        } catch (error: any) {
            sendSentryError(error, 'handleUploadImageVideo');
        }
    };

    const handleRemoveImageSelect = (index: number) => () => {
        setListImageSelect((pre) => {
            let clonePre = [...pre];
            clonePre.splice(index, 1);
            return [...clonePre];
        });
    };

    //reply
    const handleReplyMessage = (item: MessageChatType) => {
        const media = item.message.filter((v) => v.type === 'image' || v.type === 'video');
        const bargain = item.message.find(
            (v) => v.type === 'bargain' || v.type === 'confirm_bargain'
        );
        setReplyItem({
            message_uuid: item.message_uuid,
            user:
                item.action === 'send_message'
                    ? 'Trả lời chính mình'
                    : `Trả lời ${seller?.seller_name}`,
            user_type_send: item.action === 'send_message' ? 'C' : 'S',
            text: item.message.find((v) => v.type === 'text')?.message,
            bargain: bargain && bargain?.type === 'bargain' ? '[Trả giá]' : '[Xác nhận trả giá]',
            media: bargain
                ? {
                      type: 'image',
                      message:
                          bargain?.type === 'bargain'
                              ? (bargain.message as any).product_image
                              : item.reply_from?.message_shortcut?.media?.url,
                  }
                : (media[0] as any),
            media_length: bargain ? 1 : media.length,
        });
    };

    const scrollToMessageReply = (message_uuid: string) => () => {
        const index = messageDataSocket?.list.findIndex((v) => v.message_uuid === message_uuid);
        if (index && index !== -1) {
            flatlistRef.current?.scrollToIndex({ index, viewOffset: 100 });
            setIndexReply(index);
        }
    };
    const removeReplyChat = () => {
        setReplyItem(undefined);
    };

    //--socket
    const sendMessageSocket = (
        send_data: Array<{
            type: 'text' | 'image' | 'video' | 'bargain' | 'confirm_bargain';
            message: any;
        }>,
        message_client_id: string,
        reply_from?: string
    ) => {
        if (socket) {
            const data = {
                action: 'send_message',
                user_uuid: user_uuid,
                message: send_data,
                message_client_id,
                reply_from,
            };
            socket.send(JSON.stringify(data));
        }
    };

    const getListMessageSocket = () => {
        if (socket) {
            setStatusGetMessage(Status.LOADING);
            socket.send(
                JSON.stringify({
                    action: 'get_list_message',
                    user_uuid: user_uuid,
                })
            );
        }
    };

    const preSendErrorSocket = () => {
        //xu ly gui lai tin nhan tam
        if (statusSendMessage === 'sending' || statusSendMessage === 'error') {
            const listTempMessage = messageDataSocket?.list.filter(
                (value) => value.message_uuid === 'temp_message'
            );
            listTempMessage?.forEach((value) => {
                sendMessageSocket(value.message, value.message_client_id);
            });
        }
        // lay lai danh sach tin nhan
        if (statusGetMessage === Status.LOADING || statusGetMessage === Status.ERROR) {
            getListMessageSocket();
        }
    };

    const handleClickPreSendMessageSocket = (
        send_data: Array<{
            type: 'text' | 'image' | 'video' | 'bargain' | 'confirm_bargain';
            message: any;
        }>,
        message_client_id: string
    ) => {
        setStatusSendMessage('sending');
        sendMessageSocket(send_data, message_client_id);
    };

    return (
        <SafeAreaView style={styles.safe_view} edges={['bottom']}>
            <View style={styles.view_container}>
                <Header
                    center={
                        <Text size={'title2'} ta="center">
                            {userSelectedChat?.user.user_name || ''}
                        </Text>
                    }
                    right={
                        <TouchableOpacity
                            style={styles.touch_img_user_header}
                            onPress={visibleSheetSeller}
                        >
                            <Image
                                resizeMode="contain"
                                ratio={1}
                                source={
                                    userSelectedChat?.user.user_image
                                        ? { uri: userSelectedChat?.user.user_image }
                                        : require('asset/default-user.png')
                                }
                                radius={100}
                            />
                        </TouchableOpacity>
                    }
                    showGoBack
                    iconGoBackColor={theme.colors.black_[10]}
                    bgColor={theme.colors.white_[10]}
                />
                <AfterInteractions>
                    {/* body */}
                    {!isInternet ? (
                        <View flex={1} bg={theme.colors.white_[10]}>
                            <Disconnect reConnectedInternetProps={() => {}} height={'100%'} />
                        </View>
                    ) : (
                        <>
                            {/* list content chat */}
                            {statusGetMessage === Status.LOADING ? (
                                <View style={styles.view_list}>
                                    <ActivityIndicator color={theme.colors.grey_[400]} />
                                </View>
                            ) : statusGetMessage === Status.ERROR ? (
                                <View style={styles.view_list} jC="center" aI="center">
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
                                        onPress={getListMessageSocket}
                                    />
                                </View>
                            ) : (
                                <View style={styles.view_list}>
                                    {messageDataSocket ? renderFlatlist() : null}
                                    {showArrowScrollEnd ? (
                                        <Animated.View
                                            style={[
                                                styles.view_scroll_end,
                                                {
                                                    transform: [{ translateY: bounceAnimation_ }],
                                                },
                                            ]}
                                        >
                                            {countUnreadMessageUserSelected > 0 ? (
                                                <Text>
                                                    {countUnreadMessageUserSelected} tin mới
                                                </Text>
                                            ) : null}

                                            <IconButton
                                                type="ionicon"
                                                name="arrow-down-circle-outline"
                                                color={theme.colors.grey_[500]}
                                                size={theme.typography.size(30)}
                                                onPress={handleScrollToBottomChat}
                                            />
                                        </Animated.View>
                                    ) : null}
                                </View>
                            )}
                            {/* input */}
                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                            >
                                {/* input chat */}
                                <View style={styles.view_wrap_input}>
                                    {/* reply chat */}
                                    {replyItem ? (
                                        <Touch
                                            flexDirect="row"
                                            onPress={scrollToMessageReply(replyItem.message_uuid)}
                                            activeOpacity={0.8}
                                        >
                                            <View style={styles.view_relay_info}>
                                                <View flex={0.77}>
                                                    <Text
                                                        color={theme.colors.main['600']}
                                                        fw="bold"
                                                        size="body2"
                                                    >
                                                        {replyItem?.user}
                                                    </Text>
                                                    <Text numberOfLines={1}>
                                                        {replyItem?.text
                                                            ? replyItem?.text
                                                            : replyItem.bargain
                                                            ? replyItem.bargain
                                                            : replyItem?.media?.type === 'image'
                                                            ? '[Hình ảnh]'
                                                            : '[Video]'}
                                                    </Text>
                                                </View>
                                                {replyItem?.media ? (
                                                    <View style={styles.view_img_reply}>
                                                        {replyItem?.media?.type === 'image' ? (
                                                            <Image
                                                                source={{
                                                                    uri: replyItem?.media?.message,
                                                                }}
                                                                resizeMode="contain"
                                                            />
                                                        ) : (
                                                            <View>
                                                                <Video_
                                                                    source={{
                                                                        uri:
                                                                            replyItem?.media
                                                                                ?.message || '',
                                                                    }}
                                                                    autoplay={false}
                                                                    disableOption
                                                                />
                                                                <View
                                                                    style={
                                                                        styles.view_icon_video_reply
                                                                    }
                                                                >
                                                                    <Icon
                                                                        type="ionicon"
                                                                        name="play"
                                                                        size={theme.typography.size(
                                                                            20
                                                                        )}
                                                                        color={
                                                                            theme.colors
                                                                                .white_[10][10]
                                                                        }
                                                                    />
                                                                </View>
                                                            </View>
                                                        )}
                                                        {replyItem &&
                                                        replyItem?.media_length > 1 ? (
                                                            <Text style={styles.txt_more_reply}>
                                                                +{replyItem?.media_length - 1}
                                                            </Text>
                                                        ) : null}
                                                    </View>
                                                ) : null}
                                            </View>
                                            <View ml="small">
                                                <IconButton
                                                    type="ionicon"
                                                    name="close-outline"
                                                    color={theme.colors.grey_[400]}
                                                    size={theme.typography.size(28)}
                                                    onPress={removeReplyChat}
                                                />
                                            </View>
                                        </Touch>
                                    ) : null}

                                    <View style={styles.view_input_chat}>
                                        <IconButton
                                            type="ionicon"
                                            name="add-circle-outline"
                                            ml={'small'}
                                            color={theme.colors.grey_[400]}
                                            onPress={visibleSheetImage}
                                        />
                                        <TextInput
                                            value={textChat}
                                            placeholder="Nhắn tin..."
                                            style={styles.input_style}
                                            placeholderTextColor={theme.colors.grey_[500]}
                                            onChangeText={handleSetTextChat}
                                            multiline
                                        />

                                        <IconButton
                                            type="font-awesome"
                                            name="send"
                                            mr="medium"
                                            color={
                                                textChat.replace(/\s/g, '') === '' &&
                                                listImageSelecte.length === 0
                                                    ? theme.colors.grey_[400]
                                                    : theme.colors.main['600']
                                            }
                                            size={theme.typography.size(25)}
                                            onPress={handleSendMessage}
                                        />
                                    </View>
                                    {/* image select chat */}
                                    {listImageSelecte.length > 0 ||
                                    statusImageSelect === Status.LOADING ? (
                                        <View flexDirect="row" mt="small">
                                            {listImageSelecte.map((value, index) => (
                                                <TouchableOpacity
                                                    style={styles.touch_image_select}
                                                    key={index}
                                                    activeOpacity={0.9}
                                                    onPress={handleRemoveImageSelect(index)}
                                                >
                                                    {value.type === 'image' ? (
                                                        <Image
                                                            source={{ uri: value.message }}
                                                            resizeMode="contain"
                                                        />
                                                    ) : (
                                                        <>
                                                            <Video_
                                                                source={{
                                                                    uri: `${REACT_NATIVE_APP_API_IMAGE}/${videoTemp}/${value.message}`,
                                                                }}
                                                                autoplay={true}
                                                                disableOption
                                                            />
                                                        </>
                                                    )}

                                                    <View style={styles.view_icon_delete_img}>
                                                        <Icon
                                                            type="ionicon"
                                                            name="close-circle"
                                                            color={theme.colors.red['500']}
                                                            size={theme.typography.size(25)}
                                                            onPress={handleRemoveImageSelect(index)}
                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                            ))}
                                            {statusImageSelect === Status.LOADING ? (
                                                <View style={styles.touch_image_select}>
                                                    <ActivityIndicator />
                                                </View>
                                            ) : null}
                                        </View>
                                    ) : null}
                                </View>
                            </KeyboardAvoidingView>
                        </>
                    )}
                    {/* Bottom sheet image */}
                    <BottomSheet
                        isVisible={openSheetImage}
                        onBackdropPress={visibleSheetImage}
                        radius
                    >
                        <View flexDirect="row">
                            <View aI="center">
                                <IconButton
                                    type="ionicon"
                                    name="image"
                                    ml={'small'}
                                    color={theme.colors.white_[10]}
                                    size={theme.typography.size(30)}
                                    onPress={toggleImagePicker('album')}
                                    style={{
                                        backgroundColor: theme.colors.main['600'],
                                        padding: theme.spacings.small,
                                    }}
                                />
                                <Text>Hình ảnh</Text>
                            </View>
                            <View aI="center" jC="space-between" ml={'large'}>
                                <IconButton
                                    type="entypo"
                                    name="camera"
                                    ml={'small'}
                                    color={theme.colors.white_[10]}
                                    size={theme.typography.size(30)}
                                    onPress={toggleImagePicker('camera')}
                                    style={{
                                        backgroundColor: theme.colors.main['600'],
                                        padding: theme.spacings.small,
                                    }}
                                />
                                <Text>Camera</Text>
                            </View>
                        </View>
                    </BottomSheet>

                    {/* Bottom sheet seller */}
                    <BottomSheet
                        isVisible={openSheetSeller}
                        onBackdropPress={visibleSheetSeller}
                        radius
                    >
                        <View>
                            <Text mb={'large'} ta="center" fw="bold" size={'body2'}>
                                {userSelectedChat?.user.user_name}
                            </Text>
                            {seller ? (
                                <TouchableOpacity
                                    style={styles.touch_option_seller}
                                    onPress={navigate.SHOP_ROUTE({
                                        seller_code: seller.seller_code,
                                    })}
                                >
                                    <Text color={theme.colors.grey_[500]}>
                                        Xem thông tin gian hàng
                                    </Text>
                                </TouchableOpacity>
                            ) : null}

                            <TouchableOpacity style={styles.touch_option_seller}>
                                <Text color={theme.colors.grey_[400]}>Chặn gian hàng này!</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.touch_option_seller}
                                onPress={visibleSheetSeller}
                            >
                                <Text color={theme.colors.grey_[500]}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </BottomSheet>
                </AfterInteractions>
            </View>
        </SafeAreaView>
    );
});

// export default ChatMessage;
export default withAuth(ChatMessage, true);
