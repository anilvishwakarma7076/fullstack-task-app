export interface User {
  id?: string;
  name: string;
  email: string;
  mobile: string;
  password?: string;
  role: UserRole;
  approvalStatus?: ApprovalStatus;
  department?: string;
  dob?: string;
  createdAt?: Date;
  lastLogin?: Date;
  currentToken?: string;
}

export interface Student {
  id?: string;
  name: string;
  email: string;
  mobile: string;
  dob: string;
  department: string;
  facultyId?: string;
  createdAt?: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  FACULTY = 'FACULTY',
  STUDENT = 'STUDENT'
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  totalStudents?: number;
  totalFaculties?: number;
  pendingFaculties?: number;
  totalUsers?: number;
}