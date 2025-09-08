import { Status } from 'const/index';
import { NewsSwrType, ParamsGetNewsType } from 'models';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';

//key all: cart
//key minicart: cart?page_size=5

export default function useNewsSwr(
    params: ParamsGetNewsType,
    option?: SWRConfiguration
): NewsSwrType {
    //key
    const key = addParamsToUrl('news', params);
    //swr
    const { data, mutate, isValidating, error } = useSWR<any, any>(
        key,
        () => services.admin.getNews(params),
        option
    );
    //value
    const loadingInit = !data && !error ? Status.LOADING : data ? Status.SUCCESS : Status.ERROR;

    const data_ = data || {};
    const pagination = {
        page: data_.page || 0,
        page_count: data_.page_count || 0,
        page_size: data_.page_size || 0,
        total_items: data_.total_items || 0,
    };

    return {
        news: data_._embedded?.news || [],
        pagination,
        mutate,
        isValidating,
        loadingInit,
    };
}
