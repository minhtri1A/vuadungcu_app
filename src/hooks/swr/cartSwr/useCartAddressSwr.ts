import { useIsLogin } from 'hooks/useCommon';
import { isEmpty } from 'lodash';
import { DataPutCartAddressType } from 'models';
import { showMessage } from 'react-native-flash-message';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import showLoadingApp from 'utils/showLoadingApp';
import showMessageApp from 'utils/showMessageApp';

export default function useCartAddressSwr(type: 'shipping' | 'billing', option?: SWRConfiguration) {
    //key
    const isLogin = useIsLogin();
    const { data, error, mutate, isValidating } = useSWR(
        isLogin ? `cart-address/${type}` : null,
        () => services.customer.getCartAddress(type),
        option
    );

    //kiem tra xem du lieu duoc fetch lan dau chua
    const initFetch = data || error ? true : false;

    //update or create cart address
    const putCartAddress = async (
        user_address: DataPutCartAddressType,
        type: 'shipping' | 'billing',
        showLoading = true
    ) => {
        try {
            showLoading && showLoadingApp(true);
            const result = await services.customer.putCartAddress(type, user_address);
            if (isEmpty(result?.code)) {
                showLoading &&
                    showMessage({
                        message:
                            type === 'shipping'
                                ? 'Cập nhật địa chỉ giao hàng thành công!'
                                : 'Cập nhật thông tin hoá đơn thành công!',
                        icon: 'success',
                    });
                await mutate({ ...data, ...(user_address as any) }, true);
                return true;
            }
            throw result?.code;
        } catch (e: any) {
            showLoading && showMessageApp(e);
            return false;
        } finally {
            showLoading && showLoadingApp(false);
        }
    };
    return {
        cartAddress: data?.address_uuid ? data : data?.code ? null : undefined,
        error,
        mutate,
        putCartAddress,
        initFetch,
        isValidating,
    };
}

export type CartAddressSWRType = ReturnType<typeof useCartAddressSwr>;
