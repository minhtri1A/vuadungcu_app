import { StackNavigationProp } from '@react-navigation/stack';
import Button from 'components/Button';
import Header from 'components/Header2';
import Text from 'components/Text';
import View from 'components/View';
import { NAVIGATION_DELETE_ACCOUNT_CONFIRM_SCREEN } from 'const/routes';
import { useTheme } from 'hooks';
import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { themeType } from 'theme';

interface Props {
    navigation: StackNavigationProp<any, any>;
}

export default memo(function DeleteAccountScreen({ navigation }: Props) {
    const { theme } = useTheme();
    const styles = useStyles(theme);

    return (
        <>
            <Header
                center={
                    <Text size={'title2'} ta="center">
                        Yêu cầu xoá tài khoản
                    </Text>
                }
                showGoBack
                iconGoBackColor={theme.colors.black_[10]}
                bgColor={theme.colors.white_[10]}
                statusBarColor={theme.colors.main[500]}
            />
            {/* body */}
            <View style={styles.view_body}>
                <View bg={theme.colors.main['50']} p={'medium'}>
                    <Text size={'body3'}>
                        <Text fw="bold" size={'body3'}>
                            Vua Dụng Cụ
                        </Text>{' '}
                        rất tiếc vì bạn xoá tài khoản.{' '}
                        <Text size={'body3'} color="red">
                            Trước khi xoá tài khoản bạn vui lòng đọc kĩ các điều khoản sau:
                        </Text>
                    </Text>
                </View>
                <View>
                    <Text p={'medium'} bg={theme.colors.main['50']} mh={'medium'} mt={'medium'}>
                        <Text fw="bold">1.</Text> Bạn không thể xoá tài khoản khi có đơn hàng có
                        trạng thái{' '}
                        <Text fw="bold">Chờ xử lý, Chờ vận chuyển và Đang vận chuyển</Text>
                    </Text>
                    <Text p={'medium'} bg={theme.colors.main['50']} mh={'medium'} mt={'medium'}>
                        <Text fw="bold">2.</Text>{' '}
                        <Text fw="bold">Điểm tích luỹ, xu và các tích luỹ khác</Text> sẽ không thể
                        sử dụng được nữa
                    </Text>
                    <Text p={'medium'} bg={theme.colors.main['50']} mh={'medium'} mt={'medium'}>
                        <Text fw="bold">3.</Text> Sau khi xoá thành công, thông tin giao dịch của
                        tài khoản vẫn được Vua Dụng Cụ <Text fw="bold">lưu trữ để kiểm kê</Text>.
                    </Text>
                    <Text p={'medium'} bg={theme.colors.main['50']} mh={'medium'} mt={'medium'}>
                        <Text fw="bold">4.</Text> Bạn{' '}
                        <Text fw="bold">không thể đăng nhập lại tài khoản</Text> sau khi đã xoá
                        thành công.
                    </Text>
                    <Text p={'medium'} bg={theme.colors.main['50']} mh={'medium'} mt={'medium'}>
                        <Text fw="bold">5.</Text> Các thông tin{' '}
                        <Text fw="bold">
                            liên kết mạng xã hội, email, số điện thoại của bạn không thể sử dụng lại
                        </Text>{' '}
                        trong hệ thống Vua Dụng Cụ sau khi xoá thành công
                    </Text>
                </View>
            </View>

            {/* button */}
            <View flexDirect="row" bg={theme.colors.white_[10]} jC="space-evenly" pb={'small'}>
                <Button
                    title={'Huỷ bỏ'}
                    type="outline"
                    color={theme.colors.main['600']}
                    containerWidth="48%"
                    onPress={navigation.goBack}
                />
                <Button
                    title={'Tiếp tục'}
                    containerWidth="48%"
                    onPress={() => {
                        navigation.navigate(NAVIGATION_DELETE_ACCOUNT_CONFIRM_SCREEN);
                    }}
                />
            </View>
        </>
    );
});
const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_body: {
            backgroundColor: theme.colors.white_[10],
            flex: 1,
        },
        //
    });
