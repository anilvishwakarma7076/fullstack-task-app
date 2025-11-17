import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get token from auth service
    const token = this.authService.token;

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
      
      return next.handle(clonedRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.error('AuthInterceptor: 401 Unauthorized - clearing auth data');
            // Unauthorized - clear auth data and redirect to login
            this.authService.clearAuthData();
          }
          return throwError(() => error);
        })
      );
    }

    // For auth endpoints or when no token, proceed without modification
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !isAuthEndpoint) {
          console.error('AuthInterceptor: 401 Unauthorized - clearing auth data');
          this.authService.clearAuthData();
        }
        return throwError(() => error);
      })
    );
  }
}