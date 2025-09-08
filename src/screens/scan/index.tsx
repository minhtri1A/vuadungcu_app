/* eslint-disable react-native/no-inline-styles */
import React, { memo, useEffect, useState } from 'react';
/* eslint-disable react-hooks/exhaustive-deps */
import IconButton from 'components/IconButton';
import Text from 'components/Text';
import View from 'components/View';
import { NAVIGATION_ACCOUNT_STACK, NAVIGATION_TO_EDIT_REFERRAL_SCREEN } from 'const/routes';
import withAuth from 'hoc/withAuth';
import { useNavigation, useTheme } from 'hooks';
import { split } from 'lodash';
import { Platform, StatusBar, StyleSheet, Vibration } from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import { openSettings } from 'react-native-permissions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import QRCodeEvent from './components/QRCodeEvent';
import QRCodeProduct from './components/QRCodeProduct';
import showAlertApp from 'utils/showAlertApp';
// interface Props {
//     navigation: StackNavigationProp<any, any>;
// }

const QR_DATA_TYPE = {
    //NTL_EVENTQR:event
    NTL_EVENTQR: 'NTL_EVENTQR',
    //
    NTL_PRODUCT: 'NTL_PRODUCT',
    //https://...
    NTL_URL: 'NTL_URL',
    //
    NTL_PRODUCT_BARCODE: 'NTL_PRODUCT_BARCODE',
    //NTL_REFERRAL:referral code
    NTL_REFERRAL: 'NTL_REFERRAL',
};

const ScanScreen = memo(function ScanScreen() {
    const { theme } = useTheme();
    const navigation = useNavigation();
    //hooks
    const device = useCameraDevice('back');
    const insets = useSafeAreaInsets();

    // State
    const [torch, setTorch] = useState(false);
    const [qrCodeType, setQRCodeType] = useState<any>(null);
    const [qrCodeData, setQRCodeData] = useState<any>(null);
    const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied'>();

    //effect
    // Effect granted denied
    useEffect(() => {
        (async () => {
            const permission = await Camera.requestCameraPermission();
            setCameraPermission(permission);
            if (permission === 'denied') {
                showAlertApp(
                    'Ứng dụng cần quyền truy cập vào camera để sử dụng chức năng quét mã',
                    'Cấp quyền',
                    'Trở về',
                    () => openSettings(),
                    () => navigation.goBack()
                );
            }
        })();
    }, []);

    //

    //handle
    const codeScanner = useCodeScanner({
        codeTypes: ['code-128', 'code-39', 'code-93', 'ean-13', 'ean-8', 'upc-e', 'upc-a', 'qr'],
        onCodeScanned: (codes) => {
            if (!codes.length) return;
            if (codes[0].value) {
                Vibration.vibrate(500);
                // setScanValue(codes[0].value, type);
                handleScanCodeSuccess(codes[0].value);
                // navigation.goBack();
            }
        },
    });

    const handleScanCodeSuccess = (data: string) => {
        // checkQrCodeAndUpdateQrScore(qrCodeData);

        const dataSplit = split(data, ':') || [];
        switch (dataSplit[0]) {
            case QR_DATA_TYPE.NTL_EVENTQR:
                setQRCodeType(QR_DATA_TYPE.NTL_EVENTQR);
                setQRCodeData(dataSplit[1]);
                break;
            case QR_DATA_TYPE.NTL_REFERRAL:
                setQRCodeType(QR_DATA_TYPE.NTL_REFERRAL);
                setQRCodeData(dataSplit[1]);
                break;
            default:
                setQRCodeType(QR_DATA_TYPE.NTL_PRODUCT);
                setQRCodeData(data);
        }
    };

    const resetQRCode = () => {
        setQRCodeData(null);
        setQRCodeType(null);
    };

    //render
    const renderAction = () => {
        switch (qrCodeType) {
            case QR_DATA_TYPE.NTL_EVENTQR:
                return (
                    <QRCodeEvent
                        qr_type={qrCodeType}
                        qr_data={qrCodeData}
                        resetQRCode={resetQRCode}
                    />
                );
            case QR_DATA_TYPE.NTL_PRODUCT:
                return (
                    <QRCodeProduct
                        qr_type={qrCodeType}
                        qr_data={qrCodeData}
                        resetQRCode={resetQRCode}
                    />
                );
            case QR_DATA_TYPE.NTL_REFERRAL:
                navigation.navigate(NAVIGATION_ACCOUNT_STACK, {
                    screen: NAVIGATION_TO_EDIT_REFERRAL_SCREEN,
                    params: {
                        referral_code: qrCodeData,
                    },
                });
                resetQRCode();
                break;
            default:
                break;
        }
    };

    return (
        <>
            <StatusBar translucent backgroundColor={'transparent'} barStyle={'dark-content'} />
            <View flex={1}>
                {device && cameraPermission === 'granted' && (
                    <Camera
                        // ref={camera}
                        style={StyleSheet.absoluteFill}
                        device={device}
                        isActive
                        codeScanner={qrCodeType === null ? codeScanner : undefined}
                        torch={torch ? 'on' : 'off'}
                        photoQualityBalance="speed"
                    />
                )}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: theme.spacings.medium,
                        zIndex: 99,
                        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : insets.top,
                        alignItems: 'center',
                    }}
                >
                    <IconButton
                        type="ionicon"
                        name="arrow-back-outline"
                        onPress={navigation.goBack}
                        size={theme.typography.title3}
                        color={theme.colors.white_[10]}
                    />
                    <Text color={theme.colors.white_[10]} size={'title1'}>
                        Quét mã
                    </Text>
                    <IconButton
                        type="ionicon"
                        name={torch ? 'flash-sharp' : 'flash-off-sharp'}
                        onPress={() => setTorch((pre) => !pre)}
                        size={theme.typography.title3}
                        color={torch ? theme.colors.main['600'] : theme.colors.white_[10]}
                    />
                </View>

                {/* <View
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                    }}
                >
                    <Button
                        title={'Chọn ảnh QR từ thư viện'}
                        type="clear"
                        icon={{
                            type: 'ionicon',
                            name: 'images-outline',
                            color: theme.colors.white_[10],
                        }}
                        titleStyle={{ color: theme.colors.white_[10] }}
                        // onPress={handleGetImageQrCode}
                        disabled
                    />
                </View> */}
                <View
                    style={{
                        // height: '100%',
                        position: 'absolute',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        left: 0,
                        right: 0,
                        bottom: insets.bottom,
                        zIndex: 1,
                    }}
                >
                    <Text ta="center" color={theme.colors.main['600']} fw="bold" size={'title1'}>
                        VDC - CODE
                    </Text>
                    <Text
                        ta="center"
                        color={theme.colors.white_[10]}
                        size={'body1'}
                        ph={'small'}
                        style={{ zIndex: 1 }}
                    >
                        Quét mã Code để tích điểm, thanh toán, tìm kiếm sản phẩm và nhiều dịch vụ
                        khác
                    </Text>
                </View>
                <BarcodeMask
                    edgeColor={theme.colors.main['600']}
                    edgeWidth={theme.dimens.scale(30)}
                    edgeHeight={theme.dimens.scale(30)}
                    animatedLineColor={theme.colors.main['600']}
                    animatedLineHeight={theme.dimens.verticalScale(20)}
                    showAnimatedLine={false}
                    backgroundColor={'rgba(0,0,0, 0.5)'}
                />
            </View>

            {renderAction()}
        </>
    );
});

export default withAuth(ScanScreen, true);
// export default ScanScreen;
