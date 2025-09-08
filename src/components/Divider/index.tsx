/* eslint-disable react-native/no-inline-styles */
import { Divider, DividerProps } from '@rneui/themed';
import { useTheme } from 'hooks';
import React, { memo } from 'react';

interface Props extends DividerProps {
    height?: any;
    color?: any;
    mt?: any;
}

export default memo(function Divider_(props: Props) {
    const { theme } = useTheme();
    const { height = theme.spacings.small, color = theme.colors.grey_[100], mt } = props;
    return (
        <Divider
            style={{ height: height, backgroundColor: color, marginTop: mt, borderBottomWidth: 0 }}
            {...props}
        />
    );
});
