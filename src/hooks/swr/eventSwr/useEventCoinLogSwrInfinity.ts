import { Status } from 'const/index';
import { forEach } from 'lodash';
import { EventCoinLogResponseType, EventCoinLogSwrInfinityType } from 'models';
import { services } from 'services';
import { SWRConfiguration } from 'swr';
import useSWRInfinite from 'swr/infinite';
import { addParamsToUrl } from 'utils/helpers';

/*
 * Lấy danh sách lịch sử nhận điểm và sử dụng điểm của khách hàng
 */
export default function useEventCoinLogSwrInfinity(
    action: 'log',
    log_type: 'in' | 'all' | 'out',
    option?: SWRConfiguration
): EventCoinLogSwrInfinityType {
    //hooks
    //key
    // const key = addParamsToUrl('/products', {...params, page:});
    //swr
    const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite<any, any>(
        (index) => {
            const key = `${addParamsToUrl('/event/coin', {
                action,
                log_type,
                page: index + 1,
            })}`;
            return key;
        },
        (url) => services.get(url),
        option
    );
    //handle data
    const loadingInit = !data && !error ? Status.LOADING : Status.DEFAULT;

    let logs: Array<EventCoinLogResponseType> = [];
    let pagination = {
        page: 0,
        page_count: 0,
        page_size: 0,
        total_items: 0,
    };

    forEach(data, (value) => {
        logs = [...logs, ...value._embedded.data];
        pagination = {
            page: value.page,
            page_count: value.page_count,
            page_size: value.page_size,
            total_items: value.total_items,
        };
    });

    return {
        // data,
        logs,
        pagination,
        size,
        setSize,
        mutate,
        loadingInit,
        isValidating,
        // message,
        // setStatus,
        // setMessage,
    };
}
