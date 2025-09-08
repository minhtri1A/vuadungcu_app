import { Status } from 'const/index';
import { NewsDetailSwrType } from 'models';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';

//key all: cart
//key minicart: cart?page_size=5

export default function useNewsDetailSwr(
    news_uuid: string,
    option?: SWRConfiguration
): NewsDetailSwrType {
    //key
    const key = addParamsToUrl('news', { news_uuid });
    //swr
    const { data, mutate, isValidating, error } = useSWR<any, any>(
        key,
        () => services.admin.getNewsDetail(news_uuid),
        option
    );
    //value
    const loadingInit = !data && !error ? Status.LOADING : data ? Status.SUCCESS : Status.ERROR;

    return {
        newsDetail: data,
        mutate,
        isValidating,
        loadingInit,
    };
}
