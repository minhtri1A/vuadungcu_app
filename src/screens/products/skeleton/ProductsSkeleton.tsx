import React, { memo } from 'react';
// eslint-disable-next-line no-unused-vars
/* eslint-disable react-hooks/exhaustive-deps */
import { Skeleton } from '@rneui/themed';
import View from 'components/View';
import useStyles from './styles';

interface Props {}

const ProductsSkeleton = memo(function ProductsSkeleton({}: Props) {
    //hook

    const styles = useStyles();

    const renderListSkeleton = () => (
        <View style={styles.view_product_1}>
            <Skeleton
                animation="pulse"
                style={styles.product_1}
                skeletonStyle={styles.skeleton_style}
            />
            <View p="small" flex={1}>
                <Skeleton
                    animation="pulse"
                    style={styles.product_2}
                    skeletonStyle={styles.skeleton_style}
                />
                <Skeleton
                    animation="pulse"
                    style={styles.product_3}
                    skeletonStyle={styles.skeleton_style}
                />
            </View>
        </View>
    );

    return (
        <View style={styles.view_product_wrap}>
            {renderListSkeleton()}
            {renderListSkeleton()}
            {renderListSkeleton()}
            {renderListSkeleton()}
        </View>
    );
});

export default ProductsSkeleton;
