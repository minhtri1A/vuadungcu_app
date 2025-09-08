import { Status } from 'const/index';
import {
    ActionTypeGetEventCoinType,
    EventCoinConfigResponseType,
    EventCoinInfoResponseType,
    EventCoinSwrType,
} from 'models';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';

/*
 *Get event qr code: info, score, config
 *Type T is: EventQrCodeConfigResponseType | EventQrCodeInfoResponseType EventQrCodeScoreResponseType
 * info: lấy thông tin về sự kiện của khách hàng
 * score: lấy điểm tích luỹ qr của khách hàng
 * config: lấy các cấu hình sự kiện qr
 */
export default function useEventCoinSwr<
    T extends EventCoinInfoResponseType | EventCoinConfigResponseType
>(action: ActionTypeGetEventCoinType, option?: SWRConfiguration): EventCoinSwrType<T> {
    //hooks
    //swr
    //key:/event/coin?action=info
    const key = addParamsToUrl('/event/coin', { action });
    const { data, error, isValidating, mutate } = useSWR<any, any>(
        key,
        () => services.customer.getEventCoin(action),
        {
            ...option,
        }
    );
    //status
    const loadingInit = !data && !error ? Status.LOADING : data ? Status.SUCCESS : Status.ERROR;

    return {
        data,
        loadingInit,
        isValidating,
        mutate,
    };
}
