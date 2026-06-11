import { ApplicationConfig, importProvidersFrom, provideAppInitializer, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { firstValueFrom } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
        provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    importProvidersFrom(ReactiveFormsModule),
    
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return firstValueFrom(authService.autorizar()).catch(() => null);
    })
  ]
};