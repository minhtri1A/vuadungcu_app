/* eslint-disable react-hooks/exhaustive-deps */
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

export default memo(function PolicyDetail({ route }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    //state
    const [loading, setLoading] = useState(false);
    const [policyApi, setPolicyApi] = useState<any>(null);
    //value

    useEffect(() => {
        fetchPolicy(route.params.type);
    }, []);

    const fetchPolicy = async (policyType: any) => {
        setLoading(true);
        try {
            const result = await services.admin.getArticle(policyType);
            if (result) {
                setLoading(false);
                setPolicyApi(result);
            }
        } catch (error) {
            setLoading(false);
            sendSentryError(error, 'fetchPolicy**');
        }
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
            <ScrollView style={styles.view_container}>
                <LoadingFetchAPI
                    visible={loading}
                    styleView={{ paddingTop: theme.spacings.medium }}
                    color={theme.colors.grey_[500]}
                />
                <Text size={'body3'} fw="bold" ta="center" pt={'medium'}>
                    {policyApi?.title}
                </Text>
                <HTML
                    source={{
                        html: policyApi?.content ? policyApi?.content : '<p></p>',
                    }}
                    // baseStyle={{ fontSize: theme.typography.body2 }}
                    contentWidth={theme.dimens.width * 1}
                    // renderersProps={{
                    //     img: {
                    //         enableExperimentalPercentWidth: true,
                    //     },
                    // }}
                    tagsStyles={{
                        // p: {
                        //     marginLeft: 0,
                        //     backgroundColor: 'red',
                        // },
                        img: {
                            // alignSelf: 'flex-start',
                            width: theme.dimens.width * 0.8,
                            padding: 0,
                            margin: 0,
                        },
                    }}
                    baseStyle={{ color: theme.colors.black_[10] }}
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
