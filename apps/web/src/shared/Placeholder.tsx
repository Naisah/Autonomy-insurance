import type { ReactNode } from 'react';

export function Placeholder({ children }: { children: ReactNode }) {
  return <section>{children}</section>;
}
