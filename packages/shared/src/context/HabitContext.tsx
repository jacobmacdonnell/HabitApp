import React, { createContext, useContext, useState, useEffect } from 'react';
import { Habit, Pet, DailyProgress, Settings, StorageServiceType, HabitContextType } from '../types';

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider = ({ children, storage }: { children: React.ReactNode, storage: StorageServiceType }) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [pet, setPet] = useState<Pet | null>(null);
    const [progress, setProgress] = useState<DailyProgress[]>([]);
    const [isOnboarding, setIsOnboarding] = useState(true);
    const [settings, setSettings] = useState<Settings>({ sleepStart: '22:00', sleepEnd: '06:00' });

    useEffect(() => {
        const loadData = async () => {
            try {
                const loadedHabits = await storage.getHabits();
                setHabits(loadedHabits || []);

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
                        const healthLoss = (diffDays - 1) * 10;
                        loadedPet.health = Math.max(0, loadedPet.health - healthLoss);
                        loadedPet.mood = loadedPet.health < 30 ? 'sick' : (loadedPet.health < 60 ? 'sad' : 'neutral');
                        await storage.savePet(loadedPet);
                    }
                }

                setPet(loadedPet);
                setIsOnboarding(!loadedPet);

                const loadedProgress = await storage.getProgress();
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

        const interval = setInterval(checkSleepState, 1000); // Check every second
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

    const getMood = (health: number) => {
        if (health < 30) return 'sick';
        if (health < 60) return 'sad';
        return 'happy';
    };

    const generateId = () => {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    };

    const addHabit = (habit: Omit<Habit, 'id'>) => {
        const newHabit: Habit = { ...habit, id: generateId() };
        const updatedHabits = [...habits, newHabit];
        setHabits(updatedHabits);
        storage.saveHabits(updatedHabits);
    };

    const updateHabit = (id: string, updates: Partial<Habit>) => {
        const updatedHabits = habits.map(h => h.id === id ? { ...h, ...updates } : h);
        setHabits(updatedHabits);
        storage.saveHabits(updatedHabits);
    };

    const deleteHabit = (id: string) => {
        const updatedHabits = habits.filter(h => h.id !== id);
        setHabits(updatedHabits);
        storage.saveHabits(updatedHabits);

        // Clean up progress for deleted habit
        const updatedProgress = progress.filter(p => p.habitId !== id);
        setProgress(updatedProgress);
        storage.saveProgress(updatedProgress);
    };

    const logProgress = (habitId: string, date: string) => {
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
        storage.saveProgress(newProgress);

        // Update Pet Health & XP Logic
        if (pet) {
            let updates: Partial<Pet> = { lastInteraction: new Date().toISOString() };

            if (gainedXp) {
                // XP Gain
                const xpGain = 20;
                let newXp = (pet.xp || 0) + xpGain;
                let newLevel = pet.level || 1;
                let newHealth = Math.min((pet.health || 0) + 10, pet.maxHealth || 100);

                // Level Up Logic (Threshold: Level * 100)
                const xpThreshold = newLevel * 100;
                if (newXp >= xpThreshold) {
                    newLevel += 1;
                    newXp -= xpThreshold;
                    newHealth = pet.maxHealth || 100; // Full heal on level up!
                }

                updates = {
                    ...updates,
                    health: newHealth,
                    xp: newXp,
                    level: newLevel,
                    mood: 'happy'
                };
            } else {
                // Small increment for progress
                updates = {
                    ...updates,
                    health: Math.min((pet.health || 0) + 2, pet.maxHealth || 100)
                };
            }
            updatePet(updates);
        }
    };

    const undoProgress = (habitId: string, date: string) => {
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
        storage.saveProgress(newProgress);

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
            lastInteraction: new Date().toISOString()
        };
        setPet(newPet);
        storage.savePet(newPet);
    };

    const getStreak = (habitId: string) => {
        const habitProgress = progress
            .filter(p => p.habitId === habitId && p.completed)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (habitProgress.length === 0) return 0;

        let streak = 0;
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        // Check if the streak is active (completed today or yesterday)
        const lastCompleted = habitProgress[0].date;
        if (lastCompleted !== today && lastCompleted !== yesterday) {
            return 0;
        }

        // Count consecutive days
        let currentDate = new Date(lastCompleted);

        for (const p of habitProgress) {
            const pDate = new Date(p.date);
            // If dates match (allowing for same day multiple entries if any, though we filter unique dates usually)
            if (pDate.getTime() === currentDate.getTime()) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1); // Move to previous day
            } else {
                break; // Streak broken
            }
        }
        return streak;
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
                newMood = getMood(newHealth);
            }
        }

        const updatedPet = { ...pet, ...updates, mood: newMood };
        setPet(updatedPet);
        storage.savePet(updatedPet);
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
            updateSettings
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
