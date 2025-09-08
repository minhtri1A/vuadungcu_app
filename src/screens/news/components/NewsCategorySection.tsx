import React, { memo, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import Text from 'components/Text';
import { useNavigation, useTheme } from 'hooks';
/* eslint-disable react-hooks/exhaustive-deps */
import Button from 'components/Button';
import View from 'components/View';
import { NAVIGATION_TO_NEWS_CATEGORY } from 'const/routes';
import useNewsCategorySwr from 'hooks/swr/newsSwr/useNewsCategorySwr';
import { map } from 'lodash';
import NewsCategorySectionSkeleton from '../skeleton/NewsCategorySectionSkeleton';
import useStyles from '../styles';
import NewsCategorySectionListItems from './NewsCategorySectionListItems';

interface Props {
    refresh: boolean;
}

const NewsCategorySection = memo(function NewsCategorySection({ refresh }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles();
    const navigation = useNavigation();
    //swr
    const { categories, isValidating, mutate: mutateNewsCategory } = useNewsCategorySwr();
    //props

    useEffect(() => {
        if (refresh) {
            mutateNewsCategory();
        }
    }, [refresh]);

    //render
    //--news category
    const renderListNewsCategorySection = () =>
        map(categories, (value, index) => (
            <View style={styles.view_category_section} key={index}>
                <Text style={styles.txt_section_title} size={'title1'}>
                    {value.category_name}
                </Text>
                <NewsCategorySectionListItems category_uuid={value.category_uuid} />
                <Button
                    title={'Xem thêm'}
                    type="clear"
                    color={theme.colors.grey_[500]}
                    onPress={navigateNewsCategory(value.category_uuid, value.category_name)}
                />
            </View>
        ));
    //navigate
    const navigateNewsCategory = (category_uuid: string, name: string) => () => {
        navigation.navigate(NAVIGATION_TO_NEWS_CATEGORY, { category_uuid, name });
    };

    return (
        <View mb="medium">
            {/* news category section */}
            {isValidating ? <NewsCategorySectionSkeleton /> : renderListNewsCategorySection()}
        </View>
    );
});

export default NewsCategorySection;
