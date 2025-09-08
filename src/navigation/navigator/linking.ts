import { Linking } from 'react-native';
// import BootSplash from 'react-native-bootsplash';
import { navigatorConfig, NavigatorConfigType } from './config';
import { forEach } from 'lodash';

//-create linking configs
let configLinking: any = {
    screens: {},
};

const handleCreateConfigLinking = (config?: Array<NavigatorConfigType>, parent = false) => {
    let app_link = {};
    forEach(config, (value) => {
        if (value.type === 'tab') {
            const tabLink = handleCreateConfigLinking(value.child, true);
            configLinking = {
                ...configLinking,
                screens: {
                    ...configLinking.screens,
                    [value.name]: {
                        screens: {
                            ...tabLink,
                        },
                    },
                },
            };
        }
        if (value.type === 'stack') {
            //set app_link là null sẽ không hiển thị stack trong config
            if (value.app_link === null) {
                return;
            }
            const stackLink = handleCreateConfigLinking(value.child, true);
            //nếu là child stack thì đưa vào app link
            if (parent) {
                app_link = {
                    ...app_link,
                    [value.name]: {
                        screens: {
                            ...stackLink,
                        },
                    },
                };
            } else {
                //nếu parent screen thì đưa vào root
                configLinking = {
                    ...configLinking,
                    screens: {
                        ...configLinking.screens,
                        [value.name]: {
                            screens: {
                                ...stackLink,
                            },
                        },
                    },
                };
            }
        }
        if (value.type === 'drawer') {
            //set app_link là null sẽ không hiển thị stack trong config
            if (value.app_link === null) {
                return;
            }
            const drawerLink = handleCreateConfigLinking(value.child, true);
            //nếu là child stack thì đưa vào app link
            if (parent) {
                app_link = {
                    ...app_link,
                    [value.name]: {
                        screens: {
                            ...drawerLink,
                        },
                    },
                };
            } else {
                //nếu parent screen thì đưa vào root
                configLinking = {
                    ...configLinking,
                    screens: {
                        ...configLinking.screens,
                        [value.name]: {
                            screens: {
                                ...drawerLink,
                            },
                        },
                    },
                };
            }
        }
        //value.app_link check nếu tồn tại app_link mới thêm vào config
        if (value.type === 'screen' && value.app_link) {
            //nếu là child screen thì thêm vào app link
            if (parent) {
                app_link = {
                    ...app_link,
                    [value.name]: value.app_link,
                };
            } else {
                //nếu là parent screen thì thêm vào root
                configLinking = {
                    ...configLinking,
                    screens: {
                        ...configLinking.screens,
                        [value.name]: value.app_link,
                    },
                };
            }
        }
    });
    if (parent) {
        return app_link;
    }
    return configLinking;
};
export const getConfigLinking = () => handleCreateConfigLinking(navigatorConfig);

const linking = {
    prefixes: ['https://vuadungcu.com', 'vdcapp://'],
    config: getConfigLinking(),
    async getInitialURL() {
        // Check if app was opened from a deep link
        const url = await Linking.getInitialURL();

        if (url != null) {
            //tắt splash screen khi có deep link - nếu không có tắt trong home screen
            // console.log('getInitialURL in config linking ', url);
            // await BootSplash.hide({ fade: true });
            // SplashScreen.hide();
            return url;
        }
        // Check if there is an initial notifee notification
        // const initialNotification = await notifee.getInitialNotification();
        // // Get deep link from data
        // // if this is undefined, the app will open the default/home page
        // console.log('link open notifee get init ', initialNotification?.notification?.data?.link);
        // const link: any = initialNotification?.notification?.data?.link;
        // if (link) {
        //     //tắt splash screen khi có deep link notification - nếu không có tắt trong home screen
        //     SplashScreen.hide();
        //     return `vdcapp://home?nextLink=${link}`;
        // }
        return '';
    },
    // getStateFromPath(path: any, config: any) {
    //     console.log('path config deeplink ', path);
    //     console.log('config config deeplink ', config);
    // },
    // getPathFromState(state: any, config: any) {
    //     console.log('state config deeplink ', state);
    //     console.log('config state config deeplink ', config);
    // },
};

export default linking;
