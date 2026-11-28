import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

// Decision K2: load every src/modules/*/routes.(ts|js) automatically,
// so adding a module never edits a shared file.
export async function loadModules(app: FastifyInstance, modulesDir: string): Promise<string[]> {
  const loaded: string[] = [];
  if (!existsSync(modulesDir)) return loaded;
  for (const name of readdirSync(modulesDir).sort()) {
    const dir = path.join(modulesDir, name);
    if (!statSync(dir).isDirectory()) continue;
    const file = ['routes.ts', 'routes.js'].map((f) => path.join(dir, f)).find(existsSync);
    if (!file) continue;
    const mod = (await import(pathToFileURL(file).href)) as { default?: FastifyPluginAsync };
    if (typeof mod.default !== 'function') {
      throw new Error(`module ${name}: routes file must default-export a Fastify plugin`);
    }
    await app.register(mod.default);
    loaded.push(name);
  }
  return loaded;
}
