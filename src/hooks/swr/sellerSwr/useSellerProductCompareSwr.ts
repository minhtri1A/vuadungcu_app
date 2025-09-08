import { Status } from 'const/index';
import { SellerProductCompareSwrType } from 'models';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';

//lay cac field dung lam dynamic field trong static page
export default function useSellerProductCompareSwr(
    product_uuid: string,
    option?: SWRConfiguration
): SellerProductCompareSwrType {
    const key = `product/seller${product_uuid}`;
    const { data, error, isValidating, mutate } = useSWR<any, any>(
        key,
        () => services.admin.getSellerProductCompare(product_uuid),
        {
            ...option,
        }
    );

    //status
    const loadingInit = !data && !error ? Status.LOADING : data ? Status.SUCCESS : Status.ERROR;

    return {
        sellerCompare: data,
        loadingInit,
        isValidating,
        mutate,
    };
}
