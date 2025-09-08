/* eslint-disable react-native/no-inline-styles */
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AfterInteractions from 'components/AfterInteractions';
import Disconnect from 'components/Disconnect';
import FocusAwareStatusBar from 'components/FocusAwareStatusBar';
import Header from 'components/Header';
import ListProductsWrapper from 'components/ListProductsWrapper';
import MiniCart from 'components/MiniCart';
import MiniChat from 'components/MiniChat';
import Status from 'const/status';
import {
    useCartSwr,
    useInternet,
    useIsLogin,
    useNavigate,
    useProductSwrInfinity,
    useSellerSwr,
    useTheme,
} from 'hooks';
import { ItemAddToCartListType } from 'hooks/swr/cartSwr/useCartSwr';
import useProductDetailDynamicSWR from 'hooks/swr/productSwr/useProductDetailDynamicSWR';
import useProductDetailStaticSWR from 'hooks/swr/productSwr/useProductDetailStaticSWR';
import useProductReviewSummarySwr from 'hooks/swr/reviewsSwr/useProductReviewSummarySwr';
import { useRefreshControl } from 'hooks/useRefreshControl';
import { ProductDetailStackParamsList } from 'navigation/type';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    interpolateColor,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { isEmpty } from 'utils/helpers';
import BottomSheetAddToCartSuccess from './components/BottomSheetAddToCartSuccess';
import { DataSuccessType } from './components/BottomSheetOptions';
import DetailAddition from './components/DetailAddition';
import DetailDescription from './components/DetailDescription';
import DetailMainInfo from './components/DetailMainInfo';
import DetailReview from './components/DetailReview';
import DetailShopInfo from './components/DetailShopInfo';
import TabbarFixed from './components/TabbarFixed';
import useStyles from './styles';

/* eslint-disable react-hooks/exhaustive-deps */

interface Props {
    route: RouteProp<ProductDetailStackParamsList, 'ProductDetailScreen'>;
    navigation: StackNavigationProp<any, any>;
}

const TouchAnimated = Animated.createAnimatedComponent(TouchableOpacity);
const IconAnimated = Animated.createAnimatedComponent(Icon);

const ProductDetailScreen = memo(function ProductDetailScreen({ route, navigation }: Props) {
    //hook
    const styles = useStyles();
    const { theme } = useTheme();
    const isInternet = useInternet();
    const isLogin = useIsLogin();
    const navigate = useNavigate();

    //state
    const [qtyAdd, setQtyAdd] = useState(1);

    //--check add success
    const [imageAddSuccess, setImageAddSuccess] = useState<string>();
    const [itemsAddSuccess, setItemsAddSuccess] =
        useState<Array<ItemAddToCartListType & { code?: string }>>();

    //params
    const productUuid = route.params.product_uuid;
    const productSellerUuid = route.params?.product_seller_uuid;
    //swr

    const { productDetail: pds, mutate: mutatePDS } = useProductDetailStaticSWR(
        productUuid,
        productSellerUuid
    );
    const { productDetail: pdc, mutate: mutatePDC } = useProductDetailDynamicSWR(
        productUuid,
        productSellerUuid
    );

    const { products: productsRelated } = useProductSwrInfinity(
        {
            category_uuid: pds?.category_uuid,
        },
        { revalidateOnMount: false }
    );

    const {
        statusAdd,
        isValidating,
        setStatusAdd,
        addProductToCart,
        addProductListToCart,
        mutate: mutateCart,
    } = useCartSwr({}, { revalidateOnMount: false });

    const { seller, mutate: mutateSeller } = useSellerSwr(
        'seller_code',
        pds?.seller?.seller_code || '',
        {
            revalidateOnMount: false,
        }
    );

    const { reviewsSummary, mutate: mutateSummary } = useProductReviewSummarySwr(
        pds?.product_seller_uuid || '',
        { revalidateOnMount: false }
    );

    //refresh
    const { refreshControl } = useRefreshControl(() => {
        mutateSummary();
        mutateSeller();
        mutateCart();
        mutatePDC();
        mutatePDS();
    });

    //state
    const [indexOptionSelected, setIndexOptionSelected] = useState<number>();

    //animation
    const initValueScroll = useSharedValue(0);

    const headerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            initValueScroll.value,

            [0, 100],
            [0, 1],
            Extrapolation.CLAMP
        ),
    }));

    const bgIconAnimatedStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            initValueScroll.value,
            [0, 100],
            ['rgba(0,0,0, 0.3)', theme.colors.white_[10]]
        ),
    }));

    const colorIconAnimatedStyle = useAnimatedStyle(() => ({
        color: interpolateColor(
            initValueScroll.value,
            [0, 100],
            [theme.colors.white_[10], theme.colors.main['600']]
        ),
        backgroundColor: 'transparent',
    }));

    const onScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            initValueScroll.value = event.contentOffset.y;
        },
    });

    /* ----- effect ----- */
    //--mutate product config
    useEffect(() => {
        if (pds?.product_seller_uuid) {
            mutateSummary();
        }
        if (pds?.seller) {
            mutateSeller();
        }
    }, [pds]);

    /* ----- handle ----- */

    const changeQtyAddToCart = useCallback((value: number) => {
        setQtyAdd(value);
    }, []);

    // add_to_cart, buy_now, select
    const handleSelectOptionSuccess = useCallback(
        async (
            action: 'add_to_cart' | 'buy_now' | 'select',
            data: DataSuccessType,
            isSingle?: boolean
        ) => {
            setImageAddSuccess(undefined);
            setItemsAddSuccess(undefined);

            if (!isLogin) {
                navigate.LOGIN_ROUTE()();
                return;
            }

            if (isValidating) {
                return;
            }

            const { items, index } = data || {};

            if (action === 'add_to_cart') {
                if (!items) {
                    return;
                }
                // single
                if (items?.length === 1) {
                    const dataItem = isSingle ? { ...items[0], qty: qtyAdd } : items[0];
                    const result = await addProductToCart(dataItem);
                    setImageAddSuccess(result?.image);
                    return;
                }
                // multiple
                const resultList = await addProductListToCart(items);
                setItemsAddSuccess(resultList);
            }

            if (action === 'buy_now') {
                if (!items) {
                    return;
                }
                // single
                if (items?.length === 1) {
                    const dataItem = isSingle ? { ...items[0], qty: qtyAdd } : items[0];
                    addProductToCart(dataItem, true);
                    return;
                }
                // multiple
                addProductListToCart(items, true);
                return;
            }

            if (action === 'select') {
                setIndexOptionSelected(index);
            }
        },
        [isLogin, isValidating, pds, qtyAdd]
    );

    /* ----- render ----- */
    const renderDetailHeader = () => (
        <Header
            containerStyle={styles.header_container}
            leftComponent={
                <TouchAnimated
                    style={[styles.view_header_left, bgIconAnimatedStyle]}
                    onPress={navigation.goBack}
                >
                    <IconAnimated
                        name="arrow-back-outline"
                        size={theme.typography.title4}
                        style={colorIconAnimatedStyle}
                    />
                </TouchAnimated>
            }
            rightComponent={
                <View style={styles.view_header_right}>
                    <MiniChat
                        containerStyle={[styles.chat_container, bgIconAnimatedStyle]}
                        iconStyle={colorIconAnimatedStyle}
                    />
                    <MiniCart
                        isFlyToCart
                        statusAdd={statusAdd}
                        imageAddSuccess={imageAddSuccess}
                        size={theme.typography.title4}
                        iconStyle={colorIconAnimatedStyle}
                        containerStyle={bgIconAnimatedStyle}
                    />
                </View>
            }
            backgroundColor={theme.colors.transparent}
            animated={true}
            colorsAnimated={[theme.colors.white_[10], theme.colors.white_[10]]}
            bgViewHeaderStyle={headerAnimatedStyle}
            statusBarProps={{ barStyle: 'dark-content' }}
            rightContainerStyle={{ flex: 0.25 }}
        />
    );

    if (!isInternet) {
        return (
            <>
                {renderDetailHeader()}
                <Disconnect height={theme.dimens.height * 0.8} />
            </>
        );
    }
    return (
        <>
            <FocusAwareStatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle={'dark-content'}
            />
            <AfterInteractions style={styles.view_container}>
                {renderDetailHeader()}
                <View style={styles.view_flatlist}>
                    <ListProductsWrapper
                        data={isEmpty(pds) ? [] : productsRelated}
                        numColumns={2}
                        ListHeaderComponent={
                            <>
                                {/* top */}
                                <DetailMainInfo
                                    pds={pds}
                                    pdc={pdc}
                                    productUUIDParam={productUuid}
                                    reviewsSummary={reviewsSummary}
                                    changeQtyAddToCart={changeQtyAddToCart}
                                />
                                {/* body */}
                                <DetailAddition
                                    pds={pds}
                                    pdc={pdc}
                                    indexOptionSelected={indexOptionSelected}
                                />
                                <DetailShopInfo pds={pds} seller={seller} />
                                <DetailDescription pds={pds} />
                                {/* bottom */}
                                <DetailReview pds={pds} reviewsSummary={reviewsSummary} />
                            </>
                        }
                        onScroll={onScroll}
                        columnWrapperStyle={{
                            backgroundColor: theme.colors.grey_[100],
                        }}
                        onEndReachedThreshold={0.5}
                        viewabilityConfig={{
                            waitForInteraction: true,
                            viewAreaCoveragePercentThreshold: 95,
                        }}
                        refreshControl={refreshControl()}
                        heightLoading={theme.dimens.verticalScale(90)}
                    />
                </View>
                <TabbarFixed
                    pds={pds}
                    pdc={pdc}
                    seller={seller}
                    onSelectOptionSuccess={handleSelectOptionSuccess}
                    statusAdd={statusAdd}
                />
                <BottomSheetAddToCartSuccess
                    statusAdd={statusAdd as any}
                    itemsAddResult={itemsAddSuccess}
                    onClose={() => {
                        setStatusAdd(Status.DEFAULT);
                    }}
                />
            </AfterInteractions>
        </>
    );
});

// export default ProductDetailScreen;
// ProductDetailScreen.whyDidYouRender = {
//     logOnDifferentValues: true,
//     trackAllPureComponents: true,
// };
export default ProductDetailScreen;
