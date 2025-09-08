import { Icon } from '@rneui/themed';
import Image from 'components/Image';
import Text from 'components/Text';
import Touch from 'components/Touch';
import View from 'components/View';
import { useTheme } from 'hooks';
import React, { memo, useEffect, useRef, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import SwiperFlatList, { PaginationProps } from 'react-native-swiper-flatlist';
import { themeType } from 'theme';
/* eslint-disable react-hooks/exhaustive-deps */

// can truyen vao 1 array media(video or image) de hien thi
// truyen index de mo modal va hien anh tai index do trong array

interface Props {
    media: Array<{
        url: string;
        type: 'image' | 'video';
    }>;
    //index show image khi lan dau mo modal
    startIndex: number | null;
    // event kich hoat khi tat modal
    onClose?: () => void;
}

const MediaModal = memo(function MediaModal({ media, startIndex, onClose }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    //ref
    const SwiperFlatListRef = useRef<SwiperFlatList>(null);
    //state
    const [isVisible, setIsVisible] = useState(false);
    const [index, setIndex] = useState<number | undefined>();

    //effect
    useEffect(() => {
        if (startIndex !== null) {
            setIsVisible(true);
            setIndex(startIndex);
        }
    }, [startIndex]);

    //handle
    const handleCloseModal = () => {
        setIsVisible(false);
        if (onClose) {
            onClose();
        }
    };
    const handleChangeIndexSwiper = ({ index }: { index: number }) => {
        setIndex(index);
    };
    const scrollToIndexSelected = (index: number) => () => {
        setIndex(index);
        SwiperFlatListRef.current?.scrollToIndex({ index });
    };

    //render
    const Pagination = ({ size, paginationIndex = 0 }: PaginationProps) => (
        <View style={styles.view_wrap_pagination}>
            <View style={styles.view_bg_pagination}>
                <Text fw="bold" color={theme.colors.grey_[200]}>
                    {paginationIndex + 1}/{size}
                </Text>
            </View>
        </View>
    );

    return (
        <Modal
            isVisible={isVisible}
            style={{ padding: 0, margin: 0 }}
            backdropOpacity={1}
            useNativeDriver={true}
            animationIn="fadeIn"
            animationOut="fadeOut"
        >
            <StatusBar backgroundColor={theme.colors.black_[10]} barStyle={'light-content'} />
            {/* main image */}
            <View
                style={{
                    width: theme.dimens.width,
                    alignSelf: 'center',
                    overflow: 'hidden',
                    marginBottom: theme.spacings.default * 4,
                }}
            >
                <SwiperFlatList
                    ref={SwiperFlatListRef}
                    showPagination
                    PaginationComponent={Pagination}
                    index={index}
                    onChangeIndex={handleChangeIndexSwiper}
                >
                    {media.map((v, i) => (
                        <View
                            style={{
                                width: theme.dimens.width,
                                aspectRatio: 1,
                                justifyContent: 'center',
                                overflow: 'hidden',
                            }}
                            key={i}
                        >
                            <Image source={{ uri: v.url }} resizeMode="contain" />
                        </View>
                    ))}
                </SwiperFlatList>
            </View>
            {/* sub image */}
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    paddingBottom: theme.spacings.medium,
                }}
            >
                <ScrollView horizontal>
                    {media.map((v, i) => (
                        <Touch
                            activeOpacity={0.9}
                            style={{
                                width: theme.dimens.scale(60),
                                aspectRatio: 1,
                                // backgroundColor: theme.colors.main["600"],
                                borderRadius: 5,
                                marginLeft: theme.spacings.medium,
                                borderWidth: 1,
                                borderColor:
                                    index === i
                                        ? theme.colors.main['600']
                                        : theme.colors.grey_[200],
                                overflow: 'hidden',
                            }}
                            key={i}
                            onPress={scrollToIndexSelected(i)}
                        >
                            <Image source={{ uri: v.url }} resizeMode="contain" />
                        </Touch>
                    ))}
                </ScrollView>
            </View>
            {/* close btn */}
            <Touch
                activeOpacity={0.9}
                style={{
                    position: 'absolute',
                    top: theme.spacings.medium,
                    left: theme.spacings.medium,
                }}
                onPress={handleCloseModal}
            >
                <Icon
                    type="ionicon"
                    name="close-outline"
                    color={theme.colors.main['400']}
                    size={theme.typography.size(30)}
                />
            </Touch>
        </Modal>
    );
});

export default MediaModal;

const useStyles = (theme: themeType) =>
    StyleSheet.create({
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
            width: '15%',
            height: '80%',
            backgroundColor: 'rgba(0,0,0, 0.5)',
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
