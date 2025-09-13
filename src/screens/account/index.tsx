import { StackNavigationProp } from '@react-navigation/stack';
import { useCustomerSwr, useTheme } from 'hooks';
import React, { memo } from 'react';
import { ScrollView, View } from 'react-native';
import ExtraInfo from './components/ExtraInfo';
import PersonalInfo from './components/PersonalInfo';
import VerifyInfo from './components/VerifyInfo';
import useStyles from './styles';
import Header from 'components/Header2';
import Text from 'components/Text';

interface Props {
    navigation: StackNavigationProp<any, any>;
}

export default memo(function AccountScreen({}: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles();
    //swr
    const customerSwr = useCustomerSwr('all');

    return (
        <>
            <Header
                showGoBack
                iconGoBackColor={theme.colors.black_[10]}
                center={<Text size={'title1'}>Tài khoản</Text>}
                bgColor={theme.colors.white_[10]}
                statusBarColor={theme.colors.main['600']}
            />
            <View style={styles.view_container}>
                <ScrollView
                    style={styles.scrollview}
                    keyboardDismissMode="none"
                    keyboardShouldPersistTaps="never"
                >
                    {/* personal */}
                    <PersonalInfo customerSwr={customerSwr} />
                    {/* verify */}
                    <VerifyInfo customerSwr={customerSwr} />
                    {/* other */}
                    <ExtraInfo customerSwr={customerSwr} />
                </ScrollView>
            </View>
        </>
    );
});
