import React, { memo } from 'react';
// eslint-disable-next-line no-unused-vars
/* eslint-disable react-hooks/exhaustive-deps */
import { Skeleton } from '@rneui/themed';
import View from 'components/View';
import useStyles from './styles';

interface Props {}

const NewsFeaturedSkeleton = memo(function NewsFeaturedSkeleton({}: Props) {
    //hook

    const styles = useStyles();

    return (
        <View p="medium">
            <View w={'100%'} ratio={1} >
                <Skeleton
                    animation="pulse"
                    style={styles.featured_1}
                    skeletonStyle={styles.skeleton_style}
                />
            </View>
            <Skeleton
                animation="pulse"
                style={styles.featured_2}
                skeletonStyle={styles.skeleton_style}
            />
            <Skeleton
                animation="pulse"
                style={styles.featured_3}
                skeletonStyle={styles.skeleton_style}
            />
        </View>
    );
});

export default NewsFeaturedSkeleton;
