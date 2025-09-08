import { Status } from 'const/index';
import { EventLoyalPointTransferSwrType, LoyalPointTransferResponseType } from 'models';
import { useState } from 'react';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';
import { sendSentryError } from 'utils/storeHelpers';

//lấy thông tin điểm tích luỹ or Xu của khách hàng
export default function useEventLoyalPointTransfer(
    option?: SWRConfiguration
): EventLoyalPointTransferSwrType {
    //hooks - su dung cuc bo cua component
    //state
    const [status, setStatus] = useState<string>(Status.DEFAULT);
    //swr
    const key = addParamsToUrl('/pos/scores/transfer', {});
    const { data, error, mutate } = useSWR<any, any>(
        key,
        () => services.customer.getLoyalPointTransfer(),
        option
    );
    //init
    const initLoading = error ? Status.ERROR : !data ? Status.LOADING : Status.SUCCESS;
    //fetch
    const putLoyalPointTransfer = async (score: string) => {
        try {
            setStatus(Status.LOADING);
            const result: LoyalPointTransferResponseType =
                await services.customer.putLoyalPointTransfer({ score });
            if (result.code && result.score_trans) {
                await mutate();
                setStatus(Status.SUCCESS);
                return result;
            }
            setStatus(Status.ERROR);
            sendSentryError(result, 'putLoyalPointTransfer');
            return null;
        } catch (e) {
            setStatus(Status.ERROR);
            sendSentryError(e, 'putLoyalPointTransfer');
            return null;
        }
    };

    return {
        data,
        status,
        initLoading,
        mutate,
        setStatus,
        putLoyalPointTransfer,
    };
}
