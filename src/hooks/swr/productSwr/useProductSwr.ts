import { Status } from 'const/index';
import { ParamsGetProductType } from 'models';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';

export default function useProductsSwr(params?: ParamsGetProductType, option?: SWRConfiguration) {
    const key = addParamsToUrl('product', params);

    const { data, error, mutate, isValidating, isLoading } = useSWR(
        key,
        () => services.admin.getProduct(params),
        {
            dedupingInterval: 60 * 60 * 1000,
            ...option,
        }
    );

    const status = error ? Status.ERROR : !data ? Status.LOADING : Status.SUCCESS;

    //kiem tra xem du lieu duoc fetch lan dau chua
    const initFetch = data || error ? true : false;

    return {
        products: data?._embedded?.products || [],
        pagination: {
            page: data?.page || 0,
            page_count: data?.page_count || 0,
            page_size: data?.page_size || 0,
            total_items: data?.total_items || 0,
        },
        error,
        mutate,
        isValidating,
        status,
        isLoading,
        initFetch,
    };
}
