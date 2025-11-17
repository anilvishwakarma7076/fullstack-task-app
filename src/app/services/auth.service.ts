import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private tokenKey = 'currentToken';

  constructor() {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(identifier: string, password: string): Observable<User> {
    // Mock API call - replace with actual API
    return new Observable(observer => {
      setTimeout(() => {
        const users = this.getUsersFromStorage();
        const user = users.find(u => 
          (u.email === identifier || u.mobile === identifier) && 
          u.password === password && 
          (u.role === UserRole.ADMIN || u.isApproved)
        );

        if (user) {
          // Invalidate previous sessions
          this.invalidateOtherSessions(user.id);
          
          // Generate new token
          const token = this.generateToken();
          user.currentToken = token;
          user.lastLogin = new Date();
          
          this.updateUserInStorage(user);
          localStorage.setItem(this.tokenKey, token);
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          
          observer.next(user);
        } else {
          observer.error('Invalid credentials or account not approved');
        }
        observer.complete();
      }, 1000);
    });
  }

  signup(userData: Partial<User>): Observable<User> {
    return new Observable(observer => {
      setTimeout(() => {
        const users = this.getUsersFromStorage();
        const newUser: User = {
          id: this.generateId(),
          name: userData.name!,
          email: userData.email!,
          mobile: userData.mobile!,
          password: userData.password!,
          role: UserRole.FACULTY,
          isApproved: false,
          createdAt: new Date()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        observer.next(newUser);
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  private invalidateOtherSessions(userId: number): void {
    const users = this.getUsersFromStorage();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.currentToken = this.generateToken();
      this.updateUserInStorage(user);
    }
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private generateId(): number {
    return Math.floor(Math.random() * 1000000);
  }

  private getUsersFromStorage(): User[] {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }

  private updateUserInStorage(updatedUser: User): void {
    const users = this.getUsersFromStorage();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  }

  validateToken(user: User): boolean {
    const storedToken = localStorage.getItem(this.tokenKey);
    return storedToken === user.currentToken;
  }
}