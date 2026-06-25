import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export function roleGuard(expectedRoles: string[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const role = authService.getCurrentRole();

    if (!authService.getToken()) {
      return router.createUrlTree(['/login']);
    }

    if (expectedRoles.includes(role)) {
      return true;
    }

    return router.createUrlTree(['/']);
  };
}
