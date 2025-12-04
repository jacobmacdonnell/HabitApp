import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageService } from '../services/storage';

const HabitContext = createContext(undefined);

export const HabitProvider = ({ children }) => {
    const [habits, setHabits] = useState([]);
    const [pet, setPet] = useState(null);
    const [progress, setProgress] = useState([]);

    useEffect(() => {
        const loadData = () => {
            try {
                setHabits(StorageService.getHabits() || []);
                const loadedPet = StorageService.getPet();

                // Check for neglect on load
                if (loadedPet) {
                    const lastLogin = new Date(loadedPet.lastInteraction || new Date().toISOString());
                    const now = new Date();
                    const diffTime = Math.abs(now - lastLogin);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays > 1) {
                        // Decay health for missed days
                        const healthLoss = (diffDays - 1) * 10;
                        loadedPet.health = Math.max(0, loadedPet.health - healthLoss);
                        loadedPet.mood = loadedPet.health < 30 ? 'sick' : (loadedPet.health < 60 ? 'sad' : 'neutral');
                        StorageService.savePet(loadedPet);
                    }
                }

                setPet(loadedPet);
                setProgress(StorageService.getProgress() || []);
            } catch (error) {
                console.error("Failed to load data from storage:", error);
                setHabits([]);
                setPet(null);
                setProgress([]);
            }
        };
        loadData();
    }, []);

    const addHabit = (habit) => {
        const newHabit = { ...habit, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
        const updatedHabits = [...habits, newHabit];
        setHabits(updatedHabits);
        StorageService.saveHabits(updatedHabits);
    };

    const updateHabit = (id, updates) => {
        const updatedHabits = habits.map(h => h.id === id ? { ...h, ...updates } : h);
        setHabits(updatedHabits);
        StorageService.saveHabits(updatedHabits);
    };

    const deleteHabit = (id) => {
        const updatedHabits = habits.filter(h => h.id !== id);
        setHabits(updatedHabits);
        StorageService.saveHabits(updatedHabits);

        // Clean up progress for deleted habit
        const updatedProgress = progress.filter(p => p.habitId !== id);
        setProgress(updatedProgress);
        StorageService.saveProgress(updatedProgress);
    };

    const logProgress = (habitId, date) => {
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
        StorageService.saveProgress(newProgress);

        // Update Pet Health & XP Logic
        if (pet) {
            let updates = { lastInteraction: new Date().toISOString() };

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

    const resetPet = (name, color) => {
        const newPet = {
            name,
            color,
            health: 100,
            maxHealth: 100,
            level: 1,
            xp: 0,
            mood: 'happy',
            lastInteraction: new Date().toISOString()
        };
        setPet(newPet);
        StorageService.savePet(newPet);
    };

    const getStreak = (habitId) => {
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
        StorageService.saveHabits([]);
        StorageService.savePet(null);
        StorageService.saveProgress([]);
    };

    const updatePet = (updates) => {
        if (!pet) return;

        // Auto-update mood based on health if not explicitly set
        let newMood = updates.mood || pet.mood;
        const newHealth = updates.health !== undefined ? updates.health : pet.health;

        if (!updates.mood) {
            if (newHealth < 30) newMood = 'sick';
            else if (newHealth < 60) newMood = 'sad';
            else if (newHealth >= 80) newMood = 'happy';
        }

        const updatedPet = { ...pet, ...updates, mood: newMood };
        setPet(updatedPet);
        StorageService.savePet(updatedPet);
    };

    return (
        <HabitContext.Provider value={{
            habits,
            pet,
            progress,
            addHabit,
            updateHabit,
            deleteHabit,
            logProgress,
            resetPet,
            updatePet,
            getStreak,
            resetData
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
