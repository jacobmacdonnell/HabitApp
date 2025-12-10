import SharedGroupPreferences from 'react-native-shared-group-preferences';
import { Platform } from 'react-native';
import { WidgetServiceType } from '@habitapp/shared';

// Must match the group ID in app.json and entitlement
const APP_GROUP_ID = 'group.com.habitapp.cyb3rmac';

export const WidgetService: WidgetServiceType = {
    setSharedData: async (key: string, data: any) => {
        if (Platform.OS !== 'ios') return;

        try {
            // SharedGroupPreferences expects a string for value? Or JSON?
            // Docs say it handles serialization usually, but passing JSON string is safer.
            // HabitContext already JSON.stringifies it.
            // Wait, HabitContext passes `JSON.stringify(widgetData)`.
            // So we save it as a string.
            await SharedGroupPreferences.setItem(key, data, APP_GROUP_ID);
        } catch (errorCode) {
            console.warn('WidgetService: Failed to save shared data', errorCode);
        }
    },

    reloadAllTimelines: () => {
        if (Platform.OS !== 'ios') return;
        // Todo: Implement Native Module for WidgetCenter.shared.reloadAllTimelines()
        // For now, data is staged for the next update.
        console.log('WidgetService: Timelines reload requested (Native module required)');
    }
};
