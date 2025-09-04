import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../Core/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [CommonModule, ReactiveFormsModule, ToastrModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Helper to access form controls easily
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    // Mark all fields as touched to show validation errors
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      this.toastr.warning('Please fix the errors in the form.', '⚠️');
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password)
      .pipe(finalize(() => this.loading = false)) // ensures loading stops safely
      .subscribe({
        next: (response: any) => {
          this.toastr.success('Login successful!', '✅');
          // Optionally store token: localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          this.errorMessage = err.error?.message || 'Login failed. Please try again.';
          this.toastr.error(this.errorMessage, '❌');
        }
      });
  }
}
