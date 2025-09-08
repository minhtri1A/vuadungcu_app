import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from 'app/store';
import { Message } from 'const/index';
import {
    NAVIGATION_AUTH_STACK,
    NAVIGATION_PROFILE_STACK,
    NAVIGATION_TAB_NAV,
    NAVIGATION_TO_LOGIN_SCREEN,
} from 'const/routes';
import { isEmpty } from 'lodash';
import { goBack, reset } from 'navigation/RootNavigation';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { services } from 'services';
import {
    GET_ALL_CUSTOMER_INFO,
    GET_CUSTOMER_BASIC_INFO,
    PUT_CUSTOMER_INFO,
    PUT_CUSTOMER_INFO_FAILED,
    PUT_CUSTOMER_INFO_SUCCESS,
    REGISTER_ACCOUNT_CUSTOMER,
    REGISTER_ACCOUNT_FAILED,
    REGISTER_ACCOUNT_SUCCESS,
    SET_ALL_CUSTOMER_INFO_FAILED,
    SET_ALL_CUSTOMER_INFO_SUCCESS,
    SET_CUSTOMER_ACCUMULATED_FAILED,
    SET_CUSTOMER_ACCUMULATED_SUCCESS,
    SET_CUSTOMER_BASIC_INFO_FAILED,
    SET_CUSTOMER_BASIC_INFO_SUCCESS,
} from './../action';
import { logoutCurrentUser } from './../auth/authSaga';
import { CustomerInfoStateType } from './accountType';

//fetch name and image - LoyalPoint
function* fetchCustomerBasicInfo(): any {
    try {
        const [{ firstname, lastname }, { image }] = yield all([
            call(services.customer.getCustomers, 'name'),
            call(services.customer.getCustomers, 'image'),
        ]);
        yield call(fetchAccumulatedCustomer);
        const fullname = isEmpty(lastname) && isEmpty(firstname) ? '' : `${lastname} ${firstname}`;
        yield put(
            SET_CUSTOMER_BASIC_INFO_SUCCESS({
                names: {
                    firstname,
                    lastname,
                    fullname,
                },
                image,
            })
        );
    } catch (error) {
        yield put(SET_CUSTOMER_BASIC_INFO_FAILED());
    }
}

function* fetchAllCustomerInfo(): any {
    try {
        try {
            const result = yield call(services.customer.getCustomers, 'all');
            if (result.username) {
                const {
                    email,
                    username,
                    telephone,
                    id_google,
                    id_facebook,
                    id_apple,
                    id_zalo,
                    dob,
                    email_confirm,
                    firstname,
                    gender,
                    image,
                    lastname,
                    telephone_confirm,
                    not_edit_username,
                } = result;
                const fullname =
                    isEmpty(lastname) && isEmpty(firstname) ? '' : `${lastname} ${firstname}`;
                yield put(
                    SET_ALL_CUSTOMER_INFO_SUCCESS({
                        personalInfo: {
                            lastname,
                            firstname,
                            dob,
                            gender,
                            image,
                            fullname,
                        },
                        verifyInfo: {
                            username,
                            email,
                            telephone,
                            email_confirm,
                            telephone_confirm,
                            not_edit_username,
                        },
                        socialLink: {
                            id_google,
                            id_facebook,
                            id_apple,
                            id_zalo,
                        },
                    })
                );
                return;
            }
            yield put(SET_ALL_CUSTOMER_INFO_FAILED());
        } catch (error) {
            yield put(SET_ALL_CUSTOMER_INFO_FAILED());
        }
    } catch (error) {
        console.log('ERROR get all customer saga ', error);
    }
}
//create, update, change customer info
function* putCustomers(action: any): any {
    try {
        const { type, data } = action.payload;
        const result = yield call(services.customer.putCustomers, type, data);
        const customerInfoState: CustomerInfoStateType = yield select(
            (state: RootState) => state.account.customerInfo
        );
        switch (type) {
            //link account with google
            case 'google': {
                if (result.code === 'SUCCESS') {
                    //if link gmail success, get and verify email google if user not exits email
                    const [googleIdApi, emailApi] = yield all([
                        call(services.customer.getCustomers, type),
                        call(services.customer.getCustomers, 'email'),
                    ]);
                    const newCustomerInfoG = {
                        ...customerInfoState,
                        socialLink: {
                            ...customerInfoState.socialLink,
                            id_google: googleIdApi.id_google,
                        },
                        verifyInfo: {
                            ...customerInfoState.verifyInfo,
                            ...emailApi,
                        },
                    };
                    yield put(PUT_CUSTOMER_INFO_SUCCESS({ customerInfo: newCustomerInfoG }));
                } else if (result.code === 'GOOGLE_EXISTS') {
                    yield put(
                        PUT_CUSTOMER_INFO_FAILED({ message: Message.ACCOUNT_GOOGLE_LINK_EXISTS })
                    );
                } else {
                    yield put(
                        PUT_CUSTOMER_INFO_FAILED({ message: Message.ACCOUNT_SOCIAL_LINK_FAILED })
                    );
                }
                return;
            }
            //link account with facebook
            case 'facebook': {
                if (result.code === 'SUCCESS') {
                    //if link facebook success, get email facebook if user not exits email
                    const [facebookIdApi, emailApi] = yield all([
                        call(services.customer.getCustomers, type),
                        call(services.customer.getCustomers, 'email'),
                    ]);
                    const newCustomerInfoF = {
                        ...customerInfoState,
                        socialLink: {
                            ...customerInfoState.socialLink,
                            id_facebook: facebookIdApi.id_facebook,
                        },
                        verifyInfo: {
                            ...customerInfoState.verifyInfo,
                            email: emailApi.email,
                        },
                    };
                    yield put(PUT_CUSTOMER_INFO_SUCCESS({ customerInfo: newCustomerInfoF }));
                } else if (result.code === 'FACEBOOK_EXISTS') {
                    yield put(
                        PUT_CUSTOMER_INFO_FAILED({ message: Message.ACCOUNT_FACEBOOK_LINK_EXISTS })
                    );
                } else {
                    yield put(
                        PUT_CUSTOMER_INFO_FAILED({ message: Message.ACCOUNT_SOCIAL_LINK_FAILED })
                    );
                }
                return;
            }
            //link account with apple
            case 'apple': {
                if (result.code === 'SUCCESS') {
                    //if link facebook success, **add email
                    const [appleApi, emailApi] = yield all([
                        call(services.customer.getCustomers, type),
                        call(services.customer.getCustomers, 'email'),
                    ]);
                    const newCustomerInfoF = {
                        ...customerInfoState,
                        socialLink: {
                            ...customerInfoState.socialLink,
                            id_apple: appleApi.id_apple,
                        },
                        verifyInfo: {
                            ...customerInfoState.verifyInfo,
                            email: emailApi.email,
                        },
                    };
                    yield put(PUT_CUSTOMER_INFO_SUCCESS({ customerInfo: newCustomerInfoF }));
                } else if (result.code === 'APPLE_EXISTS') {
                    yield put(
                        PUT_CUSTOMER_INFO_FAILED({ message: Message.ACCOUNT_APPLE_LINK_EXISTS })
                    );
                } else {
                    yield put(
                        PUT_CUSTOMER_INFO_FAILED({ message: Message.ACCOUNT_SOCIAL_LINK_FAILED })
                    );
                }
                return;
            }
            case 'username': {
                if (result.code === 'SUCCESS') {
                    const customerUsername = {
                        username: data.username,
                    };
                    //save sate username render login screen
                    yield call(
                        AsyncStorage.setItem,
                        '@customer-username',
                        JSON.stringify(customerUsername)
                    );
                    //logout, reset router and redirect to login screen
                    yield call(logoutCurrentUser, false);
                    reset(3, [
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
                } else {
                    yield put(
                        PUT_CUSTOMER_INFO_FAILED({ message: Message.ACCOUNT_EDIT_USERNAME_FAILED })
                    );
                }
                return;
            }
            case 'telephone': {
                if (result.code === 'SUCCESS') {
                    const telephoneApi = yield call(services.customer.getCustomers, type);
                    const newCustomerInfoT = {
                        ...customerInfoState,
                        verifyInfo: {
                            ...customerInfoState.verifyInfo,
                            telephone_confirm: telephoneApi.telephone_confirm,
                        },
                    };
                    yield put(PUT_CUSTOMER_INFO_SUCCESS({ customerInfo: newCustomerInfoT }));
                    goBack();
                } else if (result.code === 'TELEPHONE_EXISTS') {
                    yield put(
                        PUT_CUSTOMER_INFO_FAILED({ message: Message.ACCOUNT_TELEPHONE_EXISTS })
                    );
                } else {
                    yield put(
                        PUT_CUSTOMER_INFO_FAILED({ message: Message.ACCOUNT_TELEPHONE_HAS_CONFIRM })
                    );
                }
                return;
            }
            case 'profile': {
                if (result.code === 'SUCCESS') {
                    const { firstname, lastname, dob, gender } = yield call(
                        services.customer.getCustomers,
                        type
                    );
                    const fullname =
                        isEmpty(lastname) && isEmpty(firstname) ? '' : `${lastname} ${firstname}`;
                    const newCustomerInfoP = {
                        ...customerInfoState,
                        personalInfo: {
                            ...customerInfoState.personalInfo,
                            firstname,
                            lastname,
                            dob,
                            gender,
                            fullname,
                        },
                    };
                    yield put(PUT_CUSTOMER_INFO_SUCCESS({ customerInfo: newCustomerInfoP }));
                } else {
                    yield put(
                        PUT_CUSTOMER_INFO_FAILED({ message: Message.ACCOUNT_EDIT_PROFILE_FAILED })
                    );
                }
                return;
            }
            case 'email': {
                if (result.code === 'SUCCESS') {
                    const emailApi = yield call(services.customer.getCustomers, type);
                    const newCustomerInfoE = {
                        ...customerInfoState,
                        verifyInfo: {
                            ...customerInfoState.verifyInfo,
                            email: emailApi.email,
                        },
                    };
                    yield put(PUT_CUSTOMER_INFO_SUCCESS({ customerInfo: newCustomerInfoE }));
                    goBack();
                } else if (result.code === 'EMAIL_EXISTS') {
                    yield put(PUT_CUSTOMER_INFO_FAILED({ message: Message.ACCOUNT_EMAIL_EXISTS }));
                } else {
                    yield put(
                        PUT_CUSTOMER_INFO_FAILED({ message: Message.ACCOUNT_EDIT_EMAIL_FAILED })
                    );
                }
                return;
            }
            case 'change-password': {
                if (result.code === 'SUCCESS') {
                    yield put(
                        PUT_CUSTOMER_INFO_SUCCESS({
                            customerInfo: customerInfoState,
                            message: Message.PASSWORD_EDIT_SUCCESS,
                        })
                    );
                } else if (result.code === 'INVALID_PASSWORD') {
                    yield put(
                        PUT_CUSTOMER_INFO_FAILED({
                            message: Message.PASSWORD_EDIT_INVALID_PASSWORD,
                        })
                    );
                } else {
                    PUT_CUSTOMER_INFO_FAILED({
                        message: Message.PASSWORD_EDIT_FAILED,
                    });
                }
            }
        }
    } catch (error) {
        yield put(PUT_CUSTOMER_INFO_FAILED({ message: Message.SYSTEMS_ERROR }));
        console.log('ERROR put customer info ', error);
    }
}

//LoyalPoint
function* fetchAccumulatedCustomer(): any {
    try {
        const result = yield call(services.customer.getCustomers, 'pos');
        if (result.score) {
            yield put(SET_CUSTOMER_ACCUMULATED_SUCCESS(result));
        } else if (result.code === 'NOT_A_POS_CUSTOMER') {
            yield put(SET_CUSTOMER_ACCUMULATED_SUCCESS(null));
        } else {
            yield put(SET_CUSTOMER_ACCUMULATED_FAILED());
        }
    } catch (error) {
        console.log('ERROR fetch LoyalPoint customer saga', error);
        yield put(SET_CUSTOMER_ACCUMULATED_FAILED());
    }
}

//register
function* registerAccountCustomer(action: any): any {
    try {
        const dataRegister = action.payload;
        const result = yield call(services.customer?.registerAccount, dataRegister);
        if (result.code === 'SUCCESS') {
            yield put(REGISTER_ACCOUNT_SUCCESS(dataRegister.telephone));
            goBack();
            return;
        } else if (result.code === 'EXISTS_TELEPHONE') {
            yield put(REGISTER_ACCOUNT_FAILED({ message: Message.REGISTER_EXISTS_TELEPHONE }));
            return;
        }
        yield put(REGISTER_ACCOUNT_FAILED({ message: Message.REGISTER_OTHER_ERROR }));
    } catch (error) {
        console.log('ERROR register account saga ', error);
        yield put(REGISTER_ACCOUNT_FAILED({ message: Message.SYSTEMS_ERROR }));
    }
}

export default function* watcherSaga() {
    yield takeLatest(GET_CUSTOMER_BASIC_INFO, fetchCustomerBasicInfo);
    yield takeLatest(GET_ALL_CUSTOMER_INFO, fetchAllCustomerInfo);
    yield takeLatest(REGISTER_ACCOUNT_CUSTOMER, registerAccountCustomer);
    yield takeLatest(PUT_CUSTOMER_INFO, putCustomers);
}
