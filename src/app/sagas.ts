import accountSaga from './../features/account/accountSaga';
import authSaga from './../features/auth/authSaga';
// import policySaga from 'features/policy/PolicySaga';
import { fork } from 'redux-saga/effects';
// import accountSaga from './../features/account/accountSaga';

export default function* root() {
    yield fork(accountSaga);
    yield fork(authSaga);
    // yield fork(cartSaga);
    // yield fork(checkoutSaga);
    // yield fork(searchSaga);
    // yield fork(addressSaga);
    // yield fork(policySaga);
    // yield fork(productSaga);
    // yield fork(appSaga)
    // yield fork(appSaga);
}
