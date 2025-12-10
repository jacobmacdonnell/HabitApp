import { StorageServiceType, Habit, Pet, DailyProgress, Settings, HabitFrequency } from '@habitapp/shared';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { eq, and, gte, lte, sql, desc } from 'drizzle-orm';

import { db } from '../db/client';
import { habits, dailyProgress, pet, settings } from '../db/schema';

const KEYS = {
    HABITS: 'habit-app-habits',
    PET: 'habit-app-pet',
    PROGRESS: 'habit-app-progress',
    SETTINGS: 'habit-app-settings',
};

// MIGRATION HELPER
export const migrateFromAsyncStorage = async () => {
    try {
        // Check if we already have data in SQLite
        const existingHabits = await db.select().from(habits).limit(1);
        if (existingHabits.length > 0) {
            return;
        }

        // console.log('Starting migration from AsyncStorage...');

        // 1. Habits
        const habitsJson = await AsyncStorage.getItem(KEYS.HABITS);
        if (habitsJson) {
            const habitsData: Habit[] = JSON.parse(habitsJson);
            if (habitsData.length > 0) {
                await db.insert(habits).values(
                    habitsData.map((h) => ({
                        ...h,
                        frequency: h.frequency,
                        createdAt: Date.now(),
                    }))
                );
            }
        }

        // 2. Progress
        const progressJson = await AsyncStorage.getItem(KEYS.PROGRESS);
        if (progressJson) {
            const progressData: DailyProgress[] = JSON.parse(progressJson);
            if (progressData.length > 0) {
                // Bulk insert in chunks to avoid limits
                const CHUNK_SIZE = 500;
                for (let i = 0; i < progressData.length; i += CHUNK_SIZE) {
                    const chunk = progressData.slice(i, i + CHUNK_SIZE);
                    await db.insert(dailyProgress).values(
                        chunk.map((p) => ({
                            habitId: p.habitId,
                            date: p.date,
                            currentCount: p.currentCount,
                            completed: p.completed,
                            // id auto-increments
                        }))
                    );
                }
            }
        }

        // 3. Pet
        const petJson = await AsyncStorage.getItem(KEYS.PET);
        if (petJson) {
            const petData: Pet = JSON.parse(petJson);
            await db.insert(pet).values({
                ...petData,
                history: petData.history || [],
            });
        }

        // 4. Settings
        const settingsJson = await AsyncStorage.getItem(KEYS.SETTINGS);
        if (settingsJson) {
            const settingsData: Settings = JSON.parse(settingsJson);
            await db.insert(settings).values(settingsData);
        }

        // console.log('Migration completed successfully!');

        // Optional: clear AsyncStorage after success?
        // Better to keep it as backup for now.
    } catch (e) {
        console.error('Migration failed:', e);
    }
};

export const SQLiteStorageService: StorageServiceType = {
    getHabits: async (): Promise<Habit[]> => {
        const rows = await db.select().from(habits);
        return rows.map((row) => ({
            ...row,
            frequency: row.frequency as HabitFrequency,
        })) as Habit[];
    },

    saveHabits: async (newHabits: Habit[]) => {
        // Strategy: We can't easily sync full array replacement like AsyncStorage
        // For now, simpler to delete all and re-insert, OR upsert.
        // Given current app logic passes the FULL array every time, full replace is safer for sync
        // BUT efficient way is to just handle adds/updates in upper layer.
        // For MVP compatibility with `saveHabits(Habit[])`:
        // We will perform a Transaction: Delete All -> Insert All.
        // This is inefficient but 100% compatible.
        // Note: Context now calls atomic addHabit/updateHabit; this is kept for bulk migration.

        await db.transaction(async (tx) => {
            await tx.delete(habits);
            if (newHabits.length > 0) {
                await tx.insert(habits).values(
                    newHabits.map((h) => ({
                        ...h,
                        frequency: h.frequency,
                        createdAt: Date.now(),
                    }))
                );
            }
        });
    },

    getPet: async (): Promise<Pet | null> => {
        const rows = await db.select().from(pet).limit(1);
        if (rows.length === 0) return null;
        const row = rows[0];
        return {
            ...row,
            history: (row.history as Pet['history']) || [],
        } as Pet;
    },

    savePet: async (newPet: Pet) => {
        const existing = await db.select().from(pet).limit(1);
        if (existing.length > 0) {
            await db
                .update(pet)
                .set({
                    ...newPet,
                    history: newPet.history || [],
                })
                .where(eq(pet.id, existing[0].id));
        } else {
            await db.insert(pet).values({
                ...newPet,
                history: newPet.history ?? [],
            });
        }
    },

    getProgress: async (): Promise<DailyProgress[]> => {
        // CRITICAL SCALABILITY FIX:
        // By default, the app wants ALL progress.
        // For migration safety, we return all (capped?) or just rely on SQLite speed.
        // Loading purely from SQLite is fast enough for 10k rows.
        // But optimally, we should filter.
        // Since we are matching the interface `() => Promise<DailyProgress[]>`, we return logic.
        // NOTE: We should modify the interface later.

        const rows = await db.select().from(dailyProgress);
        return rows.map((r) => ({
            habitId: r.habitId,
            date: r.date,
            currentCount: r.currentCount,
            completed: !!r.completed,
        }));
    },

    // Helper for optimized fetching (to be used later)
    getProgressForRange: async (startDate: string, endDate: string) => {
        const rows = await db
            .select()
            .from(dailyProgress)
            .where(and(gte(dailyProgress.date, startDate), lte(dailyProgress.date, endDate)));
        return rows.map((r) => ({
            habitId: r.habitId,
            date: r.date,
            currentCount: r.currentCount,
            completed: !!r.completed,
        }));
    },

    getHabitStats: async (habitId: string) => {
        // SCALABLE STATS CALCULATION
        // 1. Total Completions (Fast Count)
        const completionResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(dailyProgress)
            .where(and(eq(dailyProgress.habitId, habitId), eq(dailyProgress.completed, true)));

        const totalCompletions = completionResult[0]?.count || 0;

        // 2. Current Streak (Optimized Loading)
        // Instead of loading all history, we load the last 365 days of completion data.
        // If someone has a > 1 year streak, this might be inaccurate, but it's a reasonable optimization for mobile.
        // Or we could use a recursive CTE if SQLite version allows, but let's stick to safe logic.

        const getLocalDateString = (d: Date = new Date()): string => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const today = getLocalDateString();
        const oneYearAgo = getLocalDateString(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000));

        const recentProgress = await db
            .select({ date: dailyProgress.date })
            .from(dailyProgress)
            .where(
                and(
                    eq(dailyProgress.habitId, habitId),
                    eq(dailyProgress.completed, true),
                    gte(dailyProgress.date, oneYearAgo)
                )
            )
            .orderBy(desc(dailyProgress.date));

        // Calculate Streak in JS from sorted dates
        let currentStreak = 0;
        let lastDate: Date | null = null;
        const now = new Date(today);

        // Helper to check if dates are consecutive
        const isConsecutive = (d1: Date, d2: Date) => {
            const diffTime = Math.abs(d2.getTime() - d1.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays === 1;
        };

        const isSameDay = (d1: Date, d2: Date) => d1.getTime() === d2.getTime();

        for (const entry of recentProgress) {
            const entryDate = new Date(entry.date);

            if (currentStreak === 0) {
                // Check if streak is active (today or yesterday)
                const diffTime = Math.abs(now.getTime() - entryDate.getTime());
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays <= 1) {
                    currentStreak = 1;
                    lastDate = entryDate;
                } else {
                    break; // Streak broken before it started
                }
            } else if (lastDate) {
                if (isSameDay(lastDate, entryDate)) continue; // Ignore duplicates
                if (isConsecutive(entryDate, lastDate)) {
                    currentStreak++;
                    lastDate = entryDate;
                } else {
                    break; // Streak broken
                }
            }
        }

        return {
            totalCompletions,
            currentStreak,
        };
    },

    saveProgress: async (progressList: DailyProgress[]) => {
        // Full sync implementation: Delete all and re-insert.
        // This is inefficient but ensures exact consistency with the Context's state.
        // Optimized methods like logSingleProgress should be used for frequent updates.

        try {
            await db.transaction(async (tx) => {
                if (progressList.length > 0) {
                    // Upsert in chunks
                    const CHUNK_SIZE = 50;
                    for (let i = 0; i < progressList.length; i += CHUNK_SIZE) {
                        const chunk = progressList.slice(i, i + CHUNK_SIZE);

                        // We use ON CONFLICT DO UPDATE to update existing records without deleting
                        await tx
                            .insert(dailyProgress)
                            .values(
                                chunk.map((p) => ({
                                    habitId: p.habitId,
                                    date: p.date,
                                    currentCount: p.currentCount,
                                    completed: p.completed,
                                }))
                            )
                            .onConflictDoUpdate({
                                target: [dailyProgress.habitId, dailyProgress.date],
                                set: {
                                    currentCount: sql`excluded.current_count`,
                                    completed: sql`excluded.completed`,
                                },
                            });
                    }
                }
            });
        } catch (error) {
            console.error('Failed to save progress:', error);
        }
    },

    // New Method for O(1) updates
    logSingleProgress: async (item: DailyProgress) => {
        // Check if exists
        const existing = await db
            .select()
            .from(dailyProgress)
            .where(and(eq(dailyProgress.habitId, item.habitId), eq(dailyProgress.date, item.date)))
            .limit(1);

        if (existing.length > 0) {
            await db
                .update(dailyProgress)
                .set({
                    currentCount: item.currentCount,
                    completed: item.completed,
                })
                .where(eq(dailyProgress.id, existing[0].id));
        } else {
            await db.insert(dailyProgress).values(item);
        }
    },

    getSettings: async (): Promise<Settings> => {
        const rows = await db.select().from(settings).limit(1);
        if (rows.length === 0) {
            return {
                sleepStart: '22:00',
                sleepEnd: '06:00',
                notifications: true,
                sound: true,
                theme: 'auto',
            };
        }
        return {
            ...rows[0],
            notifications: !!rows[0].notifications,
            sound: !!rows[0].sound,
            theme: rows[0].theme as Settings['theme'],
        };
    },

    saveSettings: async (newSettings: Settings) => {
        const existing = await db.select().from(settings).limit(1);
        if (existing.length > 0) {
            await db.update(settings).set(newSettings).where(eq(settings.id, existing[0].id));
        } else {
            await db.insert(settings).values(newSettings);
        }
    },

    // Atomic habit operations for O(1) performance
    addHabit: async (habit: Habit) => {
        await db.insert(habits).values({
            ...habit,
            frequency: habit.frequency,
            createdAt: Date.now(),
        });
    },

    updateHabit: async (id: string, updates: Partial<Habit>) => {
        const { id: _, ...safeUpdates } = updates;
        await db.update(habits).set(safeUpdates).where(eq(habits.id, id));
    },

    deleteHabit: async (id: string) => {
        // Cascade delete in schema handles progress cleanup
        await db.delete(habits).where(eq(habits.id, id));
    },
};
