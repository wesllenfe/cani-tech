import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  birth_date: string;
  role: 'admin' | 'caregiver' | 'adopter';
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  cpf: string;
  birth_date: string;
  password: string;
  password_confirmation: string;
  role: 'adopter';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  protected baseUrl = environment.apiUrl;

  constructor(protected http: HttpClient, protected router: Router) {}

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload).pipe(
      tap(response => {
        localStorage.setItem('ct_token', response.token);
        localStorage.setItem('ct_user', JSON.stringify(response.user));
      })
    );
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, payload).pipe(
      tap(response => {
        localStorage.setItem('ct_token', response.token);
        localStorage.setItem('ct_user', JSON.stringify(response.user));
      })
    );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<{ user: User }>(`${this.baseUrl}/profile`).pipe(
      map(response => response.user)
    );
  }

  logout(): Observable<{ message: string }> {
    const token = localStorage.getItem('ct_token');
    if (!token) {
      return throwError(() => new Error('Não há usuário logado'));
    }

    return this.http.post<{ message: string }>(`${this.baseUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('ct_token');
        localStorage.removeItem('ct_user');
        this.router.navigate(['/login']);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('ct_token');
  }

  getUser() {
    const u = localStorage.getItem('ct_user');
    try {
      return u ? JSON.parse(u) : null;
    } catch (error) {
      // Se os dados estão corrompidos, limpa tudo
      localStorage.removeItem('ct_user');
      localStorage.removeItem('ct_token');
      return null;
    }
  }

  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();

    // Verifica se tem token E dados válidos do usuário
    if (!token || !user) {
      // Se algo está faltando, limpa tudo
      localStorage.removeItem('ct_token');
      localStorage.removeItem('ct_user');
      return false;
    }

    return true;
  }

  getProfile() {
    return this.http.get<{user: any}>(`${this.baseUrl}/profile`);
  }

  updateUser(userId: number, userData: any) {
    return this.http.put<{user: any}>(`${this.baseUrl}/users/${userId}`, userData);
  }
}

