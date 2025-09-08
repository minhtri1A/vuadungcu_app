import Touch from 'components/Touch';
import { useTheme } from 'hooks';
import React, { memo } from 'react';
import TT, { TooltipProps } from 'react-native-walkthrough-tooltip';

interface Props extends TooltipProps {
    children: React.ReactNode | string;
}

export default memo(function Tooltip(props: Props) {
    const { theme } = useTheme();
    const [open, setOpen] = React.useState(false);

    return (
        <TT
            isVisible={open}
            onClose={() => setOpen(false)}
            {...props}
            backgroundColor={theme.colors.black_['4']}
        >
            <Touch onPress={() => setOpen(true)}>{props.children}</Touch>
        </TT>
    );
});
