import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        // ✅ double-check with localStorage in case observable is stale
        const token = this.authService.getToken();

        if (!isAuthenticated && !token) {
          this.router.navigate(['/login']);
          return false;
        }

        return true;
      })
    );
  }
}
