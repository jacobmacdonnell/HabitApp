import React, { createContext, useContext, useState, useEffect } from 'react';
import { Habit, Pet, DailyProgress, Settings, StorageServiceType, HabitContextType } from '../types';
import { getLocalDateString } from '../utils/dateUtils';
import { PetGameEngine } from '../engines/PetGameEngine';
import { StatsEngine } from '../engines/StatsEngine';

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider = ({ children, storage }: { children: React.ReactNode, storage: StorageServiceType }) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [pet, setPet] = useState<Pet | null>(null);
    const [progress, setProgress] = useState<DailyProgress[]>([]);
    const [isOnboarding, setIsOnboarding] = useState(true);
    const [settings, setSettings] = useState<Settings>({
        sleepStart: '22:00',
        sleepEnd: '06:00',
        notifications: true,
        sound: true,
        theme: 'auto'
    });

    const [stats, setStats] = useState<Record<string, { currentStreak: number; totalCompletions: number }>>({});

    useEffect(() => {
        const loadData = async () => {
            try {
                const loadedHabits = await storage.getHabits();
                setHabits(loadedHabits || []);

                // Load Stats for Scalability
                const statsMap: Record<string, { currentStreak: number; totalCompletions: number }> = {};
                if (storage.getHabitStats) {
                    await Promise.all(loadedHabits.map(async (h) => {
                        const s = await storage.getHabitStats!(h.id);
                        statsMap[h.id] = s;
                    }));
                }
                setStats(statsMap);

                const loadedPet = await storage.getPet();
                const loadedSettings = await storage.getSettings();
                setSettings(loadedSettings);

                // Check for neglect on load
                if (loadedPet) {
                    const lastLogin = new Date(loadedPet.lastInteraction || new Date().toISOString());
                    const now = new Date();
                    const diffTime = Math.abs(now.getTime() - lastLogin.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays > 1) {
                        // Decay health for missed days
                        loadedPet.health = PetGameEngine.calculateDecay(loadedPet.lastInteraction, loadedPet.health);
                        loadedPet.mood = PetGameEngine.determineMood(loadedPet.health, false);
                        await storage.savePet(loadedPet);
                    }
                }

                setPet(loadedPet);
                setIsOnboarding(!loadedPet);

                // Load only last 90 days of progress for performance
                // This prevents loading unbounded historical data as the app ages
                const today = getLocalDateString();
                const ninetyDaysAgo = getLocalDateString(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000));
                const loadedProgress = storage.getProgressForRange
                    ? await storage.getProgressForRange(ninetyDaysAgo, today)
                    : await storage.getProgress();
                setProgress(loadedProgress || []);

            } catch (error) {
                console.error("Failed to load data from storage:", error);
                setHabits([]);
                setPet(null);
                setProgress([]);
            }
        };
        loadData();
    }, [storage]);

    // Check for sleep state every second for precision
    useEffect(() => {
        if (!pet) return;

        const checkSleepState = () => {
            const sleeping = isSleepingTime();
            if (sleeping && pet.mood !== 'sleeping') {
                updatePet({ mood: 'sleeping' });
            } else if (!sleeping && pet.mood === 'sleeping') {
                // Wake up! Set mood to happy to greet the user
                updatePet({ mood: 'happy' });
            }
        };

        const interval = setInterval(checkSleepState, 60000); // Check every minute (Battery Optimized)
        checkSleepState(); // Check immediately

        return () => clearInterval(interval);
    }, [pet, settings]);

    const updateSettings = (newSettings: Partial<Settings>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        storage.saveSettings(updated);
    };

    const isSleepingTime = () => {
        if (!settings.sleepStart || !settings.sleepEnd) return false;

        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        if (settings.sleepStart > settings.sleepEnd) {
            // Span across midnight (e.g. 22:00 to 06:00)
            return currentTime >= settings.sleepStart || currentTime < settings.sleepEnd;
        } else {
            // Same day (e.g. 01:00 to 09:00 - rare for sleep but possible)
            return currentTime >= settings.sleepStart && currentTime < settings.sleepEnd;
        }
    };



    const generateId = () => {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    };

    const addHabit = async (habit: Omit<Habit, 'id'>) => {
        const newHabit: Habit = { ...habit, id: generateId() };
        const updatedHabits = [...habits, newHabit];
        setHabits(updatedHabits);

        // Use atomic operation when available, fallback to full save
        if (storage.addHabit) {
            await storage.addHabit(newHabit);
        } else {
            await storage.saveHabits(updatedHabits);
        }

        // Init stats
        setStats(prev => ({ ...prev, [newHabit.id]: { currentStreak: 0, totalCompletions: 0 } }));
    };

    const updateHabit = async (id: string, updates: Partial<Habit>) => {
        const updatedHabits = habits.map(h => h.id === id ? { ...h, ...updates } : h);
        setHabits(updatedHabits);

        // Use atomic operation when available, fallback to full save
        if (storage.updateHabit) {
            await storage.updateHabit(id, updates);
        } else {
            await storage.saveHabits(updatedHabits);
        }
    };

    const deleteHabit = async (id: string) => {
        const updatedHabits = habits.filter(h => h.id !== id);
        setHabits(updatedHabits);

        // Use atomic operation when available (cascade delete handles progress)
        if (storage.deleteHabit) {
            await storage.deleteHabit(id);
        } else {
            await storage.saveHabits(updatedHabits);
            // Clean up progress for deleted habit (only needed for legacy storage)
            const updatedProgress = progress.filter(p => p.habitId !== id);
            setProgress(updatedProgress);
            await storage.saveProgress(updatedProgress);
        }

        // Cleanup local progress state (even with cascade, local state needs update)
        setProgress(prev => prev.filter(p => p.habitId !== id));

        // Cleanup stats
        setStats(prev => {
            const newStats = { ...prev };
            delete newStats[id];
            return newStats;
        });
    };

    const logProgress = async (habitId: string, date: string) => {
        const currentProgress = progress.find(p => p.habitId === habitId && p.date === date);
        const habit = habits.find(h => h.id === habitId);

        if (!habit) return;

        let newProgress;
        let gainedXp = false;

        if (currentProgress) {
            newProgress = progress.map(p => {
                if (p.habitId === habitId && p.date === date) {
                    const newCount = Math.min(p.currentCount + 1, habit.targetCount);
                    if (newCount === habit.targetCount && !p.completed) {
                        gainedXp = true;
                        return { ...p, currentCount: newCount, completed: true };
                    }
                    return { ...p, currentCount: newCount };
                }
                return p;
            });
        } else {
            const isCompleted = 1 >= habit.targetCount;
            if (isCompleted) gainedXp = true;
            newProgress = [...progress, { habitId, date, currentCount: 1, completed: isCompleted }];
        }

        setProgress(newProgress);

        // Optimistic update for SQLite (Single Item)
        const changedItem = newProgress.find(p => p.habitId === habitId && p.date === date);
        if (storage.logSingleProgress && changedItem) {
            await storage.logSingleProgress(changedItem);
        } else {
            await storage.saveProgress(newProgress);
        }

        // Refresh Stats
        if (storage.getHabitStats) {
            const newStats = await storage.getHabitStats(habitId);
            setStats(prev => ({ ...prev, [habitId]: newStats }));
        }

        // Update Pet Health & XP Logic
        if (pet) {
            let updates: Partial<Pet> = { lastInteraction: new Date().toISOString() };

            if (gainedXp) {
                // XP Gain
                const { xp, level, health } = PetGameEngine.calculateXPGain(pet);
                updates = {
                    ...updates,
                    xp,
                    level,
                    health,
                };
            } else {
                // Small increment for progress
                updates = {
                    ...updates,
                    health: PetGameEngine.recoverHealth(pet.health || 0, pet.maxHealth)
                };
            }
            updatePet(updates);
        }
    };

    const undoProgress = async (habitId: string, date: string) => {
        const currentProgress = progress.find(p => p.habitId === habitId && p.date === date);
        if (!currentProgress || currentProgress.currentCount <= 0) return;

        const wasCompleted = currentProgress.completed;
        // If uncompleting, ensure we don't go below 0
        const newCount = Math.max(0, currentProgress.currentCount - 1);

        const newProgress = progress.map(p => {
            if (p.habitId === habitId && p.date === date) {
                // Always mark as not completed if we decrement
                return { ...p, currentCount: newCount, completed: false };
            }
            return p;
        });

        setProgress(newProgress);
        // Optimistic update for SQLite (Single Item)
        const changedItem = newProgress.find(p => p.habitId === habitId && p.date === date);
        if (storage.logSingleProgress && changedItem) {
            await storage.logSingleProgress(changedItem);
        } else {
            await storage.saveProgress(newProgress);
        }

        // Refresh Stats
        if (storage.getHabitStats) {
            const newStats = await storage.getHabitStats(habitId);
            setStats(prev => ({ ...prev, [habitId]: newStats }));
        }

        if (pet && wasCompleted) {
            // Revert XP
            let newXp = (pet.xp || 0) - 20;
            let newLevel = pet.level || 1;

            // Handle Level Down
            if (newXp < 0 && newLevel > 1) {
                newLevel -= 1;
                newXp += (newLevel * 100);
            }
            // Clamp XP at 0 if Level 1
            if (newLevel === 1 && newXp < 0) newXp = 0;

            updatePet({ xp: newXp, level: newLevel });
        }
    };

    const resetPet = (name: string, color: string) => {
        const newPet: Pet = {
            name,
            color,
            health: 100,
            maxHealth: 100,
            level: 1,
            xp: 0,
            mood: 'happy',
            history: [],
            inventory: [], // Init empty inventory
            lastInteraction: new Date().toISOString()
        };
        setPet(newPet);
        storage.savePet(newPet);
    };

    const getStreak = (habitId: string) => {
        if (stats[habitId]) {
            return stats[habitId].currentStreak;
        }

        // Fallback to legacy calc if stat not ready
        return StatsEngine.calculateStreak(progress, habitId);
    };

    const resetData = () => {
        setHabits([]);
        setPet(null);
        setProgress([]);
        storage.saveHabits([]);
        storage.savePet(null as any); // Type cast for null
        storage.saveProgress([]);
    };

    const updatePet = (updates: Partial<Pet>) => {
        if (!pet) return;

        // Auto-update mood based on health if not explicitly set
        let newMood = updates.mood || pet.mood;
        const newHealth = updates.health !== undefined ? updates.health : pet.health;

        if (!updates.mood) {
            if (isSleepingTime()) {
                newMood = 'sleeping';
            } else {
                newMood = PetGameEngine.determineMood(newHealth, false);
            }
        }

        const updatedPet = { ...pet, ...updates, mood: newMood };
        setPet(updatedPet);
        storage.savePet(updatedPet);
    };

    const getHistoricalProgress = async (start: string, end: string) => {
        if (storage.getProgressForRange) {
            return await storage.getProgressForRange(start, end);
        }
        // Fallback for storage that doesn't support range
        const all = await storage.getProgress();
        return all.filter(p => p.date >= start && p.date <= end);
    };

    const buyItem = async (itemId: string, price: number): Promise<boolean> => {
        if (!pet) return false;

        // check balance
        if ((pet.xp || 0) < price) return false;

        // check inventory
        const currentInventory = pet.inventory || [];
        if (currentInventory.includes(itemId)) return true; // Already owned

        const newXp = (pet.xp || 0) - price;
        const newInventory = [...currentInventory, itemId];

        const updatedPet = { ...pet, xp: newXp, inventory: newInventory };
        setPet(updatedPet);
        await storage.savePet(updatedPet);
        return true;
    };

    const equipHat = async (hatId: string) => {
        if (!pet) return;
        const updatedPet = { ...pet, hat: hatId };
        setPet(updatedPet);
        await storage.savePet(updatedPet); // Ensure equipment persists
    };

    return (
        <HabitContext.Provider value={{
            habits,
            pet,
            progress,
            isOnboarding,
            setIsOnboarding,
            addHabit,
            updateHabit,
            deleteHabit,
            logProgress,
            undoProgress,
            resetPet,
            updatePet,
            getStreak,
            resetData,
            settings,
            updateSettings,
            getHistoricalProgress,
            buyItem,
            equipHat
        }}>
            {children}
        </HabitContext.Provider>
    );
};

export const useHabit = () => {
    const context = useContext(HabitContext);
    if (context === undefined) {
        throw new Error('useHabit must be used within a HabitProvider');
    }
    return context;
};
