/* eslint-disable react-native/no-inline-styles */
import View from 'components/View';
import { useTheme } from 'hooks';
import React, { memo } from 'react';
import { Platform, Switch as SW, SwitchProps } from 'react-native';

interface Props extends SwitchProps {}

export default memo(function Switch(props: Props) {
    const { theme } = useTheme();

    return (
        <View mh={Platform.OS === 'ios' ? 'medium' : undefined}>
            <SW
                thumbColor={props.value ? theme.colors.main[500] : theme.colors.grey_[400]}
                trackColor={{ true: theme.colors.main[200], false: theme.colors.grey_[300] }}
                {...props}
            />
        </View>
    );
});
