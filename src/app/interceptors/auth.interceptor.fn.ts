import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Get token from auth service
  const token = authService.token;

  // Skip adding token for login and signup endpoints
  const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/signup');
  
  // Clone the request and add the authorization header if token exists
  if (token && !isAuthEndpoint) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Debug logging (remove in production)
    console.log('AuthInterceptor: Adding Bearer token to request:', clonedRequest.url);
    console.log('AuthInterceptor: Token:', token.substring(0, 20) + '...');
    
    return next(clonedRequest).pipe(
      catchError((error) => {
        if (error.status === 401) {
          console.error('AuthInterceptor: 401 Unauthorized - clearing auth data');
          // Unauthorized - clear auth data and redirect to login
          authService.clearAuthData();
        }
        return throwError(() => error);
      })
    );
  }

  // For auth endpoints or when no token, proceed without modification
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 && !isAuthEndpoint) {
        console.error('AuthInterceptor: 401 Unauthorized - clearing auth data');
        authService.clearAuthData();
      }
      return throwError(() => error);
    })
  );
};

