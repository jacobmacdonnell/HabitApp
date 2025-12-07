import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

// Habits Table
export const habits = sqliteTable('habits', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    color: text('color').notNull(),
    icon: text('icon').notNull(),
    frequency: text('frequency', { mode: 'json' }).notNull(), // Stores JSON string of HabitFrequency
    timeOfDay: text('time_of_day').notNull(), // 'morning' | 'midday' | 'evening' | 'anytime'
    targetCount: integer('target_count').notNull(),
    createdAt: integer('created_at').default(Date.now()),
});

// Daily Progress Table (The Scalability Fix)
export const dailyProgress = sqliteTable('daily_progress', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    habitId: text('habit_id').references(() => habits.id, { onDelete: 'cascade' }).notNull(),
    date: text('date').notNull(), // ISO Date YYYY-MM-DD
    currentCount: integer('current_count').notNull().default(0),
    completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
}, (table) => ({
    habitIdIdx: index('habit_id_idx').on(table.habitId),
    dateIdx: index('date_idx').on(table.date),
    compositeIdx: index('habit_date_idx').on(table.habitId, table.date),
}));

// Pet Table (Single Row usually)
export const pet = sqliteTable('pet', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    hat: text('hat'),
    color: text('color').notNull(),
    health: integer('health').notNull(),
    maxHealth: integer('max_health').notNull(),
    level: integer('level').notNull(),
    xp: integer('xp').notNull(),
    mood: text('mood').notNull(),
    history: text('history', { mode: 'json' }), // Stores JSON string of Pet history
    lastInteraction: text('last_interaction').notNull(),
});

// Settings Table (Single Row)
export const settings = sqliteTable('settings', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    sleepStart: text('sleep_start').notNull(),
    sleepEnd: text('sleep_end').notNull(),
    notifications: integer('notifications', { mode: 'boolean' }).notNull(),
    sound: integer('sound', { mode: 'boolean' }).notNull(),
    theme: text('theme').notNull(), // 'auto' | 'light' | 'dark'
});
