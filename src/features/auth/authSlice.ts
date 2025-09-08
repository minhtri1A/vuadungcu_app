import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Status from 'const/status';
import { DataLoginUserType } from 'models';
import * as Message from '../../const/message';
import { AuthStateType } from './authType';

const initialState: AuthStateType = {
    username: '',
    token: null,
    statusSignin: Status.DEFAULT,
    statusSignout: Status.DEFAULT,
    message: Message.NOT_MESSAGE,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        SIGNIN_WITH_ACCOUNT: (state, action: PayloadAction<any>) => {
            action;
            state.statusSignin = Status.LOADING;
        },
        SIGNIN_WITH_GOOGLE: (
            state,
            action: PayloadAction<{ referral_code?: string; idToken?: string; email?: string }>
        ) => {
            action;
            state.statusSignin = Status.LOADING;
        },
        SIGNIN_WITH_FACEBOOK: (state, action: PayloadAction<DataLoginUserType>) => {
            action;
            state.statusSignin = Status.LOADING;
        },
        SIGNIN_WITH_APPLE: (state, action: PayloadAction<DataLoginUserType>) => {
            action;
            state.statusSignin = Status.LOADING;
        },
        AUTH_SUCCESS: (state, action: PayloadAction<any>) => {
            return { ...state, ...action.payload, statusSignin: Status.SUCCESS };
        },
        AUTH_FAILED: (state, action: PayloadAction<{ status?: string; message: string }>) => {
            const { status = Status.ERROR, message } = action.payload;
            state.statusSignin = status;
            state.message = message;
        },
        LOGOUT_CURRENT_USER: (state, action: PayloadAction<boolean | undefined>) => {
            state.statusSignout = Status.LOADING;
            action;
        },
    },
    extraReducers: (builder) => {
        builder.addCase('LOGOUT_CURRENT_USER_SUCCESS', () => {
            return { ...initialState, statusSignout: Status.SUCCESS };
        });
    },
});

export const {
    SIGNIN_WITH_ACCOUNT,
    SIGNIN_WITH_GOOGLE,
    SIGNIN_WITH_FACEBOOK,
    SIGNIN_WITH_APPLE,
    AUTH_SUCCESS,
    AUTH_FAILED,
    LOGOUT_CURRENT_USER,
} = authSlice.actions;

export default authSlice.reducer;
