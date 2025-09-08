import Button from 'components/Button';
import Text from 'components/Text';
import { SET_CONNECTED_INTERNET } from 'features/action';
import { useAppDispatch, useTheme } from 'hooks';
import React, { memo } from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { isConnectedToInternet } from 'utils/helpers';

interface Props {
    reConnectedInternetProps?: any;
    height?: any;
}

const Disconnect = memo(function Disconnect({ reConnectedInternetProps, height }: Props) {
    const { theme } = useTheme();
    const dispatch = useAppDispatch();

    const reConnectedInternet = async () => {
        if (await isConnectedToInternet()) {
            dispatch(SET_CONNECTED_INTERNET(true));
            reConnectedInternetProps();
        }
    };

    return (
        <View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.colors.white_[10],
                height: height,
            }}
        >
            <Icon name={'access-point-network-off'} size={100} color={theme.colors.grey_[300]} />
            <Text size={'body2'} mt={theme.spacings.medium}>
                Kết nối mạng thất bại
            </Text>
            <Text size={'body2'} color={theme.colors.grey_[500]} mb={theme.spacings.medium}>
                Vui lòng kết nối mạng với thiết bị.
            </Text>
            <Button
                title={'Thử lại'}
                width={theme.dimens.width * 0.6}
                onPress={reConnectedInternet}
            />
        </View>
    );
});

export default Disconnect;
