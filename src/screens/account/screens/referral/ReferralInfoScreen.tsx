import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from 'components/Header2';
import LoadingFetchAPI from 'components/LoadingFetchAPI';
import Text from 'components/Text';
import { useTheme } from 'hooks';
import { PolicyStackParamsList } from 'navigation/type';
import React, { memo, useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import HTML from 'react-native-render-html';
import { services } from 'services';
import { themeType } from 'theme';
import { sendSentryError } from 'utils/storeHelpers';

interface Props {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<PolicyStackParamsList, 'PolicyDetailScreen'>;
}

export default memo(function ReferralInfoScreen({}: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    //state
    const [loading, setLoading] = useState(false);
    const [policyApi, setPolicyApi] = useState<any>(null);
    //value

    useEffect(() => {
        fetchPolicy('event-referral');
    }, []);

    const fetchPolicy = async (policyType: any) => {
        setLoading(true);
        try {
            const result = await services.admin.getArticle(policyType);
            if (result) {
                setLoading(false);
                setPolicyApi(result);
            }
        } catch (error: any) {
            setLoading(false);
            sendSentryError(error, 'fetchPolicy*');
        }
    };

    return (
        <>
            <Header
                center={<Text size={'title2'}>{policyApi?.title}</Text>}
                showGoBack
                bgColor={theme.colors.white_[10]}
                iconGoBackColor={theme.colors.black_[10]}
                statusBarColor={theme.colors.main['500']}
            />
            <ScrollView style={styles.view_container}>
                <LoadingFetchAPI
                    visible={loading}
                    styleView={{ paddingTop: theme.spacings.medium }}
                    color={theme.colors.grey_[500]}
                />

                <HTML
                    source={{
                        html: policyApi?.content ? policyApi?.content : '<p></p>',
                    }}
                    baseStyle={{ color: theme.colors.black_[10] }}
                    contentWidth={theme.dimens.width}
                />
            </ScrollView>
        </>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_container: {
            flex: 1,
            backgroundColor: theme.colors.white_[10],
            paddingLeft: theme.spacings.medium,
            paddingRight: theme.spacings.medium,
        },
    });
