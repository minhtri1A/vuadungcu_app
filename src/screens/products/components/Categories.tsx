import Image from 'components/Image';
import Text from 'components/Text';
import View from 'components/View';
import { NAVIGATION_TO_PRODUCT_CATEGORY_SCREEN, NAVIGATION_TO_PRODUCT_DRAWER } from 'const/routes';
import { useNavigation, useTheme } from 'hooks';
import { last } from 'lodash';
import { CategoriesResponseType, CategoryType } from 'models';
import React, { memo } from 'react';
import { FlatList, ListRenderItemInfo, Platform, TouchableOpacity } from 'react-native';
import { convertToSortNumber } from 'utils/helpers';
import useStyles from '../styles';

interface Props {
    category_uuid: string;
    categoryData: CategoriesResponseType;
    refListCate: any;
    pagination: {
        page: number;
        page_count: number;
        page_size: number;
        total_items: number;
    };
}

const Categories = memo(function Categories({
    categoryData,
    refListCate,
    pagination,
    category_uuid,
}: Props) {
    //hooks
    const styles = useStyles();
    const { theme } = useTheme();
    const navigation = useNavigation();
    //value
    const { parent, children } = categoryData || {};
    const currentCategory = last(parent);

    //handle

    const handleSelectChildCategory = (child_category_uuid: string) => () => {
        navigation.push(NAVIGATION_TO_PRODUCT_DRAWER, {
            screen: NAVIGATION_TO_PRODUCT_CATEGORY_SCREEN,
            params: {
                category_uuid: child_category_uuid,
            },
        });
    };

    const renderItemListCate = ({ item, index }: ListRenderItemInfo<CategoryType>) => {
        return (
            <TouchableOpacity
                style={styles.touch_wrap_item}
                onPress={handleSelectChildCategory(item.uuid)}
                activeOpacity={1}
                key={index}
            >
                {/* <View w={'70%'} ratio={1}>
                    <Image
                        source={{
                            uri: item.image,
                            priority: 'normal',
                        }}
                        resizeMode={'contain'}
                    />
                </View> */}
                <View jC="center" aI="center">
                    <Text
                        ta="center"
                        color={theme.colors.grey_[600]}
                        ellipsizeMode="tail"
                        numberOfLines={2}
                    >
                        {item.name}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.view_category_container}>
            {category_uuid && category_uuid !== '0' ? (
                <View style={styles.view_wrap_parent}>
                    <View style={styles.view_parent_image}>
                        <Image source={{ uri: currentCategory?.image }} resizeMode="stretch" />
                    </View>
                    <View style={styles.view_parent_info}>
                        <Text size={'body2'} fw="500">
                            {currentCategory?.name}
                        </Text>
                        <Text size={'sub3'} color={theme.colors.grey_[500]}>
                            Tìm thấy {convertToSortNumber(pagination.total_items)} sản phẩm
                        </Text>
                    </View>
                </View>
            ) : null}

            <FlatList
                ref={refListCate}
                data={children}
                horizontal
                renderItem={renderItemListCate}
                keyExtractor={(item) => item?.uuid.toString()}
                showsHorizontalScrollIndicator={false}
                getItemLayout={(_, index) => ({
                    length: theme.dimens.width * 0.2,
                    offset: theme.dimens.width * 0.2 * index,
                    index,
                })}
                removeClippedSubviews={Platform.OS === 'ios' ? false : true}
                style={{
                    borderTopWidth: 0.7,
                    borderTopColor: theme.colors.grey_[200],
                }}
            />
        </View>
    );
});

export default Categories;
