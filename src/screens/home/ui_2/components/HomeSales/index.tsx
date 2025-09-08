/* eslint-disable react-hooks/exhaustive-deps */
import DeepLink from 'components/DeepLink';
import Image from 'components/Image';
import Text from 'components/Text';
import Touch from 'components/Touch';
import View from 'components/View';
import { HOME_SALE_SECTION_BANNER } from 'const/slides';
import { useNavigate, useProductSwr, useSlideSwr, useTheme } from 'hooks';
import React, { memo, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import Swiper from 'react-native-swiper';
import { getSlideImage, isEmpty } from 'utils/helpers';
import ProductSaleItem from './components/ProductSaleItem';
import useStyles from './styles';

interface Props {
    refreshControl: boolean;
    isAppStart: boolean;
}

const HomeSales = memo(function HomeSales({ refreshControl, isAppStart }: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles();
    const navigate = useNavigate();
    //swr
    const { products: productsDiscount, mutate: mutateProductDiscount } = useProductSwr(
        { discount: 'Y' },
        { revalidateOnMount: false }
    );
    const {
        slides: saleSlide,
        isValidating: isValidatingSaleSlide,
        mutate: mutateSaleSlide,
    } = useSlideSwr(
        {
            group: HOME_SALE_SECTION_BANNER,
        },
        { revalidateOnMount: false },
        3600
    );

    //effect
    //--fetch init
    useEffect(() => {
        if (isAppStart) {
            mutateProductDiscount();
            mutateSaleSlide();
        }
    }, [isAppStart]);
    //--refresh control
    useEffect(() => {
        if (refreshControl && isAppStart) {
            mutateProductDiscount();
            mutateSaleSlide();
        }
    }, [refreshControl, isAppStart]);

    return (
        <View>
            {/* slide */}

            {!isEmpty(saleSlide) ? (
                <>
                    <View style={styles.view_sales_banner}>
                        <Swiper
                            width={theme.dimens.width}
                            height={0}
                            loadMinimalLoader={<ActivityIndicator size="large" />}
                            autoplay={true}
                            autoplayTimeout={10}
                            showsPagination={false}
                        >
                            {!isValidatingSaleSlide ? (
                                saleSlide.map((value, index) => {
                                    const { link, image } = getSlideImage(value);
                                    return (
                                        <DeepLink url={link} key={index}>
                                            <Image
                                                source={{
                                                    uri: image,
                                                }}
                                                w="95%"
                                                bg
                                                resizeMode={'stretch'}
                                                radius={5}
                                            />
                                        </DeepLink>
                                    );
                                })
                            ) : (
                                <View
                                    w="95%"
                                    h={'100%'}
                                    aS="center"
                                    bg={theme.colors.grey_[200]}
                                    radius={5}
                                />
                            )}
                        </Swiper>
                    </View>
                </>
            ) : null}

            {isEmpty(productsDiscount) ? null : (
                <>
                    <View flex={1} bg={theme.colors.white_[10]} w={'100%'} aI="center">
                        <View style={styles.view_salesContainer}>
                            <Touch
                                activeOpacity={0.8}
                                flexDirect="row"
                                jC="space-between"
                                onPress={navigate.FLASH_SALE_ROUTE()}
                                ph={'small'}
                                pv="medium"
                            >
                                <View flexDirect="row" aI="center">
                                    <Image
                                        source={require('asset/img-flash.gif')}
                                        w={'14%'}
                                        resizeMode="contain"
                                    />
                                    <Text size={'body2'} color={theme.colors.main['50']} ml="small">
                                        ĐANG GIẢM GIÁ
                                    </Text>
                                </View>
                                <View flexDirect="row" aI="center">
                                    <Text color={theme.colors.white_[10]}>Xem thêm</Text>
                                </View>
                            </Touch>

                            <ProductSaleItem products={productsDiscount} />
                        </View>
                    </View>
                </>
            )}
        </View>
    );
});

export default HomeSales;
