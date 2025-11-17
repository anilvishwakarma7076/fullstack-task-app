import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;
    
    if (currentUser && this.authService.validateToken()) {
      const expectedRole = route.data['role'] as UserRole[];
      
      if (expectedRole && !expectedRole.includes(currentUser.role)) {
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}