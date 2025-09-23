import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { AuthService, LoginRequest, AuthResponse, RegisterRequest, User } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MockAuthService extends AuthService {
  private mockUser: User = {
    id: 1,
    name: 'Admin Mock',
    email: 'admin@mock.com',
    cpf: '12345678901',
    birth_date: '1990-01-01',
    role: 'admin',
    email_verified_at: null,
    created_at: '2025-09-19T00:00:00.000000Z',
    updated_at: '2025-09-19T00:00:00.000000Z'
  };

  constructor(http: HttpClient, router: Router) {
    super(http, router);
  }

  override login(credentials: LoginRequest): Observable<AuthResponse> {
    if (credentials.email === 'admin@mock.com' && credentials.password === '123456') {
      const response: AuthResponse = {
        message: 'Login realizado com sucesso!',
        user: this.mockUser,
        token: 'mock-jwt-token'
      };
      return of(response).pipe(
        tap((res: AuthResponse) => {
          localStorage.setItem('ct_token', res.token);
          localStorage.setItem('ct_user', JSON.stringify(res.user));
        }),
        delay(500)
      );
    }

    return throwError(() => ({
      error: {
        message: 'Credenciais inválidas'
      }
    })).pipe(delay(500));
  }

  override register(payload: RegisterRequest): Observable<AuthResponse> {
    const response: AuthResponse = {
      message: 'Usuário criado com sucesso!',
      user: {
        ...this.mockUser,
        id: Math.floor(Math.random() * 1000) + 2,
        name: payload.name,
        email: payload.email,
        cpf: payload.cpf,
        birth_date: payload.birth_date,
        role: payload.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      token: 'mock-jwt-token'
    };
    return of(response).pipe(delay(500));
  }

  override getCurrentUser(): Observable<User> {
    return of(this.mockUser).pipe(delay(300));
  }

  override logout(): Observable<{ message: string }> {
    return of({ message: 'Logout realizado com sucesso!' }).pipe(delay(300));
  }
}
