import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);

  // ✅ Skip auth APIs
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  let token: string | null = null;

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  // ✅ Attach token
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(

    // ✅ Handle errors globally
    catchError((error) => {

      if (error.status === 401) {
        console.log("Token expired or invalid → logging out");

        // 🔥 Clear token
        localStorage.removeItem('token');

        // 🔥 Redirect to login
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};