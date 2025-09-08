/* eslint-disable react-hooks/exhaustive-deps */
import Divider from 'components/Divider';
import Text from 'components/Text';
import View from 'components/View';
import { useCategoriesSWR, useTheme } from 'hooks';
import React, { memo, useEffect, useRef } from 'react';
import { Animated, ScrollView } from 'react-native';
import HomeCategorySkeleton from './HomeCategorySkeleton';
import animation from 'theme/animation';
import CategoryItem from './CategoryItem';
import useStyles from './styles';

interface Props {
    refreshControl: boolean;
    isAppStart: boolean;
}

const HomeCategory = memo(function HomeCategory({ refreshControl, isAppStart }: Props) {
    //hook
    const styles = useStyles();
    const { theme } = useTheme();
    //swr
    const {
        categories,
        isValidating: isValidatingCategory,
        mutate,
    } = useCategoriesSWR('0', undefined, { revalidateOnMount: false }, 3600);
    const rootCategories = categories?.children || [];
    //ref
    const scrollviewRef = useRef<ScrollView>(null);
    //animation
    const contentSizeWidth = theme.dimens.width * 0.25 * rootCategories.length || 100000; //contentSize width = width * chieu dai moi item * so luong item
    const totalOffset = contentSizeWidth - theme.dimens.width; // contentSizeWidth - width
    const initValueAnimated = new Animated.Value(0);
    const marginLeftAnimation = animation(
        initValueAnimated,
        [1, totalOffset],
        [0, theme.dimens.scale(23)]
    );

    // effect
    //--fetch init
    useEffect(() => {
        if (isAppStart) {
            mutate();
        }
    }, [isAppStart]);
    //--refresh control
    useEffect(() => {
        if (refreshControl && isAppStart) {
            mutate();
        }
    }, [refreshControl, isAppStart]);

    //render
    const renderItemListCate1 = () =>
        rootCategories.map((value, index) => (
            <View key={index}>
                <CategoryItem categories={value} key={index} index={index} />
            </View>
        ));

    return (
        <>
            {isValidatingCategory ? (
                <HomeCategorySkeleton />
            ) : (
                <View>
                    <View style={styles.view_topScreenContainer}>
                        <View style={styles.view_title_category}>
                            <Text ta="center" size={'body1'} color={theme.colors.black_[10]}>
                                DANH MỤC NỔI BẬC
                            </Text>
                            {/* <TouchableOpacity onPress={navigate.CATEROGIES_ROUTE()}>
                                <Text color={theme.colors.grey_[400]} size={'sub3'}>
                                    Xem tất cả
                                </Text>
                            </TouchableOpacity> */}
                            <View jC="center" aI="center">
                                <View
                                    style={{
                                        width: theme.dimens.scale(30),
                                        height: theme.dimens.verticalScale(4),
                                        backgroundColor: theme.colors.main['100'],
                                        borderRadius: 5,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Animated.View
                                        style={{
                                            width: theme.dimens.scale(7),
                                            height: theme.dimens.verticalScale(4),
                                            backgroundColor: theme.colors.main['300'],
                                            marginLeft: marginLeftAnimation,
                                            borderRadius: 5,
                                        }}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* banner */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            ref={scrollviewRef}
                            // onScroll={handleScrollList}
                            onScroll={Animated.event(
                                [
                                    {
                                        nativeEvent: {
                                            contentOffset: { x: initValueAnimated },
                                        },
                                    },
                                ],
                                { useNativeDriver: false }
                            )}
                        >
                            {renderItemListCate1()}
                        </ScrollView>
                        {/* <View jC="center" aI="center" mt="medium">
                            <View
                                style={{
                                    width: theme.dimens.scale(30),
                                    height: theme.dimens.verticalScale(4),
                                    borderRadius: 5,
                                    overflow: 'hidden',
                                }}
                            >
                                <Animated.View
                                    style={{
                                        width: theme.dimens.scale(7),
                                        height: theme.dimens.verticalScale(4),
                                        marginLeft: marginLeftAnimation,
                                        borderRadius: 5,
                                    }}
                                />
                            </View>
                        </View> */}
                    </View>
                    <Divider height={1} />
                </View>
            )}
        </>
    );
});

export default HomeCategory;
