import type { AssignHook } from '../login/store.js';

// Stub until T026 (assignment) lands: nobody qualifies, so the client is created waiting.
let hook: AssignHook = async () => null;

export function setAssignHook(h: AssignHook | undefined): void {
  hook = h ?? (async () => null);
}

export const assignAgent: AssignHook = (clientId) => hook(clientId);
