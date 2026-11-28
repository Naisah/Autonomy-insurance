// Compile-only check (tsc --noEmit): the generated types load and expose the shapes
// other packages rely on. Not run by Vitest.
import type { components, paths } from '../../generated/ts/api';

type Health = paths['/health']['get'];
type ErrorBody = components['schemas']['Error'];

export const healthCheck: Health | undefined = undefined;
export const errorCode: ErrorBody['error']['code'] | undefined = undefined;
