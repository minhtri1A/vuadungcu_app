/* eslint-disable no-useless-escape */
/* eslint-disable react-hooks/exhaustive-deps */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { Icon, SearchBar } from '@rneui/themed';
import IconButton from 'components/IconButton';
import MiniCart from 'components/MiniCart';
import PulseIndicator from 'components/Spinner/PulseIndicator';
import Text from 'components/Text';
import View from 'components/View';
import { NAVIGATION_TO_PRODUCT_CATEGORY_SCREEN, NAVIGATION_TO_PRODUCT_DRAWER } from 'const/routes';
import { useProductSwr, useTheme } from 'hooks';
import { useSpeechToText } from 'hooks/useSpeechToText';
import { replace, trim, uniq } from 'lodash';
import { ProductListItemType } from 'models';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    ListRenderItem,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Vibration,
} from 'react-native';
import { useSWRConfig } from 'swr';
import { isEmpty } from 'utils/helpers';
import ProductSearchItem from './components/ProductSearchItem';
import { ItemAddToCartListType } from 'hooks/swr/cartSwr/useCartSwr';
import BottomSheetAddToCartSuccess from 'screens/productdetail/components/BottomSheetAddToCartSuccess';
import Header from 'components/Header2';

interface Props {
    navigation: StackNavigationProp<any, any>;
}

const SearchScreen = memo(function SearchScreen({ navigation }: Props) {
    //hooks
    const styles = useStyles();
    const { theme } = useTheme();
    const { cache } = useSWRConfig();
    const { isListening, result, startListening, stopListening } = useSpeechToText();

    //state
    const [searchText, setSearchText] = useState('');
    const [keyword, setKeyword] = useState('');
    const [searchHistory, setSearchHistory] = useState<any[]>([]);
    //--check add_to_cart success
    const [statusAdd, setStatusAdd] = useState<string>();
    const [imageAddSuccess, setImageAddSuccess] = useState<string>();
    const [itemsAddSuccess, setItemsAddSuccess] =
        useState<Array<ItemAddToCartListType & { code?: string }>>();
    //swr
    const {
        products,
        pagination: { total_items },
        isValidating,
    } = useProductSwr({ page_size: 5, keyword: keyword }, { revalidateOnMount: false });

    //value
    //ref
    const searchRef = useRef<TextInput>(null);

    //mounted
    useFocusEffect(
        useCallback(() => {
            searchRef.current?.focus();
            setSearchText('');
            const getSearchHistoryLocal = async () => {
                const searchHistoryLocal: any = await AsyncStorage.getItem('@listSearchHistory');
                if (searchHistoryLocal) {
                    setSearchHistory(JSON.parse(searchHistoryLocal));
                }
            };
            getSearchHistoryLocal();
        }, [])
    );

    //effect

    //--get prodcut search
    useEffect(() => {
        const timeout = setTimeout(() => {
            //do tren app khac web khi state thay doi se auto fetch du lieu nen can state trung gian la keyword
            //chu khong can goi mutate
            if (searchText) {
                setKeyword(searchText);
            }
        }, 350);
        return () => {
            clearTimeout(timeout);
        };
    }, [searchText]);

    useEffect(() => {
        if (result) {
            submitSearch(result);
        }
    }, [result]);

    //handle
    //--get text input
    const setSearchText_ = (text: string): any => {
        if (isEmpty(text)) {
            cache.delete(`product?page_size=5&keyword=${searchText}`);
        }
        setSearchText(text);
    };

    //--voice
    const handleToggleVoice = () => {
        if (!isListening) {
            startListening();
            Vibration.vibrate();
        } else {
            stopListening();
        }
    };

    //--set search history and navigate product screen
    const submitSearch = (text: string) => () => {
        let dataSearch = replace(trim(text), /[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        if (dataSearch !== '') {
            const listSearchHistoryStorage = searchHistory;
            listSearchHistoryStorage.unshift(dataSearch);
            AsyncStorage.setItem(
                '@listSearchHistory',
                JSON.stringify(uniq(listSearchHistoryStorage))
            );
            navigation.push(NAVIGATION_TO_PRODUCT_DRAWER, {
                screen: NAVIGATION_TO_PRODUCT_CATEGORY_SCREEN,
                params: { search: dataSearch },
            });
        }
    };

    const removeSearchHistory = () => {
        AsyncStorage.removeItem('@listSearchHistory');
        setSearchHistory([]);
    };

    //--click arrow push text to text input
    const onSetTextFromHistory = (text: string) => () => {
        searchRef.current?.focus();
        setSearchText(text);
    };

    //--add_to_cart data
    const setValueStatusAdd = useCallback((status: any) => {
        setStatusAdd(status);
    }, []);
    const setAddToCartSuccessData = useCallback(
        (image?: string, items?: Array<ItemAddToCartListType & { code?: string }>) => {
            setImageAddSuccess(image);
            setItemsAddSuccess(items);
        },
        []
    );

    //render
    const renderListSearchHistory: ListRenderItem<any> = ({ item, index }) => (
        <View style={styles.viewItemHistory} key={index}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.touchHistory}
                onPress={submitSearch(item)}
            >
                <Text>{item}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchIconArrow} onPress={onSetTextFromHistory(item)}>
                <Icon
                    type="material-community"
                    name={'arrow-top-left'}
                    size={theme.typography.title1}
                />
            </TouchableOpacity>
        </View>
    );
    const renderListProductSearch: ListRenderItem<ProductListItemType> = ({ item, index }) => (
        <ProductSearchItem
            item={item}
            key={index}
            setAddToCartSuccessData={setAddToCartSuccessData}
            setValueStatusAdd={setValueStatusAdd}
        />
    );
    //navigate

    return (
        <View style={styles.containerSearch}>
            <Header
                center={
                    <SearchBar
                        platform={'default'}
                        ref={searchRef}
                        containerStyle={styles.searchbar_container}
                        inputContainerStyle={styles.input_container}
                        inputStyle={styles.input_style}
                        lightTheme={true}
                        onChangeText={setSearchText_}
                        value={searchText}
                        placeholder={
                            isListening
                                ? 'Đang lắng nghe giọng nói...'
                                : 'Tìm kiếm với vua dụng cụ...'
                        }
                        searchIcon={
                            <IconButton
                                type="ionicon"
                                name={'arrow-back'}
                                size={theme.spacings.tiny * 6}
                                color={theme.colors.grey_[500]}
                                onPress={navigation.goBack}
                            />
                        }
                        autoFocus
                        onSubmitEditing={submitSearch(searchText)}
                        returnKeyType="search"
                        placeholderTextColor={
                            isListening ? theme.colors.main['600'] : theme.colors.grey_[500]
                        }
                    />
                }
                right={
                    <View style={styles.view_header_right}>
                        <View position="relative" jC="center">
                            {isListening ? (
                                <PulseIndicator
                                    size={theme.typography.size(15)}
                                    style={styles.waveIndicator}
                                    color={theme.colors.main[100]}
                                />
                            ) : null}
                            <IconButton
                                type="ionicon"
                                name="mic-outline"
                                color={
                                    isListening ? theme.colors.main[400] : theme.colors.grey_[500]
                                }
                                size={theme.typography.title4}
                                onPress={handleToggleVoice}
                            />
                        </View>

                        <MiniCart
                            isFlyToCart
                            statusAdd={statusAdd}
                            imageAddSuccess={imageAddSuccess}
                            iconStyle={{ color: theme.colors.grey_[500] }}
                            size={theme.typography.title4}
                        />
                    </View>
                }
                showGoBack={false}
                iconGoBackColor={theme.colors.black_[10]}
                bgColor={theme.colors.white_[10]}
                contentStyle={{ paddingLeft: 0 }}
            />
            <FlatList
                data={searchText ? products : searchHistory}
                renderItem={searchText ? renderListProductSearch : renderListSearchHistory}
                keyExtractor={(_, index) => `${index}`}
                ListHeaderComponent={
                    <View style={styles.viewTitleSearch}>
                        <View flexDirect="row" aI="center">
                            <Icon
                                type="material-community"
                                name={'text-search'}
                                size={theme.spacings.tiny * 5}
                                color={theme.colors.grey_[500]}
                            />
                            <Text color={theme.colors.grey_[500]}>
                                {searchText ? 'Kết quả tìm kiếm' : 'Lịch sử tìm kiếm'}
                            </Text>
                            {isValidating ? (
                                <ActivityIndicator color={theme.colors.grey_[500]} />
                            ) : null}
                        </View>
                        <IconButton
                            type="ionicon"
                            name={'search-sharp'}
                            size={theme.spacings.tiny * 6}
                            color={theme.colors.grey_[500]}
                            onPress={submitSearch(searchText)}
                        />
                    </View>
                }
                ListFooterComponent={
                    !searchText ? (
                        <TouchableOpacity
                            style={styles.viewClearHistory}
                            onPress={removeSearchHistory}
                            activeOpacity={0.7}
                        >
                            <Text color={theme.colors.grey_[400]}>Xoá lịch sử tìm kiếm</Text>
                        </TouchableOpacity>
                    ) : total_items > 5 ? (
                        <TouchableOpacity
                            style={styles.viewClearHistory}
                            onPress={submitSearch(searchText)}
                            activeOpacity={0.7}
                        >
                            <Text color={theme.colors.grey_[400]}>
                                Xem thêm {total_items - 5} sản phẩm
                            </Text>
                        </TouchableOpacity>
                    ) : null
                }
                contentContainerStyle={{
                    backgroundColor: theme.colors.white_[10],
                }}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
            />
            <BottomSheetAddToCartSuccess
                statusAdd={statusAdd as any}
                itemsAddResult={itemsAddSuccess}
                onClose={() => {
                    setImageAddSuccess(undefined);
                    setItemsAddSuccess(undefined);
                }}
            />
        </View>
    );
});

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        ///
        container_header: {
            paddingHorizontal: 0,
            paddingVertical: 0,
            elevation: 1,
        },
        left_container: {
            // flex: 0,
            display: 'none',
        },
        center_container: {
            flex: 1,
        },
        right_container: {
            flex: 0.2,
            justifyContent: 'center',
            alignItems: 'flex-end',
            backgroundColor: theme.colors.white_[10],
            paddingRight: theme.spacings.medium,
        },

        view_header_right: {
            position: 'relative',
            flexDirection: 'row',
        },

        //search bar
        containerSearch: {
            flex: 1,
            backgroundColor: theme.colors.grey_[200],
            alignItems: 'center',
            marginTop: 0,
            position: 'relative',
        },
        viewSearchStyle: {
            width: theme.dimens.width,
            backgroundColor: theme.colors.white_[10],
        },
        viewTitleSearch: {
            width: theme.dimens.width,
            flexDirection: 'row',
            padding: theme.spacings.small,
            justifyContent: 'space-between',
        },

        searchbar_container: {
            width: '100%',
            // padding: 0,
            borderWidth: 0,
            elevation: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
            padding: 0,
        },
        input_container: {
            backgroundColor: theme.colors.white_[10],
            borderRadius: 0,
            height: theme.dimens.inputHeight,
        },
        input_style: {
            padding: 0,
            fontSize: theme.typography.body2,
            color: theme.colors.grey_[500],
        },
        //voice
        waveIndicator: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            zIndex: -1,
        },
        //history
        viewItemHistory: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey_[200],
            justifyContent: 'space-between',
            paddingLeft: theme.spacings.small,
        },
        touchHistory: {
            flex: 1,
            justifyContent: 'center',
        },
        touchIconArrow: {
            justifyContent: 'center',
            padding: theme.spacings.small,
        },
        viewClearHistory: {
            height: theme.dimens.height * 0.05,
            justifyContent: 'center',
            alignItems: 'center',
        },
        //product
        view_wrap_product: {
            flexDirection: 'row',
            padding: theme.spacings.small,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey_[100],
        },
        view_fly_image: {
            backgroundColor: 'red',
            borderRadius: 50,
            overflow: 'hidden',
        },
    });
};

export default SearchScreen;
