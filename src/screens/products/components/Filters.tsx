import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Icon } from '@rneui/themed';
import IconButton from 'components/IconButton';
import Text from 'components/Text';
import Touch from 'components/Touch';
import { SORT_CONFIGS } from 'const/app';
import { useTheme } from 'hooks';
import React, { memo } from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import useStyles from '../styles';

interface Props {
    route: any;
    currentSort: string | undefined;
    setSortState: (sortValue: string) => void;
    navigationDrawer: DrawerNavigationProp<any, any>;
    checkFilter: boolean;
}

const Filters = memo(function Filters({
    currentSort,
    setSortState,
    navigationDrawer,
    checkFilter,
}: Props) {
    //hooks
    const styles = useStyles();
    const {
        theme: { colors, typography },
    } = useTheme();
    //state
    //value
    const defaultSort = SORT_CONFIGS.default.sort;
    const newestSort = SORT_CONFIGS.created_desc.sort;
    const priceAsc = SORT_CONFIGS.price_asc.sort;
    const priceDesc = SORT_CONFIGS.price_desc.sort;

    const handleChangeSort = (sortValue: string) => () => {
        setSortState(sortValue);
    };

    return (
        <View style={styles.view_wrap_filter}>
            <IconButton
                type="material-community"
                name={checkFilter ? 'filter-check' : 'filter'}
                size={typography.size(25)}
                color={checkFilter ? colors.main['600'] : colors.grey_[500]}
                onPress={() => {
                    navigationDrawer.openDrawer();
                }}
                style={{ flex: 1 }}
            />
            <Text color={colors.grey_[300]}>|</Text>

            <Touch flex={1} p={'medium'} onPress={handleChangeSort(defaultSort)}>
                <Text
                    color={currentSort === defaultSort ? colors.main['600'] : colors.grey_[600]}
                    size={'body1'}
                    ta="center"
                >
                    Phổ biến
                </Text>
            </Touch>
            <Text color={colors.grey_[300]}>|</Text>
            <Touch flex={1} p={'medium'} onPress={handleChangeSort(newestSort)}>
                <Text
                    color={currentSort === newestSort ? colors.main['600'] : colors.grey_[600]}
                    size={'body1'}
                    ta="center"
                >
                    Mới nhất
                </Text>
            </Touch>
            <Text color={colors.grey_[300]}>|</Text>
            <Touch
                style={styles.btn_sort_price}
                onPress={handleChangeSort(currentSort === priceAsc ? priceDesc : priceAsc)}
                activeOpacity={0.9}
            >
                <Text color={colors.grey_[600]} size={'body1'}>
                    Giá
                </Text>
                <View style={styles.view_icon}>
                    <Icon
                        type="ionicon"
                        name="chevron-up-outline"
                        size={typography.sub2}
                        color={currentSort === priceAsc ? colors.main['600'] : colors.grey_[600]}
                    />
                    <Icon
                        type="ionicon"
                        name="chevron-down-outline"
                        size={typography.sub2}
                        color={currentSort === priceDesc ? colors.main['600'] : colors.grey_[600]}
                    />
                </View>
            </Touch>
        </View>
    );
});

export default Filters;
