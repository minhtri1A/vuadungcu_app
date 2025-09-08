import { Overlay } from '@rneui/themed';
import ThreeDot from 'components/Spinner/ThreeDot';
import { useTheme } from 'hooks';
import React, { memo } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { themeType } from 'theme';

interface Props {
    visible: boolean;
    text?: string | null;
}

//loading navagation
const Loading = memo(function Loanding({ visible, text = null }: Props) {
    const { theme } = useTheme();
    const styles = useStyles(theme);

    return (
        <>
            <Overlay
                isVisible={visible}
                overlayStyle={styles.style_Overlay}
                ModalComponent={Modal}
                statusBarTranslucent={false}
            >
                <View style={styles.view_Indicator}>
                    <ThreeDot color={theme.colors.grey_[300]} />
                </View>
                {text ? <Text style={styles.txt_Loading}>{text}...</Text> : null}
            </Overlay>
        </>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        style_Overlay: {
            backgroundColor: 'rgba(128,128,128,0.3)',
            minWidth: theme.dimens.width * 0.27,
            height: theme.dimens.width * 0.27,
            justifyContent: 'space-evenly',
            alignItems: 'center',
            elevation: 0,
            paddingTop: theme.spacings.extraLarge,
            zIndex: 99999,
        },
        view_Indicator: {
            height: '0%',
            paddingBottom: theme.spacings.tiny,
        },
        txt_Loading: {
            fontSize: theme.typography.body2,
            fontWeight: 'bold',
            color: theme.colors.grey_[300],
        },
    });

export default Loading;
