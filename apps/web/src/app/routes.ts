import type { ComponentType } from 'react';

export type FeatureRoute = {
  path: string;
  component: ComponentType;
};

type RouteModule = { path: string; default: ComponentType };

const featureModules = import.meta.glob<RouteModule>('../features/*/route.ts', {
  eager: true,
});

export const routes: FeatureRoute[] = Object.values(featureModules).map((feature) => ({
  path: feature.path,
  component: feature.default,
}));
