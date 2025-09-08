import { Icon, Tab } from '@rneui/themed';
import Header from 'components/Header';
import Image from 'components/Image';
import LoadingFetchAPI from 'components/LoadingFetchAPI';
import Text from 'components/Text';
import View from 'components/View';
import { Routes, Status } from 'const/index';
import withAuth from 'hoc/withAuth';
import { useNavigation, useTheme, useWarrantySwrInfinity } from 'hooks';
import { map } from 'lodash';
import { WarrantiesResponseType } from 'models';
import React, { memo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    ListRenderItem,
    Platform,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { themeType } from 'theme';
import { isEmpty } from 'utils/helpers';
/* eslint-disable react-hooks/exhaustive-deps */

interface Props {}

const warrantyData = [
    {
        status: undefined,
        index: 0,
        label: 'Tất cả',
    },
    {
        status: 'pending',
        index: 1,
        label: 'Chờ xử lý',
    },
    {
        status: 'processing',
        index: 2,
        label: 'Đang xử lý',
    },
    {
        status: 'success',
        index: 3,
        label: 'Hoàn tất',
    },
];

const WarrantyScreen = memo(function WarrantyScreen({}: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const navigation = useNavigation();
    //state
    const [index, setIndex] = useState(warrantyData[0].index);
    const [refresh, setRefresh] = useState(false);
    //swr
    const {
        warranties,
        size,
        setSize,
        pagination: { page, page_count },
        isValidating,
        loadingInit,
        mutate,
    } = useWarrantySwrInfinity({ status: warrantyData[index].status });
    //value

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
        map(warrantyData, (value, index) => (
            <Tab.Item
                titleStyle={(active) => ({
                    color: active ? theme.colors.main['600'] : theme.colors.grey_[600],
                    fontSize: theme.typography.body2,
                    fontWeight: '500',
                })}
                key={index}
            >
                {value.label}
            </Tab.Item>
        ));

    const renderListWarranty: ListRenderItem<WarrantiesResponseType> = ({ item, index }) => (
        <TouchableOpacity
            key={index}
            style={styles.touch_wrap}
            activeOpacity={0.8}
            onPress={() => {
                navigation.navigate(Routes.NAVIGATION_TO_WARRANTY_DETAIL_SCREEN, {
                    warranty_uuid: item.warranty_uuid,
                });
            }}
        >
            {/* top */}
            <View style={styles.view_top}>
                <View style={styles.view_image}>
                    <Image
                        source={
                            !isEmpty(item.product_image)
                                ? {
                                      uri: item.product_image,
                                  }
                                : require('asset/img-ntl-grey.png')
                        }
                    />
                </View>
                <View flex={1} pl="small">
                    <Text numberOfLines={2} ellipsizeMode="tail">
                        {item.product_name}
                    </Text>
                    <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        size={'body1'}
                        color={theme.colors.grey_[400]}
                    >
                        x{item.product_qty}
                    </Text>
                    <Text
                        ta="right"
                        mr={'small'}
                        color={
                            item.status === 'success'
                                ? 'green'
                                : item.status === 'pending'
                                ? theme.colors.main['500']
                                : theme.colors.cyan[500]
                        }
                        size={'body2'}
                    >
                        {item.status === 'pending'
                            ? 'Chờ xử lý...'
                            : item.status === 'processing'
                            ? 'Đang xử lý...'
                            : 'Hoàn thành'}
                    </Text>
                </View>
            </View>
            {/* bottom */}
            <View style={styles.view_bottom}>
                <Text ta="center" aS="center" flex={1} color={theme.colors.grey_[500]}>
                    Nhấn vào để xem chi tiết
                </Text>
                <Icon
                    type="ionicon"
                    name="chevron-forward"
                    color={theme.colors.grey_[500]}
                    size={theme.typography.title1}
                />
            </View>
        </TouchableOpacity>
    );

    return (
        <>
            <Header centerTitle="Bảo hành" backgroundColor={theme.colors.white_[10]} />

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
                {loadingInit === Status.LOADING ? (
                    <ActivityIndicator
                        size={theme.typography.size(30)}
                        color={theme.colors.grey_[400]}
                    />
                ) : isEmpty(warranties) && loadingInit !== Status.LOADING ? (
                    <View flex={1} jC="center">
                        <Text ta="center" size="body3" color={theme.colors.grey_[500]}>
                            Bạn chưa có sản phẩm bảo hành nào !
                        </Text>
                    </View>
                ) : (
                    <View style={styles.view_wrapTabview}>
                        <FlatList
                            data={warranties}
                            renderItem={renderListWarranty}
                            keyExtractor={(item) => item?.warranty_uuid?.toString()}
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
                                        visible={isValidating && !isEmpty(warranties)}
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
                )}
            </View>
        </>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        tab_indicator: {
            backgroundColor: theme.colors.main['600'],
            height: theme.dimens.verticalScale(2),
            width: theme.dimens.width / 2.5,
        },
        tab_container: {
            backgroundColor: theme.colors.white_[10],
        },
        tab_button: {
            width: theme.dimens.width / 2.5,
        },
        view_wrapTabview: {
            flex: 1,
        },
        //item
        touch_wrap: {
            backgroundColor: theme.colors.white_[10],
            marginTop: theme.spacings.medium,
        },
        view_top: {
            flexDirection: 'row',
            padding: theme.spacings.small,
        },
        view_image: {
            width: '23%',
            aspectRatio: 1,
        },
        view_bottom: {
            padding: theme.spacings.small,
            paddingRight: theme.spacings.tiny,
            borderTopWidth: 1,
            borderTopColor: theme.colors.grey_[200],
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
    });

export default withAuth(WarrantyScreen, true);
// export default WarrantyScreen;

//pending: chờ xử lý
//send,receive(processing): đang xử lý
//success: bảo hành xong
