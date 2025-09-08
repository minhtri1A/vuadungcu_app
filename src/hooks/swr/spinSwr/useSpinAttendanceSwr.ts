import { Status } from 'const/index';
import { useAppSelector } from 'hooks/useCommon';
import { SpinAttendanceSwrType } from 'models';
import { services } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
import { addParamsToUrl } from 'utils/helpers';

//key_unique: swr se tu dong render lai tat ca component goi den no khi no fetch api
//set key_unique neu muon component su dung swr nay khong bi render boi component khac

export default function useSpinAttendanceSwr(
    option?: SWRConfiguration,
    disable?: boolean
): SpinAttendanceSwrType {
    const key = '/spins/attendance';
    const isAppStart = useAppSelector((state) => state.apps.isAppStart);

    const { data, error, mutate, isValidating } = useSWR<any, any>(
        isAppStart && !disable ? key : null,
        () => services.customer.getSpinAttendance(),
        {
            ...option,
        }
    );
    const loadingInit = !data && !error ? Status.LOADING : data ? Status.SUCCESS : Status.ERROR;

    return {
        data: data,
        error,
        mutate,
        loadingInit,
        isValidating,
    };
}
