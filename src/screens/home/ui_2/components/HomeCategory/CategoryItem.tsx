import Image from 'components/Image';
import Text from 'components/Text';
import { useNavigate } from 'hooks';
import React, { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import useStyles from './styles';

interface Props {
    categories: any;
    index: any;
}

const CategoryItem = memo(function CategoryItem({ categories }: Props) {
    //hooks
    const styles = useStyles();
    const navigate = useNavigate();
    //value
    const { name, image, uuid } = categories;

    return (
        <TouchableOpacity
            style={styles.btn_topCategoryContainer}
            onPress={navigate.PRODUCT_CATEGORY_ROUTE({ category_uuid: uuid })}
            activeOpacity={1}
        >
            <View style={styles.view_imageCategory}>
                <Image
                    source={{
                        uri: image,
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                    style={{ opacity: 0.9 }}
                />
            </View>
            <Text style={styles.txt_name_category} ellipsizeMode="tail" numberOfLines={1}>
                {name}
            </Text>
        </TouchableOpacity>
    );
});

export default CategoryItem;
