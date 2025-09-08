import { Icon } from '@rneui/themed';
import BottomSheet from 'components/BottomSheet';
import Button from 'components/Button';
import Image from 'components/Image';
import Text from 'components/Text';
import View from 'components/View';
import { useNavigate, useTheme } from 'hooks';
import { ProductReviewResponseType } from 'models';
import React, { memo, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Rating } from 'react-native-ratings';
import useStyles from '../styles';

interface Props {
    review: ProductReviewResponseType;
}

const ReviewItem = memo(function ReviewItem({ review }: Props) {
    //hooks
    const styles = useStyles();
    const navigate = useNavigate();
    const {
        theme: { colors, typography },
    } = useTheme();
    //state
    const [isVisible, setIsVisible] = useState(false);
    //value
    const media: any[] = JSON.parse(review.images || '[]');

    //handle
    const handleVisibleFeedback = () => {
        setIsVisible((pre) => !pre);
    };

    //render

    return (
        <View style={styles.view_wrap_preview_info}>
            <View>
                <View>
                    <Text fw="bold">{review.customer_name}</Text>
                    <View style={styles.view_rating} pl={0}>
                        <Rating
                            ratingCount={5}
                            showRating={false}
                            imageSize={typography.size(12.5)}
                            readonly
                            startingValue={parseInt(review.review_score)}
                        />
                        <Text ml="tiny">{review.review_score}/5</Text>
                    </View>
                    <Text size={'sub2'} color={colors.grey_[400]}>
                        Đánh giá ngày {review.review_date}
                    </Text>
                </View>
                {/* content */}
                <View mt="medium">
                    <Text lh={18}>{review.review_content}</Text>
                </View>
                {/* image */}
                {media.length > 0 ? (
                    <View flexDirect="row" w="100%" mt="small">
                        {media.slice(0, 3).map((v, i) => (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.touch_image}
                                key={i}
                                onPress={navigate.LIST_MEDIA_ROUTE({ media, startIndex: i })}
                            >
                                <Image source={{ uri: v.url }} resizeMode="contain" radius={5} />
                                {v.type === 'video' ? (
                                    <View style={styles.view_video}>
                                        <Icon
                                            type="ionicon"
                                            name="play"
                                            color={colors.white_[10]}
                                        />
                                    </View>
                                ) : null}
                            </TouchableOpacity>
                        ))}
                        {media.length > 3 ? (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.touch_viewmore_image}
                                onPress={navigate.LIST_MEDIA_ROUTE({ media, startIndex: 0 })}
                            >
                                <Text size="body3" color={colors.white_[10]}>
                                    +{media.length - 3}
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                ) : null}
                {/* <Text size={'sub2'} color={ colors.grey_[400]} ta="right" mt="small">
                        Đánh giá ngày {review.review_date}
                    </Text> */}
            </View>

            {/* feedback */}
            <View flexDirect="row" jC="flex-end" mt="small">
                {/* <Button
                    title="Thích"
                    type="clear"
                    color={ colors.grey_[500]}
                    icon={{
                        type: 'antdesign',
                        name: 'like2',
                        size: typography.body2,
                        color: colors.grey_[400],
                    }}
                    titleSize={'body1'}
                    // onPress={handleVisibleFeedback}
                    TouchableComponent={TouchableOpacity}
                /> */}
                <Button
                    title={review.feedback_content ? 'Phản hồi' : 'Chưa có phản hồi'}
                    type="clear"
                    color={review.feedback_content ? colors.grey_[500] : colors.grey_[400]}
                    icon={
                        review.feedback_content
                            ? {
                                  type: 'ionicon',
                                  name: 'chatbubble-ellipses-outline',
                                  size: typography.body2,
                                  color: colors.grey_[400],
                              }
                            : undefined
                    }
                    titleSize={'body1'}
                    // onPress={handleVisibleFeedback}
                    onPress={review.feedback_content ? handleVisibleFeedback : undefined}
                    TouchableComponent={TouchableOpacity}
                />
            </View>
            {/* sheet */}
            <BottomSheet isVisible={isVisible} onBackdropPress={handleVisibleFeedback}>
                <Text fw="bold" ta="center" size={'body2'}>
                    Phản hồi từ gian hàng
                </Text>
                <View style={styles.view_feedback}>
                    <Text lh={20}>{review.feedback_content}.</Text>
                    <Text color={colors.grey_[500]} ta="right" mt="medium">
                        Phản hồi ngày {review.feedback_date}
                    </Text>
                </View>
            </BottomSheet>
            {/* media modal */}
            {/* <MediaModal
                media={media}
                startIndex={indexMediaSelected}
                onClose={openImageModalWithIndex(null)}
            /> */}
        </View>
    );
});

export default ReviewItem;
