import { REACT_NATIVE_APP_GEOAPIFY_KEY } from 'const/env';
import { LocationState } from 'features/address/addressSlice';
import { useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Geolocation from 'react-native-geolocation-service';
import { openSettings } from 'react-native-permissions';
import { services } from 'services';
import { removeAccents } from 'utils/helpers';
import showAlertApp from 'utils/showAlertApp';
import { sendSentryError } from 'utils/storeHelpers';

export interface RequestAddressType {
    province: string;
    district: string;
    ward: string;
}

export const useRequestLocation = () => {
    //hooks
    //state
    const [loadingRequestLocation, setLoadingRequestLocation] = useState(false);
    const [vdcLocation, setVdcLocation] = useState<LocationState>();

    /* --- permission --- */
    // location
    const requestLocationPermission = async () => {
        setLoadingRequestLocation(true);
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Yêu cầu quyền truy cập vị trí',
                        message:
                            'Vua dụng cụ muốn sử dụng vị trí của bạn, để để cung cấp trải nghiệm tốt hơn cho bạn!',
                        buttonNeutral: 'Hỏi lại sau',
                        buttonNegative: 'Đóng',
                        buttonPositive: 'Đồng ý',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getLocation();
                    return;
                }
                if (granted === 'denied' || granted === 'never_ask_again') {
                    showAlertApp(
                        'Ứng dụng cần quyền truy cập vào quyền vị trí để sử dụng chức năng lấy vị trí hiện tại của khách hàng',
                        'Cấp quyền',
                        'Đóng',
                        () => openSettings(),
                        () => {}
                    );
                    setLoadingRequestLocation(false);
                } else {
                    throw granted;
                }
                setLoadingRequestLocation(false);
            } catch (err) {
                console.warn(err);
                sendSentryError(err, 'requestLocationPermission Android');
                getVdcAddressFromGeoAddress();
            }
        } else {
            try {
                const grantedIos = await Geolocation.requestAuthorization('whenInUse');
                if (grantedIos === 'granted') {
                    getLocation();
                    return;
                }
                if (grantedIos === 'denied') {
                    showAlertApp(
                        'Ứng dụng cần quyền truy cập vào quyền vị trí để sử dụng chức năng lấy vị trí hiện tại của khách hàng',
                        'Cấp quyền',
                        'Đóng',
                        () => openSettings(),
                        () => {}
                    );
                } else {
                    throw grantedIos;
                }

                setLoadingRequestLocation(false);
            } catch (error: any) {
                getVdcAddressFromGeoAddress();
                sendSentryError(error, 'requestLocationPermission IOS');
            }
        }
    };

    const getLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getAddressFromCoordinates(latitude, longitude);
            },
            (error) => {
                sendSentryError(error, 'getLocation');
                getVdcAddressFromGeoAddress();
            },
            {
                enableHighAccuracy: true,
                // timeout: 15000,
                // maximumAge: 10000,
                forceLocationManager: false,
            }
        );
    };

    const filterAddressGeoapify = (d: any) => {
        //get province
        let provinceKey = d?.state ? 'state' : d?.city ? 'city' : '';
        let provinceName: string = d?.state || d?.city || '';

        //get district
        let districtKey =
            d.state && d.city && d.county && d.suburb && provinceKey !== 'city'
                ? 'city'
                : d.county
                ? 'county'
                : d.district
                ? 'district'
                : provinceKey !== 'city' && d?.city
                ? 'city'
                : d?.suburb
                ? 'suburb'
                : d?.town
                ? 'town'
                : '';
        let districtName: string =
            (d.state && d.city && d.county && d.suburb ? d.city : '') ||
            d.county ||
            d.district ||
            (provinceKey !== 'city' && d.city) ||
            d.suburb ||
            d.town ||
            '';
        //get ward
        const wardName: string =
            d.village ||
            (provinceKey !== 'quarter' && districtKey !== 'quarter' && d.quarter) ||
            (provinceKey !== 'suburb' && districtKey !== 'suburb' && d.suburb) ||
            (provinceKey !== 'city' && districtKey !== 'city' && d.city);

        // chi can require tinh thanh -> huyen/xa co the lay vi tri dau tien
        if (provinceName) {
            return {
                provinceName: provinceName,
                districtName: districtName || '',
                wardName: wardName || '',
            };
        }
        sendSentryError(d, 'filterAddressGeoapify');
    };

    const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
        try {
            const response = await fetch(
                `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${REACT_NATIVE_APP_GEOAPIFY_KEY}`
            );
            const data = await response.json();

            if (data && data?.features[0]?.properties) {
                const dataAddress = data.features[0].properties;

                const addressFilter = filterAddressGeoapify(dataAddress);

                if (addressFilter) {
                    const regexAdress =
                        /(Province|City|District|Town|Ward|Commune|province|city|district|town|ward|commune)/g;

                    getVdcAddressFromGeoAddress({
                        province: addressFilter?.provinceName
                            .replace(regexAdress, '')
                            .replace('City', '')
                            .trim(),
                        district: addressFilter?.districtName.replace(regexAdress, '').trim(),
                        ward: addressFilter?.wardName.replace(regexAdress, ''),
                    });
                    return;
                }
            }
            throw '';
        } catch (error) {
            sendSentryError(error, 'getAddressFromCoordinates');
            setLoadingRequestLocation(false);
            getVdcAddressFromGeoAddress();
        }
    };

    //trans

    const getVdcAddressFromGeoAddress = async (address?: RequestAddressType) => {
        try {
            const {
                province = 'Trà Vinh',
                district = 'Thành phố Trà Vinh',
                ward = 'Phường 3',
            } = address || {};
            //get province,
            const resProvince = await services.admin.getProvinces();
            if (resProvince?._embedded) {
                const provinceFind = resProvince._embedded?.provinces.find((v) =>
                    removeAccents(v?.name)
                        .toLowerCase()
                        .includes(removeAccents(province).toLowerCase())
                );
                const provinceSelected = provinceFind || resProvince?._embedded.provinces[0];
                if (provinceSelected?.id) {
                    const resDistrict = await services.admin.getDistricts(provinceSelected?.id);
                    if (resDistrict?._embedded) {
                        const districtFind = resDistrict._embedded.districts.find((v) =>
                            removeAccents(v?.name)
                                .toLowerCase()
                                .includes(removeAccents(district).toLowerCase())
                        );
                        const districtSelected =
                            districtFind || resDistrict?._embedded.districts[0];
                        if (districtSelected?.id) {
                            const resWard = await services.admin.getWards(districtSelected?.id);
                            if (resWard?._embedded) {
                                const wardFind = resWard._embedded.wards.find((v) =>
                                    removeAccents(v?.name)
                                        .toLowerCase()
                                        .includes(removeAccents(ward).toLowerCase())
                                );
                                const wardSelected = wardFind || resWard._embedded.wards[0];
                                if (wardSelected?.id) {
                                    setVdcLocation({
                                        province: provinceSelected,
                                        district: districtSelected,
                                        ward: wardSelected,
                                    });
                                    return;
                                }
                            }
                            throw resWard;
                        }
                        throw districtFind;
                    }
                }
                throw provinceFind;
            }
        } catch (error) {
            sendSentryError(error, 'getVdcAddressFromGeoAddress');
            showMessage({
                message: 'Đã xảy ra lỗi lấy vị trí, xin vui lòng thử lại!5',
                type: 'danger',
            });
        } finally {
            setLoadingRequestLocation(false);
        }
    };

    return {
        vdcLocation,
        loadingRequestLocation,
        requestLocationPermission,
        getVdcAddressFromGeoAddress,
    };
};
