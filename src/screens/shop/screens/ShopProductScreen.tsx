/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Icon } from '@rneui/themed';
import Button from 'components/Button';
import Header from 'components/Header';
import IconButton from 'components/IconButton';
import ListProductsWrapper from 'components/ListProductsWrapper';
import LoadingFetchAPI from 'components/LoadingFetchAPI';
import Text from 'components/Text';
import View from 'components/View';
import { SORT_CONFIGS } from 'const/app';
import { Status } from 'const/index';
import { useProductSwrInfinity, useTheme } from 'hooks';
import { ShopStackParamsList } from 'navigation/type';
import React, { memo, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import useStyles from '../styles';
interface Props {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<ShopStackParamsList, 'ShopProductScreen'>;
}

//trang hiên thị danh sách sản phẩm của shop với các params

export default memo(function ShopProductScreen({ navigation, route }: Props) {
    //hook
    const {
        theme: { colors, typography, spacings, dimens },
    } = useTheme();
    const styles = useStyles();

    //value
    const { seller_uuid, keyword, discount, newest } = route.params || {};
    //state
    const [sort, setSort] = useState<any>(SORT_CONFIGS.default.sort);
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
            keyword,
            seller_uuid,
            discount,
        },
        { revalidateOnMount: true }
    );
    //value
    const checkPriceSort =
        sort === SORT_CONFIGS.price_asc.sort ? 1 : sort === SORT_CONFIGS.price_desc.sort ? 2 : 0;
    const title = keyword
        ? `Tìm kiếm: ${keyword}`
        : discount
        ? 'Sản phẩm khuyến mãi'
        : newest
        ? 'Sản phẩm mới nhất'
        : '';

    //effect
    useEffect(() => {
        //san pham moi nhat
        if (newest) {
            setSort(SORT_CONFIGS.created_desc.sort);
        }
    }, [newest]);

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
            <View style={[styles.view_filter, { paddingTop: spacings.tiny }]}>
                <Button
                    title="Phổ biến"
                    type="clear"
                    color={
                        sort === SORT_CONFIGS.default.sort ? colors.main['600'] : colors.grey_[500]
                    }
                    TouchableComponent={TouchableOpacity}
                    onPress={handleChangeSort(SORT_CONFIGS.default.sort)}
                />

                <Text color={colors.grey_[400]}>|</Text>
                <Button
                    title="Mới nhất"
                    type="clear"
                    color={
                        sort === SORT_CONFIGS.created_desc.sort
                            ? colors.main['600']
                            : colors.grey_[500]
                    }
                    TouchableComponent={TouchableOpacity}
                    onPress={handleChangeSort(SORT_CONFIGS.created_desc.sort)}
                />
                <Text color={colors.grey_[400]}>|</Text>
                <Button
                    title="Giá"
                    type="clear"
                    TouchableComponent={TouchableOpacity}
                    onPress={handleChangeSort(
                        checkPriceSort === 1
                            ? SORT_CONFIGS.price_desc.sort
                            : SORT_CONFIGS.price_asc.sort
                    )}
                >
                    <Text
                        color={checkPriceSort > 0 ? colors.main['600'] : colors.grey_[500]}
                        size={'body2'}
                        mr={1}
                    >
                        Giá
                    </Text>
                    <Icon
                        type="ionicon"
                        name={checkPriceSort === 1 ? 'caret-up' : 'caret-down'}
                        color={checkPriceSort > 0 ? colors.main['600'] : colors.grey_[500]}
                        size={typography.title1}
                    />
                </Button>
            </View>
        </View>
    );

    return (
        <>
            <Header
                leftComponent={
                    <IconButton
                        type="ionicon"
                        name="arrow-back-outline"
                        onPress={navigation.goBack}
                        size={typography.title4}
                        color={colors.white_[10]}
                        activeOpacity={0.5}
                    />
                }
                centerComponent={
                    <TouchableOpacity containerStyle={styles.touch_container_search}>
                        <Text color={colors.slate[900]}>{title}</Text>
                    </TouchableOpacity>
                }
                backgroundColor={colors.main['600']}
                centerContainerStyle={styles.header_center_container}
                leftContainerStyle={styles.header_left_container}
                rightContainerStyle={styles.header_right_container}
            />
            {renderListHeaderSection()}
            <ListProductsWrapper
                data={productsRelated}
                numColumns={2}
                onEndReached={handleLoadMoreProduct}
                viewabilityConfig={{
                    waitForInteraction: true,
                    viewAreaCoveragePercentThreshold: 95,
                }}
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
    );
});
