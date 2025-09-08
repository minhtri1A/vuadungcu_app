import { forEach } from 'lodash';
import { PostListType } from 'models';
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
export default function usePosListSWRInfinite(option?: SWRConfiguration) {
    //hooks
    //key
    // const key = addParamsToUrl('/products', {...params, page:});
    // console.log('key get product infinity swr ', key);
    //swr
    const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite<any, any>(
        (index) => {
            const key = `${addParamsToUrl('/pos/connects', {
                page: index + 1,
            })}`;
            return key;
        },
        (url) => services.get(url),
        { dedupingInterval: 3600 * 60, ...option }
    );

    // handle
    const handleConnectCustomerWebAndPos = (seller_uuid: string) => async () => {
        try {
            showLoadingApp(true, 'Đang liên kết...');
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

    let posList: Array<PostListType[0]> = [];
    let pagination = {
        page: 0,
        page_count: 0,
        page_size: 0,
        total_items: 0,
    };

    forEach(data, (value) => {
        posList = [...posList, ...(value?._embedded?.pos_connects || [])];
        pagination = {
            page: value.page,
            page_count: value.page_count,
            page_size: value.page_size,
            total_items: value.total_items,
        };
    });

    return {
        posList,
        pagination,
        size,
        setSize,
        mutate,
        isValidating,
        handleConnectCustomerWebAndPos,
    };
}

export type OrderPosSwrInfinityType = ReturnType<typeof usePosListSWRInfinite>;
