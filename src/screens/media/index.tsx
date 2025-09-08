/* eslint-disable react-native/no-inline-styles */
/* eslint-disable radix */
import { RouteProp } from '@react-navigation/native';
import { Icon } from '@rneui/themed';
import IconButton from 'components/IconButton';
import Image from 'components/Image';
import Video_ from 'components/Video';
import View from 'components/View';
import { useNavigate, useTheme } from 'hooks';
import { map } from 'lodash';
import { RootStackParamsList } from 'navigation/type';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, ListRenderItem, StyleSheet, TouchableOpacity } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import { SwiperFlatList } from 'react-native-swiper-flatlist';

interface Props {
    route: RouteProp<RootStackParamsList, 'MediaScreen'>;
}

const MediaScreen = function MediaScreen({ route }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles();
    const navigate = useNavigate();
    //state
    const [index, setIndex] = useState(0);
    //value
    //params
    const media = route.params.media;
    const startIndex = route.params.startIndex;
    //ref
    const swiperRef = useRef<SwiperFlatList>(null);
    const flatlistRef = useRef<FlatList>(null);

    //effect
    useEffect(() => {
        if (setIndex) {
            setIndex(startIndex);
        }
    }, [startIndex]);

    //render
    const renderListProductImageSwiper = () => {
        let element = map(media, (value, i) => {
            return value.type === 'video' ? (
                <View style={styles.swiper_child} key={i}>
                    <Video_
                        source={{ uri: value.url }}
                        isShowFullScreen={false}
                        isStop={index !== 0}
                        // poster={images[defaultImageIndex].url}
                    />
                </View>
            ) : (
                <ImageZoom
                    cropWidth={theme.dimens.width}
                    cropHeight={theme.dimens.width}
                    imageWidth={theme.dimens.width}
                    imageHeight={theme.dimens.width}
                    useNativeDriver={true}
                    key={i}
                >
                    <View style={styles.swiper_child}>
                        <Image
                            source={{
                                uri: value.url,
                            }}
                            resizeMode={'contain'}
                        />
                    </View>
                </ImageZoom>
            );
        });
        // if (video) {
        //     element.unshift(
        //         <View style={styles.swiper_child} key={video}>
        //             <Video_ source={{ uri: video }} isShowFullScreen={false} isStop={index !== 0} />
        //         </View>
        //     );
        // }
        return element;
    };

    const renderListProductImagePagination: ListRenderItem<{
        url: string;
        type: 'image' | 'video';
    }> = ({ item, index: i }) => (
        <TouchableOpacity
            style={[
                styles.touch_pagination,
                {
                    borderWidth: 1,
                    borderColor: index === i ? theme.colors.main['600'] : theme.colors.grey_[400],
                },
            ]}
            key={i}
            activeOpacity={0.9}
            onPress={handleChangeIndex(i)}
        >
            {item.type === 'video' ? (
                <Icon
                    type="entypo"
                    name="controller-play"
                    color={index === i ? theme.colors.main['600'] : theme.colors.grey_[400]}
                    size={theme.typography.size(30)}
                />
            ) : (
                <Image
                    source={{
                        uri: item.url,
                    }}
                    resizeMode={'contain'}
                />
            )}
        </TouchableOpacity>
    );

    //handle
    const handleChangeIndex = (i: number) => () => {
        setIndex(i);
        if (i < media.length) {
            swiperRef.current?.scrollToIndex({ index: i });
            flatlistRef.current?.scrollToIndex({
                animated: true,
                index: i,
                viewPosition: 0.5,
            });
        }
    };
    const handleChangeIndexSwiper = ({ index: i }: any) => {
        setIndex(i);
        if (i < media.length) {
            flatlistRef.current?.scrollToIndex({
                animated: true,
                index: i,
                viewPosition: 0.5,
            });
        }
    };
    //--image

    return (
        <View style={styles.view_container}>
            <IconButton
                type="ionicon"
                name="close-outline"
                style={styles.btn_go_back}
                size={theme.typography.size(27)}
                activeOpacity={0.8}
                color={theme.colors.main['400']}
                onPress={navigate.GO_BACK_ROUTE}
            />
            <View style={styles.swiper_child}>
                <SwiperFlatList
                    ref={swiperRef}
                    index={index}
                    onChangeIndex={handleChangeIndexSwiper}
                    removeClippedSubviews={false}
                >
                    {renderListProductImageSwiper()}
                </SwiperFlatList>
            </View>
            <View style={styles.view_pagination}>
                <FlatList
                    ref={flatlistRef}
                    data={media}
                    renderItem={renderListProductImagePagination}
                    keyExtractor={(_, i) => `${i}`}
                    horizontal
                />
            </View>
            {/* Modal */}
        </View>
    );
};

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        view_container: {
            flex: 1,
            backgroundColor: theme.colors.black_[10],
            justifyContent: 'center',
            // alignItems: 'center',
        },
        btn_go_back: {
            position: 'absolute',
            top: 50,
            left: theme.spacings.medium,
        },
        swiper_child: {
            width: theme.dimens.width,
            height: theme.dimens.width,
        },

        view_pagination: {
            position: 'absolute',
            bottom: 10,
        },
        touch_pagination: {
            width: theme.dimens.scale(60),
            aspectRatio: 1,
            borderWidth: 1,
            marginLeft: theme.spacings.small,
            borderRadius: 5,
            overflow: 'hidden',
            justifyContent: 'center',
            alignSelf: 'center',
        },
        //share
    });
};

export default MediaScreen;
