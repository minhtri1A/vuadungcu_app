import Config from 'react-native-config';
//sentry
export const SENTRY_KEY =
    Config.REACT_NATIVE_APP_IS_MODE === 'dev'
        ? 'https://73cd94f476e844ed8e1a978ee3d8ac00@o4504670061068288.ingest.sentry.io/4504716650610688'
        : 'https://f7822fb517504c748621817010c45008@o4504670061068288.ingest.sentry.io/4504670071422976';
//google android
export const GOOGLE_WEB_KEY =
    Config.REACT_NATIVE_APP_IS_MODE === 'dev'
        ? '478399974721-mgh7bm7gfo57j4vdmjn5nat0m2mu5g64.apps.googleusercontent.com'
        : '132117229363-jd4h1q8mp0sskj9fcjsb6r1i3fmft9b3.apps.googleusercontent.com';
//google ios
export const GOOGLE_IOS_KEY =
    Config.REACT_NATIVE_APP_IS_MODE === 'dev'
        ? '478399974721-ad0p8kgims7844lh6g67fep56b27eq1i.apps.googleusercontent.com'
        : '132117229363-09fnd22rva1ro27l3dln9iavt0kchjr2.apps.googleusercontent.com';
