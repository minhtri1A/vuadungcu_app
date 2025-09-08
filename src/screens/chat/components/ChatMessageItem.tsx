/* eslint-disable react-hooks/exhaustive-deps */
import Clipboard from '@react-native-clipboard/clipboard';
import { BottomSheet, Icon } from '@rneui/themed';
import Button from 'components/Button';
import Image from 'components/Image';
import Text from 'components/Text';
import Touch from 'components/Touch';
import Video_ from 'components/Video';
import View from 'components/View';
import { Status } from 'const/index';
import { useSocket } from 'context/SocketContext';
import { useNavigate, useTheme } from 'hooks';
import { MessageChatBargainType, MessageChatType, SellerInfoResponseType } from 'models';
import moment from 'moment';
import React, { memo, useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Modal from 'react-native-modal';
import { currencyFormat } from 'utils/helpers';
import useStyles from './../screens/useStyles';

interface Props {
    item: MessageChatType;
    statusSendMessage: 'default' | 'sending' | 'success' | 'error';
    seller: SellerInfoResponseType;
    onPreSendError: (
        send_data: Array<{
            type: 'text' | 'image' | 'video' | 'bargain' | 'confirm_bargain';
            message: MessageChatType['message'][0]['message'];
        }>,
        message_client_id: string
    ) => void;
    onReplyMessage: (item: MessageChatType) => void;
    scrollToMessageReply: (message_uuid: string) => () => void;
}

const ChatMessageItem = memo(
    (props: Props) => {
        //hook
        const styles = useStyles();
        const { theme } = useTheme();
        const { socket, event } = useSocket();
        const navigate = useNavigate();
        //props
        const {
            item,
            statusSendMessage,
            seller,
            onPreSendError,
            onReplyMessage,
            scrollToMessageReply,
        } = props;
        //state
        const [openSheet, setOpenSheet] = useState(false);
        //--bargain
        const [openSheetBargain, setOpenSheetBargain] = useState(false);
        // const [productQty, setProductQty] = useState(0);
        const [qtyBargain, setQtyBargain] = useState(1);
        const [priceBargain, setPriceBargain] = useState(0);
        const [messageBargain, setMessageBargain] = useState('');
        const [statusBargain, setStatusBargain] = useState<string>(Status.DEFAULT);
        const [bargainData, setBargainData] = useState<MessageChatBargainType | undefined>();
        //value
        const timeMessage = item?.send_at
            ? moment(item?.send_at, 'hh:mm DD-MM-YYYY').format('HH:mm')
            : '';
        //check temp message
        const errorMessage = item.message_uuid === 'temp_message' && statusSendMessage === 'error';

        //effect
        //--event socket - handle update bargain
        useEffect(() => {
            if (event && item.message[0].type === 'bargain') {
                const data = JSON.parse(event.data);

                switch (data.result_code) {
                    case 'UPDATE_BARGAIN_SUCCESS':
                        const messageData = data.message_update;
                        if (data.message_uuid === item.message_uuid) {
                            setBargainData((pre) => {
                                if (pre) {
                                    if (messageData.type === 'price') {
                                        return {
                                            ...pre,
                                            price: messageData.value.price,
                                            qty_bargain: messageData.value.qty_bargain,
                                            price_bargain: messageData.value.price_bargain,
                                        };
                                    } else {
                                        return {
                                            ...pre,
                                            status: messageData.value,
                                        };
                                    }
                                }
                            });
                            //set state when update success
                            showMessage({
                                message:
                                    messageData.type === 'price'
                                        ? 'Cập nhật trả giá thành công!'
                                        : 'Huỷ trả giá thành công!',
                                type: 'success',
                                icon: 'danger',
                            });
                            setOpenSheetBargain(false);
                            setStatusBargain(Status.DEFAULT);
                        }

                        break;
                    case 'NOT_ALLOW_PRICE_BARGAIN_LESS_THAN_50_CURRENT_PRICE':
                    case 'REQUIRED_MESSAGE_BARGAIN_UUID':
                    case 'SELLER_NOT_UPDATE_BARGAIN':
                    case 'USER_UUID_ERROR':
                    case 'INCORRECT_STATUS':
                    case 'INCORRECT_PARAM_UPDATE_BARGAIN':
                    case 'MESSAGE_BARGAIN_NOT_EXIST':
                    case 'PRODUCT_NOT_ACTIVE':
                    case 'INCORRECT_MESSAGE_BARGAIN':
                    case 'INFO_BARGAIN_NOT_CHANGE':
                    case 'NOT_ALLOW_PRICE_BARGAIN_LESS_THAN_50_CURRENT_PRICE':
                    case 'PRICE_BARGAIN_MUST_LESS_THAN_PRICE':
                    case 'ERROR_UPDATE_BARGAIN':
                    case 'PRICE_BARGAIN_MUST_LESS_THAN_PRICE':
                        setStatusBargain(Status.ERROR);
                        break;
                }
            }
        }, [event]);
        //--get bargain socket in item
        useEffect(() => {
            item.message.forEach((v) => {
                if (v.type === 'bargain') {
                    const mes =
                        typeof v.message === 'object' && v.type === 'bargain'
                            ? v.message
                            : (undefined as any);
                    setBargainData({
                        ...mes,
                        price: parseInt(mes.price),
                        price_bargain: parseInt(mes.price_bargain),
                        qty_bargain: parseInt(mes.qty_bargain),
                    });
                }
            });
        }, []);

        //handle
        const handlePress = () => {
            onPreSendError(item.message, item.message_client_id);
        };

        const visibleSheetOptions = () => {
            setOpenSheet((pre) => !pre);
        };

        const handleSelectOption = (type: 'reply' | 'copy' | 'cancel') => () => {
            if (type === 'reply') {
                onReplyMessage(item);
            }
            if (type === 'copy') {
                copyToClipboard();
            }
            if (type === 'cancel') {
            }
            //cancel
            visibleSheetOptions();
        };

        const copyToClipboard = () => {
            if (typeof item.message[0].message === 'string') {
                Clipboard.setString(item.message[0].message);
            }
        };

        //--bargain
        const visibleSheetBargain = (qty?: number, price?: number) => () => {
            if (qty && price) {
                setQtyBargain(qty);
                setPriceBargain(price);
            }
            setOpenSheetBargain((pre) => !pre);
        };

        const handleChangeQtyBargain = (value: string) => {
            setQtyBargain(parseInt(value));
            //message
            setMessageBargain(parseInt(value) < 1 ? 'Số lượng tối thiểu phải là 1' : '');
        };

        const handleTouchChangeQtyBargain = (type: 'incre' | 'deincre') => () => {
            if (type === 'incre' || (type === 'deincre' && qtyBargain > 1)) {
                setQtyBargain((pre) => (type === 'incre' ? pre + 1 : pre - 1));
                setMessageBargain('');
            } else {
                setMessageBargain(type === 'deincre' ? 'Số lượng tối thiểu phải là 1' : '');
            }
        };

        const handleChangePriceBargain = (original_price: number) => (value: string) => {
            const value_ = parseInt(value.replace(/\./g, ''));
            // const initPrice
            if (value_ < original_price / 2) {
                setMessageBargain('Bạn không thể trả giá thấp hơn 50% giá gốc');
            } else if (value_ >= original_price) {
                setMessageBargain('Bạn không thể trả giá cao hơn hoặc bằng giá gốc');
            } else {
                setMessageBargain('');
            }
            setPriceBargain(value === '' ? 0 : parseInt(value.replace(/\./g, '')));
        };

        const handleCancelBargain = () => {
            Alert.alert('Huỷ bỏ trả giá', 'Bạn có muốn huỷ bỏ trả giá sản phẩm này!', [
                {
                    text: 'Trở lại',
                    style: 'cancel',
                },
                { text: 'Đồng ý', onPress: sendUpdateBargainSocket(true) },
            ]);
        };

        //socket
        const sendUpdateBargainSocket = (cancel: boolean) => () => {
            if (socket && messageBargain === '' && statusBargain !== Status.LOADING) {
                setStatusBargain(Status.LOADING);
                const data = {
                    action: 'update_bargain',
                    user_uuid: item.user_uuid,
                    message_bargain_uuid: item.message_uuid,
                    qty_bargain: qtyBargain,
                    price_bargain: priceBargain,
                    status: cancel ? 'cancel' : undefined,
                };
                socket.send(JSON.stringify(data));
            }
        };

        //render
        const renderBargainItem = (update = false) =>
            bargainData ? (
                <TouchableOpacity style={styles.view_bargain} activeOpacity={1}>
                    <View
                        style={[
                            styles.view_bargain_title,
                            {
                                backgroundColor:
                                    bargainData?.status === 'yes'
                                        ? theme.colors.green['500']
                                        : bargainData?.status === 'no'
                                        ? theme.colors.red['400']
                                        : bargainData?.status === 'cancel'
                                        ? theme.colors.grey_[400]
                                        : theme.colors.main['600'],
                            },
                        ]}
                    >
                        <Text ta="center" color={theme.colors.white_[10]}>
                            {update ? 'Cập nhật trả giá' : 'Trả giá'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.view_bargain_info}
                        activeOpacity={0.9}
                        onPress={
                            !update
                                ? navigate.PRODUCT_DETAIL_ROUTE(
                                      bargainData.product_uuid,
                                      bargainData.product_seller_uuid
                                  )
                                : undefined
                        }
                        onLongPress={visibleSheetOptions}
                    >
                        <View w={50} ratio={1}>
                            <Image
                                source={{
                                    uri: bargainData?.product_image,
                                }}
                                resizeMode="contain"
                                radius={3}
                            />
                        </View>
                        <View flex={1} ml="small">
                            <Text numberOfLines={1}>{bargainData?.product_name}</Text>
                            <Text size={'sub2'} color={theme.colors.grey_[500]}>
                                Giá gốc: {currencyFormat(bargainData?.price)}
                            </Text>
                            <Text size={'sub2'} color={theme.colors.red['500']}>
                                {`Trả giá: ${currencyFormat(bargainData?.price_bargain)} x${
                                    bargainData?.qty_bargain
                                }`}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View flexDirect="row" jC="space-between" pr="small" pb={'small'}>
                        <View />
                        {bargainData?.status === 'yes' ? (
                            <Text style={styles.txt_bargain_accept}>Đã đồng ý</Text>
                        ) : bargainData?.status === 'no' ? (
                            <Text style={styles.txt_bargain_reject}>Không đồng ý</Text>
                        ) : bargainData?.status === 'cancel' ? (
                            <Text style={styles.txt_bargain_cancel}>Đã huỷ</Text>
                        ) : !update ? (
                            <View flexDirect="row" w={'100%'}>
                                <Touch flex={0.5} onPress={handleCancelBargain}>
                                    <Text color={theme.colors.grey_[500]} ta="center">
                                        Huỷ
                                    </Text>
                                </Touch>
                                <Touch
                                    flex={0.5}
                                    onPress={visibleSheetBargain(
                                        bargainData.qty_bargain,
                                        bargainData.price_bargain
                                    )}
                                >
                                    <Text color={theme.colors.main['600']} ta="center">
                                        Sửa
                                    </Text>
                                </Touch>
                            </View>
                        ) : (
                            <View>
                                <Text style={styles.txt_bargain_cancel}>Đang cập nhật</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            ) : null;

        return (
            <View>
                {/* send */}
                {item.action === 'send_message' ? (
                    <View style={[styles.view_wrap_send]}>
                        <Touch
                            style={[[styles.view_message_item]]}
                            aI="flex-end"
                            activeOpacity={0.8}
                            onPress={errorMessage ? handlePress : undefined}
                            onLongPress={visibleSheetOptions}
                        >
                            {item.message.map((v2, i2) => {
                                const messageObject =
                                    typeof v2.message === 'object' && v2.type === 'bargain'
                                        ? v2.message
                                        : undefined;
                                return v2.type === 'image' ? (
                                    <View style={styles.view_image} key={i2}>
                                        <Image
                                            source={{ uri: v2.message as string }}
                                            resizeMode="contain"
                                            radius={5}
                                            w={200}
                                            h={'auto'}
                                            dynamicRatio
                                            key={i2}
                                        />
                                    </View>
                                ) : v2.type === 'video' ? (
                                    <View style={styles.view_video} key={i2}>
                                        <Video_
                                            source={{
                                                uri: v2.message as string,
                                            }}
                                            autoplay={false}
                                        />
                                    </View>
                                ) : v2.type === 'text' ? (
                                    <View style={styles.view_send} key={i2}>
                                        {item.reply_from ? (
                                            <TouchableOpacity
                                                style={styles.view_reply_send}
                                                activeOpacity={0.8}
                                                onPress={scrollToMessageReply(item.reply_from.uuid)}
                                            >
                                                {item.reply_from.message_shortcut.media ? (
                                                    <View
                                                        w={theme.dimens.scale(45)}
                                                        ratio={1}
                                                        radius={2}
                                                    >
                                                        {item.reply_from.message_shortcut.media
                                                            .type === 'image' ? (
                                                            <Image
                                                                source={{
                                                                    uri:
                                                                        item.reply_from
                                                                            .message_shortcut.media
                                                                            .url || '',
                                                                }}
                                                                resizeMode="contain"
                                                            />
                                                        ) : (
                                                            <View>
                                                                <Video_
                                                                    source={{
                                                                        uri:
                                                                            item.reply_from
                                                                                .message_shortcut
                                                                                .media.url || '',
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
                                                    </View>
                                                ) : null}

                                                <View flex={0.8} ml="tiny">
                                                    <Text
                                                        numberOfLines={1}
                                                        color={theme.colors.grey_[500]}
                                                        fw="bold"
                                                    >
                                                        {item.reply_from.user_type_send === 'C'
                                                            ? 'Trả lời chính mình'
                                                            : `Trả lời ${
                                                                  seller?.seller_name || ''
                                                              }`}
                                                    </Text>
                                                    <Text
                                                        color={theme.colors.grey_[500]}
                                                        numberOfLines={1}
                                                    >
                                                        {item.reply_from.message_shortcut.title
                                                            ? `[${item.reply_from.message_shortcut.title}]`
                                                            : item.reply_from.message_shortcut.text
                                                            ? item.reply_from.message_shortcut.text
                                                            : item.reply_from.message_shortcut
                                                                  ?.media?.type === 'image'
                                                            ? '[Hình ảnh]'
                                                            : item.reply_from.message_shortcut
                                                                  ?.media?.type === 'video'
                                                            ? '[Video]'
                                                            : 'Tin nhắn đã bị xoá'}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        ) : null}

                                        <Text style={styles.txt_send}>{v2.message as any}</Text>
                                    </View>
                                ) : v2.type === 'bargain' && messageObject ? (
                                    <View key={i2}>
                                        {/* bargain */}
                                        {renderBargainItem()}
                                        {/* edit bargain modal */}
                                        <BottomSheet
                                            isVisible={openSheetBargain}
                                            onBackdropPress={visibleSheetBargain()}
                                            containerStyle={{
                                                backgroundColor: theme.colors.black_[10],
                                            }}
                                        >
                                            <KeyboardAvoidingView
                                                behavior={
                                                    Platform.OS === 'ios' ? 'position' : undefined
                                                }
                                            >
                                                {/* bargain info */}
                                                <View aI="center" mb="tiny">
                                                    {renderBargainItem(true)}
                                                </View>
                                                {/* input bargain update */}
                                                <View style={styles.view_sheet_input}>
                                                    <View style={styles.view_wrap_bargain_input}>
                                                        <View
                                                            style={styles.view_bargain_input_left}
                                                        >
                                                            <Text
                                                                color={theme.colors.grey_[500]}
                                                                size={'sub3'}
                                                            >
                                                                Số lượng
                                                            </Text>
                                                        </View>
                                                        <TextInput
                                                            value={
                                                                qtyBargain === 0
                                                                    ? ''
                                                                    : `${qtyBargain}`
                                                            }
                                                            placeholder="Nhập số lượng"
                                                            placeholderTextColor={
                                                                theme.colors.grey_[400]
                                                            }
                                                            keyboardType="numeric"
                                                            style={styles.input_bargain_}
                                                            onChangeText={handleChangeQtyBargain}
                                                        />
                                                        <View
                                                            style={
                                                                styles.view_bargain_input_right_qty
                                                            }
                                                        >
                                                            <TouchableOpacity
                                                                style={styles.touch_plush_minus}
                                                                onPress={handleTouchChangeQtyBargain(
                                                                    'deincre'
                                                                )}
                                                            >
                                                                <Text
                                                                    color={theme.colors.grey_[500]}
                                                                    size={'title1'}
                                                                >
                                                                    -
                                                                </Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                style={styles.touch_plush_minus}
                                                                onPress={handleTouchChangeQtyBargain(
                                                                    'incre'
                                                                )}
                                                            >
                                                                <Text
                                                                    color={theme.colors.grey_[500]}
                                                                    size={'body2'}
                                                                >
                                                                    +
                                                                </Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                    <View
                                                        style={styles.view_wrap_bargain_input}
                                                        mt="small"
                                                    >
                                                        <View
                                                            style={styles.view_bargain_input_left}
                                                        >
                                                            <Text
                                                                color={theme.colors.grey_[500]}
                                                                size={'sub3'}
                                                            >
                                                                Trả giá
                                                            </Text>
                                                        </View>
                                                        <TextInput
                                                            style={styles.input_bargain_}
                                                            value={
                                                                priceBargain > 0
                                                                    ? currencyFormat(
                                                                          priceBargain,
                                                                          false
                                                                      )
                                                                    : ''
                                                            }
                                                            onChangeText={handleChangePriceBargain(
                                                                (messageObject as any).price
                                                            )}
                                                            blurOnSubmit={false}
                                                            placeholder="Nhập giá"
                                                            placeholderTextColor={
                                                                theme.colors.grey_[400]
                                                            }
                                                        />
                                                        <View
                                                            style={
                                                                styles.view_bargain_input_right_price
                                                            }
                                                        >
                                                            <Text
                                                                color={theme.colors.grey_[500]}
                                                                size={'sub3'}
                                                            >
                                                                VNĐ
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    {messageBargain ? (
                                                        <Text color="red" ta="center" size="sub2">
                                                            ({messageBargain})
                                                        </Text>
                                                    ) : null}

                                                    <View
                                                        mt="small"
                                                        flexDirect="row"
                                                        jC="space-between"
                                                    >
                                                        <Button
                                                            title="Huỷ bỏ"
                                                            type="outline"
                                                            color={theme.colors.grey_[400]}
                                                            minWidth={'49%'}
                                                            onPress={visibleSheetBargain()}
                                                        />
                                                        <Button
                                                            title="Cập nhật"
                                                            minWidth={'49%'}
                                                            onPress={sendUpdateBargainSocket(false)}
                                                            loading={
                                                                statusBargain === Status.LOADING
                                                            }
                                                            disabled={
                                                                bargainData &&
                                                                (priceBargain <
                                                                    bargainData?.price / 2 ||
                                                                    priceBargain >=
                                                                        bargainData?.price ||
                                                                    (priceBargain ===
                                                                        bargainData.price_bargain &&
                                                                        qtyBargain ===
                                                                            bargainData.qty_bargain))
                                                            }
                                                        />
                                                    </View>
                                                </View>
                                            </KeyboardAvoidingView>
                                        </BottomSheet>
                                    </View>
                                ) : null;
                            })}

                            <Text ta="right" color={theme.colors.grey_[400]}>
                                {timeMessage
                                    ? timeMessage
                                    : statusSendMessage === 'sending'
                                    ? 'Đang gửi'
                                    : statusSendMessage === 'error'
                                    ? 'Nhấn vào gửi lại!'
                                    : ''}
                            </Text>
                        </Touch>
                    </View>
                ) : null}

                {/* receive */}
                {item.action === 'receive_message' ? (
                    <View style={styles.view_wrap_receive}>
                        <Touch
                            style={styles.view_message_item}
                            aI="flex-start"
                            activeOpacity={0.8}
                            onLongPress={visibleSheetOptions}
                        >
                            {item.message.map((v2, i2) =>
                                v2.type === 'image' ? (
                                    <View style={styles.view_image} key={i2}>
                                        <Image
                                            source={{ uri: v2.message as string }}
                                            resizeMode="contain"
                                            radius={5}
                                            w={200}
                                            h={'auto'}
                                            dynamicRatio
                                            key={i2}
                                        />
                                    </View>
                                ) : v2.type === 'video' ? (
                                    <View style={styles.view_video} key={i2}>
                                        <Video_
                                            source={{
                                                uri: v2.message as string,
                                            }}
                                            autoplay={false}
                                        />
                                    </View>
                                ) : v2.type === 'text' ? (
                                    <View style={styles.view_receive} key={i2}>
                                        {item.reply_from ? (
                                            <TouchableOpacity
                                                style={styles.view_reply_receive}
                                                activeOpacity={0.8}
                                                onPress={scrollToMessageReply(item.reply_from.uuid)}
                                            >
                                                {item.reply_from.message_shortcut.media ? (
                                                    <View
                                                        w={theme.dimens.scale(45)}
                                                        ratio={1}
                                                        radius={2}
                                                    >
                                                        {item.reply_from.message_shortcut.media
                                                            .type === 'image' ? (
                                                            <Image
                                                                source={{
                                                                    uri:
                                                                        item.reply_from
                                                                            .message_shortcut.media
                                                                            .url || '',
                                                                }}
                                                                resizeMode="contain"
                                                            />
                                                        ) : (
                                                            <View>
                                                                <Video_
                                                                    source={{
                                                                        uri:
                                                                            item.reply_from
                                                                                .message_shortcut
                                                                                .media.url || '',
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
                                                                            theme.colors.white_[10]
                                                                        }
                                                                    />
                                                                </View>
                                                            </View>
                                                        )}
                                                    </View>
                                                ) : null}

                                                <View flex={0.8} ml="tiny">
                                                    <Text
                                                        numberOfLines={1}
                                                        color={theme.colors.grey_[500]}
                                                        fw="bold"
                                                    >
                                                        {item.reply_from.user_type_send === 'S'
                                                            ? 'Trả lời chính mình'
                                                            : 'Trả lời bạn'}
                                                    </Text>
                                                    <Text
                                                        color={theme.colors.grey_[500]}
                                                        numberOfLines={1}
                                                    >
                                                        {item.reply_from.message_shortcut.title
                                                            ? `[${item.reply_from.message_shortcut.title}]`
                                                            : item.reply_from.message_shortcut.text
                                                            ? item.reply_from.message_shortcut.text
                                                            : item.reply_from.message_shortcut
                                                                  ?.media?.type === 'image'
                                                            ? '[Hình ảnh]'
                                                            : item.reply_from.message_shortcut
                                                                  ?.media?.type === 'video'
                                                            ? '[Video]'
                                                            : 'Tin nhắn đã xoá'}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        ) : null}

                                        <Text style={styles.txt_receive}>{v2.message as any}</Text>
                                    </View>
                                ) : v2.type === 'confirm_bargain' && item.reply_from ? (
                                    <TouchableOpacity
                                        style={[styles.view_bargain]}
                                        activeOpacity={1}
                                        key={i2}
                                        onLongPress={visibleSheetOptions}
                                    >
                                        <View
                                            style={[
                                                styles.view_bargain_title,
                                                {
                                                    backgroundColor:
                                                        (v2.message as any).status === 'yes'
                                                            ? theme.colors.green['500']
                                                            : theme.colors.red['400'],
                                                },
                                            ]}
                                        >
                                            <Text ta="center" color={theme.colors.white_[10]}>
                                                Xác nhận trả giá
                                            </Text>
                                        </View>

                                        <TouchableOpacity
                                            style={[styles.view_bargain_info]}
                                            activeOpacity={0.9}
                                            onPress={scrollToMessageReply(item.reply_from.uuid)}
                                            onLongPress={visibleSheetOptions}
                                        >
                                            <View w={50} ratio={1}>
                                                <Image
                                                    source={{
                                                        uri: item.reply_from?.message_shortcut.media
                                                            ?.url,
                                                    }}
                                                    resizeMode="contain"
                                                    radius={3}
                                                />
                                            </View>
                                            <View flex={1} ml="small">
                                                <Text numberOfLines={1}>
                                                    {item.reply_from?.message_shortcut.text}
                                                </Text>
                                                <View flexDirect="row">
                                                    <Text
                                                        style={
                                                            (v2.message as any).status === 'yes'
                                                                ? styles.txt_bargain_accept
                                                                : styles.txt_bargain_reject
                                                        }
                                                    >
                                                        {(v2.message as any).status === 'yes'
                                                            ? 'Gian hàng đồng ý trả giá'
                                                            : 'Gian hàng từ chối trả giá'}
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                ) : null
                            )}

                            <Text color={theme.colors.grey_[400]}>{timeMessage}</Text>
                        </Touch>
                    </View>
                ) : null}

                {/* option log press */}
                <Modal
                    isVisible={openSheet}
                    onBackdropPress={visibleSheetOptions}
                    useNativeDriver={true}
                    statusBarTranslucent={true}
                >
                    <View style={styles.view_wrap_options}>
                        <Touch p="medium" activeOpacity={0.8} onPress={handleSelectOption('reply')}>
                            <Text
                                ta="center"
                                color={theme.colors.grey_[500]}
                                fw="bold"
                                size={'body2'}
                            >
                                Trả lời
                            </Text>
                        </Touch>
                        <Touch
                            style={styles.touch_option}
                            activeOpacity={0.8}
                            onPress={handleSelectOption('copy')}
                        >
                            <Text
                                ta="center"
                                color={theme.colors.grey_[500]}
                                fw="bold"
                                size={'body2'}
                            >
                                Sao chép nội dung
                            </Text>
                        </Touch>
                        <Touch
                            p="medium"
                            activeOpacity={0.8}
                            onPress={handleSelectOption('cancel')}
                        >
                            <Text ta="center" color={theme.colors.grey_[400]}>
                                Huỷ bỏ
                            </Text>
                        </Touch>
                    </View>
                </Modal>
            </View>
        );
    }
    // (pre, next) => pre.item.message_uuid === next.item.message_uuid
);

export default ChatMessageItem;
