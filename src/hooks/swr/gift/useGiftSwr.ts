import { Status } from 'const/index';
import { GiftSwrType } from 'models';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';
import { ParamsGetListGiftCustomer } from '../../../models/apiModel';

export default function useGiftSwr(
    params?: ParamsGetListGiftCustomer,
    option?: SWRConfiguration
): GiftSwrType {
    const key = addParamsToUrl('/gift', params);
    const { data, error, mutate, isValidating } = useSWR<any, any>(
        key,
        () => services.customer.getListGiftCustomer(params),
        {
            ...option,
        }
    );
    const loadingInit = !data && !error ? Status.LOADING : data ? Status.SUCCESS : Status.ERROR;
    let pagination = {
        page: data?.page || 0,
        page_count: data?.page_count || 0,
        page_size: data?.page_size || 0,
        total_items: data?.total_items || 0,
    };
    return {
        gift: data?._embedded?.gifts || [],
        error,
        mutate,
        loadingInit,
        isValidating,
        pagination,
    };
}
