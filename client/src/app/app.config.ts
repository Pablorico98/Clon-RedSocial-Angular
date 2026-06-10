import { ApplicationConfig, provideBrowserGlobalErrorListeners,importProvidersFrom } from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import {provideHttpClient,  withInterceptors}  from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(ReactiveFormsModule)
  ]
};
