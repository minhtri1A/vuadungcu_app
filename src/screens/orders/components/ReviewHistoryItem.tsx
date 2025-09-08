import { Icon } from '@rneui/themed';
import Collapse from 'components/Collapse';
import Image from 'components/Image';
import Text from 'components/Text';
import Touch from 'components/Touch';
import View from 'components/View';
import { useNavigate, useTheme } from 'hooks';
import { CustomerInfoResponseType, CustomerReviewsResponseType } from 'models';
import React, { memo, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { KeyedMutator } from 'swr';
import { themeType } from 'theme';
import ReviewUpdateModal from './ReviewUpdateModal';
/* eslint-disable react-hooks/exhaustive-deps */

interface Props {
    customers: CustomerInfoResponseType;
    review: CustomerReviewsResponseType;
    mutate: KeyedMutator<any>;
}

const constRating = ['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Rất tốt'];

const ReviewHistoryItem = memo(function ReviewHistoryItem({ customers, review, mutate }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const navigate = useNavigate();
    //state
    const [isVisible, setIsVisible] = useState(false);
    //value
    const media: Array<any> = JSON.parse(review.review_images || '[]');

    //effect
    // useEffect(() => {
    //     check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then((result) => {
    //         console.log('result ', result);
    //     });
    //     request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then((result) => {
    //         console.log('result request permission ', result);
    //     });
    // }, []);

    /* --- handle --- */
    const visibleUpdateReviewModal = () => {
        setIsVisible((pre) => !pre);
    };

    return (
        <View style={styles.view_container}>
            {/* customer info */}
            <View flexDirect="row">
                <View flex={0.8} flexDirect="row">
                    <View w={theme.dimens.scale(50)} ratio={1} radius={50}>
                        <Image
                            source={{
                                uri: customers?.image,
                            }}
                            resizeMode="contain"
                            radius={50}
                        />
                    </View>
                    <View ml="small">
                        <Text fw="bold" size={'body2'}>
                            {customers?.fullname}
                        </Text>
                        <View flexDirect="row" aI="flex-end">
                            <AirbnbRating
                                count={5}
                                showRating={false}
                                size={theme.typography.size(10)}
                                reviewColor={theme.colors.main['600']}
                                selectedColor={'#f1c40f'}
                                defaultRating={parseInt(review.review_score)}
                                isDisabled
                                ratingContainerStyle={styles.rating_container_style}
                            />

                            <Text size={'sub2'} style={styles.txt_review_score}>
                                ({constRating[parseInt(review.review_score) - 1]})
                            </Text>
                        </View>
                        <View flexDirect="row">
                            <Text size={'sub2'} color={theme.colors.grey_[500]} fw="bold">
                                Ngày đánh giá
                            </Text>
                            <Text size={'sub2'} color={theme.colors.grey_[500]} ml="tiny">
                                {review.review_date}
                            </Text>
                        </View>
                    </View>
                </View>
                {review.allow_edit === 'Y' ? (
                    <Touch
                        activeOpacity={0.8}
                        style={styles.touch_edit}
                        onPress={visibleUpdateReviewModal}
                    >
                        <Text color={theme.colors.main['600']}>Sửa</Text>
                    </Touch>
                ) : null}
            </View>
            {/* product info */}
            <View style={styles.view_wrap_product_info}>
                <View w={50} ratio={1} radius={2}>
                    <Image
                        source={{
                            uri: review.product_image,
                        }}
                        resizeMode="contain"
                    />
                </View>
                <View flex={1} ml="small">
                    <Text numberOfLines={1} lh={13}>
                        {review.product_name}
                    </Text>
                    <Touch activeOpacity={0.8}>
                        <Text color={theme.colors.grey_[400]} tD="underline">
                            Xem thông tin đơn hàng
                        </Text>
                    </Touch>
                </View>
            </View>
            {/* review info */}
            <View>
                <View style={styles.view_wrap_review_info}>
                    <Text lh={18}>{review.review_content}.</Text>
                    <Text size={'sub2'} color={theme.colors.grey_[400]} ta="right">
                        {review.customer_anonymous === 'Y'
                            ? '(Đã ẩn tên trên đánh giá này)'
                            : '(Hiện tên trên đánh giá này)'}
                    </Text>
                    {media.length > 0 ? (
                        <View mt="small" flexDirect="row">
                            {media.slice(0, 4).map((v, i) => (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.touch_image}
                                    key={i}
                                    onPress={navigate.LIST_MEDIA_ROUTE({ media, startIndex: i })}
                                >
                                    <Image
                                        source={{
                                            uri: v.url,
                                        }}
                                        resizeMode="contain"
                                    />
                                    {v.type === 'video' ? (
                                        <View style={{ position: 'absolute' }}>
                                            <Icon
                                                type="ionicon"
                                                name="play"
                                                color={theme.colors.grey_[200]}
                                            />
                                        </View>
                                    ) : null}
                                </TouchableOpacity>
                            ))}
                            {media.length > 4 ? (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.touch_viewmore_image}
                                    onPress={navigate.LIST_MEDIA_ROUTE({ media, startIndex: 0 })}
                                >
                                    <Text color={theme.colors.white_[10]} size={'body2'}>
                                        +{media.length - 4}
                                    </Text>
                                </TouchableOpacity>
                            ) : null}
                        </View>
                    ) : null}
                </View>
                {/* feedback */}

                <View mv="small">
                    {review.feedback_content ? (
                        <Collapse
                            viewMoreTitle="Xem phản hồi từ shop"
                            initHeight={theme.dimens.verticalScale(30)}
                            color={theme.colors.grey_[400]}
                            viewMoreHeight={theme.dimens.verticalScale(30)}
                            viewLessHeight={theme.dimens.verticalScale(40)}
                            //  onVisibleCollapse={handleVisibleClick}
                            liner={false}
                        >
                            <View style={styles.view_reply}>
                                <Text lh={18} color={theme.colors.grey_[500]}>
                                    {review.feedback_content}
                                </Text>
                                <Text ta="right" size={'sub2'} color={theme.colors.grey_[400]}>
                                    Trả lởi bởi Vua dụng cụ | {review.feedback_date}
                                </Text>
                            </View>
                        </Collapse>
                    ) : (
                        <Text ta="center" mv="small" color={theme.colors.grey_[400]}>
                            Chưa có phản hồi từ gian hàng
                        </Text>
                    )}
                </View>
            </View>
            <ReviewUpdateModal
                isVisible={isVisible}
                review={review}
                mutate={mutate}
                onBackdropPress={visibleUpdateReviewModal}
            />
        </View>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_container: {
            backgroundColor: theme.colors.white_[10],
            padding: theme.spacings.medium,
            paddingBottom: 0,
            width: '100%',
            borderBottomWidth: theme.spacings.small,
            borderBottomColor: theme.colors.grey_[200],
        },
        rating_container_style: {
            alignItems: 'flex-start',
            alignSelf: 'flex-start',
        },
        txt_review_score: { color: '#f1c40f', fontSize: theme.typography.sub2 },
        touch_edit: { flex: 0.2, justifyContent: 'center', alignItems: 'center' },
        view_wrap_product_info: {
            flexDirection: 'row',
            marginVertical: theme.spacings.extraLarge,
            padding: theme.spacings.small,
            borderWidth: 0.7,
            borderColor: theme.colors.grey_[300],
            borderRadius: 10,
        },
        view_wrap_review_info: {
            borderLeftWidth: 3,
            borderColor: theme.colors.main['100'],
            paddingLeft: theme.spacings.small,
            paddingBottom: theme.spacings.default * 0.5,
        },
        touch_image: {
            width: '18%',
            aspectRatio: 1,
            borderRadius: 2,
            borderWidth: 1,
            borderColor: theme.colors.grey_[200],
            marginRight: theme.spacings.small,
            justifyContent: 'center',
            alignItems: 'center',
        },
        touch_viewmore_image: {
            width: '18%',
            aspectRatio: 1,
            borderRadius: 2,
            marginRight: theme.spacings.small,
            backgroundColor: theme.colors.black_[10],
            justifyContent: 'center',
            alignItems: 'center',
        },
        view_reply: {
            backgroundColor: theme.colors.grey_[200],
            padding: theme.spacings.small,
            borderRadius: 5,
        },
        touch_option: {
            paddingHorizontal: theme.spacings.small,
            paddingVertical: 2,
            borderWidth: 1,
            borderColor: theme.colors.grey_[400],
            borderRadius: 10,
            marginRight: theme.spacings.small,
            marginTop: theme.spacings.small,
        },
    });

export default ReviewHistoryItem;
