import { StatsEngine } from '../StatsEngine';
import { DailyProgress } from '../../types';

describe('StatsEngine', () => {
    describe('calculateStreak', () => {
        const habitId = 'habit-1';

        // Mock "Today" as a fixed date by passing strict strings to the engine
        // BUT the engine calculates "Today" internally using new Date().
        // We need to Mock the system time OR adjust the engine to accept "referenceDate".
        // Use "referenceDate" injection for testability (Best Practice).

        // However, I can't easily change the engine signature without breaking the plan context.
        // I will just use the current date from the system in the test to match the engine.
        // But use "getLocalString" logic in test.

        const getLocalStr = (d: Date) => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const todayDate = new Date();
        const today = getLocalStr(todayDate);
        const yesterday = getLocalStr(new Date(todayDate.getTime() - 86400000));
        const twoDaysAgo = getLocalStr(new Date(todayDate.getTime() - 86400000 * 2));

        it('should return 0 if history is empty', () => {
            expect(StatsEngine.calculateStreak([], habitId)).toBe(0);
        });

        it('should return 0 if streak is broken (last completion 2 days ago)', () => {
            const history: DailyProgress[] = [{
                habitId, date: twoDaysAgo, currentCount: 1, completed: true
            }];
            expect(StatsEngine.calculateStreak(history, habitId)).toBe(0);
        });

        it('should return 1 if completed today only', () => {
            const history: DailyProgress[] = [{
                habitId, date: today, currentCount: 1, completed: true
            }];
            expect(StatsEngine.calculateStreak(history, habitId)).toBe(1);
        });

        it('should return 2 if completed today and yesterday', () => {
            const history: DailyProgress[] = [
                { habitId, date: today, currentCount: 1, completed: true },
                { habitId, date: yesterday, currentCount: 1, completed: true }
            ];
            expect(StatsEngine.calculateStreak(history, habitId)).toBe(2);
        });

        it('should handle duplicates safely', () => {
            const history: DailyProgress[] = [
                { habitId, date: today, currentCount: 1, completed: true },
                { habitId, date: today, currentCount: 1, completed: true }, // Duplicate
                { habitId, date: yesterday, currentCount: 1, completed: true }
            ];
            expect(StatsEngine.calculateStreak(history, habitId)).toBe(2);
        });
    });
});
