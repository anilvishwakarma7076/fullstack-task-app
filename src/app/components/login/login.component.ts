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

      this.authService.login(
        this.loginForm.value.identifier,
        this.loginForm.value.password
      ).subscribe({
        next: (user) => {
          this.loading = false;
          if (user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else if (user.role === 'faculty') {
            this.router.navigate(['/faculty']);
          } else {
            this.router.navigate(['/student']);
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = error;
        }
      });
    }
  }
}