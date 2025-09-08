/* eslint-disable react-hooks/exhaustive-deps */
import Divider from 'components/Divider';
import { useTheme } from 'hooks';
import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
// import useStyles from './styles';
import { Skeleton } from '@rneui/themed';
import View from 'components/View';

interface Props {}

const HomeCategorySkeleton = memo(function HomeCategorySkeleton({}: Props) {
    //hook
    const styles = useStyles();
    const { theme } = useTheme();

    const renderSkeleton = () => (
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
            {renderSkeletonItem()}
            {renderSkeletonItem()}
            {renderSkeletonItem()}
            {renderSkeletonItem()}
        </View>
    );

    const renderSkeletonItem = () => (
        <View>
            <Skeleton
                style={{ borderRadius: 10, backgroundColor: theme.colors.grey_[200] }}
                width={theme.dimens.scale(70)}
                height={theme.dimens.scale(70)}
                skeletonStyle={styles.skeleton_style}
            />
        </View>
    );
    return (
        <>
            <View
                style={{
                    height: theme.dimens.verticalScale(250),
                    backgroundColor: theme.colors.white_[10],
                    padding: theme.spacings.medium,
                    justifyContent: 'space-around',
                }}
            >
                {renderSkeleton()}
                {/* {renderSkeleton()} */}
            </View>

            <Divider />
        </>
    );
});
const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        /*-------top screen------ */
        skeleton_wrapStyle: {
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
        },
        skeleton_style: {
            backgroundColor: theme.colors.grey_[300],
        },
    });
};

export default HomeCategorySkeleton;
