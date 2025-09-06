import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService, RegisterRequest } from '../../Core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService, ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ToastrModule]
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid && this.passwordsMatch()) {
      const registerData: RegisterRequest = {
        fullName: this.registerForm.value.fullName,
        userName: this.registerForm.value.userName,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        profilePictureUrl: ''
      };

      this.loading = true;
      this.errorMessage = '';

     this.authService.register(registerData).subscribe({
  next: (response: any) => {
    setTimeout(() => {
      this.loading = false;
      if (response) {
        this.toastr.success('Registration successful!', '✅');
        this.router.navigate(['/login']);
      }
    });
  },
  error: (err: any) => {
    setTimeout(() => {
      this.loading = false;
      this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
      this.toastr.error(this.errorMessage, '❌');
    });
  }
});

    } else {
      this.errorMessage = 'Please fix the errors in the form.';
      this.toastr.warning(this.errorMessage, '⚠️');
    }
  }

  passwordsMatch(): boolean {
    return this.registerForm.get('password')?.value === this.registerForm.get('confirmPassword')?.value;
  }
}
