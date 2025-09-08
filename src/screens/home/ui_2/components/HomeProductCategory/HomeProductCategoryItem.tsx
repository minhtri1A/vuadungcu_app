import { Icon } from '@rneui/themed';
import Image from 'components/Image';
import ListProductItem from 'components/ListProductItem';
import Text from 'components/Text';
import View from 'components/View';
import { useCategoriesSWR, useNavigate, useTheme } from 'hooks';
import useProductsSwr from 'hooks/swr/productSwr/useProductSwr';
import { CategoryType } from 'models';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity as Touch } from 'react-native';

interface Props {
    categoryParent: CategoryType;
    categoryParentLength: number;
}

const HomeProductCategoryItem = memo(function HomeProductCategoryItem({ categoryParent }: Props) {
    //Hook
    const { theme } = useTheme();
    const styles = useStyles();
    const navigate = useNavigate();
    // const dispatch = useAppDispatch();
    //State
    const [categorySelected, setCategorySelected] = useState('');
    const [checkRender, setCheckRender] = useState(false);
    // const countSection = useAppSelector(
    //     (state) => state.apps.home.countSectionProductCategoryFinishRender
    // );

    //SWR
    const { products, isLoading } = useProductsSwr(
        {
            page_size: 10,
            category_uuid: categorySelected,
        },
        {
            revalidateOnMount: false,
            dedupingInterval: 3600 * 120,
        }
    );
    const { categories: categoryChildren } = useCategoriesSWR(categoryParent.uuid);

    //Effect
    useEffect(() => {
        if (categoryChildren?.parent?.length > 0) {
            setCategorySelected(categoryChildren.parent[0].uuid);
        }
    }, [categoryChildren]);

    //--check render
    useEffect(() => {
        if (
            categorySelected === categoryChildren?.parent[0]?.uuid &&
            products?.length > 1 &&
            !checkRender
        )
            setCheckRender(true);

        // setCheckRender(false);

        // xy ly de cac section hien cung 1 luc - tranh giut lag ui
        // if (countSection < categoryParentLength) {
        //     dispatch(SET_HOME_STATE({ countSectionProductCategoryFinishRender: countSection + 1 }));
        // }
    }, [categoryChildren, categorySelected, products]);

    //Handle
    const changeCategorySelected = (category_uuid: string) => () => {
        setCategorySelected(category_uuid);
    };

    //Render
    const renderSubcategory = useCallback(
        () => (
            <View
                style={{
                    // backgroundColor: theme.colors.main[50],
                    borderTopWidth: 0.7,
                    // borderBottomWidth: 0.7,
                    borderColor: theme.colors.grey_[200],
                    marginBottom: theme.spacings.small,
                    // backgroundColor: '#fcfcfc',
                }}
            >
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {[
                        ...(categoryChildren?.parent || []),
                        ...(categoryChildren?.children || []),
                    ].map((v, i) => (
                        <Touch
                            key={i}
                            style={styles.touch_sub_item}
                            onPress={changeCategorySelected(v.uuid)}
                            activeOpacity={0.7}
                        >
                            <Text
                                color={
                                    v.uuid === categorySelected
                                        ? theme.colors.main[600]
                                        : theme.colors.grey_[600]
                                }
                                fw={'500'}
                            >
                                {v.name}
                            </Text>
                        </Touch>
                    ))}
                </ScrollView>
            </View>
        ),
        [categoryChildren?.children?.length, categorySelected]
    );

    const renderProductItem = useCallback(
        () =>
            products.map((v, i) => (
                <View style={styles.view_item} key={i}>
                    <ListProductItem
                        item={v}
                        lengthListProduct={products.length}
                        isAddToCart
                        viewContainerStyle={styles.item_container}
                    />
                </View>
            )),
        [products]
    );

    if (!checkRender) return;

    return (
        <View style={styles.view_container}>
            <Touch
                style={styles.view_title}
                activeOpacity={0.8}
                onPress={navigate.PRODUCT_CATEGORY_ROUTE({ category_uuid: categoryParent?.uuid })}
            >
                <View w={25} ratio={1 / 1}>
                    <Image source={{ uri: categoryParent?.image }} resizeMode="stretch" />
                </View>
                <View flexDirect="row" aI="center">
                    <Text size={'body3'} fw="bold">
                        {categoryParent.name}
                    </Text>
                </View>
            </Touch>
            {/* sub menu */}
            {renderSubcategory()}
            {/* list product */}
            <View pb={theme.spacings.medium}>
                {isLoading ? (
                    <View h={theme.dimens.height * 0.38} jC="center" aI="center">
                        <ActivityIndicator color={theme.colors.main[400]} />
                    </View>
                ) : products?.length > 0 ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {renderProductItem()}
                        <View ml={'medium'} />
                    </ScrollView>
                ) : (
                    <View h={theme.dimens.height * 0.38} jC="center" aI="center">
                        <Icon
                            type="ionicon"
                            name="ban-outline"
                            color={theme.colors.grey_[400]}
                            size={theme.typography.size(17)}
                        />
                        <Text color={theme.colors.grey_[400]}>Danh mục trống</Text>
                    </View>
                )}
            </View>
        </View>
    );
});

export default HomeProductCategoryItem;
const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        view_container: {
            backgroundColor: theme.colors.white_[10],
            marginTop: theme.spacings.small,
        },
        view_title: {
            flexDirection: 'row',
            paddingVertical: theme.spacings.medium,
            paddingHorizontal: theme.spacings.medium,
            gap: theme.spacings.small,
            alignItems: 'center',
            // borderBottomWidth: 0.7,
            // borderBottomColor: theme.colors.grey_[300],
            // marginBottom: theme.spacings.medium,
        },
        view_item: {
            marginLeft: theme.spacings.medium,
            borderWidth: 1,

            borderColor: theme.colors.grey_[200],
            borderRadius: 5,
        },
        item_container: {
            flex: 1,
            marginBottom: 0,
        },
        touch_sub_item: {
            // paddingHorizontal: theme.spacings.medium,
            // paddingVertical: theme.spacings.small,
            // borderWidth: 1,
            // borderColor: theme.colors.grey_[300],
            paddingBottom: theme.spacings.medium,
            paddingTop: theme.spacings.medium,
            marginLeft: theme.spacings.medium,
            marginRight: theme.spacings.tiny,

            borderRadius: 7,
        },
        touch_sub_item_active: {
            // paddingHorizontal: theme.spacings.medium,
            // paddingVertical: theme.spacings.small,
            // borderWidth: 1,
            // borderColor: theme.colors.black_[7],
            // backgroundColor: theme.colors.black_[8],
            marginLeft: theme.spacings.medium,
            borderRadius: 7,
            paddingBottom: theme.spacings.small,
            paddingTop: theme.spacings.tiny,
        },
        icon_container: {
            marginRight: -5,
            marginBottom: -2,
        },
    });
};
