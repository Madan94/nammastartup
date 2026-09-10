import { sites } from '@openai/sites-vite-plugin';
import vinext from 'vinext';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import hosting from './.openai/hosting.json';
export default defineConfig(async () => {
  process.env.WRANGLER_WRITE_LOGS ??= 'false';
  process.env.WRANGLER_LOG_PATH ??= '.wrangler/logs';
  process.env.MINIFLARE_REGISTRY_PATH ??= '.wrangler/registry';
  const { cloudflare } = await import('@cloudflare/vite-plugin');
  return {
    resolve: {
      alias: [
        {
          find: '@/lib/server/platform',
          replacement: fileURLToPath(
            new URL('./src/lib/server/platform-worker.ts', import.meta.url),
          ),
        },
      ],
    },
    plugins: [
      vinext(),
      sites(),
      cloudflare({
        viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
        config: {
          name: 'namma-chennai',
          main: 'vinext/server/app-router-entry',
          compatibility_date: '2026-09-01',
          compatibility_flags: ['nodejs_compat'],
          d1_databases: [
            {
              binding: hosting.d1,
              database_name: 'namma-chennai-local',
              database_id: '00000000-0000-4000-8000-000000000000',
            },
          ],
        },
      }),
    ],
  };
});
