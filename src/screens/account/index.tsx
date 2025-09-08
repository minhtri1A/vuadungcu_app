import { StackNavigationProp } from '@react-navigation/stack';
import Header from 'components/Header';
import { useCustomerSwr, useTheme } from 'hooks';
import React, { memo } from 'react';
import { ScrollView, View } from 'react-native';
import ExtraInfo from './components/ExtraInfo';
import PersonalInfo from './components/PersonalInfo';
import VerifyInfo from './components/VerifyInfo';
import useStyles from './styles';

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
                centerTitle="Tài khoản"
                backgroundColor={theme.colors.white_[10]}
                shadow
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
