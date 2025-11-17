import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User, AuthResponse, SignupRequest, LoginRequest } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private tokenKey = 'Token';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  signup(signupData: SignupRequest): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/signup`, signupData).pipe(
      tap((response: any) => {
        // Signup doesn't return token, user needs admin approval
      })
    );
  }

  signin(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, loginData).pipe(
      tap((response: any) => {
        // Handle different response formats
        const token = response.token || response.data?.token || response.accessToken;
        const user = response.user || response.data?.user;
        
        if (token) {
          localStorage.setItem(this.tokenKey, token);
          console.log('Token stored in localStorage with key:', this.tokenKey);
          console.log('Token value (first 20 chars):', token.substring(0, 20) + '...');
          
          if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            console.log('User stored:', user);
          }
        } else {
          console.error('No token received in signin response:', response);
        }
      })
    );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/auth/profile`).pipe(
      tap((user: User) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        this.clearAuthData();
      })
    );
  }

  clearAuthData(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = this.token;
    const user = this.currentUserValue;
    return !!(token && user);
  }

  validateToken(): boolean {
    return this.isAuthenticated();
  }
}