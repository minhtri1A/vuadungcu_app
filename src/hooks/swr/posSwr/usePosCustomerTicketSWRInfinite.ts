import { forEach } from 'lodash';
import { PosTicketType } from 'models';
import { services } from 'services';
import { SWRConfiguration } from 'swr';
import useSWRInfinite from 'swr/infinite';
import { addParamsToUrl } from 'utils/helpers';

/*
 * Lấy danh sách lịch sử nhận điểm và sử dụng điểm của khách hàng
 */
export default function usePosCustomerTicketSWRInfinite(
    seller_uuid: string,
    option?: SWRConfiguration
) {
    //hooks
    //key
    // const key = addParamsToUrl('/products', {...params, page:});
    // console.log('key get product infinity swr ', key);
    //swr
    const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite<any, any>(
        (index) => {
            const key = `${addParamsToUrl(`/pos/tickets/${seller_uuid}`, {
                page: index + 1,
            })}`;
            return key;
        },
        (url) => services.get(url),
        option
    );
    //handle data

    let posTicketList: Array<PosTicketType> = [];
    let pagination = {
        page: 0,
        page_count: 0,
        page_size: 0,
        total_items: 0,
    };

    forEach(data, (value) => {
        posTicketList = [...posTicketList, ...value._embedded.pos_tickets];
        pagination = {
            page: value.page,
            page_count: value.page_count,
            page_size: value.page_size,
            total_items: value.total_items,
        };
    });

    return {
        posTicketList,
        pagination,
        size,
        setSize,
        mutate,
        isValidating,
        // message,
        // setStatus,
        // setMessage,
    };
}

export type PosCustomerTicketSWRInfiniteType = ReturnType<typeof usePosCustomerTicketSWRInfinite>;
