
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Token } from '@angular/compiler';

export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest { fullName: string; userName: string; email: string; password: string; profilePictureUrl?: string; }
export interface AuthResponse { Success: boolean; Data?: { token: string }; Message: string; }

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:7219/api/Auth';
  private isBrowser: boolean;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.isAuthenticatedSubject.next(this.hasToken());
  }

// login(request: LoginRequest): Observable<AuthResponse> {
//     return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request).pipe(
//       tap(response => {
//         if (response.Success && response.Data?.token) {
//           this.setToken(response.Data.token);
//           this.isAuthenticatedSubject.next(true);
//         }
//       }),
//       catchError(this.handleError)
//     );
//   }
  login(email: string, password: string) {
    console.log('AuthService login called with', email, password);
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, { email, password }).pipe(
      tap(tokens => {this.storeTokens(tokens)
        console.log('Full login response:', tokens);
      })

    );

  }
 private storeTokens(tokens: any) {
  localStorage.setItem('accessToken', tokens.token || '');
  console.log('Token stored:', tokens.token);
}

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, request).pipe(
      catchError(this.handleError)
    );
  }
logout() {
  console.log('AuthService logout called');
  localStorage.removeItem('accessToken');
  // this.isAuthenticatedSubject.next(false);
}

  setToken(token: string) {
    if (this.isBrowser) {
      localStorage.setItem('accessToken', token);
    }
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('accessToken') : null;
  }

  isLoggedIn(): boolean {
    return this.isBrowser && !!this.getToken();
  }

  private hasToken(): boolean {
    return this.isBrowser && !!localStorage.getItem('accessToken');
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.status === 0) errorMessage = 'Cannot connect to server';
    else if (error.status === 401) errorMessage = 'Invalid email or password';
    else if (error.error?.Message) errorMessage = error.error.Message;
    else if (error.message) errorMessage = error.message;
    return throwError(() => new Error(errorMessage));
  }
}
