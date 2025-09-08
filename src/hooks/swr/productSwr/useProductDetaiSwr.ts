import { Status } from 'const/index';
import { ProductDetailSwrType } from 'models';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';

//lay cac field dung lam dynamic field trong static page
export default function useProductDetailSwr(
    product_uuid: string,
    product_seller_uuid?: string,
    option?: SWRConfiguration
): ProductDetailSwrType {
    const key = addParamsToUrl(`/products/detail/${product_uuid}`, { product_seller_uuid });
    const { data, error, isValidating, mutate } = useSWR<any, any>(
        key,
        () => services.admin.getProductDetail(product_uuid, product_seller_uuid),
        {
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
