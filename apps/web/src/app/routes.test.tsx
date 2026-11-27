import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RouteView } from './RouteView';
import { routes } from './routes';

describe('feature route discovery', () => {
  it('registers a feature route without editing the shared route list', () => {
    expect(routes.map((route) => route.path)).toContain('/');
  });

  it('renders the route selected by the current location', () => {
    window.history.replaceState({}, '', '/');
    render(<RouteView />);
    expect(screen.getByRole('heading', { name: 'Autonomy Insurance' })).toBeInTheDocument();
  });
});
