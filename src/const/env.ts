import { Config } from 'react-native-config';

const check = Config.REACT_NATIVE_APP_IS_MODE === 'dev' ? true : false;
//host
export const REACT_NATIVE_APP_WEB_URL = check
    ? Config.REACT_NATIVE_APP_WEB_URL_DEV
    : Config.REACT_NATIVE_APP_WEB_URL_PRO;
//firebase
export const REACT_NATIVE_APP_FIREBASE_KEY = check
    ? Config.REACT_NATIVE_APP_FIREBASE_KEY_DEV
    : Config.REACT_NATIVE_APP_FIREBASE_KEY_PRO;
//base url web

//socket
//socket
export const REACT_NATIVE_APP_SOCKET_SERVER = check
    ? Config.REACT_NATIVE_APP_SOCKET_SERVER_DEV
    : Config.REACT_NATIVE_APP_SOCKET_SERVER_PRO;
//image temp
export const REACT_NATIVE_APP_API_IMAGE =
    Config.REACT_NATIVE_APP_IS_MODE === 'dev'
        ? Config.REACT_NATIVE_APP_API_IMAGE_DEV
        : Config.REACT_NATIVE_APP_API_IMAGE_PRO;
//geoapify
export const REACT_NATIVE_APP_GEOAPIFY_KEY =
    Config.REACT_NATIVE_APP_IS_MODE === 'dev'
        ? Config.REACT_NATIVE_APP_GEOAPIFY_KEY_DEV
        : Config.REACT_NATIVE_APP_GEOAPIFY_KEY_PRO;
//curentcy
export const NEXT_PUBLIC_CURRENCY = 'đ';
