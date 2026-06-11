import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({
    withCredentials: true,
  });

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401 && !req.url.includes('/auth/login')) {
        console.error('Sesión no autorizada. Redirigiendo...');
        inject(Router).navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
