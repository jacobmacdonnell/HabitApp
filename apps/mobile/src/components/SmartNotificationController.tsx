import { useHabit } from '@habitapp/shared';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';

// Notification IDs to manage cancellations
const NOTIFICATION_IDS = {
    STREAK: 'streak-reminder',
    PET: 'pet-lonely',
};

export const SmartNotificationController = () => {
    const { habits, progress, pet } = useHabit();
    const mounted = useRef(false);

    // Request permissions on mount
    useEffect(() => {
        const requestPermissions = async () => {
            const { status } = await Notifications.getPermissionsAsync();
            if (status !== 'granted') {
                await Notifications.requestPermissionsAsync();
            }
        };
        requestPermissions();
    }, []);

    // 1. Streak Saver Logic (8 PM Reminder)
    useEffect(() => {
        const scheduleStreak = async () => {
            // Cancel existing
            await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.STREAK);

            if (habits.length === 0) return;

            // Check if all completed today
            const today = new Date().toISOString().split('T')[0];
            const incompleteHabits = habits.filter(h => {
                const p = progress.find(prog => prog.habitId === h.id && prog.date === today);
                // Return true if NOT completed
                return !p?.completed;
            });

            if (incompleteHabits.length === 0) {
                // All done! No notification needed.
                return;
            }

            // Schedule for 8 PM tonight
            const now = new Date();
            const trigger = new Date();
            trigger.setHours(20, 0, 0, 0);

            // If it's already past 8 PM, don't nag immediately
            if (now.getTime() > trigger.getTime()) {
                return;
            }

            // Calculate seconds until trigger
            const secondsUntil = (trigger.getTime() - now.getTime()) / 1000;

            await Notifications.scheduleNotificationAsync({
                identifier: NOTIFICATION_IDS.STREAK,
                content: {
                    title: 'Keep Your Streak! 🔥',
                    body: `You have ${incompleteHabits.length} habits remaining for today. don't break the chain!`,
                },
                trigger: {
                    seconds: Math.floor(secondsUntil),
                    repeats: false // One-off for today
                } as any, // Cast to avoid strict discriminated union issues with shorthand
            });
        };

        scheduleStreak();
    }, [habits, progress]);

    // 2. Pet Lonely Logic (24h Inactivity)
    useEffect(() => {
        const schedulePet = async () => {
            await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.PET);

            if (!pet) return;

            const lastInteraction = new Date(pet.lastInteraction);
            const trigger = new Date(lastInteraction.getTime() + 24 * 60 * 60 * 1000); // 24 hours later
            const now = Date.now();

            // If already decaying, maybe notify immediately? 
            // Better to just schedule it solely based on last interaction.

            // Only schedule if trigger is in future
            if (trigger.getTime() > now) {
                const secondsUntil = (trigger.getTime() - now) / 1000;

                await Notifications.scheduleNotificationAsync({
                    identifier: NOTIFICATION_IDS.PET,
                    content: {
                        title: `${pet.name} is lonely! 😢`,
                        body: 'Check in on your companion before their health drops!',
                    },
                    trigger: {
                        seconds: Math.floor(secondsUntil),
                        repeats: false
                    } as any,
                });
            }
        };

        schedulePet();
    }, [pet?.lastInteraction, pet?.name]);

    return null; // Headless component
};
