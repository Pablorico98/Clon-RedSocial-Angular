import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({ withCredentials: true });
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401 && authService.isAuthenticated()) {
        authService.limpiarSesion();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
