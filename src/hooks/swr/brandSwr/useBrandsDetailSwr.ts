/* eslint-disable react-hooks/exhaustive-deps */
import { Status } from 'const/index';
import { BrandDetailSwrType } from 'models';
import { useEffect } from 'react';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { swrCache } from 'utils/storeHelpers';

export default function useBrandsDetailSwr(
    brand_uuid: string,
    option?: SWRConfiguration,
    cache = 3600
): BrandDetailSwrType {
    //hooks
    //swr
    const key = `/brand/${brand_uuid}`;
    const {
        data,
        mutate,
        error,
        isValidating,
        mutate: mutateBrand,
    } = useSWR<any, any>(key, () => services.admin.getBrandDetail(brand_uuid), {
        dedupingInterval: 60 * 60 * 60 * 60 * 2,
        ...option,
    });
    //cache swr
    useEffect(() => {
        if (brand_uuid !== undefined) {
            swrCache(data, mutate, key, cache);
        }
    }, [data]);
    //init
    const loadingInit = !data && !error ? Status.LOADING : Status.DEFAULT;

    return {
        brand: data,
        error,
        isValidating,
        mutateBrand,
        loadingInit,
    };
}
