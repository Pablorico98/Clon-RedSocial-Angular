import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Iniciar Sesión',  
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'registro',
    title: 'Crear Cuenta',
    loadComponent: () => import('./pages/registro/registro').then(m => m.Registro)
  },
  {
    path: 'inicio',
    title: 'Feed - Red Social',
    loadComponent: () => import('./pages/inicio/inicio').then(m => m.Inicio)
  },
  {
    path: 'perfil',
    title: 'Mi Perfil',
    loadComponent: () => import('./pages/perfil/perfil').then(m => m.Perfil)
  },
  // Ruta por defecto: si entran a localhost:4200 sin nada, los manda al login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  // Ruta comodín (Wildcard): si escriben cualquier ruta que no existe, los manda al login
  {
    path: '**',
    redirectTo: 'login'
  }
];