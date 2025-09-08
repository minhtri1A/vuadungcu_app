import AsyncStorage from '@react-native-async-storage/async-storage';
import { SET_NUM_SPIN_ATTENDANCE_MODAL } from 'features/action';
import {
    SET_CHECK_SHOW_MODAL_REQUEST_ADDRESS,
    SET_CURRENT_AUTO_SHOW_MODAL,
} from 'features/apps/appsSlice';
import { useEffect, useState } from 'react';
import useSpinAttendanceSwr from './swr/spinSwr/useSpinAttendanceSwr';
import { useAppDispatch, useAppSelector } from './useCommon';

const DISPLAY_ORDER = ['location', 'spin'];

const NUM_OPEN_SPIN_MODAL = 2;

const useConflictAutoShowModal = (type: 'location' | 'spin', delay = 0) => {
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const isAppStart = useAppSelector((state) => state.apps.isAppStart);
    const currentShowIndex = useAppSelector((state) => state.apps.currentShowIndexAutoModal);

    //spin
    const { data } = useSpinAttendanceSwr({}, type !== 'spin');
    const numOpenModalAttendance = useAppSelector((state) => state.apps.numOpenModalAttendance);

    //location
    const finishGetLocation = useAppSelector((state) => state.apps.address.finishGetLocation);
    const isShowModalRequest = useAppSelector((state) => state.apps.isShowModalRequestAddress);

    // spin
    useEffect(() => {
        if (type === 'spin' && DISPLAY_ORDER.indexOf(type) === currentShowIndex && isAppStart) {
            if (
                data &&
                data?.spin?.active === 'Y' &&
                data?.customer?.code !== 'CUSTOMER_SPUN' &&
                numOpenModalAttendance <= NUM_OPEN_SPIN_MODAL
            ) {
                const timeout = setTimeout(() => {
                    setOpen(true);
                    dispatch(SET_NUM_SPIN_ATTENDANCE_MODAL(numOpenModalAttendance + 1));
                    clearTimeout(timeout);
                }, delay);
                return;
            }

            if (data) {
                dispatch(SET_CURRENT_AUTO_SHOW_MODAL(DISPLAY_ORDER.indexOf(type) + 1));
            }
        }
    }, [data, currentShowIndex]);

    // location
    useEffect(() => {
        if (
            type === 'location' &&
            DISPLAY_ORDER.indexOf(type) === currentShowIndex &&
            isAppStart &&
            finishGetLocation
        ) {
            (async () => {
                const guestAddress = await AsyncStorage.getItem('guest-address');
                if (!guestAddress) {
                    // check chi show 1 lan khi mo app
                    if (isShowModalRequest) {
                        const timeout = setTimeout(() => {
                            setOpen(true);
                            dispatch(SET_CHECK_SHOW_MODAL_REQUEST_ADDRESS(false));
                            clearTimeout(timeout);
                        }, delay);
                    }
                    return;
                }
                dispatch(SET_CURRENT_AUTO_SHOW_MODAL(DISPLAY_ORDER.indexOf(type) + 1));
            })();
        }
    }, [isAppStart, currentShowIndex, finishGetLocation]);

    const onClose = () => {
        setOpen(false);
        dispatch(SET_CURRENT_AUTO_SHOW_MODAL(DISPLAY_ORDER.indexOf(type) + 1));
    };

    return {
        open,
        onClose,
    };
};

export default useConflictAutoShowModal;
