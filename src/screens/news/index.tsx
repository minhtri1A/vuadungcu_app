import { RouteProp } from '@react-navigation/native';
import FocusAwareStatusBar from 'components/FocusAwareStatusBar';
import Header from 'components/Header';
import { NewsStackParamsList } from 'navigation/type';
import React, { memo, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import Text from 'components/Text';
import { useInternet, useSlideSwr, useTheme } from 'hooks';
/* eslint-disable react-hooks/exhaustive-deps */
import { DrawerNavigationProp } from '@react-navigation/drawer';
import DeepLink from 'components/DeepLink';
import Disconnect from 'components/Disconnect';
import IconButton from 'components/IconButton';
import Image from 'components/Image';
import Touch from 'components/Touch';
import View from 'components/View';
import { NAVIGATION_TO_NEWS_CATEGORY } from 'const/routes';
import useNewsCategorySwr from 'hooks/swr/newsSwr/useNewsCategorySwr';
import { map } from 'lodash';
import { ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import Swiper from 'react-native-swiper';
import NewsCategorySection from './components/NewsCategorySection';
import NewsFeaturedSection from './components/NewsFeaturedSection';
import NewsSortSection from './components/NewsSortSection';
import useStyles from './styles';

interface Props {
    // navigation: NativeStackScreenProps<ProductStackParamsList, 'ProductScreen'>;
    route: RouteProp<NewsStackParamsList, 'NewsScreen'>;
    navigation: DrawerNavigationProp<NewsStackParamsList, 'NewsScreen'>;
}

const NewsScreen = memo(function NewsScreen(props: Props) {
    //hook
    const {
        theme: { colors, typography, dimens },
    } = useTheme();
    const styles = useStyles();
    const isInternet = useInternet();
    //state
    const [refresh, setRefresh] = useState(false);
    //swr
    const { slides, mutate: mutateSlide } = useSlideSwr({ group: 'news_right_banner' });
    //props
    const { navigation } = props;

    //--reconnected

    //render
    const renderNewsRightSlide = () =>
        map(slides, (value, index) => (
            <DeepLink w="97%" ratio={1} aS="center" key={index} url={value.app_link}>
                <Image
                    source={{
                        uri: value.image,
                    }}
                    radius={10}
                />
            </DeepLink>
        ));
    const handleRefresh = async () => {
        setRefresh(true);
        await mutateSlide();
        setRefresh(false);
    };

    return (
        <>
            <FocusAwareStatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle={'light-content'}
            />
            <Header
                centerComponent={{
                    text: 'Review & Ý Tưởng',
                    style: { color: colors.white_[10], fontSize: typography.title2 },
                }}
                colorBackIcon={colors.white_[10]}
                rightComponent={
                    <IconButton
                        type="ionicon"
                        name="list-outline"
                        size={typography.title4}
                        onPress={navigation.openDrawer}
                    />
                }
            />
            <View flex={1}>
                {!isInternet ? (
                    <ScrollView style={{ flex: 1 }}>
                        <Disconnect height={dimens.height * 0.9} />
                    </ScrollView>
                ) : (
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                onRefresh={handleRefresh}
                                refreshing={refresh}
                                colors={[colors.main['600']]}
                            />
                        }
                    >
                        {/* news feutured section */}
                        <NewsFeaturedSection refresh={refresh} />
                        {/* news category section */}
                        <NewsCategorySection refresh={refresh} />
                        {/* banner section */}
                        {slides && slides.length > 0 ? (
                            <View w={'100%'} ratio={1} mb="medium">
                                <Swiper
                                    loadMinimalLoader={<ActivityIndicator size="large" />}
                                    dot={<View style={styles.dotSwiper} />}
                                    activeDot={<View style={styles.swiper_activeDot} />}
                                    autoplay={true}
                                >
                                    {renderNewsRightSlide()}
                                </Swiper>
                            </View>
                        ) : null}

                        {/* news sort section */}
                        <NewsSortSection refresh={refresh} />
                    </ScrollView>
                )}
            </View>
        </>
    );
});

export const DrawerContentNewsFilter = ({ navigation }: any) => {
    //hooks
    const styles = useStyles();
    const { theme } = useTheme();
    //swr
    const { categories } = useNewsCategorySwr();

    //navigate
    const navigateNewsCategory =
        (name: string, category_uuid?: string, type?: 'new' | 'most_viewed') => () => {
            // navigation.jumpTo(NAVIGATION_TO_NEWS_CATEGORY);
            navigation.navigate(NAVIGATION_TO_NEWS_CATEGORY, { category_uuid, name, type });
        };

    const renderNewsCategories = () =>
        map(categories, (value, index) => (
            <Touch
                style={styles.touch_drawer_item}
                onPress={navigateNewsCategory(value.category_name, value.category_uuid)}
                key={index}
            >
                <Text color={theme.colors.grey_[500]}>{value.category_name}</Text>
            </Touch>
        ));

    return (
        <View style={styles.view_drawer_container}>
            <Text p="small" ta="center" size="title1" color={theme.colors.slate[900]}>
                Danh mục
            </Text>
            <View aI="center">{renderNewsCategories()}</View>
            <View style={styles.view_drawer_bot_item}>
                <Touch
                    style={styles.touch_drawer_item}
                    onPress={navigateNewsCategory('Tin mới', undefined, 'new')}
                >
                    <Text color={theme.colors.grey_[500]}>Tin mới</Text>
                </Touch>
            </View>
        </View>
    );
};

export default NewsScreen;
