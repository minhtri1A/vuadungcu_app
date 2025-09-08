import { useFocusEffect, useNavigation as useNa } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme as ut } from '@rneui/themed';
import type { AppDispatch, RootState } from 'app/store';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Alert, BackHandler } from 'react-native';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import getMessage from './getMessage';
import useAuthPhoneNumber from './useAuthPhoneNumber';
// import { makeStylesType } from './hooksType';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

//pre value
const usePrevious = (value: any) => {
    const ref: any = useRef(null);
    useEffect(() => {
        ref.prevLateVal = value;
    });
    return ref?.prevLateVal;
};
//ui theme
// const useTheme = () => useContext(ThemeContext);
const useTheme = () => ut();
//user login
const useIsLogin = () => {
    const token = useAppSelector((state) => state.auth.token);
    return useMemo(() => !!(token?.access_token && token?.refresh_token), [token]);
};
//check internet
const useInternet = () => {
    const isInternet = useAppSelector((state) => state.apps.isConnectedInternet);
    return isInternet;
};
//prevent exists app
const usePreventAppExist = () => {
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                Alert.alert('', 'Bạn có muốn đóng ứng dụng này không ?', [
                    {
                        text: 'Không',
                        onPress: () => null,
                        style: 'cancel',
                    },
                    { text: 'Có', onPress: () => BackHandler.exitApp() },
                ]);
                return true;
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => subscription.remove();
        }, [])
    );
};
//navigation
const useNavigation = () => {
    const navigation = useNa<StackNavigationProp<any, any>>();
    return navigation;
};

export {
    getMessage,
    useAppDispatch,
    useAppSelector,
    useAuthPhoneNumber,
    useInternet,
    useIsLogin,
    useNavigation,
    usePreventAppExist,
    usePrevious,
    useTheme,
};
