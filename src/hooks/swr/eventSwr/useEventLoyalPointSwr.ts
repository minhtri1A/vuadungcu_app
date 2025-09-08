import { Status } from 'const/index';
import { EventLoyalPointSwrType } from 'models';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';

//lấy thông tin điểm tích luỹ or Xu của khách hàng
export default function useEventLoyalPointSwr(option?: SWRConfiguration): EventLoyalPointSwrType {
    //hooks - su dung cuc bo cua component
    //swr
    const key = addParamsToUrl('customers', { action: 'pos' });
    const { data, error, mutate } = useSWR<any, any>(
        key,
        () => services.customer.getCustomers('pos'),
        option
    );
    //init
    const initLoading = error ? Status.ERROR : !data ? Status.LOADING : Status.SUCCESS;
    return {
        data,
        initLoading,
        mutate,
    };
}
