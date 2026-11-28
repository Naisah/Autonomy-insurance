import { createElement } from 'react';

export const path = '/';

export default function ExampleRoute() {
  return createElement(
    'section',
    { className: 'mx-auto max-w-2xl space-y-4' },
    createElement('h1', { className: 'text-3xl font-semibold' }, 'Autonomy Insurance'),
    createElement('p', null, 'Web application placeholder'),
  );
}
