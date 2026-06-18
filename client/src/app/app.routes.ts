import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent), canActivate: [publicGuard] },
  { path: 'registro', loadComponent: () => import('./pages/registro/registro').then(m => m.RegistroComponent), canActivate: [publicGuard] },
  { path: 'inicio', loadComponent: () => import('./pages/inicio/inicio').then(m => m.Inicio), canActivate: [authGuard] },
  { path: 'perfil', loadComponent: () => import('./pages/perfil/perfil').then(m => m.Perfil), canActivate: [authGuard] },
  
  { path: 'publicacion/:id', loadComponent: () => import('./pages/publicacion-detalle/publicacion-detalle').then(m => m.PublicacionDetalleComponent), canActivate: [authGuard] },
  
  { path: 'dashboard/usuarios', loadComponent: () => import('./pages/dashboard/usuarios/usuarios').then(m => m.DashboardUsuarios), canActivate: [authGuard, adminGuard] },
  { path: 'dashboard/estadisticas', loadComponent: () => import('./pages/dashboard/estadisticas/estadisticas').then(m => m.DashboardEstadisticas), canActivate: [authGuard, adminGuard] },

  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'inicio' }
];