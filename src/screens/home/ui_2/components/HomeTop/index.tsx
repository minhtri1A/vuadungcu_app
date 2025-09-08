/* eslint-disable react-hooks/exhaustive-deps */
import { Icon } from '@rneui/themed';
import DeepLink from 'components/DeepLink';
import Image from 'components/Image';
import Text from 'components/Text';
import View from 'components/View';
import { Slide } from 'const/index';
import { useNavigate, useSlideSwr, useTheme } from 'hooks';
import useSpinAttendanceSwr from 'hooks/swr/spinSwr/useSpinAttendanceSwr';
import React, { memo, useEffect } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';
import { getSlideImage, isEmpty } from 'utils/helpers';

interface Props {
    refreshControl: boolean;
    isAppStart: boolean;
}

const HomeTop = memo(
    function HomeTop({ refreshControl, isAppStart }: Props) {
        //hooks
        const { theme } = useTheme();
        const styles = useStyles();
        const navigate = useNavigate();
        //swr
        const {
            slides: mainSlides,
            isLoading: isLoadingSlide,
            mutate: mutateMainSlide,
        } = useSlideSwr(
            {
                group: Slide.HOME_MAIN_BANNER,
            },
            { revalidateOnMount: false },
            3600
        );
        const { data, mutate: mutateSpin } = useSpinAttendanceSwr({ revalidateOnMount: false });
        //value
        const iconSize = 24;
        const colors1 = [theme.colors.blue[700], theme.colors.blue[400]];
        const colors2 = [theme.colors.green[700], theme.colors.green[400]];
        const colors3 = [theme.colors.red[700], theme.colors.red[400]];
        const colors4 = [theme.colors.main[700], theme.colors.main[400]];
        const colors5 = [theme.colors.teal[700], theme.colors.teal[400]];

        // effect
        //--fetch init
        useEffect(() => {
            if (isAppStart) {
                mutateMainSlide();
                mutateSpin();
            }
        }, [isAppStart]);
        //--refresh control
        useEffect(() => {
            if (refreshControl && isAppStart) {
                mutateMainSlide();
                mutateSpin();
            }
        }, [refreshControl, isAppStart]);

        //render
        const renderIconItem = () => (
            <>
                {/* category */}
                <View style={styles.view_icon}>
                    <TouchableOpacity activeOpacity={0.9} onPress={navigate.CATEROGIES_ROUTE()}>
                        <LinearGradient
                            style={styles.liner_icon_category}
                            start={{ x: 1, y: 1 }}
                            end={{ x: 0.1, y: 0.1 }}
                            colors={colors4}
                        >
                            <Icon
                                type="ionicon"
                                name="layers"
                                color={theme.colors.white_[10]}
                                size={theme.typography.size(iconSize)}
                            />
                        </LinearGradient>
                    </TouchableOpacity>
                    <Text size={'sub2'} mt="tiny" color={theme.colors.black_[10]}>
                        Danh mục
                    </Text>
                </View>
                {/* brand */}
                <View style={styles.view_icon}>
                    <TouchableOpacity activeOpacity={0.9} onPress={navigate.BRANDS_ROUTE()}>
                        <LinearGradient
                            style={styles.liner_icon_category}
                            start={{ x: 1, y: 1 }}
                            end={{ x: 0.1, y: 0.1 }}
                            colors={colors5}
                        >
                            <Icon
                                type="material-community"
                                name="check-decagram"
                                color={theme.colors.white_[10]}
                                size={theme.typography.size(iconSize)}
                            />
                        </LinearGradient>
                    </TouchableOpacity>
                    <Text size={'sub2'} mt="tiny" color={theme.colors.black_[10]} numberOfLines={1}>
                        Thương hiệu
                    </Text>
                </View>
                {/* gift */}
                <View style={styles.view_icon}>
                    <TouchableOpacity
                        style={styles.touch_icon}
                        activeOpacity={0.9}
                        onPress={navigate.GIFT_ROUTE}
                    >
                        <LinearGradient
                            style={styles.liner_icon}
                            start={{ x: 1, y: 1 }}
                            end={{ x: 0.1, y: 0.1 }}
                            colors={colors1}
                        >
                            <Icon
                                type="ionicon"
                                name="gift-outline"
                                color={theme.colors.white_[10]}
                                size={theme.typography.size(iconSize)}
                            />
                        </LinearGradient>
                    </TouchableOpacity>
                    <Text size={'sub2'} mt="tiny" color={theme.colors.black_[10]}>
                        Quà Tặng
                    </Text>
                </View>
                {/* warranty */}
                <View style={styles.view_icon}>
                    <TouchableOpacity
                        style={styles.touch_icon}
                        activeOpacity={0.9}
                        onPress={navigate.WARRANTY_ROUTE()}
                    >
                        <LinearGradient
                            style={styles.liner_icon}
                            start={{ x: 1, y: 1 }}
                            end={{ x: 0.1, y: 0.1 }}
                            colors={colors2}
                        >
                            <Icon
                                type="ionicon"
                                name="ribbon"
                                color={theme.colors.white_[10]}
                                size={theme.typography.size(iconSize)}
                            />
                        </LinearGradient>
                    </TouchableOpacity>
                    <Text size={'sub2'} mt="tiny" color={theme.colors.black_[10]}>
                        Bảo Hành
                    </Text>
                </View>
                {/* location */}
                <View style={styles.view_icon}>
                    <TouchableOpacity
                        style={styles.touch_icon}
                        activeOpacity={0.9}
                        onPress={navigate.ADDRESS_ROUTE({ type: 'customer' })}
                    >
                        <LinearGradient
                            style={styles.liner_icon}
                            start={{ x: 1, y: 1 }}
                            end={{ x: 0.1, y: 0.1 }}
                            colors={colors3}
                        >
                            <Icon
                                type="ionicon"
                                name="location"
                                color={theme.colors.white_[10]}
                                size={theme.typography.size(iconSize)}
                            />
                        </LinearGradient>
                    </TouchableOpacity>
                    <Text size={'sub2'} mt="tiny" color={theme.colors.black_[10]}>
                        Địa Chỉ
                    </Text>
                </View>
                {/* coin */}
                <View style={styles.view_icon}>
                    <TouchableOpacity
                        style={styles.touch_icon}
                        activeOpacity={0.9}
                        onPress={navigate.COIN_ROUTE}
                    >
                        <View style={styles.liner_icon}>
                            <Image
                                source={require('asset/img-icon-coin.png')}
                                w={'100%'}
                                h={'100%'}
                                style={{ opacity: 0.95 }}
                            />
                        </View>
                    </TouchableOpacity>
                    <Text size={'sub2'} mt="tiny" color={theme.colors.black_[10]}>
                        Tích Xu
                    </Text>
                </View>
                {/* wheel */}
                {data?.spin?.active === 'N' || isEmpty(data?.spin?.active) ? null : (
                    <View style={styles.view_icon}>
                        <TouchableOpacity
                            style={styles.touch_icon}
                            activeOpacity={0.9}
                            onPress={navigate.SPIN_ATTENDANCE_ROUTE}
                        >
                            <View style={styles.liner_icon}>
                                <Image
                                    source={require('asset/wheel.png')}
                                    w={'100%'}
                                    h={'100%'}
                                    style={{ opacity: 0.95 }}
                                />
                            </View>
                        </TouchableOpacity>
                        <Text size={'sub2'} mt="tiny" color={theme.colors.black_[10]}>
                            Vòng Quay
                        </Text>
                    </View>
                )}
            </>
        );

        return (
            <View style={styles.view_bannerContainer}>
                {/* banner */}
                <View style={styles.view_swiper}>
                    {!isLoadingSlide && mainSlides.length > 0 ? (
                        <Swiper
                            loadMinimalLoader={<ActivityIndicator size="large" />}
                            dot={<View style={styles.dotSwiper} />}
                            activeDot={<View style={styles.swiper_activeDot} />}
                            autoplay={true}
                            autoplayTimeout={5}
                        >
                            {mainSlides.map((value, index) => {
                                const { image, link } = getSlideImage(value);

                                return (
                                    <DeepLink url={link} key={index}>
                                        <Image
                                            source={{
                                                uri: image,
                                            }}
                                            resizeMode={'stretch'}
                                            w="94%"
                                            radius={10}
                                        />
                                    </DeepLink>
                                );
                            })}
                        </Swiper>
                    ) : (
                        <View
                            w="94%"
                            h={'100%'}
                            aS="center"
                            bg={theme.colors.grey_[200]}
                            radius={5}
                        />
                    )}
                </View>
                {/* icon */}
                <View style={styles.view_wrap_icon}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {renderIconItem()}
                    </ScrollView>
                </View>
            </View>
        );
    }
    // (pre, next) => {
    //     console.log('pre ', pre);
    //     console.log('next ', next);
    //     return true;
    // }
);

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        /* -------top banner------- */
        view_bannerContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'visible',
            zIndex: 2,
            paddingTop: theme.dimens.verticalScale(35),
            backgroundColor: theme.colors.white_[10],
        },
        dotSwiper: {
            backgroundColor: theme.colors.grey_[300],
            width: theme.spacings.medium,
            height: theme.dimens.verticalScale(1.5),
            marginLeft: theme.spacings.tiny,
            marginRight: theme.spacings.tiny,
            marginTop: theme.spacings.tiny,
            marginBottom: theme.spacings.tiny,
        },

        swiper_activeDot: {
            backgroundColor: 'transparent',
            width: theme.spacings.small,
            height: theme.spacings.small,
            borderRadius: theme.spacings.tiny,
            borderWidth: 1,
            borderColor: theme.colors.main['600'],
            marginLeft: theme.spacings.tiny,
            marginRight: theme.spacings.tiny,
            marginTop: theme.spacings.tiny,
            marginBottom: theme.spacings.tiny,
        },
        view_swiper: {
            width: '100%',
            aspectRatio: 3 / 1.1,
            borderRadius: 10,
        },
        //sub view
        view_wrapSubview: {
            width: '85%',
            backgroundColor: theme.colors.white_[10],
            position: 'absolute',
            bottom: '-8%',
            zIndex: 10,
            padding: theme.spacings.tiny,
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        view_point: {
            flex: 1,
            borderRightWidth: 1,
            borderRightColor: theme.colors.grey_[200],
            justifyContent: 'center',
            alignItems: 'center',
        },
        view_coin: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        //qr
        view_wrapQr: {
            backgroundColor: theme.colors.black_[10],
            position: 'absolute',
            alignSelf: 'center',
            minWidth: 110,
            // height: '100%',
            top: '-119%',
            // elevation: 2,
            borderRadius: 10,
            padding: theme.spacings.tiny,
            alignItems: 'center',
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: theme.colors.black_[10],
        },
        view_border: {
            width: 1,
            height: '80%',
            backgroundColor: theme.colors.black_[10],
            opacity: 0.3,
        },
        touch_qrRight: {
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: theme.spacings.small,
        },
        // icon
        view_wrap_icon: {
            backgroundColor: theme.colors.white_[10],
            width: '94%',
            // minHeight: theme.dimens.verticalScale(70),
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: theme.spacings.medium,
            marginBottom: theme.spacings.small,
            paddingVertical: theme.spacings.small,
            borderRadius: 5,

            ...theme.styles.shadow1,
        },
        view_icon: {
            width: theme.dimens.scale(58),
            alignItems: 'center',
            marginLeft: theme.spacings.small,
            justifyContent: 'center',
        },
        touch_icon: {
            borderRadius: 10,
            // ...theme.styles.shadow2,
        },
        liner_icon: {
            width: theme.dimens.scale(40),
            height: theme.dimens.scale(40),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 100,
        },
        liner_icon_category: {
            width: theme.dimens.scale(39),
            height: theme.dimens.scale(39),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
        },
    });
};

export default HomeTop;
