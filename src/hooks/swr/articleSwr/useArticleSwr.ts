/* eslint-disable react-hooks/exhaustive-deps */
import { Status } from 'const/index';
import { ArticleSwrType, ParamsArticleType } from 'models';
import { useEffect } from 'react';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { swrCache } from 'utils/storeHelpers';

export default function useArticleSwr(
    type: ParamsArticleType,
    option?: SWRConfiguration,
    cache = 3600
): ArticleSwrType {
    //hooks
    //swr
    const key = `/article/${type}`;
    const { data, error, isValidating, mutate } = useSWR<any, any>(
        key,
        () => services.admin.getArticle(type),
        {
            dedupingInterval: 60 * 60 * 60 * 60 * 2,
            ...option,
        }
    );
    //cache swr
    useEffect(() => {
        swrCache(data, mutate, key, cache);
    }, [data]);
    //init
    const loadingInit = !data && !error ? Status.LOADING : Status.DEFAULT;

    return {
        data,
        error,
        isValidating,
        mutate,
        loadingInit,
    };
}
