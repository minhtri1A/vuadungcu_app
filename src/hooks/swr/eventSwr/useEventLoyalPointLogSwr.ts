import { Status } from 'const/index';
import { forEach } from 'lodash';
import { EventLoyalPointLogSwrType, LoyalPointHistoryResponseType } from 'models';
import { showMessage } from 'react-native-flash-message';
import { services } from 'services';
import { SWRConfiguration } from 'swr';
import useSWRInfinite from 'swr/infinite';
import { addParamsToUrl } from 'utils/helpers';
import showLoadingApp from 'utils/showLoadingApp';
import showMessageApp from 'utils/showMessageApp';
import { sendSentryError } from 'utils/storeHelpers';

/*
 * Lấy danh sách lịch sử nhận điểm và sử dụng điểm của khách hàng
 */
export default function useEventLoyalPointLogSwr(
    option?: SWRConfiguration
): EventLoyalPointLogSwrType {
    //hooks
    //key
    // const key = addParamsToUrl('/products', {...params, page:});
    //swr
    const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite<any, any>(
        (index) => {
            const key = `${addParamsToUrl('/pos/scores', {
                type: 'history',
                page: index + 1,
            })}`;
            return key;
        },
        (url) => services.get(url),
        option
    );

    // handle
    const handleConnectCustomerWebAndPos = async (seller_uuid: string) => {
        try {
            showLoadingApp(true);
            const response = await services.customer.connectCustomerWebAndPos(seller_uuid);
            if (response.code === 'SUCCESS') {
                showMessage({
                    message: 'Liên kết tài khoản thành công!',
                    icon: 'success',
                });
                mutate();
                return;
            }
            throw response.code;
        } catch (error: any) {
            sendSentryError(error, 'handleConnectCustomerWebAndPos');
            showMessageApp(error);
        } finally {
            showLoadingApp(false);
        }
    };

    //handle data
    const loadingInit = !data && !error ? Status.LOADING : Status.DEFAULT;
    let logs: Array<LoyalPointHistoryResponseType> = [];
    let pagination = {
        page: 0,
        page_count: 0,
        page_size: 0,
        total_items: 0,
    };

    forEach(data, (value) => {
        logs = [...logs, ...value._embedded.pos_scores];
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
