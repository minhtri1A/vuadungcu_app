import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';

//key:dynamic
//--addParamsToUrl('/carts/orders/detail', { orderUuid: })

export default function usePosCustomerTicketDetailSWR(
    seller_uuid: string,
    ticket_id: string,
    option?: SWRConfiguration
) {
    //key
    const key = `/pos/tickets/${seller_uuid}/${ticket_id}`;
    //swr

    const { data, error, isValidating, isLoading, mutate } = useSWR<any, any>(
        key,
        () => services.customer.getPosCustomerTicketDetail(seller_uuid, ticket_id),
        option
    );

    return {
        posTicketDetail: data,
        error,
        isValidating,
        isLoading,
        mutate,
    };
}

export type PosCustomerTicketDetailSWRType = ReturnType<typeof usePosCustomerTicketDetailSWR>;
