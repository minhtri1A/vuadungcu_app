import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { KeyConfigs } from 'const/index';

GoogleSignin.configure({
    webClientId: KeyConfigs.GOOGLE_WEB_KEY, // client ID of type WEB for your server (needed to verify user ID and offline access)
    offlineAccess: true,
    iosClientId: KeyConfigs.GOOGLE_IOS_KEY, // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
});
export default GoogleSignin;
