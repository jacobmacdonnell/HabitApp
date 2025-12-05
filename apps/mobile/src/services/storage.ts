import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageServiceType, Habit, Pet, DailyProgress, Settings } from '@habitapp/shared';

const KEYS = {
    HABITS: 'habit-app-habits',
    PET: 'habit-app-pet',
    PROGRESS: 'habit-app-progress',
    SETTINGS: 'habit-app-settings',
};

export const MobileStorageService: StorageServiceType = {
    getHabits: async (): Promise<Habit[]> => {
        try {
            const data = await AsyncStorage.getItem(KEYS.HABITS);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Failed to load habits', e);
            return [];
        }
    },
    saveHabits: async (habits: Habit[]) => {
        try {
            await AsyncStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
        } catch (e) {
            console.error('Failed to save habits', e);
        }
    },
    getPet: async (): Promise<Pet | null> => {
        try {
            const data = await AsyncStorage.getItem(KEYS.PET);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Failed to load pet', e);
            return null;
        }
    },
    savePet: async (pet: Pet) => {
        try {
            await AsyncStorage.setItem(KEYS.PET, JSON.stringify(pet));
        } catch (e) {
            console.error('Failed to save pet', e);
        }
    },
    getProgress: async (): Promise<DailyProgress[]> => {
        try {
            const data = await AsyncStorage.getItem(KEYS.PROGRESS);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Failed to load progress', e);
            return [];
        }
    },
    saveProgress: async (progress: DailyProgress[]) => {
        try {
            await AsyncStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
        } catch (e) {
            console.error('Failed to save progress', e);
        }
    },
    getSettings: async (): Promise<Settings> => {
        try {
            const data = await AsyncStorage.getItem(KEYS.SETTINGS);
            return data ? JSON.parse(data) : { sleepStart: '22:00', sleepEnd: '06:00' };
        } catch (e) {
            console.error('Failed to load settings', e);
            return { sleepStart: '22:00', sleepEnd: '06:00' };
        }
    },
    saveSettings: async (settings: Settings) => {
        try {
            await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
        } catch (e) {
            console.error('Failed to save settings', e);
        }
    },
};
