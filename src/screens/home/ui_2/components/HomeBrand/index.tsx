import { Icon, Skeleton } from '@rneui/themed';
import DeepLink from 'components/DeepLink';
import Divider from 'components/Divider';
import Image from 'components/Image';
import Text from 'components/Text';
import View from 'components/View';
import { HOME_BRAND_SECTION_BANNER } from 'const/slides';
import { useNavigate, useSlideSwr, useTheme } from 'hooks';
import useBrandsSwr from 'hooks/swr/brandSwr/useBrandsSwr';
import { BrandsResponseType } from 'models';
import React, { memo, useEffect } from 'react';
import { ActivityIndicator, ListRenderItem, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Swiper from 'react-native-swiper';
import { getSlideImage, isEmpty } from 'utils/helpers';
import useStyles from './styles';

interface Props {
    refreshControl: boolean;
    isAppStart: boolean;
}

const HomeBrand = memo(function HomeBrand({ refreshControl, isAppStart }: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles();
    const navigate = useNavigate();
    //swr
    const {
        brands,
        isLoading: isLoadingBrands,
        mutateBrands,
    } = useBrandsSwr({ type: 'featured' }, { revalidateOnMount: false });
    const {
        slides: brandSlide,
        isLoading: isLoadingSlide,
        mutate: mutateBrandSlide,
    } = useSlideSwr(
        {
            group: HOME_BRAND_SECTION_BANNER,
        },
        { revalidateOnMount: false },
        3600
    );

    //effect
    //--fetch init
    useEffect(() => {
        if (isAppStart) {
            mutateBrands();
            mutateBrandSlide();
        }
    }, [isAppStart]);
    //--refresh control
    useEffect(() => {
        if (refreshControl && isAppStart) {
            mutateBrands();
            mutateBrandSlide();
        }
    }, [refreshControl, isAppStart]);

    //render
    const renderBrandItem: ListRenderItem<BrandsResponseType> = ({ item }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.brandItem]}
                onPress={navigate.PRODUCT_BRAND_ROUTE({ brand_uuid: item.brand_uuid })}
            >
                <View style={{ aspectRatio: 1, width: theme.dimens.width * 0.2 }}>
                    <Image
                        source={{
                            uri: item.logo,
                            priority: 'normal',
                        }}
                        resizeMode={'contain'}
                    />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <View style={styles.view_brandContainer}>
                <View flexDirect="row" p={'small'} aI="center" pv="medium">
                    <Icon
                        type="material-community"
                        name="check-decagram"
                        size={theme.typography.size(20)}
                        color={theme.colors.main['600']}
                    />
                    <Text color={theme.colors.main['600']} size={'body2'} ml={'small'}>
                        THƯƠNG HIỆU CHÍNH HÃNG
                    </Text>
                </View>

                {isLoadingSlide ? (
                    <View style={styles.view_brandSlider}>
                        <Skeleton
                            style={{
                                width: '95%',
                                height: '100%',
                                borderRadius: 10,
                            }}
                            skeletonStyle={styles.ske_skeleton}
                        />
                    </View>
                ) : !isEmpty(brandSlide) ? (
                    <View style={styles.view_brandSlider}>
                        <Swiper
                            width={theme.dimens.width}
                            height={0}
                            loadMinimalLoader={<ActivityIndicator size="large" />}
                            autoplay={true}
                            showsPagination={false}
                        >
                            {brandSlide.length > 0 ? (
                                brandSlide.map((value, index) => {
                                    const { link, image } = getSlideImage(value);
                                    return (
                                        <DeepLink url={link} key={index}>
                                            <Image
                                                source={{
                                                    uri: image,
                                                }}
                                                w="95%"
                                                bg
                                                resizeMode={'stretch'}
                                                radius={5}
                                            />
                                        </DeepLink>
                                    );
                                })
                            ) : (
                                <View
                                    w="98%"
                                    h={'100%'}
                                    aS="center"
                                    bg={theme.colors.grey_[200]}
                                    radius={5}
                                />
                            )}
                        </Swiper>
                    </View>
                ) : null}

                {isLoadingBrands ? (
                    <View flexDirect="row" jC="space-between" p={'medium'}>
                        <Skeleton style={styles.ske_brand} skeletonStyle={styles.ske_skeleton} />
                        <Skeleton style={styles.ske_brand} skeletonStyle={styles.ske_skeleton} />
                        <Skeleton style={styles.ske_brand} skeletonStyle={styles.ske_skeleton} />
                        <Skeleton style={styles.ske_brand} skeletonStyle={styles.ske_skeleton} />
                    </View>
                ) : !isEmpty(brands) ? (
                    <View style={styles.view_brandItemContainer}>
                        <FlatList
                            data={brands}
                            renderItem={renderBrandItem}
                            keyExtractor={(item) => item?.brand_uuid}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                ) : null}
            </View>
            <Divider height={1} />
        </>
    );
});

export default HomeBrand;
