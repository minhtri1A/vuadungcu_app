import { Status } from 'const/index';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';
import { CartOrderDetailSwrType } from '../../../models/swrModel';

//key:dynamic
//--addParamsToUrl('/carts/orders/detail', { orderUuid: })

export default function useCartOrderDetailSwr(
    orderUuid: string,
    option?: SWRConfiguration
): CartOrderDetailSwrType {
    //key
    const key = addParamsToUrl('/carts/orders/detail', { orderUuid });
    //swr

    const { data, error, mutate, isValidating } = useSWR<any, any>(
        key,
        () => services.customer.getCartOrderDetail(orderUuid),
        option
    );

    const loadingInit = !data && !error ? Status.LOADING : Status.DEFAULT;

    return {
        data,
        mutate,
        loadingInit,
        isValidating,
    };
}
