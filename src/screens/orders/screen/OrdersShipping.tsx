/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import Clipboard from '@react-native-community/clipboard';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from '@rneui/themed';
import Header from 'components/Header2';
import Text from 'components/Text';
import { useTheme } from 'hooks';
import { OrdersStackParamsList } from 'navigation/type';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Timeline from 'react-native-timeline-flatlist';
import { themeType } from 'theme';

interface Props {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<OrdersStackParamsList, 'OrdersShippingScreen'>;
}

export default memo(function OrdersShipping({}: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    //state

    const copyOrderIdToClipboard = (order_id: string) => () => {
        Clipboard.setString(order_id);
        showMessage({
            message: 'Đã sao chép!',
            type: 'success',
            icon: 'success',
        });
    };

    //value
    const data = [
        {
            title: 'Đang giao hàng',
            description: '10:00, Thứ năm 01-12-2022',
            circleColor: '#06bfa5',
            lineColor: theme.colors.grey_[400],
        },
        {
            title: 'Event 2',
            description: 'Event 2 Description',
            circleColor: theme.colors.grey_[400],
            lineColor: theme.colors.grey_[400],
        },
        {
            title: 'Event 3',
            description: 'Event 3 Description',
            circleColor: theme.colors.grey_[400],
            lineColor: theme.colors.grey_[400],
        },
        {
            title: 'Event 4',
            description: 'Event 4 Description',
            circleColor: theme.colors.grey_[400],
            lineColor: theme.colors.grey_[400],
        },
        {
            title: 'Event 5',
            description: 'Event 5 Description',
            circleColor: theme.colors.grey_[400],
            lineColor: theme.colors.grey_[400],
        },
    ];

    return (
        <>
            <Header
                center={
                    <Text size={'title2'} ta="center">
                        Chi tiết vận chuyển
                    </Text>
                }
                showGoBack
                iconGoBackColor={theme.colors.black_[10]}
                bgColor={theme.colors.white_[10]}
                statusBarColor={theme.colors.main[500]}
            />
            <View style={styles.view_container}>
                <View
                    style={{
                        height: theme.dimens.verticalScale(60),
                        backgroundColor: theme.colors.main['600'],
                        marginTop: 10,
                        borderRadius: 5,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <View style={{ paddingLeft: 10 }}>
                        <Text color={theme.colors.white_[10]}>Mã vận chuyển: #000278</Text>
                        <Text color={theme.colors.white_[10]}>Giao bởi: Vua Dụng Cụ</Text>
                    </View>
                    <Button
                        title="Sao chép"
                        type="outline"
                        size="sm"
                        titleStyle={{
                            fontSize: theme.typography.body2,
                            color: theme.colors.main['600'],
                        }}
                        buttonStyle={{
                            borderRadius: 5,
                            backgroundColor: theme.colors.white_[10],
                        }}
                        containerStyle={{
                            paddingRight: 10,
                        }}
                        onPress={copyOrderIdToClipboard('test order id')}
                    />
                </View>
                {/* Type 2 */}
                <View style={{ paddingVertical: 10 }}></View>
                <View
                    style={{
                        height: theme.dimens.verticalScale(60),
                        backgroundColor: theme.colors.main['600'],
                        marginTop: 10,
                        borderRadius: 5,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <View style={{ paddingLeft: 10 }}>
                        <Text color={theme.colors.white_[10]}>Mã vận chuyển: #000278</Text>
                    </View>
                    <Button
                        title="Sao chép"
                        type="outline"
                        size="sm"
                        titleStyle={{
                            fontSize: theme.typography.body2,
                            color: theme.colors.main['600'],
                        }}
                        buttonStyle={{
                            borderRadius: 5,
                            backgroundColor: theme.colors.white_[10],
                        }}
                        containerStyle={{
                            paddingRight: 10,
                        }}
                        onPress={copyOrderIdToClipboard('test order id 2')}
                    />
                </View>
                {/* TimeLine */}
                <View style={{ marginTop: 30, flex: 1 }}>
                    <Timeline
                        data={data}
                        showTime={false}
                        lineWidth={1}
                        circleSize={12}
                        titleStyle={{
                            marginTop: -15,
                        }}
                        detailContainerStyle={{
                            marginBottom: 10,
                            borderBottomWidth: 1,
                            borderBottomColor: theme.colors.grey_[200],
                        }}
                        descriptionStyle={{
                            fontSize: theme.typography.body1,
                            marginTop: 5,
                        }}
                        style={{ marginBottom: 10 }}
                        // renderFullLine={true}
                    />
                </View>
            </View>
        </>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_container: {
            flex: 1,
            backgroundColor: theme.colors.white_[10],
            paddingLeft: theme.spacings.medium,
            paddingRight: theme.spacings.medium,
        },
    });
