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
                setPet(StorageService.getPet());
                setProgress(StorageService.getProgress() || []);
            } catch (error) {
                console.error("Failed to load data from storage:", error);
                // Fallback to empty state if storage fails
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

        // Update Pet Health Logic
        if (pet) {
            let updates = {};
            if (gainedXp) {
                // Bonus for completing a habit
                updates = {
                    health: Math.min(pet.health + 10, 100),
                    mood: 'happy'
                };
            } else {
                // Small increment for progress
                updates = {
                    health: Math.min(pet.health + 2, 100)
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
            mood: 'happy',
            lastInteraction: new Date().toISOString()
        };
        setPet(newPet);
        StorageService.savePet(newPet);
    };

    const updatePet = (updates) => {
        if (!pet) return;
        const updatedPet = { ...pet, ...updates };
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
            updatePet
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
