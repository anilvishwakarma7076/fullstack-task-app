import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, Student, UserRole } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private authService: AuthService) {}

  getUsers(role?: UserRole): Observable<User[]> {
    return new Observable(observer => {
      setTimeout(() => {
        let users = this.getUsersFromStorage();
        
        if (role) {
          users = users.filter(user => user.role === role);
        }

        // Filter based on current user role
        const currentUser = this.authService.currentUserValue;
        if (currentUser?.role === UserRole.FACULTY) {
          // Faculty can only see students they added
          // This would require additional logic based on your relationship structure
        }

        observer.next(users);
        observer.complete();
      }, 500);
    });
  }

  approveUser(userId: number): Observable<User> {
    return new Observable(observer => {
      setTimeout(() => {
        const users = this.getUsersFromStorage();
        const user = users.find(u => u.id === userId);
        
        if (user) {
          user.isApproved = true;
          this.updateUserInStorage(user);
          observer.next(user);
        } else {
          observer.error('User not found');
        }
        observer.complete();
      }, 500);
    });
  }

  addStudent(studentData: Partial<Student>): Observable<Student> {
    return new Observable(observer => {
      setTimeout(() => {
        const currentUser = this.authService.currentUserValue;
        const students = this.getStudentsFromStorage();
        
        const newStudent: Student = {
          id: this.generateId(),
          name: studentData.name!,
          email: studentData.email!,
          mobile: studentData.mobile!,
          dob: new Date(studentData.dob!),
          department: studentData.department!,
          facultyId: currentUser?.id!,
          createdAt: new Date()
        };

        students.push(newStudent);
        localStorage.setItem('students', JSON.stringify(students));
        observer.next(newStudent);
        observer.complete();
      }, 500);
    });
  }

  getStudents(facultyId?: number): Observable<Student[]> {
    return new Observable(observer => {
      setTimeout(() => {
        let students = this.getStudentsFromStorage();
        const currentUser = this.authService.currentUserValue;

        if (currentUser?.role === UserRole.FACULTY) {
          students = students.filter(s => s.facultyId === currentUser.id);
        } else if (currentUser?.role === UserRole.STUDENT) {
          students = students.filter(s => s.email === currentUser.email);
        }

        if (facultyId) {
          students = students.filter(s => s.facultyId === facultyId);
        }

        observer.next(students);
        observer.complete();
      }, 500);
    });
  }

  private getUsersFromStorage(): User[] {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }

  private getStudentsFromStorage(): Student[] {
    return JSON.parse(localStorage.getItem('students') || '[]');
  }

  private updateUserInStorage(updatedUser: User): void {
    const users = this.getUsersFromStorage();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  }

  private generateId(): number {
    return Math.floor(Math.random() * 1000000);
  }
}