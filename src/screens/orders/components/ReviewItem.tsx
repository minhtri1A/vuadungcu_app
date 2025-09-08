import { CheckBox, Icon } from '@rneui/themed';
import Alert from 'components/Alert';
import Button from 'components/Button';
import Divider from 'components/Divider';
import Image from 'components/Image';
import Text from 'components/Text';
import Touch from 'components/Touch';
import Video_ from 'components/Video';
import View from 'components/View';
import { REACT_NATIVE_APP_API_IMAGE } from 'const/env';
import { Status } from 'const/index';
import { orderStatus } from 'const/order';
import { SET_INDEX_ORDER_TAB } from 'features/action';
import { useAppDispatch, useTheme } from 'hooks';
import { last } from 'lodash';
import { OrderItemsType } from 'models';
import React, { memo, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import ImagePicker, { ImageOrVideo, Options } from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import { PERMISSIONS, check } from 'react-native-permissions';
import { AirbnbRating } from 'react-native-ratings';
import { services } from 'services';
import { themeType } from 'theme';
import { formatSecondToTime } from 'utils/helpers';
import { sendSentryError } from 'utils/storeHelpers';
/* eslint-disable react-hooks/exhaustive-deps */

interface Props {
    orderItem: OrderItemsType;
    flatlistRef: React.RefObject<any>;
    index: number;
    length: number;
}

const constRating = ['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Rất tốt'];

const ReviewItem = memo(function ReviewItem({ orderItem, flatlistRef, index, length }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const dispatch = useAppDispatch();
    //state
    //-- status review
    const [status, setStatus] = useState<string>(Status.DEFAULT);
    const [message, setMessage] = useState<string>('');
    const [openAlert, setOpenAlert] = useState(false);
    //--rating
    const [rating, setRating] = useState(5);
    const [titleRating, setTitleRating] = useState('Rất tốt');
    const [contentRating, setContentRating] = useState('');
    const [allowShowName, setAllowShowName] = useState(true);
    //--image
    const [imageMediaType, setImageMediaType] = useState<'image' | 'video' | undefined>(undefined);
    const [statusImageSelect, setStatusImageSelect] = useState<string>(Status.DEFAULT);
    const [listImageSelected, setListImageSelected] = useState<Array<string>>([]);
    const [videoSelected, setVideoSelected] = useState<{ name: string; duration: number }>();
    //value
    let videoTemp = '/video/temp';

    /* --- effect --- */

    useEffect(() => {
        check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then((_) => {});
    }, []);

    useEffect(() => {
        if (status === Status.SUCCESS || status === Status.ERROR) {
            setVisibleAlert();
        }
    }, [status]);

    /* --- api --- */
    const createProductReviewApi = async () => {
        try {
            setStatus(Status.LOADING);
            const result = await services.customer.createProductPreview({
                order_uuid: orderItem.order_uuid,
                product_seller_uuid: orderItem.product_seller_uuid,
                review_score: rating,
                review_content: contentRating,
                image: listImageSelected.length > 0 ? JSON.stringify(listImageSelected) : undefined,
                video: videoSelected?.name,
                customer_anonymous: allowShowName ? 'N' : 'Y',
            });
            if (result.result === 'SUCCESS') {
                setStatus(Status.SUCCESS);
                setMessage('Đánh giá sản phẩm thành công. Cảm ơn bạn đã đánh giá sản phẩm!');
                return;
            }
            sendSentryError(result, 'createProductReviewApi');
            setStatus(Status.ERROR);
            setMessage('Đánh giá sản phẩm thất bại. Vui lòng thử lại sau!');
        } catch (error) {
            sendSentryError(error, 'createProductReviewApi');
            setMessage('Đã xảy ra lỗi khi đánh giá. Vui lòng thử lại sau!');
            setStatus(Status.ERROR);
        }
    };
    /* --- handle --- */
    const setVisibleAlert = () => {
        setOpenAlert((pre) => !pre);
    };
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
    //--image

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
                setListImageSelected((pre) => [...pre, imageData]);
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
                    setStatusImageSelect(Status.DEFAULT);
                } else {
                    setStatusImageSelect(Status.ERROR);
                }
            }
        });
    };

    //--affter preview

    const scrolltoNextProductReview = () => {
        if (length > 1 && index < length - 1) {
            flatlistRef.current?.scrollToIndex({ index: index + 1, animated: true });
        }
    };

    const gotoReviewHistory = () => {
        const indexTab = orderStatus.findIndex((v) => v.key === 'preview-history');
        dispatch(SET_INDEX_ORDER_TAB(indexTab));
    };

    //render
    const renderContentRatingTemplate = (text: string) => (
        <TouchableOpacity
            style={styles.touch_option}
            onPress={handleChangeContentRatingTemplate(text)}
        >
            <Text size="sub3" color={theme.colors.grey_[400]}>
                {text}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.view_container}>
            {/* product preview */}
            <View>
                {/* product info */}
                <View style={styles.view_product_info}>
                    <View flex={0.15} ratio={1}>
                        <Image
                            source={{
                                uri: orderItem.image,
                            }}
                            resizeMode="contain"
                        />
                    </View>
                    <Text flex={0.9} ml="tiny" size={'sub3'}>
                        {orderItem.name}
                    </Text>
                </View>
            </View>
            {status === Status.SUCCESS && !openAlert ? (
                <View aI="center" mt="medium">
                    <View style={styles.view_icon_success}>
                        <Icon
                            type="material-community"
                            name="star-check"
                            color={theme.colors.main['600']}
                            size={theme.typography.size(40)}
                        />
                    </View>
                    <Text color={theme.colors.main['600']} size={'title1'} mt="tiny">
                        Đánh giá thành công
                    </Text>
                    <Text ta="center" color={theme.colors.grey_[500]}>
                        Đánh giá sản phẩm thành công, cảm ơn bạn đã mua hàng và đánh giá sản phẩm.
                    </Text>
                    <View flexDirect="row" mt="large" jC="space-evenly">
                        {/* <Touch mr="medium">
                            <Text color={theme.colors.grey_[400]}>Xem lại đánh giá</Text>
                        </Touch>
                        <Touch>
                            <Text color={theme.colors.main['600']}>Tiếp tục đánh giá</Text>
                        </Touch> */}
                        <View mr="medium">
                            <Button
                                title={'Xem lại đánh giá'}
                                titleSize={'body1'}
                                type={length > 1 && index < length - 1 ? 'outline' : 'solid'}
                                color={
                                    length > 1 && index < length - 1
                                        ? theme.colors.main['600']
                                        : theme.colors.white_[10]
                                }
                                onPress={gotoReviewHistory}
                            />
                        </View>
                        {length > 1 && index < length - 1 ? (
                            <Button
                                title={'Tiếp tục đánh giá'}
                                titleSize={'body1'}
                                onPress={scrolltoNextProductReview}
                            />
                        ) : null}
                    </View>
                </View>
            ) : (
                <View mt="small" w="100%">
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
                                {renderContentRatingTemplate('Giao hàng nhanh - đóng gói cẩn thận')}
                                {renderContentRatingTemplate('Chất lượng tốt - giá hợp lý')}
                            </ScrollView>
                        </View>
                        <View mt="small" w={'100%'} style={styles.view_wrap_input}>
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
                            {/* show image or video */}
                            {statusImageSelect === Status.LOADING ||
                            videoSelected !== undefined ||
                            listImageSelected.length > 0 ? (
                                <View p="small">
                                    <Text color={theme.colors.grey_[400]}>Hình ảnh, video</Text>
                                    <View flexDirect="row" mt="small">
                                        {statusImageSelect === Status.LOADING ? (
                                            <View w={theme.dimens.scale(45)} ratio={1} mr={'small'}>
                                                <ActivityIndicator />
                                            </View>
                                        ) : videoSelected !== undefined ? (
                                            <View style={styles.view_media}>
                                                <Video_
                                                    source={{
                                                        uri: `${REACT_NATIVE_APP_API_IMAGE}/${videoTemp}/${videoSelected?.name}`,
                                                    }}
                                                    autoplay={false}
                                                    disableOption
                                                />
                                                <Touch style={styles.touch_close_image}>
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
                                                    <Text
                                                        size="sub1"
                                                        color={theme.colors.white_[10]}
                                                    >
                                                        {formatSecondToTime(
                                                            videoSelected?.duration / 1000,
                                                            'minutes'
                                                        )}
                                                    </Text>
                                                </View>
                                            </View>
                                        ) : null}
                                        {listImageSelected.map((v, i) => (
                                            <View key={i} style={styles.view_media}>
                                                <Image
                                                    source={{
                                                        uri: v,
                                                    }}
                                                    resizeMode="contain"
                                                />
                                                <Touch style={styles.touch_close_image}>
                                                    <Icon
                                                        type="ionicon"
                                                        name="close"
                                                        color={theme.colors.white_[10]}
                                                        size={theme.typography.size(10)}
                                                    />
                                                </Touch>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            ) : null}

                            {/* add image or video */}
                            <View
                                style={styles.view_add_media}
                                flexDirect="row"
                                jC="space-evenly"
                                pv="tiny"
                            >
                                <Touch
                                    activeOpacity={0.8}
                                    onPress={visibleImageSelectType('image')}
                                >
                                    <Icon
                                        type="ionicon"
                                        name="image"
                                        color={theme.colors.grey_[500]}
                                    />
                                    <Text color={theme.colors.grey_[400]} size={'sub3'}>
                                        Thêm hình ảnh
                                    </Text>
                                </Touch>
                                <Touch
                                    activeOpacity={0.8}
                                    onPress={visibleImageSelectType('video')}
                                    disabled={videoSelected !== undefined}
                                >
                                    <Icon
                                        type="ionicon"
                                        name="videocam"
                                        color={
                                            videoSelected !== undefined
                                                ? theme.colors.grey_[400]
                                                : theme.colors.grey_[500]
                                        }
                                    />
                                    <Text color={theme.colors.grey_[400]} size={'sub3'}>
                                        Thêm Video
                                    </Text>
                                </Touch>
                            </View>
                        </View>
                    </View>
                    <Touch flexDirect="row" aI="center" mv="small">
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
                            Hiện tên của bạn trên đánh giá
                        </Text>
                    </Touch>
                    <View>
                        <Button
                            title={'Gửi đánh giá'}
                            onPress={createProductReviewApi}
                            loading={status === Status.LOADING}
                            disabled={status === Status.LOADING}
                        />
                        {/* {status === Status.LOADING ? (
                            <View>
                                <ActivityIndicator
                                    color={theme.colors.main["600"]}
                                    size={theme.typography.size(20)}
                                />
                            </View>
                        ) : (
                            <Button
                                title={'Gửi đánh giá'}
                                onPress={createProductReviewApi}
                                loading={status === Status.LOADING}
                                disabled={status === Status.LOADING}
                            />
                            // <Touch aI="center" onPress={createProductReviewApi}>
                            //     <Text color={theme.colors.main['600']} size={'body2'}>
                            //         Gửi đánh giá
                            //     </Text>
                            // </Touch>
                        )} */}
                    </View>
                </View>
            )}

            {/* modal */}
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
            {/* alert */}
            <Alert
                isVisible={openAlert}
                title={status === Status.SUCCESS ? 'Đánh giá thành công' : 'Đánh giá thất bại'}
                message={message}
                type={status === Status.SUCCESS ? 'success' : 'error'}
                showBtnCan={false}
                okBtnTitle={status === Status.SUCCESS ? 'Xác nhận' : 'Đóng'}
                onOk={setVisibleAlert}
                onBackdropPress={setVisibleAlert}
            />
        </View>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_container: {
            backgroundColor: theme.colors.white_[10],
            marginBottom: theme.spacings.medium,
            marginHorizontal: 10,
            padding: theme.spacings.medium,
            paddingRight: theme.spacings.medium,
            borderRadius: 5,
            overflow: 'hidden',
            borderWidth: 0.5,
            borderColor: theme.colors.main['100'],
            minHeight: 200,
            ...theme.styles.shadow3,
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
        },
        input_style: {
            width: '100%',
            height: 160,
            textAlignVertical: 'top',

            color: theme.colors.grey_[500],
        },
        touch_option: {
            paddingHorizontal: theme.spacings.small,
            paddingVertical: 2,
            borderWidth: 0.7,
            borderColor: theme.colors.grey_[400],
            borderRadius: 10,
            marginRight: theme.spacings.small,
            marginTop: theme.spacings.small,
        },
        view_media: {
            width: theme.dimens.scale(45),
            aspectRatio: 1,
            backgroundColor: theme.colors.grey_[400],
            marginRight: theme.spacings.small,
            borderRadius: 5,
            overflow: 'hidden',
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
        view_icon_success: {
            padding: theme.spacings.medium,
            borderRadius: 1000,
            borderWidth: 1,
            borderColor: theme.colors.main['600'],
            borderStyle: Platform.OS === 'android' ? 'dashed' : 'solid',
            alignSelf: 'center',
            backgroundColor: theme.colors.main['50'],
        },
    });

export default ReviewItem;
