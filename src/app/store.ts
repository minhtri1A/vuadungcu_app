import AsyncStorage from '@react-native-async-storage/async-storage';
import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import reducers from 'features/reducers';
import {
    FLUSH,
    PAUSE,
    PERSIST,
    persistReducer,
    persistStore,
    PURGE,
    REGISTER,
    REHYDRATE,
} from 'redux-persist';
import createFilter from 'redux-persist-transform-filter';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import createSagaMiddleware from 'redux-saga';
import rootSagas from './sagas';

//persist
// const categoryCreateFilter = createFilter('category', ['categories']);
const authCreateFilter = createFilter('auth', ['username']);
// const appsCreateFilter = createFilter('apps', ['appCache']);
// const appCreateFilter = createFilter('app', ['language']);

const persistConfig = {
    key: 'root',
    //danh sach cac slice duoc phep persist
    whitelist: ['auth'],
    //danh sach cac state thuoc slice duoc phep persist
    transforms: [authCreateFilter],
    storage: AsyncStorage,
    stateReconciler: autoMergeLevel2,
};

//reducer
const persistedReducer: any = persistReducer(persistConfig, reducers as any);

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(sagaMiddleware),
});

console.log('store ', store);

sagaMiddleware.run(rootSagas);

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
// export type RootState = ReturnType<typeof store.getState>;
export type RootState = ReturnType<typeof reducers>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
export type StoreType = typeof store;
