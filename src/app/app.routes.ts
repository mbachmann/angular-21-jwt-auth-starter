import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const appRoutes: Routes = [
  { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent) },
  { path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'user', loadComponent: () => import('./board-user/board-user.component').then(m => m.BoardUserComponent) },
  {
    path: 'mod',
    loadComponent: () => import('./board-moderator/board-moderator.component').then(m => m.BoardModeratorComponent),
  },
  {
    path: 'admin',
    loadComponent: () => import('./board-admin/board-admin.component').then(m => m.BoardAdminComponent),
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN'] },
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '404', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
  { path: '401', loadComponent: () => import('./no-access/no-access.component').then(m => m.NoAccessComponent) },
  { path: '**', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
];

