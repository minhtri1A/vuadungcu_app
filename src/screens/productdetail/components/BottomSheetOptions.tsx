/* eslint-disable react-hooks/exhaustive-deps */
import { CheckBox, Icon } from '@rneui/themed';
import BottomSheet from 'components/BottomSheet';
import Button from 'components/Button';
import ButtonChangeQty from 'components/ButtonChangeQty';
import Image from 'components/Image';
import Text from 'components/Text';
import View from 'components/View';
import { useTheme } from 'hooks';
import { ItemAddToCartListType } from 'hooks/swr/cartSwr/useCartSwr';
import { delay, isEqual, uniqWith } from 'lodash';
import { ProductDetailResponseType } from 'models';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { currencyFormat, isEmpty } from 'utils/helpers';
import showMessageApp from 'utils/showMessageApp';
import { sendSentryError } from 'utils/storeHelpers';

interface Props {
    action?: 'add_to_cart' | 'buy_now' | 'select';
    //thuoc tinh san pham cha
    productItem: {
        image: string;
        name: string;
        price: string | number;
    };
    attribute?: ProductDetailResponseType['detail-dynamic']['attribute_config'];
    children?: ProductDetailResponseType['detail-dynamic']['children'];

    // id product khi nhan vao san pham con
    product_select?: string;
    //cac xu ly khi nhan vao san pham dua vao btn type
    onClose: () => void;
    onSelectOptionSuccess: (
        action: 'add_to_cart' | 'buy_now' | 'select',
        data: DataSuccessType
    ) => void;
}

type ChildrenType = NonNullable<ProductDetailResponseType['detail-dynamic']['children']>[number];
type AttributeType = NonNullable<
    ProductDetailResponseType['detail-dynamic']['attribute_config']
>[number];

export type QuickItemsType = Array<{
    isChecked: boolean;
    optionLabel: string;
    item: ChildrenType;
    qty: number; // so luong add
}>;

export type DataSuccessType = {
    // buy now - select
    psu?: string;
    // add
    items?: Array<ItemAddToCartListType>;
    // select
    index?: number;
    optionLabelSelected?: string;
};

const BottomSheetOptions = memo(function BottomSheetOptions({
    action,
    attribute,
    children = [],
    productItem,
    product_select,
    onClose,
    onSelectOptionSuccess,
}: Props) {
    //hook
    const {
        theme: { colors, typography, dimens },
    } = useTheme();
    const styles = useStyles();

    //state
    //--danh sach option da chon
    const [optionSelected, setOptionSelected] = useState<
        Array<{
            label: string;
            attribute_code: string;
            option_label: string;
            option_uuid: string;
            available_options: Array<{ attribute_code: string; option_uuid: string }>;
        }>
    >([]);

    //--cac option giao nhau giua cac option selected
    //--dua vao day de biet option nao se bi disable
    const [optionDuplicate, setOptionDuplicate] = useState<
        Array<{ attribute_code: string; option_uuid: string }>
    >([]);

    //--index children product da chon
    const [indexProductOptionSelected, setIndexProductOptionSelected] = useState<
        number | undefined
    >();
    //--qty add single
    const [qtyAddSingle, setQtyAddSingle] = useState(1);

    //--multiple checked quick item
    const [quickItems, setQuickItems] = useState<QuickItemsType>([]);
    const quickItemsChecked = useMemo(() => quickItems.filter((v) => v.isChecked), [quickItems]);

    //value
    const { image, name, price } = productItem || {};

    //value check

    const disableCheck =
        (indexProductOptionSelected === undefined ||
            children[indexProductOptionSelected]?.qty < 1) &&
        quickItemsChecked.length < 1;

    //--- tạo option map de get label hien thi toi uu hon
    const attributeOptionMapRef = useRef(new Map<string, AttributeType>());
    const attributeOptionMap = attributeOptionMapRef.current;

    const attributeLabel = useMemo(() => {
        attributeOptionMap.clear();
        attribute?.forEach((attr) => {
            attributeOptionMap.set(attr.attribute_code, attr);
        });
        return attribute?.map((v) => v.label).join(' + ');
    }, [attribute]);

    //effect
    //--xu ly san pham ban dau(click vao san pham con trong gio hang,...)
    useEffect(() => {
        if (product_select && children && action === 'select') {
            const indexProductSelectInit = children.findIndex(
                (value) => value.product_uuid === product_select
            );
            //set all option product select init to optionSelected
            if (indexProductSelectInit !== -1) {
                let optionLabelSelected = '';
                children[indexProductSelectInit].option.forEach((value) => {
                    //get label va option label vi mac dinh option cua product khong co
                    attribute?.forEach((v2) => {
                        if (value.attribute_code === v2.attribute_code) {
                            //get value option
                            v2.option.forEach((v3) => {
                                if (v3.option_uuid === value.option_uuid) {
                                    //set option to optionSelected
                                    changeOptionSelectedState(
                                        v2.label,
                                        v2.attribute_code,
                                        v3.option_label,
                                        v3.option_uuid
                                    )();
                                    optionLabelSelected = `${optionLabelSelected}${
                                        optionLabelSelected ? '-' : ''
                                    }${v3.option_label}`;
                                }
                            });
                        }
                    });
                });
                //set title for option button in detail top
                if (action === 'select') {
                    onSelectOptionSuccess(action, {
                        index: indexProductSelectInit,
                        optionLabelSelected,
                    });
                }
            }
        }
    }, [product_select]);

    //--check action select - hide quick item
    useEffect(() => {
        if (action === 'select') {
            resetState();
        }
    }, [action]);

    //--Set quick items(add_to_cart and buy_now)
    useEffect(() => {
        if (children?.length > 0 && action && action !== 'select') {
            const itemsMap =
                // chon quick item dua tren item selected
                optionSelected.length > 0
                    ? children
                          .filter((v) => {
                              return optionSelected.every((v2) => {
                                  return v.option.some(
                                      (v3) =>
                                          v3.attribute_code === v2.attribute_code &&
                                          v3.option_uuid === v2.option_uuid
                                  );
                              });
                          })
                          .map((v) => {
                              const optionLabel = v.option
                                  .map((v2) => {
                                      const attributeMap = attributeOptionMap.get(
                                          v2.attribute_code
                                      );
                                      const option = attributeMap?.option.find(
                                          (v4) => v4.option_uuid === v2.option_uuid
                                      );
                                      return option?.option_label;
                                  })
                                  .join(' + ');
                              return {
                                  isChecked: false,
                                  optionLabel,
                                  item: v,
                                  qty: v?.qty > 0 ? 1 : 0,
                              };
                          })
                    : children.map((v) => {
                          const optionLabel = v.option
                              .map((v2) => {
                                  const attributeMap = attributeOptionMap.get(v2.attribute_code);
                                  const option = attributeMap?.option.find(
                                      (v4) => v4.option_uuid === v2.option_uuid
                                  );
                                  return option?.option_label;
                              })
                              .join(' + ');
                          return {
                              isChecked: false,
                              optionLabel,
                              item: v,
                              qty: v?.qty > 0 ? 1 : 0,
                          };
                      });
            setQuickItems(sortChildren(itemsMap, 'asc'));
        }
    }, [children, optionSelected, action]);

    //--find index selected with option selected
    useEffect(() => {
        if (optionSelected?.length === attribute?.length) {
            //tim kiem index product option dua vao option da chon
            const index = children?.findIndex((value) =>
                value.option.every((v2) =>
                    optionSelected.some(
                        (v3) =>
                            v3.attribute_code === v2.attribute_code &&
                            v3.option_uuid === v2.option_uuid
                    )
                )
            );
            if (index !== -1) {
                setIndexProductOptionSelected(index);
            }
        } else {
            //reset product option selected
            setIndexProductOptionSelected(undefined);
        }
    }, [optionSelected]);

    //--tim cac option available giao nhau giua cac selected option
    useEffect(() => {
        if (optionSelected) {
            try {
                //vi availableOptions la nhieu mang con vi vay nen gop lai thanh 1 mang
                let availableOptionsJoin: Array<{
                    attribute_code: string;
                    option_uuid: string;
                }> = [];
                optionSelected.forEach((value) => {
                    availableOptionsJoin = [...availableOptionsJoin, ...value.available_options];
                });
                //neu chon tu 2 option tro len moi can tinh giao nhau(duplicate)
                //con chon 1 option se dua option do vao optionDuplicate luon
                if (optionSelected.length === 1) {
                    setOptionDuplicate(availableOptionsJoin);
                } else {
                    //fiter option duplicate
                    const lookup = availableOptionsJoin.reduce((a: any, e) => {
                        const key = e.attribute_code + e.option_uuid;
                        a[key] = ++a[key] || 0;
                        return a;
                    }, {});
                    // === optionSelected.length -1 vi neu chon 3 option thi option value phai giao nhau 3 lan
                    const optionDuplicateFilter = availableOptionsJoin.filter(
                        (e) =>
                            lookup[e.attribute_code + e.option_uuid] === optionSelected.length - 1
                    );
                    setOptionDuplicate(uniqWith(optionDuplicateFilter, isEqual));
                }
            } catch (error) {
                sendSentryError(error, 'useEffect - available duplicate ');
                showMessageApp('Đã xảy ra lỗi xử lý *1, xin vui lòng thử lại', {
                    valueType: 'message',
                });
            }
        }
    }, [optionSelected]);

    //handle

    const handleVisibleSheet = () => {
        onClose();
    };

    const resetState = () => {
        delay(() => {
            setOptionSelected([]);
            setOptionDuplicate([]);
            setQuickItems([]);
            setIndexProductOptionSelected(undefined);
            setQtyAddSingle(1);
        }, 100);
    };

    //-- lay cac option kha dung voi option da chon
    const getAvailableOptions = (attribute_code: string, option_uuid: string) => {
        try {
            if (!attribute) {
                return;
            }
            let optionsAvailable: Array<{
                attribute_code: string;
                option_uuid: string;
            }> = [];
            children?.forEach((value) => {
                const indexFind = value.option.findIndex(
                    (v2) => v2.attribute_code === attribute_code && v2.option_uuid === option_uuid
                );
                if (indexFind !== -1) {
                    optionsAvailable = [...optionsAvailable, ...value.option];
                }
            });
            // lay tat ca cac value(option_uuid) thuoc option hien tai(attribute_code) add vao optionsAvailable
            const indexOptionSelected = attribute?.findIndex(
                (value) => value.attribute_code === attribute_code
            );
            attribute[indexOptionSelected]?.option.forEach((value) => {
                optionsAvailable = [
                    ...optionsAvailable,
                    { attribute_code, option_uuid: value.option_uuid },
                ];
            });
            // uniqBy(optionsAvailable,'attribute_code', 'option_uuid')
            return uniqWith(optionsAvailable, isEqual);
        } catch (error) {
            showMessageApp('Đã xảy ra lỗi xử lý *2, xin vui lòng thử lại', {
                valueType: 'message',
            });
            sendSentryError(error, 'getAvailableOptions');
        }
    };

    //--set option selected
    const changeOptionSelectedState =
        (label: string, attribute_code: string, option_label: string, option_uuid: string) =>
        () => {
            setQtyAddSingle(1);
            //(Remove) Neu attribute_code va option gui len ton tai trong state thi se xoa select option hien tai
            const indexAttributeOption = optionSelected.findIndex(
                (value) =>
                    value.attribute_code === attribute_code && value.option_uuid === option_uuid
            );
            if (indexAttributeOption !== -1) {
                setOptionSelected((pre) => {
                    pre.splice(indexAttributeOption, 1);
                    return [...pre];
                });
                return;
            }
            //(Replace) neu attribute gui len ton tai trong state thi se thay the option select hien tai
            const indexAttribute = optionSelected.findIndex(
                (value) => value.attribute_code === attribute_code
            );
            if (indexAttribute !== -1) {
                const available_options = getAvailableOptions(attribute_code, option_uuid);
                available_options &&
                    setOptionSelected((pre) => {
                        pre.splice(indexAttribute, 1);
                        return [
                            ...pre,
                            { label, attribute_code, option_label, option_uuid, available_options },
                        ];
                    });
                return;
            }
            //(Add) neu chua ton tai attribute va option trong state thi them moi
            const available_options = getAvailableOptions(attribute_code, option_uuid);
            available_options &&
                setOptionSelected((pre) => [
                    ...pre,
                    { label, attribute_code, option_label, option_uuid, available_options },
                ]);
        };

    //-- Multiple select option
    const handleCheckedQuickItem = (index: number) => () => {
        setQuickItems((pre) => {
            const clonePre = [...pre];
            clonePre[index] = {
                ...clonePre[index],
                isChecked: !clonePre[index].isChecked,
            };
            return clonePre;
        });
    };

    const handleChangeQtyQuickItem = (index: number) => (qty: number) => {
        setQuickItems((pre) => {
            const clonePre = [...pre];
            clonePre[index].qty = qty;
            return clonePre;
        });
    };

    const submitOptionSelected = () => {
        try {
            onClose();
            // single
            if (indexProductOptionSelected !== undefined) {
                if (!action) {
                    return;
                }

                if (action === 'select') {
                    const optionLabelSelected = optionSelected
                        .map((value) => value.option_label)
                        .join('-');
                    onSelectOptionSuccess(action, {
                        psu: children[indexProductOptionSelected].product_seller_uuid,
                        index: indexProductOptionSelected,
                        optionLabelSelected: optionLabelSelected,
                    });
                    return;
                }

                // add_to_cart or buy_now
                onSelectOptionSuccess(action, {
                    items: [
                        {
                            product_uuid: children[indexProductOptionSelected].product_uuid,
                            product_seller_uuid:
                                children[indexProductOptionSelected].product_seller_uuid,
                            name: children[indexProductOptionSelected].name,
                            image: children[indexProductOptionSelected]?.images[0]?.url,
                            price: children[indexProductOptionSelected].price,
                            qty: qtyAddSingle,
                        },
                    ],
                });
                resetState();
            }

            //add or buy now list
            if (quickItemsChecked.length > 0) {
                if (!action || action === 'select') {
                    return;
                }
                const data = quickItemsChecked.map((v) => ({
                    product_seller_uuid: v?.item?.product_seller_uuid,
                    name: v.item.name,
                    product_uuid: v?.item?.product_uuid,
                    qty: v?.qty,
                    price: v.item?.price,
                    image: v.item?.images[0]?.url,
                }));
                onSelectOptionSuccess(action, {
                    items: data,
                });
                resetState();
            }
        } catch (error) {
            showMessageApp('Đã xảy ra lỗi khi chọn sản phẩm. Xin vui lòng thử lại!', {
                valueType: 'message',
            });
            sendSentryError(error, 'submitOptionSelected');
        }
    };

    //render
    const renderProductOptions = () =>
        attribute?.map((v, index) => (
            <View mt="medium" mb="medium" key={index}>
                <Text size={'body2'}>{v.label}</Text>
                <View style={styles.view_option_list}>
                    {/* option text */}
                    {v.option.map((v2, i2) => {
                        //check index selected
                        const indexFind = optionSelected.findIndex(
                            (v3) =>
                                v3.attribute_code === v.attribute_code &&
                                v3.option_uuid === v2.option_uuid
                        );
                        //kiem tra option value nay co duoc phep chon khong, khi chon nhieu option(attribute_code)
                        const visibleCheck =
                            optionDuplicate.length < 1
                                ? true
                                : optionDuplicate.some(
                                      (v3) =>
                                          v.attribute_code === v3.attribute_code &&
                                          v2.option_uuid === v3.option_uuid
                                  );
                        //fetch image neu is_image cua attribute nay la true
                        const image_ = v.is_color
                            ? children.find((v4) =>
                                  v4.option.some((v5) => v5.option_uuid === v2.option_uuid)
                              )?.images
                            : undefined;
                        return (
                            <TouchableOpacity
                                style={[
                                    styles.view_wrap_item_text,
                                    indexFind !== -1 && styles.view_wrap_item_active,
                                    !visibleCheck && styles.view_wrap_item_disable,
                                ]}
                                key={i2}
                                onPress={changeOptionSelectedState(
                                    v.label,
                                    v.attribute_code,
                                    v2.option_label,
                                    v2.option_uuid
                                )}
                                activeOpacity={0.7}
                                disabled={!visibleCheck}
                            >
                                {image_ && image_?.length > 0 && (
                                    <View h={'80%'} ratio={1} mr="small">
                                        <Image
                                            source={{ uri: image_[0].url }}
                                            resizeMode="contain"
                                            radius={1}
                                        />
                                    </View>
                                )}
                                <Text
                                    ta="center"
                                    size={'body1'}
                                    color={visibleCheck ? colors.black_[10] : colors.grey_[400]}
                                    mr={image && image?.length > 0 ? 'small' : 'tiny'}
                                >
                                    {v2.option_label}
                                </Text>

                                <View />
                                {indexFind !== -1 ? (
                                    <>
                                        <View style={styles.view_triangle_check} />
                                        <View style={styles.view_icon_check}>
                                            <Icon
                                                type="ionicon"
                                                name="checkmark-sharp"
                                                color={colors.white_[10]}
                                                size={typography.size(15)}
                                            />
                                        </View>
                                    </>
                                ) : null}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        ));

    const renderProductQuickOptions = () =>
        quickItems.map((v, i) => {
            const optionLabel = v.item.option
                .map((v2) => {
                    const attributeMap = attributeOptionMap.get(v2.attribute_code);
                    const option = attributeMap?.option.find(
                        (v4) => v4.option_uuid === v2.option_uuid
                    );
                    return option?.option_label;
                })
                .join(' + ');
            return (
                <View
                    key={i}
                    style={styles.view_quick_item}
                    bg={v.item.qty < 1 ? colors.grey_[50] : undefined}
                >
                    <View flexDirect="row" aI="center">
                        <CheckBox
                            checked={v.isChecked}
                            onPress={handleCheckedQuickItem(i)}
                            iconType={'ionicon'}
                            checkedIcon="checkbox"
                            uncheckedIcon="square-outline"
                            checkedColor={colors.main['600']}
                            containerStyle={styles.checkbox_container}
                            disabled={v.item.qty < 1}
                        />
                        <View>
                            <Text color={colors.grey_[700]} size={'sub3'}>
                                {optionLabel}
                            </Text>
                            <Text color={colors.red[500]} size={'sub3'}>
                                {currencyFormat(v.item.special_price)}
                            </Text>
                        </View>
                    </View>

                    <View w={dimens.scale(120)} h={dimens.verticalScale(25)} jC="center">
                        {v.item.qty < 1 ? (
                            <Text size={'sub2'} ta="right" color={colors.red[500]}>
                                Hết hàng
                            </Text>
                        ) : (
                            <ButtonChangeQty
                                value={v.qty}
                                onSuccess={(qty) => handleChangeQtyQuickItem(i)(qty)}
                                showBorder={false}
                                maxValue={v.item?.qty || 1}
                            />
                        )}
                    </View>
                </View>
            );
        });

    //helper
    const sortChildren = (array: QuickItemsType, type: 'asc' | 'desc') => {
        return [...array].sort((a, b) => {
            const vA = a.optionLabel;
            const vB = b.optionLabel;

            const strA = String(vA);
            const strB = String(vB);
            return type === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
        });
    };

    return (
        <BottomSheet
            isVisible={action !== undefined}
            radius
            onBackdropPress={handleVisibleSheet}
            triggerOnClose={handleVisibleSheet}
            scrollViewProps={{
                scrollEnabled: false,
                bounces: false,
                alwaysBounceVertical: false,
                showsVerticalScrollIndicator: false,
            }}
        >
            <Text ta="center" color={colors.black_[10]} fw="bold" size={'body2'}>
                Chọn thuộc tính({optionSelected.length}/{attribute?.length || 0})
            </Text>
            {/* product info */}
            <View style={styles.view_wrap_option_top}>
                <View w={dimens.scale(100)} ratio={1}>
                    <Image
                        source={{
                            uri:
                                children && indexProductOptionSelected !== undefined
                                    ? children[indexProductOptionSelected]?.images[0].url
                                    : image,
                        }}
                        resizeMode="contain"
                        radius={5}
                    />
                </View>
                <View flex={1} ml="small">
                    <Text numberOfLines={2} fw="bold">
                        {children && indexProductOptionSelected !== undefined
                            ? children[indexProductOptionSelected]?.name
                            : name}
                    </Text>
                    <Text color="red" size={'body2'}>
                        {children && indexProductOptionSelected !== undefined
                            ? currencyFormat(children[indexProductOptionSelected]?.special_price)
                            : price}
                    </Text>
                    {children && indexProductOptionSelected !== undefined ? (
                        <View flexDirect="row">
                            <Text color={colors.grey_[500]}>
                                Kho:{children[indexProductOptionSelected]?.qty}{' '}
                            </Text>
                            <Text color={colors.grey_[500]}>
                                ({optionSelected.map((value) => value.option_label).join('-')})
                            </Text>
                        </View>
                    ) : null}
                </View>
            </View>
            {/* option list */}
            <ScrollView style={styles.scroll_style}>
                {/* option */}
                {renderProductOptions()}

                {/* quick option */}
                {quickItems.length > 1 && (
                    <View bTW={1} bTC={colors.grey_[100]}>
                        <View flexDirect="row" pv="medium">
                            <Text fw="bold">Chọn nhiều</Text>
                            <Text color={colors.grey_[500]}>({attributeLabel})</Text>
                        </View>
                        {renderProductQuickOptions()}
                    </View>
                )}
            </ScrollView>

            {/* button */}
            <View style={styles.view_button}>
                {quickItems.length <= 1 && !isEmpty(indexProductOptionSelected, false) ? (
                    <View mb={'medium'} flexDirect="row" aI="center" jC="space-between">
                        <Text fw="bold">Chọn số lượng</Text>
                        <View h={31} w={120}>
                            <ButtonChangeQty
                                value={qtyAddSingle}
                                onSuccess={(v) => {
                                    setQtyAddSingle(v);
                                }}
                                maxValue={children[indexProductOptionSelected as any]?.qty || 1}
                            />
                        </View>
                    </View>
                ) : (
                    <></>
                )}

                <Button
                    title={`${
                        action === 'add_to_cart'
                            ? 'Thêm vào giỏ hàng'
                            : action === 'buy_now'
                            ? 'Mua ngay'
                            : 'Chọn'
                    }${quickItemsChecked.length > 0 ? `(${quickItemsChecked.length})` : ''}`}
                    onPress={submitOptionSelected}
                    disabled={disableCheck}
                />
            </View>
        </BottomSheet>
    );
});

const useStyles = () => {
    const {
        theme: { colors, spacings, dimens, typography },
    } = useTheme();
    return StyleSheet.create({
        /* ------- section top ------- */

        view_wrap_option_top: {
            flexDirection: 'row',
            paddingVertical: spacings.small,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: colors.grey_[100],
            marginTop: spacings.medium,
        },
        view_option_list: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingTop: spacings.tiny,
        },
        view_wrap_item_image: {
            flexDirection: 'row',
            position: 'relative',
            borderWidth: 1,
            borderColor: colors.grey_[300],
            backgroundColor: colors.grey_[100],
            minWidth: '48%',
            borderRadius: 5,
            overflow: 'hidden',
            marginTop: spacings.small,
            alignItems: 'center',
        },
        view_wrap_item_text: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            borderWidth: 0.5,
            borderColor: colors.grey_[400],
            marginRight: spacings.medium,
            borderRadius: 4,
            overflow: 'hidden',
            marginTop: spacings.medium,
            paddingLeft: spacings.tiny,
            minWidth: dimens.scale(60),
            height: dimens.verticalScale(33),
        },
        view_wrap_item_active: {
            flexDirection: 'row',
            borderColor: colors.main['600'],
            backgroundColor: colors.main['50'],
        },
        view_wrap_item_disable: {
            flexDirection: 'row',
            borderColor: colors.grey_['300'],
            backgroundColor: colors.grey_['100'],
        },
        view_triangle_check: {
            position: 'absolute',
            width: 0,
            height: 0,
            backgroundColor: 'transparent',
            borderStyle: 'solid',
            borderTopWidth: typography.size(12),
            borderRightWidth: typography.size(12),
            borderBottomWidth: typography.size(12),
            borderLeftWidth: typography.size(12),
            borderTopColor: 'transparent',
            borderRightColor: colors.main['600'],
            borderBottomColor: colors.main['600'],
            borderLeftColor: 'transparent',
            right: 0,
            bottom: 0,
        },
        view_icon_check: {
            position: 'absolute',
            zIndex: 999,
            bottom: 0,
            right: 0,
        },
        scroll_style: {
            height: dimens.height * 0.5,
        },
        // quick item
        view_quick_item: {
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: colors.grey_[200],
            padding: spacings.small,
            marginBottom: spacings.medium,
            borderRadius: 5,
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        checkbox_container: {
            padding: 0,
        },
        view_button: {
            borderTopWidth: 1,
            borderTopColor: colors.grey_[200],
            paddingTop: spacings.medium,
        },
    });
};

export default BottomSheetOptions;
