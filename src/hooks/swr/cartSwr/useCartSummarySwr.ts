import { CartSummarySwrType, ParamsGetCartSummaryType } from 'models';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';

//lấy thông tin tóm lượn của giỏ hàng
//key:
//--addParamsToUrl('cart/mine/cart-summary', {})

export default function useCartSummarySwr(
    params?: ParamsGetCartSummaryType,
    option?: SWRConfiguration
): CartSummarySwrType {
    //key
    const key = addParamsToUrl('cart/mine/cart-summary', params);
    //swr
    const { data, error, mutate, isValidating, isLoading } = useSWR<any, any>(
        key,
        () => services.customer.getMineSummary('cart-summary', undefined, params),
        option
    );

    return {
        cartSummary: data,
        error,
        mutate,
        isValidating,
        isLoading,
    };
}
