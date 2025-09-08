import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from 'components/Header';
import IconButton from 'components/IconButton';
import { useTheme } from 'hooks';
import { AccountStackParamsList } from 'navigation/type';
import React, { memo } from 'react';
import EmailEdit from './EmailEdit';
import TelephoneEdit from './TelephoneEdit';
import UsernameEdit from './UsernameEdit';
/* eslint-disable react-hooks/exhaustive-deps */
// import useStyles from './../../styles';

interface Props {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<AccountStackParamsList, 'EditVerifyScreen'>;
}

export default memo(function EditVerifyScreen({ navigation, route }: Props) {
    //hook
    const { theme } = useTheme();
    //value
    const { type, title } = route.params;

    return (
        <>
            <Header
                centerComponent={{
                    text: `Chỉnh sửa ${title}`,
                    style: {
                        color: theme.colors.slate[900],
                        fontSize: theme.typography.title1,
                        marginTop: theme.spacings.tiny,
                    },
                }}
                leftComponent={
                    <IconButton
                        type="ionicon"
                        name="arrow-back-outline"
                        onPress={navigation.goBack}
                        size={theme.typography.title3}
                        color={theme.colors.slate[900]}
                    />
                }
                backgroundColor={theme.colors.white_[10]}
                shadow
                statusBarColor={theme.colors.main['600']}
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
