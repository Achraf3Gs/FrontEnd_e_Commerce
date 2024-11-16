import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { authInterceptorFn } from './services/auth.interceptor';
import { JwtModule } from '@auth0/angular-jwt';

export function tokenGetter() {
  return localStorage.getItem('access_Token');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptorFn]), // Add your interceptor here
      withInterceptorsFromDi(), // To allow other DI-based interceptors
      withFetch()
    ),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideToastr(),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['example.com'],
          disallowedRoutes: ['http://example.com/examplebadroute/'],
        },
      })
    ),
  ],
};
