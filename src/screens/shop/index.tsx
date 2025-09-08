/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Icon, Tab, TabView } from '@rneui/themed';
import imgShop from 'asset/img_shop_test.png';
import AfterInteractions from 'components/AfterInteractions';
import Button from 'components/Button';
import Header from 'components/Header';
import IconButton from 'components/IconButton';
import Image from 'components/Image';
import LoadingFetchAPI from 'components/LoadingFetchAPI';
import Text from 'components/Text';
import View from 'components/View';
import { useNavigate, useSellerSwr, useTheme } from 'hooks';
import { ShopStackParamsList } from 'navigation/type';
import React, { memo, useState } from 'react';
import { Animated, ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import animation from 'theme/animation';
import { isEmpty } from 'utils/helpers';
import SearchModal from './component/SearchModal';
import useStyles from './styles';
import InfoTab from './tabs/InfoTab';
import ProductTab from './tabs/ProductTab';
import StoreTab from './tabs/StoreTab';

interface Props {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<ShopStackParamsList, 'ShopScreen'>;
}

export default memo(function ShopScreen({ navigation, route }: Props) {
    //hook
    const {
        theme: { colors, typography, spacings, dimens, styles: sty },
    } = useTheme();
    const styles = useStyles();
    const navigate = useNavigate();
    //state
    const [index, setIndex] = useState(0);
    const [isVisibleSearch, setIsVisibleSearch] = useState(false);
    //swr
    const { seller } = useSellerSwr('seller_code', route?.params?.seller_code);
    //value
    //animated
    const AnimatedImage = Animated.createAnimatedComponent(ImageBackground);
    const initValueAnimated = new Animated.Value(0);
    const heightHeader = animation(initValueAnimated, [0, 200], [dimens.height * 0.3, -50]);
    const mtHeaderButton = animation(initValueAnimated, [0, 200], [spacings.medium, -20]);
    const opacity = animation(initValueAnimated, [0, 200], [1, 0]);

    //handle
    const handleChangeIndex = (index: any) => {
        setIndex(index);
    };
    //handle
    const handleVisibleSearchModal = () => {
        setIsVisibleSearch((pre) => !pre);
    };

    return (
        <View style={{ flex: 1 }}>
            {/* header */}
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
                    <TouchableOpacity
                        containerStyle={styles.touch_container_search}
                        onPress={handleVisibleSearchModal}
                    >
                        <Text color={colors.white_[10]}>Tìm kiếm với cửa hàng...</Text>
                    </TouchableOpacity>
                }
                backgroundColor={'transparent'}
                containerStyle={styles.header_container}
                centerContainerStyle={styles.header_center_container}
                leftContainerStyle={styles.header_left_container}
                rightContainerStyle={styles.header_right_container}
            />
            {/* header view */}
            <View style={styles.view_wrap_header_image}>
                {/* header */}
                <AnimatedImage
                    source={imgShop}
                    style={{
                        minHeight: heightHeader,
                        justifyContent: 'flex-end',
                    }}
                >
                    <Animated.View
                        style={{
                            zIndex: 1,
                            position: 'relative',
                            padding: spacings.medium,
                            opacity: opacity,
                        }}
                    >
                        {/* header top - shop info */}
                        <View style={styles.view_shop_info}>
                            <View w={'20%'} ratio={1}>
                                <Image
                                    source={{ uri: seller?.image }}
                                    resizeMode="contain"
                                    radius={5}
                                />
                            </View>
                            <View pl="small" flex={1} jC="center">
                                <View flexDirect="row" aI="center">
                                    <Text
                                        size={'body2'}
                                        fw="bold"
                                        color={colors.white_[10]}
                                        numberOfLines={1}
                                    >
                                        {seller?.seller_name}
                                    </Text>
                                    <Icon
                                        type="ionicon"
                                        name="chevron-forward-outline"
                                        size={typography.body3}
                                        color={colors.white_[10]}
                                    />
                                </View>

                                {/* <View flexDirect="row" aI="center">
                                    <Icon
                                        type="ionicon"
                                        name="person-outline"
                                        size={typography.body3}
                                        color={colors.white_[10]}
                                    />
                                    <Text color={ colors.white_[10]}>Theo dỗi(1k)</Text>
                                </View> */}
                                {/* <View flexDirect="row" aI="center">
                                    <Icon
                                        type="ionicon"
                                        name="person-outline"
                                        size={typography.body3}
                                        color={colors.white_[10]}
                                    />
                                    <Text color={ colors.white_[10]}>Theo dỗi(1k)</Text>
                                </View> */}
                                <View flexDirect="row" aI="center">
                                    <Icon
                                        type="ionicon"
                                        name="location-outline"
                                        size={typography.body3}
                                        color={colors.grey_[300]}
                                    />
                                    <Text color={colors.grey_[300]}>{seller?.stock_province}</Text>
                                </View>
                                {/* <View flexDirect="row" aI="center">
                                    <Icon
                                        type="ionicon"
                                        name="star-sharp"
                                        size={typography.body3}
                                        color={colors.main["600"]}
                                    />
                                    <Text color={ colors.white_[10]}>5/5</Text>
                                    <Text ph={'tiny'} color={ colors.white_[10]}>
                                        -
                                    </Text>
                                    <Text color={ colors.white_[10]}>1k Đánh giá</Text>
                                </View> */}
                            </View>
                            {/* auth image */}
                            {/* <View aS="center" aI="center" ph={'small'}>
                                <View w={80} ratio={4 / 1}>
                                    <Image
                                        source={require('asset/img_auth_seller.png')}
                                        resizeMode="contain"
                                    />
                                </View>
                            </View> */}
                        </View>
                        {/* header bottom */}
                        <Animated.View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                marginTop: mtHeaderButton,
                            }}
                        >
                            {/* <Button
                                type="outline"
                                size="sm"
                                title="Theo dỗi"
                                icon={{
                                    type: 'ionicon',
                                    name: 'add',
                                    color: colors.white_[10],
                                    size: typography.title1,
                                }}
                                activeOpacity={0.5}
                                TouchableComponent={TouchableOpacity}
                                containerStyle={{ flex: 0.45 }}
                            />
                            */}
                            <Button
                                type="outline"
                                size="sm"
                                title="Chat"
                                icon={{
                                    type: 'ionicon',
                                    name: 'chatbubble-ellipses-outline',
                                    color: colors.white_[10],
                                    size: typography.title1,
                                }}
                                color={colors.white_[10]}
                                activeOpacity={0.5}
                                TouchableComponent={TouchableOpacity}
                                containerStyle={{ flex: 0.45 }}
                                onPress={navigate.CHAT_MESSAGE_ROUTE({
                                    user_uuid: seller?.seller_uuid || '',
                                })}
                            />
                        </Animated.View>
                    </Animated.View>
                    <View style={styles.view_transparent} />
                </AnimatedImage>
                {/* tab */}
                <View style={sty.shadow1} bg={colors.white_[10]}>
                    <Tab
                        value={index}
                        onChange={handleChangeIndex}
                        indicatorStyle={styles.tab_indicator}
                        containerStyle={styles.tab_container}
                        scrollable={true}
                        titleStyle={{ fontWeight: '100' }}
                    >
                        <Tab.Item
                            title="Cửa hàng"
                            titleStyle={(active) => ({
                                color: active ? colors.main['600'] : colors.black_[10],
                                fontSize: typography.body2,
                                fontWeight: 'normal',
                            })}
                        />
                        <Tab.Item
                            title="Sản phẩm"
                            titleStyle={(active) => ({
                                color: active ? colors.main['600'] : colors.black_[10],
                                fontSize: typography.body2,
                                fontWeight: '100',
                            })}
                        />
                        <Tab.Item
                            title="Thông tin"
                            titleStyle={(active) => ({
                                color: active ? colors.main['600'] : colors.black_[10],
                                fontSize: typography.body2,
                                fontWeight: '100',
                            })}
                        />
                    </Tab>
                </View>
            </View>
            {/* tab view */}
            <AfterInteractions style={styles.tab_view_container}>
                {!isEmpty(seller) ? (
                    <TabView
                        value={index}
                        onChange={setIndex}
                        disableSwipe
                        // animationType="spring"
                    >
                        <StoreTab initValueAnimated={initValueAnimated} seller={seller} />
                        <ProductTab initValueAnimated={initValueAnimated} seller={seller} />
                        <InfoTab initValueAnimated={initValueAnimated} seller={seller} />
                    </TabView>
                ) : (
                    <LoadingFetchAPI visible={true} size={typography.size(30)} />
                )}
                {/* search modal */}
                <SearchModal
                    isVisibleSearch={isVisibleSearch}
                    handleVisibleSearchModal={handleVisibleSearchModal}
                    seller={seller}
                />
            </AfterInteractions>
        </View>
    );
});
