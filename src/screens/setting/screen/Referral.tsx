import { useTheme } from 'hooks';
import React, { memo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
// eslint-disable-next-line no-unused-vars
import { StackNavigationProp } from '@react-navigation/stack';
// eslint-disable-next-line no-unused-vars
import Clipboard from '@react-native-clipboard/clipboard';
import Header from 'components/Header';
import IconButton from 'components/IconButton';
import Text from 'components/Text';
import View from 'components/View';
import { REACT_NATIVE_APP_WEB_URL } from 'const/env';
import useArticleSwr from 'hooks/swr/articleSwr/useArticleSwr';
import { showMessage } from 'react-native-flash-message';
import { ScrollView } from 'react-native-gesture-handler';
import QRCode from 'react-native-qrcode-svg';
import HTML from 'react-native-render-html';
import Share from 'react-native-share';
import ViewShot, { captureRef } from 'react-native-view-shot';
import { services } from 'services';
import useSWR from 'swr';
import { themeType } from 'theme';
import { isEmpty } from 'utils/helpers';
import { sendSentryError } from 'utils/storeHelpers';

interface Props {
    navigation: StackNavigationProp<any, any>;
}

export default memo(function ReferralScreen({ navigation }: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles(theme);

    //state
    // const [openSheet, setOpenSheet] = useState(false);
    const [stringCopy, setStringCopy] = useState('');

    //swr
    const { data } = useSWR<any, any>(
        '/customers/referral',
        () => services.customer.getCustomerReferralCode(),
        {}
    );
    const { data: dataArticle } = useArticleSwr('event-referral');

    //value
    const referral_code = data?.referral_code;
    const link_referral_code = `${REACT_NATIVE_APP_WEB_URL}/download?referral_code=${referral_code}`;

    //ref
    const qrCodeRef = useRef(null);

    //handle
    const copyToClipboard = (text: string) => () => {
        Clipboard.setString(text);
        setStringCopy(text);
        showMessage({
            message: 'Copy mã giới thiệu thành công!',
            icon: 'success',
            duration: 1000,
            position: 'top',
        });
    };

    const shareText = (text: string) => () => {
        Share.open({
            title: 'Chia sẽ mã giới thiệu',
            message: text,
        })
            .then(() => {})
            .catch((err) => {
                sendSentryError(err, 'shareText');
            });
    };

    const shareQRCode = async () => {
        try {
            // Chụp QR Code dưới dạng hình ảnh
            const uri = await captureRef(qrCodeRef, {
                format: 'png',
                quality: 1,
            });

            // Chia sẻ hình ảnh QR Code
            await Share.open({
                title: 'Chia sẻ QR Code',
                url: uri,
                type: 'image/png',
            });
        } catch (error) {
            sendSentryError(error, 'shareQRCode**');
        }
    };

    return (
        <>
            <Header
                leftComponent={
                    <IconButton
                        type="ionicon"
                        name="arrow-back-outline"
                        onPress={navigation.goBack}
                        size={theme.typography.title3}
                        color={theme.colors.slate[900]}
                    />
                }
                centerComponent={{
                    text: 'Chia sẻ ứng dụng tích xu',
                    style: {
                        color: theme.colors.slate[900],
                        fontSize: theme.typography.title2,
                        // alignSelf: 'flex-start',
                    },
                }}
                backgroundColor={theme.colors.white_[10]}
                statusBarProps={{ backgroundColor: theme.colors.main['600'] }}
                containerStyle={{ borderBottomWidth: 1 }}
                shadow
            />
            <View style={styles.view_body}>
                <ScrollView>
                    {/* user code */}
                    <View>
                        {/* link */}
                        <Text fw="bold">Liên kết giới thiệu của bạn</Text>
                        <View style={styles.view_user_code}>
                            <Text style={styles.txt_user_code} numberOfLines={1}>
                                {link_referral_code}
                            </Text>
                            <IconButton
                                type="ionicon"
                                name={stringCopy === link_referral_code ? 'copy' : 'copy-outline'}
                                color={theme.colors.slate[900]}
                                ml={'medium'}
                                onPress={copyToClipboard(link_referral_code)}
                            />
                            <IconButton
                                type="ionicon"
                                name={'share-outline'}
                                color={theme.colors.slate[900]}
                                ml={'medium'}
                                onPress={shareText(link_referral_code)}
                            />
                        </View>
                        {/* qr code */}
                        <Text mt="medium" fw="bold">
                            Mã giới thiệu của bạn
                        </Text>
                        <View style={styles.view_user_code}>
                            <Text style={styles.txt_user_code} numberOfLines={1}>
                                {referral_code}
                            </Text>
                            <IconButton
                                type="ionicon"
                                name={stringCopy === referral_code ? 'copy' : 'copy-outline'}
                                color={theme.colors.slate[900]}
                                ml={'medium'}
                                onPress={copyToClipboard(referral_code)}
                            />
                            <IconButton
                                type="ionicon"
                                name={'share-outline'}
                                color={theme.colors.slate[900]}
                                ml={'medium'}
                                onPress={shareQRCode}
                            />
                        </View>
                        {/* qr */}
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: theme.spacings.extraLarge,
                            }}
                        >
                            {/* <Text mv={'medium'}>(Quét mã QR Code để nhập mã giới thiệu)</Text> */}
                            <ViewShot ref={qrCodeRef} style={styles.view_qr}>
                                <QRCode
                                    value={`NTL_REFERRAL:${referral_code}`}
                                    size={theme.dimens.width * 0.7}
                                />
                            </ViewShot>
                        </View>
                        {/* descript */}
                        <View
                            style={{
                                borderTopWidth: 1,
                                borderTopColor: theme.colors.grey_[200],
                                marginTop: theme.spacings.large,
                            }}
                        >
                            <HTML
                                source={{
                                    html: !isEmpty(dataArticle?.content)
                                        ? dataArticle?.content
                                        : '<p> </p>',
                                }}
                                contentWidth={theme.dimens.width * 0.92}
                                baseStyle={{ color: theme.colors.black_[10] }}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        </>
    );
});
const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_body: {
            padding: theme.spacings.medium,
            backgroundColor: theme.colors.white_[10],
            flex: 1,
        },
        view_user_code: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: theme.spacings.small,
        },
        txt_user_code: {
            flex: 1,
            padding: theme.spacings.small,
            borderWidth: 1,
            borderColor: theme.colors.grey_[200],
            backgroundColor: theme.colors.grey_[100],
        },
        view_referrer_code: {
            borderTopWidth: 1,
            borderTopColor: theme.colors.grey_[200],
            marginTop: theme.spacings.large,
            paddingTop: theme.spacings.small,
            alignItems: 'center',
        },
        txt_referrer_code: {
            padding: theme.spacings.small,
            borderWidth: 1,
            borderColor: theme.colors.grey_[200],
            backgroundColor: theme.colors.grey_[100],
            width: theme.dimens.width * 0.9,
        },
        view_qr: {
            borderRadius: 5,
            backgroundColor: theme.colors.white_[10],
            padding: 10,
            marginBottom: theme.spacings.medium,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 8,
            },
            shadowOpacity: 0.44,
            shadowRadius: 10.32,

            elevation: 16,
        },
    });
