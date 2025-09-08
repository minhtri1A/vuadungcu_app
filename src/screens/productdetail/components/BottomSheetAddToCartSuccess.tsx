import { Icon } from '@rneui/themed';
import BottomSheet from 'components/BottomSheet';
import Button from 'components/Button';
import Image from 'components/Image';
import Text from 'components/Text';
import Tooltip from 'components/Tooltip';
import View from 'components/View';
import Status, { StatusType } from 'const/status';
import { getMessage, useNavigate, useTheme } from 'hooks';
import { ItemAddToCartListType } from 'hooks/swr/cartSwr/useCartSwr';
import React, { memo } from 'react';
import { ScrollView } from 'react-native';
import { currencyFormat } from 'utils/helpers';

interface Props {
    statusAdd?: StatusType;
    itemsAddResult?: Array<ItemAddToCartListType & { code?: string }>;
    onClose?: () => void;
}

const BottomSheetAddToCartSuccess = memo(function BottomSheetAddToCartSuccess({
    statusAdd,
    itemsAddResult,
    onClose,
}: Props) {
    //hook
    const { theme } = useTheme();
    const navigate = useNavigate();

    const { itemsSuccess, itemsError } = itemsAddResult?.reduce(
        (acc, v) => {
            if (v.code === undefined) {
                acc.itemsSuccess.push(v);
            } else {
                acc.itemsError.push(v);
            }
            return acc;
        },
        { itemsSuccess: [], itemsError: [] } as {
            itemsSuccess: typeof itemsAddResult;
            itemsError: typeof itemsAddResult;
        }
    ) ?? { itemsSuccess: [], itemsError: [] };

    const navigateCart = () => {
        onClose && onClose();
        navigate.CART_ROUTE();
    };

    return (
        <BottomSheet
            isVisible={statusAdd === Status.SUCCESS && itemsAddResult !== undefined}
            radius
            onBackdropPress={() => {
                onClose && onClose();
            }}
            triggerOnClose={() => {
                onClose && onClose();
            }}
            viewContainerStyle={{ paddingTop: theme.spacings.default * 4 }}
            scrollViewProps={{ scrollEnabled: false }}
        >
            {/* eslint-disable-next-line react-native/no-inline-styles*/}
            <ScrollView style={{ maxHeight: 500 }}>
                {itemsSuccess?.length > 0 && (
                    <>
                        <Text
                            color={theme.colors.green['600']}
                            bg={theme.colors.green[50]}
                            p="small"
                            size={'body2'}
                        >
                            Thêm vào giỏ hàng thành công
                        </Text>
                        {itemsSuccess.map((v, i) => (
                            <View flexDirect="row" mt="medium" key={i}>
                                <Image
                                    source={{
                                        uri: v.image,
                                    }}
                                    w={'20%'}
                                    ratio={1}
                                    resizeMode="contain"
                                />
                                <View mh="small" flex={1}>
                                    <Text>{v?.name}</Text>
                                    <View flexDirect="row" gap={theme.spacings.small}>
                                        <Text color={theme.colors.red['500']}>
                                            {currencyFormat(v?.price)}
                                        </Text>
                                        <Text color={theme.colors.grey_[400]}>x{v.qty}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </>
                )}
                {itemsError?.length > 0 && (
                    <>
                        <Text
                            color={theme.colors.red['600']}
                            size={'body2'}
                            bg={theme.colors.red[50]}
                            p={'small'}
                            mt={itemsSuccess.length > 0 ? 'medium' : undefined}
                        >
                            Thêm vào giỏ hàng thất bại
                        </Text>
                        {itemsError.map((v, i) => {
                            const errorMessage = getMessage(v.code);
                            return (
                                <View flexDirect="row" mt="medium" key={i}>
                                    <Image
                                        source={{
                                            uri: v.image,
                                        }}
                                        w={'20%'}
                                        ratio={1}
                                        resizeMode="contain"
                                    />
                                    <View flexDirect="row" w={theme.dimens.width} aI="center">
                                        <View mh="small" flex={0.7}>
                                            <Text>{v?.name}</Text>
                                            <View flexDirect="row" gap={theme.spacings.small}>
                                                <Text color={theme.colors.red['500']}>
                                                    {currencyFormat(v?.price)}
                                                </Text>
                                                <Text color={theme.colors.grey_[400]}>
                                                    x{v.qty}
                                                </Text>
                                            </View>
                                        </View>
                                        <Tooltip
                                            content={
                                                <Text color={theme.colors.red[600]}>
                                                    {errorMessage}
                                                </Text>
                                            }
                                        >
                                            <Icon
                                                type="ionicon"
                                                name="alert-circle-outline"
                                                size={theme.typography.size(18)}
                                                color={theme.colors.red[500]}
                                            />
                                        </Tooltip>
                                    </View>
                                </View>
                            );
                        })}
                    </>
                )}
            </ScrollView>

            <View mt="medium">
                <Button title={'Xem giỏ hàng'} onPress={navigateCart} />
            </View>
        </BottomSheet>
    );
});

export default BottomSheetAddToCartSuccess;
