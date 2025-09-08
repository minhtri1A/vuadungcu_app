import { forEach } from 'lodash';
import { ScoreHistoryType } from 'models';
import { services } from 'services';
import { SWRConfiguration } from 'swr';
import useSWRInfinite from 'swr/infinite';
import { addParamsToUrl } from 'utils/helpers';

/*
 * Lấy danh sách lịch sử nhận điểm và sử dụng điểm của khách hàng
 */
export default function usePosCustomerScoreHistorySWRInfinite(
    seller_uuid: string,
    option?: SWRConfiguration
) {
    //hooks
    //key
    // const key = addParamsToUrl('/products', {...params, page:});
    // console.log('key get product infinity swr ', key);
    //swr
    const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
        (index) => {
            const key = `${addParamsToUrl('/pos/customers', {
                type: 'score_history',
                seller_uuid,
                page: index + 1,
            })}`;
            return key;
        },
        (url) => services.get(url),
        option
    );
    //handle data

    let posScoreHistory: Array<ScoreHistoryType> = [];
    let pagination = {
        page: 0,
        page_count: 0,
        page_size: 0,
        total_items: 0,
    };

    forEach(data, (value) => {
        posScoreHistory = [...posScoreHistory, ...(value._embedded.pos_customers || [])];
        pagination = {
            page: value.page,
            page_count: value.page_count,
            page_size: value.page_size,
            total_items: value.total_items,
        };
    });

    return {
        posScoreHistory,
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

export type OrderPosSwrInfinityType = ReturnType<typeof usePosCustomerScoreHistorySWRInfinite>;
