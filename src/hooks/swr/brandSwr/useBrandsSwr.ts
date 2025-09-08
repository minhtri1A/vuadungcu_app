/* eslint-disable react-hooks/exhaustive-deps */
import { Status } from 'const/index';
import { BrandSwrType } from 'models';
import { useEffect } from 'react';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';
import { swrCache } from 'utils/storeHelpers';
import { ParamsGetBrandsType } from '../../../models/apiModel';

export default function useBrandsSwr(
    params?: ParamsGetBrandsType,
    option?: SWRConfiguration,
    cache = 3600
): BrandSwrType {
    //hooks
    //swr
    const key = addParamsToUrl('brand', params);
    const {
        data,
        mutate,
        error,
        isValidating,
        isLoading,
        mutate: mutateBrands,
    } = useSWR<any, any>(key, () => services.admin.getBrands(params), option);

    //cache swr
    useEffect(() => {
        swrCache(data, mutate, key, cache);
    }, [data]);

    //init
    const loadingInit = !data && !error ? Status.LOADING : Status.DEFAULT;

    return {
        brands: data?._embedded?.brands || [],
        error,
        isValidating,
        mutateBrands,
        loadingInit,
        isLoading,
    };
}
