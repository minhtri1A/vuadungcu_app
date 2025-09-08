/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import Button from 'components/Button';
import IconButton from 'components/IconButton';
import View from 'components/View';
import { NAVIGATION_TO_SHOP_PRODUCT_SCREEN } from 'const/routes';
import { useNavigation, useTheme } from 'hooks';
import { SellerInfoResponseType } from 'models';
import React, { memo, useState } from 'react';
import { TextInput } from 'react-native';
import Modal from 'react-native-modal';
import useStyles from './../styles';

interface Props {
    isVisibleSearch: boolean;
    handleVisibleSearchModal: () => void;
    seller: SellerInfoResponseType;
}

export default memo(function SearchModal({
    isVisibleSearch,
    handleVisibleSearchModal,
    seller,
}: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles();
    const navigation = useNavigation();
    //state
    const [text, setText] = useState('');

    //handle
    const handleChangeSearchText = (value: string) => {
        setText(value);
    };

    const handleSubmitSearch = () => {
        if (text) {
            handleVisibleSearchModal();
            navigation.navigate(NAVIGATION_TO_SHOP_PRODUCT_SCREEN, {
                keyword: text,
                seller_uuid: seller?.seller_uuid,
            });
        }
    };

    return (
        <Modal
            isVisible={isVisibleSearch}
            onBackdropPress={handleVisibleSearchModal}
            style={{ margin: theme.spacings.small }}
            backdropColor="rgba(192, 192, 192, 1)"
            backdropOpacity={0.9}
            useNativeDriver={true}
        >
            <View
                style={{
                    flex: 1,
                    // backgroundColor:theme.colors.white_[10],
                    top: 0,
                    height: '100%',
                }}
            >
                <View style={styles.view_container_search}>
                    <TextInput
                        placeholder="Nhập nội dung tìm kiếm..."
                        style={styles.input_search}
                        autoFocus
                        onChangeText={handleChangeSearchText}
                        returnKeyType="search"
                        onSubmitEditing={handleSubmitSearch}
                        placeholderTextColor={theme.colors.grey_[500]}
                    />
                    <IconButton
                        type="ionicon"
                        name="search-outline"
                        color={theme.colors.grey_[500]}
                        onPress={handleSubmitSearch}
                    />
                </View>
                <View flexDirect="row" jC="space-between">
                    <View mt="small" w={'49%'}>
                        <Button title={'Đóng'} type="outline" onPress={handleVisibleSearchModal} />
                    </View>
                    <View mt="small" w={'49%'}>
                        <Button
                            title={'Tìm kiếm'}
                            activeOpacity={0.8}
                            onPress={handleSubmitSearch}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
});
