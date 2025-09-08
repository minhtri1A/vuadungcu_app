/* eslint-disable react-hooks/exhaustive-deps */
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from 'components/Header';
import IconButton from 'components/IconButton';
import { useEventCoinSwr, useEventQrCodeSwr, useTheme } from 'hooks';
import { EventCoinConfigResponseType, EventQrCodeConfigResponseType } from 'models';
import { EventStackParamsList } from 'navigation/type';
import React, { memo, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import HTML from 'react-native-render-html';
import { themeType } from 'theme';
import { isEmpty } from 'utils/helpers';

interface Props {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<EventStackParamsList, 'EventDetailScreen'>;
}

export default memo(function EventDetail({ navigation, route }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);

    //swr
    const { data: qrConfig, mutate: mutateQR } = useEventQrCodeSwr<EventQrCodeConfigResponseType>(
        'config',
        {
            revalidateOnMount: false,
        }
    );
    const { data: coinConfig, mutate: mutateCoin } = useEventCoinSwr<EventCoinConfigResponseType>(
        'config',
        {
            revalidateOnMount: false,
        }
    );
    //value
    const configType = route.params.type;
    const titleHeader =
        configType === 'coin'
            ? 'Sự kiện tích xu'
            : configType === 'qr_code'
            ? 'Sự kiện QRCode'
            : 'Mua hàng tích điểm';
    const content: any =
        configType === 'coin'
            ? coinConfig?.coin_description
            : configType === 'qr_code'
            ? qrConfig?.qr_description
            : '';
    useEffect(() => {
        //check fetch config
        if (configType === 'qr_code') {
            mutateQR();
        } else if (configType === 'coin') {
            mutateCoin();
        }
    }, [configType]);

    return (
        <>
            <Header
                leftComponent={
                    <IconButton
                        type="ionicon"
                        name="arrow-back-outline"
                        onPress={navigation.goBack}
                        size={theme.typography.title3}
                        color={theme.colors.white_[10]}
                    />
                }
                centerComponent={{
                    text: titleHeader,
                    style: { color: theme.colors.white_[10], fontSize: theme.typography.title2 },
                }}
            />

            <ScrollView style={styles.view_container}>
                {/* <LoadingFetchAPI
                    visible={loadingInit}
                    styleView={{ paddingTop: theme.spacings.medium }}
                    color={theme.colors.grey_[500]}
                /> */}
                <HTML
                    source={{
                        html: !isEmpty(content) ? content : '<p> </p>',
                    }}
                    contentWidth={theme.dimens.width * 0.92}
                    baseStyle={{ color: theme.colors.black_[10], fontSize: theme.typography.body2 }}
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
