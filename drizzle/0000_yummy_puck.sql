CREATE TABLE `audit` (
	`id` text PRIMARY KEY NOT NULL,
	`action` text NOT NULL,
	`record_id` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`slug` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`sector` text NOT NULL,
	`area` text NOT NULL,
	`kind` text NOT NULL,
	`record` text NOT NULL,
	`status` text DEFAULT 'published' NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `companies_status_area` ON `companies` (`status`,`area`);--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`company_slug` text NOT NULL,
	`record` text NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`observed_at` text NOT NULL,
	FOREIGN KEY (`company_slug`) REFERENCES `companies`(`slug`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `jobs_company_active` ON `jobs` (`company_slug`,`active`);--> statement-breakpoint
CREATE TABLE `news` (
	`id` text PRIMARY KEY NOT NULL,
	`record` text NOT NULL,
	`published_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`name` text NOT NULL,
	`website` text NOT NULL,
	`email` text NOT NULL,
	`payload` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `submissions_status_created` ON `submissions` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `sync_runs` (
	`source` text PRIMARY KEY NOT NULL,
	`attempted_at` text NOT NULL,
	`success_at` text,
	`error` text,
	`item_count` integer DEFAULT 0 NOT NULL
);
