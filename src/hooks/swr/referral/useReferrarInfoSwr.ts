/* eslint-disable react-hooks/exhaustive-deps */
import { Status } from 'const/index';
import { ReferralInfoSwrType } from 'models';
import { useEffect, useState } from 'react';
import DeviceInfo from 'react-native-device-info';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';

export default function useReferralInfoSwr(option?: SWRConfiguration): ReferralInfoSwrType {
    //key - ParamsGetReferrerInfoWithDataDevice
    const [params, setParams] = useState<any>();
    const key = addParamsToUrl('/devices/share/sharer', params);
    //value

    //swr
    const { data, error, mutate, isValidating } = useSWR<any, any>(
        key,
        () => services.customer.getReferrerInfoWithDataDevice(params),
        {
            revalidateOnMount: false,
            ...option,
        }
    );

    useEffect(() => {
        (async () => {
            const ip_internet = await services.get('https://api.ipify.org/?format=json');
            const ip_local = await DeviceInfo.getIpAddress();
            const os_name = DeviceInfo.getSystemName();
            const os_version = DeviceInfo.getSystemVersion();
            const model = DeviceInfo.getModel();

            setParams({
                ip_internet: ip_internet.ip,
                ip_local,
                os_name,
                os_version,
                model,
            });
        })();
    }, []);
    useEffect(() => {
        if (!isValidating && params?.ip_internet) {
            mutate();
        }
    }, [params]);

    const loadingInit = !data && !error ? Status.LOADING : data ? Status.SUCCESS : Status.ERROR;

    return {
        referral: data,
        error,
        mutate,
        loadingInit,
        isValidating,
    };
}
