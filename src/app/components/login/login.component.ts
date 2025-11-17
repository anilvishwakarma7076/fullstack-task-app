import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';

      const loginData = {
        identifier: this.loginForm.value.identifier,
        password: this.loginForm.value.password
      };

      this.authService.signin(loginData).subscribe({
        next: (response) => {
          // If user not in response, fetch profile
          let user = this.authService.currentUserValue;
          if (!user) {
            // Fetch profile to get user data
            this.authService.getProfile().subscribe({
              next: (profileUser) => {
                user = this.authService.currentUserValue;
                this.navigateByRole(user);
              },
              error: (profileError) => {
                this.loading = false;
                console.error('Error fetching profile:', profileError);
                this.error = 'Login successful but unable to fetch user profile';
              }
            });
          } else {
            this.navigateByRole(user);
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Login error:', error);
          const errorMessage = error.error?.message || error.error?.error || error.message;
          this.error = errorMessage || 'Invalid credentials or account not approved';
        }
      });
    }
  }

  private navigateByRole(user: any): void {
    this.loading = false;
    if (user) {
      if (user.role === 'ADMIN') {
        this.router.navigate(['/admin']);
      } else if (user.role === 'FACULTY') {
        this.router.navigate(['/faculty']);
      } else {
        this.router.navigate(['/student']);
      }
    } else {
      this.error = 'Login successful but user data not found';
    }
  }
}