import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from 'components/Header2';
import Text from 'components/Text';
import { useTheme } from 'hooks';
import { AccountStackParamsList } from 'navigation/type';
import React, { memo } from 'react';
import EmailEdit from './EmailEdit';
import TelephoneEdit from './TelephoneEdit';
import UsernameEdit from './UsernameEdit';
// import useStyles from './../../styles';

interface Props {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<AccountStackParamsList, 'EditVerifyScreen'>;
}

export default memo(function EditVerifyScreen({ route }: Props) {
    //hook
    const { theme } = useTheme();
    //value
    const { type, title } = route.params;

    return (
        <>
            <Header
                showGoBack
                iconGoBackColor={theme.colors.black_[10]}
                center={<Text size={'title1'}>Chỉnh sửa {title}</Text>}
                bgColor={theme.colors.white_[10]}
                statusBarColor={theme.colors.main['500']}
            />
            {type === 'username' ? (
                <UsernameEdit />
            ) : type === 'email' ? (
                <EmailEdit />
            ) : (
                <TelephoneEdit />
            )}
        </>
    );
});
