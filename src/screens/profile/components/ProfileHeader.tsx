/* eslint-disable react-hooks/exhaustive-deps */
import FocusAwareStatusBar from 'components/FocusAwareStatusBar';
import * as RootNavigation from 'navigation/RootNavigation';
import React, { memo, useEffect, useState } from 'react';
// import Icon from 'react-native-vector-icons/Ionicons';
import Button from 'components/Button';
import IconButton from 'components/IconButton';
import ThreeDot from 'components/Spinner/ThreeDot';
import Text from 'components/Text';
import View from 'components/View';
import {
    NAVIGATION_AUTH_STACK,
    // NAVIGATION_TO_REGISTER_SCREEN,
    NAVIGATION_SETTING_STACK,
    NAVIGATION_TO_LOGIN_SCREEN,
} from 'const/routes';
import Status from 'const/status';
import { getMessage, useIsLogin, useNavigate, useTheme } from 'hooks';
import { CustomerSwrType, GiftSwrType } from 'models';
import { ActivityIndicator, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import ImagePicker, { Options } from 'react-native-image-crop-picker';
import useStyles from './../styles';
import ImageEditModal from './ImageEditModal';

interface Props {
    customersSwr: CustomerSwrType;
    giftSwr: GiftSwrType;
}

const ProfileHeader = memo(function ProfileHeader({ customersSwr, giftSwr }: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles();
    const isLogin = useIsLogin();
    const navigate = useNavigate();
    //swr
    // const { customers, status, message, updateOrAddCustomerInfo, resetState } =
    //     useCustomerSwr('image');
    //value
    const {
        customers: { fullname, image, coin },
        status,
        message,
        isValidating,
        updateOrAddCustomerInfo,
        resetState,
    } = customersSwr || {};
    const { pagination } = giftSwr || {};
    //state
    const [openEditModal, setOpenEditModal] = useState(false);
    //value
    const messageh = getMessage(message);
    const sourceImage = image ? { uri: image } : require('./../../../asset/default-user.png');

    useEffect(() => {
        if (status !== Status.DEFAULT && status !== Status.LOADING) {
            showMessage({
                message: messageh,
                type: status === Status.SUCCESS ? 'success' : 'danger',
                icon: status === Status.SUCCESS ? 'success' : 'danger',
                onHide: resetState,
            });
        }
    }, [status]);

    const goLogin = () => {
        RootNavigation.navigate(NAVIGATION_AUTH_STACK, {
            screen: NAVIGATION_TO_LOGIN_SCREEN,
        });
    };

    const goSettingScreen = () => {
        RootNavigation.navigate(NAVIGATION_SETTING_STACK);
    };

    const handleOpenEditModal = () => {
        if (!isLogin) return false;
        setOpenEditModal(true);
    };

    const toggleImagePicker = (type: string) => () => {
        const option: Options = {
            width: theme.dimens.scale(300),
            height: theme.dimens.scale(300),
            cropping: true,
            useFrontCamera: true,
            cropperToolbarTitle: 'Thay đổi ảnh đại diện',
            cropperCircleOverlay: true,
            showCropGuidelines: false,
            mediaType: 'photo',
            includeBase64: true,
        };
        if (type === 'album') {
            ImagePicker.openPicker(option)
                .then((image) => {
                    let imageData = `data:${image.mime};base64,${image.data}`;
                    handleUpdateImage(imageData);
                })
                .catch((e) => {
                    if (e.code !== 'E_PICKER_CANCELLED') {
                    }
                });
        }
        if (type === 'camera') {
            ImagePicker.openCamera(option)
                .then((image) => {
                    let imageData = `data:${image.mime};base64,${image.data}`;
                    handleUpdateImage(imageData);
                })
                .catch((e) => {
                    if (e.code !== 'E_PICKER_CANCELLED') {
                    }
                });
        }
    };

    const handleUpdateImage = async (data: any) => {
        setOpenEditModal(false);
        updateOrAddCustomerInfo('image', { image: data });
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
    };

    return (
        <>
            <FocusAwareStatusBar
                translucent={true}
                backgroundColor={'transparent'}
                barStyle={'light-content'}
            />
            <ImageBackground
                source={require('./../../../asset/img_bg_profile.png')}
                style={styles.headerProfile}
            >
                {/* top */}
                <View style={styles.view_header_top}>
                    <Text size={'body3'} color={theme.colors.white_[10]} fw="bold">
                        Cá nhân
                    </Text>
                    <View style={styles.view_top_icon}>
                        {isLogin ? (
                            <IconButton
                                type="material-community"
                                name="image-edit-outline"
                                size={theme.typography.size(22)}
                                color={theme.colors.white_[10]}
                                mr={'medium'}
                                onPress={handleOpenEditModal}
                            />
                        ) : null}
                        {isLogin && (
                            <IconButton
                                type="ionicon"
                                name="settings"
                                size={theme.typography.size(22)}
                                color={theme.colors.white_[10]}
                                onPress={goSettingScreen}
                            />
                        )}
                    </View>
                </View>
                {/* body */}
                <View style={styles.view_header_body}>
                    {status === Status.LOADING ? (
                        <View style={styles.image_loading}>
                            <ActivityIndicator
                                color={theme.colors.main['600']}
                                size={theme.typography.size(30)}
                            />
                        </View>
                    ) : null}
                    <TouchableOpacity onPress={handleOpenEditModal}>
                        <Image source={sourceImage} style={styles.image_User} />
                        {/* edit image */}
                        {/* {isLogin ? (
                            <View style={styles.view_iconEditImage}>
                                <Icon
                                    type="material"
                                    name="edit"
                                    size={theme.typography.size(15)}
                                    color={theme.colors.white_[10]}
                                />
                            </View>
                        ) : null} */}
                    </TouchableOpacity>

                    {isValidating && status === Status.DEFAULT ? (
                        <ThreeDot
                            size={theme.typography.size(10)}
                            color={theme.colors.white_[10]}
                        />
                    ) : (
                        <Text size="body3" fw="bold" color={theme.colors.white_[10]} mt="small">
                            {isLogin ? `${fullname}` : 'Chưa đăng nhập'}
                        </Text>
                    )}
                </View>
                {/* bottom */}
                {isLogin ? (
                    <View style={styles.view_header_bottom}>
                        <TouchableOpacity onPress={navigate.COIN_ROUTE}>
                            <Text
                                fw="bold"
                                ta="center"
                                color={theme.colors.white_[10]}
                                size={'body2'}
                            >
                                {coin || 0}
                            </Text>
                            <Text ta="center" color={theme.colors.white_[10]}>
                                Xu dụng cụ
                            </Text>
                        </TouchableOpacity>
                        <Text color={theme.colors.white_[10]}>|</Text>
                        <TouchableOpacity onPress={navigate.GIFT_ROUTE}>
                            <Text
                                fw="bold"
                                ta="center"
                                color={theme.colors.white_[10]}
                                size={'body2'}
                            >
                                {pagination.total_items || 0}
                            </Text>
                            <Text ta="center" color={theme.colors.white_[10]}>
                                Quà tặng
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View mb={'medium'} aI="center">
                        <Button
                            title={'Đăng nhập'}
                            onPress={goLogin}
                            color={theme.colors.main['600']}
                            bgColor={theme.colors.white_[10]}
                            containerWidth={theme.dimens.scale(200)}
                        />
                    </View>
                )}
            </ImageBackground>
            {/* modal */}
            <ImageEditModal open={openEditModal} handleCloseEditModal={handleCloseEditModal}>
                <IconButton
                    type="ionicon"
                    name="image-outline"
                    size={theme.typography.size(30)}
                    width={theme.typography.size(50)}
                    ratio={1}
                    variant="solid"
                    onPress={toggleImagePicker('album')}
                    mr="medium"
                />
                <IconButton
                    type="ionicon"
                    name="camera-outline"
                    size={theme.typography.size(30)}
                    width={theme.typography.size(50)}
                    ratio={1}
                    onPress={toggleImagePicker('camera')}
                    variant="solid"
                />
            </ImageEditModal>
        </>
    );
});

export default ProfileHeader;
