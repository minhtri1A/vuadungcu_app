import View from 'components/View';
import { useCategoriesSWR } from 'hooks';
import React, { memo, useEffect } from 'react';
import HomeProductCategoryItem from './HomeProductCategoryItem';

interface Props {
    refreshControl: boolean;
    isAppStart: boolean;
}

const HomeProductCategory = memo(function HomeProductCategory({
    refreshControl,
    isAppStart,
}: Props) {
    const { categories, mutate } = useCategoriesSWR('0', undefined, { revalidateOnMount: false });

    // effect
    //--fetch init
    useEffect(() => {
        if (isAppStart) {
            mutate();
        }
    }, [isAppStart]);
    //--refresh control
    useEffect(() => {
        if (refreshControl && isAppStart) {
            mutate();
        }
    }, [refreshControl, isAppStart]);

    return (
        <View>
            {categories?.children?.length > 0 &&
                isAppStart &&
                categories?.children.map((v, i) => (
                    <HomeProductCategoryItem
                        categoryParentLength={categories?.children?.length}
                        categoryParent={v}
                        key={i}
                    />
                ))}
        </View>
    );
});

export default HomeProductCategory;
// 5 list header
// 3 home body
// 3 home screen
