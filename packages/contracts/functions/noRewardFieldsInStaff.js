// Fails when a schema whose name ends in "Staff" has a reward field anywhere inside it
// (own properties, allOf/oneOf/anyOf parts, nested objects, array items).
// Reward fields come from spec 05 section 1 and AGENTS.md.
const REWARD_FIELDS = new Set([
  'rewardNote',
  'rewardStatus',
  'rewardPoints',
  'payoutDelayDays',
  'payoutDueDate',
  'reasonLabel',
]);

function findRewardFields(node, path, out, seen) {
  if (!node || typeof node !== 'object' || seen.has(node)) return;
  seen.add(node);
  if (node.properties && typeof node.properties === 'object') {
    for (const key of Object.keys(node.properties)) {
      if (REWARD_FIELDS.has(key)) out.push({ field: key, path: [...path, 'properties', key] });
      findRewardFields(node.properties[key], [...path, 'properties', key], out, seen);
    }
  }
  for (const k of ['allOf', 'oneOf', 'anyOf']) {
    if (Array.isArray(node[k])) node[k].forEach((s, i) => findRewardFields(s, [...path, k, i], out, seen));
  }
  if (node.items) findRewardFields(node.items, [...path, 'items'], out, seen);
  if (node.additionalProperties && typeof node.additionalProperties === 'object') {
    findRewardFields(node.additionalProperties, [...path, 'additionalProperties'], out, seen);
  }
}

export default function noRewardFieldsInStaff(schemas, _opts, context) {
  if (!schemas || typeof schemas !== 'object') return [];
  const results = [];
  for (const [name, schema] of Object.entries(schemas)) {
    if (!name.endsWith('Staff')) continue;
    const found = [];
    // Spectral resolves $refs before calling us, so referenced parts are checked too.
    findRewardFields(schema, [], found, new WeakSet());
    for (const f of found) {
      results.push({
        message: `${name} is a Staff schema and must not have the reward field "${f.field}".`,
        path: [...context.path, name, ...f.path],
      });
    }
  }
  return results;
}
