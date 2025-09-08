/* eslint-disable react-hooks/exhaustive-deps */
import Badge from 'components/Badge';
import { useSocket } from 'context/SocketContext';
import { SET_CHAT_STATE } from 'features/action';
import { useAppDispatch, useAppSelector, useNavigate, useTheme } from 'hooks';
import { ChatDataSocketResponseType, ListUserDataSocketResponseType } from 'models';
import React, { memo, useEffect, useState } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';

interface IProps {
    focused?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    iconStyle?: StyleProp<TextStyle>;
    type?: 'tabbar' | 'header';
}

const IconAnimated = Animated.createAnimatedComponent(Icon);

export default memo(function MiniChat({
    focused,
    containerStyle,
    iconStyle,
    type = 'header',
}: IProps) {
    //hook
    const { theme } = useTheme();
    // const styles = useStyles(theme);
    // const [visible, setVisible] = useState(false);
    const navigate = useNavigate();
    const { socket, event } = useSocket();
    const dispatch = useAppDispatch();
    const totalCountUnreadMessage = useAppSelector(
        (state) => state.apps.chat.totalCountUnreadMessage
    );
    //state
    const [chatDataSocket, setChatDataSocket] = useState<ChatDataSocketResponseType>();

    //effect
    //--effect init socket
    useEffect(() => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            //get list user init
            socket.send(
                JSON.stringify({
                    action: 'get_list_user',
                })
            );
        }
    }, [socket]);
    //--handle when event data change
    useEffect(() => {
        if (event) {
            const data = JSON.parse(event.data);
            switch (data.result_code) {
                case 'GET_LIST_USER_SUCCESS':
                    const data_: ListUserDataSocketResponseType = data;
                    const total = data_.list.reduce(
                        (num, current) => num + parseInt(current.num_not_view),
                        0
                    );
                    dispatch(SET_CHAT_STATE({ totalCountUnreadMessage: total }));
                    break;
                case 'RECEIVE_MESSAGE_SUCCESS':
                    setChatDataSocket(data);
                    break;
            }
        }
    }, [event]);
    //check send or receive message
    useEffect(() => {
        //lay lai danh sach nguoi dung moi khi co tin nhan moi chua doc
        if (socket && socket.readyState === WebSocket.OPEN && chatDataSocket) {
            socket.send(
                JSON.stringify({
                    action: 'get_list_user',
                })
            );
        }
    }, [chatDataSocket, socket]);

    if (type === 'header') {
        return (
            <Animated.View style={containerStyle}>
                <IconAnimated
                    name="chatbubble-ellipses-outline"
                    size={theme.typography.title4}
                    style={iconStyle}
                    onPress={navigate.CHAT_LIST_USER_ROUTE()}
                />

                <Badge
                    visible={totalCountUnreadMessage && totalCountUnreadMessage > 0 ? true : false}
                    title={`${totalCountUnreadMessage}`}
                    top={-theme.dimens.verticalScale(1)}
                    right={-theme.dimens.scale(2)}
                    width={theme.dimens.scale(17)}
                    height={theme.dimens.scale(17)}
                    onPress={navigate.CHAT_LIST_USER_ROUTE()}
                />
            </Animated.View>
        );
    }

    return (
        <Animated.View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <IconAnimated
                name={focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline'}
                size={theme.typography.size(21)}
                style={[iconStyle]}
                onPress={navigate.CHAT_LIST_USER_ROUTE()}
            />
            <Badge
                visible={totalCountUnreadMessage && totalCountUnreadMessage > 0 ? true : false}
                title={`${totalCountUnreadMessage}`}
                onPress={navigate.CHAT_LIST_USER_ROUTE()}
                top={theme.dimens.verticalScale(-4)}
                right={theme.dimens.scale(8)}
                width={theme.dimens.scale(17)}
                height={theme.dimens.scale(17)}
            />
        </Animated.View>
    );
});
