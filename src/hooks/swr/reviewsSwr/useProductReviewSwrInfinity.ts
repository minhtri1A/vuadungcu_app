import { Status } from 'const/index';
import { forEach } from 'lodash';
import { ProductReviewResponseType, ProductReviewSwrInfinityType } from 'models';
import { services } from 'services';
import { SWRConfiguration } from 'swr';
import useSWRInfinite from 'swr/infinite';
import { addParamsToUrl } from 'utils/helpers';

export default function useProductReviewSwrInfinity(
    params: {
        product_seller_uuid: string;
        page?: number;
        page_size?: number;
        score?: string;
        has_media?: 'Y' | 'N';
    },
    option?: SWRConfiguration
): ProductReviewSwrInfinityType {
    //key
    // const key = addParamsToUrl('/products', {...params, page:});
    // console.log('key get product infinity swr ', key);
    //swr
    const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite<any, any>(
        (index) => {
            const key = `${addParamsToUrl('/products/reviews', {
                page: index + 1,
                ...params,
            })}`;
            return key;
        },
        (url) => services.get(url),
        option
    );
    //handle data
    const loadingInit = !data && !error ? Status.LOADING : Status.DEFAULT;

    let reviews: Array<ProductReviewResponseType> = [];
    let pagination = {
        page: 0,
        page_count: 0,
        page_size: 0,
        total_items: 0,
    };

    forEach(data, (value) => {
        reviews = [...reviews, ...(value._embedded?.reviews || [])];
        pagination = {
            page: value.page,
            page_count: value.page_count,
            page_size: value.page_size,
            total_items: value.total_items,
        };
    });

    return {
        data,
        reviews,
        pagination,
        size,
        setSize,
        mutate,
        loadingInit,
        isValidating,
    };
}
