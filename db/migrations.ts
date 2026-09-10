// Generated from drizzle/0000_yummy_puck.sql; idempotent runtime bootstrap.
export const schemaStatements = [
  'CREATE TABLE IF NOT EXISTS `audit` (\n\t`id` text PRIMARY KEY NOT NULL,\n\t`action` text NOT NULL,\n\t`record_id` text NOT NULL,\n\t`created_at` text NOT NULL\n);',
  "CREATE TABLE IF NOT EXISTS `companies` (\n\t`slug` text PRIMARY KEY NOT NULL,\n\t`name` text NOT NULL,\n\t`sector` text NOT NULL,\n\t`area` text NOT NULL,\n\t`kind` text NOT NULL,\n\t`record` text NOT NULL,\n\t`status` text DEFAULT 'published' NOT NULL,\n\t`updated_at` text NOT NULL\n);",
  'CREATE INDEX IF NOT EXISTS `companies_status_area` ON `companies` (`status`,`area`);',
  'CREATE TABLE IF NOT EXISTS `jobs` (\n\t`id` text PRIMARY KEY NOT NULL,\n\t`company_slug` text NOT NULL,\n\t`record` text NOT NULL,\n\t`active` integer DEFAULT 1 NOT NULL,\n\t`observed_at` text NOT NULL,\n\tFOREIGN KEY (`company_slug`) REFERENCES `companies`(`slug`) ON UPDATE no action ON DELETE no action\n);',
  'CREATE INDEX IF NOT EXISTS `jobs_company_active` ON `jobs` (`company_slug`,`active`);',
  'CREATE TABLE IF NOT EXISTS `news` (\n\t`id` text PRIMARY KEY NOT NULL,\n\t`record` text NOT NULL,\n\t`published_at` text NOT NULL\n);',
  'CREATE TABLE IF NOT EXISTS `rate_limits` (\n\t`key` text PRIMARY KEY NOT NULL,\n\t`count` integer NOT NULL,\n\t`expires` integer NOT NULL\n);',
  "CREATE TABLE IF NOT EXISTS `submissions` (\n\t`id` text PRIMARY KEY NOT NULL,\n\t`kind` text NOT NULL,\n\t`name` text NOT NULL,\n\t`website` text NOT NULL,\n\t`email` text NOT NULL,\n\t`payload` text NOT NULL,\n\t`status` text DEFAULT 'pending' NOT NULL,\n\t`note` text DEFAULT '' NOT NULL,\n\t`created_at` text NOT NULL,\n\t`updated_at` text NOT NULL\n);",
  'CREATE INDEX IF NOT EXISTS `submissions_status_created` ON `submissions` (`status`,`created_at`);',
  'CREATE TABLE IF NOT EXISTS `sync_runs` (\n\t`source` text PRIMARY KEY NOT NULL,\n\t`attempted_at` text NOT NULL,\n\t`success_at` text,\n\t`error` text,\n\t`item_count` integer DEFAULT 0 NOT NULL\n);',
];
