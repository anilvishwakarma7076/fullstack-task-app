import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { StudentService } from '../../services/student.service';
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
  editingStudent: Student | null = null;
  showEditForm = false;
  
  studentForm: FormGroup;
  editForm: FormGroup;

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
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

    this.editForm = this.fb.group({
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
    this.studentService.getStudents().subscribe({
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
      this.studentService.addStudent(this.studentForm.value).subscribe({
        next: (student) => {
          this.students.push(student);
          this.addingStudent = false;
          this.showAddForm = false;
          this.studentForm.reset();
        },
        error: (error) => {
          console.error('Error adding student:', error);
          this.addingStudent = false;
          alert('Error adding student. Please try again.');
        }
      });
    }
  }

  editStudent(student: Student): void {
    this.editingStudent = student;
    this.showEditForm = true;
    this.editForm.patchValue({
      name: student.name,
      email: student.email,
      mobile: student.mobile,
      dob: student.dob,
      department: student.department
    });
  }

  updateStudent(): void {
    if (this.editForm.valid && this.editingStudent?.id) {
      this.studentService.updateStudent(this.editingStudent.id, this.editForm.value).subscribe({
        next: (updatedStudent) => {
          const index = this.students.findIndex(s => s.id === updatedStudent.id);
          if (index !== -1) {
            this.students[index] = updatedStudent;
          }
          this.cancelEdit();
        },
        error: (error) => {
          console.error('Error updating student:', error);
          alert('Error updating student. Please try again.');
        }
      });
    }
  }

  cancelEdit(): void {
    this.showEditForm = false;
    this.editingStudent = null;
    this.editForm.reset();
  }

  deleteStudent(studentId: string): void {
    if (confirm('Are you sure you want to delete this student?')) {
      // Note: Delete endpoint might not be available in the API
      // If available, add it to StudentService
      alert('Delete functionality may require backend implementation');
    }
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