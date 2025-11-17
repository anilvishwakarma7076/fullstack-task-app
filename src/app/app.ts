import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User, UserRole } from './models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  title = 'University Management System';
  currentUser: User | null = null;

  ngOnInit(): void {
    this.initializeSampleData();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  }

  private initializeSampleData(): void {
    // Initialize admin user
    if (!localStorage.getItem('users')) {
      const adminUser: User = {
        id: 1,
        name: 'Admin User',
        email: 'admin@university.com',
        mobile: '1234567890',
        password: 'admin123',
        role: UserRole.ADMIN,
        isApproved: true,
        createdAt: new Date()
      };

      localStorage.setItem('users', JSON.stringify([adminUser]));
    }

    if (!localStorage.getItem('students')) {
      localStorage.setItem('students', JSON.stringify([]));
    }
  }
}