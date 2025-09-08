import { Status } from 'const/index';
import { forEach } from 'lodash';
import { GiftCustomerResponseType, GiftSwrInfinityType, ParamsGetListGiftCustomer } from 'models';
import { services } from 'services';
import { SWRConfiguration } from 'swr';
import useSWRInfinite from 'swr/infinite';
import { addParamsToUrl } from 'utils/helpers';

export default function useGiftSwrInfinity(
    params?: ParamsGetListGiftCustomer,
    option?: SWRConfiguration
): GiftSwrInfinityType {
    //hooks

    //key
    // const key = addParamsToUrl('/products', {...params, page:});
    // console.log('key get product infinity swr ', key);
    //swr
    const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite<any, any>(
        (index) => {
            const key = `${addParamsToUrl('/gifts', {
                ...params,
                page: index + 1,
                page_size: 10,
            })}`;
            return key;
        },
        (url) => services.get(url),
        option
    );
    //handle data
    const loadingInit = !data && !error ? Status.LOADING : Status.DEFAULT;

    let gift: Array<GiftCustomerResponseType> = [];
    let pagination = {
        page: 0,
        page_count: 0,
        page_size: 0,
        total_items: 0,
    };

    forEach(data, (value) => {
        gift = [...gift, ...(value?._embedded?.gifts || [])];
        pagination = {
            page: value?.page,
            page_count: value?.page_count,
            page_size: value?.page_size,
            total_items: value?.total_items,
        };
    });

    return {
        data,
        gift,
        pagination,
        size,
        setSize,
        mutate,
        loadingInit,
        isValidating,
    };
}
