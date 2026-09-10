import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const companies = sqliteTable(
  'companies',
  {
    slug: text('slug').primaryKey(),
    name: text('name').notNull(),
    sector: text('sector').notNull(),
    area: text('area').notNull(),
    kind: text('kind').notNull(),
    record: text('record').notNull(),
    status: text('status').notNull().default('published'),
    updatedAt: text('updated_at').notNull(),
  },
  (t) => [index('companies_status_area').on(t.status, t.area)],
);
export const jobs = sqliteTable(
  'jobs',
  {
    id: text('id').primaryKey(),
    companySlug: text('company_slug')
      .notNull()
      .references(() => companies.slug),
    record: text('record').notNull(),
    active: integer('active').notNull().default(1),
    observedAt: text('observed_at').notNull(),
  },
  (t) => [index('jobs_company_active').on(t.companySlug, t.active)],
);
export const news = sqliteTable('news', {
  id: text('id').primaryKey(),
  record: text('record').notNull(),
  publishedAt: text('published_at').notNull(),
});
export const submissions = sqliteTable(
  'submissions',
  {
    id: text('id').primaryKey(),
    kind: text('kind').notNull(),
    name: text('name').notNull(),
    website: text('website').notNull(),
    email: text('email').notNull(),
    payload: text('payload').notNull(),
    status: text('status').notNull().default('pending'),
    note: text('note').notNull().default(''),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (t) => [index('submissions_status_created').on(t.status, t.createdAt)],
);
export const syncRuns = sqliteTable('sync_runs', {
  source: text('source').primaryKey(),
  attemptedAt: text('attempted_at').notNull(),
  successAt: text('success_at'),
  error: text('error'),
  itemCount: integer('item_count').notNull().default(0),
});
export const rateLimits = sqliteTable('rate_limits', {
  key: text('key').primaryKey(),
  count: integer('count').notNull(),
  expires: integer('expires').notNull(),
});
export const audit = sqliteTable('audit', {
  id: text('id').primaryKey(),
  action: text('action').notNull(),
  recordId: text('record_id').notNull(),
  createdAt: text('created_at').notNull(),
});
