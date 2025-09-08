import { useTheme } from 'hooks';
import React, { memo } from 'react';
import { Linking, Platform, StyleSheet } from 'react-native';
// eslint-disable-next-line no-unused-vars
import { StackNavigationProp } from '@react-navigation/stack';
// eslint-disable-next-line no-unused-vars
import Header from 'components/Header';
import IconButton from 'components/IconButton';
import Image from 'components/Image';
import Text from 'components/Text';
import Touch from 'components/Touch';
import View from 'components/View';
import { themeType } from 'theme';

interface Props {
    navigation: StackNavigationProp<any, any>;
}

export default memo(function IntroductionScreen({ navigation }: Props) {
    const { theme } = useTheme();
    const styles = useStyles(theme);

    const goToCertificateBlue = () => {
        Linking.openURL('http://online.gov.vn/Home/AppDetails/2727');
    };
    const goToCertificateRed = () => {
        Linking.openURL('http://online.gov.vn/Home/AppDetails/2892');
    };

    const goToDMCA = () => {
        if (Platform.OS === 'android') {
            Linking.openURL('https://www.dmca.com/r/6x23l09');
            return;
        }
        Linking.openURL('https://www.dmca.com/r/9j20643');
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
                    text: 'Giới thiệu',
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
                <Text mt="medium" fw="bold">
                    CÔNG TY TNHH VUA DỤNG CỤ
                </Text>
                <Text ta="justify">Người đại diện theo pháp luật: Nguyễn Trường Sơn</Text>
                <Text mt={'small'} ta="justify">
                    Giấy chứng nhận đăng ký doanh nghiệp số 2100672489, do Sở Kế Hoạch Và Đầu Tư
                    Tỉnh Trà Vinh cấp lần đầu ngày 10/01/2022.
                </Text>
                <Text mt={'tiny'} ta="justify">
                    <Text fw="bold">Địa chỉ: </Text>
                    Số 12 Trần Phú, Khóm 4, Phường 6, TP. Trà Vinh, Tỉnh Trà Vinh.
                </Text>
                <Text mt={'tiny'}>
                    <Text fw="bold">Email: </Text>
                    vuadungcu74@gmail.com
                </Text>
                <Text mt={'tiny'}>
                    <Text fw="bold">Điện thoại: </Text>
                    0336 948 484
                </Text>

                <Text
                    size={'body1'}
                    mt="tiny"
                    color={theme.colors.grey_[500]}
                    fw="bold"
                    ta="justify"
                >
                    © 2023 Bản quyền thuộc về Công Ty TNHH Vua Dụng Cụ
                </Text>
                <View aI="center">
                    <View flexDirect="row" jC="center">
                        <Touch
                            w={theme.dimens.scale(150)}
                            h={100}
                            ratio={2 / 1}
                            mr={'small'}
                            activeOpacity={0.8}
                            onPress={goToCertificateBlue}
                        >
                            <Image
                                source={require('asset/img_certificate_blue.png')}
                                resizeMode="contain"
                            />
                        </Touch>
                        <Touch
                            w={theme.dimens.scale(150)}
                            h={100}
                            ratio={2 / 1}
                            activeOpacity={0.8}
                            onPress={goToCertificateRed}
                        >
                            <Image
                                source={require('asset/img_certificate_red.png')}
                                resizeMode="contain"
                            />
                        </Touch>
                    </View>
                    <Touch
                        w={theme.dimens.scale(80)}
                        h={40}
                        ratio={2 / 1}
                        activeOpacity={0.8}
                        onPress={goToDMCA}
                    >
                        <Image
                            source={{
                                uri: 'https://images.dmca.com/Badges/dmca_protected_10_120.png?ID=eae61e42-5961-4e8e-91d7-a14a2153ce0c',
                            }}
                            resizeMode="contain"
                        />
                    </Touch>
                </View>
            </View>
        </>
    );
});
const useStyles = (theme: themeType) =>
    StyleSheet.create({
        list_containerStyle: {
            justifyContent: 'space-between',
            padding: theme.spacings.medium,
            paddingLeft: theme.spacings.small,
            paddingRight: theme.spacings.small,
        },
        //
        view_body: {
            padding: theme.spacings.medium,
            backgroundColor: theme.colors.white_[10],
            flex: 1,
        },
        //
        touch_img: {
            alignItems: 'center',
        },
        img: {
            width: theme.dimens.width * 0.42,
            height: 100,
        },
    });
