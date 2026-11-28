// Proves the custom lint rules fail when they should (T001).
// Each fixture in test/lint-fixtures must produce exactly the expected error rule codes;
// good.yaml must produce none.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const expected = {
  'good.yaml': [],
  'missing-x-roles.yaml': ['operation-x-roles'],
  'bad-x-roles.yaml': ['operation-x-roles'],
  'missing-x-stories.yaml': ['operation-x-stories'],
  'missing-x-priority.yaml': ['operation-x-priority-defined'],
  'bad-x-priority.yaml': ['operation-x-priority'],
  'staff-reward-field.yaml': ['staff-schema-no-reward-fields'],
  'staff-reward-field-nested.yaml': ['staff-schema-no-reward-fields'],
  'staff-reward-field-via-ref.yaml': ['staff-schema-no-reward-fields'],
};

// npm workspaces may hoist the binary to the repo root.
const local = path.join(root, 'node_modules', '.bin', 'spectral');
const bin = existsSync(local) ? local : path.join(root, '..', '..', 'node_modules', '.bin', 'spectral');

let failed = 0;
for (const [file, want] of Object.entries(expected)) {
  const target = path.join(root, 'test', 'lint-fixtures', file);
  let out;
  try {
    out = execFileSync(bin, ['lint', target, '--ruleset', path.join(root, '.spectral.yaml'), '-f', 'json', '--quiet'], {
      encoding: 'utf8',
    });
  } catch (e) {
    out = e.stdout; // spectral exits non-zero when it finds errors
  }
  const results = JSON.parse(out || '[]');
  const got = [...new Set(results.filter((r) => r.severity === 0).map((r) => r.code))].sort();
  const ok = JSON.stringify(got) === JSON.stringify([...want].sort());
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${file}: expected [${want.join(', ')}], got [${got.join(', ')}]`);
  if (!ok) failed++;
}
if (failed) {
  console.error(`${failed} lint fixture(s) did not behave as expected.`);
  process.exit(1);
}
console.log('All lint fixtures behave as expected.');
