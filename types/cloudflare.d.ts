declare module 'cloudflare:workers' {
  export const env: {
    DB?: {
      prepare(sql: string): {
        bind(...values: (string | number | null)[]): {
          all<T>(): Promise<{ results: T[] }>;
          run(): Promise<unknown>;
        };
        all<T>(): Promise<{ results: T[] }>;
        run(): Promise<unknown>;
      };
      batch(statements: unknown[]): Promise<unknown>;
    };
  };
}
