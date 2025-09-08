import { Message, Status } from 'const/index';
import { CartDeliverySwrType } from 'models';
import { useState } from 'react';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';

//delivery - delivery-fee - all

//type:
// --delivery: sẽ lấy thông tin một đơn vị vận chuyển dựa trên giỏ hàng
// --delivery-fee: thống thông tin phí vận chuyển của giỏ hàng hoặc sản phẩm
// --product_uuid sẽ lấy thông tin dvvc của một sản phẩm .
//--all: sẽ lấy thông tin tất cả dvvc dựa trên giỏ hàng
//key
export default function useCartDeliverySwr<T>(
    action?: 'delivery' | 'delivery-fee',
    product_uuid?: string,
    option?: SWRConfiguration
): CartDeliverySwrType<T> {
    //hook
    const [status, setStatus] = useState<string>(Status.DEFAULT);
    const [message, setMessage] = useState(Message.NOT_MESSAGE);
    //key
    const key = addParamsToUrl('carts/deliveries', { action, product_uuid });
    //headers
    const headers: any = product_uuid ? { productuuid: product_uuid } : undefined;
    //swr
    const { data, error, mutate, isValidating } = useSWR<any, any>(
        key,
        () => services.customer.getCartDelivery(action, headers),
        { ...option }
    );

    const loadingInit = !data && !error ? Status.LOADING : Status.DEFAULT;
    const messageInit = data?.code;

    const updateCartDelivery = async (delivery_uuid: string) => {
        const result = await services.customer.updateCartDelivery(delivery_uuid);
        if (result?.code === 'SUCCESS') {
            //return checkout page
            // setMessage(Message.);
            setStatus(Status.SUCCESS);
        } else {
            setMessage(Message.UPDATE_CART_DELIVERY_FAILED);
            setStatus(Status.ERROR);
        }
    };

    return {
        data,
        error,
        mutate,
        isValidating,
        loadingInit,
        messageInit,
        //
        status,
        message,
        setStatus,
        setMessage,
        //
        updateCartDelivery,
    };
}
