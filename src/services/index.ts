/* eslint-disable radix */
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios';
import * as AppConstants from 'const/app';
import { TokenType } from 'models';
import Config from 'react-native-config';
import { addParamsToUrl } from 'utils/helpers';
import { sendSentryError } from 'utils/storeHelpers';
import AxiosAPI from './axiosClient';
import adminApi, { adminApiType } from './lib/admin';
import customerApi, { customerApiType } from './lib/customer';
//AsyncStorage.setItem('token','');

class Service {
    protected baseURL?: string;
    protected clientID?: string;
    protected clientSecret?: string;
    protected granType?: string;
    protected axiosApi: AxiosInstance;
    protected access_token: any;
    public cancelRequest: any;
    public customer: customerApiType;
    public admin: adminApiType;
    public store: any;

    constructor(
        admin: typeof adminApi,
        customer: typeof customerApi,
        axiosAPI: typeof AxiosAPI,
        clientID?: string,
        granType?: string,
        clientSecret?: string,
        baseURL?: string
    ) {
        this.admin = admin(this);
        this.customer = customer(this);
        this.clientID = clientID;
        this.granType = granType;
        this.clientSecret = clientSecret;
        this.axiosApi = axiosAPI({ baseURL: baseURL, timeout: 300000 }, this);
        this.baseURL = baseURL;
    }

    //initial start
    init = async (store_: any) => {
        //on app start - initial app
        const data = await this.getTokenLocal();
        this.store = store_;

        console.log('token ', data);

        if (data && data?.access_token && parseInt(data?.timeout || '0') > Date.now()) {
            // neu token chua het han gan token cho proerty app
            this.setAccessToken(data.access_token);

            //check login
            return data?.refresh_token
                ? AppConstants.APP_START_USER_SUCCESS
                : AppConstants.APP_START_SUCCESS;
        }

        //!refresh_token neu user chua login va token da expired
        if (!data?.refresh_token) {
            //refresh token khi user chua dang nhap
            if (await this.fetchTokenApp()) {
                return AppConstants.APP_START_SUCCESS;
            }
        }

        // refresh token khi user da dang nhap
        const result = await this.refreshTokenUser(data?.refresh_token);

        return result?.refresh_token
            ? AppConstants.APP_START_USER_SUCCESS
            : AppConstants.APP_START_SUCCESS;
    };

    get(url: string, data?: any, params?: any, headers?: any): any {
        return this.send(url, 'GET', data, params, headers);
    }
    post(url: string, data?: any, headers?: any): any {
        return this.send(url, 'POST', data, undefined, headers);
    }
    put(url: string, data?: any, headers?: any): any {
        return this.send(url, 'PUT', data, undefined, headers);
    }
    delete(url: string, data?: any, headers?: any) {
        return this.send(url, 'DELETE', data, undefined, headers);
    }

    setCancelRequest() {
        this.cancelRequest = axios.CancelToken.source();
    }

    send(url: string, method: Method, data?: any, params?: any, headers?: any) {
        const headers_: any = {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: 0,
            ...headers,
        };

        //add params to url
        const url_ = addParamsToUrl(url, params);

        //set token header
        if (this.access_token) {
            headers_.Authorization = `Bearer ${this.access_token}`;
        }
        console.log(method, ' - ', this.baseURL, 'url send ', url_);

        //request
        return this.axiosApi
            .request({
                url: url_,
                method: method,
                data: data,
                headers: headers_,
                cancelToken: this.cancelRequest !== undefined ? this.cancelRequest.token : null,
            })
            .then((response: any) => {
                console.log('then');
                return response.data;
            })
            .catch((error: any) => {
                console.log('error', error);

                if (error.message === undefined) {
                }
                return Promise.reject(error?.response?.data);
            });
    }

    //get token async storage
    getTokenLocal = async (): Promise<TokenType> => {
        const tokenLocal = await AsyncStorage.getItem('@token');
        const token: any = tokenLocal;
        return JSON.parse(token);
    };

    //set token to local storage
    setTokenLocal(data: TokenType) {
        let timeout = Date.now() + data.expires_in * 1000;
        const token = {
            ...data,
            timeout,
        };
        AsyncStorage.setItem('@token', JSON.stringify(token));
        this.setAccessToken(data.access_token);
    }

    //get token app api
    fetchTokenApp = async (): Promise<TokenType> => {
        const data = {
            client_id: this.clientID,
            client_secret: this.clientSecret,
            grant_type: this.granType,
        };
        try {
            console.log('fetch token app');
            const response = await this.post('/oauth', data);
            console.log('response token ', response);
            this.setTokenLocal(response);
            return response;
        } catch (error) {
            const response = await this.post('/oauth', data);
            this.setTokenLocal(response);
            sendSentryError(error, 'fetchTokenApp**');
            return response;
        }
    };

    //refresh token user
    refreshTokenUser = async (refreshToken: any): Promise<TokenType> => {
        // lay token user
        const data = {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: this.clientID,
            client_secret: this.clientSecret,
        };

        try {
            const result: TokenType = await this.post('/oauth', data);
            if (result?.refresh_token) {
                this.setTokenLocal(result);
                return result;
            }
            throw result;
        } catch (error: any) {
            // fetch token app when refresh token user expired
            // clear current token
            this.setAccessToken('');
            await AsyncStorage.removeItem('@token');
            this.store.dispatch({ type: 'LOGOUT_CURRENT_USER_SUCCESS' });

            sendSentryError(error, 'refreshTokenUser');

            // get new token app
            return await this.fetchTokenApp();
        }
    };

    setAccessToken(token: any) {
        this.access_token = token;
    }

    getAccessToken() {
        return this.access_token;
    }

    baseAxios(config: AxiosRequestConfig<any>) {
        return axios(config);
    }
}
export type ServiceType = Service;
export const services = new Service(
    adminApi,
    customerApi,
    AxiosAPI,
    Config.REACT_NATIVE_APP_CLIENT_ID,
    Config.REACT_NATIVE_APP_GRANT_TYPE,
    Config.REACT_NATIVE_APP_CLIENT_SECRET,
    Config.REACT_NATIVE_APP_IS_MODE === 'dev'
        ? Config.REACT_NATIVE_APP_API_URL_DEV
        : Config.REACT_NATIVE_APP_API_URL_PRO
);
