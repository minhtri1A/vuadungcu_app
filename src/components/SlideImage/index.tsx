import View from 'components/View';
import { useTheme } from 'hooks';
import React, { memo } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import { themeType } from 'theme';

interface IProps {
    isLoading?: boolean;
    children: React.ReactNode;
}

export default memo(function SlideImage({ isLoading, children }: IProps) {
    //hôk
    const { theme } = useTheme();
    const styles = useStyles(theme);

    return (
        <>
            {!isLoading ? (
                <Swiper
                    loadMinimalLoader={<ActivityIndicator size="large" />}
                    dot={<View style={styles.dotSwiper} />}
                    activeDot={<View style={styles.swiper_activeDot} />}
                    autoplay={true}
                >
                    {children}
                </Swiper>
            ) : (
                <View w="98%" h={'100%'} aS="center" bg="grey1" radius={5} />
            )}
        </>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        swiper_activeDot: {
            backgroundColor: 'transparent',
            width: theme.spacings.small,
            height: theme.spacings.small,
            borderRadius: theme.spacings.tiny,
            borderWidth: 1,
            borderColor: theme.colors.main['600'],
            marginLeft: theme.spacings.tiny,
            marginRight: theme.spacings.tiny,
            marginTop: theme.spacings.tiny,
            marginBottom: theme.spacings.tiny,
        },
        dotSwiper: {
            backgroundColor: theme.colors.grey_[300],
            width: theme.spacings.medium,
            height: theme.dimens.verticalScale(1.5),
            marginLeft: theme.spacings.tiny,
            marginRight: theme.spacings.tiny,
            marginTop: theme.spacings.tiny,
            marginBottom: theme.spacings.tiny,
        },
    });
