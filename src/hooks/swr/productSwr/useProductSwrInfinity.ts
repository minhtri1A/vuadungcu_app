import { Message, Status } from 'const/index';
import { forEach } from 'lodash';
import { ParamsGetProductType, ProductListItemType, ProductSwrInfinityType } from 'models';
import { useState } from 'react';
import { services } from 'services';
import { SWRConfiguration } from 'swr';
import useSWRInfinite from 'swr/infinite';
import { addParamsToUrl } from 'utils/helpers';

export default function useProductSwrInfinity(
    params?: ParamsGetProductType,
    option?: SWRConfiguration
): ProductSwrInfinityType {
    //hooks
    const [message, setMessage] = useState(Message.NOT_MESSAGE);
    //key
    // const key = addParamsToUrl('/products', {...params, page:});
    // console.log('key get product infinity swr ', key);
    //swr
    const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite<any, any>(
        (index) => {
            const key = `${addParamsToUrl('/products', { ...params, page: index + 1 })}`;
            return key;
        },
        (url) => services.get(url),
        { dedupingInterval: 3600 * 60, revalidateFirstPage: false, ...option }
    );
    //handle data
    const loadingInit = !data && !error ? Status.LOADING : Status.DEFAULT;

    let products: Array<ProductListItemType> = [];
    let pagination = {
        page: 0,
        page_count: 0,
        page_size: 0,
        total_items: 0,
    };

    forEach(data, (value) => {
        products = [...products, ...(value._embedded?.products || [])];
        pagination = {
            page: value.page,
            page_count: value.page_count,
            page_size: value.page_size,
            total_items: value.total_items,
        };
    });

    return {
        data,
        products,
        pagination,
        size,
        setSize,
        mutate,
        loadingInit,
        isValidating,
        message,
        setMessage,
    };
}
