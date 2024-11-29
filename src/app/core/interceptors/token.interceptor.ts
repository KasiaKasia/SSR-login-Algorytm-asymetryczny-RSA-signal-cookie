import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const authReq = req.clone({ withCredentials: true });
  let isRefreshing = false;

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true;
          return authService.refreshToken().pipe(
            switchMap(() => {
              isRefreshing = false;

              // Stwórz nowe żądanie po odświeżeniu tokena
              const newReq = req.clone({ withCredentials: true });
              return next(newReq);
            }),
            catchError((refreshError) => {
              isRefreshing = false;
              authService.logout(); // Wyloguj, jeśli odświeżenie się nie powiodło
              return throwError(() => refreshError);
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};
