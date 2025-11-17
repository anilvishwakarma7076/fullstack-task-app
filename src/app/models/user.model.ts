export interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: UserRole;
  isApproved: boolean;
  createdAt: Date;
  lastLogin?: Date;
  currentToken?: string;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  mobile: string;
  dob: Date;
  department: string;
  facultyId: number;
  createdAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  FACULTY = 'faculty',
  STUDENT = 'student'
}