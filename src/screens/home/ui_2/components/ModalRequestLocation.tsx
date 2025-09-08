/* eslint-disable react-hooks/exhaustive-deps */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from '@rneui/themed';
import BottomSheetAddressLocation from 'components/BottomSheetAddressLocation.tsx';
import Text from 'components/Text';
import View from 'components/View';
import { LocationState } from 'features/address/addressSlice';
import { SET_CHECK_SHOW_MODAL_REQUEST_ADDRESS } from 'features/apps/appsSlice';
import { useAppDispatch, useAppSelector, useTheme } from 'hooks';
import { useRequestLocation } from 'hooks/useRequestLocation';
import React, { memo, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Modal from 'react-native-modal';
import { themeType } from 'theme';
/*
// type: xác định kiểu hiển thị alert
//- default: color primarycor - ntl icon
//- custom: thêm colorCustom và iconCustomProps để chỉnh màu sắc và icon của alert
*/

interface IProps {
    trigger: React.ReactNode;
    triggerStyle: StyleProp<ViewStyle>;
    onSuccess: (address: LocationState) => void;
}

export default memo(function ModalRequestLocation({ trigger, triggerStyle, onSuccess }: IProps) {
    //hôk
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const [visible, setVisible] = useState(false);
    const dispatch = useAppDispatch();
    const { vdcLocation, requestLocationPermission, loadingRequestLocation } = useRequestLocation();
    // state
    const isShowModalRequest = useAppSelector((state) => state.apps.isShowModalRequestAddress);
    const isAppStart = useAppSelector((state) => state.apps.isAppStart);
    // animation
    const TouchableOpacityAnimation = Animated.createAnimatedComponent(TouchableOpacity);

    //effect
    useEffect(() => {
        if (isAppStart) {
            (async () => {
                const guestAddress = await AsyncStorage.getItem('guest-address');
                if (!guestAddress) {
                    // check chi show 1 lan khi mo app
                    if (isShowModalRequest) {
                        const timeout = setTimeout(() => {
                            setVisible(true);
                            dispatch(SET_CHECK_SHOW_MODAL_REQUEST_ADDRESS(false));
                            clearTimeout(timeout);
                        }, 2000);
                    }
                    return;
                }
                onSuccess(JSON.parse(guestAddress));
            })();
        }
    }, [isAppStart]);

    useEffect(() => {
        if (vdcLocation) {
            handleGetAddressSuccess(vdcLocation);
        }
    }, [vdcLocation]);

    //handle
    const visibleModal = () => {
        setVisible((pre) => !pre);
    };

    const handleGetAddressSuccess = (address: LocationState) => {
        if (address) {
            AsyncStorage.setItem('guest-address', JSON.stringify(address));

            onSuccess(address);
            setVisible(false);
            showMessage({
                message: 'Cập nhật địa chỉ thành công!',
                icon: 'success',
            });
        }
    };

    return (
        <>
            <TouchableOpacityAnimation
                style={triggerStyle}
                onPress={visibleModal}
                activeOpacity={0.6}
            >
                {trigger}
            </TouchableOpacityAnimation>
            <Modal isVisible={visible} onBackdropPress={visibleModal} useNativeDriver={true}>
                <View bg={theme.colors.white_[10]} style={styles.view_container}>
                    <Text ta="center" size={'body2'} fw="bold">
                        Chọn địa chỉ giao hàng
                    </Text>
                    {/* request */}
                    <TouchableOpacity
                        style={styles.touch_request}
                        activeOpacity={0.7}
                        onPress={requestLocationPermission}
                    >
                        {loadingRequestLocation ? (
                            <View>
                                <ActivityIndicator
                                    size={theme.typography.size(30)}
                                    color={theme.colors.grey_[200]}
                                />
                            </View>
                        ) : (
                            <Icon
                                type="material"
                                name="my-location"
                                color={theme.colors.main[500]}
                                size={theme.typography.size(30)}
                            />
                        )}

                        <View>
                            <Text fw="bold">Vị trí hiện tại</Text>
                            <Text color={theme.colors.grey_[400]} size={'sub3'}>
                                Vua dụng cụ lấy vị trí hiện tại
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {/* select */}
                    <BottomSheetAddressLocation
                        trigger={
                            <>
                                <Icon
                                    type="material"
                                    name="add-location-alt"
                                    color={theme.colors.green[500]}
                                    size={theme.typography.size(30)}
                                />
                                <View>
                                    <Text fw="bold">Thêm vị trí mới</Text>
                                    <Text color={theme.colors.grey_[400]} size={'sub3'}>
                                        Nhấn vào để chọn địa chỉ
                                    </Text>
                                </View>
                            </>
                        }
                        triggerStyle={styles.trigger_sheet_location}
                        onSuccess={(address) => handleGetAddressSuccess(address)}
                    />
                </View>
            </Modal>
        </>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_container: {
            minHeight: theme.dimens.height * 0.1,
            position: 'relative',
            borderRadius: 10,
            padding: theme.spacings.medium,
            gap: theme.spacings.medium,
        },
        touch_request: {
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: theme.colors.grey_[100],
            borderRadius: 5,
            padding: theme.spacings.medium,
            gap: theme.spacings.small,
        },
        trigger_sheet_location: {
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: theme.colors.grey_[100],
            borderRadius: 5,
            padding: theme.spacings.medium,
            gap: theme.spacings.small,
        },
    });
