import { StackNavigationProp } from '@react-navigation/stack';
import { ListItem } from '@rneui/themed';
import Divider from 'components/Divider';
import Header from 'components/Header2';
import Text from 'components/Text';
import { NAVIGATION_TO_POLICY_DETAIL_SCREEN } from 'const/routes';
import { useTheme } from 'hooks';
import { ParamsArticleType } from 'models';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { themeType } from 'theme';

interface Props {
    navigation: StackNavigationProp<any, any>;
}

export default memo(function PolicyScreen({ navigation }: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles(theme);
    //value
    const POLICIES: Array<{ title: string; link: ParamsArticleType }> = [
        {
            title: 'Chính sách bảo mật thông tin',
            link: 'privacy',
        },
        {
            title: 'Chính sách vận chuyển',
            link: 'shipping',
        },
        {
            title: 'Chính sách kiểm hàng và đổi trả',
            link: 'check-return',
        },
        {
            title: 'Chính sách thanh toán',
            link: 'payment',
        },
        {
            title: 'Chính sách bảo hành',
            link: 'warranty',
        },

        {
            title: 'Xu Dụng Cụ',
            link: 'event-coin',
        },
    ];

    const goToPolicyDetailScreen = (type: ParamsArticleType) => () => {
        navigation.navigate(NAVIGATION_TO_POLICY_DETAIL_SCREEN, { type });
    };

    return (
        <>
            <Header
                center={
                    <Text size={'title2'} ta="center">
                        Chính sách Vua dụng cụ
                    </Text>
                }
                showGoBack
                iconGoBackColor={theme.colors.black_[10]}
                bgColor={theme.colors.white_[10]}
                statusBarColor={theme.colors.main[500]}
            />

            <View>
                <Divider />
                {POLICIES.map((v, i) => (
                    <ListItem
                        key={i}
                        bottomDivider
                        containerStyle={styles.list_containerStyle}
                        onPress={goToPolicyDetailScreen(v.link)}
                    >
                        <ListItem.Title
                            style={{
                                fontSize: theme.typography.body2,
                                color: theme.colors.black_[10],
                            }}
                        >
                            {v.title}
                        </ListItem.Title>
                        <ListItem.Chevron size={theme.typography.body3} />
                    </ListItem>
                ))}
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
            backgroundColor: theme.colors.white_[10],
        },
    });
