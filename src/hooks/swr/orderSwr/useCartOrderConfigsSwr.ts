/* eslint-disable react-hooks/exhaustive-deps */
import { Status } from 'const/index';
import { CartOrderConfigSwrType } from 'models';
import { useEffect } from 'react';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';
import { swrCache } from 'utils/storeHelpers';
//Lấy danh sách cấu hình vân chuyển của đơn hàng

//key addParamsToUrl('carts/orders/configs', {});
export default function useCartOrderConfigsSwr(option?: SWRConfiguration): CartOrderConfigSwrType {
    //hook
    //value
    const cache = 3600 * 24; //1 day
    //key
    const key = addParamsToUrl('carts/orders/configs', {});
    //swr
    const { data, error, mutate, isValidating } = useSWR<any, any>(
        key,
        () => services.customer.getOrderConfig(),
        { ...option }
    );

    const loadingInit = !data && !error ? Status.LOADING : Status.DEFAULT;
    //cache swr
    useEffect(() => {
        swrCache(data, mutate, key, cache);
    }, [data]);

    return {
        data,
        mutate,
        isValidating,
        loadingInit,
    };
}
