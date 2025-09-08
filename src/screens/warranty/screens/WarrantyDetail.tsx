import { RouteProp, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from 'components/Header';
import IconButton from 'components/IconButton';
import Image from 'components/Image';
import Text from 'components/Text';
import Title from 'components/Title';
import View from 'components/View';
import { Status } from 'const/index';
import withAuth from 'hoc/withAuth';
import { useTheme } from 'hooks';
import useWarrantyDetailSwr from 'hooks/swr/warrantySwr/useWarrantyDetailSwr';
import { WarrantyStackParamsList } from 'navigation/type';
import React, { memo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { themeType } from 'theme';
import { currencyFormat, getDateWithTimeStamp, isEmpty } from 'utils/helpers';

/* eslint-disable react-hooks/exhaustive-deps */

interface Props {
    navigation: StackNavigationProp<any, any>;
}

const WarrantyDetailScreen = memo(function WarrantyDetailScreen({ navigation }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const router = useRoute<RouteProp<WarrantyStackParamsList, 'WarrantyDetailScreen'>>();
    //state
    const [refresh, setRefresh] = useState(false);
    //swr
    const { warranty, loadingInit, mutate } = useWarrantyDetailSwr(router.params?.warranty_uuid);
    const {
        status,
        product_image,
        product_name,
        product_status,
        product_qty,
        cust_received_date,
        cust_return_date,
        customer_name,
        receiver,
        repair_cost,
    } = warranty || {};
    //value
    const color =
        status === 'success'
            ? theme.colors.green[500]
            : status === 'pending'
            ? theme.colors.main['600']
            : theme.colors.cyan[500];
    //handle
    const handleRefresh = async () => {
        setRefresh(true);
        await mutate();
        setRefresh(false);
    };

    return (
        <>
            <Header
                leftComponent={
                    <IconButton
                        color={theme.colors.slate[900]}
                        type="ionicon"
                        name="arrow-back-outline"
                        onPress={navigation.goBack}
                        size={theme.typography.title4}
                    />
                }
                centerComponent={{
                    text: 'Chi tiết bảo hành',
                    style: {
                        color: theme.colors.slate[900],
                        fontSize: theme.typography.title2,
                        alignSelf: 'flex-start',
                    },
                }}
                backgroundColor={theme.colors.white_[10]}
                statusBarProps={{ backgroundColor: theme.colors.main['600'] }}
                // eslint-disable-next-line react-native/no-inline-styles
                containerStyle={{ borderBottomWidth: 1 }}
            />
            {loadingInit === Status.LOADING ? (
                <ActivityIndicator
                    size={theme.typography.size(30)}
                    color={theme.colors.grey_[400]}
                />
            ) : (
                <View flex={1}>
                    {/* status */}
                    <View bg={theme.colors.white_[10]} p={theme.spacings.small}>
                        <Text ta="center" p={'small'} size="title1" color={color}>
                            {status === 'pending'
                                ? 'Chờ xử lý...'
                                : status === 'processing'
                                ? 'Đang xử lý...'
                                : 'Hoàn thành'}
                        </Text>
                        <Text ta="center" color={color}>
                            {status === 'pending'
                                ? 'Phiếu bảo hành đã được xác nhận, sản phẩm đang chờ sửa chữa - bảo hành !'
                                : status === 'processing'
                                ? 'Sản phẩm đang trong quá trình sửa chữa - bảo hành !'
                                : 'Sản phẩm đã được bảo hành hoàn tất !'}
                        </Text>
                    </View>
                    {/* product */}
                    <View style={styles.view_product}>
                        <View style={styles.view_image}>
                            <Image
                                source={
                                    !isEmpty(product_image)
                                        ? {
                                              uri: product_image,
                                          }
                                        : require('asset/img-ntl-grey.png')
                                }
                            />
                        </View>
                        <View flex={1} jC="space-between">
                            <Text numberOfLines={2} ellipsizeMode="tail">
                                {product_name}
                            </Text>
                            <Text
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                ta="right"
                                color={theme.colors.grey_[500]}
                                size={'body1'}
                            >
                                Số lượng: {product_qty}
                            </Text>
                        </View>
                    </View>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                onRefresh={handleRefresh}
                                refreshing={refresh}
                                colors={[theme.colors.main['600']]}
                            />
                        }
                    >
                        <View>
                            <Title
                                titleLeft="Tên Khách hàng"
                                titleRight={customer_name}
                                dividerOutTop
                            />
                            <Title
                                titleLeft="Nhân viên tiếp nhận"
                                titleRight={receiver}
                                dividerTop
                            />
                            <Title
                                titleLeft="Ngày gửi bảo hành"
                                titleRight={getDateWithTimeStamp(
                                    cust_received_date,
                                    0,
                                    'LocaleDateTime'
                                )}
                                dividerTop
                            />
                            <Title
                                titleLeft="Ngày hoàn thành"
                                titleRight={
                                    isEmpty(cust_return_date)
                                        ? '...'
                                        : getDateWithTimeStamp(
                                              cust_return_date,
                                              0,
                                              'LocaleDateTime'
                                          )
                                }
                                dividerTop
                            />
                            <Title
                                titleLeft="Tình trạng"
                                titleRight={product_status}
                                dividerTop
                                titleRightProps={{ color: 'red' }}
                            />
                            <Title
                                titleLeft="Phí bảo hành"
                                titleRight={`${currencyFormat(repair_cost)} vnđ`}
                                dividerTop
                                titleRightProps={{ color: 'red' }}
                            />
                        </View>
                    </ScrollView>
                    {/* detail */}
                </View>
            )}
        </>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_product: {
            backgroundColor: theme.colors.white_[10],
            padding: theme.spacings.small,
            flexDirection: 'row',
            borderTopWidth: 1,
            borderTopColor: theme.colors.grey_[200],
        },
        view_image: {
            width: '23%',
            aspectRatio: 1,
        },
    });

export default withAuth(WarrantyDetailScreen, true);
