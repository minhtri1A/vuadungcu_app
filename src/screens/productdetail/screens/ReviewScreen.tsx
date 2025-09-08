import { RouteProp, useRoute } from '@react-navigation/native';
import { Icon } from '@rneui/themed';
import AfterInteractions from 'components/AfterInteractions';
import Header from 'components/Header';
import LoadingFetchAPI from 'components/LoadingFetchAPI';
import Text from 'components/Text';
import View from 'components/View';
import { useTheme } from 'hooks';
import useProductReviewSummarySwr from 'hooks/swr/reviewsSwr/useProductReviewSummarySwr';
import useProductReviewSwrInfinity from 'hooks/swr/reviewsSwr/useProductReviewSwrInfinity';
import { ProductReviewResponseType } from 'models';
import { ProductDetailStackParamsList } from 'navigation/type';
import React, { memo, useState } from 'react';
import { FlatList, ListRenderItem, RefreshControl, TouchableOpacity } from 'react-native';
import { Rating } from 'react-native-ratings';
import { isEmpty } from 'utils/helpers';
import ReviewItem from '../components/ReviewItem';
import ReviewsSkeleton from '../skeletons/ReviewsSkeleton';
import useStyles from './../styles';

interface Props {}

const ReviewScreen = memo(function ReviewScreen({}: Props) {
    //hook
    const styles = useStyles();
    const {
        theme: { colors, typography, spacings, dimens },
    } = useTheme();
    const router = useRoute<RouteProp<ProductDetailStackParamsList, 'ReviewScreen'>>();
    const { pds } = router.params || {};
    //state
    const [scoreParam, setScoreParam] = useState<string | undefined>();
    const [hasMediaParam, setHasMediaParam] = useState<'Y' | 'N' | undefined>();
    //swr
    const {
        reviews,
        pagination: { page, page_count },
        size,
        isValidating,
        setSize,
        mutate,
    } = useProductReviewSwrInfinity({
        product_seller_uuid: pds?.product_seller_uuid,
        score: scoreParam,
        has_media: hasMediaParam,
        page_size: 5,
    });
    const { reviewsSummary, mutate: mutateSummary } = useProductReviewSummarySwr(
        pds?.product_seller_uuid
    );
    //value
    const checkAllReviewParam =
        scoreParam === undefined && hasMediaParam === undefined ? true : false;

    //effect

    //handle
    function handleAverageTotalScore() {
        const scoreReduce = reviewsSummary.reduce(
            (total, current) => ({
                total_score:
                    total.total_score +
                    parseInt(current.num_review) * parseInt(current.review_score),
                total_num_review: total.total_num_review + parseInt(current.num_review),
            }),
            { total_score: 0, total_num_review: 0 }
        );
        //
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

    const setScoreParamReview = (score: string) => () => {
        setScoreParam(score);
    };

    const setOtherParamsReview = (param_type: 'all' | 'has_image') => () => {
        if (param_type === 'all') {
            setScoreParam(undefined);
            setHasMediaParam(undefined);
            return;
        }
        setHasMediaParam('Y');
    };

    const handleLoadMoreReviews = () => {
        if (!isValidating && page < page_count) {
            setSize(size + 1);
        }
    };

    const refreshList = () => {
        mutate();
        mutateSummary();
    };

    //render
    const renderListStarFilter = () =>
        reviewsSummary.map((v, i) => (
            <TouchableOpacity
                style={[
                    styles.touch_star_filter,
                    scoreParam === v.review_score ? styles.touch_star_filter_selected : {},
                ]}
                key={i}
                onPress={setScoreParamReview(v.review_score)}
            >
                <Text
                    size={'body2'}
                    color={scoreParam === v.review_score ? colors.main['600'] : colors.grey_[500]}
                >
                    {v.review_score}
                </Text>
                <Icon
                    type="feather"
                    name="star"
                    size={typography.size(15)}
                    color={scoreParam === v.review_score ? colors.main['600'] : colors.grey_[500]}
                />
                <Text
                    size={'sub3'}
                    color={scoreParam === v.review_score ? colors.main['400'] : colors.grey_[500]}
                >
                    ({v.num_review})
                </Text>
            </TouchableOpacity>
        ));

    const renderListCusRating: ListRenderItem<ProductReviewResponseType> = ({ item, index }) => (
        <ReviewItem review={item} key={index} />
    );

    return (
        <View flex={1} bg={colors.white_[10]}>
            <Header
                centerComponent={{
                    text: 'Đánh giá sản phẩm',
                    style: {
                        color: colors.slate[900],
                        fontSize: typography.title1,
                    },
                }}
                backgroundColor={colors.white_[10]}
                shadow
            />
            <AfterInteractions>
                <FlatList
                    data={reviews}
                    renderItem={renderListCusRating}
                    keyExtractor={(value) => value.review_uuid}
                    ListHeaderComponent={
                        <View>
                            {/* rating */}
                            <View style={styles.view_wrap_review_title}>
                                <View flexDirect="row" aI="center" pl={0}>
                                    <Rating
                                        ratingCount={5}
                                        showRating={false}
                                        imageSize={typography.size(19)}
                                        readonly
                                        tintColor={'rgba(254,247,229,255)'}
                                        ratingColor="red"
                                        ratingBackgroundColor="blue"
                                        startingValue={handleAverageTotalScore()}
                                    />

                                    <Text size={'body3'} ml={spacings.tiny}>
                                        {handleAverageTotalScore()}/5
                                    </Text>
                                </View>
                                <Text size={'body3'}>
                                    {reviewsSummary.reduce(
                                        (num, cur) => num + parseInt(cur.num_review),
                                        0
                                    )}{' '}
                                    Đánh giá
                                </Text>
                            </View>
                            {/* filter rating */}
                            <View style={styles.view_wrap_start_filter}>
                                {renderListStarFilter()}
                            </View>
                            {/* order filter */}
                            <View flexDirect="row" style={styles.view_order_filter}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[
                                        styles.touch_filter,
                                        checkAllReviewParam ? styles.touch_filter_selected : {},
                                    ]}
                                    onPress={setOtherParamsReview('all')}
                                >
                                    <Text
                                        color={
                                            checkAllReviewParam
                                                ? colors.main['600']
                                                : colors.grey_[500]
                                        }
                                    >
                                        Tất cả đánh giá
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[
                                        styles.touch_filter,
                                        hasMediaParam === 'Y' ? styles.touch_filter_selected : {},
                                    ]}
                                    onPress={setOtherParamsReview('has_image')}
                                >
                                    <Text
                                        color={
                                            hasMediaParam === 'Y'
                                                ? colors.main['600']
                                                : colors.grey_[500]
                                        }
                                    >
                                        Có hình ảnh
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                    ListEmptyComponent={<ReviewsSkeleton />}
                    showsVerticalScrollIndicator={false}
                    onEndReachedThreshold={0.5}
                    onEndReached={handleLoadMoreReviews}
                    ListFooterComponent={
                        <LoadingFetchAPI // check xem co lading san pham hk
                            visible={isValidating && !isEmpty(reviews)}
                            size={typography.size(40)}
                            styleView={{
                                height: dimens.scale(50),
                            }}
                            color={colors.main['600']}
                            // titleText={'Đã hết sản phẩm'}
                        />
                    }
                    refreshControl={
                        <RefreshControl
                            onRefresh={refreshList}
                            refreshing={false}
                            colors={[colors.main['600']]}
                        />
                    }
                />
            </AfterInteractions>
        </View>
    );
});

export default ReviewScreen;
