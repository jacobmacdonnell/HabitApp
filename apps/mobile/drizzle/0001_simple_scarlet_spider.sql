PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_habits` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`color` text NOT NULL,
	`icon` text NOT NULL,
	`frequency` text NOT NULL,
	`time_of_day` text NOT NULL,
	`target_count` integer NOT NULL,
	`created_at` integer DEFAULT 1765091159700
);
--> statement-breakpoint
INSERT INTO `__new_habits`("id", "title", "color", "icon", "frequency", "time_of_day", "target_count", "created_at") SELECT "id", "title", "color", "icon", "frequency", "time_of_day", "target_count", "created_at" FROM `habits`;--> statement-breakpoint
DROP TABLE `habits`;--> statement-breakpoint
ALTER TABLE `__new_habits` RENAME TO `habits`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `habit_id_idx` ON `daily_progress` (`habit_id`);--> statement-breakpoint
CREATE INDEX `date_idx` ON `daily_progress` (`date`);--> statement-breakpoint
CREATE INDEX `habit_date_idx` ON `daily_progress` (`habit_id`,`date`);