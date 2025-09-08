import BottomSheet from 'components/BottomSheet';
import Text from 'components/Text';
import View from 'components/View';
import React, { memo } from 'react';
import useStyles from '../styles';

interface Props {
    open?: boolean;
    handleCloseEditModal(): any;
    children: React.ReactNode;
}

export default memo(function EditModal({ open, handleCloseEditModal, children }: Props) {
    //hooks
    // const { theme } = useTheme();
    const styles = useStyles();

    return (
        <BottomSheet
            isVisible={open}
            radius
            onBackdropPress={handleCloseEditModal}
            triggerOnClose={handleCloseEditModal}
        >
            <View style={styles.view_titleButtonClose}>
                <Text fw="bold" ta="center" flex={1} mb="medium">
                    Chỉnh sửa ảnh đại diện
                </Text>
            </View>
            <View w="100%" flexDirect="row">
                {children}
            </View>
        </BottomSheet>
    );
});
