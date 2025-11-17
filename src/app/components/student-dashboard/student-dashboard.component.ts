import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StudentService } from '../../services/student.service';
import { Student, User } from '../../models/user.model';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  currentUser: User | null = null;
  studentProfile: Student | null = null;
  loading = false;

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadStudentProfile();
  }

  loadStudentProfile(): void {
    this.loading = true;
    this.studentService.getStudents().subscribe({
      next: (students) => {
        // Find student profile by matching email
        this.studentProfile = students.find(s => s.email === this.currentUser?.email) || null;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading student profile:', error);
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.authService.clearAuthData();
      }
    });
  }
}