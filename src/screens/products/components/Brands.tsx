import Collapse from 'components/Collapse';
import Image from 'components/Image';
import Text from 'components/Text';
import View from 'components/View';
import { useTheme } from 'hooks';
import { BrandsResponseType } from 'models';
import React, { memo } from 'react';
import HTML from 'react-native-render-html';
import { isEmpty } from 'utils/helpers';
import useStyles from '../styles';

interface Props {
    brand: BrandsResponseType;
    pagination: {
        page: number;
        page_count: number;
        page_size: number;
        total_items: number;
    };
}

const Brands = memo(function Brands({ brand, pagination }: Props) {
    //hooks
    const styles = useStyles();
    const { theme } = useTheme();
    //value

    return (
        <View style={styles.view_category_container}>
            <View>
                <View style={styles.view_wrap_parent}>
                    <View style={styles.view_parent_image}>
                        <Image
                            source={{
                                uri: brand?.logo,
                            }}
                            resizeMode="stretch"
                        />
                    </View>
                    <View style={styles.view_parent_info}>
                        <Text size={'body3'} fw="500">
                            {brand?.brand_name || ''}
                        </Text>
                        <Text size={'sub3'} color={theme.colors.grey_[500]}>
                            Tìm thấy {pagination.total_items} sản phẩm
                        </Text>
                    </View>
                </View>
                {!isEmpty(brand?.description) ? (
                    <View style={styles.view_brand_description}>
                        <Collapse initHeight={150}>
                            <HTML
                                source={{
                                    html: !isEmpty(brand?.description)
                                        ? brand.description
                                        : '<p> </p>',
                                }}
                                contentWidth={theme.dimens.width * 0.8}
                                baseStyle={{
                                    color: theme.colors.black_[10],
                                    fontSize: theme.typography.body1,
                                }}
                                ignoredDomTags={['colgroup']}
                            />
                        </Collapse>
                    </View>
                ) : null}
            </View>
        </View>
    );
});

export default Brands;
