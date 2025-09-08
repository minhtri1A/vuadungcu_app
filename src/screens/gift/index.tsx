import { Icon, Tab } from '@rneui/themed';
import Header from 'components/Header';
import Image from 'components/Image';
import LoadingFetchAPI from 'components/LoadingFetchAPI';
import Text from 'components/Text';
import View from 'components/View';
import withAuth from 'hoc/withAuth';
import { useTheme } from 'hooks';
import useGiftSwrInfinity from 'hooks/swr/gift/useGiftSwrInfinity';
import { map } from 'lodash';
import { GiftCustomerResponseType } from 'models';
import moment from 'moment';
import React, { memo, useState } from 'react';
import {
    FlatList,
    ImageBackground,
    ListRenderItem,
    Platform,
    RefreshControl,
    StyleSheet,
} from 'react-native';
import { themeType } from 'theme';
import { calculatorBetweenTwoTime, currencyFormat } from 'utils/helpers';
/* eslint-disable react-hooks/exhaustive-deps */

interface Props {}

const warrantyData = [
    {
        status: null,
        index: 0,
        label: 'Khả dụng',
    },
    {
        status: 'apply',
        index: 1,
        label: 'Đã nhận thưởng',
    },
    {
        status: 'expires',
        index: 2,
        label: 'Hết hạn',
    },
];

const GiftScreen = memo(function GiftScreen({}: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    //state
    const [index, setIndex] = useState(warrantyData[0].index);
    const [refresh, setRefresh] = useState(false);
    //swr
    const {
        gift,
        size,
        isValidating,
        pagination: { page, page_count },
        mutate,
        setSize,
    } = useGiftSwrInfinity();
    //value
    const giftsFilter = gift.filter((value) => {
        const timestamp = moment(value?.expires, 'YYYY-MM-DD HH:mm:ss').valueOf();
        const nowTimeStamp = Date.now();
        const { num }: any = calculatorBetweenTwoTime(nowTimeStamp, timestamp);
        if (index === 0) return num > 0 && value.status === null;
        if (index === 1) return value.status !== null;
        if (index === 2) return num < 0;
    });
    //handle
    const handleChangeWarrantyStatus = (index_: number) => {
        setIndex(index_);
    };
    const handleRefresh = async () => {
        setRefresh(true);
        await mutate();
        setRefresh(false);
    };
    const handleLoadMoreWarranty = () => {
        if (!isValidating && page < page_count) {
            setSize(size + 1);
        }
    };
    //render

    const renderTabItems = () =>
        map(warrantyData, (value, i) => (
            <Tab.Item
                titleStyle={(active) => ({
                    color: active ? theme.colors.main['600'] : theme.colors.black_[10],
                    fontSize: theme.typography.body2,
                })}
                key={i}
            >
                {value.label}
            </Tab.Item>
        ));

    const renderListGift: ListRenderItem<GiftCustomerResponseType> = ({ item, index: i }) => {
        const timestamp = moment(item?.expires, 'YYYY-MM-DD HH:mm:ss').valueOf();
        const nowTimeStamp = Date.now();
        const { num, title }: any = calculatorBetweenTwoTime(nowTimeStamp, timestamp);

        return (
            <View mb="medium" key={i}>
                <ImageBackground
                    source={require('asset/img_voucher.png')}
                    style={styles.bg_img_gift}
                    resizeMode="stretch"
                >
                    <View style={styles.view_img_gift}>
                        <Image source={{ uri: item.image }} resizeMode="contain" />
                    </View>
                    <View style={styles.view_info_gift}>
                        <Text fw="bold" numberOfLines={2}>
                            {item.gift_name}
                        </Text>
                        <Text color={theme.colors.grey_[500]} size={'sub2'}>
                            Áp dụng đơn hàng từ {currencyFormat(item.min_order_apply)}
                        </Text>
                        <Text color={theme.colors.grey_[400]} size={'sub2'}>
                            {num > 0 ? `Hết hạn sau ${num} ${title}` : 'Đã hết hạn'}
                        </Text>
                    </View>
                    <View jC="center" mh="medium">
                        <Icon
                            type="ionicon"
                            name="gift"
                            color={
                                num > 0 && item.status === null
                                    ? theme.colors.red['500']
                                    : item.status !== null
                                    ? theme.colors.green['500']
                                    : theme.colors.grey_[400]
                            }
                            size={theme.typography.size(20)}
                        />
                    </View>
                </ImageBackground>

                <View style={styles.view_gift_bottom}>
                    <Text color={theme.colors.grey_[500]} size={'sub2'} ml={'small'}>
                        {num > 0 && item.status === null
                            ? `Sử dụng với gian hàng - ${item.seller_name}`
                            : item.status !== null
                            ? 'Nhận thưởng thành công'
                            : 'Phần thưởng đã hết hạn'}
                    </Text>
                    <Icon
                        type="ionicon"
                        name="chevron-forward"
                        color={theme.colors.grey_[500]}
                        size={theme.typography.size(13)}
                    />
                </View>
            </View>
        );
    };

    return (
        <>
            <Header
                centerComponent={{
                    text: 'Quà tặng của bạn',
                    style: {
                        color: theme.colors.slate[900],
                        fontSize: theme.typography.title2,
                    },
                }}
                backgroundColor={theme.colors.white_[10]}
                containerStyle={{ borderBottomWidth: 1 }}
            />

            <View flex={1}>
                <Tab
                    value={index}
                    onChange={handleChangeWarrantyStatus}
                    indicatorStyle={styles.tab_indicator}
                    containerStyle={styles.tab_container}
                    scrollable={true}
                    buttonStyle={styles.tab_button}
                >
                    {renderTabItems()}
                </Tab>

                <View style={styles.view_wrapTabview}>
                    <FlatList
                        data={giftsFilter}
                        renderItem={renderListGift}
                        keyExtractor={(item) => item.uuid}
                        showsVerticalScrollIndicator={false}
                        onEndReachedThreshold={0.5}
                        scrollEventThrottle={16}
                        initialNumToRender={5}
                        maxToRenderPerBatch={15}
                        // windowSize={10}
                        removeClippedSubviews={Platform.OS === 'ios' ? false : true}
                        ListFooterComponent={
                            <View>
                                <LoadingFetchAPI // check xem co lading san pham hk
                                    visible={false}
                                    size={theme.typography.title1}
                                    styleView={{
                                        height: theme.dimens.height * 0.05,
                                        backgroundColor: theme.colors.grey_[200],
                                    }}
                                    color={theme.colors.grey_[400]}
                                    titleText={'Đã hết sản phẩm'}
                                />
                            </View>
                        }
                        ListEmptyComponent={<Text ta="center">Chưa có quà tặng!</Text>}
                        refreshControl={
                            <RefreshControl
                                onRefresh={handleRefresh}
                                refreshing={refresh}
                                colors={[theme.colors.main['600']]}
                            />
                        }
                        onEndReached={handleLoadMoreWarranty}
                    />
                </View>
            </View>
        </>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        //tab
        tab_indicator: {
            backgroundColor: theme.colors.main['600'],
            height: 2,
            // width: theme.dimens.width / 2.5,
        },
        tab_container: {
            backgroundColor: theme.colors.white_[10],
        },
        tab_button: {
            minWidth: theme.dimens.width / 2.5,
        },
        view_wrapTabview: {
            flex: 1,
            paddingTop: theme.spacings.medium,
            padding: theme.spacings.small,
        },
        //gift items
        bg_img_gift: {
            flexDirection: 'row',
        },
        view_img_gift: {
            width: '16%',
            aspectRatio: 1,
            marginVertical: theme.spacings.large,
            marginHorizontal: theme.spacings.medium,
        },
        view_info_gift: {
            flex: 1,
            borderLeftWidth: 0.5,
            borderLeftColor: theme.colors.grey_['300'],
            borderStyle: Platform.OS === 'android' ? 'dashed' : 'solid',
            justifyContent: 'center',
            paddingLeft: theme.spacings.small,
        },
        view_gift_bottom: {
            padding: theme.spacings.small,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.white_[10],

            borderTopWidth: 0,

            // borderStyle: 'dashed',
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
        },
    });

export default withAuth(GiftScreen, true);
// export default GiftScreen;

//pending: chờ xử lý
//send,receive(processing): đang xử lý
//success: bảo hành xong
