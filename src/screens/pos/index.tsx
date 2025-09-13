/* eslint-disable react-hooks/exhaustive-deps */
import { StackNavigationProp } from '@react-navigation/stack';
import { Icon } from '@rneui/themed';
import Header from 'components/Header2';
import IconButton from 'components/IconButton';
import Text from 'components/Text';
import Tooltip from 'components/Tooltip';
import Touch from 'components/Touch';
import View from 'components/View';
import withAuth from 'hoc/withAuth';
import { useNavigate, useTheme } from 'hooks';
import usePosListSWRInfinite from 'hooks/swr/posSwr/usePosListSWRInfinite';
import { useRefreshControl } from 'hooks/useRefreshControl';
import { PostListType } from 'models';
import React, { memo, useEffect } from 'react';
import { FlatList, ListRenderItem, StyleSheet } from 'react-native';
import { themeType } from 'theme';

interface Props {
    navigation: StackNavigationProp<any, any>;
}

const PosListScreen = memo(function PosListScreen({}: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const navigate = useNavigate();
    //state

    //swr
    const {
        posList,
        size,
        pagination,
        isValidating,
        setSize,
        mutate,
        handleConnectCustomerWebAndPos,
    } = usePosListSWRInfinite();
    const { refreshControl } = useRefreshControl(() => {
        mutate();
    });
    //effect
    useEffect(() => {
        mutate();
    }, []);

    //render
    const renderListPos: ListRenderItem<PostListType[0]> = ({ item, index }) => (
        <Touch
            style={[
                styles.view_item_pos,
                item.is_connect === 'Y' ? styles.view_item_pos_active : undefined,
            ]}
            key={index}
            activeOpacity={1}
            onPress={
                item.is_connect === 'Y'
                    ? navigate.POS_CUSTOMER_INFO_ROUTE({
                          seller_uuid: item.seller_uuid,
                          seller_name: item.pos_name,
                      })
                    : undefined
            }
        >
            <View>
                <Text fw="bold" size={'body3'}>
                    {item.pos_name}
                </Text>
                <Text
                    style={[
                        styles.txt_status,
                        item.is_connect === 'Y'
                            ? styles.txt_status_active
                            : styles.txt_status_deactive,
                    ]}
                >
                    {item.is_connect === 'Y' ? 'Đã liên kết' : 'Chưa liên kết'}
                </Text>
            </View>
            {item.is_connect === 'Y' && (
                <Touch
                    flexDirect="row"
                    activeOpacity={0.7}
                    onPress={navigate.POS_CUSTOMER_INFO_ROUTE({
                        seller_uuid: item.seller_uuid,
                        seller_name: item.pos_name,
                    })}
                >
                    {/* <WaveIndicator /> */}
                    <Text color={theme.colors.grey_[600]} size={'sub3'}>
                        Xem cửa hàng
                    </Text>
                    <Icon
                        type="ionicon"
                        name="chevron-forward"
                        color={theme.colors.grey_[600]}
                        size={theme.typography.size(14)}
                    />
                </Touch>
            )}
            {item.is_connect === 'N' && item.is_active === 'Y' && (
                <View flexDirect="row">
                    <Touch
                        flexDirect="row"
                        onPress={handleConnectCustomerWebAndPos(item.seller_uuid)}
                    >
                        <Icon
                            type="material-community"
                            name="sync"
                            size={theme.typography.size(15)}
                            color={theme.colors.main[500]}
                        />
                        <Text size={'sub3'} color={theme.colors.main[500]}>
                            Liên kết
                        </Text>
                    </Touch>
                </View>
            )}

            {item.is_connect === 'N' && item.is_active === 'N' && (
                <View flexDirect="row">
                    <Tooltip
                        content={
                            <View>
                                <Text color={theme.colors.grey_[300]}>
                                    Số điện thoại bị trùng lặp, vui lòng liên hệ 1800 8085 để được
                                    hỗ trợ
                                </Text>
                            </View>
                        }
                    >
                        <View flexDirect="row" gap={1}>
                            <Icon
                                type="material"
                                name="error-outline"
                                size={theme.typography.size(15)}
                                color={theme.colors.red[500]}
                            />
                            <Text size={'sub3'} color={theme.colors.red[500]}>
                                Không thể liên kết
                            </Text>
                        </View>
                    </Tooltip>
                </View>
            )}
        </Touch>
    );

    //navigate

    const handleLoadMoreLogs = () => {
        if (pagination.page_count > 1 && !isValidating && size < pagination.page_count) {
            setSize(size + 1);
        }
    };

    return (
        <View bg={theme.colors.bgMain} flex={1}>
            <Header
                center={
                    <Text size={'title2'} ta="center" color={theme.colors.white_[10]}>
                        Cửa hàng trực tiếp
                    </Text>
                }
                right={
                    <IconButton
                        type="ionicon"
                        name="help-circle-outline"
                        onPress={navigate.POLICY_DETAIL_ROUTE({ type: 'event-loyal' })}
                        size={theme.typography.title3}
                        color={theme.colors.white_[10]}
                    />
                }
                showGoBack
                bgColor={'#f59423'}
            />
            <FlatList
                data={posList}
                renderItem={renderListPos}
                keyExtractor={(item) => item.seller_uuid}
                showsVerticalScrollIndicator={false}
                onEndReachedThreshold={0.5}
                scrollEventThrottle={16}
                initialNumToRender={5}
                maxToRenderPerBatch={15}
                // windowSize={10}
                refreshControl={refreshControl()}
                onEndReached={handleLoadMoreLogs}
                contentContainerStyle={styles.list_content_container}
            />
        </View>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        header_center: { color: theme.colors.white_[10], fontSize: theme.typography.title2 },
        list_content_container: {
            gap: theme.spacings.medium,
            paddingBottom: theme.spacings.medium,
            padding: theme.spacings.medium,
        },
        view_item_pos: {
            backgroundColor: theme.colors.white_[10],
            padding: theme.spacings.medium,
            paddingRight: theme.spacings.small,
            borderRadius: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
        },
        view_item_pos_active: {
            borderWidth: 1,
            borderColor: theme.colors.green[50],
        },
        txt_status: {
            textAlign: 'center',
            borderRadius: 10,
            borderWidth: 1,
            marginTop: theme.spacings.tiny,
            fontSize: theme.typography.sub3,
            paddingHorizontal: theme.spacings.small,
            paddingVertical: 2,
            alignSelf: 'flex-start',
        },
        txt_status_active: {
            color: theme.colors.green[600],
            borderColor: theme.colors.green[100],
            backgroundColor: theme.colors.green[50],
        },
        txt_status_deactive: {
            color: theme.colors.grey_[600],
            borderColor: theme.colors.grey_[300],
            backgroundColor: theme.colors.grey_[100],
        },
    });

export default withAuth(PosListScreen, true);
// export default PosListScreen;
