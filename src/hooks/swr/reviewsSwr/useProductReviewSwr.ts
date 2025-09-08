import { Status } from 'const/index';
import { ProductReviewSwrType } from 'models';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';

//lay cac field dung lam dynamic field trong static page
export default function useProductReviewSwr(
    params: {
        product_seller_uuid: string;
        page_size?: number;
        page?: number;
    },
    option?: SWRConfiguration
): ProductReviewSwrType {
    const key = addParamsToUrl('/products/reviews', params);
    const { data, error, isValidating, mutate } = useSWR<any, any>(
        key,
        () => services.customer.getProductReviews(params),
        {
            ...option,
        }
    );

    //status
    const loadingInit = !data && !error ? Status.LOADING : data ? Status.SUCCESS : Status.ERROR;

    //data
    const {
        _embedded: { reviews = [] } = { reviews: [] },
        page_count = 0,
        page_size = 0,
        total_items = 0,
        page = 0,
    } = data || {};
    const pagination = {
        page_count,
        page_size,
        total_items,
        page,
    };
    return {
        reviews,
        pagination,
        error,
        mutate,
        loadingInit,
        isValidating,
    };
}
