import AsyncStorage from '@react-native-async-storage/async-storage';
import { captureException, setTags } from '@sentry/react-native';
import { store } from 'app/store';
import { isEqual } from 'lodash';
import { KeyedMutator } from 'swr';

const isEmpty = (value: any) => {
    if (!value) {
        return true;
    }
    if (typeof value === 'object') {
        if (Object.keys(value).length === 0) {
            return true;
        }
    }
    return false;
};

export const sendSentryError = (error: any, func: string) => {
    const username = store.getState().auth.username;
    // const username = 'dddd';
    setTags({ func, username: username || 'no-user' });
    captureException(error);
};

//cache
//khi swr sử dụng cache sẽ tạo 1 key riêng trong asyncStorage
export const swrCache = async (
    data: any,
    mutate: KeyedMutator<any>,
    key: string,
    cache?: number //số giây
) => {
    if (cache) {
        const storeData: any = await AsyncStorage.getItem(key);
        const { data_cache, time_cache } = JSON.parse(storeData) || {};
        const currentTime = Date.now();
        //nếu chưa tồn tại data sẽ lấy trong cache ra đưa vào swr or mutate
        if (data === undefined) {
            const isAppStart = store.getState().apps.isAppStart;
            const fetch_check = isEmpty(time_cache) || time_cache < currentTime ? true : false;

            //neu chua co data cache thi fetch data moi
            if (isEmpty(data_cache) && isAppStart) {
                mutate();
                return;
            }

            if (!isEmpty(data_cache)) {
                // cache het han
                if (fetch_check && isAppStart) {
                    mutate(data_cache, true);
                }
                //lay du lieu tu cache hien ra
                if (!fetch_check) {
                    mutate(data_cache, false);
                }
            }
        } else {
            //thời gian cache hết thì lưu lại cache
            if (
                isEmpty(time_cache) ||
                time_cache < currentTime ||
                (!isEmpty(data) && !isEqual(data_cache, data))
            ) {
                const newTimeCache = currentTime + cache * 1000;
                AsyncStorage.setItem(
                    key,
                    JSON.stringify({ data_cache: data, time_cache: newTimeCache })
                );
            }
        }
    }
};
