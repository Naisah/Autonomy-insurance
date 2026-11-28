// Starts the Prism mock on a free port, checks that GET /health and POST /auth/login answer
// with 200, then stops it (T001 "Mock server answers GET /health and one auth route").
// Sample data only: the login body below is a made-up demo address, not a real account.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const local = path.join(root, 'node_modules', '.bin', 'prism');
const bin = existsSync(local) ? local : path.join(root, '..', '..', 'node_modules', '.bin', 'prism');
const port = Number(process.env.MOCK_PORT ?? 4510);
const base = `http://127.0.0.1:${port}`;

const prism = spawn(bin, ['mock', path.join(root, 'openapi.yaml'), '--port', String(port), '--host', '127.0.0.1'], {
  stdio: ['ignore', 'pipe', 'pipe'],
});
let log = '';
prism.stdout.on('data', (d) => (log += d));
prism.stderr.on('data', (d) => (log += d));

async function waitUp() {
  for (let i = 0; i < 60; i++) {
    try {
      await fetch(`${base}/health`);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw new Error(`Prism did not start:\n${log}`);
}

const checks = [
  { name: 'GET /health', run: () => fetch(`${base}/health`) },
  {
    name: 'POST /auth/login',
    run: () =>
      fetch(`${base}/auth/login`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: 'demo.client@example.com', password: 'sample-only', client: 'web' }),
      }),
  },
];

let failed = 0;
try {
  await waitUp();
  for (const c of checks) {
    const res = await c.run();
    const ok = res.status === 200;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${c.name} -> ${res.status}`);
    if (!ok) failed++;
  }
} catch (e) {
  console.error(e.message);
  failed++;
} finally {
  prism.kill();
}
process.exit(failed ? 1 : 0);
