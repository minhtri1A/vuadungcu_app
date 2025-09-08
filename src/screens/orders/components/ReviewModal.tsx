import BottomSheet from 'components/BottomSheet';
import Text from 'components/Text';
import View from 'components/View';
import { useTheme } from 'hooks';
import { OrderItemsType, OrdersType } from 'models';
import React, { memo, useRef } from 'react';
import { FlatList, ListRenderItem, StyleSheet } from 'react-native';
import { themeType } from 'theme';
import ReviewItem from './ReviewItem';
/* eslint-disable react-hooks/exhaustive-deps */

interface Props {
    isVisible: boolean;
    order: OrdersType;
    onBackdropPress: () => void;
}

const ReviewModal = memo(function ReviewModal({ isVisible, order, onBackdropPress }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    //ref
    const flatlistRef = useRef<FlatList>(null);

    //render

    const renderReviewItems: ListRenderItem<OrderItemsType> = ({ item, index }) => (
        <ReviewItem
            orderItem={item}
            key={index}
            index={index}
            flatlistRef={flatlistRef}
            length={order.items.length}
        />
    );

    return (
        <BottomSheet
            isVisible={isVisible}
            onBackdropPress={onBackdropPress}
            triggerOnClose={onBackdropPress}
            radius
            viewContainerStyle={{
                maxHeight: theme.dimens.verticalScale(600),
                paddingHorizontal: theme.spacings.medium - 10,
            }}
            scrollViewProps={{ scrollEnabled: false }}
        >
            {/* order review */}
            <View style={styles.view_container}>
                <Text fw="bold" mb={'medium'}>
                    Đánh giá {order.items.length} sản phẩm
                </Text>
                <FlatList
                    ref={flatlistRef}
                    data={order.items}
                    renderItem={renderReviewItems}
                    keyExtractor={(item) => item.item_uuid}
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={false}
                    style={styles.list_style}
                />
            </View>
        </BottomSheet>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_container: { justifyContent: 'center', alignItems: 'center' },
        list_style: {
            width: '100%',
        },
        touch_option: {
            paddingHorizontal: theme.spacings.small,
            paddingVertical: 2,
            borderWidth: 1,
            borderColor: theme.colors.grey_[400],
            borderRadius: 10,
            marginRight: theme.spacings.small,
            marginTop: theme.spacings.small,
        },
    });

export default ReviewModal;
