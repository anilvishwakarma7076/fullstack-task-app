import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, DashboardStats, PaginatedResponse } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${environment.apiUrl}/admin/dashboard/stats`);
  }

  getPendingFaculties(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/admin/faculties/pending`);
  }

  approveFaculty(facultyId: string): Observable<User> {
    return this.http.patch<User>(
      `${environment.apiUrl}/admin/faculties/${facultyId}/approve`,
      { approvalStatus: 'APPROVED' }
    );
  }

  rejectFaculty(facultyId: string): Observable<User> {
    return this.http.patch<User>(
      `${environment.apiUrl}/admin/faculties/${facultyId}/approve`,
      { approvalStatus: 'REJECTED' }
    );
  }

  getAllUsers(role?: string, page: number = 1, limit: number = 10): Observable<PaginatedResponse<User>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (role) {
      params = params.set('role', role);
    }

    return this.http.get<PaginatedResponse<User>>(`${environment.apiUrl}/admin/users`, { params });
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/admin/users/${userId}`);
  }

  updateUser(userId: string, userData: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${environment.apiUrl}/admin/users/${userId}`, userData);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/admin/users/${userId}`);
  }
}

