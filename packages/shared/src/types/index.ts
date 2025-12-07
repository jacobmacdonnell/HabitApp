export type TimeOfDay = 'morning' | 'midday' | 'evening' | 'anytime';

export type HabitFrequency = {
    type: 'daily' | 'weekly';
    days?: number[]; // 0-6, where 0 is Sunday
};

export interface Habit {
    id: string;
    title: string;
    color: string;
    icon: string;
    frequency: HabitFrequency;
    timeOfDay: TimeOfDay;
    targetCount: number;
}

export interface DailyProgress {
    date: string; // ISO YYYY-MM-DD
    habitId: string;
    currentCount: number;
    completed: boolean;
}

export type PetMood = 'happy' | 'neutral' | 'sad' | 'sick' | 'sleeping';

export interface Pet {
    name: string;
    hat?: string;
    color: string; // Hex code
    health: number; // 0-100
    maxHealth: number; // Default 100
    level: number;
    xp: number;
    mood: PetMood;
    history: {
        date: string;
        healthSnapshot: number;
    }[];
    lastInteraction: string; // ISO Date
}

export interface Settings {
    sleepStart: string;
    sleepEnd: string;
    notifications: boolean;
    sound: boolean;
    theme: 'auto' | 'light' | 'dark';
}

export interface StorageServiceType {
    getHabits: () => Promise<Habit[]>;
    saveHabits: (habits: Habit[]) => Promise<void>;
    getPet: () => Promise<Pet | null>;
    savePet: (pet: Pet) => Promise<void>;
    getProgress: () => Promise<DailyProgress[]>;
    saveProgress: (progress: DailyProgress[]) => Promise<void>;
    getSettings: () => Promise<Settings>;
    saveSettings: (settings: Settings) => Promise<void>;
    getProgressForRange?: (startDate: string, endDate: string) => Promise<DailyProgress[]>;
    logSingleProgress?: (item: DailyProgress) => Promise<void>;
}

export interface HabitContextType {
    habits: Habit[];
    pet: Pet | null;
    progress: DailyProgress[];
    isOnboarding: boolean;
    setIsOnboarding: (val: boolean) => void;
    addHabit: (habit: Omit<Habit, 'id'>) => void;
    updateHabit: (id: string, updates: Partial<Habit>) => void;
    deleteHabit: (id: string) => void;
    logProgress: (habitId: string, date: string) => void;
    undoProgress: (habitId: string, date: string) => void;
    resetPet: (name: string, color: string) => void;
    updatePet: (updates: Partial<Pet>) => void;
    getStreak: (habitId: string) => number;
    resetData: () => void;
    settings: Settings;
    updateSettings: (settings: Partial<Settings>) => void;
}
