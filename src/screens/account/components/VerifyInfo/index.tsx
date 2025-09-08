import { Icon, ListItem } from '@rneui/themed';
import Text from 'components/Text';
import { NAVIGATION_EDIT_VERIFY_SCREEN } from 'const/routes';
import { useTheme } from 'hooks';
import { CustomerSwrType } from 'models';
import * as RootNavigation from 'navigation/RootNavigation';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { themeType } from 'theme';

interface Props {
    customerSwr: CustomerSwrType;
}

export default memo(function VerifyInfo({ customerSwr }: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles(theme);
    //swr
    const { customers: verifyInfo } = customerSwr;
    //value
    const { username, email, email_confirm, telephone, telephone_confirm } = verifyInfo;

    //navigate to edit screen
    const navigateAccountEditScreen = (type?: string, title?: string) => () => {
        RootNavigation.navigate(NAVIGATION_EDIT_VERIFY_SCREEN, {
            type,
            title,
        });
    };

    return (
        <>
            {/* verify info */}
            <View style={styles.view_titleStyle}>
                <Text fw="bold" color={theme.colors.grey_[400]}>
                    Thông tin tài khoản
                </Text>
            </View>
            {/* ---username--- */}
            <ListItem
                bottomDivider
                containerStyle={styles.list_containerStyle}
                onPress={navigateAccountEditScreen('username', 'Tài khoản')}
            >
                <ListItem.Content>
                    <View style={styles.view_listContent}>
                        <ListItem.Title style={styles.list_title_style}>Tài khoản</ListItem.Title>
                    </View>
                </ListItem.Content>
                <ListItem.Title numberOfLines={1} style={styles.list_titleValue}>
                    {username}
                </ListItem.Title>
                <ListItem.Chevron size={theme.typography.body3} />
            </ListItem>
            {/* ---telephone--- */}
            <ListItem
                bottomDivider
                containerStyle={styles.list_containerStyle}
                onPress={navigateAccountEditScreen('telephone', 'Số điện thoại')}
            >
                <ListItem.Content>
                    <View style={styles.view_listContent}>
                        <ListItem.Title style={styles.list_title_style}>
                            Số điện thoại
                        </ListItem.Title>
                        <Icon
                            type="ionicon"
                            name={
                                telephone_confirm === 'Y'
                                    ? 'checkmark-circle-outline'
                                    : 'alert-outline'
                            }
                            size={theme.typography.body2}
                            color={
                                telephone_confirm === 'Y'
                                    ? theme.colors.green['500']
                                    : theme.colors.main['600']
                            }
                        />
                    </View>
                </ListItem.Content>
                <ListItem.Title style={styles.list_titleValue}>
                    {telephone ? telephone : 'Chưa có số điện thoại'}
                </ListItem.Title>
                <ListItem.Chevron size={theme.typography.body3} />
            </ListItem>
            {/* ---email--- */}
            <ListItem
                containerStyle={styles.list_containerStyle}
                onPress={navigateAccountEditScreen('email', 'Email')}
                hasTVPreferredFocus
            >
                <ListItem.Content>
                    <View style={styles.view_listContent}>
                        <ListItem.Title style={styles.list_title_style}>Email</ListItem.Title>
                        <Icon
                            type="ionicon"
                            name={
                                email_confirm === 'Y' ? 'checkmark-circle-outline' : 'alert-outline'
                            }
                            size={theme.typography.body2}
                            color={
                                email_confirm === 'Y'
                                    ? theme.colors.green['500']
                                    : theme.colors.main['600']
                            }
                        />
                    </View>
                </ListItem.Content>
                <ListItem.Title numberOfLines={1} style={styles.list_titleValue}>
                    {email ? email : 'Chưa có email'}
                </ListItem.Title>
                <ListItem.Chevron size={theme.typography.body3} />
            </ListItem>
        </>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_titleStyle: {
            padding: theme.spacings.small,
        },
        list_containerStyle: {
            justifyContent: 'space-between',
            padding: theme.spacings.medium,
            paddingLeft: theme.spacings.small,
            paddingRight: theme.spacings.small,
            backgroundColor: theme.colors.white_[10],
        },
        list_titleValue: {
            flex: 1,
            textAlign: 'right',
            color: theme.colors.grey_[500],
            fontSize: theme.typography.body1,
        },
        view_listContent: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        list_title_style: {
            fontSize: theme.typography.body2,
            color: theme.colors.black_[10],
        },
        list_sub_title_style: {
            fontSize: theme.typography.sub2,
        },
    });
