/* eslint-disable react-hooks/exhaustive-deps */
import Status from 'const/status';
import { CategorySwrType, ParamsGetCategoriesType } from 'models';
import { useEffect } from 'react';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';
import { swrCache } from 'utils/storeHelpers';

export default function useCategoriesSWR(
    category_uuid: string,
    params?: ParamsGetCategoriesType,
    option?: Partial<SWRConfiguration>,
    cache?: number,
    disable?: boolean
): CategorySwrType {
    //key

    const key = addParamsToUrl(`categories/${category_uuid}`, params);

    const { data, error, isValidating, isLoading, mutate } = useSWR<any, any>(
        !disable ? key : null,
        () => services.admin.getCategories(category_uuid, params),
        {
            dedupingInterval: 60 * 60 * 60 * 60 * 2, //2h
            ...option,
        }
    );
    //cache swr
    useEffect(() => {
        if (category_uuid !== undefined) {
            swrCache(data, mutate, key, cache);
        }
    }, [data]);
    //init
    const loadingInit = !data && !error ? Status.LOADING : Status.DEFAULT;

    return {
        categories: data,
        error,
        isValidating,
        mutate,
        loadingInit,
        isLoading,
    };
}
