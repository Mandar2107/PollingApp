import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../Core/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})


export class DashboardComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    console.log('Dashboard logout called');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
