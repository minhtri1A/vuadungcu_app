import { Status } from 'const/index';
import { ParamsGetProductShippingType, ProductShippingSwrType } from 'models';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { isEmpty } from 'utils/helpers';

//lay cac field dung lam dynamic field trong static page
export default function useProductShippingSwr(
    product_seller_uuid: string,
    params: ParamsGetProductShippingType,
    option?: SWRConfiguration
): ProductShippingSwrType {
    const key = `product/shipping/${product_seller_uuid}`;
    const { data, error, isValidating, mutate } = useSWR<any, any>(
        isEmpty(product_seller_uuid, false) ? null : key,
        () => services.admin.getProductShipping(product_seller_uuid, params),
        {
            dedupingInterval: 3600 * 60,
            ...option,
            ...option,
        }
    );

    //status
    const loadingInit = !data && !error ? Status.LOADING : data ? Status.SUCCESS : Status.ERROR;

    return {
        shipping: data,
        loadingInit,
        isValidating,
        mutate,
    };
}
