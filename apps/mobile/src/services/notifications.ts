import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export const NotificationService = {
    registerForPushNotificationsAsync: async () => {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                return false;
            }
            return true;
        } else {

            return false;
        }
    },

    scheduleLocalNotification: async (title: string, body: string, trigger: Notifications.NotificationTriggerInput) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                sound: true,
            },
            trigger,
        });
    },

    cancelAllNotifications: async () => {
        await Notifications.cancelAllScheduledNotificationsAsync();
    },

    getAllScheduledNotifications: async () => {
        return await Notifications.getAllScheduledNotificationsAsync();
    }
};
