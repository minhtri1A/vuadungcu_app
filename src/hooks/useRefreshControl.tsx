import { RefreshControl as RF, RefreshControlProps } from 'react-native';
/* eslint-disable react-hooks/exhaustive-deps */
import { useTheme } from '@rneui/themed';
import { useState } from 'react';

export const useRefreshControl = (
    onSuccess?: () => void,
    config?: Partial<RefreshControlProps>
) => {
    const [refreshing, setRefreshing] = useState(false);
    const { theme } = useTheme();

    const refreshControl = () => (
        <RF
            {...config}
            onRefresh={onRefresh}
            refreshing={refreshing}
            colors={[theme.colors.main['600']]}
        />
    );

    const onRefresh = () => {
        setRefreshing(true);
        const timeout = setTimeout(() => {
            setRefreshing(false);
            onSuccess && onSuccess();
            clearTimeout(timeout);
        }, 1000);
    };
    return {
        refreshing,
        refreshControl,
        onRefresh,
    };
};
