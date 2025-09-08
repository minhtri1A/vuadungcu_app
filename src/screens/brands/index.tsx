/* eslint-disable react-hooks/exhaustive-deps */
import AfterInteractions from 'components/AfterInteractions';
import Header from 'components/Header';
import Image from 'components/Image';
import MiniCart from 'components/MiniCart';
import Text from 'components/Text';
import View from 'components/View';
import { useNavigate, useTheme } from 'hooks';
import useBrandsSwr from 'hooks/swr/brandSwr/useBrandsSwr';
import { uniq } from 'lodash';
import React, { memo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ripple from 'react-native-material-ripple';

const BrandsScreen = memo(function BrandsScreen() {
    //hook
    const styles = useStyles();
    const { theme } = useTheme();
    const navigate = useNavigate();
    //state
    const [brandAlphaSelected, setBrandAlphaSelected] = useState<string>('All');
    //swr
    const { brands = [] } = useBrandsSwr();

    //value
    const alphaList = uniq(
        brands
            .map((value) => value.brand_name.charAt(0).toUpperCase())
            .sort((a, b) => {
                const isANumber = /\d/.test(a);
                const isBNumber = /\d/.test(b);
                if (isANumber && !isBNumber) {
                    return 1;
                } else if (!isANumber && isBNumber) {
                    return -1;
                }
                return a.localeCompare(b);
            })
    );
    const brandsFilter = brands.filter((value) =>
        brandAlphaSelected === 'All'
            ? true
            : value.brand_name.toUpperCase().startsWith(brandAlphaSelected, 0)
    );

    //handle
    const setStateBrandAlphaSelected = (alpha: string) => () => {
        setBrandAlphaSelected(alpha);
    };

    //render
    const renderLeftListItem = () =>
        ['All', ...alphaList].map((value, index) => {
            const checkSelected = value === brandAlphaSelected;
            return (
                <Ripple
                    style={[
                        styles.touch_left_item,
                        checkSelected ? styles.item_right_active : null,
                    ]}
                    key={index}
                    onPress={setStateBrandAlphaSelected(value)}
                    rippleCentered
                >
                    <View
                        style={[
                            styles.view_left_image,
                            {
                                backgroundColor: checkSelected
                                    ? theme.colors.main['100']
                                    : theme.colors.grey_[200],
                            },
                        ]}
                    >
                        <Text
                            size={'body2'}
                            color={
                                checkSelected ? theme.colors.main['600'] : theme.colors.grey_[500]
                            }
                        >
                            {value}
                        </Text>
                    </View>
                </Ripple>
            );
        });

    const renderListRightItem = () =>
        brandsFilter.map((value, index) => (
            <TouchableOpacity
                style={styles.touch_right_item}
                key={index}
                activeOpacity={0.8}
                onPress={navigate.PRODUCT_BRAND_ROUTE({ brand_uuid: value.brand_uuid })}
            >
                <LinearGradient
                    style={styles.view_right_image}
                    start={{ x: 0.5, y: 1 }}
                    end={{ x: 0.5, y: 0.3 }}
                    // // colors={['rgba(255, 169, 62, 1)', 'rgba(255, 231, 188, 1)']}
                    // colors={['rgba(255, 178, 80, 1)', 'rgba(245, 175, 25, 0.5)']}
                    colors={['rgba(245, 175, 25, 0.5)', 'rgba(245, 175, 25, 0.2)']}
                >
                    <Image
                        source={{
                            uri: value.logo,
                        }}
                        resizeMode="contain"
                    />
                </LinearGradient>

                <Text ta="center">{value.brand_name}</Text>
            </TouchableOpacity>
        ));

    return (
        <View style={styles.view_container}>
            <Header
                centerTitle="Thương hiệu chính hãng"
                backgroundColor={theme.colors.white_[10]}
                colorBackIcon={theme.colors.black_[10]}
                centerTitleSize={'title1'}
                shadow={true}
                rightComponent={<MiniCart color={theme.colors.black_[10]} />}
            />
            <AfterInteractions style={styles.view_body}>
                {/* left */}
                <View style={styles.view_left}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {renderLeftListItem()}
                    </ScrollView>
                </View>
                {/* right */}
                <View style={styles.view_right}>
                    {false ? (
                        <View flex={0.7} jC="center">
                            <ActivityIndicator
                                size={theme.typography.size(40)}
                                color={theme.colors.main['600']}
                            />
                        </View>
                    ) : (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.view_wrap_right_item}>{renderListRightItem()}</View>
                        </ScrollView>
                    )}
                </View>
            </AfterInteractions>
        </View>
    );
});

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        view_container: {
            flex: 1,
        },
        view_body: {
            flex: 1,
            flexDirection: 'row',
            padding: theme.spacings.small,
        },
        view_left: {
            flex: 0.32,
            // backgroundColor: 'yellow',
        },
        touch_left_item: {
            width: '100%',
            backgroundColor: theme.colors.white_[10],
            aspectRatio: 1.35,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 1,
        },
        view_left_image: {
            width: '50%',
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 100,
        },
        //right
        view_right: {
            flex: 0.68,
            backgroundColor: theme.colors.white_[10],
            padding: theme.spacings.small,
            marginLeft: theme.spacings.small,
        },
        view_wrap_right_item: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
        },
        touch_right_item: {
            width: '48%',
            // justifyContent: 'center',
            marginBottom: theme.spacings.medium,
        },
        view_right_image: {
            width: '100%',
            aspectRatio: 1.5,
            padding: theme.spacings.small,
            borderRadius: 5,
        },
        item_right_active: {
            borderLeftWidth: 3,
            borderLeftColor: theme.colors.main['600'],
            backgroundColor: theme.colors.grey_[100],
        },
    });
};

export default BrandsScreen;
