/* eslint-disable radix */
import { useRoute } from '@react-navigation/native';
import { FilterType } from 'navigation/type';
import React, { memo, useRef, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    ListRenderItem,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';
// eslint-disable-next-line no-unused-vars
import AfterInteractions from 'components/AfterInteractions';
import Text from 'components/Text';
import { useCategoriesSWR, useSellerSwr, useTheme } from 'hooks';
/* eslint-disable react-hooks/exhaustive-deps */
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { CheckBox } from '@rneui/themed';
import Button from 'components/Button';
import Collapse from 'components/Collapse';
import View from 'components/View';
import { NEXT_PUBLIC_CURRENCY } from 'const/env';
import useProductFiltersSwr from 'hooks/swr/productSwr/useProductFiltersSwr';
import { FilterItemType } from 'models';
import { Platform } from 'react-native';
import { currencyFormat, isEmpty } from 'utils/helpers';

export const DrawerContentFilter = memo(function DrawerContentFilter({
    navigation,
}: DrawerContentComponentProps) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles();
    const route = useRoute<any>();

    //state
    const [price, setPrice] = useState<{ key: string; label: string; min: string; max: string }>({
        key: '',
        label: '',
        min: '',
        max: '',
    });

    //ref
    const defaultValueRef = useRef<Array<string>>(['0', '0']);
    const [listFilterSelected, setListFilterSelected] = useState<Array<FilterType>>([]);

    //params
    const keyword = route.params?.params?.search; //search
    const category_uuid = route.params?.params?.category_uuid;
    const brand_uuid = route.params?.params?.brand_uuid;
    const seller_code = route.params?.params?.seller_code;
    const { seller } = useSellerSwr('seller_code', seller_code);

    //swr
    const { filters, isValidating } = useProductFiltersSwr({
        category_uuid: keyword ? undefined : category_uuid,
        brand: keyword ? undefined : brand_uuid,
        keyword,
    });

    const checkShowCategories = seller_code !== undefined || brand_uuid !== undefined;

    const { categories } = useCategoriesSWR(
        checkShowCategories ? '0' : '',
        seller_code !== undefined
            ? { seller_uuid: seller?.seller_uuid }
            : brand_uuid !== undefined
            ? { brand_uuid }
            : undefined,
        undefined,
        undefined,
        category_uuid !== undefined
    );

    //value
    //-- check khi nhap gia min > max
    const priceCheckDisable =
        price.min !== '' && price.max !== '' && parseInt(price.min) > parseInt(price.max)
            ? true
            : false;
    //-- check khi user nhap 1 price min va price min > default[max]
    const priceMinCheckDisable =
        price.min !== '' &&
        price.max === '' &&
        parseInt(price.min) > parseInt(defaultValueRef.current[1])
            ? true
            : false;
    //-- check khi user nhap 1 price max va price max < default[min]
    const priceMaxCheckDisable =
        price.max !== '' &&
        price.min === '' &&
        parseInt(price.max) < parseInt(defaultValueRef.current[0])
            ? true
            : false;
    // -- filter check
    const filterCheckDisable =
        priceCheckDisable ||
        // (price.min === '' && price.max === '' && listFilterSelected.length < 1) ||
        priceMinCheckDisable ||
        priceMaxCheckDisable
            ? true
            : false;

    //handle
    //--price filter
    const handleChangePriceInput =
        (key: string, label: string, type: 'min' | 'max') => (value: string) => {
            const value_ = parseInt(value.replace(/\./g, '')) >= 0 ? value.replace(/\./g, '') : '';
            if (type === 'min') setPrice((pre) => ({ ...pre, key, label, min: value_ }));
            if (type === 'max') setPrice((pre) => ({ ...pre, key, label, max: value_ }));
        };

    const handleSetListFilterSelected =
        (attribute_code: string, option_key: string, check: boolean) => () => {
            const paramIndex = listFilterSelected.findIndex(
                (v) => v.attribute_code === attribute_code
            );
            let newListFilterSelected = [...listFilterSelected];
            //xu ly xoa param
            if (check) {
                //neu chi con 1 option trong param thi se xoa luon param nay khoi filter
                //dung splice vi co san index
                if (listFilterSelected[paramIndex]?.options?.length === 1) {
                    newListFilterSelected = [...listFilterSelected];
                    newListFilterSelected.splice(paramIndex, 1);
                    setListFilterSelected(newListFilterSelected);
                    return;
                }
                //neu param co nhieu hon 1 option thi xoa option khoi param
                //dung filter se ngan gon hon tim index
                const newOptions = listFilterSelected[paramIndex]?.options?.filter(
                    (v) => v !== option_key
                );
                newListFilterSelected[paramIndex] = {
                    ...newListFilterSelected[paramIndex],
                    options: newOptions,
                };
                setListFilterSelected(newListFilterSelected);
            } else {
                //xu ly them moi params
                if (paramIndex !== -1) {
                    //neu da ton tai param trong list thi add them option vao param do
                    newListFilterSelected = [...listFilterSelected];
                    newListFilterSelected[paramIndex] = {
                        ...newListFilterSelected[paramIndex],
                        options: [
                            ...(newListFilterSelected[paramIndex]?.options || []),
                            option_key,
                        ],
                    };
                    setListFilterSelected(newListFilterSelected);
                    return;
                }
                //neu chua ton tai param thi them moi
                setListFilterSelected((pre) => [
                    ...pre,
                    {
                        attribute_code: attribute_code,
                        options: [option_key],
                    },
                ]);
            }
        };

    const handleSubmitFilter = () => {
        //price
        if (!filterCheckDisable) {
            //add price to filter selected
            let listFilterSelectedSubmit: Array<FilterType> = [...listFilterSelected];
            //check add price filter
            if (price.min !== '' || price.max !== '') {
                listFilterSelectedSubmit = [
                    ...listFilterSelectedSubmit,
                    {
                        attribute_code: price.key,
                        //check khi nguoi dung chi nhap 1 gia min or max
                        min: price.min || defaultValueRef.current[0],
                        max: price.max || defaultValueRef.current[1],
                    },
                ];
            }
            navigation.navigate(route.params?.screen, {
                filters: listFilterSelectedSubmit,
                category_uuid,
                brand_uuid,
                seller_code,
                search: keyword,
            });
        }
    };

    const handleResetFilters = () => {
        setPrice({ key: '', label: '', min: '', max: '' });
        setListFilterSelected([]);
        navigation.navigate(route.params?.screen, {
            filters: [],
            category_uuid,
            brand_uuid,
            seller_code,
            search: keyword,
        });
    };

    //--helper
    const checkFilterSelected = (attribute_code: string, option_key: string) => {
        const filterFind = listFilterSelected.find((v1) => v1.attribute_code === attribute_code);

        return isEmpty(filterFind)
            ? false
            : filterFind?.options?.some((v3) => v3 === option_key) || false;
    };

    //render
    const renderItemListFilter: ListRenderItem<FilterItemType> = ({ item: v, index: i }) => {
        const checkCollapse = v?.option && v?.option?.length > 4 ? true : false;
        //set default price ref
        if (v.attribute_code === 'price')
            defaultValueRef.current = [v?.min_value || '0', v?.max_value || ''];

        return v.type === 'select' ? (
            <View
                style={{
                    padding: theme.spacings.medium,
                    borderTopWidth: 0.7,
                    borderTopColor: theme.colors.grey_[200],
                }}
                key={i}
            >
                <Text size={'body2'} mb="medium">
                    {v.attribute_label}
                </Text>
                <Collapse
                    initHeight={checkCollapse ? theme.dimens.verticalScale(150) : 'auto'}
                    viewLessHeight={theme.dimens.verticalScale(40)}
                    viewMoreHeight={theme.dimens.verticalScale(30)}
                    linerHeight={theme.dimens.verticalScale(80)}
                    disable={!checkCollapse}
                >
                    {v.option?.map((v2, i2) => {
                        const optionChecked = checkFilterSelected(v.attribute_code, v2.option_key);
                        return (
                            <TouchableOpacity
                                style={styles.touch_filter_item}
                                key={i2}
                                activeOpacity={0.9}
                                onPress={handleSetListFilterSelected(
                                    v.attribute_code,
                                    v2.option_key,
                                    optionChecked
                                )}
                            >
                                <CheckBox
                                    checked={optionChecked}
                                    containerStyle={styles.container_checkbox}
                                    size={theme.typography.title4}
                                    iconType={'ionicon'}
                                    checkedIcon="checkbox"
                                    uncheckedIcon="square-outline"
                                    uncheckedColor={theme.colors.grey_[500]}
                                    checkedColor={theme.colors.main['600']}
                                    onPress={handleSetListFilterSelected(
                                        v.attribute_code,
                                        v2.option_key,
                                        optionChecked
                                    )}
                                />
                                <Text color={theme.colors.grey_[500]}>{v2.option_label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </Collapse>
            </View>
        ) : v.attribute_code === 'price' ? (
            <View
                style={{
                    padding: theme.spacings.medium,
                    borderTopWidth: 0.7,
                    borderTopColor: theme.colors.grey_[200],
                }}
                key={i}
            >
                <Text size={'body2'}>
                    {v.attribute_label}({NEXT_PUBLIC_CURRENCY})
                </Text>
                <View style={styles.view_input_price}>
                    <TextInput
                        value={price.min !== '' ? `${currencyFormat(price.min, false)}` : ''}
                        style={styles.input_price}
                        onChangeText={handleChangePriceInput(
                            v.attribute_code,
                            v.attribute_label,
                            'min'
                        )}
                        placeholder={`Giá từ ${currencyFormat(v.min_value)} `}
                        placeholderTextColor={theme.colors.grey_[400]}
                    />
                    <Text color={theme.colors.grey_[400]}>-</Text>
                    <TextInput
                        value={price.max !== '' ? `${currencyFormat(price.max, false)}` : ''}
                        style={styles.input_price}
                        onChangeText={handleChangePriceInput(
                            v.attribute_code,
                            v.attribute_label,
                            'max'
                        )}
                        placeholder={`Đến ${currencyFormat(v.max_value)} `}
                        placeholderTextColor={theme.colors.grey_[400]}
                    />
                </View>
                {/* price error message  */}
                {priceCheckDisable ? (
                    <Text color="red" ph="medium" size="sub2">
                        Giá tối thiểu không được thấp hơn giá tối đa!
                    </Text>
                ) : priceMinCheckDisable ? (
                    <Text color="red" ph="medium" size="sub2">
                        Giá tối thiểu không được cao hơn{' '}
                        {currencyFormat(defaultValueRef.current[1])}.
                    </Text>
                ) : priceMaxCheckDisable ? (
                    <Text color="red" ph="medium" size="sub2">
                        Giá tối đa không được thấp hơn {currencyFormat(defaultValueRef.current[0])}!
                    </Text>
                ) : null}
            </View>
        ) : null;
    };

    if (isValidating) {
        return <></>;
    }

    return (
        <View style={styles.view_drawer_container}>
            <Text style={styles.txt_title_filter}>Bộ lọc tìm kiếm</Text>
            <AfterInteractions>
                <View flex={1}>
                    <FlatList
                        data={[
                            ...(checkShowCategories &&
                            categories &&
                            categories?.children?.length > 0
                                ? [
                                      {
                                          attribute_code: 'category',
                                          attribute_label: 'Danh mục',
                                          option: categories?.children.map((v) => ({
                                              option_key: v.uuid,
                                              option_label: v.name,
                                          })),
                                          type: 'select' as any,
                                      },
                                  ]
                                : []),
                            {
                                attribute_code: 'service',
                                attribute_label: 'Dịch vụ và khuyến mãi',
                                option: [
                                    {
                                        option_key: 'freeship',
                                        option_label: 'Miến phí vận chuyển',
                                    },
                                ],
                                type: 'select',
                            },
                            ...filters,
                        ]}
                        keyExtractor={(v) => v.attribute_code}
                        renderItem={renderItemListFilter}
                    />
                </View>
                {/* button */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.key_view}
                >
                    <View flex={1} flexDirect="row" jC="space-evenly" aI="stretch" mb="tiny">
                        <Button
                            title="Thiết lập lại"
                            minWidth="47%"
                            type="outline"
                            color={theme.colors.main['600']}
                            onPress={handleResetFilters}
                        />
                        <Button
                            title={'Áp dụng'}
                            minWidth="47%"
                            disabled={filterCheckDisable}
                            onPress={handleSubmitFilter}
                        />
                    </View>
                </KeyboardAvoidingView>
            </AfterInteractions>
        </View>
    );
});

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        view_drawer_container: {
            flex: 1,
        },
        /* ------- list filter ------- */
        txt_title_filter: {
            textAlign: 'center',
            fontWeight: 'bold',
            color: theme.colors.white_[10],
            fontSize: theme.typography.body3,
            padding: theme.spacings.small,
            backgroundColor: theme.colors.main['500'],
        },

        /* ----- drawer filter ----- */
        view_input_price: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: theme.spacings.medium,
            alignItems: 'center',
            paddingHorizontal: theme.spacings.small,
        },
        input_price: {
            borderWidth: 0.7,
            borderColor: theme.colors.grey_[400],
            width: '47%',
            // paddingVertical: theme.spacings.small,
            paddingVertical: 0,
            height: theme.dimens.inputHeight,
            // lineHeight: 0,
            borderRadius: 5,
            textAlign: 'center',
            color: theme.colors.grey_[500],
            fontSize: theme.typography.body1,
        },
        container_checkbox: {
            padding: 0,
            margin: 0,
        },
        touch_filter_item: {
            flexDirection: 'row',
            alignItems: 'center',
            height: theme.dimens.verticalScale(30),
        },
        key_view: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            backgroundColor: theme.colors.white_[10],
            paddingTop: theme.spacings.medium,
            borderTopWidth: 1,
            borderTopColor: theme.colors.grey_[200],
        },
    });
};
