/* eslint-disable react-hooks/exhaustive-deps */
import IconButton from 'components/IconButton';
import { Status } from 'const/index';
import { useCartSwr, useTheme } from 'hooks';
import { ItemAddToCartListType } from 'hooks/swr/cartSwr/useCartSwr';
import useProductDetailDynamicSWR from 'hooks/swr/productSwr/useProductDetailDynamicSWR';
import { ProductListItemType } from 'models';
import React, { memo, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheetAddToCartSuccess from 'screens/productdetail/components/BottomSheetAddToCartSuccess';
import BottomSheetOptions, {
    DataSuccessType,
} from 'screens/productdetail/components/BottomSheetOptions';
import { themeType } from 'theme';
import { formatProductPrices } from 'utils/helpers';
import showMessageApp from 'utils/showMessageApp';

interface Props {
    item: ProductListItemType;
    color?: string;
    bgColor?: string;
    width?: number;
    height?: number;
    qtyAdd?: number;
}

//render list product item
const IconAddCart = memo(function IconAddCart({
    item,
    color,
    bgColor,
    width,
    height,
    qtyAdd = 1,
}: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);

    //props
    const { type_id, uuid, product_seller_uuid: psu } = item || {};

    //state
    const [actionOption, setActionOption] = useState<'add_to_cart'>();
    const [itemsAddSuccess, setItemsAddSuccess] =
        useState<Array<ItemAddToCartListType & { code?: string }>>();

    //swr
    const { productDetail: pdc, mutate: mutatePDC } = useProductDetailDynamicSWR(uuid, psu, {
        revalidateOnMount: false,
        revalidateOnFocus: false,
    });

    const { addProductToCart, addProductListToCart, statusAdd, setStatusAdd } = useCartSwr(
        undefined,
        { revalidateOnMount: false, revalidateOnFocus: false },
        false
    );

    // value
    const { finalPrice } = formatProductPrices(item);

    //effect
    //--mutate product config
    useEffect(() => {
        if (item?.type_id === 'configurable') {
            mutatePDC();
        }
    }, [item]);

    //handle
    const checkAddProductToCart = async () => {
        if (type_id === 'configurable') {
            visibleBottomSheetOption('add_to_cart');
            return;
        }
        //simple
        const result = await addProductToCart({
            product_uuid: item.uuid,
            product_seller_uuid: item.product_seller_uuid,
            name: item.name,
            image: item.image,
            price: item.price || '',
            qty: qtyAdd,
        });
        if (result) {
            setItemsAddSuccess([result]);
        }
    };

    // add_to_cart
    const handleSelectOptionSuccess = async (_: any, data: DataSuccessType) => {
        const { items } = data || {};
        if (items) {
            const result = await addProductListToCart(items);
            setItemsAddSuccess(result);
            return;
        }
        showMessageApp('Đã xảy ra lỗi khi thêm giỏ hàng option! ', {
            valueType: 'message',
        });
    };

    //--option visible
    const visibleBottomSheetOption = (action?: 'add_to_cart') => {
        setActionOption(action);
    };

    return (
        <>
            <IconButton
                type="font-awesome-5"
                name="cart-plus"
                color={color || theme.colors.white_[10]}
                bgColor={bgColor || theme.colors.main[600]}
                style={styles.icon_cart}
                size={theme.typography.size(13)}
                variant="solid"
                width={width || theme.dimens.moderateScale(50)}
                height={height || theme.dimens.moderateScale(25)}
                onPress={checkAddProductToCart}
                disable={statusAdd === Status.LOADING}
                loading={statusAdd === Status.LOADING}
            />

            {/* sheet option */}
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

            {/* bottom sheet add to cart */}
            <BottomSheetAddToCartSuccess
                statusAdd={statusAdd as any}
                itemsAddResult={itemsAddSuccess}
                onClose={() => {
                    setStatusAdd(Status.DEFAULT);
                    setItemsAddSuccess(undefined);
                }}
            />
        </>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        //add cart
        icon_cart: {
            padding: theme.spacings.tiny,
            borderRadius: 5,
        },
    });

export default IconAddCart;
