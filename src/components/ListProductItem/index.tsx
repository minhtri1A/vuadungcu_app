/* eslint-disable react-hooks/exhaustive-deps */
import { Icon } from '@rneui/themed';
import ButtonChangeQty from 'components/ButtonChangeQty';
import IconAddCart from 'components/IconAddCart';
import Text, { TextCustomProps } from 'components/Text';
import Touch from 'components/Touch';
import View from 'components/View';
import {
    NAVIGATION_TO_PRODUCT_DETAIL_SCREEN,
    NAVIGATION_TO_PRODUCT_DETAIL_STACK,
} from 'const/routes';
import { useNavigation, useTheme } from 'hooks';
import useProductReviewSummarySwr from 'hooks/swr/reviewsSwr/useProductReviewSummarySwr';
import { debounce } from 'lodash';
import { ProductListItemType } from 'models';
import React, { memo, useEffect, useState } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { themeType } from 'theme';
import { formatProductPrices } from 'utils/helpers';
import Image from './../Image';

interface Props {
    item: ProductListItemType;
    lengthListProduct: any;
    index?: any; //value cause re render
    viewContainerStyle?: StyleProp<ViewStyle>;
    showFirstPrice?: boolean;
    textNameProps?: TextCustomProps;
    textFirstPriceProps?: TextCustomProps;
    textSalePriceProps?: TextCustomProps;
    isAddToCart?: boolean;
    showRating?: boolean;
}

//render list product item
const ListProductItem = memo(function ListProductItem({
    item,
    lengthListProduct,
    index,
    viewContainerStyle,
    showFirstPrice = true,
    textNameProps,
    textFirstPriceProps,
    textSalePriceProps,
    isAddToCart,
    showRating = true,
}: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const navigation = useNavigation();
    //props
    const {
        type_id,
        uuid,
        name,
        discount_percent,
        max_discount_percent,
        image,
        qty,
        product_seller_uuid: psu,
        video,
    } = item || {};
    //state
    const [rating, setRating] = useState(0);
    const [qtyAdd, setQtyAdd] = useState(item.qty > 0 ? 1 : 0);
    //swr
    const { reviewsSummary } = useProductReviewSummarySwr(psu, {
        revalidateOnMount: false,
    });

    //value
    const { crossedPrice, finalPrice } = formatProductPrices(item);

    //effect

    useEffect(() => {
        if (psu) {
            // mutateSummary();
        }
    }, [psu]);

    useEffect(() => {
        if (reviewsSummary && rating === 0 && showRating) {
            const result = handleAverageTotalScore();
            if (result) {
                setRating(result);
            }
        }
    }, [reviewsSummary]);

    //handle

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
    //navigate
    const navigateProductDetail = () => {
        preventDoubleClick(uuid, psu);
    };
    //--navigate sau khi ngan chan duplicate
    const navigate = (product_uuid: string, product_seller_uuid?: string) => {
        navigation.push(NAVIGATION_TO_PRODUCT_DETAIL_STACK, {
            screen: NAVIGATION_TO_PRODUCT_DETAIL_SCREEN,
            params: { product_uuid, product_seller_uuid },
        });
    };
    //--ngan chan duplicate
    const preventDoubleClick = debounce(navigate, 1000, {
        leading: true,
        trailing: false,
    });

    return (
        <>
            <View style={[styles.container, viewContainerStyle]}>
                <Touch onPress={navigateProductDetail} activeOpacity={0.8} flex={1}>
                    <View style={styles.viewFreeShip}>
                        {/* <Image
                        source={require("./../../asset/free-shipping-512.png")}
                        style={{ width: 30, height: 30 }}
                    />
                     */}
                    </View>
                    <View style={styles.viewStyleImage}>
                        <Image
                            source={{
                                uri: image,
                                priority: 'normal',
                            }}
                            resizeMode={'contain'}
                            size={theme.typography.size(25)}
                        />
                        {qty < 1 ? (
                            <View style={styles.view_soldOutContainer}>
                                <View style={styles.view_soldOutCircle}>
                                    <Text color={theme.colors.white_[10]} fw="bold">
                                        Tạm hết
                                    </Text>
                                </View>
                            </View>
                        ) : null}
                        {/* video icon */}
                        {video ? (
                            <View style={styles.view_has_video}>
                                <Icon
                                    type="entypo"
                                    name="controller-play"
                                    color={theme.colors.grey_[200]}
                                    size={theme.typography.size(15)}
                                />
                            </View>
                        ) : null}
                    </View>
                    {/* name */}
                    <View style={styles.viewStyleName}>
                        <Text
                            style={[styles.nameProduct]}
                            ellipsizeMode="tail"
                            numberOfLines={2}
                            {...textNameProps}
                        >
                            {name}
                        </Text>
                        {discount_percent || max_discount_percent || rating > 0 ? (
                            <View flexDirect="row" mt="tiny" gap={theme.spacings.tiny1}>
                                {discount_percent || max_discount_percent ? (
                                    <View
                                        ph={'tiny1'}
                                        bg={theme.colors.red[50]}
                                        bC={theme.colors.red[200]}
                                        style={styles.view_tag}
                                    >
                                        <Text color={theme.colors.red[500]} size={'sub3'}>
                                            -
                                            {type_id === 'simple'
                                                ? `${discount_percent}%`
                                                : `${max_discount_percent}%`}
                                        </Text>
                                    </View>
                                ) : null}
                                {rating > 0 && (
                                    <View
                                        style={styles.view_tag}
                                        bg={theme.colors.main[50]}
                                        bC={theme.colors.main[300]}
                                    >
                                        <AirbnbRating
                                            count={1}
                                            defaultRating={1}
                                            size={theme.dimens.verticalScale(12)}
                                            showRating={false}
                                            starContainerStyle={{
                                                width: theme.dimens.verticalScale(12),
                                                height: theme.dimens.verticalScale(12),
                                            }}
                                        />
                                        <Text size={'sub3'} ml={1} color={theme.colors.grey_[500]}>
                                            {rating}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        ) : null}
                    </View>

                    {/* price */}
                    <View style={styles.viewStylePrice}>
                        {showFirstPrice && crossedPrice ? (
                            <Text
                                ellipsizeMode="tail"
                                numberOfLines={1}
                                pattern="price"
                                {...textFirstPriceProps}
                            >
                                {crossedPrice}
                            </Text>
                        ) : null}

                        <View style={styles.view_main_price}>
                            <Text
                                flex={1}
                                pattern="sale_price"
                                ellipsizeMode="tail"
                                numberOfLines={2}
                                {...textSalePriceProps}
                            >
                                {finalPrice}
                            </Text>
                        </View>
                    </View>
                </Touch>
                {/* bottom qty - add to cart */}
                {isAddToCart ? (
                    <View style={styles.view_wrap_bottom}>
                        <ButtonChangeQty
                            value={qtyAdd}
                            maxValue={item.qty}
                            onSuccess={(v) => setQtyAdd(v)}
                        />
                        <IconAddCart item={item} qtyAdd={qtyAdd} />
                    </View>
                ) : null}
            </View>
            {lengthListProduct % 2 !== 0 && index === lengthListProduct - 1 ? (
                <View style={{ width: theme.dimens.width * 0.475 }} />
            ) : null}
        </>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        container: {
            width: theme.dimens.width * 0.475,
            // width: '47.5%',
            marginBottom: theme.spacings.small - 2.5,
            backgroundColor: theme.colors.white_[10],
            borderRadius: 5,
            overflow: 'hidden',
            // flex: 1,
        },

        //image
        viewStyleImage: {
            width: '100%',
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },

        imgProduct: {
            width: '50%',
            height: '55%',
        },

        //name product
        viewStyleName: {
            marginTop: theme.spacings.tiny,
            paddingHorizontal: theme.spacings.small,
        },

        nameProduct: {
            width: '100%',
            overflow: 'hidden',
            color: theme.colors.black_[10],
        },

        //price
        viewStylePrice: {
            // flexDirection: 'row',
            padding: theme.spacings.small,
            paddingBottom: 0,
            flex: 1,
            justifyContent: 'flex-end',
            // alignItems: 'center',
            marginBottom: theme.spacings.tiny,
        },
        view_main_price: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
        },
        /// viewRating
        viewRating: {
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            // marginVertical: theme.spacings.tiny,
            borderTopWidth: 0.5,
            borderTopColor: theme.colors.grey_[200],
            paddingVertical: theme.spacings.tiny1,
        },

        txtSold: {
            flex: 0.5,
            textAlign: 'right',
            textAlignVertical: 'center',
            fontSize: theme.typography.sub2,
            paddingRight: theme.spacings.small,
            color: theme.colors.grey_[500],
        },

        //view_soldOutContainer
        view_soldOutContainer: {
            width: '100%',
            height: '100%',
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
        },
        //view_soldOutCircle
        view_soldOutCircle: {
            width: '48%',
            aspectRatio: 1,
            borderRadius: 80,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
        },

        // icon
        viewFreeShip: {
            position: 'absolute',
            width: theme.dimens.scale(30),
            aspectRatio: 1,
            top: 0,
            right: 2,
            zIndex: 1,
        },
        view_has_video: {
            position: 'absolute',
            bottom: 5,
            right: 5,
            backgroundColor: 'rgba(0,0,0, 0.5)',
            // paddingLeft: 3,
            borderRadius: 100,
            width: theme.dimens.scale(20),
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: 3,
        },
        //bottom
        icon_cart: {
            backgroundColor: theme.colors.main['600'],
            padding: theme.spacings.tiny,
        },
        view_wrap_bottom: {
            flexDirection: 'row',
            paddingHorizontal: theme.spacings.small,
            paddingBottom: theme.spacings.small,
            gap: theme.spacings.small,
        },
        view_wrap_qty_btn: {
            borderWidth: 0.7,
            flexDirection: 'row',
            flex: 1,
            borderColor: theme.colors.grey_[200],
            borderRadius: 10,
            backgroundColor: theme.colors.white_.grey1,
        },
        touch_qty: {
            flex: 0.35,
            alignItems: 'center',
            justifyContent: 'center',
        },
        touch_visible_input_qty: {
            flex: 0.3,
            borderLeftWidth: 0.7,
            borderRightWidth: 0.7,
            borderColor: theme.colors.grey_[200],
            alignItems: 'center',
            justifyContent: 'center',
        },

        //

        view_tag: {
            paddingHorizontal: theme.spacings.tiny1,
            borderRadius: 3,
            alignSelf: 'flex-start',
            borderWidth: 0.7,
            height: theme.dimens.verticalScale(18),
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
        },
    });

export default ListProductItem;
