import { DataCreateScoreTransfer, DataEditCustomerPosInfoType } from 'models';
import { showMessage } from 'react-native-flash-message';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import showLoadingApp from 'utils/showLoadingApp';
import showMessageApp from 'utils/showMessageApp';
import { sendSentryError } from 'utils/storeHelpers';

//key:dynamic
//--addParamsToUrl('/carts/orders/detail', { orderUuid: })

export default function usePosCustomerInfoSWR(seller_uuid: string, option?: SWRConfiguration) {
    //key
    const key = `/pos/customers/${seller_uuid}`;
    //swr

    const { data, error, isValidating, isLoading, mutate } = useSWR(
        key,
        () => services.customer.getPosCustomerInfo(seller_uuid),
        option
    );

    //handle
    const editCustomerInfo = async (seller_uuid: string, data: DataEditCustomerPosInfoType) => {
        try {
            showLoadingApp(true);
            const response = await services.customer.editCustomerPosInfo(seller_uuid, data);
            if (response.code === 'SUCCESS') {
                showMessage({
                    message: 'Cập nhật thông tin cá nhân thành công!',
                    icon: 'success',
                });
                mutate();
                return true;
            }
            throw response.code;
        } catch (error) {
            showMessageApp();
            sendSentryError(error, 'editCustomerInfo');
            return false;
        } finally {
            showLoadingApp(false);
        }
    };

    const createScoreTransfer = async (seller_uuid: string, data: DataCreateScoreTransfer) => {
        try {
            showLoadingApp(true, 'Đợi khởi tạo...');
            const response = await services.customer.createScoreTransfer(seller_uuid, data);
            if (response.code === 'SUCCESS') {
                return response;
            }
            throw response.code;
        } catch (error) {
            sendSentryError(error, 'createScoreTransfer');
            showMessageApp();
            return undefined;
        } finally {
            showLoadingApp(false);
        }
    };

    return {
        posCustomer: data,
        error,
        isValidating,
        isLoading,
        mutate,
        editCustomerInfo,
        createScoreTransfer,
    };
}

export type PosCustomerInfoSWRType = ReturnType<typeof usePosCustomerInfoSWR>;
