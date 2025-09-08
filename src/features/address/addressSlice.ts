import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Status from 'const/status';
import * as Message from '../../const/message';

export interface LocationState {
    province?: {
        id: string;
        name: string;
    };
    district?: {
        id: string;
        name: string;
    };
    ward?: {
        id: string;
        name: string;
    };
}

export interface AddressState {
    location: LocationState | null;
    statusPutUserAddress: string;
    messagePut: string;
}
const initialState: AddressState = {
    location: null,
    statusPutUserAddress: Status.DEFAULT,
    messagePut: Message.NOT_MESSAGE,
};

export const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        //address_location_form
        SET_LOCATION_VALUE: (state, action: PayloadAction<LocationState>) => {
            state.location = action.payload;
        },
        RESET_LOCATION_VALUE: (state) => {
            state.location = initialState.location;
        },
    },
});

export const { SET_LOCATION_VALUE, RESET_LOCATION_VALUE } = addressSlice.actions;

export default addressSlice.reducer;
