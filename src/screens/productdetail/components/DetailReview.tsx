/* eslint-disable react-hooks/exhaustive-deps */
import Button from 'components/Button';
import Divider from 'components/Divider';
import Text from 'components/Text';
import View from 'components/View';
import { NAVIGATION_TO_PRODUCT_DETAIL_STACK, NAVIGATION_TO_REVIEW_SCREEN } from 'const/routes';
import { useNavigation, useTheme } from 'hooks';
import useProductReviewSwr from 'hooks/swr/reviewsSwr/useProductReviewSwr';
import { ProductDetailResponseType, ProductReviewResponseType } from 'models';
import React, { memo, useEffect } from 'react';
import { FlatList, ListRenderItem, StyleSheet, TouchableOpacity } from 'react-native';
import { Rating } from 'react-native-ratings';
import { convertToSortNumber } from 'utils/helpers';
import ReviewItem from './ReviewItem';
import { themeType } from 'theme';

interface Props {
    pds?: ProductDetailResponseType['detail-static'];
    reviewsSummary: Array<{
        review_score: string;
        num_review: string;
    }>;
}

const DetailReview = memo(function DetailReview({ pds, reviewsSummary }: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const navigation = useNavigation();

    //swr
    const { reviews, pagination, mutate } = useProductReviewSwr(
        {
            product_seller_uuid: pds?.product_seller_uuid || '',
            page_size: 2,
        },
        { revalidateOnMount: false }
    );

    //effect
    useEffect(() => {
        if (pds?.product_seller_uuid) {
            mutate();
        }
    }, [pds?.product_seller_uuid]);

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
    //render
    const renderListCusRating: ListRenderItem<ProductReviewResponseType> = ({ item, index }) => (
        <ReviewItem review={item} key={index} />
    );
    //navigate
    const navigateToReviewScreen = () => {
        navigation.navigate(NAVIGATION_TO_PRODUCT_DETAIL_STACK, {
            screen: NAVIGATION_TO_REVIEW_SCREEN,
            params: {
                product_detail: pds,
            },
        });
    };

    return (
        <>
            {reviews.length > 0 ? (
                <View style={styles.view_wrap_review}>
                    <View style={styles.view_wrap_title}>
                        <Text fw="bold">
                            ĐÁNH GIÁ SẢN PHẨM ({convertToSortNumber(pagination.total_items)})
                        </Text>
                        <View style={styles.view_rating}>
                            <Rating
                                ratingCount={5}
                                showRating={false}
                                imageSize={theme.typography.size(15.1)}
                                readonly
                                startingValue={handleAverageTotalScore()}
                            />
                            <Text ml={4}>{handleAverageTotalScore()}/5</Text>
                        </View>
                    </View>
                    <FlatList
                        data={reviews}
                        renderItem={renderListCusRating}
                        keyExtractor={(item) => item.review_uuid}
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews={false}
                    />
                    <View bTW={1} bTC={theme.colors.grey_[200]}>
                        <Button
                            title="Xem tất cả đánh giá"
                            type="clear"
                            color={theme.colors.grey_[500]}
                            // iconRight={{ type: 'ionicon', name: 'caret-up' }}
                            onPress={navigateToReviewScreen}
                            titleSize={'body1'}
                            TouchableComponent={TouchableOpacity}
                        />
                    </View>
                </View>
            ) : (
                <View p="medium">
                    <Text fw="bold">SẢN PHẨM CHƯA CÓ ĐÁNH GIÁ</Text>
                </View>
            )}

            <Divider />
            <View style={[styles.view_title_section]}>
                <Text fw="bold">SẢN PHẨM LIÊN QUAN</Text>
            </View>
            <Divider />
            {/* modal */}
        </>
    );
});

const useStyles = (theme: themeType) => {
    return StyleSheet.create({
        //review
        view_wrap_review: {},
        view_wrap_title: {
            padding: theme.spacings.medium,
        },
        view_feedback: {
            backgroundColor: theme.colors.grey_[200],
            padding: theme.spacings.small,
            marginTop: theme.spacings.small,
            borderRadius: 5,
        },
        view_rating: {
            flexDirection: 'row',
            alignItems: 'center',
            // backgroundColor: 'red',
            // paddingHorizontal: spacings.small,
        },
        view_title_section: {
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: theme.spacings.medium,
            paddingVertical: theme.spacings.medium,
        },
    });
};

export default DetailReview;
