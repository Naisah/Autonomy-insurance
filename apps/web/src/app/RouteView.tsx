import { createElement } from 'react';
import { routes } from './routes';

export function RouteView() {
  const route = routes.find((candidate) => candidate.path === window.location.pathname);
  if (!route) {
    return <h1>Page not found</h1>;
  }
  return createElement(route.component);
}
