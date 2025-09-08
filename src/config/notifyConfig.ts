import notifee, {
    AndroidColor,
    Notification,
    NotificationAndroid,
    NotificationIOS,
    TimestampTrigger,
    TriggerType,
} from '@notifee/react-native';
import { NotificationRemoteData } from 'models/notifyModel';
import { Platform } from 'react-native';
import { removeTagsAndEmojis } from 'utils/helpers';
import { v4 as uuidv4 } from 'uuid';
interface ConfigType {
    title?: string;
    body?: string;
    id?: string;
    subtitle?: string;
    data?: {
        [key: string]: string | number | object;
    };
    android?: NotificationAndroid;
    ios?: NotificationIOS;
    remote?: {
        messageId: string;
        senderId: string;
        mutableContent?: number | undefined;
        contentAvailable?: number | undefined;
    };
}

export async function ANDROID_CONFIG() {
    // const soundsList = await NotificationSounds.getNotifications('notification');

    const channelId = await notifee.createChannel({
        id: 'Ntl',
        name: 'Ntl Channel',
        // sound: Platform.OS === 'android' ? soundsList[0].url : 'default',
        vibration: true,
        // vibrationPattern: [300, 300],
    });
    return {
        channelId,
        smallIcon: 'ic_small_icon', // optional, defaults to 'ic_launcher'.
        color: AndroidColor.RED,
        showTimestamp: true,
    };
}

//display
export async function onShowNotification(configs: NotificationRemoteData) {
    const {
        title,
        body,
        subtitle,
        actions,
        foreground,
        importance,
        platform,
        styles,
        type,
        visibility,
        app_link,
        image,
        largeIcon,
        time,
        vibration,
        web_link,
    } = configs;
    //checl platfrom
    if (platform === 'all' || platform === 'mobile') {
        // Request permissions (required for iOS)
        await notifee.requestPermission();
        //get default android config
        const channelId = await notifee.createChannel({
            id: 'ntl-channel',
            name: 'Ntl Channel',
            sound: 'default',
            vibration: vibration !== false ? true : false,
            vibrationPattern: [300, 500, 300, 500],
            importance: importance ? importance : 3,
        });

        const config: Notification = {
            id: uuidv4(),
            title: Platform.OS === 'ios' ? removeTagsAndEmojis(title) : title,
            body: Platform.OS === 'ios' ? removeTagsAndEmojis(body || '') : body,
            subtitle: Platform.OS === 'ios' ? removeTagsAndEmojis(subtitle || '') : subtitle,
            data: {
                app_link: app_link || '',
                web_link: web_link || '',
            },
            android: {
                channelId,
                showTimestamp: true,
                style: styles
                    ? {
                          type: styles,
                          text: styles === 1 && body ? body : '',
                          picture: styles === 0 && image ? image : '',
                      }
                    : undefined,
                visibility,
                largeIcon: largeIcon ? largeIcon : image ? image : undefined,
                actions: actions
                    ? actions.map((v) => ({
                          title: v.title,
                          pressAction: {
                              id: v.id,
                              launchActivity: 'default',
                          },
                      }))
                    : undefined,
            },
            ios: {
                sound: 'default',
                attachments: image
                    ? [{ url: image ? image : '', thumbnailHidden: largeIcon ? true : false }]
                    : undefined,
            },
        };

        // Display a notification
        //action ios xu ly sau
        // notifee.setNotificationCategories(actions.map((v) => ({
        //     id:v.id,
        //     actions:[]
        // })))

        //show notification
        if (type === 'notify') {
            notifee.displayNotification(config);
        } else {
            await notifee.createTriggerNotification(config, {
                type: TriggerType.TIMESTAMP,
                timestamp: time || 0,
            });
        }
    }
}
//trigger
export async function onTriggerNotification(configs: ConfigType, timestamp: number) {
    const { title, body, subtitle, data, remote, android, ios } = configs;
    //android
    const androidDefaultConfig = await ANDROID_CONFIG();
    //now
    let timeTrigger = timestamp;
    if (Date.now() >= timestamp) {
        //nếu thời gian set trigger nhỏ hơn thời gian hiện tại thì sẽ set trigger 1h sau
        timeTrigger = Date.now() + 60 * 60 * 1000;
    }
    // Create a time-based trigger
    const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: timeTrigger, // fire at 11:10am (10 minutes before meeting)
    };
    // Create a trigger notification
    await notifee.createTriggerNotification(
        {
            id: title,
            title,
            body,
            subtitle,
            data,
            remote,
            android: {
                ...androidDefaultConfig,
                ...android,
            },
            ios: {
                ...ios,
            },
        },
        trigger
    );
}
