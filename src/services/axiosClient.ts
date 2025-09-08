import { captureException, setTags } from '@sentry/react-native';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { ServiceType } from 'services';

let isRequest = false;
let failedQueue: any = [];

const sendSentryError = (error: any, func: string) => {
    setTags({ func, username: 'axios-client' });
    captureException(error);
};

const processQueue = (error: any, token = null) => {
    failedQueue.forEach((prom: any) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

//invalid_grant

const AxiosAPI = (configInit: any, service: ServiceType) => {
    const axiosClient = axios.create(configInit);

    axiosClient.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            //variable
            let config = error.response?.config;
            const rs = error?.response;
            //cancel request
            if (axios.isCancel(error)) {
                return Promise.reject(error);
            }
            //catch error
            if (rs?.status === 401 && isEmpty(rs.data)) {
                if (isRequest) {
                    return new Promise(function (resolve, reject) {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            config.headers['Authorization'] = 'Bearer ' + token;
                            return axiosClient.request(config);
                        })
                        .catch((err) => {
                            return Promise.reject(err);
                        });
                }
                isRequest = true;
                return new Promise((resolve) => {
                    (async () => {
                        const token = await service.getTokenLocal();
                        // const type = await AsyncStorage.getItem("type");  // xử lý logut google
                        if (isEmpty(token.refresh_token)) {
                            service.setAccessToken('');
                            resolve(service.fetchTokenApp());
                        } else {
                            service.setAccessToken('');
                            resolve(service.refreshTokenUser(token.refresh_token));
                        }
                    })();
                })
                    .then((data: any) => {
                        config.headers.Authorization = `Bearer ${data.access_token}`;
                        config.headers.baseURL = undefined;
                        service.setTokenLocal(data);
                        service.setAccessToken(data.access_token);
                        processQueue(null, data.access_token);
                        return axiosClient.request(config);
                    })
                    .catch((err: any) => {
                        return Promise.reject(err);
                    })
                    .finally(() => {
                        isRequest = false;
                    });
            } else if (
                rs?.status === 400 &&
                rs?.data?.title === 'invalid_grant' &&
                (rs?.data?.detail === 'Refresh token has expired' ||
                    rs?.data?.detail === 'Invalid refresh token')
            ) {
                return Promise.reject(error);
            } else {
                sendSentryError(error, 'AxiosClient');
                return Promise.reject(error);
            }
        }
    );

    return axiosClient;
};

export default AxiosAPI;
