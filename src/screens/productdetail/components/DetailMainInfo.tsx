/* eslint-disable react-hooks/exhaustive-deps */
import { Skeleton } from '@rneui/themed';
import ButtonChangeQty from 'components/ButtonChangeQty';
import Divider from 'components/Divider';
import IconButton from 'components/IconButton';
import Image from 'components/Image';
import Text from 'components/Text';
import Touch from 'components/Touch';
import Video_ from 'components/Video';
import View from 'components/View';
import { REACT_NATIVE_APP_WEB_URL } from 'const/env';
import { PRODUCT_DETAIL_URL } from 'const/webPath';
import { useNavigate, useTheme } from 'hooks';
import { findIndex, map } from 'lodash';
import { ProductDetailResponseType } from 'models';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, ListRenderItem, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Rating } from 'react-native-ratings';
import Share from 'react-native-share';
import SwiperFlatList, { PaginationProps } from 'react-native-swiper-flatlist';
import { themeType } from 'theme';
import { formatProductPrices, isEmpty } from 'utils/helpers';
import { sendSentryError } from 'utils/storeHelpers';

// pds: product_detail_server
// pdc: product_detail_client
// pdi: product_detail_info(check simple or config)

interface Props {
    pds?: ProductDetailResponseType['detail-static'];
    pdc?: ProductDetailResponseType['detail-dynamic'];
    productUUIDParam: string;
    reviewsSummary: Array<{
        review_score: string;
        num_review: string;
    }>;
    changeQtyAddToCart: (value: number) => void;
}

type ChildrenType = NonNullable<ProductDetailResponseType['detail-dynamic']['children']>[number];

const DetailMainInfo = memo(function DetailMainInfo({
    pds,
    pdc,
    productUUIDParam,
    reviewsSummary,
    changeQtyAddToCart,
}: Props) {
    let isEffectProductSelect = false;

    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const navigate = useNavigate();

    //state
    const [isLoadingVideo, setIsLoadingVideo] = useState(false);
    const [indexSwiper, setIndexSwiper] = useState(0);

    const [defaultImageIndex, setDefaultImageIndex] = useState(0);
    //--image - dang le gop chung duoc tam thoi tach ra
    const [listImage, setListImage] = useState<Array<any>>([]);
    const [media, setMedia] = useState<
        Array<{
            url: string;
            type: 'image' | 'video';
        }>
    >([]);

    //--index san pham option da chon
    const [indexProductOptionSelected, setIndexProductOptionSelected] = useState<
        number | undefined
    >();

    //ref
    const scrollOptionRef = useRef<FlatList>(null);

    //value
    const checkEmpty = isEmpty(pds);

    const { children = [] } = pdc || {};

    const totalNumReview = reviewsSummary.reduce((num, cur) => num + parseInt(cur.num_review), 0);

    const childrenSelected =
        indexProductOptionSelected !== undefined && pdc?.children
            ? pdc?.children[indexProductOptionSelected]
            : undefined;

    const pdi = useMemo(
        () =>
            pds?.type_id === 'simple' || childrenSelected === undefined
                ? { ...pdc, ...pds }
                : childrenSelected,
        [pdc, pds, childrenSelected]
    );
    const percent =
        pds?.type_id === 'simple' && pdc?.special_price && pdc?.price
            ? (100 - (pdc?.special_price / pdc?.price) * 100).toFixed(0)
            : childrenSelected !== undefined
            ? (100 - (childrenSelected?.special_price / childrenSelected?.price) * 100).toFixed(0)
            : pdc?.max_special_price && pdc?.max_price
            ? (100 - (pdc?.max_special_price / pdc?.max_price) * 100).toFixed(0)
            : undefined;

    // check khi select item con trong san pham config
    const itemSelect = childrenSelected !== undefined ? childrenSelected : pdc;
    const typeIDSelect = childrenSelected !== undefined ? 'simple' : pds?.type_id || 'simple';

    const { finalPrice, crossedPrice } = formatProductPrices({
        ...itemSelect,
        type_id: typeIDSelect,
    });

    //effect
    useEffect(() => {
        console.log('pdi effect ');
        //xu ly media de xem chi tiet anh (MediaScreen)
        const media_: any = pdi?.images?.map((v) => ({ type: 'image', url: v.url }));
        if (pdi?.video) {
            //media
            setMedia([{ type: 'video', url: pds?.video }, ...media_]);
            //image
            setListImage([pdi.video, ...(pdi?.images || [])]);
            const defaultIndex = findIndex(pdi.images, (value) => value.is_default === 'Y');
            setDefaultImageIndex(defaultIndex);
        } else {
            setMedia(media_);
            setListImage(pdi?.images || []);
        }
        //tim anh mac dinh
    }, [indexProductOptionSelected, pdi]);

    //--check product_select xem co navigate tu cart qua voi product config
    useEffect(() => {
        if (children.length > 0 && productUUIDParam && !isEffectProductSelect) {
            const product_select = productUUIDParam !== pds?.uuid ? productUUIDParam : undefined;
            const indexSelected = children.findIndex((v) => v.product_uuid === product_select);
            if (indexSelected !== -1) {
                setIndexProductOptionSelected(indexSelected);
                scrollOptionRef.current?.scrollToIndex({
                    index: indexSelected,
                    animated: false,
                });
            }
            isEffectProductSelect = true;
        }
    }, [children, productUUIDParam, pds?.uuid]);

    //handle
    const handleShareProductDetail = () => {
        if (!pds) {
            return;
        }
        Share.open({
            title: 'share',
            url: `${REACT_NATIVE_APP_WEB_URL}${PRODUCT_DETAIL_URL(
                pds?.name,
                pds?.uuid,
                pds.product_seller_uuid
            )}`,
        })
            .then(() => {})
            .catch((err) => {
                sendSentryError(err, 'handleShareProductDetail');
            });
    };

    const handleLoadingVideo = (isLoading: boolean) => {
        setIsLoadingVideo(isLoading);
    };

    function handleAverageTotalScore() {
        // const score___ = [
        //     { num_review: '10', review_score: '5' },
        //     { num_review: '5', review_score: '4' },
        // ];
        const scoreReduce = reviewsSummary.reduce(
            (total, current) => ({
                total_score:
                    total.total_score +
                    parseInt(current.num_review) * parseInt(current.review_score),
                total_num_review: total.total_num_review + parseInt(current.num_review),
            }),
            { total_score: 0, total_num_review: 0 }
        );
        const averageTotalScore =
            scoreReduce.total_score > 0 && scoreReduce.total_num_review > 0
                ? scoreReduce.total_score / scoreReduce.total_num_review
                : 0;

        // Kiểm tra xem số có phải là số thập phân không
        if (averageTotalScore % 1 !== 0) {
            // Làm tròn số thập phân đến một chữ số sau dấu phẩy
            return Math.floor(averageTotalScore * 10) / 10;
        } else {
            // Nếu là số nguyên, giữ nguyên số đó
            return averageTotalScore;
        }
    }
    //render
    const renderListProductImageSwiper = () => {
        let element = map(listImage, (value, index) => {
            return pdi?.video && index === 0 ? (
                <View style={styles.swiper_child} key={pdi.video}>
                    <Video_
                        source={{ uri: pdi?.video }}
                        autoplay={false}
                        isStop={indexSwiper !== 0}
                        onLoadingVideo={handleLoadingVideo}
                        poster={pdi?.images && pdi?.images[defaultImageIndex].url}
                    />
                </View>
            ) : (
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={navigate.LIST_MEDIA_ROUTE({ media, startIndex: 0 })}
                    key={index}
                    style={styles.swiper_child}
                >
                    <Image
                        // style={{ width: '100%', height: '100%' }}
                        source={{
                            uri: value.url,
                        }}
                        resizeMode="stretch"
                    />
                </TouchableOpacity>
            );
        });
        return element;
    };

    const pagination = useCallback(
        (props: any) => (
            <Pagination {...props} isLoadingVideo={isLoadingVideo} video={pdi?.video} />
        ),
        [isLoadingVideo, pds?.video]
    );

    const renderProductOptionList: ListRenderItem<ChildrenType> = ({ item: v, index }) => (
        <Touch
            key={index}
            style={styles.touch_product_option}
            bC={
                indexProductOptionSelected === index
                    ? theme.colors.main[500]
                    : theme.colors.grey_[200]
            }
            activeOpacity={0.7}
            onPress={() => {
                setIndexProductOptionSelected(
                    index === indexProductOptionSelected ? undefined : index
                );
                if (index !== indexProductOptionSelected) {
                    scrollOptionRef.current?.scrollToIndex({
                        index: index,
                    });
                }
            }}
        >
            <View ratio={1}>
                <Image source={{ uri: v.images[0].url }} resizeMode="contain" radius={1} />
            </View>
            <Text
                flex={1}
                size={'sub3'}
                numberOfLines={2}
                ellipsizeMode="tail"
                color={theme.colors.grey_[700]}
            >
                {v.name}
            </Text>
        </Touch>
    );

    return (
        <>
            {/* image */}
            <View style={styles.swiper_child}>
                <SwiperFlatList
                    showPagination
                    PaginationComponent={pagination}
                    removeClippedSubviews={false}
                    onChangeIndex={({ index }) => {
                        setIndexSwiper(index);
                    }}
                >
                    {renderListProductImageSwiper()}
                </SwiperFlatList>
            </View>

            {/* main info */}
            <View style={styles.view_main_info}>
                {/* name and rating */}
                <View style={styles.view_wrap_name_info}>
                    {checkEmpty ? (
                        <View>
                            <Skeleton height={theme.dimens.verticalScale(25)} animation="none" />
                            <View mv={'tiny'} w="25%">
                                <Skeleton
                                    height={theme.dimens.verticalScale(10)}
                                    animation="none"
                                />
                            </View>
                            <View mv={'tiny'} w="21%">
                                <Skeleton
                                    height={theme.dimens.verticalScale(10)}
                                    animation="none"
                                />
                            </View>
                        </View>
                    ) : (
                        <>
                            {/* name */}
                            <Text size={'body3'} ellipsizeMode="tail" numberOfLines={2} lh={22}>
                                {pdi.name}
                            </Text>
                            {/* rating and share */}
                            <View
                                flexDirect="row"
                                bBW={0.7}
                                bBC={theme.colors.grey_[100]}
                                pb="small"
                                mb={'small'}
                                jC="space-between"
                            >
                                {/* rating info */}
                                {handleAverageTotalScore() <= 0 ? (
                                    <View style={styles.view_wrap_rating}>
                                        <View style={styles.view_rating}>
                                            <Rating
                                                imageSize={theme.typography.size(15.1)}
                                                startingValue={handleAverageTotalScore()}
                                                readonly
                                                ratingCount={5}
                                            />
                                            <Text
                                                size={'sub2'}
                                                ml="tiny"
                                                color={theme.colors.grey_[500]}
                                            >
                                                {handleAverageTotalScore()}/5
                                            </Text>
                                        </View>
                                        <Text
                                            size={'sub2'}
                                            mh={theme.spacings.small}
                                            color={theme.colors.grey_[300]}
                                        >
                                            |
                                        </Text>
                                        <Text size={'sub2'} color={theme.colors.grey_[500]}>
                                            {totalNumReview > 0
                                                ? `${totalNumReview} Đánh giá`
                                                : 'Chưa có đánh giá'}
                                        </Text>

                                        {/* <Text size={'sub2'} color={ colors.grey_[500]}>
                                                // 1k+ Đã bán //{' '}
                                            </Text> */}
                                    </View>
                                ) : (
                                    <View />
                                )}
                                {/* share */}
                                <View flexDirect="row" aI="center">
                                    <IconButton
                                        type="ionicon"
                                        name="share-social-outline"
                                        activeOpacity={0.8}
                                        color={theme.colors.grey_[400]}
                                        size={theme.typography.size(23)}
                                        onPress={handleShareProductDetail}
                                        mr={'medium'}
                                    />
                                    <IconButton
                                        type="ionicon"
                                        name="heart-outline"
                                        activeOpacity={0.8}
                                        color={theme.colors.grey_[400]}
                                        size={theme.typography.size(23)}
                                        mr={'tiny'}
                                    />
                                </View>
                            </View>

                            {/* tag */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {pdi.sku ? (
                                    <Text style={styles.txt_tag}>Mã sản phẩm - {pdi.sku}</Text>
                                ) : null}

                                {pds.warranty_period ? (
                                    <Text style={styles.txt_tag}>
                                        Bảo hành - {pds.warranty_period}
                                    </Text>
                                ) : null}
                                {pds.country_of_manufacture ? (
                                    <Text style={styles.txt_tag}>
                                        Xuất xứ - {pds.country_of_manufacture}
                                    </Text>
                                ) : null}

                                {pds.brand ? (
                                    <Touch
                                        onPress={navigate.PRODUCT_BRAND_ROUTE({
                                            brand_uuid: pds.brand_uuid,
                                        })}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.txt_tag}>
                                            Thương hiệu -{' '}
                                            <Text
                                                size={theme.typography.size(9)}
                                                color={theme.colors.main['600']}
                                                tD="underline"
                                            >
                                                {pds.brand}
                                            </Text>
                                        </Text>
                                    </Touch>
                                ) : null}
                            </ScrollView>
                        </>
                    )}
                </View>

                {/* price and share */}
                <View style={styles.view_wrap_price_Info}>
                    {/* price */}
                    {checkEmpty ? (
                        <View mv={'tiny'} w="40%">
                            <Skeleton height={theme.dimens.verticalScale(15)} animation="none" />
                        </View>
                    ) : (
                        <>
                            <View>
                                {/* qty simple */}
                                {pdi.qty && pdi.qty < 1 ? (
                                    <Text size={'body1'} color="red">
                                        Sản phẩm đã hết hàng
                                    </Text>
                                ) : null}

                                <View>
                                    {/* first price simple */}
                                    {crossedPrice ? (
                                        <View flexDirect="row" aI="center">
                                            <Text pattern="price">{crossedPrice}</Text>
                                            <Text
                                                size={'sub2'}
                                                color={theme.colors.grey_[400]}
                                                ml="tiny"
                                            >
                                                {`(Tiết kiệm ${percent}%)`}
                                            </Text>
                                        </View>
                                    ) : null}
                                    <Text size="body3" fw="bold" color={theme.colors.red['500']}>
                                        {finalPrice}
                                    </Text>
                                </View>
                            </View>
                            {/* change qty button */}
                            {pds.type_id === 'simple' && (
                                <View h={31} w={120}>
                                    <ButtonChangeQty
                                        maxValue={pdi?.qty}
                                        size={15}
                                        onSuccess={changeQtyAddToCart}
                                    />
                                </View>
                            )}
                        </>
                    )}
                </View>
                {/* share */}
            </View>

            {/* option */}
            {pds?.type_id === 'configurable' && (
                <>
                    <Divider />
                    <View style={{ padding: theme.spacings.small }}>
                        <Text color={theme.colors.grey_[500]} size={'sub3'}>
                            {children.length} phân loại sản phẩm
                        </Text>
                        <FlatList
                            data={children}
                            ref={scrollOptionRef}
                            keyExtractor={(v) => v.product_seller_uuid}
                            renderItem={renderProductOptionList}
                            getItemLayout={(_, index) => ({
                                length: 200,
                                offset: 200 * index,
                                index,
                            })}
                            style={styles.scroll_product_option}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                </>
            )}

            <Divider />
        </>
    );
});

interface PaginationProps_ extends PaginationProps {
    video: string;
    isLoadingVideo: boolean;
}

const Pagination = ({ size, paginationIndex = 0, video, isLoadingVideo }: PaginationProps_) => {
    const { theme } = useTheme();
    const styles = useStyles(theme);

    return !video || (isLoadingVideo && paginationIndex > 0) ? (
        <View style={styles.view_wrap_pagination}>
            <View style={styles.view_bg_pagination}>
                <Text color={theme.colors.grey_[200]} size={'sub3'}>
                    {paginationIndex + 1}/{size}
                </Text>
            </View>
        </View>
    ) : null;
};

const useStyles = (theme: themeType) => {
    return StyleSheet.create({
        /* ------- section top ------- */
        swiper_child: {
            width: theme.dimens.width,
            aspectRatio: 1,
            // height: dimens.height * 0.5,
        },
        view_wrap_pagination: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '8%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        view_bg_pagination: {
            width: '13%',
            height: '70%',
            backgroundColor: 'rgba(0,0,0, 0.5)',
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },

        //product info
        view_main_info: {
            width: '100%',
            paddingHorizontal: theme.spacings.medium,
            justifyContent: 'space-around',
            // borderBottomWidth: 1,
            // borderBottomColor: colors.grey_[100],
        },
        view_wrap_name_info: {
            width: '100%',
            justifyContent: 'center',
            paddingTop: theme.spacings.small,
        },
        view_wrap_rating: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: theme.spacings.tiny,
        },

        txt_tag: {
            backgroundColor: theme.colors.grey_[100],
            padding: theme.spacings.tiny,
            fontSize: theme.typography.size(9),
            borderRadius: 5,
            marginTop: theme.spacings.tiny,
            marginRight: theme.spacings.small,
            color: theme.colors.grey_[600],
        },

        view_rating: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        view_wrap_price_Info: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: theme.spacings.medium,
            marginBottom: theme.spacings.small,
        },
        scroll_product_option: {
            flexDirection: 'row',
            marginTop: theme.spacings?.small,
            gap: theme.spacings?.small,
        },
        touch_product_option: {
            flexDirection: 'row',
            padding: theme.spacings.small,
            borderWidth: 0.7,
            borderRadius: 5,
            gap: theme.spacings.small,
            width: 200,
            marginRight: theme.spacings?.small,
        },
    });
};

export default DetailMainInfo;
