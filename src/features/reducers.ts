import { combineReducers } from 'redux';
import AccountReducer from './account/accountSlice';
import AddressReducer from './address/addressSlice';
import appsReducer from './apps/appsSlice';
import authReducer from './auth/authSlice';
// import counterReducer from './counter/counterSlice';

export default combineReducers({
    // app: appReducer,
    apps: appsReducer,
    auth: authReducer,
    account: AccountReducer,
    address: AddressReducer,
});
