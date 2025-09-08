import { AndroidStyle } from '@notifee/react-native';
import View from 'components/View';
import { notifyConfigs } from 'config';
import React from 'react';
import { Button, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotifyScreen() {
    //create local notify
    async function onDisplayNotification() {
        await notifyConfigs.onDisplayNotification({
            title: '<p style="color: #4caf50;"><b>Styled HTMLTitle</span></p></b></p> &#128576;',
            subtitle: '&#129395;',
            body: 'onBackgroundEvent method and remove the notification from the device (marking as read). You can however force the action to open the application into the foreground by setting the foreground property to',
            android: {
                // pressAction: { id: 'default-ntl', launchActivity: 'default-ntl' },
                // actions: [
                //     { title: 'action1', pressAction: { id: 'action1', launchActivity: 'action1' } },
                //     { title: 'action3', pressAction: { id: 'action2', launchActivity: 'default' } },
                // ],
                // showTimestamp: true,
                // importance:AndroidImportance.HIGH,
                // importance: AndroidImportance.,
                style: {
                    // type: AndroidStyle.BIGPICTURE,
                    // // summary: 'hello',
                    // largeIcon: 'https://img.ws.mms.shopee.vn/e551f1d73c29c6bb78254f380d764726',
                    // picture: 'https://img.ws.mms.shopee.vn/e551f1d73c29c6bb78254f380d764726',
                    type: AndroidStyle.BIGTEXT,
                    text: "application small icon will show in the device statusbar. When the user pulls down the notification shade, the notification will show in it's expanded state (if applicable).",
                },
            },
        });
    }
    //create local trigger
    async function onCreateTriggerNotification() {
        await notifyConfigs.onTriggerNotification(
            {
                title: 'test trigger notify config local title',
                body: 'test trigger notify config local body',
                android: {
                    showTimestamp: true,
                    // actions: [
                    //     {
                    //         title: 'Đánh dấu đã đọc',
                    //         pressAction: { id: 'mask-read' },
                    //     },
                    // ],
                    style: {
                        type: AndroidStyle.BIGPICTURE,
                        picture: 'https://img.ws.mms.shopee.vn/e551f1d73c29c6bb78254f380d764726',
                    },
                    // style: {
                    //     type: AndroidStyle.BIGTEXT,
                    //     text: 'Large volume of text shown in the expanded state',
                    // },
                    // style: {
                    //     type: AndroidStyle.INBOX,
                    //     lines: [
                    //         'First Message',
                    //         'Second Message',
                    //         'Third Message',
                    //         'Forth Message',
                    //     ],
                    // },
                    // style: {
                    //     type: AndroidStyle.MESSAGING,
                    //     person: {
                    //         name: 'John Doe',
                    //         icon: 'https://my-cdn.com/avatars/123.png',
                    //     },
                    //     messages: [
                    //         {
                    //             text: 'Hey, how are you?',
                    //             timestamp: Date.now() - 600000, // 10 minutes ago
                    //         },
                    //         {
                    //             text: 'Great thanks, food later?',
                    //             timestamp: Date.now(), // Now
                    //             person: {
                    //                 name: 'Sarah Lane',
                    //                 icon: 'https://my-cdn.com/avatars/567.png',
                    //             },
                    //         },
                    //     ],
                    // },
                    // largeIcon:
                    //     'https://image.ngothanhloi.com/product/may-cat-sat-makita-305-mm-lc1230-1663397431.png',
                },
            },
            Date.now() + 60 * 1000
        );
    }

    async function cannelNotification() {
        // await notifee.cancelTriggerNotification('ntl');
        Linking.openURL('vdcapp://profile');
    }

    return (
        <SafeAreaView>
            <View mt="small">
                <Button
                    title="Create Trigger Notification"
                    onPress={() => onCreateTriggerNotification()}
                />
            </View>
            <View>
                <Button title="Display Notification" onPress={() => onDisplayNotification()} />
            </View>
            <View mt="small">
                <Button title="cancel" onPress={() => cannelNotification()} />
            </View>
        </SafeAreaView>
    );
}
