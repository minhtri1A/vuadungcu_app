import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Status from 'const/status';
import { ActionGetCustomerInfoType, DataPutCustomerInfoType, DataRegisterType } from 'models';
import * as Message from '../../const/message';
import {
    AccountState,
    CustomerInfoStateType,
    PersonalInfoStateType,
    SocialLinkStateType,
    VerifyInfoStateType,
} from './accountType';

const initialState: AccountState = {
    customerInfo: {
        personalInfo: null,
        verifyInfo: null,
        socialLink: null,
        statusCustomerInfo: Status.DEFAULT,
        statusPutCustomerInfo: Status.DEFAULT,
        message: Message.NOT_MESSAGE,
    },
    customerAccumulated: {
        point: null,
        statusPoint: Status.DEFAULT,
        message: Message.NOT_MESSAGE,
    },
    register: {
        telephone_: '',
        statusRegister: Status.DEFAULT,
        message: Message.NOT_MESSAGE,
    },
};

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        //use in profile
        GET_CUSTOMER_BASIC_INFO: (state) => {
            state.customerInfo.statusCustomerInfo = Status.LOADING;
        },
        SET_CUSTOMER_BASIC_INFO_SUCCESS: (
            state,
            action: PayloadAction<{
                names: { firstname: string; lastname: string; fullname: string };
                image: string;
            }>
        ) => {
            const {
                names: { firstname, lastname, fullname },
                image,
            } = action.payload;
            return {
                ...state,
                customerInfo: {
                    ...state.customerInfo,
                    statusCustomerInfo: Status.SUCCESS,
                    personalInfo: {
                        ...state.customerInfo.personalInfo,
                        firstname,
                        lastname,
                        fullname,
                        image,
                    },
                },
            };
        },
        //get all info - use in setting
        SET_CUSTOMER_BASIC_INFO_FAILED: (state) => {
            state.customerInfo.statusCustomerInfo = Status.ERROR;
        },
        GET_ALL_CUSTOMER_INFO: () => {},
        SET_ALL_CUSTOMER_INFO_SUCCESS: (
            state,
            action: PayloadAction<{
                personalInfo: PersonalInfoStateType;
                verifyInfo: VerifyInfoStateType;
                socialLink: SocialLinkStateType;
            }>
        ) => {
            state.customerInfo.personalInfo = action.payload.personalInfo;
            state.customerInfo.verifyInfo = action.payload.verifyInfo;
            state.customerInfo.socialLink = action.payload.socialLink;
        },
        SET_ALL_CUSTOMER_INFO_FAILED: (state) => {
            state.customerInfo.statusCustomerInfo = Status.ERROR;
        },
        SET_CUSTOMER_ACCUMULATED_SUCCESS: (state, action: PayloadAction<any>) => {
            state.customerAccumulated.point = action.payload;
        },
        //put customer
        PUT_CUSTOMER_INFO: (
            state,
            action: PayloadAction<{
                type: ActionGetCustomerInfoType;
                data: DataPutCustomerInfoType;
            }>
        ) => {
            state.customerInfo.statusPutCustomerInfo = Status.LOADING;
            action;
        },
        PUT_CUSTOMER_INFO_SUCCESS: (
            state,
            action: PayloadAction<{ customerInfo: CustomerInfoStateType; message?: string }>
        ) => {
            const { customerInfo, message = Message.NOT_MESSAGE } = action.payload;
            state.customerInfo = customerInfo;
            state.customerInfo.statusPutCustomerInfo = Status.SUCCESS;
            state.customerInfo.message = message;
        },
        PUT_CUSTOMER_INFO_FAILED: (
            state,
            action: PayloadAction<{ status?: string; message?: string }>
        ) => {
            const { status = Status.ERROR, message = Message.NOT_MESSAGE } = action.payload;
            state.customerInfo.statusPutCustomerInfo = status;
            state.customerInfo.message = message;
        },
        //LoyalPoint
        SET_CUSTOMER_ACCUMULATED_FAILED: (state) => {
            state.customerAccumulated.message = Message.CUSTOMER_NOT_ACCUMULATED;
        },
        REGISTER_ACCOUNT_CUSTOMER: (state, action: PayloadAction<DataRegisterType>) => {
            action;
            state.register.statusRegister = Status.LOADING;
        },
        REGISTER_ACCOUNT_SUCCESS: (state, action: PayloadAction<string>) => {
            state.register.statusRegister = Status.SUCCESS;
            state.register.message = Message.REGISTER_SUCCESS;
            state.register.telephone_ = action.payload;
        },
        REGISTER_ACCOUNT_FAILED: (
            state,
            action: PayloadAction<{ status?: string; message: string }>
        ) => {
            const { status = Status.ERROR, message } = action.payload;
            state.register.statusRegister = status;
            state.register.message = message;
        },
    },
    extraReducers: (builder) => {
        builder.addCase('LOGOUT_CURRENT_USER_SUCCESS', () => {
            return { ...initialState };
        });
    },
});

export const {
    GET_CUSTOMER_BASIC_INFO,
    SET_CUSTOMER_BASIC_INFO_SUCCESS,
    SET_CUSTOMER_BASIC_INFO_FAILED,
    SET_CUSTOMER_ACCUMULATED_SUCCESS,
    SET_CUSTOMER_ACCUMULATED_FAILED,
    REGISTER_ACCOUNT_CUSTOMER,
    REGISTER_ACCOUNT_SUCCESS,
    REGISTER_ACCOUNT_FAILED,
    GET_ALL_CUSTOMER_INFO,
    SET_ALL_CUSTOMER_INFO_SUCCESS,
    SET_ALL_CUSTOMER_INFO_FAILED,
    PUT_CUSTOMER_INFO,
    PUT_CUSTOMER_INFO_SUCCESS,
    PUT_CUSTOMER_INFO_FAILED,
} = accountSlice.actions;

export default accountSlice.reducer;
