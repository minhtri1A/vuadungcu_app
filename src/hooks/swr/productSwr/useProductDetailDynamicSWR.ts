import { Status } from 'const/index';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';

//lay cac field dung lam dynamic field trong static page
export default function useProductDetailDynamicSWR(
    product_uuid: string,
    product_seller_uuid?: string,
    option?: Partial<SWRConfiguration>
) {
    const key = addParamsToUrl(`/products/detail-dynamic/${product_uuid}`, { product_seller_uuid });
    const { data, error, isValidating, mutate } = useSWR(
        key,
        () => services.admin.getProductDetail('detail-dynamic', product_uuid, product_seller_uuid),
        {
            dedupingInterval: 1000000000,
            ...option,
        }
    );

    //status
    const loadingInit = !data && !error ? Status.LOADING : data ? Status.SUCCESS : Status.ERROR;

    return {
        productDetail: data,
        loadingInit,
        isValidating,
        mutate,
    };
}

export type ProductDetailDynamicSWRType = ReturnType<typeof useProductDetailDynamicSWR>;
