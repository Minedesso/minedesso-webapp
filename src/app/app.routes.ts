import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { MockApiService } from './core/mock-api.service';

const authGuard: CanActivateFn = () => {
  const api = inject(MockApiService);
  return api.isAuthenticated() ? true : inject(Router).createUrlTree(['/login']);
};

const playerPages = [
  'overview',
  'profile',
  'game-modes',
  'friends',
  'achievements',
  'quests',
  'daily',
  'rewards',
  'chronicles',
  'events',
  'leaderboards',
];
const adminPages = [
  'overview',
  'servers',
  'players',
  'console',
  'backups',
  'settings',
  'roles',
  'logs',
];

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing').then((module) => module.LandingComponent),
    title: 'Minedesso Network',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth').then((module) => module.AuthComponent),
    title: 'Anmelden · Minedesso',
  },
  {
    path: 'link',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/auth').then((module) => module.LinkAccountComponent),
    title: 'Minecraft verbinden · Minedesso',
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/app-shell').then((module) => module.AppShellComponent),
    children: [
      ...playerPages.map((page) => ({
        path: `hub/${page}`,
        loadComponent: () =>
          import('./pages/player-hub').then((module) => module.PlayerHubComponent),
        data: { page },
        title: `${page} · Minedesso`,
      })),
      ...adminPages.map((page) => ({
        path: `admin/${page}`,
        loadComponent: () => import('./pages/admin').then((module) => module.AdminComponent),
        data: { page },
        title: `${page} · Minedesso Admin`,
      })),
      { path: 'hub', pathMatch: 'full' as const, redirectTo: 'hub/overview' },
      { path: 'admin', pathMatch: 'full' as const, redirectTo: 'admin/overview' },
    ],
  },
  { path: '**', redirectTo: '' },
];
