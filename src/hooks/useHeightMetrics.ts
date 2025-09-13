/* eslint-disable react-hooks/exhaustive-deps */

import { useMemo } from 'react';
import { NativeModules, Platform, StatusBar } from 'react-native';
import { useTheme } from './useCommon';

// hook lay thong tin chieu cao cua cac thanh phan can thiet

function getStatusBarHeight() {
    const { StatusBarManager } = NativeModules;
    if (Platform.OS === 'ios') {
        return StatusBarManager?.HEIGHT || 20; // iOS default ~20pt, notch cao hơn
    }
    return StatusBar.currentHeight || 0; // Android
}

const useHeightMetrics = (includeStatusBar: boolean = true) => {
    const { theme } = useTheme();
    return useMemo(() => {
        const statusBarHeight = getStatusBarHeight();

        let headerBaseHeight;
        if (Platform.OS === 'ios') {
            headerBaseHeight = theme.dimens.verticalScale(42); // iOS default
        } else {
            headerBaseHeight = theme.dimens.verticalScale(50); // Android default
        }
        const headerHeight = includeStatusBar
            ? headerBaseHeight + statusBarHeight
            : headerBaseHeight;
        return {
            headerHeight,
            headerBaseHeight,
            statusBarHeight,
        };
    }, []);
};

export default useHeightMetrics;
