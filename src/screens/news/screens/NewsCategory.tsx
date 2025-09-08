import { RouteProp } from '@react-navigation/native';
import Header from 'components/Header';
import { NewsStackParamsList } from 'navigation/type';
import React, { memo } from 'react';
// eslint-disable-next-line no-unused-vars
import AfterInteractions from 'components/AfterInteractions';
import { useTheme } from 'hooks';
/* eslint-disable react-hooks/exhaustive-deps */
import { DrawerNavigationProp } from '@react-navigation/drawer';
import LoadingFetchAPI from 'components/LoadingFetchAPI';
import NewsItemHorizontal from 'components/NewsItemHorizontal.tsx';
import View from 'components/View';
import useNewsSwrInfinity from 'hooks/swr/newsSwr/useNewsSwrInfinity';
import { NewsItemType } from 'models';
import { ListRenderItem } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

interface Props {
    // navigation: NativeStackScreenProps<ProductStackParamsList, 'ProductScreen'>;
    route: RouteProp<NewsStackParamsList, 'NewsCategoryScreen'>;
    navigation: DrawerNavigationProp<NewsStackParamsList, 'NewsCategoryScreen'>;
}

const NewsCategory = memo(function NewsCategory({ route }: Props) {
    //hook
    const { theme } = useTheme();
    //state
    //params
    const category_uuid = route.params?.category_uuid;
    const type = route.params?.type;
    const name = route.params.name;
    //swr
    const { news, size, setSize, isValidating, pagination } = useNewsSwrInfinity({
        category_uuid,
        type,
    });
    //render
    const renderListNewsItems: ListRenderItem<NewsItemType> = ({ item, index }) => (
        <NewsItemHorizontal news_items={item} key={index} />
    );
    //handle
    const handleLoadMoreNewsCategory = () => {
        if (pagination.page_count > 1 && size < pagination.page && !isValidating) {
            setSize(size + 1);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <Header
                colorBackIcon={theme.colors.white_[10]}
                centerContainerStyle={{ flex: 0.8 }}
                rightContainerStyle={{ flex: 0.1 }}
                centerTitle={name}
                shadow
            />
            <AfterInteractions style={{ backgroundColor: theme.colors.white_[10] }}>
                <FlatList
                    data={news}
                    renderItem={renderListNewsItems}
                    keyExtractor={(item) => item.news_uuid}
                    style={{
                        padding: theme.spacings.medium,
                        paddingTop: theme.spacings.extraLarge,
                    }}
                    onEndReachedThreshold={0.5}
                    onEndReached={handleLoadMoreNewsCategory}
                    ListFooterComponent={
                        <LoadingFetchAPI // check xem co lading san pham hk
                            visible={isValidating}
                            size={theme.typography.size(40)}
                            styleView={{
                                height: theme.dimens.scale(50),
                            }}
                            color={theme.colors.main['600']}
                            // titleText={'Đã hết sản phẩm'}
                        />
                    }
                />
            </AfterInteractions>
        </View>
    );
});

export default NewsCategory;
