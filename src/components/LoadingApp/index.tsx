/* eslint-disable react-hooks/exhaustive-deps */
import Loading from 'components/Loading';
import { useAppSelector } from 'hooks';
import React from 'react';

// xử lý loading xử lý dữ liệu và kích hoạt thông báo flash message
export default function LoadingApp() {
    //hook
    const loading = useAppSelector((state) => state.apps.loadingApp);
    const title = useAppSelector((state) => state.apps.titleLoadingApp);

    return (
        <>
            <Loading visible={loading} text={title} />
        </>
    );
}
