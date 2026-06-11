// client/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Iniciar Sesión',
    canActivate: [publicGuard],
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'registro',
    title: 'Crear Cuenta',
    canActivate: [publicGuard],
    loadComponent: () => import('./pages/registro/registro').then(m => m.RegistroComponent)
  },
  {
    path: 'inicio',
    title: 'Feed - Red Social',
    canActivate: [authGuard], // Asegura que solo los usuarios autenticados puedan acceder
    loadComponent: () => import('./pages/inicio/inicio').then(m => m.Inicio)
  },
  {
    path: 'perfil',
    title: 'Mi Perfil',
    canActivate: [authGuard], // Asegura que solo los usuarios autenticados puedan acceder
    loadComponent: () => import('./pages/perfil/perfil').then(m => m.Perfil)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];