import AfterInteractions from 'components/AfterInteractions';
import Header from 'components/Header2';
import Image from 'components/Image';
import MiniCart from 'components/MiniCart';
import Text from 'components/Text';
import View from 'components/View';
import { useCategoriesSWR, useNavigate, useTheme } from 'hooks';
import React, { memo, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ripple from 'react-native-material-ripple';

const CategoriesScreen = memo(function CategoriesScreen() {
    //hook
    const styles = useStyles();
    const { theme } = useTheme();
    const navigate = useNavigate();
    //state
    const [categoryUuidSelected, setCategoryUuidSelected] = useState<string | undefined>();
    //swr
    const { categories: parentData } = useCategoriesSWR('0');
    const { categories: childData, isValidating: isValidChildCategories } = useCategoriesSWR(
        categoryUuidSelected || '',
        undefined,
        { revalidateOnMount: false }
    );

    //effect
    useEffect(() => {
        //set default uuid selected
        if (parentData) {
            setCategoryUuidSelected(parentData.children[0].uuid);
        }
    }, [parentData]);

    const parentCategories = parentData?.children || [];
    const childCategories = [...(childData?.parent || []), ...(childData?.children || [])];

    //handle
    const setStateCategoryUuidSelected = (category_uuid: string) => () => {
        setCategoryUuidSelected(category_uuid);
    };

    //render
    const renderLeftListItem = () =>
        parentCategories.map((value, index) => {
            const checkSelected = value.uuid === categoryUuidSelected;
            return (
                <Ripple
                    style={[
                        styles.touch_left_item,
                        checkSelected ? styles.item_right_active : null,
                    ]}
                    key={index}
                    rippleCentered
                    onPress={setStateCategoryUuidSelected(value.uuid)}
                >
                    <View
                        style={[
                            styles.view_left_image,
                            {
                                backgroundColor: checkSelected
                                    ? theme.colors.main['100']
                                    : theme.colors.grey_[100],
                            },
                        ]}
                    >
                        <Image
                            source={{
                                uri: value.image,
                            }}
                            resizeMode="contain"
                        />
                    </View>
                    <View ph={'small'}>
                        <Text
                            size={'sub3'}
                            ta={checkSelected ? 'center' : 'auto'}
                            color={
                                checkSelected ? theme.colors.main['600'] : theme.colors.grey_['600']
                            }
                            numberOfLines={checkSelected ? 2 : 1}
                        >
                            {value.name}
                        </Text>
                    </View>
                </Ripple>
            );
        });

    const renderListRightItem = () =>
        childCategories.map((value, index) => (
            <TouchableOpacity
                style={styles.touch_right_item}
                key={index}
                onPress={navigate.PRODUCT_CATEGORY_ROUTE({ category_uuid: value.uuid })}
            >
                <LinearGradient
                    style={styles.view_right_image}
                    start={{ x: 0.5, y: 1 }}
                    end={{ x: 0.5, y: 0.3 }}
                    // colors={['rgba(255, 169, 62, 1)', 'rgba(255, 231, 188, 1)']}
                    // colors={['rgba(255, 178, 80, 1)', 'rgba(245, 175, 25, 0.5)']}
                    // colors={['rgba(245, 175, 25, 0.7)', 'rgba(245, 175, 25, 0.3)']}
                    colors={['rgba(245, 175, 25, 0.5)', 'rgba(245, 175, 25, 0.2)']}
                >
                    <Image
                        source={{
                            uri: value.image,
                        }}
                        resizeMode="contain"
                    />
                </LinearGradient>

                <Text ta="center">{value.name}</Text>
            </TouchableOpacity>
        ));

    return (
        <View style={styles.view_container}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            <Header
                center={<Text size={'title1'}>Danh mục sản phẩm</Text>}
                bgColor={theme.colors.white_[10]}
                right={<MiniCart color={theme.colors.black_[10]} />}
                showGoBack
                iconGoBackColor={theme.colors.black_[10]}
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
                    {isValidChildCategories ? (
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
            width: '40%',
            aspectRatio: 1,
            padding: theme.spacings.small,
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
            // borderBottomWidth: 2,
            // borderBottomColor: theme.colors.teal[500],
        },
        item_right_active: {
            borderLeftWidth: 3,
            borderLeftColor: theme.colors.main['600'],
            backgroundColor: theme.colors.grey_[100],
        },
    });
};

export default CategoriesScreen;
