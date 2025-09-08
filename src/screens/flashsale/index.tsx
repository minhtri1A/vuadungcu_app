/* eslint-disable react-hooks/exhaustive-deps */
import AfterInteractions from 'components/AfterInteractions';
import Header from 'components/Header';
import IconAddCart from 'components/IconAddCart';
import Image from 'components/Image';
import MiniCart from 'components/MiniCart';
import Text from 'components/Text';
import View from 'components/View';
import { useNavigate, useProductSwrInfinity, useTheme } from 'hooks';
import { ProductListItemType } from 'models';
import React, { memo } from 'react';
import {
    FlatList,
    ImageBackground,
    ListRenderItem,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { currencyFormat } from 'utils/helpers';

const FlashSaleScreen = memo(function FlashSaleScreen() {
    //hook
    const styles = useStyles();
    const { theme } = useTheme();
    const navigate = useNavigate();
    //state
    //swr
    const { products } = useProductSwrInfinity({ discount: 'Y' });
    //value
    const fistItem: any = products.shift();
    //custom border
    const windowWidth = theme.dimens.width;

    const imageAspectWidth = theme.dimens.verticalScale(110);
    const imageAspectHeight = theme.dimens.verticalScale(110);
    const curveAdjustment = 40;
    const maskHeight = theme.dimens.verticalScale(90);
    const scaleFactor = imageAspectWidth / imageAspectHeight;
    const scaledHeight = scaleFactor * maskHeight;
    const controlPointX = windowWidth / 2.0;
    const controlPointY = scaledHeight + curveAdjustment;

    //render

    const renderProductSaleListItems: ListRenderItem<ProductListItemType> = ({ item, index }) =>
        renderProductSaleItem(item, index);

    const renderProductSaleItem = (item: ProductListItemType, index: number) => (
        <TouchableOpacity
            style={styles.view_wrap_item}
            key={index}
            onPress={navigate.PRODUCT_DETAIL_ROUTE(item.uuid, item.product_seller_uuid)}
            activeOpacity={1}
        >
            <View w={'30%'} ratio={1}>
                <Image
                    source={{
                        uri: item?.image,
                    }}
                    resizeMode="contain"
                    radius={5}
                />
                <ImageBackground
                    source={require('asset/img-sale.png')}
                    resizeMode="contain"
                    resizeMethod="auto"
                    imageStyle={styles.bgimg_img_style}
                    style={styles.bgimg_style}
                >
                    <Text size={'sub2'} color={theme.colors.white_[10]}>
                        {item.discount_percent}%
                    </Text>
                </ImageBackground>
            </View>
            <View flex={1} ml="small">
                <Text color={theme.colors.grey_[500]} fw="bold" numberOfLines={2}>
                    {item?.name}
                </Text>

                <Text style={styles.txt_qty}>{item.qty} còn lại</Text>
                <Text color={theme.colors.grey_[400]} tD="line-through">
                    {currencyFormat(item.price)}
                </Text>
                <View flexDirect="row" jC="space-between">
                    <Text color="red" fw="bold" size={'body2'}>
                        {currencyFormat(item.special_price)}
                    </Text>
                    <IconAddCart
                        item={item}
                        color="red"
                        bgColor={theme.colors.red['300']}
                        width={theme.dimens.scale(55)}
                    />
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.view_container}>
            <Header
                centerTitle="Sản phẩm giảm giá"
                backgroundColor={theme.colors.red['400']}
                statusBarProps={{ backgroundColor: theme.colors.red['400'] }}
                centerTitleSize={'title1'}
                colorBackIcon={theme.colors.white_[10]}
                rightComponent={
                    <MiniCart
                        color={theme.colors.white_[10]}
                        badgeBgColor={theme.colors.main['600']}
                    />
                }
            />
            <AfterInteractions style={styles.view_body}>
                {products.length > 0 ? (
                    <FlatList
                        data={products}
                        renderItem={renderProductSaleListItems}
                        keyExtractor={(value) => `${value.product_seller_uuid}`}
                        ListHeaderComponent={
                            <View h={theme.dimens.verticalScale(150)}>
                                <Svg height="100%" width="100%">
                                    <Path
                                        d={`M0 0 L${windowWidth} 0 L${windowWidth} ${maskHeight} Q${controlPointX} ${controlPointY} 0 ${maskHeight} Z`}
                                        fill={theme.colors.red['400']}
                                    />
                                </Svg>
                                <View style={{ transform: [{ translateY: -145 }] }}>
                                    {renderProductSaleItem(fistItem, 99999)}
                                </View>
                            </View>
                        }
                    />
                ) : null}
            </AfterInteractions>
        </View>
    );
});

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        view_container: {
            flex: 1,
        },
        view_body: {
            flex: 1,
        },
        view_wrap_item: {
            backgroundColor: theme.colors.white_[10],
            flexDirection: 'row',
            padding: theme.spacings.medium,
            marginHorizontal: theme.spacings.medium,
            marginTop: theme.spacings.medium,
            minHeight: theme.dimens.verticalScale(121),
            borderRadius: 5,
            ...theme.styles.shadow1,
        },
        bgimg_style: {
            position: 'absolute',
            bottom: 0,
            left: -theme.dimens.scale(6),
            width: theme.dimens.scale(50),
            height: theme.dimens.scale(35),
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: theme.dimens.scale(5),
        },
        bgimg_img_style: {
            width: theme.dimens.scale(50),
        },
        txt_qty: {
            paddingHorizontal: theme.spacings.small,
            paddingVertical: theme.spacings.spacing(2),
            backgroundColor: theme.colors.red['500'],
            alignSelf: 'flex-start',
            borderRadius: 10,
            fontSize: theme.typography.sub2,
            color: theme.colors.white_[10],
            marginVertical: theme.spacings.tiny,
        },
        touch_btn_buy: {
            paddingHorizontal: theme.spacings.small,
            paddingVertical: theme.spacings.spacing(4),
            backgroundColor: theme.colors.red['50'],
            borderRadius: 10,
        },
    });
};

export default FlashSaleScreen;
