import React, { memo } from 'react';
// eslint-disable-next-line no-unused-vars
import Text from 'components/Text';
import { useNavigation, useTheme } from 'hooks';
/* eslint-disable react-hooks/exhaustive-deps */
import Image from 'components/Image';
import Touch from 'components/Touch';
import View from 'components/View';
import { NAVIGATION_TO_NEWS_DETAIl } from 'const/routes';
import { NewsItemType } from 'models';
import { StyleSheet } from 'react-native';
import { calculatorBetweenTwoTime } from 'utils/helpers';

interface Props {
    news_items: NewsItemType;
}

const NewsItemHorizontal = memo(function NewsItemHorizontal({ news_items }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles();
    const navigation = useNavigation();
    //props

    const handleNewsTime = (newsTime: string) => {
        const now = Date.now(); //milisecond
        const newsTime_ = parseInt(newsTime) * 1000; // convert timestamp to milisecond
        const checkTwoTime = calculatorBetweenTwoTime(newsTime_, now);

        return `${checkTwoTime?.num || ''} ${checkTwoTime?.title || ''} trước`;
    };
    //navigate
    const navigatePushNewsDetail = () => {
        navigation.push(NAVIGATION_TO_NEWS_DETAIl, { news_uuid: news_items.news_uuid });
    };

    return (
        <Touch style={styles.view_category_item} onPress={navigatePushNewsDetail}>
            <View flex={0.28} ratio={1}>
                <Image
                    source={{
                        uri: news_items.image,
                    }}
                    resizeMode="contain"
                    radius={10}
                />
            </View>
            <View flex={0.7} ml="medium">
                <Text size={'body2'} color={theme.colors.slate[900]} lh={20} numberOfLines={3}>
                    {news_items.title}
                </Text>
                <Text color={theme.colors.grey_[400]}>{handleNewsTime(news_items.updated_at)}</Text>
            </View>
        </Touch>
    );
});

export default NewsItemHorizontal;

const useStyles = () => {
    const {
        theme: { spacings, colors },
    } = useTheme();
    return StyleSheet.create({
        view_category_item: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: colors.grey_[100],
            marginBottom: spacings.large,
            paddingBottom: spacings.large,
        },
    });
};
