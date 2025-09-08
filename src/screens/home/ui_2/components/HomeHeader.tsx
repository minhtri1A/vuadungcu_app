/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from '@rneui/themed';
import BottomSheetAddressLocation from 'components/BottomSheetAddressLocation.tsx';
import MiniCart from 'components/MiniCart';
import MiniNotify from 'components/MiniNotify';
import Text from 'components/Text';
import View from 'components/View';
import { LocationState } from 'features/address/addressSlice';
import { useNavigate, useTheme } from 'hooks';
import useConflictAutoShowModal from 'hooks/useConflictAutoShowModal';
import React, { memo, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
    Extrapolation,
    SharedValue,
    interpolate,
    useAnimatedStyle,
} from 'react-native-reanimated';
import { Path, Svg } from 'react-native-svg';

interface Props {
    initValueAnimated: SharedValue<number>;
}

const LinearGradientAnimation = Animated.createAnimatedComponent(LinearGradient);
const TouchableOpacityAnimation = Animated.createAnimatedComponent(TouchableOpacity);
// const IconAnimation = Animated.createAnimatedComponent(Icon);

const HomeHeader = memo(function HomeHeader({ initValueAnimated }: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles();
    const navigate = useNavigate();
    const { open: openInitLocation, onClose: onCLoseLocation } = useConflictAutoShowModal(
        'location',
        10000
    );
    // state
    const [locationLocal, setLocationLocal] = useState<LocationState>();

    //value

    //animation
    const h20 = theme.dimens.verticalScale(20);
    const h8 = theme.dimens.verticalScale(-8);
    const searchAnimatedStyle = useAnimatedStyle(() => ({
        width: interpolate(
            initValueAnimated.value,
            [0, 60],
            [theme.dimens.width, theme.dimens.width * 0.81],
            Extrapolation.CLAMP
        ),
        transform: [
            {
                translateY: interpolate(
                    initValueAnimated.value,
                    [0, 160],
                    [h20, h8],
                    Extrapolation.CLAMP
                ),
            },
        ],
        zIndex: 9999,
    }));
    const h90 = theme.dimens.verticalScale(90);
    const h85 = theme.dimens.verticalScale(85);
    const linerBgAnimatedStyle = useAnimatedStyle(() => {
        return {
            height: interpolate(initValueAnimated.value, [0, 80], [h90, h85], Extrapolation.CLAMP),
            overflow: 'visible',
        };
    });

    const h120 = theme.dimens.verticalScale(120);
    const h50 = -theme.dimens.verticalScale(50);
    const maskAnimatedStyle = useAnimatedStyle(() => {
        return {
            position: 'absolute',
            top: 0,
            height: h120,
            transform: [
                {
                    translateY: interpolate(
                        initValueAnimated.value,
                        [0, 80],
                        [0, h50],
                        Extrapolation.CLAMP
                    ),
                },
            ],
            width: '100%',
            zIndex: -1,
        };
    });

    const h36 = theme.dimens.verticalScale(36);
    const h42 = theme.dimens.verticalScale(42);
    const topIconAnimatedStyle = useAnimatedStyle(() => {
        return {
            top: interpolate(initValueAnimated.value, [0, 150], [h36, h42], Extrapolation.CLAMP),
        };
    });

    const addressAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(initValueAnimated.value, [0, 90], [1, 0], Extrapolation.CLAMP),
        };
    });

    //custom border
    const windowWidth = theme.dimens.width;
    const imageAspectWidth = theme.dimens.verticalScale(110);
    const imageAspectHeight = theme.dimens.verticalScale(110);
    const curveAdjustment = 40;
    const maskHeight = theme.dimens.verticalScale(90);
    const scaleFactor = imageAspectWidth / imageAspectHeight;
    const scaledHeight = scaleFactor * maskHeight;
    const controlPointX = windowWidth / 2.0;
    const controlPointY = scaledHeight + curveAdjustment;

    // effect
    useEffect(() => {
        (async () => {
            const guestAddress = await AsyncStorage.getItem('guest-address');
            if (guestAddress) {
                setLocationLocal(JSON.parse(guestAddress));
            }
        })();
    }, []);

    const handleGetAddressSuccess = (address: LocationState) => {
        if (address) {
            AsyncStorage.setItem('guest-address', JSON.stringify(address));
            setLocationLocal(address);
            showMessage({
                message: 'Cập nhật địa chỉ thành công!',
                icon: 'success',
            });
        }
    };

    return (
        <View bg={theme.colors.white_[10]} style={{ zIndex: 9999 }}>
            <LinearGradientAnimation
                style={linerBgAnimatedStyle}
                start={{ x: 0.2, y: 1 }}
                end={{ x: 0.2, y: 0 }}
                colors={theme.colors.primaryGradient}
            >
                {/* name styles.view_logoheader */}
                <Animated.View style={[styles.view_wrapHeader]}>
                    <BottomSheetAddressLocation
                        defaultLocation={locationLocal}
                        openInit={openInitLocation}
                        title="Chọn địa chỉ giao hàng"
                        triggerStyle={[styles.trigger_address, topIconAnimatedStyle]}
                        trigger={
                            <>
                                <Animated.View style={addressAnimatedStyle}>
                                    <Icon
                                        type="ionicon"
                                        name="location"
                                        size={theme.typography.size(16)}
                                        color={theme.colors.red[500]}
                                    />
                                </Animated.View>
                                <Animated.Text
                                    style={[styles.txt_address, addressAnimatedStyle]}
                                    numberOfLines={1}
                                    ellipsizeMode={'tail'}
                                >
                                    {locationLocal?.province?.name
                                        ? `${locationLocal?.ward?.name}, ${locationLocal?.district?.name}, ${locationLocal?.province?.name}`
                                        : 'Chọn địa chỉ giao hàng'}
                                </Animated.Text>
                            </>
                        }
                        onSuccess={handleGetAddressSuccess}
                        onClose={openInitLocation ? onCLoseLocation : undefined}
                    />

                    {/* left icon styles.view_listIconLeft */}
                    <Animated.View style={[styles.view_wrap_icon, topIconAnimatedStyle]}>
                        <View />
                        <View ml="small">
                            <MiniNotify />
                        </View>
                        <MiniCart />
                    </Animated.View>
                </Animated.View>

                {/* search */}
                <Animated.View style={[styles.view_search, searchAnimatedStyle]}>
                    <TouchableOpacityAnimation
                        style={[styles.touch_search]}
                        activeOpacity={1}
                        onPress={navigate.SEARCH_ROUTE}
                    >
                        <Icon
                            type="ionicon"
                            name={'search-sharp'}
                            size={theme.typography.title2}
                            color={theme.colors.black_[8]}
                            style={styles.iconSearch}
                        />
                        <Text style={styles.placeholder} numberOfLines={1}>
                            {'Tìm kiếm với Vua Dụng Cụ...'}
                        </Text>
                    </TouchableOpacityAnimation>
                </Animated.View>
            </LinearGradientAnimation>

            {/* background */}
            <Animated.View style={maskAnimatedStyle}>
                <Svg height="100%" width="100%">
                    <Path
                        d={`M0 0 L${windowWidth} 0 L${windowWidth} ${maskHeight} Q${controlPointX} ${controlPointY} 0 ${maskHeight} Z`}
                        fill={theme.colors.main['600']}
                    />
                </Svg>
            </Animated.View>
        </View>
    );
});

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        view_wrapHeader: {
            flex: 1,
            width: theme.dimens.width,
            justifyContent: 'space-between',
            flexDirection: 'row',
        },
        view_logoheader: {
            position: 'absolute',
            top: theme.dimens.verticalScale(40),
            left: 0,
            right: 0,
            zIndex: 1,
            alignItems: 'center',
        },
        txt_logoHeader: {
            // color: theme.colors.white_[10],
            // fontSize: theme.typography.title2, //
            // fontWeight: 'bold',
        },
        view_imgLogo: {
            width: '30%',
            justifyContent: 'center',
            alignItems: 'flex-end',
        },
        imgLogo: {
            width: '30%',
            height: '82%',
        },
        view_listIconLeft: {
            //flex:4,
            position: 'absolute',
            flexDirection: 'row',
            justifyContent: 'space-between',
            right: theme.spacings.large,
            width: theme.dimens.width * 0.25,
            alignItems: 'center',
            zIndex: 1,
        },

        //search
        view_search: {
            position: 'absolute',
            alignItems: 'center',
            paddingLeft: theme.spacings.medium,
            paddingRight: theme.spacings.medium,
            zIndex: -1,
            bottom: 0,
        },
        touch_search: {
            flexDirection: 'row',
            width: '100%',
            backgroundColor: theme.colors.white_[10],
            borderRadius: 10,
            paddingVertical: theme.dimens.sizeElement('md'),
            paddingHorizontal: theme.spacings.small,
            alignItems: 'center',
            shadowColor: '#686868',
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.36,
            shadowRadius: 3,

            elevation: 11,
        },
        iconSearch: {
            paddingHorizontal: theme.spacings.small,
        },

        placeholder: {
            fontSize: theme.typography.body1,
            color: theme.colors.black_[6],
        },

        trigger_address: {
            flexDirection: 'row',
            alignItems: 'center',
            height: theme.dimens.verticalScale(35),
            paddingLeft: theme.spacings.small,
            gap: 2,
            flex: 0.992,
        },
        txt_address: {
            color: theme.colors.white_[10],
            fontSize: theme.typography.body2,
            textDecorationLine: 'underline',
        },
        view_wrap_icon: {
            flexDirection: 'row',
            alignItems: 'center',
            height: theme.dimens.verticalScale(40),
            paddingRight: theme.spacings.small,
        },
    });
};

export default HomeHeader;
