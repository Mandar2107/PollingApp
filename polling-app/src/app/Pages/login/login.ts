import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService, LoginRequest, AuthResponse } from '../../Core/services/auth.service'; // adjust path
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all fields correctly.';
      return;
    }

    this.errorMessage = '';
    this.loading = true;



    //const loginData: LoginRequest = this.loginForm.value;
    const { email, password } = this.loginForm.value;
  //  console.log('Login Data:', loginData);
    this.authService.login(email,password).subscribe({
      next: () => {
       // this.loading = false;
          // Store JWT token
          // Redirect to dashboard or home
          this.router.navigate(['/welcome']);

      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}
