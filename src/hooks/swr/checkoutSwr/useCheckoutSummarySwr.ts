import { CheckoutSummarySwrType } from 'models';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';

export default function useCheckoutSummarySwr(
    params?: any,
    option?: SWRConfiguration
): CheckoutSummarySwrType {
    //key
    const key = addParamsToUrl('cart/mine/checkout-summary', params);
    //swr
    const { data, error, mutate, isValidating } = useSWR<any, any>(
        key,
        () => services.customer.getMineSummary('checkout-summary'),
        { dedupingInterval: 1, ...option }
    );

    const {
        count_items = 0,
        total_order_price = 0,
        total_items_price = 0,
        shipping_fee = 0,
        shipping_fee_discount_percent = 0,
        shipping_fee_discount = 0,
    } = data || {};
    const messageInit = data?.code;

    return {
        checkoutSummary: {
            count_items: count_items,
            total_items_price: total_items_price,
            total_order_price: total_order_price,
            shipping_fee: shipping_fee,
            shipping_fee_discount_percent: shipping_fee_discount_percent,
            shipping_fee_discount: shipping_fee_discount,
        },
        messageInit,
        error,
        mutate,
        isValidating,
    };
}
