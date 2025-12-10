import { DailyProgress } from '../types';

export const StatsEngine = {
    calculateStreak: (history: DailyProgress[], habitId: string): number => {
        // Filter and Sort Descending
        const habitProgress = history
            .filter((p) => p.habitId === habitId && p.completed)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (habitProgress.length === 0) return 0;

        // Helper to get formatted date string YYYY-MM-DD
        const getLocalDateString = (d: Date) => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const now = new Date();
        const today = getLocalDateString(now);
        const yesterday = getLocalDateString(new Date(now.getTime() - 86400000));

        // Get unique dates only
        const uniqueDates = Array.from(new Set(habitProgress.map((p) => p.date)));

        // 1. Check if streak is even active (Last completion must be Today or Yesterday)
        const lastCompletedDate = uniqueDates[0];
        if (lastCompletedDate !== today && lastCompletedDate !== yesterday) {
            return 0;
        }

        // 2. Count consecutive days
        let streak = 1;
        let currentDate = new Date(lastCompletedDate);

        for (let i = 1; i < uniqueDates.length; i++) {
            const prevDate = new Date(uniqueDates[i]);

            // Check diff in days
            const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                streak++;
                currentDate = prevDate;
            } else {
                break; // Gap found, streak ends
            }
        }

        return streak;
    },
};
