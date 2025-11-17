import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private http: HttpClient) {}

  addStudent(studentData: Partial<Student>): Observable<Student> {
    return this.http.post<Student>(`${environment.apiUrl}/students/`, studentData);
  }

  updateStudent(studentId: string, studentData: Partial<Student>): Observable<Student> {
    return this.http.patch<Student>(`${environment.apiUrl}/students/${studentId}`, studentData);
  }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${environment.apiUrl}/students/`);
  }

  getStudentById(studentId: string): Observable<Student> {
    return this.http.get<Student>(`${environment.apiUrl}/students/${studentId}`);
  }
}

