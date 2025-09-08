/* eslint-disable react-hooks/exhaustive-deps */
import { Status } from 'const/index';
import { WarrantyDetailSwrType } from 'models';
import { useEffect } from 'react';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';
import { swrCache } from 'utils/storeHelpers';

export default function useWarrantyDetailSwr(
    warranty_uuid: string,
    option?: SWRConfiguration,
    cache = 0
): WarrantyDetailSwrType {
    //key
    const key = addParamsToUrl('sites/slides', { warranty_uuid });
    //swr
    const { data, error, mutate, isValidating } = useSWR<any, any>(
        key,
        () => services.customer.getCustomerWarrantyDetail(warranty_uuid),
        option
    );
    //cache swr
    useEffect(() => {
        swrCache(data, mutate, key, cache);
    }, [data]);
    //init
    const loadingInit = !data && !error ? Status.LOADING : Status.DEFAULT;

    return {
        warranty: data,
        error,
        loadingInit,
        isValidating,
        mutate,
    };
}
