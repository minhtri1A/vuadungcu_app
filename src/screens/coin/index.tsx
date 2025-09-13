import { StackNavigationProp } from '@react-navigation/stack';
import { Icon } from '@rneui/themed';
import Header from 'components/Header2';
import IconButton from 'components/IconButton';
import Image from 'components/Image';
import Text from 'components/Text';
import View from 'components/View';
import withAuth from 'hoc/withAuth';
import { useCustomerSwr, useNavigate, useTheme } from 'hooks';
import React, { memo } from 'react';
import { ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { currencyFormat } from 'utils/helpers';

interface Props {
    navigation: StackNavigationProp<any, any>;
}

const CoinScreen = memo(function CoinScreen({}: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles();
    const navigate = useNavigate();
    //swr
    const { customers } = useCustomerSwr('all');
    const {} = customers;
    //value
    //animation

    //render
    // const renderListHistory: ListRenderItem<EventCoinLogResponseType> = ({
    //     item: { name, created_at, type, coin_amount, item_count, content, image },
    //     index,
    // }) => (
    //     <View style={styles.view_wrapHistory} key={index}>
    //         <View flex={0.92} flexDirect="row" aI="center">
    //             <View w={'10%'} ratio={1}>
    //                 {image ? (
    //                     <Image source={{ uri: image }} resizeMode="contain" />
    //                 ) : (
    //                     <Icon
    //                         type="ionicon"
    //                         name="ribbon-outline"
    //                         color={type === 'in' ? theme.colors.main["600"] : theme.colors.grey_[500]}
    //                         size={theme.typography.title3}
    //                     />
    //                 )}
    //             </View>

    //             <View ml={10} flex={1}>
    //                 <Text numberOfLines={1} ellipsizeMode={'tail'}>
    //                     {`${item_count || ''} ${name}`}
    //                 </Text>
    //                 {content ? (
    //                     <Text size={'body1'} color={theme.colors.grey_[500]}>
    //                         {content}
    //                     </Text>
    //                 ) : null}
    //                 <Text size={'sub2'} color={theme.colors.grey_[400]}>
    //                     {/* 10:00 12-12-2022 */}
    //                     {moment(created_at).format('HH:mm DD-MM-YYYY')}
    //                 </Text>
    //             </View>
    //         </View>
    //         <Text color={type === 'in' ? theme.colors.main['600'] : theme.colors.grey_[500]}>{`${
    //             type === 'in' ? '+' : '-'
    //         }${coin_amount}`}</Text>
    //     </View>
    // );

    return (
        <>
            <Header
                center={
                    <Text size={'title2'} ta="center">
                        Xu dụng cụ
                    </Text>
                }
                right={
                    <IconButton
                        type="ionicon"
                        name="help-circle-outline"
                        onPress={navigate.POLICY_DETAIL_ROUTE({ type: 'event-coin' })}
                        size={theme.typography.title3}
                        color={theme.colors.white_[10]}
                    />
                }
                showGoBack
                iconGoBackColor={theme.colors.black_[10]}
                bgColor={'#f59423'}
            />
            {/* Coin info */}
            <View style={styles.view_topContainer}>
                <ImageBackground
                    source={require('asset/background.png')}
                    resizeMode="cover"
                    style={styles.imageBackground}
                    imageStyle={{ borderBottomLeftRadius: 50, borderBottomRightRadius: 50 }}
                >
                    <View style={styles.view_score}>
                        <Image
                            source={require('asset/img-icon-coin.png')}
                            w={theme.dimens.scale(40)}
                            h={theme.dimens.scale(40)}
                        />
                        <Text
                            color={theme.colors.white_[10]}
                            style={{ fontSize: theme.typography.size(48) }}
                        >
                            {currencyFormat(customers.coin, false)}
                            <Text color={theme.colors.white_[10]} size={'title1'}>
                                Xu
                            </Text>
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.view_wrapQr}
                        onPress={navigate.PRODUCT_CATEGORY_ROUTE({ category_uuid: 0 })}
                        activeOpacity={0.95}
                    >
                        <View flexDirect="row" jC="center" aI="center">
                            <Icon
                                type="ionicon"
                                name={'cart-outline'}
                                size={theme.typography.size(35)}
                                style={{ marginRight: theme.spacings.extraLarge }}
                            />
                            <View>
                                <Text>Mua hàng tích xu ngay</Text>
                            </View>
                        </View>
                        <View style={{ paddingLeft: theme.spacings.tiny }}>
                            <Icon
                                type="ionicon"
                                name="chevron-forward"
                                size={theme.typography.size(20)}
                                color={theme.colors.grey_[500]}
                            />
                        </View>
                    </TouchableOpacity>
                </ImageBackground>
            </View>
            {/* History */}
            <View style={styles.view_historyContainer}>
                <View style={styles.historyTitle}>
                    <Text size={'body3'} fw="bold">
                        Lịch sử
                    </Text>
                </View>

                {
                    // <FlatList
                    //     data={logs}
                    //     renderItem={renderListHistory}
                    //     ListFooterComponent={
                    //         <View h={30}>
                    //             <LoadingFetchAPI // check xem co lading san pham hk
                    //                 visible={isValidatingLogs}
                    //                 size={theme.typography.title1}
                    //                 styleView={{
                    //                     height: theme.dimens.height * 0.05,
                    //                     backgroundColor: theme.colors.grey_[200],
                    //                 }}
                    //             />
                    //         </View>
                    //     }
                    //     keyExtractor={(item) => item?.log_uuid}
                    //     onEndReachedThreshold={1}
                    //     onEndReached={() => {
                    //         pagination.page < pagination.page_count && setSize(size + 1);
                    //     }}
                    // />
                }
                <View flex={1} jC="center" aI="center">
                    <Text color={theme.colors.grey_[400]}>Chưa có lịch sử</Text>
                </View>
            </View>
        </>
    );
});

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        view_topContainer: {
            width: '100%',
            marginBottom: theme.spacings.medium,
        },
        imageBackground: {
            width: '100%',
            alignItems: 'center',
        },
        view_score: {
            marginTop: 30,
            alignItems: 'center',
        },
        view_wrapQr: {
            backgroundColor: theme.colors.white_[10],
            width: theme.dimens.width * 0.8,
            borderRadius: 10,
            padding: theme.spacings.large,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
            transform: [{ translateY: theme.spacings.small }],
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },

        view_historyContainer: {
            backgroundColor: theme.colors.white_[10],
            width: theme.dimens.width,
            height: theme.dimens.height,
            flex: 1,
        },
        historyTitle: {
            height: theme.dimens.verticalScale(50),
            justifyContent: 'center',
            paddingLeft: 10,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey_[300],
        },

        view_wrapBottomSheet: {
            backgroundColor: theme.colors.white_[10],
        },
        icon_close: {
            position: 'absolute',
            right: theme.spacings.medium,
            top: theme.spacings.small,
        },
        view_wrapHistory: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey_[200],
        },
        //loyal event component
        view_wrap_log: {
            flexDirection: 'row',
            padding: theme.spacings.small,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey_[300],
            justifyContent: 'space-between',
        },
        view_log_left: {
            flexDirection: 'row',
            flex: 0.8,
            alignItems: 'center',
        },
    });
};

export default withAuth(CoinScreen, true);
