import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Student, User } from '../../models/user.model';

@Component({
  selector: 'app-faculty-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './faculty-dashboard.component.html',
  styleUrls: ['./faculty-dashboard.component.css']
})
export class FacultyDashboardComponent implements OnInit {
  currentUser: User | null = null;
  students: Student[] = [];
  loading = false;
  showAddForm = false;
  addingStudent = false;
  
  studentForm: FormGroup;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.studentForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      department: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.userService.getStudents().subscribe({
      next: (students) => {
        this.students = students;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.loading = false;
      }
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.studentForm.reset();
    }
  }

  addStudent(): void {
    if (this.studentForm.valid) {
      this.addingStudent = true;
      this.userService.addStudent(this.studentForm.value).subscribe({
        next: (student) => {
          this.students.push(student);
          this.addingStudent = false;
          this.showAddForm = false;
          this.studentForm.reset();
        },
        error: (error) => {
          console.error('Error adding student:', error);
          this.addingStudent = false;
        }
      });
    }
  }

  editStudent(student: Student): void {
    // Implement edit functionality
    console.log('Edit student:', student);
  }

  deleteStudent(studentId: number): void {
    if (confirm('Are you sure you want to delete this student?')) {
      // Implement delete logic
      console.log('Delete student:', studentId);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}