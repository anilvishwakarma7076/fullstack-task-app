import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {
  constructor(private authService: AuthService) {}

  isAdmin(): boolean {
    const user = this.authService.currentUserValue;
    return user?.role === UserRole.ADMIN && this.authService.validateToken(user);
  }

  isFaculty(): boolean {
    const user = this.authService.currentUserValue;
    return user?.role === UserRole.FACULTY && this.authService.validateToken(user);
  }

  isStudent(): boolean {
    const user = this.authService.currentUserValue;
    return user?.role === UserRole.STUDENT && this.authService.validateToken(user);
  }
}