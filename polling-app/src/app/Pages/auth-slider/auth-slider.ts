import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService, RegisterRequest } from '../../Core/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService, ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-auth-slider',
  standalone: true,
  templateUrl: './auth-slider.html',
  styleUrls: ['./auth-slider.scss'],
  imports: [CommonModule, ReactiveFormsModule, ToastrModule]
})
export class AuthSliderComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  errorMessage: string = '';
  loading = false;
  isSignUpActive = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    // Login form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Register form
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  toggleForm(signUp: boolean) {
    this.isSignUpActive = signUp;
    this.errorMessage = '';
  }

  login() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      this.toastr.warning('Please fix the errors in the form.', '⚠️');
      return;
    }

    const { email, password } = this.loginForm.value;
    this.loading = true;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success('Login successful!', '✅');
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Login failed.';
        this.toastr.error(this.errorMessage, '❌');
      }
    });
  }

  register() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid || !this.passwordsMatch()) {
      this.errorMessage = 'Please fix the errors in the form.';
      this.toastr.warning(this.errorMessage, '⚠️');
      return;
    }

    const registerData: RegisterRequest = {
      fullName: this.registerForm.value.fullName,
      userName: this.registerForm.value.userName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      profilePictureUrl: ''
    };

    this.loading = true;
    this.authService.register(registerData).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success('Registration successful!', '✅');
        this.toggleForm(false);
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Registration failed.';
        this.toastr.error(this.errorMessage, '❌');
      }
    });
  }

  passwordsMatch(): boolean {
    return this.registerForm.get('password')?.value === this.registerForm.get('confirmPassword')?.value;
  }
}
