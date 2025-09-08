/* eslint-disable react-hooks/exhaustive-deps */
import { Icon } from '@rneui/themed';
import Divider from 'components/Divider';
import Image from 'components/Image';
import ListProductItem from 'components/ListProductItem';
import Text from 'components/Text';
import View from 'components/View';
import { useNavigate, useProductSwr, useTheme } from 'hooks';
import { map } from 'lodash';
import { ProductDetailResponseType, SellerInfoResponseType } from 'models';
import React, { memo, useEffect } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import useStyles from '../styles';

interface Props {
    pds?: ProductDetailResponseType['detail-static'];
    seller: SellerInfoResponseType;
}

const DetailShopInfo = memo(function DetailShopInfo({ pds, seller }: Props) {
    //hooks
    const styles = useStyles();
    const {
        theme: { colors, spacings, typography },
    } = useTheme();
    const navigate = useNavigate();
    //swr
    //--product shop swr
    const { products: productShop, mutate: mutateProductShop } = useProductSwr(
        {
            seller_uuid: pds?.seller?.seller_uuid,
            page_size: 10,
        },
        { revalidateOnMount: false }
    );

    //effect
    useEffect(() => {
        if (pds?.seller) {
            mutateProductShop();
        }
    }, [pds?.seller]);

    return (
        <>
            {/* shop info */}
            <View p={spacings.medium}>
                {/* top info */}
                <View style={styles.view_shop_left}>
                    {/* image */}
                    <View w={'18%'} ratio={1}>
                        <Image source={{ uri: seller?.image }} resizeMode="contain" radius={5} />
                    </View>
                    {/* info */}
                    <TouchableOpacity
                        style={styles.touch_shop_info}
                        activeOpacity={0.9}
                        onPress={navigate.SHOP_ROUTE({ seller_code: seller?.seller_code })}
                    >
                        <View style={styles.view_shop_info}>
                            <View>
                                <Text fw="bold">{seller?.seller_name}</Text>
                                <View flexDirect="row" aI="center">
                                    <Icon
                                        type="ionicon"
                                        name="location-outline"
                                        size={typography.size(15)}
                                        color={colors.grey_[400]}
                                    />
                                    <Text color={colors.grey_[400]}>{seller?.stock_province}</Text>
                                </View>
                            </View>
                            <View>
                                <Icon
                                    type="ionicon"
                                    name="chevron-forward"
                                    color={colors.grey_[400]}
                                    size={typography.size(15)}
                                />
                            </View>
                        </View>

                        {/* <View w={'44%'} ratio={4 / 1}>
                            <Image
                                source={require('asset/img_auth_seller.png')}
                                resizeMode="contain"
                            />
                        </View> */}

                        <View
                            flexDirect="row"
                            aI="center"
                            aS="flex-end"
                            jC="space-evenly"
                            w="100%"
                            mt="tiny"
                        >
                            {/* <Text>-</Text> */}
                            <View flexDirect="row" aI="center" mr="tiny">
                                <Text size={'sub2'} color={colors.main['600']} mr={1}>
                                    {seller?.product_count}
                                </Text>
                                <Text size={'sub2'}>Sản phẩm</Text>
                            </View>

                            {/* <View flexDirect="row" aI="center" mh="tiny">
                                <Text size={'sub2'} color={ colors.main['600']} mr={1}>
                                    -
                                </Text>
                            </View> */}
                            {/* <Text>-</Text> */}
                            {/* <Icon
                                type="octicon"
                                name="dot-fill"
                                color={colors.grey_[400]}
                                size={typography.size(10)}
                            /> */}
                            {/* <View flexDirect="row" aI="center" ml="tiny">
                                <Text size={'sub2'} color={ colors.main['600']} mr={1}>
                                    -
                                </Text>
                            </View> */}
                        </View>
                    </TouchableOpacity>
                </View>
                {/* bottom button */}
                {/* <View style={styles.view_shop_button}>
                    <Button
                        icon={{
                            type: 'ionicon',
                            name: 'add-circle-outline',
                            size: typography.size(15),
                        }}
                        title={'Theo dõi'}
                        size="sm"
                        type="outline"
                        color={ colors.grey_[400]}
                        fw="normal"
                        titleSize={'body1'}
                        minWidth={'46.5%'}
                    />
                    <View mh={spacings.small} />
                    <Button
                        icon={{
                            type: 'ionicon',
                            name: 'chatbubble-ellipses-outline',
                            size: typography.size(15),
                        }}
                        title={'Chat ngay'}
                        minWidth={'46.5%'}
                        size="sm"
                        type="outline"
                        color={ colors.grey_[400]}
                        fw="normal"
                        titleSize={'body1'}
                        onPress={navigate.CHAT_MESSAGE_ROUTE({
                            user_uuid: seller?.seller_uuid || '',
                        })}
                    />
                </View> */}
            </View>
            <Divider />
            {/* shop product */}
            <View>
                <View style={styles.view_title_section}>
                    <Text fw="bold">SẢN PHẨM CÙNG SHOP</Text>
                    <TouchableOpacity>
                        {/* <Text color={ colors.grey_[500]}>Xem thêm</Text> */}
                    </TouchableOpacity>
                </View>
                <View>
                    <ScrollView horizontal contentContainerStyle={{ paddingLeft: spacings.small }}>
                        {map(productShop, (value, index) => (
                            <ListProductItem
                                item={value}
                                key={index}
                                lengthListProduct={productShop.length}
                                viewContainerStyle={styles.product_item_container}
                                showFirstPrice={false}
                                showRating={false}
                                textSalePriceProps={{ pattern: undefined, color: 'red' }}
                            />
                        ))}
                    </ScrollView>
                </View>
            </View>
            <Divider />
        </>
    );
});

export default DetailShopInfo;
