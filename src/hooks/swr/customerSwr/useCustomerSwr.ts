import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Message, Status } from 'const/index';
import {
    NAVIGATION_AUTH_STACK,
    NAVIGATION_PROFILE_STACK,
    NAVIGATION_TAB_NAV,
    NAVIGATION_TO_LOGIN_SCREEN,
} from 'const/routes';
import { LOGOUT_CURRENT_USER_SUCCESS } from 'features/action';
import { useAppDispatch, useIsLogin } from 'hooks/useCommon';
import { ActionGetCustomerInfoType, CustomerSwrType, DataPutCustomerInfoType } from 'models';
import { goBack, reset } from 'navigation/RootNavigation';
import { useState } from 'react';
import { LoginManager } from 'react-native-fbsdk-next';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';
import showLoadingApp from 'utils/showLoadingApp';
import showMessageApp from 'utils/showMessageApp';

//lấy thông tin của khách hàng
export default function useCustomerSwr(
    action: ActionGetCustomerInfoType,
    option?: SWRConfiguration
): CustomerSwrType {
    //hooks - su dung cuc bo cua component
    const [status, setStatus] = useState<string>(Status.DEFAULT);
    const [message, setMessage] = useState<string>(Message.NOT_MESSAGE);
    const dispatch = useAppDispatch();
    const isLogin = useIsLogin();

    //swr
    const key = addParamsToUrl('customers', { action });

    const { data, error, isValidating, mutate } = useSWR<any, any>(
        isLogin ? key : null,
        () => services.customer.getCustomers(action),
        {
            ...option,
        }
    );
    const customers = {
        ...data,
        fullname: data ? `${data?.lastname || ''} ${data?.firstname || ''}` : null,
    };

    //kiem tra xem du lieu duoc fetch lan dau chua
    const initFetch = data || error ? true : false;

    //handle
    ///isGoBack - update success trigger goback
    const updateOrAddCustomerInfo = async (
        action_: ActionGetCustomerInfoType,
        data_: DataPutCustomerInfoType,
        isGoBack?: boolean
    ) => {
        showLoadingApp(true);
        try {
            const result = await services.customer.putCustomers(action_, data_);
            if (action_ === 'username') {
                if (result.code !== 'SUCCESS') {
                    setMessage(Message.ACCOUNT_EDIT_USERNAME_FAILED);
                    setStatus(Status.ERROR);
                    showMessageApp('ACCOUNT_EDIT_USERNAME_FAILED');
                    return;
                }
                //save sate username render login screen
                AsyncStorage.setItem(
                    '@customer-username',
                    JSON.stringify({
                        username: data_.username,
                    })
                );
                //logout, reset router and redirect to login screen
                await AsyncStorage.removeItem('@token');
                services.setAccessToken(null);
                await GoogleSignin.signOut();
                LoginManager.logOut();
                const resultTokenApp = await services.fetchTokenApp();
                if (resultTokenApp) {
                    dispatch({ type: LOGOUT_CURRENT_USER_SUCCESS });
                    reset(1, [
                        {
                            key: 's-0',
                            name: NAVIGATION_TAB_NAV,
                            params: { screen: NAVIGATION_PROFILE_STACK },
                        },
                        {
                            key: 's-2',
                            name: NAVIGATION_AUTH_STACK,
                            params: {
                                screen: NAVIGATION_TO_LOGIN_SCREEN,
                            },
                        },
                    ]);
                }
            }
            //other handle
            await mutate({ ...data, ...data_ }, true); //recall api update data
            handleResultUpdateCustomer(result, isGoBack);
            return true;
        } catch (e) {
            showMessageApp('SYSTEMS_ERROR');
            return false;
        } finally {
            showLoadingApp(false);
        }
    };
    //delete customer
    const deleteCustomer = async (reason: string) => {
        setStatus(Status.LOADING);
        const result = await services.customer.deleteCustomer(reason);

        if (result.code === 'SUCCESS') {
            setMessage(Message.ACCOUNT_DELETE_SUCCESS);
            setStatus(Status.SUCCESS);
        } else if (result.code === 'DELETE_EXISTS_ORDERS') {
            setMessage(Message.ACCOUNT_DELETE_EXISTS_ORDERS);
            setStatus(Status.ERROR);
        } else {
            setMessage(Message.ACCOUNT_DELETE_FAILED);
            setStatus(Status.ERROR);
        }
    };

    const handleResultUpdateCustomer = (result: any, isGoBack?: boolean) => {
        switch (result.code) {
            case 'SUCCESS': {
                showMessageApp('ACCOUNT_UPDATE_SUCCESS', { type: 'success' });
                if (isGoBack) {
                    goBack();
                }
                return;
            }
            //verify info
            case 'EMAIL_EXISTS': {
                showMessageApp('ACCOUNT_EMAIL_EXISTS');
                return;
            }
            case 'TELEPHONE_EXISTS': {
                showMessageApp('ACCOUNT_TELEPHONE_EXISTS');
                return;
            }
            //social link
            case 'GOOGLE_EXISTS': {
                showMessageApp('ACCOUNT_GOOGLE_LINK_EXISTS');
                return;
            }
            case 'FACEBOOK_EXISTS': {
                showMessageApp('ACCOUNT_FACEBOOK_LINK_EXISTS');

                return;
            }
            case 'APPLE_EXISTS': {
                showMessageApp('ACCOUNT_APPLE_LINK_EXISTS');

                return;
            }
            //password
            case 'INVALID_PASSWORD': {
                showMessageApp('PASSWORD_EDIT_INVALID_PASSWORD');

                return;
            }
            //image
            case 'INVALID_IMAGE':
                showMessageApp('ACCOUNT_INVALID_IMAGE');

                return;
            default:
                showMessageApp('ACCOUNT_UPDATE_FAILED');
        }
    };

    const resetState = () => {
        setStatus(Status.DEFAULT);
        setMessage(Message.NOT_MESSAGE);
    };

    return {
        customers,
        error,
        isValidating,
        initFetch,
        status,
        message,
        mutate,
        setStatus,
        setMessage,
        updateOrAddCustomerInfo,
        deleteCustomer,
        resetState,
    };
}
