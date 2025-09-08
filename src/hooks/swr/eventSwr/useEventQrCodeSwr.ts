import { Message, Status } from 'const/index';
import {
    ActionTypeGetEventQrCode,
    EventQrCodeConfigResponseType,
    EventQrCodeInfoResponseType,
    EventQrCodeSwrType,
} from 'models';
import { useState } from 'react';
import { services } from 'services';
import useSWR, { SWRConfiguration, useSWRConfig } from 'swr';
import { addParamsToUrl } from 'utils/helpers';

/*
 *Get event qr code: info, score, config
 *Type T is: EventQrCodeConfigResponseType | EventQrCodeInfoResponseType EventQrCodeScoreResponseType
 * info: lấy thông tin về sự kiện của khách hàng
 * score: lấy điểm tích luỹ qr của khách hàng
 * config: lấy các cấu hình sự kiện qr
 */
export default function useEventQrCodeSwr<
    T extends EventQrCodeConfigResponseType | EventQrCodeInfoResponseType
>(action: ActionTypeGetEventQrCode, option?: SWRConfiguration): EventQrCodeSwrType<T> {
    //hooks
    const [status, setStatus] = useState<string>(Status.DEFAULT);
    const [message, setMessage] = useState(Message.NOT_MESSAGE);
    const [qrScanScore, setQrScanScore] = useState<any>(null);
    //swr
    const { mutate: mutateConfig } = useSWRConfig();
    //key:/event/qr-scan?action=info
    const key = addParamsToUrl('/event/qr-scan', { action });
    const { data, error, isValidating, mutate } = useSWR<any, any>(
        key,
        () => services.customer.getEventQrCode(action),
        {
            ...option,
        }
    );
    //status
    const loadingInit = !data && !error ? Status.LOADING : data ? Status.SUCCESS : Status.ERROR;
    // console.log('data swr qr code ', data);

    const checkQrCodeAndUpdateQrScore = async (qr_code: string) => {
        setStatus(Status.LOADING);
        try {
            const result = await services.customer.checkQrCodeAndUpdateQrScore(qr_code);
            switch (result.code) {
                case 'SUCCESS':
                    setMessage(Message.EVENT_QR_CODE_SUCCESS);
                    setStatus(Status.SUCCESS);
                    setQrScanScore(result.qr_scan_score);
                    mutateConfig(addParamsToUrl('/event/qr-scan', { action: 'info' }));
                    return;
                case Message.NOT_ENOUGH_TIME:
                    setMessage(Message.NOT_ENOUGH_TIME);
                    break;
                case Message.INVALID_QR_CODE:
                    setMessage(Message.INVALID_QR_CODE);
                    break;
                default:
                    setMessage(Message.EVENT_QR_CODE_FAILED);
            }
            setStatus(Status.ERROR);
        } catch (e) {
            setStatus(Status.ERROR);
            setMessage(Message.SYSTEMS_ERROR);
        }
    };

    const resetState = () => {
        setMessage(Message.NOT_MESSAGE);
        setStatus(Status.DEFAULT);
        setQrScanScore(null);
    };

    return {
        data,
        qrScanScore,
        loadingInit,
        isValidating,
        status,
        message,
        mutate,
        setStatus,
        setMessage,
        resetState,
        checkQrCodeAndUpdateQrScore,
    };
}
