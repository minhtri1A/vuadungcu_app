/* eslint-disable react-hooks/exhaustive-deps */
import IconButton from 'components/IconButton';
import Image from 'components/Image';
import Text from 'components/Text';
import Touch from 'components/Touch';
import View from 'components/View';
import { Status } from 'const/index';
import { useIsLogin, useNavigate, useTheme } from 'hooks';
import useCartSwr, { ItemAddToCartListType } from 'hooks/swr/cartSwr/useCartSwr';
import useProductDetailDynamicSWR from 'hooks/swr/productSwr/useProductDetailDynamicSWR';
import { ProductListItemType } from 'models';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheetOptions, {
    DataSuccessType,
} from 'screens/productdetail/components/BottomSheetOptions';
import { currencyFormat } from 'utils/helpers';

interface Props {
    item: ProductListItemType;
    setValueStatusAdd: (status: any) => void;
    setAddToCartSuccessData: (
        image?: string,
        items?: Array<
            ItemAddToCartListType & {
                code?: string;
            }
        >
    ) => void;
}

const ProductSearchItem = memo(function ProductSearchItem({
    item,
    setValueStatusAdd,
    setAddToCartSuccessData,
}: Props) {
    //hooks
    const styles = useStyles();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const isLogin = useIsLogin();

    //state
    const [actionOption, setActionOption] = useState<'add_to_cart'>();

    //SWR
    const { addProductToCart, addProductListToCart, statusAdd, isValidating } = useCartSwr(
        {},
        { revalidateOnMount: false }
    );

    //swr
    const { productDetail: pdc, mutate: mutatePDC } = useProductDetailDynamicSWR(
        item.uuid,
        item.product_seller_uuid,
        {
            revalidateOnMount: false,
            revalidateOnFocus: false,
        }
    );

    //value check

    const finalPrice = (() => {
        if (item.type_id === 'simple') {
            return `${currencyFormat(item.special_price)}`;
        }
        // config
        if (!item.max_special_price || item.max_price === item.max_special_price) {
            return `${currencyFormat(item.min_price, false)} - ${currencyFormat(item.max_price)}`;
        }
        return `${currencyFormat(item.min_special_price, false)} - ${currencyFormat(
            item.max_special_price
        )}`;
    })();

    //effect
    //--mutate product config
    useEffect(() => {
        if (item?.type_id === 'configurable') {
            mutatePDC();
        }
    }, [item]);

    useEffect(() => {
        setValueStatusAdd(statusAdd);
    }, [statusAdd]);

    //handle
    // -- add_to_cart single or visible option
    const checkAddToCartMultipleType = async () => {
        if (item.type_id === 'configurable') {
            visibleBottomSheetOption('add_to_cart');
        } else {
            const resultAdd = await addProductToCart({
                product_uuid: item.uuid,
                product_seller_uuid: item.product_seller_uuid,
                name: item.name,
                image: item.image,
                price: item.price || '',
                qty: 1,
            });
            setAddToCartSuccessData(resultAdd?.image);
        }
    };

    //--add_to_cart
    const handleSelectOptionSuccess = useCallback(
        async (action: 'add_to_cart' | 'buy_now' | 'select', data: DataSuccessType) => {
            if (!isLogin) {
                navigate.LOGIN_ROUTE()();
                return;
            }

            if (isValidating) {
                return;
            }

            const { items } = data || {};

            if (action === 'add_to_cart') {
                if (!items) {
                    return;
                }
                if (items?.length === 1) {
                    const resultAdd = await addProductToCart(items[0]);
                    setAddToCartSuccessData(resultAdd?.image);
                    setAddToCartSuccessData();
                    return;
                }
                const resultAddList = await addProductListToCart(items);
                setAddToCartSuccessData(undefined, resultAddList);
            }
        },
        [isLogin, isValidating]
    );

    //--option visible
    const visibleBottomSheetOption = (action?: 'add_to_cart') => {
        setActionOption(action);
    };
    //navigate

    return (
        <View style={styles.view_wrap_product}>
            <Touch
                flex={1}
                flexDirect="row"
                activeOpacity={0.9}
                onPress={navigate.PRODUCT_DETAIL_ROUTE(item.uuid, item.product_seller_uuid)}
            >
                <View flex={0.25} ratio={1}>
                    <Image
                        ratio={1}
                        source={{
                            uri: item.image || '',
                        }}
                    />
                </View>
                <View flex={0.75} mh={'small'}>
                    <Text numberOfLines={2}>{item.name}</Text>
                    <Text color="red">{finalPrice}</Text>
                </View>
            </Touch>
            <View jC="center">
                <IconButton
                    type="font-awesome"
                    size={theme.typography.size(20)}
                    name="cart-plus"
                    color={theme.colors.white_[10]}
                    loading={statusAdd === Status.LOADING}
                    onPress={checkAddToCartMultipleType}
                    bgColor={theme.colors.main[600]}
                    style={styles.icon_style}
                    variant="solid"
                />
            </View>

            {/*  */}
            <BottomSheetOptions
                action={actionOption}
                productItem={{
                    image: item.image,
                    name: item.name,
                    price: finalPrice,
                }}
                children={pdc?.children}
                attribute={pdc?.attribute_config}
                onClose={visibleBottomSheetOption}
                onSelectOptionSuccess={handleSelectOptionSuccess}
            />
        </View>
    );
});

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        ///
        container_header: {
            paddingHorizontal: 0,
            paddingVertical: 0,
            elevation: 1,
        },
        left_container: {
            // flex: 0,
            display: 'none',
        },
        center_container: {
            flex: 1,
        },
        right_container: {
            flex: 0.3,
            justifyContent: 'center',
            alignItems: 'flex-end',
            backgroundColor: theme.colors.white_[10],
            paddingRight: theme.spacings.medium,
        },

        //search bar
        containerSearch: {
            flex: 1,
            backgroundColor: theme.colors.grey_[200],
            alignItems: 'center',
            marginTop: 0,
            position: 'relative',
        },
        viewSearchStyle: {
            width: theme.dimens.width,
            backgroundColor: theme.colors.white_[10],
        },
        viewTitleSearch: {
            width: theme.dimens.width,
            flexDirection: 'row',
            padding: theme.spacings.small,
        },

        searchbar_container: {
            width: '100%',
            padding: 0,
            borderWidth: 0,
            elevation: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
        },
        input_container: {
            backgroundColor: theme.colors.white_[10],
            borderRadius: 0,
        },
        input_style: {
            padding: 0,
            fontSize: theme.typography.body2,
            color: theme.colors.grey_[500],
        },
        //voice
        waveIndicator: {
            position: 'absolute',
            left: -34,
            right: 0,
            top: 0,
            bottom: 0,
            zIndex: -1,
        },
        //history
        viewItemHistory: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey_[200],
            justifyContent: 'space-between',
            paddingLeft: theme.spacings.small,
        },
        touchHistory: {
            flex: 1,
            justifyContent: 'center',
        },
        touchIconArrow: {
            justifyContent: 'center',
            padding: theme.spacings.small,
        },
        viewClearHistory: {
            height: theme.dimens.height * 0.05,
            justifyContent: 'center',
            alignItems: 'center',
        },
        //product
        view_wrap_product: {
            flexDirection: 'row',
            padding: theme.spacings.small,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey_[100],
        },
        view_fly_image: {
            backgroundColor: 'red',
            borderRadius: 50,
            overflow: 'hidden',
        },
        icon_style: {
            zIndex: 999999,
        },
    });
};

export default ProductSearchItem;
