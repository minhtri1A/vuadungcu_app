import { ProductConfigSwrType } from 'models';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';

// cau hinh san pham con

export default function useProductConfigSwr(
    product_seller_uuid: string,
    option?: SWRConfiguration,
    //other key
): ProductConfigSwrType {
    const key = addParamsToUrl('products/config', product_seller_uuid);
    const { data, error, mutate, isValidating } = useSWR<any, any>(
        key,
        () => services.admin.getProductConfig(product_seller_uuid),
        {
            // dedupingInterval: 60 * 60 * 1000,
            ...option,
        }
    );

    return {
        productConfig: data,
        error,
        mutate,
        isValidating,
    };
}
