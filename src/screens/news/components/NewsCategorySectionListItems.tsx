import React, { memo } from 'react';
// eslint-disable-next-line no-unused-vars
/* eslint-disable react-hooks/exhaustive-deps */
import NewsItemHorizontal from 'components/NewsItemHorizontal.tsx';
import useNewsSwr from 'hooks/swr/newsSwr/useNewsSwr';
import { map } from 'lodash';

interface Props {
    category_uuid: string;
}

const NewsCategorySectionListItems = memo(function NewsCategorySectionListItems({
    category_uuid,
}: Props) {
    //swr
    const { news } = useNewsSwr({ category_uuid, page_size: 5 });

    //--news category

    const renderNewsListItems = () =>
        map(news, (value, index) => <NewsItemHorizontal news_items={value} key={index} />);

    return <>{renderNewsListItems()}</>;
});

export default NewsCategorySectionListItems;
