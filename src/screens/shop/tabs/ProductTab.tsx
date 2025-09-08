/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import { Icon, TabView } from '@rneui/themed';
import Button from 'components/Button';
import ListProductsWrapper from 'components/ListProductsWrapper';
import LoadingFetchAPI from 'components/LoadingFetchAPI';
import Text from 'components/Text';
import View from 'components/View';
import { SORT_CONFIGS } from 'const/app';
import { Status } from 'const/index';
import { useProductSwrInfinity, useTheme } from 'hooks';
import { SellerInfoResponseType } from 'models';
import React, { memo, useEffect, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import IconButton from 'components/IconButton';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ProductStackParamsList, ShopStackParamsList } from 'navigation/type';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Touch from 'components/Touch';
import { isEmpty } from 'utils/helpers';
interface Props {
    initValueAnimated: any;
    seller: SellerInfoResponseType;
}

export default memo(function StoreTab({ initValueAnimated, seller }: Props) {
    //hook
    const {
        theme: { colors, typography, spacings, dimens },
    } = useTheme();
    const styles = useStyles();
    const navigation = useNavigation<DrawerNavigationProp<ShopStackParamsList, 'ShopScreen'>>();
    const route = useRoute<RouteProp<ShopStackParamsList, 'ShopScreen'>>();

    //params
    const filters = route.params?.filters;
    const checkFilter = !isEmpty(filters) ? true : false;

    //state
    const [sort, setSort] = useState<any>(SORT_CONFIGS.default.sort);
    const [filterParams, setFilterParams] = useState<{ [key: string]: string }>({});

    //swr
    const {
        products: productsRelated,
        size,
        setSize,
        pagination,
        isValidating,
        loadingInit,
    } = useProductSwrInfinity(
        {
            sort,
            seller_uuid: seller?.seller_uuid,
            ...filterParams,
        },
        { revalidateOnMount: true }
    );

    //value
    const defaultSort = SORT_CONFIGS.default.sort;
    const newestSort = SORT_CONFIGS.created_desc.sort;
    const priceAsc = SORT_CONFIGS.price_asc.sort;
    const priceDesc = SORT_CONFIGS.price_desc.sort;

    //effect

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
    const handleChangeSort = (sortValue: string) => () => {
        setSort(sortValue);
    };
    const handleLoadMoreProduct = () => {
        if (size < pagination.page_count && !isValidating) {
            setSize(size + 1);
        }
    };

    //render
    const renderListHeaderSection = () => (
        <View mb={spacings.small}>
            {/* filter */}

            <View style={styles.view_wrap_filter}>
                <IconButton
                    type="material-community"
                    name={checkFilter ? 'filter-check' : 'filter'}
                    size={typography.size(25)}
                    color={checkFilter ? colors.main['600'] : colors.grey_[500]}
                    onPress={() => {
                        navigation.openDrawer();
                    }}
                    style={{ flex: 1 }}
                />
                <Text color={colors.grey_[300]}>|</Text>

                <Touch flex={1} p={'medium'} onPress={handleChangeSort(defaultSort)}>
                    <Text
                        color={sort === defaultSort ? colors.main['600'] : colors.grey_[600]}
                        size={'body1'}
                        ta="center"
                    >
                        Phổ biến
                    </Text>
                </Touch>
                <Text color={colors.grey_[300]}>|</Text>
                <Touch flex={1} p={'medium'} onPress={handleChangeSort(newestSort)}>
                    <Text
                        color={sort === newestSort ? colors.main['600'] : colors.grey_[600]}
                        size={'body1'}
                        ta="center"
                    >
                        Mới nhất
                    </Text>
                </Touch>
                <Text color={colors.grey_[300]}>|</Text>
                <Touch
                    style={styles.btn_sort_price}
                    onPress={handleChangeSort(sort === priceAsc ? priceDesc : priceAsc)}
                    activeOpacity={0.9}
                >
                    <Text color={colors.grey_[600]} size={'body1'}>
                        Giá
                    </Text>
                    <View style={styles.view_icon}>
                        <Icon
                            type="ionicon"
                            name="chevron-up-outline"
                            size={typography.sub2}
                            color={sort === priceAsc ? colors.main['600'] : colors.grey_[600]}
                        />
                        <Icon
                            type="ionicon"
                            name="chevron-down-outline"
                            size={typography.sub2}
                            color={sort === priceDesc ? colors.main['600'] : colors.grey_[600]}
                        />
                    </View>
                </Touch>
            </View>
        </View>
    );

    return (
        <TabView.Item style={styles.tab_product_item}>
            <>
                <ListProductsWrapper
                    contentContainerStyle={styles.list_container_style}
                    data={productsRelated}
                    numColumns={2}
                    ListHeaderComponent={renderListHeaderSection()}
                    onEndReached={handleLoadMoreProduct}
                    viewabilityConfig={{
                        waitForInteraction: true,
                        viewAreaCoveragePercentThreshold: 95,
                    }}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: initValueAnimated } } }],
                        { useNativeDriver: false }
                    )}
                    loadMore={isValidating && loadingInit !== Status.LOADING}
                    heightLoading={dimens.verticalScale(90)}
                />
                {loadingInit === Status.LOADING ? (
                    <View
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            zIndex: 1000,
                            backgroundColor: 'transparent',
                        }}
                    >
                        <LoadingFetchAPI visible={true} size={typography.size(50)} />
                    </View>
                ) : null}
            </>
        </TabView.Item>
    );
});

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        /* ------- screen ------ */
        tab_product_item: {
            width: '100%',
            flex: 1,
            position: 'relative',
        },
        list_container_style: {
            paddingTop: theme.dimens.height * 0.38,
        },
        /* ------- list filter ------- */
        view_wrap_filter: {
            flexDirection: 'row',
            alignItems: 'center',

            backgroundColor: theme.colors.white_[10],
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey_[200],
        },
        txt_title_filter: {
            textAlign: 'center',
            fontWeight: 'bold',
            color: theme.colors.white_[10],
            fontSize: theme.typography.body3,
            padding: theme.spacings.small,
            backgroundColor: theme.colors.main['600'],
            paddingTop: theme.dimens.statusBarHeight,
        },
        btn_sort_price: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.spacings.medium,
        },

        view_icon: {
            justifyContent: 'center',
            marginLeft: theme.spacings.tiny,

            paddingRight: theme.spacings.medium,
        },
    });
};
