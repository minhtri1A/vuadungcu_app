import { Status } from 'const/index';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';
import { CartOrderStatusSwrType } from '../../../models/swrModel';

//lấy danh sách trạng thái đơn hàng của khách hàng
export default function useCartOrderStatusSwr(option?: SWRConfiguration): CartOrderStatusSwrType {
    //key
    const key = addParamsToUrl('carts/orders/status-count', {});
    //swr
    const { data, error, mutate, isValidating } = useSWR<any, any>(
        key,
        () => services.customer.getStatusCountOrderCustomer(),
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
