import { Status } from 'const/index';
import { SellerInfoSwrType } from 'models';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';

//lay cac field dung lam dynamic field trong static page
export default function useSellerSwr(
    type: 'seller_code' | 'seller_uuid',
    seller_value: string,
    option?: SWRConfiguration
): SellerInfoSwrType {
    const key = seller_value ? `seller/${seller_value}` : null;
    const { data, error, isValidating, mutate } = useSWR<any, any>(
        key,
        () => services.admin.getSellerInfo(type, seller_value),
        {
            dedupingInterval: 3600 * 1000,
            ...option,
        }
    );

    //status
    const loadingInit = !data && !error ? Status.LOADING : data ? Status.SUCCESS : Status.ERROR;

    return {
        seller: data,
        loadingInit,
        isValidating,
        mutate,
    };
}
