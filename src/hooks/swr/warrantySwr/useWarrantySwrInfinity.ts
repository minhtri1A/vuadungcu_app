import { Status } from 'const/index';
import { forEach } from 'lodash';
import {
    ParamsGetCustomerWarranties,
    WarrantiesResponseType,
    WarrantySwrInfinityType,
} from 'models';
import { services } from 'services';
import { SWRConfiguration } from 'swr';
import useSWRInfinite from 'swr/infinite';
import { addParamsToUrl } from 'utils/helpers';

export default function useWarrantySwrInfinity(
    params?: ParamsGetCustomerWarranties,
    option?: SWRConfiguration
): WarrantySwrInfinityType {
    //hooks
    //key
    //swr
    const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite<any, any>(
        (index) => {
            const key = `${addParamsToUrl('/warranty', { ...params, page: index + 1 })}`;
            return key;
        },
        (url) => services.get(url),
        option
    );
    //handle data
    const loadingInit = !data && !error ? Status.LOADING : Status.DEFAULT;

    let warranties: Array<WarrantiesResponseType> = [];
    let pagination = {
        page: 0,
        page_count: 0,
        page_size: 0,
        total_items: 0,
    };
    forEach(data, (value) => {
        warranties = [...warranties, ...(value._embedded?.warranty || [])];
        pagination = {
            page: value.page,
            page_count: value.page_count,
            page_size: value.page_size,
            total_items: value.total_items,
        };
    });

    return {
        data,
        warranties,
        pagination,
        size,
        setSize,
        mutate,
        loadingInit,
        isValidating,
    };
}
