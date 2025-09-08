import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Status from 'const/status';
import { ArgsMessageType } from 'hooks/getMessage';
import * as Message from '../../const/message';

interface VideoOptionType {
    pause: boolean;
    currentTime: number;
    muted: boolean;
    isGoback: boolean;
}

export interface appState {
    //
    isAppStart: boolean;

    //check internet
    isConnectedInternet: boolean;

    //kiểm tra số lần hiển thị tự đông phone confirm
    numShowPhoneConfirm: number;

    //order
    orderReturnsOptions: {
        reason: string;
        refundMethod: string;
    };

    //video
    videoOption: {
        pause: boolean;
        currentTime: number;
        muted: boolean;
        isGoback: boolean;
    };

    //checkout gift
    orderGifts: Array<string>;

    //chat state
    chat: {
        //tong tin nhan chua xem
        totalCountUnreadMessage?: number;
    };

    //order
    indexOrderTab?: number;

    //loading app
    status: string;
    message: string;
    argsMessage: ArgsMessageType;

    //check hien modal spin attendance
    numOpenModalAttendance: number;

    //index dang show cua auto modal
    currentShowIndexAutoModal: number;

    //app
    //--loading app
    loadingApp: boolean;
    titleLoadingApp?: string;
    //product detail
    productDetail: {
        productOptionsSelected?: {
            index?: number;
            label?: string;
        };
    };
    //check show modal address request
    isShowModalRequestAddress: boolean;

    /*--- address --- */
    address: {
        // check lay location trong bottom location
        finishGetLocation: boolean;
    };

    /*--- home --- */
    home: {
        // kiem tra xem cac section da render het chua
        countSectionProductCategoryFinishRender?: number;
        checkA?: number;
        checkB?: number;
    };
}

const initialState: appState = {
    isAppStart: false,

    isConnectedInternet: true,

    //
    numShowPhoneConfirm: 0,

    //video
    videoOption: {
        pause: false,
        currentTime: 0,
        muted: true,
        isGoback: false,
    },
    //checkout gift - danh sach qua tang cua cac gian hang apply vao order hien tai
    orderGifts: [],

    /*--- chat --- */
    chat: {
        //tong tin nhan chua xem
        totalCountUnreadMessage: 0,
    },

    /*--- order --- */
    indexOrderTab: undefined,

    orderReturnsOptions: {
        reason: '',
        //hình thức thanh toán trả hàng
        refundMethod: '',
    },

    /*--- auto modal--- */
    //check hien modal spin attendance
    numOpenModalAttendance: 1,

    //index dang show cua auto modal
    currentShowIndexAutoModal: 0,

    //check show modal address request
    isShowModalRequestAddress: true,

    /*--- app --- */
    //--loading app
    loadingApp: false,
    titleLoadingApp: 'Đang xử lý',

    status: Status.DEFAULT,
    message: Message.NOT_MESSAGE,
    argsMessage: {},

    /*--- product detail --- */
    //--loading app
    //--danh sach option cua san pham da chon
    productDetail: {
        productOptionsSelected: undefined,
    },

    /*--- address --- */
    address: {
        // check lay location trong bottom location
        finishGetLocation: false,
    },

    /*--- home --- */
    home: {
        // kiem tra xem cac section da render het chua
        countSectionProductCategoryFinishRender: 0,
        checkA: 0,
        checkB: 0,
    },
};

export const appSlice = createSlice({
    name: 'apps',
    initialState,
    reducers: {
        /*--- app --- */
        SET_APP_START: (state, action: PayloadAction<boolean>) => {
            state.isAppStart = action.payload;
        },
        SET_CONNECTED_INTERNET: (state, action: PayloadAction<boolean>) => {
            state.isConnectedInternet = action.payload;
        },
        SET_NUM_SHOW_PHONE_CONFIRM: (state, action: PayloadAction<number>) => {
            state.numShowPhoneConfirm = action.payload;
        },
        SET_STATUS_MESSAGE: (
            state,
            action: PayloadAction<{
                status?: keyof typeof Status;
                message?: keyof typeof Message;
                argsMessage?: ArgsMessageType;
            }>
        ) => {
            const {
                status = 'DEFAULT',
                message = 'NOT_MESSAGE',
                argsMessage = {},
            } = action.payload;
            state.status = Status[status];
            state.message = Message[message];
            state.argsMessage = argsMessage;
        },
        SET_CHECK_SHOW_MODAL_REQUEST_ADDRESS: (state, action: PayloadAction<boolean>) => {
            state.isShowModalRequestAddress = action.payload;
        },

        /*--- cart --- */

        /*--- order --- */
        SET_ORDER_RETURNS_OPTIONS: (
            state,
            action: PayloadAction<{ reason: string; refundMethod: string }>
        ) => {
            state.orderReturnsOptions.reason = action.payload.reason;
            state.orderReturnsOptions.refundMethod = action.payload.refundMethod;
        },
        /*--- product --- */
        SET_VIDEO_OPTION: (state, action: PayloadAction<VideoOptionType>) => {
            state.videoOption = action.payload;
        },
        RESET_VIDEO_OPTION: (state) => {
            //handle goback fullscreen video
            state.videoOption = initialState.videoOption;
        },

        /*--- checkout gift --- */
        SET_GIFTS_ORDER: (state, action: PayloadAction<Array<string>>) => {
            state.orderGifts = action.payload;
        },

        /*--- order --- */
        SET_INDEX_ORDER_TAB: (state, action: PayloadAction<appState['indexOrderTab']>) => {
            state.indexOrderTab = action.payload;
        },
        /*--- chat --- */
        SET_CHAT_STATE: (state, action: PayloadAction<appState['chat']>) => {
            const { totalCountUnreadMessage } = action.payload || {};
            if (totalCountUnreadMessage !== undefined) {
                state.chat.totalCountUnreadMessage = totalCountUnreadMessage;
            }
        },

        /*--- product detail --- */
        SET_PRODUCT_DETAIL_STATE: (state, action: PayloadAction<appState['productDetail']>) => {
            state.productDetail = {
                ...state.productDetail,
                ...action.payload,
            };
        },

        /*--- auto modal--- */
        SET_NUM_SPIN_ATTENDANCE_MODAL: (state, action: PayloadAction<number>) => {
            state.numOpenModalAttendance = action.payload;
        },

        SET_CURRENT_AUTO_SHOW_MODAL: (state, action: PayloadAction<number>) => {
            state.currentShowIndexAutoModal = action.payload;
        },

        /*--- address--- */
        SET_FINISH_GET_LOCATION: (state, action: PayloadAction<boolean>) => {
            state.address.finishGetLocation = action.payload;
        },

        /*--- address--- */
        SET_HOME_STATE: (state, action: PayloadAction<appState['home']>) => {
            state.home = {
                ...state.home,
                ...action.payload,
            };
        },

        /*--- app--- */

        SET_LOADING_APP: (
            state,
            action: PayloadAction<{
                loading: boolean;
                title?: string;
            }>
        ) => {
            state.loadingApp = action.payload.loading;
            state.titleLoadingApp = action.payload.title;
        },
    },
});

export const {
    SET_APP_START,
    SET_CONNECTED_INTERNET,
    SET_NUM_SHOW_PHONE_CONFIRM,
    SET_STATUS_MESSAGE,
    SET_ORDER_RETURNS_OPTIONS,
    SET_VIDEO_OPTION,
    RESET_VIDEO_OPTION,
    SET_GIFTS_ORDER,
    SET_NUM_SPIN_ATTENDANCE_MODAL,
    SET_CHAT_STATE,
    SET_INDEX_ORDER_TAB,
    SET_LOADING_APP,
    SET_PRODUCT_DETAIL_STATE,
    SET_CHECK_SHOW_MODAL_REQUEST_ADDRESS,
    SET_CURRENT_AUTO_SHOW_MODAL,
    SET_FINISH_GET_LOCATION,
    SET_HOME_STATE,
} = appSlice.actions;

export default appSlice.reducer;
