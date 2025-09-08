/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable radix */
import { ListItem } from '@rneui/base';
import { Icon, SearchBar } from '@rneui/themed';
import BottomSheet from 'components/BottomSheet';
import Text from 'components/Text';
import Touch from 'components/Touch';
import View from 'components/View';
import { LocationState } from 'features/address/addressSlice';
import { SET_FINISH_GET_LOCATION } from 'features/apps/appsSlice';
import { useAppDispatch, useTheme } from 'hooks';
import { useRequestLocation } from 'hooks/useRequestLocation';
import React, { memo, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { TabBar, TabView } from 'react-native-tab-view';
import { services } from 'services';
import { isEmpty, removeAccents } from 'utils/helpers';
import { sendSentryError } from 'utils/storeHelpers';

interface Props {
    defaultLocation?: LocationState;

    //trigger type
    title?: string;
    trigger?: React.ReactNode;
    triggerStyle?: StyleProp<ViewStyle>;

    // chi dung lan dau - check de set visible
    openInit?: boolean;
    // open su dung khi khong dung visible
    open?: boolean;
    onClose?: () => void;
    // success
    onSuccess: (address: LocationState) => void;
}
const TouchableOpacityAnimation = Animated.createAnimatedComponent(TouchableOpacity);

const BottomSheetAddressLocation = memo(function BottomSheetAddressLocation({
    defaultLocation,
    title = 'Chọn địa chỉ',
    trigger,
    triggerStyle,
    open,
    openInit,
    onClose,
    onSuccess,
}: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles();
    const { vdcLocation, requestLocationPermission, loadingRequestLocation } = useRequestLocation();
    const dispatch = useAppDispatch();
    //state
    const [loadingDefaultAddress, setLoadingDefaultAddress] = useState(false);
    const [visible, setVisible] = useState(false);
    const [index, setIndex] = useState(0);
    const [locationSelected, setLocationSelected] = useState<LocationState>();
    //--list location
    const [provinces, setProvinces] = useState<Array<{ id: string; name: string }>>([]);
    const [districts, setDistricts] = useState<Array<{ id: string; name: string }>>([]);
    const [wards, setWards] = useState<Array<{ id: string; name: string }>>([]);
    //--search
    const [searchTextProvince, setSearchTextProvince] = useState('');
    const [searchTextDistrict, setSearchTextDistrict] = useState('');
    const [searchTextWard, setSearchTextWard] = useState('');
    // check value
    const locationList = index === 0 ? provinces : index === 1 ? districts : wards;
    const searchText =
        index === 0 ? searchTextProvince : index === 1 ? searchTextDistrict : searchTextWard;

    // effect
    useEffect(() => {
        if (openInit) {
            setVisible(true);
        }
    }, [openInit]);

    //--province init
    useEffect(() => {
        try {
            const getDataInit = async () => {
                const province = await services.admin?.getProvinces();
                if (province?._embedded?.provinces) {
                    setProvinces(province._embedded.provinces);
                    dispatch(SET_FINISH_GET_LOCATION(true));
                }
            };
            getDataInit();
        } catch (error: any) {
            sendSentryError(error, 'Bottom sheet effect get province');
        }
    }, []);

    //--set location request location exists
    useEffect(() => {
        if (vdcLocation) {
            handleSuccess(vdcLocation);
        }
    }, [vdcLocation]);

    //--defaut address
    useEffect(() => {
        if (defaultLocation && !isEmpty(defaultLocation?.province) && (visible || open)) {
            setLocationSelected(defaultLocation);
            (async () => {
                try {
                    setLoadingDefaultAddress(true);
                    const [resProvince, resDistrict, resWard] = await Promise.all([
                        services.admin.getProvinces(),
                        services.admin.getDistricts(defaultLocation.province?.id || ''),
                        services.admin.getWards(defaultLocation.district?.id || ''),
                    ]);
                    const provinces_ = resProvince?._embedded?.provinces;
                    const districts_ = resDistrict?._embedded?.districts;
                    const wards_ = resWard?._embedded?.wards;
                    if (provinces && districts && wards) {
                        setProvinces(provinces_);
                        setDistricts(districts_);
                        setWards(wards_);
                        setIndex(2);
                    }
                } catch (error) {
                    sendSentryError(error, 'Error handle default address modal location');
                } finally {
                    setLoadingDefaultAddress(false);
                }
            })();
        }
    }, [defaultLocation, visible, open]);

    //Handle

    const handleClose = () => {
        onClose && onClose();
        setVisible(false);
    };

    const handleOpen = () => {
        setVisible(true);
    };

    //--tab
    const handleClickItem = (item: { id: string; name: string }) => async () => {
        // kiểm tra khi click vào tỉnh thành, huyện , xã
        if (index === 0) {
            //khi click vao mot tinh thanh -> thi ve chuyen sang tab quan huyen va get quan huyen theo id tinh thanh

            //set province user click
            setLocationSelected({
                ...locationSelected,
                province: item,
            });
            const districts = await services.admin?.getDistricts(item.id);

            setDistricts(districts._embedded.districts);
            setIndex(index + 1);
        } else if (index === 1) {
            setLocationSelected({
                ...locationSelected,
                district: item,
            });
            const wards = await services.admin?.getWards(item.id);
            setWards(wards._embedded.wards);
            setIndex(index + 1);
        } else {
            //click ward
            setLocationSelected({
                ...locationSelected,
                ward: item,
            });
            const addressSave = {
                ...locationSelected,
                ward: item,
            };

            handleSuccess(addressSave);
            setLocationSelected(undefined);
        }
    };

    //--get address success
    const handleSuccess = (address: LocationState) => {
        onSuccess(address);
        setVisible(false);
        onClose && onClose();
    };

    //Render
    const renderItem = () => {
        return locationList
            .filter(
                (v) =>
                    removeAccents(v.name)
                        .toLocaleLowerCase()
                        .indexOf(removeAccents(searchText).toLocaleLowerCase()) !== -1
            )
            .map((v, _) => (
                <ListItem
                    hasTVPreferredFocus
                    bottomDivider
                    containerStyle={{ backgroundColor: theme.colors.white_[10] }}
                    onPress={handleClickItem(v)}
                    key={`${v.id} - ${v.name}`}
                >
                    <ListItem.Title
                        style={{ color: theme.colors.black_[10], fontSize: theme.typography.body1 }}
                    >
                        {v.name}
                    </ListItem.Title>
                </ListItem>
            ));
    };

    //custom tabbar
    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: theme.colors.main['600'] }}
            style={styles.tabbar_style}
            onTabPress={async ({ route, preventDefault }) => {
                switch (
                    route.key // kiểm tra khi click vào tabar
                ) {
                    case 'province':
                        const province = await services.admin?.getProvinces();
                        setProvinces(province._embedded.provinces);
                        setLocationSelected(undefined);
                        return;
                    case 'district':
                        if (locationSelected?.province?.id) {
                            // neu ton tai id tinh thanh da chon thi get quan huyen theo id tinh thanh
                            setLocationSelected({
                                ...locationSelected,
                                ward: undefined,
                                district: undefined,
                            });
                            const district = await services.admin?.getDistricts(
                                locationSelected?.province.id || ''
                            );
                            setDistricts(district._embedded.districts);
                            return;
                        }
                        preventDefault();
                        return;
                    case 'ward':
                        if (locationSelected?.district?.id) {
                            return;
                        }
                        preventDefault();
                        return;
                }
            }}
            renderTabBarItem={({ defaultTabWidth, labelText, onPress }) => (
                <Touch w={defaultTabWidth} aI="center" p={theme.spacings.medium} onPress={onPress}>
                    <Text>{labelText}</Text>
                </Touch>
            )}
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

    const changeSearchTextLocation = (text: string) => {
        if (index === 0) {
            setSearchTextProvince(text);
        }

        if (index === 1) {
            setSearchTextDistrict(text);
        }

        if (index === 2) {
            setSearchTextWard(text);
        }
    };

    return (
        <>
            {trigger && (
                <TouchableOpacityAnimation
                    style={triggerStyle}
                    activeOpacity={0.7}
                    onPress={handleOpen}
                >
                    {trigger}
                </TouchableOpacityAnimation>
            )}

            <BottomSheet
                isVisible={open !== undefined ? open : visible}
                radius
                onBackdropPress={handleClose}
                triggerOnClose={handleClose}
                viewContainerStyle={{ height: theme.dimens.height * 0.8, padding: 0 }}
            >
                <Text style={styles.txt_title}>{title}</Text>
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.touch_request_location}
                    onPress={requestLocationPermission}
                >
                    {loadingRequestLocation ? (
                        <View>
                            <ActivityIndicator
                                color={theme.colors.cyan[500]}
                                size={theme.typography.size(20)}
                            />
                        </View>
                    ) : (
                        <Icon
                            type="ionicon"
                            name="location"
                            color={theme.colors.cyan[500]}
                            size={theme.typography.size(20)}
                        />
                    )}

                    <Text color={theme.colors.cyan[500]} fw="bold">
                        Sử dụng vị trí hiện tại của bạn
                    </Text>
                </TouchableOpacity>

                {loadingDefaultAddress ? (
                    <View mt={10}>
                        <ActivityIndicator
                            color={theme.colors.grey_[400]}
                            size={theme.typography.size(20)}
                        />
                    </View>
                ) : (
                    <>
                        {/* tab  */}
                        <TabView
                            navigationState={{
                                index,
                                routes: [
                                    { key: 'province', title: 'Tỉnh thành' },
                                    { key: 'district', title: 'Quận huyện' },
                                    { key: 'ward', title: 'Xã phường' },
                                ],
                            }}
                            initialLayout={{}}
                            style={{ flex: 0 }}
                            swipeEnabled={false}
                            renderScene={renderScene}
                            onIndexChange={setIndex}
                            renderTabBar={renderTabBar}
                        />
                        {/* search location */}
                        <View style={styles.view_searchLocation}>
                            <SearchBar
                                platform={'default'}
                                containerStyle={styles.search_container}
                                placeholder="Tìm kiếm..."
                                inputContainerStyle={styles.inputContainerSearch}
                                leftIconContainerStyle={{ paddingRight: 0 }}
                                searchIcon={{
                                    type: 'ionicon',
                                    name: 'search-outline',
                                    size: theme.spacings.tiny * 6,
                                }}
                                inputStyle={{ fontSize: theme.typography.body2 }}
                                onChangeText={changeSearchTextLocation}
                                value={searchText}
                            />
                        </View>
                        {/* render list location */}
                        <View style={{ flex: 1 }}>
                            <ScrollView>{renderItem()}</ScrollView>
                        </View>
                    </>
                )}
            </BottomSheet>
        </>
    );
});

export default BottomSheetAddressLocation;

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        ////////////address form screen/////////////
        list_defaultLocation: {
            justifyContent: 'space-between',
            paddingVertical: theme.spacings.medium,
            backgroundColor: theme.colors.white_[10],
        },
        v_btnAddnew: {
            flex: 1,
            justifyContent: 'flex-end',
            paddingBottom: theme.spacings.large,
            paddingHorizontal: theme.spacings.medium,
        },
        v_errorFormik: {
            backgroundColor: theme.colors.white_[10],
            paddingLeft: theme.spacings.medium,
        },
        //address form location
        search_container: {
            width: '98%',
            backgroundColor: theme.colors.white_[10],
            borderTopWidth: 0,
            borderBottomWidth: 0,
        },
        inputContainerSearch: {
            borderRadius: 10,
            backgroundColor: theme.colors.grey_[100],
            height: '90%',
        },
        view_searchLocation: {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.white_[10],
            height: theme.dimens.height * 0.1,
        },
        list_title_style: {
            fontSize: theme.typography.body2,
            color: theme.colors.black_[10],
        },
        list_title_location_style: {
            flex: 1,
            fontSize: theme.typography.body2,
            color: theme.colors.black_[10],
        },
        list_sub_title_style: {
            fontSize: theme.typography.sub2,
        },
        list_input_style: {
            fontSize: theme.typography.body1,
        },

        //
        list_container: {
            backgroundColor: theme.colors.white_[10],
        },

        txt_title: {
            fontWeight: 'bold',
            padding: theme.spacings.medium,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey_[200],
            fontSize: theme.typography.body2,
            textAlign: 'center',
        },

        touch_request_location: {
            flexDirection: 'row',

            padding: theme.spacings.medium,
            alignItems: 'center',
            gap: theme.spacings.small,
        },

        tabbar_style: {
            backgroundColor: theme.colors.main[50],
            color: theme.colors.red[500],
            borderBottomWidth: 1,
            borderTopWidth: 1,
            borderColor: theme.colors.main[100],
        },
    });
};
