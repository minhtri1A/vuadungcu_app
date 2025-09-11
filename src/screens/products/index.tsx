/* eslint-disable radix */
import { RouteProp } from '@react-navigation/native';
import Disconnect from 'components/Disconnect';
import Header from 'components/Header';
import ListProductsWrapper from 'components/ListProductsWrapper';
import LoadingFetchAPI from 'components/LoadingFetchAPI';
import MiniCart from 'components/MiniCart';
import ViewSearchTextInput from 'components/ViewSearchTextInput';
import { ProductStackParamsList } from 'navigation/type';
import React, { memo, useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import Categories from './components/Categories';
import Filters from './components/Filters';
import useStyles from './styles';
// eslint-disable-next-line no-unused-vars
import { useScrollToTop } from '@react-navigation/native';
import AfterInteractions from 'components/AfterInteractions';
import Text from 'components/Text';
import { SORT_CONFIGS } from 'const/app';
import { Status } from 'const/index';
import { useCategoriesSWR, useInternet, useProductSwrInfinity, useTheme } from 'hooks';
/* eslint-disable react-hooks/exhaustive-deps */
import { DrawerNavigationProp } from '@react-navigation/drawer';
import View from 'components/View';
import useBrandsDetailSwr from 'hooks/swr/brandSwr/useBrandsDetailSwr';
import { useRefreshControl } from 'hooks/useRefreshControl';
import { isEmpty } from 'utils/helpers';
import Brands from './components/Brands';
import CategoriesSekeleton from './skeleton/CategoriesSekeleton';
import ProductsSkeleton from './skeleton/ProductsSkeleton';

interface Props {
    // navigation: NativeStackScreenProps<ProductStackParamsList, 'ProductScreen'>;
    route: RouteProp<ProductStackParamsList, 'ProductScreen'>;
    navigation: DrawerNavigationProp<ProductStackParamsList, 'ProductScreen'>;
}

const ProductScreen = memo(function ProductScreen(props: Props) {
    //hook
    const styles = useStyles();
    const { theme } = useTheme();
    const isInternet = useInternet();
    const { route, navigation } = props;
    //state
    // const [searchText, setSearchText] = useState<string>('');
    const [sort, setSort] = useState<any>(SORT_CONFIGS.default.sort);
    //filter drawer value

    //params
    const category_uuid = route.params?.category_uuid;
    const brand_uuid = route.params?.brand_uuid;
    const searchText = route.params?.search;
    const filters = route.params?.filters;

    //--qick params
    const [filterParams, setFilterParams] = useState<{ [key: string]: string }>({});

    //value
    const checkFilter = !isEmpty(filters) ? true : false;

    //swr
    const {
        categories: categoryData,
        mutate: mutateCategory,
        isValidating: isValidCategory,
    } = useCategoriesSWR(category_uuid, undefined, {
        revalidateOnMount: false,
    });
    const { brand, mutateBrand } = useBrandsDetailSwr(brand_uuid, { revalidateOnMount: false });
    const {
        products,
        loadingInit,
        isValidating,
        pagination,
        size,
        setSize,
        mutate: mutateProducts,
    } = useProductSwrInfinity({
        ...filterParams,
        category_uuid: category_uuid,
        sort,
        keyword: searchText,
        brand: brand_uuid,
    });
    //refresh
    const { refreshControl } = useRefreshControl(() => {
        mutateCategory();
        mutateProducts([]);
    });
    //ref
    const refListCate = useRef<FlatList>(null);
    const refListProduct = useRef<FlatList>(null);

    //scroll to top
    useScrollToTop(refListProduct);

    //effect
    //--mutate data
    useEffect(() => {
        if (category_uuid) {
            mutateCategory();
        }
        if (brand_uuid) {
            mutateBrand();
        }
    }, [category_uuid, searchText, brand_uuid]);

    //--set filter params
    useEffect(() => {
        if (filters) {
            let params: { [key: string]: string } = {};
            filters.forEach((v) => {
                params = {
                    ...params,
                    [v.attribute_code]:
                        v.attribute_code === 'price'
                            ? `${v.min},${v.max}`
                            : v.options?.join(',') || '',
                };
            });
            setFilterParams(params);
        }
    }, [filters]);

    //handle
    //--loadmore
    const getMoreProducts = () => {
        //infinity product swr
        if (!isValidating && pagination.total_items > 20) {
            setSize(size + 1);
        }
    };
    //--reconnected
    const reConnectedInternet = () => {
        //ket noi lai khi khong co mang
    };

    const setSortState = (sortValue: string) => {
        setSort(sortValue);
    };

    //render

    if (!isInternet) {
        return (
            <View style={{ flex: 1 }}>
                <Header
                    centerComponent={
                        <ViewSearchTextInput
                            textInputCenter={
                                route.params?.search !== undefined ? route.params?.search : null
                            }
                        />
                    }
                    centerContainerStyle={{ flex: 29 }}
                    rightComponent={<MiniCart size={theme.typography.title3} />}
                    rightContainerStyle={{ flex: 3 }}
                />
                <Disconnect reConnectedInternetProps={reConnectedInternet} height={'100%'} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <Header
                centerComponent={
                    <ViewSearchTextInput
                        textInputCenter={
                            route.params?.search !== undefined ? route.params?.search : null
                        }
                    />
                }
                backgroundColor={theme.colors.main[500]}
                centerContainerStyle={{ flex: 0.77 }}
                rightContainerStyle={{ flex: 0.13 }}
                rightComponent={<MiniCart />}
                colorBackIcon={theme.colors.white_[10]}
            />
            <AfterInteractions style={styles.view_body}>
                {/* filter  */}
                <Filters
                    route={route}
                    currentSort={sort}
                    setSortState={setSortState}
                    navigationDrawer={navigation}
                    checkFilter={checkFilter}
                />
                {/* List Products */}
                <ListProductsWrapper
                    data={products}
                    numColumns={2}
                    isAddToCart
                    loadMore={isValidating && loadingInit !== Status.LOADING}
                    ListHeaderComponent={
                        isValidCategory ? (
                            <CategoriesSekeleton />
                        ) : searchText ? (
                            <View style={styles.view_titleSearch}>
                                <Text fw="bold" color={theme.colors.grey_[500]} mr={'tiny'}>
                                    Tìm kiếm:
                                </Text>
                                <Text
                                    color={theme.colors.grey_[500]}
                                    ellipsizeMode="tail"
                                    numberOfLines={1}
                                >
                                    {searchText}
                                </Text>
                            </View>
                        ) : category_uuid ? (
                            <Categories
                                category_uuid={category_uuid}
                                categoryData={categoryData}
                                refListCate={refListCate}
                                pagination={pagination}
                            />
                        ) : brand_uuid ? (
                            <Brands brand={brand} pagination={pagination} />
                        ) : null
                    }
                    ListEmptyComponent={
                        isValidating ? (
                            <ProductsSkeleton />
                        ) : (
                            <Text ta="center" color={theme.colors.grey_[500]}>
                                Chưa có sản phẩm
                            </Text>
                        )
                    }
                    // loadMore={true}
                    // autoScrolltop={statusScreen === Status.LOADING}
                    refreshControl={refreshControl()}
                    refProps={refListProduct}
                    onEndReached={getMoreProducts}
                />
                {loadingInit === Status.LOADING ? (
                    <LoadingFetchAPI
                        styleView={styles.loading_apiStyle}
                        visible={loadingInit === Status.LOADING}
                        size={theme.spacings.tiny * 10}
                    />
                ) : (
                    <></>
                )}
                {/* end-List Products */}
            </AfterInteractions>
        </View>
    );
});

export default ProductScreen;
