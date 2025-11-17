import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  title = 'School Management System';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Check if user is authenticated and validate token
    if (this.authService.isAuthenticated()) {
      // Optionally refresh profile
      this.authService.getProfile().subscribe({
        error: () => {
          // If profile fetch fails, clear auth data
          this.authService.clearAuthData();
        }
      });
    }
  }
}