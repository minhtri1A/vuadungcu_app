import AsyncStorage from '@react-native-async-storage/async-storage';
import { Status } from 'const/index';
import { LocationState } from 'features/address/addressSlice';
import { useNavigation } from 'hooks/useCommon';
import { isEmpty } from 'lodash';
import {
    DataCreateCustomerAddressType,
    DataUpdateCustomerAddressType,
    ParamsGetListCustomerAddressType,
} from 'models';
import { showMessage } from 'react-native-flash-message';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';
import showLoadingApp from 'utils/showLoadingApp';
import showMessageApp from 'utils/showMessageApp';
import { sendSentryError } from 'utils/storeHelpers';

/*
 * Lấy danh sách địa chỉ của khách hàng
 */
export default function useCustomerAddress(
    params?: ParamsGetListCustomerAddressType,
    option?: SWRConfiguration
) {
    //hook
    const navigation = useNavigation();
    //swr
    const key = addParamsToUrl('product', params);
    const { data, error, mutate } = useSWR(
        key,
        () => services.customer.getListCustomerAddress(params),
        option
    );

    const initStatus = error ? Status.ERROR : !data ? Status.LOADING : Status.SUCCESS;

    const createCustomerAddress = async (
        data_: DataCreateCustomerAddressType,
        location?: LocationState,
        isGoBack = true,
        showLoading = true
    ) => {
        try {
            showLoading && showLoadingApp(true, 'Đang xử lý...');
            const result = await services.customer.createCustomerAddress(data_);
            if (isEmpty(result.code) && result.firstname) {
                showLoading &&
                    showMessage({
                        message: 'Thêm mới địa chỉ thành công!',
                        icon: 'success',
                    });
                mutate();
                // check if empty guest address -> set guest adress
                const guestAddress = await AsyncStorage.getItem('guest-address');
                if (!guestAddress && location) {
                    AsyncStorage.setItem('guest-address', JSON.stringify(location));
                }
                isGoBack && navigation.goBack();
                return;
            }
            throw result.code;
        } catch (e: any) {
            sendSentryError(e, 'createCustomerAddress');
            showLoading && showMessageApp(e);
        } finally {
            showLoading && showLoadingApp(false);
        }
    };

    const updateCustomerAddress = async (
        address_uuid: string,
        data_: DataUpdateCustomerAddressType,
        isGoBack = true,
        showLoading = true
    ) => {
        try {
            showLoading && showLoadingApp(true);
            const result = await services.customer.updateCustomerAddress(address_uuid, data_);
            if (isEmpty(result.code)) {
                showLoading &&
                    showMessage({
                        message: 'Cập nhật địa chỉ thành công!',
                        icon: 'success',
                    });
                mutate();
                isGoBack && navigation.goBack();
                return;
            }

            throw result.code;
        } catch (e: any) {
            showLoading && showMessageApp(e);
        } finally {
            showLoading && showLoadingApp(false);
        }
    };

    const deleteCustomerAddress = async (address_uuid: string) => {
        try {
            showLoadingApp(true);
            const result = await services.customer.deleteCustomerAddress(address_uuid);
            if (isEmpty(result.code)) {
                showMessage({
                    message: 'Xoá địa chỉ thành công!',
                    icon: 'success',
                });
                mutate();
                return;
            }
            throw result.code;
        } catch (e: any) {
            sendSentryError(e, 'deleteCustomerAddress');
            showMessageApp(e);
        } finally {
            showLoadingApp(false);
        }
    };

    return {
        listCustomerAddress: data?._embedded?.address || [],
        currentPage: data?.page,
        pageCount: data?.page_count,
        totalItems: data?.total_items,
        initStatus,
        error,
        mutate,
        //
        createCustomerAddress,
        updateCustomerAddress,
        deleteCustomerAddress,
    };
}

export type CustomerAddressSWRType = ReturnType<typeof useCustomerAddress>;
