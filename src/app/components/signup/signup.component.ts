import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  getPasswordStrengthClass(): string {
  const password = this.signupForm.get('password')?.value;
  if (!password) return '';
  
  if (password.length < 6) return 'strength-weak';
  if (password.length < 8) return 'strength-medium';
  return 'strength-strong';
}
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      const { confirmPassword, ...userData } = this.signupForm.value;

      this.authService.signup(userData).subscribe({
        next: (response) => {
          this.loading = false;
          this.success = 'Registration successful! Please wait for admin approval.';
          this.signupForm.reset();
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || error.message || 'Registration failed. Please try again.';
        }
      });
    }
  }
}