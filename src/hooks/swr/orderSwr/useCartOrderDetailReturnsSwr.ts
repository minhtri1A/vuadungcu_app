import { Status } from 'const/index';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';
import { CartOrderDetailReturnsSwrType } from '../../../models/swrModel';

//key:dynamic
//--addParamsToUrl('/carts/orders/detail', { orderUuid: })

export default function useCartOrderDetailReturnsSwr(
    memo_uuid: string,
    option?: SWRConfiguration
): CartOrderDetailReturnsSwrType {
    //key
    const key = addParamsToUrl('/carts/orders/detail', { memo_uuid });
    //swr

    const { data, error, mutate, isValidating } = useSWR<any, any>(
        key,
        () => services.customer.getCartOrderDetailReturns(memo_uuid),
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
