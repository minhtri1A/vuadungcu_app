import React, { memo, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import Text from 'components/Text';
import { useNavigate, useTheme } from 'hooks';
/* eslint-disable react-hooks/exhaustive-deps */
import { Icon } from '@rneui/themed';
import Image from 'components/Image';
import Touch from 'components/Touch';
import View from 'components/View';
import useNewsSwr from 'hooks/swr/newsSwr/useNewsSwr';
import { map } from 'lodash';
import { ActivityIndicator } from 'react-native';
import Swiper from 'react-native-swiper';
import { calculatorBetweenTwoTime } from 'utils/helpers';
import NewsFeaturedSkeleton from '../skeleton/NewsFeaturedSkeleton';
import useStyles from '../styles';

interface Props {
    refresh: boolean;
}

const NewsFeaturedSection = memo(function NewsFeaturedSection({ refresh }: Props) {
    //hook
    const {
        theme: { colors, typography },
    } = useTheme();
    const styles = useStyles();

    const navigate = useNavigate();
    //swr
    const { news, isValidating, mutate: mutateFeatured } = useNewsSwr({ type: 'featured' });
    //props

    useEffect(() => {
        if (refresh) {
            mutateFeatured();
        }
    }, [refresh]);

    //render
    //--news featured
    const renderListNewsFeatured = () =>
        map(news, (value, index) => (
            <Touch
                aI="center"
                p="medium"
                onPress={navigate.NEW_DETAIL_ROUTE({ news_uuid: value.news_uuid })}
                key={index}
                activeOpacity={0.8}
            >
                <View style={styles.view_featured_image}>
                    <Image
                        source={{
                            uri: value.image,
                        }}
                        resizeMode="contain"
                        radius={5}
                    />
                </View>
                <View w="100%">
                    <View flexDirect="row" aI="flex-end" mt="tiny">
                        <Icon
                            type="material-community"
                            name="clock-outline"
                            color={colors.grey_[400]}
                            size={typography.size(18)}
                        />
                        <Text color={colors.grey_[400]} ml={1}>
                            {handleNewsTime(value.updated_at)}
                        </Text>
                    </View>
                    <Text size={'body3'} mt="tiny" ellipsizeMode="tail" numberOfLines={3}>
                        {value.title}
                    </Text>
                </View>
            </Touch>
        ));
    //handle
    const handleNewsTime = (newsTime: string) => {
        const now = Date.now(); //milisecond
        const newsTime_ = parseInt(newsTime) * 1000; // convert timestamp to milisecond
        const checkTwoTime = calculatorBetweenTwoTime(newsTime_, now);

        return `${checkTwoTime?.num || ''} ${checkTwoTime?.title || ''} trước`;
    };
    //navigate

    return (
        <View style={styles.view_swiper}>
            {/* news feutured section */}
            {isValidating ? (
                <NewsFeaturedSkeleton />
            ) : (
                <Swiper
                    loadMinimalLoader={<ActivityIndicator size="large" />}
                    dot={<View style={styles.dotSwiper} />}
                    activeDot={<View style={styles.swiper_activeDot} />}
                    autoplay={true}
                >
                    {renderListNewsFeatured()}
                </Swiper>
            )}
        </View>
    );
});

export default NewsFeaturedSection;
