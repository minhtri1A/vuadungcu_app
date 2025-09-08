import { Status } from 'const/index';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { OrderDetailPosSwrType } from '../../../models/swrModel';

//key:dynamic
//--addParamsToUrl('/carts/orders/detail', { orderUuid: })

export default function useOrderPosDetailSwr(
    order_uuid: string,
    option?: SWRConfiguration
): OrderDetailPosSwrType {
    //key
    const key = `/pos/orders/${order_uuid}`;
    //swr

    const { data, error, mutate, isValidating } = useSWR<any, any>(
        key,
        () => services.customer.getOrderDetailCustomerPos(order_uuid),
        option
    );

    const loadingInit = !data && !error ? Status.LOADING : Status.DEFAULT;

    return {
        order: data,
        mutate,
        loadingInit,
        isValidating,
    };
}
