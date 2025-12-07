CREATE TABLE `daily_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`habit_id` text NOT NULL,
	`date` text NOT NULL,
	`current_count` integer DEFAULT 0 NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`habit_id`) REFERENCES `habits`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `habits` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`color` text NOT NULL,
	`icon` text NOT NULL,
	`frequency` text NOT NULL,
	`time_of_day` text NOT NULL,
	`target_count` integer NOT NULL,
	`created_at` integer DEFAULT 1765079667977
);
--> statement-breakpoint
CREATE TABLE `pet` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`hat` text,
	`color` text NOT NULL,
	`health` integer NOT NULL,
	`max_health` integer NOT NULL,
	`level` integer NOT NULL,
	`xp` integer NOT NULL,
	`mood` text NOT NULL,
	`history` text,
	`last_interaction` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sleep_start` text NOT NULL,
	`sleep_end` text NOT NULL,
	`notifications` integer NOT NULL,
	`sound` integer NOT NULL,
	`theme` text NOT NULL
);
