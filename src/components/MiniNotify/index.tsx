/* eslint-disable react-hooks/exhaustive-deps */
import Badge from 'components/Badge';
import IconButton from 'components/IconButton';
import { useNavigate, useTheme } from 'hooks';
import React, { memo } from 'react';
import { Animated } from 'react-native';

interface IProps {
    size?: any;
    color?: string;
}

export default memo(function MiniNotify({ size, color }: IProps) {
    //hook
    const { theme } = useTheme();
    const navigate = useNavigate();
    // const styles = useStyles(theme);
    // const [visible, setVisible] = useState(false);

    return (
        <Animated.View>
            <IconButton
                type="ionicon"
                name={'notifications-outline'}
                size={size ? size : theme.typography.size(24)}
                color={color || theme.colors.white_[10]}
                // onPress={navigate.NOTIFY_ROUTE()}
            />
            <Badge
                visible={false}
                title={'1'}
                top={-theme.dimens.verticalScale(5)}
                right={-theme.dimens.scale(4)}
                width={theme.dimens.scale(17)}
                height={theme.dimens.scale(17)}
            />
        </Animated.View>
    );
});
