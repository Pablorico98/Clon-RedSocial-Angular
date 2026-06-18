import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const adminGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const usuario = await firstValueFrom(authService.usuario$);

  if (usuario?.perfil === 'administrador') {
    return true;
  }

  return router.parseUrl('/inicio');
};
