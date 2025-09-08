import Image from 'components/Image';
import Text from 'components/Text';
import View from 'components/View';
import {
    NAVIGATION_TO_PRODUCT_DETAIL_SCREEN,
    NAVIGATION_TO_PRODUCT_DETAIL_STACK,
} from 'const/routes';
import { useTheme } from 'hooks';
import { ProductListItemType } from 'models';
import * as RootNavigation from 'navigation/RootNavigation';
import React, { memo } from 'react';
import { ImageBackground, ListRenderItem, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { formatProductPrices } from 'utils/helpers';
import useStyles from '../styles';

interface Props {
    products: any[];
}

const ProductSaleItem = memo(function ProductSaleItem({ products }: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles();

    const renderProductSaleItem: ListRenderItem<ProductListItemType> = ({ item, index }) => {
        const { finalPrice } = formatProductPrices(item);
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.touch_wrap_item}
                key={index}
                onPress={() =>
                    RootNavigation.push(NAVIGATION_TO_PRODUCT_DETAIL_STACK, {
                        screen: NAVIGATION_TO_PRODUCT_DETAIL_SCREEN,
                        params: {
                            product_uuid: item.uuid,
                            product_seller_uuid: item.product_seller_uuid,
                        },
                    })
                }
            >
                <View style={styles.view_imageProduct}>
                    <Image
                        source={{
                            uri: item.image,
                            priority: 'normal',
                        }}
                        resizeMode={'contain'}
                    />
                </View>
                <View style={styles.view_badgeContainer}>
                    <ImageBackground
                        source={require('asset/img_logoDiscount.png')}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <View style={styles.view_badgeText}>
                            <Text color={theme.colors.white_[10]} size={'sub2'}>
                                {item.type_id === 'simple'
                                    ? `-${item.discount_percent}%`
                                    : `-${item.max_discount_percent}%`}
                            </Text>
                        </View>
                    </ImageBackground>
                </View>
                <View mt={theme.spacings.tiny} ph="small">
                    <Text color={theme.colors.white_[10]} numberOfLines={1} ta="center">
                        {item.name}
                    </Text>
                </View>
                <View>
                    <Text fw="bold" color={theme.colors.main['50']} ta="center">
                        {finalPrice}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View flex={1} jC="center">
            <FlatList
                data={products}
                renderItem={renderProductSaleItem}
                keyExtractor={(item) => item?.uuid}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
});

export default ProductSaleItem;
