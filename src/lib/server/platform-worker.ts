import { env } from 'cloudflare:workers';
import type { Store, SqlValue } from './store';
export async function openStore(): Promise<Store> {
  const db = env.DB;
  if (!db) throw new Error('Persistent database binding is unavailable');
  return {
    async all<T>(sql: string, params: SqlValue[] = []) {
      return (
        await db
          .prepare(sql)
          .bind(...params)
          .all<T>()
      ).results;
    },
    async run(sql, params = []) {
      await db
        .prepare(sql)
        .bind(...params)
        .run();
    },
    async batch(statements) {
      await db.batch(statements.map((s) => db.prepare(s.sql).bind(...(s.params || []))));
    },
  };
}
