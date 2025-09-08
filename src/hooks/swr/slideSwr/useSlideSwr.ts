/* eslint-disable react-hooks/exhaustive-deps */
import { Status } from 'const/index';
import { ParamsGetSlidesType, SlideSwrType } from 'models';
import { useEffect } from 'react';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';
import { swrCache } from 'utils/storeHelpers';

export default function useSlideSwr(
    params: ParamsGetSlidesType,
    option?: SWRConfiguration,
    cache?: number
): SlideSwrType {
    //key
    const key = addParamsToUrl('sites/slides', params);
    //swr
    const { data, error, isLoading, mutate, isValidating } = useSWR<any, any>(
        key,
        () => services.admin.getSlides(params),
        option
    );
    //cache swr
    useEffect(() => {
        swrCache(data, mutate, key, cache);
    }, [data]);
    //init
    const loadingInit = !data && !error ? Status.LOADING : Status.DEFAULT;

    return {
        slides: data?._embedded?.slides || [],
        error,
        loadingInit,
        isValidating,
        isLoading,
        mutate,
    };
}
