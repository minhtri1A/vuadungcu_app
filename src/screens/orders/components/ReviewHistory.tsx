import LoadingFetchAPI from 'components/LoadingFetchAPI';
import View from 'components/View';
import { useCustomerSwr, useTheme } from 'hooks';
import useCustomerReviewsSwrInfinity from 'hooks/swr/reviewsSwr/useCustomerReviewsSwrInfinity';
import { useRefreshControl } from 'hooks/useRefreshControl';
import { CustomerReviewsResponseType } from 'models';
import React, { memo } from 'react';
import { FlatList, ListRenderItem, StyleSheet } from 'react-native';
import { themeType } from 'theme';
import { isEmpty } from 'utils/helpers';
import ReviewHistoryItem from './ReviewHistoryItem';

interface Props {}

const ReviewHistory = memo(function ReviewHistory({}: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);

    //state
    //swr
    const { customers } = useCustomerSwr('all');
    const {
        reviews,
        pagination: { page, page_count },
        size,
        isValidating,
        setSize,
        mutate,
    } = useCustomerReviewsSwrInfinity({
        persistSize: true,
    });

    const { refreshControl } = useRefreshControl(() => {
        mutate();
    });

    //render
    const renderListReviewHistory: ListRenderItem<CustomerReviewsResponseType> = ({
        item,
        index,
    }) => <ReviewHistoryItem customers={customers} review={item} key={index} mutate={mutate} />;

    //handle
    const handleLoadMoreReviewsHistory = () => {
        if (!isValidating && page < page_count) {
            setSize(size + 1);
        }
    };

    return (
        <View style={styles.view_container}>
            {/* <FlatList/> */}

            <FlatList
                data={reviews}
                renderItem={renderListReviewHistory}
                keyExtractor={(item) => item.review_uuid}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={false}
                onEndReachedThreshold={0.5}
                onEndReached={handleLoadMoreReviewsHistory}
                ListFooterComponent={
                    <LoadingFetchAPI // check xem co lading san pham hk
                        visible={isValidating && !isEmpty(reviews)}
                        size={theme.typography.size(40)}
                        styleView={{
                            height: theme.dimens.scale(50),
                        }}
                        color={theme.colors.main['600']}
                        // titleText={'Đã hết sản phẩm'}
                    />
                }
                refreshControl={refreshControl()}
            />
        </View>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_container: {
            width: '100%',
            borderTopWidth: 1,
            borderTopColor: theme.colors.grey_[200],
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

export default ReviewHistory;
