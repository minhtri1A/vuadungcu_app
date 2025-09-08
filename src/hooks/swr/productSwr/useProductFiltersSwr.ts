import { Status } from 'const/index';
import { ParamsGetProductFiltersType, ProductFilterSwrType } from 'models';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';

export default function useProductFiltersSwr(
    params: ParamsGetProductFiltersType,
    option?: SWRConfiguration
): ProductFilterSwrType {
    const key = addParamsToUrl('/products/list/filters', params);
    const { data, error, mutate, isValidating } = useSWR<any, any>(
        key,
        () => services.admin.getProductFilters(params),
        {
            // dedupingInterval: 60 * 60 * 1000,
            ...option,
        }
    );
    const status = error ? Status.ERROR : !data ? Status.LOADING : Status.SUCCESS;

    return {
        filters: data?.filters || [],
        error,
        mutate,
        isValidating,
        status,
    };
}
