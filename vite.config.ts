import { sites } from '@openai/sites-vite-plugin';
import vinext from 'vinext';
import { defineConfig, type Plugin } from 'vite';
import { fileURLToPath } from 'node:url';
import hosting from './.openai/hosting.json' with { type: 'json' };
export default defineConfig(async () => {
  process.env.WRANGLER_WRITE_LOGS ??= 'false';
  process.env.WRANGLER_LOG_PATH ??= '.wrangler/logs';
  process.env.MINIFLARE_REGISTRY_PATH ??= '.wrangler/registry';
  const { cloudflare } = await import('@cloudflare/vite-plugin');
  const workerPlatform = fileURLToPath(
    new URL('./src/lib/server/platform-worker.ts', import.meta.url),
  );
  const nodePlatform = fileURLToPath(
    new URL('./src/lib/server/platform.ts', import.meta.url),
  ).replaceAll('\\', '/');
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
      {
        name: 'namma-d1-platform',
        enforce: 'pre',
        resolveId(source) {
          const normalized = source.replaceAll('\\', '/');
          if (
            source === '@/lib/server/platform' ||
            normalized === nodePlatform ||
            normalized === nodePlatform.slice(0, -3)
          )
            return workerPlatform;
        },
        load(id) {
          // Vinext can resolve TypeScript aliases before user aliases; handle the resolved file too.
          const normalized = id.split('?')[0].replaceAll('\\', '/');
          if (normalized.toLowerCase() === nodePlatform.toLowerCase())
            return `export { openStore } from ${JSON.stringify(workerPlatform.replaceAll('\\', '/'))};`;
        },
        generateBundle(_options, bundle) {
          for (const output of Object.values(bundle)) {
            if (output.type !== 'chunk') continue;
            for (const id of Object.keys(output.modules)) {
              if (
                id.replaceAll('\\', '/').toLowerCase() === nodePlatform.toLowerCase() &&
                this.getModuleInfo(id)?.code?.includes('node:sqlite')
              )
                throw new Error('The local SQLite adapter must not enter the Workers build');
            }
          }
        },
      } satisfies Plugin,
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
