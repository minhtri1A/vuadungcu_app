import Header from 'components/Header';
import IconButton from 'components/IconButton';
import View from 'components/View';
import { useNavigation, useTheme } from 'hooks';
import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { themeType } from 'theme';
/* eslint-disable react-hooks/exhaustive-deps */

interface Props {}

const TestAnimatedScreen = memo(function TestAnimatedScreen({}: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const navigation = useNavigation();
    //state

    return (
        <>
            <Header
                leftComponent={
                    <IconButton
                        color={theme.colors.slate[900]}
                        type="ionicon"
                        name="arrow-back-outline"
                        onPress={navigation.goBack}
                        size={theme.typography.title4}
                    />
                }
                centerComponent={{
                    text: 'Bảo hành',
                    style: {
                        color: theme.colors.slate[900],
                        fontSize: theme.typography.title2,
                        alignSelf: 'flex-start',
                    },
                }}
                backgroundColor={theme.colors.white_[10]}
                statusBarProps={{ backgroundColor: theme.colors.main['600'] }}
                containerStyle={{ borderBottomWidth: 1 }}
            />

            <View flex={1}></View>
        </>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        tab_indicator: {
            backgroundColor: theme.colors.main['600'],
            height: theme.dimens.verticalScale(2),
            width: theme.dimens.width / 2.5,
        },
        tab_container: {
            backgroundColor: theme.colors.white_[10],
        },
        tab_button: {
            width: theme.dimens.width / 2.5,
        },
        view_wrapTabview: {
            flex: 1,
        },
        //item
        touch_wrap: {
            backgroundColor: theme.colors.white_[10],
            marginTop: theme.spacings.medium,
        },
        view_top: {
            flexDirection: 'row',
            padding: theme.spacings.small,
        },
        view_image: {
            width: '23%',
            aspectRatio: 1,
        },
        view_bottom: {
            padding: theme.spacings.small,
            paddingRight: theme.spacings.tiny,
            borderTopWidth: 1,
            borderTopColor: theme.colors.grey_[200],
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
    });

export default TestAnimatedScreen;

//pending: chờ xử lý
//send,receive(processing): đang xử lý
//success: bảo hành xong
