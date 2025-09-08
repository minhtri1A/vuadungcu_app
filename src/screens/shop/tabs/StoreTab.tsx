/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import { TabView } from '@rneui/themed';
import Divider from 'components/Divider';
import ListProductItem from 'components/ListProductItem';
import ListProductsWrapper from 'components/ListProductsWrapper';
import Text from 'components/Text';
import Title from 'components/Title';
import View from 'components/View';
import { NAVIGATION_TO_SHOP_PRODUCT_SCREEN } from 'const/routes';
import { useNavigation, useProductSwrInfinity, useTheme } from 'hooks';
import useProductsSwr from 'hooks/swr/productSwr/useProductSwr';
import { map } from 'lodash';
import { SellerInfoResponseType } from 'models';
import React, { memo, useMemo } from 'react';
import { Animated, ScrollView } from 'react-native';
import { isEmpty } from 'utils/helpers';
import useStyles from './../styles';

interface Props {
    initValueAnimated: any;
    seller: SellerInfoResponseType;
}

export default memo(function StoreTab({ initValueAnimated, seller }: Props) {
    //hook
    const {
        theme: { colors, spacings, dimens },
    } = useTheme();
    const styles = useStyles();
    const navigation = useNavigation();
    //state
    //swr
    const { products: discountProduct } = useProductsSwr({
        seller_uuid: seller?.seller_uuid,
        discount: 'Y',
        page_size: 10,
    });
    const { products: newProduct } = useProductsSwr({
        seller_uuid: seller?.seller_uuid,
        sort: 'created-desc',
        page_size: 10,
    });
    const {
        products: productsRelated,
        size,
        setSize,
        isValidating,
        pagination,
    } = useProductSwrInfinity(
        {
            seller_uuid: seller?.seller_uuid,
        },
        { revalidateOnMount: true }
    );
    //value
    //effect

    //handle
    const handleLoadMoreProduct = () => {
        if (size < pagination.page_count && !isValidating) {
            setSize(size + 1);
        }
    };

    //navigate
    const navigateToShopProductScreen =
        (params: { discount?: boolean; newest?: boolean }) => () => {
            navigation.navigate(NAVIGATION_TO_SHOP_PRODUCT_SCREEN, {
                discount: params.discount,
                newest: params.newest,
                seller_uuid: seller?.seller_uuid,
            });
        };

    //render
    const renderListHeader = () => {
        return (
            <>
                {/* flash sale */}
                {!isEmpty(discountProduct) ? (
                    <View>
                        <Title
                            titleLeft="Khuyến mãi"
                            iconLeftProps={{
                                type: 'ionicon',
                                name: 'flash-sharp',
                                color: colors.red['500'],
                            }}
                            titleRight="Xem thêm"
                            titleLeftProps={{ size: 'body2', fw: 'bold', color: 'red' }}
                            titleRightProps={{ color: colors.grey_[500] }}
                            onPress={navigateToShopProductScreen({ discount: true })}
                            dividerBottom
                        />
                        <View flex={1} mt="small">
                            <ScrollView horizontal style={{ paddingLeft: spacings.small }}>
                                {map(discountProduct, (value, index2) => (
                                    <ListProductItem
                                        item={value}
                                        key={index2}
                                        lengthListProduct={productsRelated.length}
                                        viewContainerStyle={{
                                            marginRight: spacings.small,
                                            width: dimens.width * 0.35,
                                            // borderBottomWidth: 1,
                                            // borderBottomColor: colors.grey_[200],
                                        }}
                                        showFirstPrice={true}
                                        textNameProps={{ size: 'sub2' }}
                                        textSalePriceProps={{
                                            pattern: undefined,
                                            color: 'red',
                                        }}
                                        textFirstPriceProps={{
                                            pattern: undefined,
                                            color: colors.grey_[400],
                                            tD: 'line-through',
                                        }}
                                        showRating={false}
                                    />
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                ) : null}

                {/* slide 1 */}
                {/* <View w="100%" ratio={2 / 1}>
                    <SlideImage>
                        <Image
                            source={require('asset/img_store_slide_1_1.gif')}
                            resizeMode="stretch"
                            w={'96%'}
                            radius={5}
                        />
                    </SlideImage>
                </View>
                <Divider /> */}
                {/* new product */}
                {!isEmpty(newProduct) ? (
                    <>
                        <View mt={1}>
                            <Title
                                titleLeft="Sản phẩm mới"
                                titleRight="Xem thêm"
                                titleLeftProps={{ size: 'body2', fw: 'bold' }}
                                titleRightProps={{ color: colors.grey_[500] }}
                                onPress={navigateToShopProductScreen({ newest: true })}
                                dividerBottom
                            />
                            <View flex={1} mt={'small'}>
                                <ScrollView horizontal style={{ paddingLeft: spacings.small }}>
                                    {map(newProduct, (value, index2) => (
                                        <ListProductItem
                                            item={value}
                                            key={index2}
                                            lengthListProduct={productsRelated.length}
                                            viewContainerStyle={{
                                                marginRight: spacings.small,
                                                width: dimens.width * 0.35,
                                                // borderBottomWidth: 1,
                                                // borderBottomColor: colors.grey_[200],
                                            }}
                                            showFirstPrice={false}
                                            textNameProps={{ size: 'sub2' }}
                                            textSalePriceProps={{
                                                pattern: undefined,
                                                color: 'red',
                                            }}
                                            showRating={false}
                                        />
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </>
                ) : null}

                {/* selling product */}
                {/* <View mt={1}>
                    <Title
                        titleLeft="Sản phẩm bán chạy"
                        titleRight="Xem thêm"
                        chevron
                        containerProps={{ ph: 'small' }}
                        titleLeftProps={{ size: 'body2', fw: 'bold' }}
                    />
                    <View flex={1}>
                        <ScrollView horizontal style={{ paddingLeft: spacings.small }}>
                            {map(productsRelated, (value, index2) => (
                                <ListProductItem
                                    item={value}
                                    key={index2}
                                    lengthListProduct={productsRelated.length}
                                    viewContainerStyle={{
                                        marginRight: spacings.small,
                                        width: dimens.width * 0.35,
                                        borderBottomWidth: 1,
                                        borderBottomColor: colors.grey_[200],
                                    }}
                                    showFirstPrice={false}
                                    textSalePriceProps={{
                                        pattern: undefined,
                                        color: 'red',
                                    }}
                                />
                            ))}
                        </ScrollView>
                    </View>
                </View> */}
                {/* slide 2 */}
                {/* <Divider /> */}
                {/* <View w="100%" ratio={3 / 1}>
                    <SlideImage>
                        <Image
                            source={require('asset/img_store_slide_1_1.gif')}
                            resizeMode="stretch"
                            w={'96%'}
                            radius={5}
                        />
                    </SlideImage>
                </View>
                <Divider /> */}
                {/* list filter */}
                <View p="small">
                    <Text fw="bold" size="body2">
                        Sản phẩm phổ biến
                    </Text>
                </View>
                <Divider />
            </>
        );
    };
    const renderListHeader2 = useMemo(renderListHeader, [productsRelated]);

    return (
        <TabView.Item style={styles.tab_item}>
            <ListProductsWrapper
                contentContainerStyle={styles.list_container_style}
                data={productsRelated}
                numColumns={2}
                ListHeaderComponent={renderListHeader2}
                viewabilityConfig={{
                    waitForInteraction: true,
                    viewAreaCoveragePercentThreshold: 95,
                }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: initValueAnimated } } }],
                    { useNativeDriver: false }
                )}
                loadMore={isValidating}
                onEndReached={handleLoadMoreProduct}
                heightLoading={dimens.verticalScale(90)}
                columnWrapperStyle={{ backgroundColor: colors.grey_[100] }}
            />
        </TabView.Item>
    );
});
