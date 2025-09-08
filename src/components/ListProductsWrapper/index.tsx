import LoadingFetchAPI from 'components/LoadingFetchAPI';
import View from 'components/View';
import { useTheme } from 'hooks';
import React, { memo } from 'react';
import { FlatListProps, ListRenderItem, Platform, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { themeType } from 'theme';
import ListProductItem from '../ListProductItem';

interface Props extends Omit<FlatListProps<any>, 'renderItem' | 'CellRendererComponent'> {
    autoScrolltop?: any;
    fontSize?: any;
    loadMore?: boolean;
    renderItem?: any;
    refProps?: any;
    heightLoading?: any;
    isAddToCart?: boolean;
    showRating?: boolean;
}

//flat list render product
const ListProductsWrapper = memo(function ListProducts(props: Props) {
    //hooks
    const { theme } = useTheme();
    //swr
    //props
    const {
        numColumns,
        data,
        loadMore,
        refProps,
        columnWrapperStyle,
        heightLoading,
        isAddToCart,
        showRating,
    } = props;
    const styles = useStyles(theme);

    const renderItem: ListRenderItem<any> = ({ item, index }: any) => {
        return (
            <ListProductItem
                item={item}
                key={index}
                index={index} // value cause re render
                lengthListProduct={data?.length}
                isAddToCart={isAddToCart}
                showRating={showRating}
            />
        );
    };

    // const getItemLayout = (data: any, index: any) => ({
    //     length: theme.dimens.height * 0.383,
    //     offset: theme.dimens.height * 0.383 * index,
    //     index,
    // });

    return (
        <>
            <Animated.FlatList
                ref={refProps}
                numColumns={numColumns}
                showsVerticalScrollIndicator={false}
                onEndReachedThreshold={0.5}
                scrollEventThrottle={16}
                initialNumToRender={5}
                maxToRenderPerBatch={15}
                // windowSize={10}
                removeClippedSubviews={Platform.OS === 'ios' ? false : true}
                ListFooterComponent={
                    <View style={{ height: heightLoading }}>
                        <LoadingFetchAPI // check xem co lading san pham hk
                            visible={loadMore}
                            size={theme.typography.title1}
                            styleView={styles.view_loading}
                            color={theme.colors.grey_[400]}
                        />
                    </View>
                }
                {...props}
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item?.uuid}
                columnWrapperStyle={[styles.list_column, columnWrapperStyle]}
                // getItemLayout={getItemLayout}
            />
        </>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_loading: {
            height: theme.dimens.height * 0.05,
            // backgroundColor: bgLoading,
        },
        list_column: {
            justifyContent: 'space-evenly',
        },
    });

export default ListProductsWrapper;
