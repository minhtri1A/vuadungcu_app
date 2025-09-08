import { useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StatusBar, StatusBarProps } from 'react-native';

interface Props extends StatusBarProps {}

//check hien thi status bar
export default function FocusAwareStatusBar(props: Props) {
    const isFocused = useIsFocused();
    useEffect(() => {
        StatusBar.setHidden(false);
        // return () => {
        //     StatusBar.setHidden(true);
        // };
    }, []);

    return isFocused ? <StatusBar {...props} /> : null;
}
