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
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                // paddingHorizontal: theme.spacings.medium,
            }}
        >
            {renderSkeletonItem()}
            {renderSkeletonItem()}
            {renderSkeletonItem()}
            {renderSkeletonItem()}
        </View>
    );

    const renderSkeletonItem = () => (
        <View w={theme.dimens.width * 0.18}>
            <Skeleton
                style={{
                    borderRadius: 10,
                    backgroundColor: theme.colors.grey_[200],
                }}
                height={theme.dimens.width * 0.18}
                skeletonStyle={styles.skeleton_style}
            />
        </View>
    );
    return (
        <>
            <View
                style={{
                    // height: theme.dimens.verticalScale(250),
                    backgroundColor: theme.colors.white_[10],
                    padding: theme.spacings.medium,
                    justifyContent: 'space-around',
                }}
            >
                <View mb="medium" flexDirect="row" aI="center" jC="space-between">
                    <Skeleton
                        style={{ borderRadius: 2, backgroundColor: theme.colors.grey_[200] }}
                        width={theme.dimens.scale(120)}
                        height={theme.dimens.scale(15)}
                        skeletonStyle={styles.skeleton_style}
                    />
                    <Skeleton
                        style={{ borderRadius: 2, backgroundColor: theme.colors.grey_[200] }}
                        width={theme.dimens.scale(30)}
                        height={theme.dimens.scale(7)}
                        skeletonStyle={styles.skeleton_style}
                    />
                </View>

                {renderSkeleton()}
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
