import { Icon } from '@rneui/themed';
import Alert from 'components/Alert';
import Image from 'components/Image';
import Text from 'components/Text';
import Touch from 'components/Touch';
import View from 'components/View';
import { Status } from 'const/index';
import { useSocket } from 'context/SocketContext';
import { useIsLogin, useNavigate, useTheme } from 'hooks';
import { ProductDetailResponseType, SellerInfoResponseType } from 'models';
import React, { memo, useEffect, useState } from 'react';
import { ActivityIndicator, Animated, TextInput, TouchableOpacity } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { currencyFormat, formatProductPrices } from 'utils/helpers';
import { sendSentryError } from 'utils/storeHelpers';
import { v4 as uuidv4 } from 'uuid';
import useStyles from './../styles';
import BottomSheetOptions, { DataSuccessType } from './BottomSheetOptions';

/* eslint-disable react-hooks/exhaustive-deps */
// import Ripple from 'react-native-material-ripple';

interface Props {
    pds?: ProductDetailResponseType['detail-static'];
    pdc?: ProductDetailResponseType['detail-dynamic'];
    seller: SellerInfoResponseType;
    statusAdd: string;
    onEnd?: () => void;
    onSelectOptionSuccess: (
        action: 'add_to_cart' | 'buy_now' | 'select',
        data: DataSuccessType,
        isSingle?: boolean
    ) => void;
}

const TabbarFixed = memo(function TabbarFixed({
    seller,
    statusAdd,
    pds,
    pdc,
    onSelectOptionSuccess,
}: Props) {
    //hook
    const styles = useStyles();
    const {
        theme: { dimens, typography, colors },
    } = useTheme();
    const navigate = useNavigate();
    const { socket, event } = useSocket();
    const isLogin = useIsLogin();

    //state
    const [actionOption, setActionOption] = useState<'add_to_cart' | 'buy_now' | 'select'>();
    const [indexProductOptionSelected, setIndexProductOptionSelected] = useState<number>();
    //--bargain
    const [isVisibleBargain, setIsVisibleBargain] = useState(false);
    const [qtyBargain, setQtyBargain] = useState(1);
    const [priceBargain, setPriceBargain] = useState(0);
    const [messageBargain, setMessageBargain] = useState('');
    const [statusBargain, setStatusBargain] = useState<string>(Status.DEFAULT);

    //value

    const childrenSelected =
        indexProductOptionSelected !== undefined && pdc?.children
            ? pdc?.children[indexProductOptionSelected]
            : undefined;

    const pdi =
        pds?.type_id === 'simple' || childrenSelected === undefined
            ? { ...pdc, ...pds }
            : { ...childrenSelected, uuid: childrenSelected.product_uuid };

    const { special_price = 0, qty = 0 } = pdi || {};

    const disableBtnCheck =
        pds?.type_id === 'simple' && (qty || 0) < 1
            ? true
            : statusAdd === Status.LOADING
            ? true
            : false;

    //--bargain
    const priceBargainCheck =
        priceBargain < special_price / 2 ? 1 : priceBargain >= special_price ? 2 : 99;

    //--price

    // check khi select item con trong san pham config
    const itemSelect = childrenSelected !== undefined ? childrenSelected : pdc;
    const typeIDSelect = childrenSelected !== undefined ? 'simple' : pds?.type_id || 'simple';

    const { finalPrice, crossedPrice } = formatProductPrices({
        ...itemSelect,
        type_id: typeIDSelect,
    });

    //effect
    //--handle when event data change(socket)
    useEffect(() => {
        if (event) {
            const data = JSON.parse(event.data);
            switch (data.result_code) {
                case 'BARGAIN_SUCCESS':
                    setStatusBargain(Status.SUCCESS);
                    navigate.CHAT_MESSAGE_ROUTE({ user_uuid: seller.seller_uuid })();
                    break;
                case 'SELLER_NOT_BARGAIN':
                case 'USER_UUID_ERROR':
                case 'PRICE_BARGAIN_MUST_LESS_THAN_PRICE':
                case 'NOT_ALLOW_PRICE_BARGAIN_LESS_THAN_50_CURRENT_PRICE':
                case 'ERROR_BARGAIN':
                    setMessageBargain('Đã xảy ra lỗi xin vui lòng thử lại');
                    setStatusBargain(Status.ERROR);
                    sendSentryError(data.result_code, 'handle when event data change tabbar fixed');
                    break;
            }
        }
    }, [event]);

    //-- set init price bargain
    useEffect(() => {
        if (isVisibleBargain) {
            // setPriceBargain(parseInt(productInfoCheck.special_price || '0'));
        }
    }, [isVisibleBargain]);

    //handle

    //--option visible
    const visibleBottomSheetOption = (action?: 'add_to_cart' | 'buy_now' | 'select') => {
        setActionOption(action);
    };

    const checkAddProductToCart = (action: 'add_to_cart' | 'buy_now') => () => {
        if (!isLogin) {
            navigate.LOGIN_ROUTE()();
            return;
        }
        if (pds?.type_id === 'configurable') {
            visibleBottomSheetOption(action);
            return;
        }
        onSelectOptionSuccess(
            action,
            {
                items: [
                    {
                        product_uuid: pdi.uuid,
                        product_seller_uuid: pdi.product_seller_uuid || '',
                        name: pdi?.name || '',
                        image: (pdi?.images && pdi?.images[0]?.url) || '',
                        price: pdi.price || '',
                    },
                ],
            },
            true
        );
    };

    //--xu ly khi chon xong option bargain
    const handleSelectOptionSuccess = (
        action: 'add_to_cart' | 'buy_now' | 'select',
        data: DataSuccessType
    ) => {
        // xu ly bargain
        if (action === 'select') {
            const { index } = data || {};
            visibleBargainModal();
            setIndexProductOptionSelected(index);
            return;
        }
        // other
        onSelectOptionSuccess(action, data);
    };

    //bargain

    const visibleBargainModal = () => {
        setIsVisibleBargain((pre) => !pre);
        setQtyBargain(1);
        setPriceBargain(0);
        setMessageBargain('');
        setStatusBargain(Status.DEFAULT);
    };

    const checkShowBargainModal = () => {
        if (!isLogin) {
            navigate.LOGIN_ROUTE()();
            return;
        }
        if (pds?.type_id === 'configurable') {
            visibleBottomSheetOption('select');
            return;
        }
        visibleBargainModal();
    };

    const handleChangeQtyBargain = (value: string) => {
        const value_ = value === '' ? 0 : parseInt(value) < qty ? parseInt(value) : qty;
        setQtyBargain(value_);
        //message
        setMessageBargain(
            parseInt(value) < 1
                ? 'Số lượng tối thiểu phải là 1'
                : parseInt(value) > qty
                ? `Chỉ còn lại ${qty} sản phẩm`
                : ''
        );
    };

    const handleTouchChangeQtyBargain = (type: 'incre' | 'deincre') => () => {
        if ((type === 'incre' && qtyBargain < qty) || (type === 'deincre' && qtyBargain > 1)) {
            setQtyBargain((pre) => (type === 'incre' ? pre + 1 : pre - 1));
            setMessageBargain('');
        } else {
            setMessageBargain(
                type === 'incre' ? `Chỉ còn lại ${qty} sản phẩm` : 'Số lượng tối thiểu phải là 1'
            );
        }
    };

    const handleChangePriceBargain = (value: string) => {
        const value_ = parseInt(value.replace(/\./g, ''));
        const special_price_ = special_price;
        // const initPrice
        if (value_ < special_price_ / 2) {
            setMessageBargain('Bạn không thể trả giá thấp hơn 50% giá gốc');
        } else if (value_ >= special_price_) {
            setMessageBargain('Bạn không thể trả giá cao hơn hoặc bằng giá gốc');
        } else {
            setMessageBargain('');
        }
        setPriceBargain(value === '' ? 0 : parseInt(value.replace(/\./g, '')));
    };

    //--submit thong tin tra gia len server
    const sendBargainSocket = () => {
        try {
            if (socket && priceBargainCheck === 99) {
                setStatusBargain(Status.LOADING);
                const message_client_id = uuidv4().replace(/-/g, '');
                socket.send(
                    JSON.stringify({
                        action: 'bargain',
                        user_uuid: seller.seller_uuid,
                        product_seller_uuid: pdi.product_seller_uuid,
                        qty_bargain: qtyBargain,
                        price_bargain: priceBargain,
                        message_client_id,
                    })
                );
            }
        } catch (error) {
            sendSentryError(error, 'sendBargainSocket');
        }
    };

    //render

    return (
        <>
            <Animated.View style={[styles.view_tabbar_container]}>
                {/* buttom */}
                <View style={styles.view_wrap_small_icon}>
                    <Ripple
                        rippleCentered
                        rippleColor={colors.main['600']}
                        style={[styles.view_small_btn, { width: `${100 / 3}%` }]}
                        onPress={checkShowBargainModal}
                    >
                        <Icon
                            type="ionicon"
                            name="sync-sharp"
                            size={typography.size(15)}
                            color={colors.main['600']}
                        />
                        <Text size={'sub3'} color={colors.main['600']}>
                            Trả giá
                        </Text>
                    </Ripple>
                    <Ripple
                        rippleCentered
                        rippleColor={colors.main['600']}
                        style={[styles.view_small_btn, { width: `${100 / 3}%` }]}
                        onPress={navigate.CHAT_MESSAGE_ROUTE({
                            user_uuid: seller?.seller_uuid || '',
                        })}
                    >
                        <Icon
                            type="ionicon"
                            name="chatbubble-ellipses-outline"
                            size={typography.size(15)}
                            color={colors.main['600']}
                        />
                        <Text size={'sub3'} color={colors.main['600']}>
                            Nhắn tin
                        </Text>
                    </Ripple>
                    <View w={`${100 / 3}%`}>
                        <Touch
                            style={styles.view_small_btn}
                            onPress={checkAddProductToCart('add_to_cart')}
                        >
                            {statusAdd === Status.LOADING ? (
                                <ActivityIndicator color={colors.main['600']} />
                            ) : (
                                <Icon
                                    type="font-awesome-5"
                                    name="cart-plus"
                                    size={typography.size(15)}
                                    color={colors.main['600']}
                                />
                            )}

                            <Text size={'sub3'} color={colors.main['600']} numberOfLines={1}>
                                Thêm
                            </Text>
                        </Touch>
                    </View>
                </View>
                <Touch
                    bg={colors.main['600']}
                    h={dimens.verticalScale(50) + 2}
                    flex={0.3}
                    jC="center"
                    aI="center"
                    onPress={checkAddProductToCart('buy_now')}
                    disabled={disableBtnCheck}
                >
                    <Text color={colors.white_[10]}>Mua ngay</Text>
                </Touch>
            </Animated.View>

            {/* bargain modal */}
            <Alert
                isVisible={isVisibleBargain}
                bodyChildren={
                    <View mt="small" w={'90%'}>
                        <Text size={'title1'} color={colors.main['600']} ta="center">
                            Trả giá sản phẩm
                        </Text>
                        {/* product info bargain */}
                        <View flexDirect="row" mt="extraLarge">
                            <View w={dimens.scale(50)} ratio={1} mr={'small'}>
                                <Image
                                    source={{
                                        uri: pdi?.images && pdi?.images[0]?.url,
                                    }}
                                    resizeMode="contain"
                                    radius={2}
                                />
                            </View>
                            <View flex={1}>
                                <Text numberOfLines={1}>{pdi.name}</Text>
                                <Text size={'sub2'} color={colors.grey_[500]}>
                                    Giá gốc: {crossedPrice}
                                </Text>
                                {qty < 10 ? (
                                    <Text size={'sub2'} color={colors.grey_[500]}>
                                        Còn lại {qty} sản phẩm
                                    </Text>
                                ) : null}
                            </View>
                        </View>
                        {/* Bargain info */}
                        <View style={styles.view_wrap_bargain}>
                            <View style={styles.view_wrap_bargain_input}>
                                <View style={styles.view_bargain_input_left}>
                                    <Text color={colors.grey_[500]} size={'sub3'}>
                                        Số lượng
                                    </Text>
                                </View>
                                <TextInput
                                    value={qtyBargain === 0 ? '' : `${qtyBargain}`}
                                    keyboardType="numeric"
                                    style={styles.input_bargain_}
                                    placeholder="Nhập số lượng..."
                                    placeholderTextColor={colors.grey_[400]}
                                    onChangeText={handleChangeQtyBargain}
                                />
                                <View style={styles.view_bargain_input_right_qty}>
                                    <TouchableOpacity
                                        style={styles.touch_plush_minus}
                                        onPress={handleTouchChangeQtyBargain('deincre')}
                                    >
                                        <Text color={colors.grey_[500]} size={'title1'}>
                                            -
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.touch_plush_minus}
                                        onPress={handleTouchChangeQtyBargain('incre')}
                                    >
                                        <Text color={colors.grey_[500]} size={'body2'}>
                                            +
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.view_wrap_bargain_input} mt="small">
                                <View style={styles.view_bargain_input_left}>
                                    <Text color={colors.grey_[500]} size={'sub3'}>
                                        Trả giá
                                    </Text>
                                </View>
                                <TextInput
                                    style={styles.input_bargain_}
                                    value={
                                        priceBargain > 0
                                            ? currencyFormat(priceBargain, false)
                                            : undefined
                                    }
                                    placeholder="Nhập giá..."
                                    placeholderTextColor={colors.grey_[400]}
                                    onChangeText={handleChangePriceBargain}
                                />
                                <View style={styles.view_bargain_input_right_price}>
                                    <Text color={colors.grey_[500]} size={'sub3'}>
                                        VNĐ
                                    </Text>
                                </View>
                            </View>
                            <Text size="sub1" color={colors.grey_[500]}>
                                Tổng giá: {currencyFormat(priceBargain * qtyBargain, false)}
                                VNĐ
                            </Text>
                            {messageBargain !== '' ? (
                                <Text size={'sub3'} color="red" ta="center" mt="tiny">
                                    ({messageBargain})
                                </Text>
                            ) : null}
                        </View>
                    </View>
                }
                onBackdropPress={visibleBargainModal}
                okBtnTitle="Xác nhận trả giá"
                onOk={sendBargainSocket}
                onCancel={visibleBargainModal}
                okBtnProps={{
                    disabled: priceBargainCheck !== 99,
                    loading: statusBargain === Status.LOADING,
                }}
            />
            {/* product option sheet */}
            <BottomSheetOptions
                action={actionOption}
                productItem={{
                    name: pdi?.name || '',
                    image: (pdi?.images && pdi?.images[0]?.url) || '',
                    price: finalPrice,
                }}
                children={pdc?.children}
                attribute={pdc?.attribute_config}
                onClose={visibleBottomSheetOption}
                onSelectOptionSuccess={handleSelectOptionSuccess}
            />
        </>
    );
});

export default TabbarFixed;
