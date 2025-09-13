import { ListItem, SearchBar } from '@rneui/themed';
import { filter, toLower } from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { services } from 'services';
import { removeAccents } from 'utils/helpers';
// import { RouteProp } from '@react-navigation/native';
// import { AddressStackParamsList } from 'navigation/type';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from 'components/Header2';
import Text from 'components/Text';
import { SET_LOCATION_VALUE } from 'features/action';
import { useAppDispatch, useTheme } from 'hooks';
import { sendSentryError } from 'utils/storeHelpers';
import useStyles from './styles';
1;

interface Props {
    navigation: StackNavigationProp<any, any>;
    // route: RouteProp<AddressStackParamsList, 'AddressFormLocation'>;
}

const AddressFormLocation = memo(function AddressFormLocation({ navigation }: Props) {
    //hook
    const styles = useStyles();
    const { theme } = useTheme();
    const dispatch = useAppDispatch();
    //style
    //value
    const [index, setIndex] = useState(0);
    const [listLocation, setListLocation] = useState<any>([]);
    const [listLocationBackup, setListLocationBackup] = useState<any>([]);
    const [textInput, setTextInput] = useState('');
    const [location, setLocation] = useState<any>({
        province: null,
        district: null,
        ward: null,
    });
    const [routes] = useState([
        { key: 'province', title: 'Tỉnh thành' },
        { key: 'district', title: 'Quận huyện' },
        { key: 'ward', title: 'Xã phường' },
    ]);

    useEffect(() => {
        try {
            const getDataInit = async () => {
                const province = await services.admin?.getProvinces();
                setListLocation(province._embedded.provinces);
                setListLocationBackup(province._embedded.provinces);
            };
            getDataInit();
        } catch (error: any) {
            sendSentryError(error, 'init fetch province form location');
        }
    }, []);

    //khi click vao item
    const handleClickItem = (item: any) => async () => {
        // kiểm tra khi click vào tỉnh thành, huyện , xã
        setTextInput('');
        if (index === 0) {
            //khi click vao mot tinh thanh -> thi ve chuyen sang tab quan huyen va get quan huyen theo id tinh thanh

            //set province user click
            setLocation({
                ...location,
                province: item,
            });
            const districts = await services.admin?.getDistricts(item.id);
            setListLocation(districts._embedded.districts);
            setListLocationBackup(districts._embedded.districts);
            setIndex(index + 1);
        } else if (index === 1) {
            setLocation({
                ...location,
                district: item,
            });
            const wards = await services.admin?.getWards(item.id);
            setListLocation(wards._embedded.wards);
            setListLocationBackup(wards._embedded.wards);
            setIndex(index + 1);
        } else {
            //click ward
            setLocation({
                ...location,
                ward: item,
            });
            const addressSave = {
                ...location,
                ward: item,
            };
            //dispatch location to store and goBack address form
            dispatch(SET_LOCATION_VALUE(addressSave));
            navigation.goBack();
        }
    };

    const renderItem = ({ item, index_ }: any) => {
        return (
            <ListItem
                hasTVPreferredFocus
                bottomDivider
                containerStyle={{ backgroundColor: theme.colors.white_[10] }}
                onPress={handleClickItem(item)}
                key={index_}
            >
                <ListItem.Title style={{ color: theme.colors.black_[10] }}>
                    {item.name}
                </ListItem.Title>
            </ListItem>
        );
    };

    //custom tabbar
    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            renderLabel={({ route }: any) => <Text>{route.title}</Text>}
            indicatorStyle={{ backgroundColor: theme.colors.main['600'] }}
            style={{
                backgroundColor: theme.colors.white_[10],
                color: theme.colors.black_[10],
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.grey_[100],
            }}
            activeColor={theme.colors.black_[10]}
            inactiveColor={theme.colors.black_[7]}
            onTabPress={async ({ route, preventDefault }) => {
                switch (
                    route.key // kiểm tra khi click vào tabar
                ) {
                    case 'province':
                        const province = await services.admin?.getProvinces();
                        setListLocation(province._embedded.provinces);
                        setListLocationBackup(province._embedded.provinces);
                        setLocation({
                            province: null,
                            ward: null,
                            district: null,
                        });
                        return;
                    case 'district':
                        if (location.province) {
                            // neu ton tai id tinh thanh da chon thi get quan huyen theo id tinh thanh
                            setLocation({
                                ...location,
                                ward: null,
                                district: null,
                            });
                            const district = await services.admin?.getDistricts(
                                location.province.id
                            );
                            setListLocation(district._embedded.districts);
                            setListLocationBackup(district._embedded.districts);
                            return;
                        }
                        preventDefault();
                        return;
                    case 'ward':
                        if (location.district) {
                            return;
                        }
                        preventDefault();
                        return;
                }
            }}
        />
    );

    //render cac man hinh vi chi su dung 1 man hinh nen return null
    const renderScene = ({ route }: any) => {
        switch (route.key) {
            case 'province':
                return null;
            case 'district':
                return null;
            case 'ward':
                return null;
            default:
                return null;
        }
    };

    //handle search address
    const handleChangeText = (text: string) => {
        setTextInput(text);
        const text_ = toLower(text);
        const locationFilter = filter(listLocationBackup, (dt: any) => {
            return removeAccents(dt?.name).toLowerCase().match(removeAccents(text_));
        });
        setListLocation(locationFilter);
    };

    return (
        <View style={{ flex: 1 }}>
            {/* header */}

            <Header
                center={<Text size={'title2'}>Địa chỉ giao hàng</Text>}
                showGoBack
                bgColor={theme.colors.white_[10]}
                iconGoBackColor={theme.colors.black_[10]}
                statusBarColor={theme.colors.main['500']}
            />
            {/* tab  */}
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{}}
                style={{ flex: 0 }}
                renderTabBar={renderTabBar}
                swipeEnabled={false}
            />
            {/* search location */}
            <View style={styles.view_searchLocation}>
                <SearchBar
                    platform={'default'}
                    containerStyle={styles.search_container}
                    placeholder="Tìm kiếm..."
                    inputContainerStyle={styles.inputContainerSearch}
                    leftIconContainerStyle={{ width: '10%', paddingRight: 0 }}
                    searchIcon={{
                        type: 'ionicon',
                        name: 'search-outline',
                        size: theme.spacings.tiny * 6,
                    }}
                    inputStyle={{ fontSize: theme.typography.body2 }}
                    onChangeText={handleChangeText}
                    value={textInput}
                />
            </View>
            {/* render list location */}
            <View style={{ flex: 1 }}>
                <FlatList
                    data={listLocation}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.name}
                />
            </View>
        </View>
    );
});

export default AddressFormLocation;
