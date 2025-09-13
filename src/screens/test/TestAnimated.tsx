import Header from 'components/Header2';
import Text from 'components/Text';
import View from 'components/View';
import { useTheme } from 'hooks';
import React, { memo } from 'react';
/* eslint-disable react-hooks/exhaustive-deps */

interface Props {}

const TestAnimatedScreen = memo(function TestAnimatedScreen({}: Props) {
    //hook
    const { theme } = useTheme();
    //state

    return (
        <>
            <Header
                center={
                    <Text size={'title2'} ta="center">
                        Thanh Toán
                    </Text>
                }
                showGoBack
                iconGoBackColor={theme.colors.black_[10]}
                bgColor={theme.colors.white_[10]}
            />

            <View flex={1}></View>
        </>
    );
});

export default TestAnimatedScreen;

//pending: chờ xử lý
//send,receive(processing): đang xử lý
//success: bảo hành xong
