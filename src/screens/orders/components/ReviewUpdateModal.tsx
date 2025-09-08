import { CheckBox, Icon } from '@rneui/themed';
import BottomSheet from 'components/BottomSheet';
import Divider from 'components/Divider';
import Image from 'components/Image';
import Text from 'components/Text';
import Touch from 'components/Touch';
import Video_ from 'components/Video';
import View from 'components/View';
import { REACT_NATIVE_APP_API_IMAGE } from 'const/env';
import { Status } from 'const/index';
import { useTheme } from 'hooks';
import { delay, last, remove } from 'lodash';
import { CustomerReviewsResponseType } from 'models';
import React, { memo, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    LayoutAnimation,
    Platform,
    StyleSheet,
    TextInput,
    UIManager,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ImagePicker, { ImageOrVideo, Options } from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import { AirbnbRating } from 'react-native-ratings';
import { services } from 'services';
import { KeyedMutator } from 'swr';
import { themeType } from 'theme';
import { formatSecondToTime } from 'utils/helpers';
import { sendSentryError } from 'utils/storeHelpers';
/* eslint-disable react-hooks/exhaustive-deps */

interface Props {
    isVisible: boolean;
    review: CustomerReviewsResponseType;
    mutate: KeyedMutator<CustomerReviewsResponseType[]>;
    onBackdropPress: () => void;
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const constRating = ['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Rất tốt'];

const ReviewUpdateModal = memo(function ReviewUpdateModal({
    isVisible,
    review,
    mutate,
    onBackdropPress,
}: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    //state
    //-- status review
    const [status, setStatus] = useState<string>(Status.DEFAULT);
    const [statusReviewImage, setStatusReviewImage] = useState<string>(Status.DEFAULT);
    const [showMessage, setShowMessage] = useState(false);
    //--rating
    const [rating, setRating] = useState(5);
    const [titleRating, setTitleRating] = useState('Rất tốt');
    const [contentRating, setContentRating] = useState('');
    const [allowShowName, setAllowShowName] = useState(
        review.customer_anonymous === 'N' ? true : false
    );
    //--media
    const [imageMediaType, setImageMediaType] = useState<'image' | 'video' | undefined>(undefined);
    //----image
    const [imageUpdate, setImageUpdate] = useState<
        Array<{ url: string; type: string; media_uuid: string; is_remove: boolean }>
    >([]);
    const [imageSelected, setImagesSelected] = useState<Array<string>>([]);
    //----video
    const [statusImageSelect, setStatusImageSelect] = useState<string>(Status.DEFAULT);
    const [videoUpdate, setVideoUpdate] = useState<{
        url: string;
        type: string;
        media_uuid: string;
        is_remove: boolean;
    }>();
    const [videoSelected, setVideoSelected] = useState<{ name: string; duration: number }>();
    //value
    let videoTemp = '/video/temp';
    const videoUrl =
        videoUpdate && !videoUpdate.is_remove
            ? videoUpdate.url
            : videoSelected
            ? `${REACT_NATIVE_APP_API_IMAGE}/${videoTemp}/${videoSelected?.name}`
            : undefined;
    let countDeleteMedia = imageUpdate.reduce(
        (pre, current) => (current.is_remove ? pre + 1 : pre),
        0
    );
    countDeleteMedia += videoUpdate && videoUpdate?.is_remove ? 1 : 0;

    let countAddMedia = imageSelected.length + (videoSelected !== undefined ? 1 : 0);

    /* --- effect --- */
    useEffect(() => {
        if (review && isVisible) {
            const media: Array<any> = JSON.parse(review.review_images);
            const video = remove(media, (v) => v.type === 'video');
            setImageUpdate(media || []);
            setVideoUpdate(video[0] || undefined);
            setContentRating(review.review_content);
            setRating(parseInt(review.review_score));
        }
        //reset state when close modal
        if (!isVisible) {
            setImageMediaType(undefined);
            setVideoSelected(undefined);
            setImagesSelected([]);
            setStatus(Status.DEFAULT);
            setStatusReviewImage(Status.DEFAULT);
        }
    }, [review, isVisible]);

    //--show message update
    useEffect(() => {
        if (
            status === Status.ERROR ||
            status === Status.SUCCESS ||
            statusReviewImage === Status.SUCCESS ||
            statusReviewImage === Status.ERROR
        ) {
            LayoutAnimation.configureNext({
                duration: 500,
                update: { type: 'spring', property: 'opacity', springDamping: 0.8 },
            });

            setShowMessage(true);
            delay(() => {
                setStatus(Status.DEFAULT);
                setStatusReviewImage(Status.DEFAULT);
                LayoutAnimation.configureNext({
                    duration: 500,
                    update: { type: 'spring', property: 'opacity', springDamping: 0.8 },
                });
                setShowMessage(false);
            }, 3000);
        }
    }, [status, statusReviewImage]);

    /* --- api --- */
    const updateReviewBasicInfoApi = async () => {
        try {
            setStatus(Status.LOADING);
            //update basic info
            const result = await services.customer.updateProductReview(review.review_uuid, {
                customer_anonymous: allowShowName ? 'N' : 'Y',
                review_score: rating,
                review_content: contentRating,
            });
            if (result.result === 'SUCCESS') {
                setStatus(Status.SUCCESS);
                //
                mutate();
            } else {
                throw result.code;
            }
        } catch (error) {
            setStatus(Status.ERROR);
            sendSentryError(error, 'updateReviewBasicInfoApi*');
        }
    };

    const updateReviewMediaApi = async () => {
        try {
            setStatusReviewImage(Status.LOADING);
            //add
            if (countAddMedia > 0) {
                //add video
                if (videoSelected) {
                    const result = await services.customer.updateProductReview(review.review_uuid, {
                        action: 'add_media',
                        type: 'video',
                        media: videoSelected.name,
                    });
                    if (result.result !== 'SUCCESS') {
                        throw result.code;
                    }
                    //reset video selected
                    setVideoSelected(undefined);
                }
                //add image
                if (imageSelected.length > 0) {
                    for (const imageBase64 of imageSelected) {
                        const result = await services.customer.updateProductReview(
                            review.review_uuid,
                            {
                                action: 'add_media',
                                type: 'image',
                                media: imageBase64,
                            }
                        );
                        if (result.result !== 'SUCCESS') {
                            throw result.code;
                        }
                    }
                    //reset image selected
                    setImagesSelected([]);
                }
                mutate();
                setStatusReviewImage(Status.SUCCESS);
                return;
            }

            //delete
            if (countDeleteMedia > 0) {
                //delete video
                if (videoUpdate && videoUpdate?.is_remove) {
                    const result = await services.customer.updateProductReview(review.review_uuid, {
                        action: 'delete_media',
                        media_uuid: videoUpdate.media_uuid,
                    });
                    if (result.result !== 'SUCCESS') {
                        throw result.code;
                    }
                }
                //delete image
                if (imageUpdate) {
                    for (const image of imageUpdate) {
                        if (image.is_remove) {
                            const result = await services.customer.updateProductReview(
                                review.review_uuid,
                                {
                                    action: 'delete_media',
                                    media_uuid: image.media_uuid,
                                }
                            );
                            if (result.result !== 'SUCCESS') {
                                throw result.code;
                            }
                        }
                    }
                }
                mutate();
                setStatusReviewImage(Status.SUCCESS);
            }

            //mutate review data
        } catch (error) {
            setStatusReviewImage(Status.ERROR);
            sendSentryError(error, 'updateReviewMediaApi*');
        }
    };

    /* --- handle --- */
    //--rating
    const handleFinishRating = (rating_: number) => {
        setRating(rating_);
        setTitleRating(constRating[rating_ - 1]);
    };

    const handleChangeContentRatingInput = (text: string) => {
        setContentRating(text);
    };

    const handleChangeContentRatingTemplate = (text: string) => () => {
        setContentRating((pre) => (pre !== '' ? `${pre}, ${text}` : text));
    };

    const toggleAllowShowName = () => {
        setAllowShowName((pre) => !pre);
    };
    //--media
    const visibleImageSelectType = (media_type?: 'image' | 'video') => () => {
        setImageMediaType(media_type);
    };

    const toggleImagePicker =
        (media_type: 'image' | 'video', select_type: 'camera' | 'gallery') => async () => {
            setImageMediaType(undefined);
            const option: Options = {
                width: theme.dimens.scale(300),
                height: theme.dimens.scale(300),
                cropping: false,
                useFrontCamera: true,
                cropperToolbarTitle: 'Chọn hình ảnh / video chat',
                cropperCircleOverlay: true,
                showCropGuidelines: false,
                mediaType: media_type === 'video' ? 'video' : 'any',
                includeBase64: true,
                multiple: media_type === 'image' ? true : false,
                hideBottomControls: true,
            };
            try {
                if (select_type === 'camera') {
                    ImagePicker.openCamera(option)
                        .then((image) => {
                            handleUploadImageVideo([image]);
                        })
                        .catch((e) => {
                            if (e.code !== 'E_PICKER_CANCELLED') {
                            }
                        });
                } else {
                    ImagePicker.openPicker(option)
                        .then((image) => {
                            handleUploadImageVideo(media_type === 'image' ? image : [image]);
                        })
                        .catch((e) => {
                            if (e.code !== 'E_PICKER_CANCELLED') {
                            }
                        });
                }
            } catch (error) {
                // setStatusImageSelect(Status.DEFAULT);
                sendSentryError(error, 'toggleImagePicker Review item');
            }
        };

    const handleUploadImageVideo = (image: any) => {
        const image_: Array<ImageOrVideo> = image as any;
        image_.forEach(async (value) => {
            const media_type = value.mime.split('/')[0];
            if (media_type === 'image') {
                const imgBase64 = (value as any).data;
                const imageData = `data:${value.mime};base64,${imgBase64}`;
                setImagesSelected((pre) => [...pre, imageData]);
            }
            if (media_type === 'video') {
                setStatusImageSelect(Status.LOADING);
                let formData = new FormData();
                formData.append('file', {
                    uri: value.path,
                    type: value.mime,
                    size: value.size,
                    name: last(value.path.split('/')),
                });

                const result = await services.admin.uploadImageTemp(formData);

                if (result.code === 'SUCCESS') {
                    const videoSplit = result.video.split('/');
                    const name = last(videoSplit) || '';
                    videoSplit.pop();
                    videoTemp = videoSplit.join('/');
                    setVideoSelected({ name, duration: (value as any).duration });
                    //delete old video
                    if (!videoUpdate?.is_remove) {
                        setVideoUpdate((pre) => (pre ? { ...pre, is_remove: true } : undefined));
                    }
                    setStatusImageSelect(Status.DEFAULT);
                } else {
                    setStatusImageSelect(Status.ERROR);
                }
            }
        });
    };

    const handleDeleteMedia = (type: 'video' | 'image' | 'image_base64', index?: number) => () => {
        if (type === 'video') {
            if (videoSelected) {
                setVideoSelected(undefined);
                return;
            }
            setVideoUpdate((pre) => (pre ? { ...pre, is_remove: true } : undefined));
            return;
        }
        //image update
        if (type === 'image' && index !== undefined) {
            setImageUpdate((pre) => {
                let pre_ = [...pre];
                pre_[index].is_remove = true;
                return pre_;
            });
        }
        //new image
        if (type === 'image_base64' && index !== undefined) {
            setImagesSelected((pre) => {
                let pre_ = [...pre];
                pre_.splice(index, 1);
                return pre_;
            });
        }
    };

    const handleRestoreReviewMediaDeleted = () => {
        if (imageUpdate.length > 0) {
            setImageUpdate((pre) => pre.map((v, i) => ({ ...v, is_remove: false })));
        }
        if (videoUpdate) {
            setVideoUpdate((pre) => (pre ? { ...pre, is_remove: false } : pre));
        }
    };

    //render
    const renderContentRatingTemplate = (text: string) => (
        <Touch style={styles.touch_option} onPress={handleChangeContentRatingTemplate(text)}>
            <Text size="sub3" color={theme.colors.grey_[400]}>
                {text}
            </Text>
        </Touch>
    );

    return (
        <BottomSheet
            isVisible={isVisible}
            onBackdropPress={onBackdropPress}
            triggerOnClose={onBackdropPress}
            radius
            viewContainerStyle={{
                paddingHorizontal: theme.spacings.medium - 10,
            }}
        >
            {/* order review */}
            <View jC="center" aI="center">
                <Text fw="bold" mb={'medium'}>
                    Cập nhật đánh giá
                </Text>
                {/* update ui */}
                <View style={styles.view_update_container}>
                    {/* product preview */}
                    <View>
                        {/* product info */}
                        <View style={styles.view_product_info}>
                            <View flex={0.15} ratio={1}>
                                <Image
                                    source={{
                                        uri: review.product_image,
                                    }}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text flex={0.9} ml="tiny" size={'sub3'}>
                                {review.product_name}
                            </Text>
                        </View>
                    </View>
                    {/* message */}
                    {showMessage ? (
                        <View
                            style={styles.view_message}
                            bg={
                                status === Status.SUCCESS || statusReviewImage === Status.SUCCESS
                                    ? theme.colors.green['200']
                                    : theme.colors.red['200']
                            }
                        >
                            <Icon
                                type="ionicon"
                                name={
                                    status === Status.SUCCESS ||
                                    statusReviewImage === Status.SUCCESS
                                        ? 'checkmark-circle'
                                        : 'close-circle'
                                }
                                color={
                                    status === Status.SUCCESS ||
                                    statusReviewImage === Status.SUCCESS
                                        ? theme.colors.green['500']
                                        : theme.colors.red['500']
                                }
                            />
                            <Text
                                ml="tiny"
                                color={
                                    status === Status.SUCCESS ||
                                    statusReviewImage === Status.SUCCESS
                                        ? 'green'
                                        : 'red'
                                }
                            >
                                {status === Status.SUCCESS
                                    ? 'Cập nhật đánh giá thành công!'
                                    : status === Status.ERROR
                                    ? 'Cập nhật đánh giá thất bại. Vui lòng thử lại!'
                                    : statusReviewImage === Status.SUCCESS
                                    ? 'Cập nhật hình ảnh thành công'
                                    : 'Cập nhật hình ảnh thất bại. Vui lòng thử lại'}
                            </Text>
                        </View>
                    ) : null}

                    {/* info */}
                    <View mt="small" w="100%" aI="stretch">
                        {/* preview */}
                        <View aI="center">
                            <Text color={theme.colors.grey_[500]} size={'body3'}>
                                {titleRating}
                            </Text>
                            <AirbnbRating
                                count={5}
                                showRating={false}
                                size={theme.typography.size(25)}
                                reviewColor={theme.colors.main['600']}
                                selectedColor={'#f1c40f'}
                                defaultRating={rating}
                                onFinishRating={handleFinishRating}
                            />
                            <View style={styles.view_content_template}>
                                <ScrollView horizontal>
                                    {renderContentRatingTemplate('Chất lượng tốt - giá hợp lý')}
                                    {renderContentRatingTemplate('Chăm sóc khách hàng nhiệt tình')}
                                    {renderContentRatingTemplate(
                                        'Sản phẩm như mô tả - đẹp và tiện lợi'
                                    )}
                                    {renderContentRatingTemplate(
                                        'Giao hàng nhanh - đóng gói cẩn thận'
                                    )}
                                    {renderContentRatingTemplate('Chất lượng tốt - giá hợp lý')}
                                </ScrollView>
                            </View>
                            {/* input */}
                            <View style={styles.view_wrap_input}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        width: '100%',
                                        paddingHorizontal: theme.spacings.small,
                                        borderBottomWidth: 1,
                                        borderBottomColor: theme.colors.grey_[200],
                                    }}
                                    flexDirect="row"
                                    aI="center"
                                    w="100%"
                                    ph="small"
                                >
                                    <Touch
                                        flex={1}
                                        flexDirect="row"
                                        aI="center"
                                        mv="small"
                                        onPress={toggleAllowShowName}
                                    >
                                        <CheckBox
                                            checked={allowShowName}
                                            containerStyle={theme.styles.checkbox_container}
                                            size={theme.typography.title3}
                                            iconType={'ionicon'}
                                            checkedIcon="checkbox"
                                            uncheckedIcon="square-outline"
                                            uncheckedColor={theme.colors.grey_[500]}
                                            checkedColor={theme.colors.main['600']}
                                            onPress={toggleAllowShowName}
                                        />

                                        <Text p="small" color={theme.colors.grey_[500]}>
                                            Hiện tên của bạn
                                        </Text>
                                    </Touch>
                                    {status === Status.LOADING ? (
                                        <View>
                                            <ActivityIndicator
                                                color={theme.colors.main['600']}
                                                size={theme.typography.size(20)}
                                            />
                                        </View>
                                    ) : (
                                        <Touch onPress={updateReviewBasicInfoApi}>
                                            <Text color={theme.colors.main['600']}>Gửi</Text>
                                        </Touch>
                                    )}
                                </View>
                                <TextInput
                                    value={contentRating}
                                    placeholder="Đánh giá sản phẩm..."
                                    placeholderTextColor={theme.colors.grey_[400]}
                                    multiline
                                    numberOfLines={10}
                                    style={styles.input_style}
                                    textBreakStrategy="highQuality"
                                    onChangeText={handleChangeContentRatingInput}
                                />
                            </View>

                            {/* image */}
                            <View style={styles.view_wrap_img}>
                                {/* current media */}
                                {statusImageSelect === Status.LOADING ||
                                videoUrl !== undefined ||
                                imageSelected.length > 0 ||
                                imageUpdate.length > 0 ? (
                                    <View p="small">
                                        <View
                                            flexDirect="row"
                                            mb="small"
                                            jC="space-between"
                                            aI="center"
                                        >
                                            <View>
                                                <Text
                                                    color={theme.colors.grey_[500]}
                                                    size={'body2'}
                                                >
                                                    Hình ảnh, video
                                                </Text>
                                                {countDeleteMedia > 0 ? (
                                                    <Text size="sub2" ta="center" color="red">
                                                        (Đã chọn xoá {countDeleteMedia} hình ảnh)
                                                    </Text>
                                                ) : null}
                                                {countAddMedia > 0 ? (
                                                    <Text size="sub2" ta="center" color="red">
                                                        (Đã chọn thêm {countAddMedia} hình ảnh)
                                                    </Text>
                                                ) : null}
                                            </View>

                                            {statusReviewImage === Status.LOADING ? (
                                                <View>
                                                    <ActivityIndicator
                                                        color={theme.colors.main['600']}
                                                        size={theme.typography.size(20)}
                                                    />
                                                </View>
                                            ) : (
                                                <View flexDirect="row">
                                                    {countDeleteMedia > 0 ? (
                                                        <>
                                                            <Touch
                                                                onPress={
                                                                    handleRestoreReviewMediaDeleted
                                                                }
                                                            >
                                                                <Text
                                                                    color={theme.colors.grey_[500]}
                                                                >
                                                                    Khôi phục
                                                                </Text>
                                                            </Touch>
                                                            <Text
                                                                mh="tiny"
                                                                color={theme.colors.grey_[400]}
                                                            >
                                                                |
                                                            </Text>
                                                        </>
                                                    ) : null}
                                                    <Touch onPress={updateReviewMediaApi}>
                                                        <Text color={theme.colors.main['600']}>
                                                            Gửi
                                                        </Text>
                                                    </Touch>
                                                </View>
                                            )}
                                        </View>
                                        <View style={styles.view_wrap_media}>
                                            {/* current video */}
                                            {statusImageSelect === Status.LOADING ? (
                                                <View
                                                    w={theme.dimens.scale(45)}
                                                    ratio={1}
                                                    mr={'small'}
                                                >
                                                    <ActivityIndicator />
                                                </View>
                                            ) : videoUpdate && !videoUpdate?.is_remove ? (
                                                <View style={styles.view_media}>
                                                    <Video_
                                                        source={{
                                                            uri: videoUpdate.url,
                                                        }}
                                                        autoplay={false}
                                                        disableOption
                                                    />
                                                    {countAddMedia < 1 ? (
                                                        <Touch
                                                            style={styles.touch_close_image}
                                                            onPress={handleDeleteMedia('video')}
                                                        >
                                                            <Icon
                                                                type="ionicon"
                                                                name="close"
                                                                color={theme.colors.white_[10]}
                                                                size={theme.typography.size(10)}
                                                            />
                                                        </Touch>
                                                    ) : null}

                                                    <View style={styles.view_video_icon}>
                                                        <Icon
                                                            type="ionicon"
                                                            name="videocam"
                                                            color={theme.colors.white_[10]}
                                                            size={theme.typography.size(10)}
                                                        />
                                                        {videoSelected?.duration ? (
                                                            <Text
                                                                size="sub1"
                                                                color={theme.colors.white_[10]}
                                                            >
                                                                {formatSecondToTime(
                                                                    videoSelected?.duration / 1000,
                                                                    'minutes'
                                                                )}
                                                            </Text>
                                                        ) : null}
                                                    </View>
                                                </View>
                                            ) : null}
                                            {/* current image */}
                                            {imageUpdate.map((v, i) =>
                                                !v.is_remove ? (
                                                    <View key={i} style={styles.view_media}>
                                                        <Image
                                                            source={{
                                                                uri: v.url,
                                                            }}
                                                            resizeMode="contain"
                                                        />
                                                        {countAddMedia < 1 ? (
                                                            <Touch
                                                                style={styles.touch_close_image}
                                                                onPress={handleDeleteMedia(
                                                                    'image',
                                                                    i
                                                                )}
                                                            >
                                                                <Icon
                                                                    type="ionicon"
                                                                    name="close"
                                                                    color={theme.colors.white_[10]}
                                                                    size={theme.typography.size(10)}
                                                                />
                                                            </Touch>
                                                        ) : null}
                                                    </View>
                                                ) : null
                                            )}
                                        </View>
                                    </View>
                                ) : null}

                                {/* new media */}
                                {countAddMedia > 0 ? (
                                    <View
                                        style={{
                                            borderTopWidth: 1,
                                            flexDirection: 'row',
                                            borderTopColor: theme.colors.grey_[200],
                                            paddingHorizontal: theme.spacings.small,
                                            paddingBottom: theme.spacings.small,
                                            backgroundColor: theme.colors.grey_[300],
                                            marginTop: theme.spacings.small,
                                        }}
                                    >
                                        {/* new video */}
                                        {statusImageSelect === Status.LOADING ? (
                                            <View w={theme.dimens.scale(45)} ratio={1} mr={'small'}>
                                                <ActivityIndicator />
                                            </View>
                                        ) : videoSelected ? (
                                            <View style={styles.view_media}>
                                                <Video_
                                                    source={{
                                                        uri: `${REACT_NATIVE_APP_API_IMAGE}/${videoTemp}/${videoSelected?.name}`,
                                                    }}
                                                    autoplay={false}
                                                    disableOption
                                                />
                                                <Touch
                                                    style={styles.touch_close_image}
                                                    onPress={handleDeleteMedia('video')}
                                                >
                                                    <Icon
                                                        type="ionicon"
                                                        name="close"
                                                        color={theme.colors.white_[10]}
                                                        size={theme.typography.size(10)}
                                                    />
                                                </Touch>
                                                <View style={styles.view_video_icon}>
                                                    <Icon
                                                        type="ionicon"
                                                        name="videocam"
                                                        color={theme.colors.white_[10]}
                                                        size={theme.typography.size(10)}
                                                    />
                                                    {videoSelected?.duration ? (
                                                        <Text
                                                            size="sub1"
                                                            color={theme.colors.white_[10]}
                                                        >
                                                            {formatSecondToTime(
                                                                videoSelected?.duration / 1000,
                                                                'minutes'
                                                            )}
                                                        </Text>
                                                    ) : null}
                                                </View>
                                            </View>
                                        ) : null}
                                        {/* new image */}
                                        {imageSelected.map((v, i) => (
                                            <Touch
                                                activeOpacity={1}
                                                key={i}
                                                style={styles.view_media}
                                                // onPress={navigate.LIST_MEDIA_ROUTE({
                                                //     media,
                                                //     startIndex: 0,
                                                // })}
                                            >
                                                <Image
                                                    source={{
                                                        uri: v,
                                                    }}
                                                    resizeMode="contain"
                                                />
                                                <Touch
                                                    style={styles.touch_close_image}
                                                    onPress={handleDeleteMedia('image_base64', i)}
                                                >
                                                    <Icon
                                                        type="ionicon"
                                                        name="close"
                                                        color={theme.colors.white_[10]}
                                                        size={theme.typography.size(10)}
                                                    />
                                                </Touch>
                                            </Touch>
                                        ))}
                                    </View>
                                ) : null}

                                {/* btn add image or video */}
                                <View
                                    style={styles.view_add_media}
                                    flexDirect="row"
                                    jC="space-evenly"
                                    pv="tiny"
                                >
                                    <Touch
                                        activeOpacity={0.8}
                                        onPress={visibleImageSelectType('image')}
                                        disabled={countDeleteMedia > 0}
                                    >
                                        <Icon
                                            type="ionicon"
                                            name="image"
                                            color={
                                                countDeleteMedia > 0
                                                    ? theme.colors.grey_[400]
                                                    : theme.colors.grey_[500]
                                            }
                                        />
                                        <Text
                                            color={
                                                countDeleteMedia > 0
                                                    ? theme.colors.grey_[400]
                                                    : theme.colors.grey_[500]
                                            }
                                            size={'sub3'}
                                        >
                                            Thêm hình ảnh
                                        </Text>
                                    </Touch>
                                    <Touch
                                        activeOpacity={0.8}
                                        onPress={visibleImageSelectType('video')}
                                        disabled={
                                            countDeleteMedia > 0 || videoSelected !== undefined
                                        }
                                    >
                                        <Icon
                                            type="ionicon"
                                            name="videocam"
                                            color={
                                                videoSelected !== undefined || countDeleteMedia > 0
                                                    ? theme.colors.grey_[400]
                                                    : theme.colors.grey_[500]
                                            }
                                        />
                                        <Text
                                            color={
                                                countDeleteMedia > 0
                                                    ? theme.colors.grey_[400]
                                                    : theme.colors.grey_[500]
                                            }
                                            size={'sub3'}
                                        >
                                            Thêm Video
                                        </Text>
                                    </Touch>
                                </View>
                            </View>
                        </View>

                        {/* check */}
                        {/* <Touch flexDirect="row" aI="center" mv="small">
                            <CheckBox
                                checked={allowShowName}
                                containerStyle={theme.styles.checkbox_container}
                                size={theme.typography.title3}
                                iconType={'ionicon'}
                                checkedIcon="checkbox"
                                uncheckedIcon="square-outline"
                                uncheckedColor={theme.colors.grey_[500]}
                                checkedColor={theme.colors.main["600"]}
                                onPress={toggleAllowShowName}
                            />

                            <Text p="small" color={theme.colors.grey_[500]}>
                                Hiện tên của bạn trên đánh giá
                            </Text>
                        </Touch> */}
                        {/* <View>
                            {status === Status.LOADING ? (
                                <View>
                                    <ActivityIndicator
                                        color={theme.colors.main["600"]}
                                        size={theme.typography.size(20)}
                                    />
                                </View>
                            ) : (
                                <Button
                                    title="Cập nhật đánh giá"
                                    onPress={handleUpdateProductReviewApi}
                                    loading={status === Status.LOADING}
                                    disabled={status === Status.LOADING}
                                />
                            )}
                        </View> */}
                    </View>

                    {/* select image modal */}
                    <Modal
                        isVisible={imageMediaType !== undefined}
                        backdropOpacity={0.2}
                        onBackdropPress={visibleImageSelectType()}
                        useNativeDriver={true}
                    >
                        <View style={styles.view_modal_select_option}>
                            <Touch
                                activeOpacity={0.8}
                                p={'medium'}
                                aI="center"
                                onPress={toggleImagePicker(imageMediaType as any, 'gallery')}
                            >
                                <Text color={theme.colors.grey_[500]}>Mở thư viện</Text>
                            </Touch>
                            <Divider height={1} />
                            <Touch
                                activeOpacity={0.8}
                                p="medium"
                                aI="center"
                                onPress={toggleImagePicker(imageMediaType as any, 'camera')}
                            >
                                <Text color={theme.colors.grey_[500]}>Mở Camera</Text>
                            </Touch>
                            <Divider height={1} />
                            <Touch
                                activeOpacity={0.8}
                                p="medium"
                                aI="center"
                                onPress={visibleImageSelectType()}
                            >
                                <Text color={theme.colors.grey_[400]}>Đóng</Text>
                            </Touch>
                        </View>
                    </Modal>
                </View>
            </View>
        </BottomSheet>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_update_container: {
            backgroundColor: theme.colors.white_[10],
            marginHorizontal: 10,
            minHeight: 200,
        },
        view_product_info: {
            flexDirection: 'row',
            backgroundColor: theme.colors.main['50'],
            padding: theme.spacings.small,
            borderRadius: 5,
            marginBottom: theme.spacings.medium,
        },
        view_content_template: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: theme.spacings.small,
        },
        view_wrap_input: {
            marginTop: theme.spacings.small,
            width: '100%',
            backgroundColor: theme.colors.grey_[100],
            borderWidth: 1,
            borderColor: theme.colors.grey_[200],
            borderRadius: 5,
            alignItems: 'stretch',
        },
        view_wrap_img: {
            marginTop: theme.spacings.medium,
            width: '100%',
            backgroundColor: theme.colors.grey_[100],
            borderWidth: 1,
            borderColor: theme.colors.grey_[200],
            borderRadius: 5,
            alignItems: 'stretch',
        },
        input_style: {
            height: 160,
            textAlignVertical: 'top',
            color: theme.colors.grey_[500],
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
        view_wrap_media: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        view_media: {
            width: theme.dimens.scale(45),
            aspectRatio: 1,
            backgroundColor: theme.colors.grey_[400],
            marginRight: theme.spacings.small,
            borderRadius: 5,
            overflow: 'hidden',
            marginTop: theme.spacings.small,
        },
        touch_close_image: {
            padding: theme.spacings.default * 0.2,
            backgroundColor: theme.colors.black_[10],
            position: 'absolute',
            top: 0,
            right: 0,
            borderTopRightRadius: 5,
            borderBottomLeftRadius: 1,
        },
        view_video_icon: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            position: 'absolute',
            padding: theme.spacings.default * 0.2,
            backgroundColor: theme.colors.black_[10],
            bottom: 0,
            left: 0,
            right: 0,
        },
        view_add_media: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            paddingVertical: theme.spacings.tiny,
            borderTopWidth: 1,
            borderTopColor: theme.colors.grey_[200],
        },
        view_modal_select_option: {
            backgroundColor: theme.colors.white_[10],
            paddingHorizontal: theme.spacings.small,
            borderRadius: 5,
        },
        view_message: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: theme.spacings.small,
        },
    });

export default ReviewUpdateModal;
