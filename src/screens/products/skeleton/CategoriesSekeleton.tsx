import React, { memo } from 'react';
// eslint-disable-next-line no-unused-vars
/* eslint-disable react-hooks/exhaustive-deps */
import { Skeleton } from '@rneui/themed';
import View from 'components/View';
import { useTheme } from 'hooks';
import useStyles from './styles';

interface Props {}

const CategoriesSekeleton = memo(function CategoriesSekeleton({}: Props) {
    //hook

    const styles = useStyles();
    const {theme} = useTheme()

    const renderListSkeleton = () => (
        <Skeleton
            animation="pulse"
            style={styles.category_section_3}
            skeletonStyle={styles.skeleton_style}
        />
    );

    return (
        <View p="medium" bg={theme.colors.white_[10]} mt="medium" mb="small">
            <Skeleton
                animation="pulse"
                style={styles.category_section_1}
                skeletonStyle={styles.skeleton_style}
            />
            <Skeleton
                animation="pulse"
                style={styles.category_section_2}
                skeletonStyle={styles.skeleton_style}
            />
            <View mt="small" flexDirect="row" jC="space-between">
                {renderListSkeleton()}
                {renderListSkeleton()}
                {renderListSkeleton()}
                {renderListSkeleton()}
                {renderListSkeleton()}
            </View>
        </View>
    );
});

export default CategoriesSekeleton;
