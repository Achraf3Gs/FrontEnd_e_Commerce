import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, EMPTY, throwError } from 'rxjs';
import { catchError, delay, finalize } from 'rxjs/operators';
import { inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { AuthUserService } from './auth-user.service';
import { BusyService } from './busy.service';

export const authInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authUserService = inject(AuthUserService);
  const router = inject(Router);
  const busyService = inject(BusyService);
  const jwtHelper = new JwtHelperService();

  if (
    req.url.includes('/api/v1/auth/authenticate') ||
    req.url.includes('/api/v1/auth/register') ||
    req.url.includes('/api/v1/auth/logout')
  ) {
    return next(req);
  }

  let updatedRequest = req;

  if (authUserService.UserLoggedIn()) {
    busyService.busy();
    const access_Token = authUserService.getAccess_TokenFromLocalStorage();

    if (access_Token) {
      updatedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${access_Token}`,
        },
      });
    }
  }

  return next(updatedRequest).pipe(
    delay(2000),
    finalize(() => {
      busyService.idle(); // Hide the spinner
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403) {
        const access_Token = authUserService.getAccess_TokenFromLocalStorage();

        if (jwtHelper.isTokenExpired(access_Token)) {
          console.log('Token is expired');
          console.log('request.url:', req.url);

          const relativeUrl = mapBackendUrlToRoute(req.url);
          localStorage.setItem('attemptedURL', relativeUrl);
          authUserService.logout();
          router.navigate(['/login']).then(() => {
            console.log('Redirected to login page');
          });

          return EMPTY;
        }
      }
      return throwError(() => error);
    })
  );
};

const mapBackendUrlToRoute = (url: string): string => {
  const path = url.replace(/^https?:\/\/[^/]+\/?/, ''); // Strip out protocol and host

  const urlMapping: { [key: string]: string } = {
    'category/list': 'listCategory',
    'products/list': 'listProducts',
    // Add additional mappings as needed
  };

  return urlMapping[path] || path;
};
