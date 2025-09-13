import React, { memo } from 'react';
// import { Header } from '@rneui/themed';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Image from 'components/Image';
import Text from 'components/Text';
import View from 'components/View';
import { useTheme } from 'hooks';
import useProductDetailDynamicSWR from 'hooks/swr/productSwr/useProductDetailDynamicSWR';
import useProductDetailStaticSWR from 'hooks/swr/productSwr/useProductDetailStaticSWR';
import { map } from 'lodash';
import { ProductDetailStackParamsList } from 'navigation/type';
import { ScrollView, StyleSheet } from 'react-native';
import SellerItems from './components/SellerItems';
import Header from 'components/Header2';

interface Props {
    route: RouteProp<ProductDetailStackParamsList, 'PriceComparisonScreen'>;
    navigation: StackNavigationProp<any, any>;
}

const PriceComparisonScreen = memo(function PriceComparisonScreen({ route }: Props) {
    //hook
    const {
        theme: { colors },
    } = useTheme();
    const styles = useStyles();
    //params
    const product_uuid = route.params.product_uuid;
    //swr
    const { productDetail: pdc } = useProductDetailDynamicSWR(product_uuid);
    const { productDetail: pds } = useProductDetailStaticSWR(product_uuid);
    //value
    //render

    const renderListSeller = () =>
        map(pdc?.sellers, (value, index) => (
            <SellerItems sellerItems={value} uuid={pds?.uuid} key={index} />
        ));

    return (
        <View flex={1}>
            <Header
                center={
                    <Text size={'title2'} ta="center">
                        So sánh giá
                    </Text>
                }
                showGoBack
                iconGoBackColor={colors.black_[10]}
                bgColor={colors.white_[10]}
                statusBarColor={colors.main['600']}
            />
            {/* top info */}
            <ScrollView>
                <View bg={colors.white_[10]}>
                    <View ratio={1}>
                        <Image
                            source={{
                                uri: pds?.images[0].url || '',
                            }}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.view_name}>
                        <Text size={'title1'}>{pds?.name}</Text>
                        <Text color={colors.grey_[400]}>Thương hiệu: {pds?.brand}</Text>
                    </View>
                    <Text p={'small'}>
                        Tìm thấy {pdc?.sellers.length} gian hàng bán sản phẩm này
                    </Text>
                </View>
                {/* bottom seller */}
                <Text p="small" size="body3" fw="bold">
                    Danh sách gian hàng
                </Text>
                <View aI="center">{renderListSeller()}</View>
            </ScrollView>
        </View>
    );
});

export default PriceComparisonScreen;

const useStyles = () => {
    const {
        theme: { colors, spacings },
    } = useTheme();
    return StyleSheet.create({
        /* ------- screen ------- */
        view_name: {
            borderBottomWidth: 1,
            borderBottomColor: colors.grey_[200],
            padding: spacings.small,
        },
        view_wrap_seller: {
            backgroundColor: colors.white_[10],
            padding: spacings.small,
            marginBottom: spacings.small,
        },
        view_top_seller: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: colors.grey_[200],
            paddingBottom: spacings.small,
            marginBottom: spacings.small,
        },
        view_body_seller: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginBottom: spacings.small,
        },
    });
};
