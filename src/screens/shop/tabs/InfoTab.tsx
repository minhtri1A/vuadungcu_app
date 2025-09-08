/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import { TabView } from '@rneui/themed';
import Text from 'components/Text';
import View from 'components/View';
import { useTheme } from 'hooks';
import { SellerInfoResponseType } from 'models';
import moment from 'moment';
import React, { memo } from 'react';
import { Animated, ScrollView } from 'react-native';
import { calculatorBetweenTwoTime, convertToSortNumber } from 'utils/helpers';
import useStyles from './../styles';

interface Props {
    initValueAnimated: any;
    seller: SellerInfoResponseType;
}

export default memo(function StoreTab({ initValueAnimated, seller }: Props) {
    //hook
    const {
        theme: {},
    } = useTheme();
    const styles = useStyles();
    //state
    //swr
    //data
    const timestamp = moment(seller?.created_at, 'YYYY-MM-DD HH:mm:ss').valueOf();
    const nowTimeStamp = Date.now();
    const checkTwoTime = calculatorBetweenTwoTime(timestamp, nowTimeStamp);

    //render

    return (
        <TabView.Item style={styles.tab_item}>
            <ScrollView
                style={styles.list_container_style}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: initValueAnimated } } }],
                    { useNativeDriver: false }
                )}
            >
                <View mt={'medium'}>
                    <Text size={'body3'} fw="bold" ta="center" mb="medium">
                        Thông tin cửa hàng
                    </Text>
                    <View style={styles.view_info}>
                        <Text style={styles.txt_label}>Tên</Text>
                        <Text style={styles.txt_value}>{seller?.seller_name}</Text>
                    </View>
                    <View style={styles.view_info}>
                        <Text style={styles.txt_label}>Thời gian tham gia</Text>
                        <Text style={styles.txt_value}>
                            {checkTwoTime?.num || ''} {checkTwoTime?.title || ''} trước
                        </Text>
                    </View>
                    <View style={styles.view_info}>
                        <Text style={styles.txt_label}>Sản phẩm</Text>
                        <Text style={styles.txt_value}>
                            {convertToSortNumber(seller?.product_count || 0)}
                        </Text>
                    </View>
                    <View style={styles.view_info}>
                        <Text style={styles.txt_label}>Thông tin kinh doanh</Text>
                        <View flex={0.5} p="small">
                            <Text>
                                <Text fw="bold">{seller.business_info.business.label}:</Text>{' '}
                                {seller.business_info.business.value}
                            </Text>
                            <Text>
                                <Text fw="bold">{seller.business_info.owner.label}:</Text>{' '}
                                {seller.business_info.owner.value}
                            </Text>
                            <Text>
                                <Text fw="bold">{seller.business_info.lience.label}:</Text>{' '}
                                {seller.business_info.lience.value}
                            </Text>
                            <Text>
                                <Text fw="bold">{seller.business_info.address.label}:</Text>{' '}
                                {seller.business_info.address.value}
                            </Text>
                        </View>
                    </View>
                    {/* <View style={styles.view_info}>
                        <Text style={styles.txt_label}>Đánh giá</Text>
                        <Text style={styles.txt_value}>999</Text>
                    </View>
                    <View style={styles.view_info}>
                        <Text style={styles.txt_label}>Lượt theo dỗi</Text>
                        <Text style={styles.txt_value}>22k</Text>
                    </View>
                    <View style={{}}>
                        <Text p="small" fw="bold">
                            Giới thiệu cửa hàng
                        </Text>
                        <Text flex={0.5} ml="large" lh={20} color={theme.colors.grey_[500]}>
                            Cả 2 cách sẽ cho cùng 1 kết quả, nhưng bạn thấy đấy sử dụng Window
                            Functions tiện gọn hơn đúng không. Nếu bạn hiểu đc ý nghĩa và cách dùng
                            của Window Function thì tôi cá là các bạn sẽ chọn nó thay vì viết
                            subquery dài như cái bơm.
                        </Text>
                    </View> */}
                </View>
            </ScrollView>
        </TabView.Item>
    );
});
