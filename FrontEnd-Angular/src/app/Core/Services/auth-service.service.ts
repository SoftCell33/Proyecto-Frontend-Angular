import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../Shared/interfaces/user.interface';
import { RegisterFormData } from '../../Shared/interfaces/auth.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private authState = new BehaviorSubject<boolean>(this.isLoggedIn());
  authState$ = this.authState.asObservable();
  
  constructor(
      private http: HttpClient,
      private router: Router
  ) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify({
            email: response.email,
            nombreCompleto: response.nombreCompleto
          }));
          this.authState.next(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authState.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && this.isTokenValid(token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private isTokenValid(token: string): boolean {
    const payload = this.parseJwt(token);
    if (!payload) return false;

    const expiration = payload?.exp;
    if (expiration && Date.now() >= expiration * 1000) {
      this.clearToken();
      return false;
    }
    return true;
  }

  private clearToken(): void {
    localStorage.removeItem('token');
    this.authState.next(false);
  }

  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  }

  register(formData: RegisterFormData): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, formData);
  }


  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }
}

