import React, { memo, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import Text from 'components/Text';
import { useNavigate, useNavigation, useTheme } from 'hooks';
/* eslint-disable react-hooks/exhaustive-deps */
import Button from 'components/Button';
import Image from 'components/Image';
import Touch from 'components/Touch';
import View from 'components/View';
import { NAVIGATION_TO_NEWS_CATEGORY } from 'const/routes';
import useNewsSwr from 'hooks/swr/newsSwr/useNewsSwr';
import { map } from 'lodash';
import useStyles from '../styles';

interface Props {
    refresh: boolean;
}

const NewsSortSection = memo(function NewsSortSection({ refresh }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles();
    const navigation = useNavigation();
    const navigate = useNavigate();
    //swr
    const { news, mutate: mutateNewsSorr } = useNewsSwr({ type: 'new' });
    //props

    useEffect(() => {
        if (refresh) {
            mutateNewsSorr();
        }
    }, [refresh]);

    //render

    //--news sort
    const renderListNewsSortSection = () => (
        <View style={styles.view_sort_section}>
            <View style={styles.view_sort_title}>
                <Text style={styles.txt_sort_title}>Mới nhất</Text>
            </View>

            <View style={styles.view_sort_items}>{renderListNewsSortItem()}</View>
            <Button
                type="clear"
                title="Xem thêm"
                color={theme.colors.grey_[500]}
                onPress={navigateNewsCategory('new')}
            />
        </View>
    );
    const renderListNewsSortItem = () =>
        map(news, (value, index) => (
            <Touch
                w="45%"
                mb="medium"
                key={index}
                onPress={navigate.NEW_DETAIL_ROUTE({ news_uuid: value.news_uuid })}
            >
                <View w="100%" ratio={1}>
                    <Image
                        source={{
                            uri: value.image,
                        }}
                        radius={10}
                    />
                </View>
                <Text color={theme.colors.grey_[400]}>1 giờ trước</Text>
                <Text size={'body2'} numberOfLines={3} lh={theme.typography.size(20)}>
                    {value.title}
                </Text>
            </Touch>
        ));

    //navigate
    const navigateNewsCategory = (type: 'new' | 'most_viewed') => () => {
        navigation.navigate(NAVIGATION_TO_NEWS_CATEGORY, { type, name: 'Tin mới nhất' });
    };

    return (
        <>
            {/* news sort section */}
            {news ? renderListNewsSortSection() : null}
        </>
    );
});

export default NewsSortSection;
