import { Status } from 'const/index';
import { NewsCategoriesSwrType } from 'models';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';

export default function useNewsCategorySwr(option?: SWRConfiguration): NewsCategoriesSwrType {
    const { data, error, mutate, isValidating } = useSWR<any, any>(
        'news/categories',
        () => services.admin.getNewsCategory(),
        {
            dedupingInterval: 60 * 60 * 3000,
            ...option,
        }
    );
    const loadingInit = !data && !error ? Status.LOADING : data ? Status.SUCCESS : Status.ERROR;

    return {
        categories: data?._embedded?.categories || [],
        error,
        mutate,
        loadingInit,
        isValidating,
    };
}
