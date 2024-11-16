import { inject } from '@angular/core';
import {
  CanActivateChildFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthUserService } from '../services/auth-user.service';

export const authGuard: CanActivateChildFn = (childRoute, state) => {
  state: RouterStateSnapshot;
  const router = inject(Router);
  const authUserService = inject(AuthUserService);
  const isUserAuthenticated = authUserService.UserLoggedIn();

  if (isUserAuthenticated) {
    return true;
  } else {
    localStorage.setItem('attemptedURL', state.url);
    router.navigateByUrl('login');
    return false;
  }
};
