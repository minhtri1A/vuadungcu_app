/* eslint-disable react-hooks/exhaustive-deps */
import { useTheme } from 'hooks';
import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
// import useStyles from './styles';
import { Skeleton } from '@rneui/themed';
import View from 'components/View';

interface Props {}

const ReviewsSkeleton = memo(function ReviewsSkeleton({}: Props) {
    //hook
    const styles = useStyles();
    const { theme } = useTheme();

    const renderSkeletonItem = () => (
        <View
            style={{
                borderTopWidth: 1,
                borderTopColor: theme.colors.grey_[200],
                paddingTop: theme.spacings.medium,
                marginBottom: theme.spacings.medium,
            }}
        >
            <Skeleton
                width={theme.dimens.scale(110)}
                height={theme.dimens.verticalScale(15)}
                style={{ backgroundColor: theme.colors.grey_[200] }}
                skeletonStyle={styles.skeleton_style}
            />
            <View flexDirect="row" mt="small">
                <Skeleton
                    width={theme.dimens.scale(80)}
                    height={theme.dimens.verticalScale(15)}
                    style={{ backgroundColor: theme.colors.grey_[200] }}
                    skeletonStyle={styles.skeleton_style}
                />
                <View ml="tiny">
                    <Skeleton
                        width={theme.dimens.scale(20)}
                        height={theme.dimens.verticalScale(15)}
                        style={{ backgroundColor: theme.colors.grey_[200] }}
                        skeletonStyle={styles.skeleton_style}
                    />
                </View>
            </View>
            <View mt="small">
                <Skeleton
                    width={theme.dimens.scale(170)}
                    height={theme.dimens.verticalScale(15)}
                    style={{ backgroundColor: theme.colors.grey_[200] }}
                    skeletonStyle={styles.skeleton_style}
                />
            </View>
            <View mt="extraLarge">
                <Skeleton
                    width={theme.dimens.width * 0.92}
                    height={theme.dimens.verticalScale(40)}
                    style={{ backgroundColor: theme.colors.grey_[200] }}
                    skeletonStyle={styles.skeleton_style}
                />
            </View>
            <View flexDirect="row" mt="small">
                <Skeleton
                    width={theme.dimens.scale(75)}
                    height={theme.dimens.scale(75)}
                    style={{
                        backgroundColor: theme.colors.grey_[200],
                        marginRight: theme.spacings.small,
                    }}
                    skeletonStyle={styles.skeleton_style}
                />
                <Skeleton
                    width={theme.dimens.scale(75)}
                    height={theme.dimens.scale(75)}
                    style={{
                        backgroundColor: theme.colors.grey_[200],
                        marginRight: theme.spacings.small,
                    }}
                    skeletonStyle={styles.skeleton_style}
                />
                <Skeleton
                    width={theme.dimens.scale(75)}
                    height={theme.dimens.scale(75)}
                    style={{
                        backgroundColor: theme.colors.grey_[200],
                        marginRight: theme.spacings.small,
                    }}
                    skeletonStyle={styles.skeleton_style}
                />
                <Skeleton
                    width={theme.dimens.scale(75)}
                    height={theme.dimens.scale(75)}
                    style={{
                        backgroundColor: theme.colors.grey_[200],
                        marginRight: theme.spacings.small,
                    }}
                    skeletonStyle={styles.skeleton_style}
                />
            </View>
            <View mt="medium" aI="flex-end">
                <Skeleton
                    width={theme.dimens.scale(170)}
                    height={theme.dimens.verticalScale(15)}
                    style={{ backgroundColor: theme.colors.grey_[200] }}
                    skeletonStyle={styles.skeleton_style}
                />
            </View>
        </View>
    );
    return (
        <>
            <View style={{ paddingHorizontal: theme.spacings.medium }}>
                {renderSkeletonItem()}
                {renderSkeletonItem()}
            </View>
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

export default ReviewsSkeleton;
