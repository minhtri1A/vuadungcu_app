/* eslint-disable react-hooks/exhaustive-deps */
import { REACT_NATIVE_APP_SOCKET_SERVER } from 'const/env';
import { useInternet, useIsLogin } from 'hooks';
import { delay } from 'lodash';
import { TokenType } from 'models';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { services } from 'services';
import { sendSentryError } from 'utils/storeHelpers';

const SocketContext = createContext<{
    socket: WebSocket | null;
    event: WebSocketMessageEvent | null;
}>({ socket: null, event: null });

interface Props {
    children: React.ReactNode;
}

const SocketProvider = ({ children }: Props) => {
    //hooks
    const isLogin = useIsLogin();
    const isInternet = useInternet();
    //state
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [socketTemp, setSocketTemp] = useState<WebSocket | null>(null);
    const [event, setEvent] = useState<WebSocketMessageEvent | null>(null);

    useEffect(() => {
        startConnectWebSocket();

        return () => {
            //dong ket noi
            // newSocket?.disconnect();
            socket?.close();
        };
    }, [isLogin, isInternet]);

    useEffect(() => {
        if (socketTemp) {
            socketTemp.onopen = () => {
                setSocket(socketTemp);
                socketTemp.onmessage = function (e) {
                    setEvent(e);
                    const data = JSON.parse(e.data);
                    switch (data.result_code) {
                        case 'INVALID_TOKEN':
                            //reset token when token expires
                            socketTemp?.close();
                            break;
                    }
                };
            };
        }
    }, [socketTemp]);

    const startConnectWebSocket = async (is_refresh_token?: boolean) => {
        try {
            if (isLogin && isInternet) {
                let token: TokenType | null = null;
                if (is_refresh_token) {
                    const result = await services.customer.getCustomers('username');
                    if (result.username) {
                        const tokenResult = await services.getTokenLocal();
                        token = tokenResult;
                    }
                } else {
                    const result = await services.getTokenLocal();
                    token = result;
                }
                // console.log('result ', token);
                let newSocket: WebSocket | null = null;
                if (token && token.refresh_token) {
                    //ket noi socket server
                    newSocket = new WebSocket(
                        `${REACT_NATIVE_APP_SOCKET_SERVER}?token=${token.access_token}&type=C`
                    );
                    newSocket.onerror = (e) => {
                        console.log('error socket ---', e);
                    };
                    newSocket.onclose = (e) => {
                        console.log('close socket ---', e);
                        console.log('close isInternet ---', isInternet);
                        console.log('close isLogin ---', isLogin);

                        delay(() => {
                            setSocket(null);
                            setSocketTemp(null);
                            startConnectWebSocket(true);
                            // startConnectWebSocket();
                        }, 1000 * 3600);
                    };
                    setSocketTemp(newSocket);
                }
            }
        } catch (error: any) {
            sendSentryError(error, 'startConnectWebSocket');
        }
    };

    return <SocketContext.Provider value={{ socket, event }}>{children}</SocketContext.Provider>;
};

const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
};

export { SocketContext, SocketProvider, useSocket };
