/* eslint-disable react-hooks/exhaustive-deps */
import Button from 'components/Button';
import Image from 'components/Image';
import Text from 'components/Text';
import TextInput from 'components/TextInput';
import View from 'components/View';
import { useNavigate, useTheme } from 'hooks';
import { delay, last } from 'lodash';
import { ListUserDataSocketResponseType, UserChatType } from 'models';
import moment from 'moment';
import React, { memo, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    ListRenderItem,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { calculatorBetweenTwoTime, removeAccents } from 'utils/helpers';

interface Props {
    openModal: boolean;
    visibleModalChat: () => void;
    image?: string;
    userDataSocket?: ListUserDataSocketResponseType;
}

const ChatSearchModal = memo(function ChatSearchModal({
    openModal,
    visibleModalChat,
    userDataSocket,
}: Props) {
    //hook
    const styles = useStyles();
    const { theme } = useTheme();
    const navigate = useNavigate();
    //state
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    const [listUser, setListUser] = useState<Array<UserChatType>>([]);
    //effect
    useEffect(() => {
        if (openModal) {
            delay(() => {
                setIsLoadingModal(true);
            }, 500);
        }
    }, [openModal]);

    useEffect(() => {
        if (userDataSocket) {
            setListUser(userDataSocket.list);
        }
    }, [userDataSocket]);

    //handle
    const handleVisibleModal = () => {
        visibleModalChat();
        setIsLoadingModal(false);
    };

    //--search user
    const handleSetSearchText = (searchText: string) => {
        const listUserSearch =
            userDataSocket?.list.filter((value) => {
                const user_name = removeAccents(value.user_name.toLocaleLowerCase());
                const search_name = removeAccents(searchText.toLocaleLowerCase());
                return user_name.includes(search_name);
            }) || [];
        setListUser(listUserSearch);
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
                onPress={navigate.CHAT_MESSAGE_ROUTE({ user_uuid: item.user_uuid })}
                activeOpacity={0.9}
            >
                <View flexDirect="row">
                    <View style={styles.view_img_seller_item}>
                        <Image
                            source={{ uri: item.user_image }}
                            radius={100}
                            resizeMode="contain"
                            style={styles.img_item_seller}
                        />
                    </View>
                    <View ml="medium">
                        <Text size={'body3'} numberOfLines={1}>
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
    //navigate

    return (
        <Modal
            isVisible={openModal}
            onBackdropPress={handleVisibleModal}
            style={{ margin: 0 }}
            backdropOpacity={0.95}
            onBackButtonPress={handleVisibleModal}
            backdropColor={theme.colors.white_[10]}
            avoidKeyboard={false}
            useNativeDriver={true}
        >
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
                <View style={styles.view_container_modal}>
                    {/* input */}
                    <View>
                        <TextInput
                            startIcon={{
                                type: 'ionicon',
                                name: 'search',
                                color: theme.colors.grey_[500],
                            }}
                            placeholder="Tìm kiếm gian hàng chát..."
                            onChangeText={handleSetSearchText}
                            size="md"
                        />
                    </View>
                    {isLoadingModal ? (
                        <>
                            {/* list */}
                            <FlatList
                                data={listUser}
                                renderItem={renderListRecentUser}
                                keyExtractor={(value) => `${value.user_uuid}`}
                            />
                            {/* btn */}
                            <Button
                                title="Quay lại"
                                type="outline"
                                color={theme.colors.grey_[500]}
                                onPress={handleVisibleModal}
                            />
                        </>
                    ) : (
                        <ActivityIndicator
                            color={theme.colors.grey_[400]}
                            size={theme.typography.size(50)}
                        />
                    )}
                </View>
            </SafeAreaView>
        </Modal>
    );
});

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        view_container_modal: {
            flex: 1,
            backgroundColor: theme.colors.white_[10],
            top: 0,
            height: '100%',
            padding: theme.spacings.small,
        },
        //
        view_wrap_sellers_chat: {
            flex: 1,
            backgroundColor: theme.colors.white_[10],
            marginTop: theme.spacings.small,
        },
        touch_search_seller_chat: {
            flexDirection: 'row',
            padding: theme.dimens.sizeElement('sm'),
            alignItems: 'center',
            marginHorizontal: theme.spacings.small,
            marginBottom: theme.spacings.small,
            borderWidth: 1,
            borderColor: theme.colors.grey_[500],
            borderRadius: 5,
        },
        touch_item_seller: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: theme.spacings.small,
            marginTop: theme.spacings.medium,
        },
        view_img_seller_item: {
            width: theme.dimens.scale(60),
            aspectRatio: 1,
            borderRadius: 100,
            overflow: 'hidden',
            backgroundColor: theme.colors.white_[10],
            padding: 1,
            ...theme.styles.shadow2,
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

export default ChatSearchModal;
