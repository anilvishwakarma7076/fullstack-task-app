import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { User, UserRole, DashboardStats, PaginatedResponse, ApprovalStatus } from '../../models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats = {};
  users: User[] = [];
  pendingFaculties: User[] = [];
  filteredUsers: User[] = [];
  currentFilter: UserRole | 'all' = 'all';
  loading = false;
  statsLoading = false;
  pendingFacultiesLoading = false;
  currentPage = 1;
  limit = 10;
  totalPages = 1;
  total = 0;
  
  editForm: FormGroup;
  editingUser: User | null = null;
  showEditForm = false;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      name: [''],
      department: [''],
      approvalStatus: ['']
    });
  }

  ngOnInit(): void {
    this.loadStats();
    this.loadPendingFaculties();
    this.loadUsers();
  }

  loadStats(): void {
    if (this.statsLoading) return; // Prevent duplicate calls
    this.statsLoading = true;
    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.statsLoading = false;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.statsLoading = false;
      }
    });
  }

  loadPendingFaculties(): void {
    if (this.pendingFacultiesLoading) return; // Prevent duplicate calls
    this.pendingFacultiesLoading = true;
    this.adminService.getPendingFaculties().subscribe({
      next: (faculties) => {
        this.pendingFaculties = faculties;
        this.pendingFacultiesLoading = false;
      },
      error: (error) => {
        console.error('Error loading pending faculties:', error);
        this.pendingFacultiesLoading = false;
      }
    });
  }

  loadUsers(role?: string, page: number = 1): void {
    if (this.loading) return; // Prevent duplicate calls
    this.loading = true;
    this.currentPage = page;
    this.adminService.getAllUsers(role, page, this.limit).subscribe({
      next: (response: PaginatedResponse<User>) => {
        this.users = response.data || response as any;
        this.total = response.total || this.users.length;
        this.totalPages = response.totalPages || Math.ceil(this.total / this.limit);
        // Update filtered users based on current filter
        this.updateFilteredUsers();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  private updateFilteredUsers(): void {
    if (this.currentFilter === 'all') {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(user => user.role === this.currentFilter);
    }
  }

  applyFilter(role: UserRole | 'all' | string): void {
    this.currentFilter = role === 'all' ? 'all' : (role as UserRole);
    // Only reload if we need to fetch different data
    if (role === 'all') {
      // For 'all', we can filter existing data or reload
      if (this.users.length > 0) {
        this.updateFilteredUsers();
      } else {
        this.loadUsers();
      }
    } else {
      // For specific role, fetch from API
      this.loadUsers(role as string);
    }
  }

  approveFaculty(facultyId: string): void {
    this.adminService.approveFaculty(facultyId).subscribe({
      next: (user) => {
        this.pendingFaculties = this.pendingFaculties.filter(f => f.id !== facultyId);
        // Reload users with current filter
        this.loadUsers(this.currentFilter === 'all' ? undefined : this.currentFilter as string, this.currentPage);
        this.loadStats();
      },
      error: (error) => {
        console.error('Error approving faculty:', error);
        alert('Error approving faculty. Please try again.');
      }
    });
  }

  rejectFaculty(facultyId: string): void {
    if (confirm('Are you sure you want to reject this faculty?')) {
      this.adminService.rejectFaculty(facultyId).subscribe({
        next: (user) => {
          this.pendingFaculties = this.pendingFaculties.filter(f => f.id !== facultyId);
        },
        error: (error) => {
          console.error('Error rejecting faculty:', error);
          alert('Error rejecting faculty. Please try again.');
        }
      });
    }
  }

  editUser(user: User): void {
    this.editingUser = user;
    this.showEditForm = true;
    this.editForm.patchValue({
      name: user.name,
      department: user.department || '',
      approvalStatus: user.approvalStatus || ApprovalStatus.PENDING
    });
  }

  updateUser(): void {
    if (this.editForm.valid && this.editingUser?.id) {
      const formData = this.editForm.value;
      // Include approvalStatus in the update
      const updateData: any = {
        name: formData.name,
        department: formData.department,
        approvalStatus: formData.approvalStatus
      };
      
      this.adminService.updateUser(this.editingUser.id, updateData).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
            this.updateFilteredUsers();
          }
          // If status changed to approved/rejected, update pending faculties list
          if (updatedUser.approvalStatus === ApprovalStatus.APPROVED || 
              updatedUser.approvalStatus === ApprovalStatus.REJECTED) {
            this.pendingFaculties = this.pendingFaculties.filter(f => f.id !== updatedUser.id);
            this.loadStats();
          }
          this.cancelEdit();
        },
        error: (error) => {
          console.error('Error updating user:', error);
          alert('Error updating user. Please try again.');
        }
      });
    }
  }

  quickApprove(user: User): void {
    if (user.id) {
      this.adminService.approveFaculty(user.id).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
            this.updateFilteredUsers();
          }
          this.pendingFaculties = this.pendingFaculties.filter(f => f.id !== user.id);
          this.loadStats();
        },
        error: (error) => {
          console.error('Error approving user:', error);
          alert('Error approving user. Please try again.');
        }
      });
    }
  }

  quickReject(user: User): void {
    if (confirm('Are you sure you want to reject this user?')) {
      if (user.id) {
        this.adminService.rejectFaculty(user.id).subscribe({
          next: (updatedUser) => {
            const index = this.users.findIndex(u => u.id === updatedUser.id);
            if (index !== -1) {
              this.users[index] = updatedUser;
              this.updateFilteredUsers();
            }
            this.pendingFaculties = this.pendingFaculties.filter(f => f.id !== user.id);
            this.loadStats();
          },
          error: (error) => {
            console.error('Error rejecting user:', error);
            alert('Error rejecting user. Please try again.');
          }
        });
      }
    }
  }

  cancelEdit(): void {
    this.showEditForm = false;
    this.editingUser = null;
    this.editForm.reset();
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== userId);
          this.updateFilteredUsers();
          this.loadStats();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('Error deleting user. Please try again.');
        }
      });
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

  onPageChange(page: number): void {
    this.loadUsers(this.currentFilter === 'all' ? undefined : this.currentFilter, page);
  }
}