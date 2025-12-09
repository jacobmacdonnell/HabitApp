DROP INDEX `habit_date_idx`;--> statement-breakpoint
CREATE UNIQUE INDEX `habit_date_unique_idx` ON `daily_progress` (`habit_id`,`date`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_habits` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`color` text NOT NULL,
	`icon` text NOT NULL,
	`frequency` text NOT NULL,
	`time_of_day` text NOT NULL,
	`target_count` integer NOT NULL,
	`created_at` integer DEFAULT 1765246319649
);
--> statement-breakpoint
INSERT INTO `__new_habits`("id", "title", "color", "icon", "frequency", "time_of_day", "target_count", "created_at") SELECT "id", "title", "color", "icon", "frequency", "time_of_day", "target_count", "created_at" FROM `habits`;--> statement-breakpoint
DROP TABLE `habits`;--> statement-breakpoint
ALTER TABLE `__new_habits` RENAME TO `habits`;--> statement-breakpoint
PRAGMA foreign_keys=ON;