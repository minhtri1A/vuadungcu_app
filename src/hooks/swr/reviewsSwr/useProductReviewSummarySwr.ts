import { ProductReviewSummarySwrType } from 'models';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';

//lay cac field dung lam dynamic field trong static page
export default function useProductReviewSummarySwr(
    product_seller_uuid: string,
    option?: SWRConfiguration
): ProductReviewSummarySwrType {
    const key = addParamsToUrl('/products/reviews/summary', { product_seller_uuid });
    const { data, error, isValidating, mutate } = useSWR<any, any>(
        key,
        () => services.customer.getProductReviewsSummary({ product_seller_uuid }),
        {
            dedupingInterval: 3600 * 60,
            ...option,
        }
    );

    return {
        reviewsSummary: data?.summary || [],
        error,
        mutate,
        isValidating,
    };
}
