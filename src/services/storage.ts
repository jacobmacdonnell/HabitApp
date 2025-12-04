import type { Habit, Pet, DailyProgress } from '../types';

const KEYS = {
    HABITS: 'habit-app-habits',
    PET: 'habit-app-pet',
    PROGRESS: 'habit-app-progress',
};

export const StorageService = {
    getHabits: (): Habit[] => {
        const data = localStorage.getItem(KEYS.HABITS);
        return data ? JSON.parse(data) : [];
    },

    saveHabits: (habits: Habit[]) => {
        localStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
    },

    getPet: (): Pet | null => {
        const data = localStorage.getItem(KEYS.PET);
        return data ? JSON.parse(data) : null;
    },

    savePet: (pet: Pet) => {
        localStorage.setItem(KEYS.PET, JSON.stringify(pet));
    },

    getProgress: (): DailyProgress[] => {
        const data = localStorage.getItem(KEYS.PROGRESS);
        return data ? JSON.parse(data) : [];
    },

    saveProgress: (progress: DailyProgress[]) => {
        localStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
    },
};
