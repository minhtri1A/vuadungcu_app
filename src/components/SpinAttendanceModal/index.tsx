/* eslint-disable react-hooks/exhaustive-deps */

import IconButton from 'components/IconButton';
import Image from 'components/Image';
import Touch from 'components/Touch';
import { useNavigate, useTheme } from 'hooks';
import useConflictAutoShowModal from 'hooks/useConflictAutoShowModal';
import React, { memo } from 'react';
import Modal from 'react-native-modal';

interface IProps {
    // refresh: boolean;
}

export default memo(function SpinAttendanceModal({}: IProps) {
    //hôk
    const { theme } = useTheme();
    const navigate = useNavigate();

    const { open, onClose } = useConflictAutoShowModal('spin', 5000);

    return (
        <Modal
            isVisible={open}
            backdropColor={'rgba(0, 0, 0, 0.95)'}
            onBackdropPress={onClose}
            useNativeDriver={true}
        >
            <Touch
                ratio={1}
                onPress={() => {
                    onClose();
                    navigate.SPIN_ATTENDANCE_ROUTE();
                }}
                activeOpacity={0.7}
            >
                <Image source={require('asset/img_spin_attendance.png')} resizeMode="contain" />
                <IconButton
                    type="ionicon"
                    name="close-sharp"
                    color="red"
                    size={theme.typography.size(40)}
                    style={{ position: 'absolute', right: 0 }}
                    onPress={onClose}
                />
            </Touch>
        </Modal>
    );
});
