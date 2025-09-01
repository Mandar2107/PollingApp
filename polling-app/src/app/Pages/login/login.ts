
import { Component } from '@angular/core';
import { AuthService } from '../../../app/Core/services/auth.servvice.ts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private AuthService: AuthService, private router: Router) {}

  login() {
    this.AuthService.login({ email: this.email, password: this.password })
      .subscribe({
        next: (res: any) => {
          this.AuthService.setToken(res.token);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => this.errorMessage = err.error.message
      });
  }
}
