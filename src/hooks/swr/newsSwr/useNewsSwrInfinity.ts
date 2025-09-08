import { Message, Status } from 'const/index';
import { forEach } from 'lodash';
import { NewsItemType } from 'models';
import { useState } from 'react';
import { services } from 'services';
import { SWRConfiguration } from 'swr';
import useSWRInfinite from 'swr/infinite';
import { addParamsToUrl } from 'utils/helpers';

export default function useNewsSwrInfinity(
    params?: {
        type?: 'new' | 'most_viewed';
        page_size?: number;
        category_uuid?: string;
    },
    option?: SWRConfiguration
) {
    //hooks
    const [status, setStatus] = useState(Status.DEFAULT);
    const [message, setMessage] = useState(Message.NOT_MESSAGE);
    //swr
    const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite<any, any>(
        (index) => {
            return addParamsToUrl('/news', { ...params, page: index + 1 });
        },
        (url) => services.get(url),
        option
    );
    //handle data
    const loadingInit = !data && !error ? Status.LOADING : Status.DEFAULT;
    let news: Array<NewsItemType> = [];
    let pagination = {
        page: 0,
        page_count: 0,
        page_size: 0,
        total_items: 0,
    };
    forEach(data, (value) => {
        news = [...news, ...value._embedded.news];
        pagination = {
            page: value.page,
            page_count: value.page_count,
            page_size: value.page_size,
            total_items: value.total_items,
        };
    });

    return {
        news,
        pagination,
        size,
        setSize,
        mutate,
        loadingInit,
        isValidating,
        message,
        setStatus,
        setMessage,
    };
}

export type NewsSwrInfinityType = ReturnType<typeof useNewsSwrInfinity>;
