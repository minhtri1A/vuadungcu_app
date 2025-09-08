import React, { memo } from 'react';
// eslint-disable-next-line no-unused-vars
/* eslint-disable react-hooks/exhaustive-deps */
import { Skeleton } from '@rneui/themed';
import View from 'components/View';
import { useTheme } from 'hooks';
import useStyles from './styles';

interface Props {}

const NewsCategorySectionSkeleton = memo(function NewsCategorySectionSkeleton({}: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles();

    const renderListSkeleton = () => (
        <View flexDirect="row" mt="medium">
            <Skeleton
                animation="pulse"
                width={theme.dimens.scale(100)}
                height={theme.dimens.scale(100)}
                skeletonStyle={styles.skeleton_style}
            />
            <View w={'70%'}>
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
            </View>
        </View>
    );

    return (
        <View p="medium" bg={theme.colors.white_[10]} mt="medium">
            <Skeleton
                animation="pulse"
                style={styles.category_section_3}
                skeletonStyle={styles.skeleton_style}
            />
            {renderListSkeleton()}
            {renderListSkeleton()}
            {renderListSkeleton()}
        </View>
    );
});

export default NewsCategorySectionSkeleton;
