import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, LoginRequest, AuthResponse, RegisterRequest } from './auth.service';
import { MockAuthService } from './mock-auth.service';
import { USE_MOCK_DATA } from '../config/environment.config';

@Injectable({
  providedIn: 'root'
})
export class AdaptiveAuthService extends AuthService {
  constructor(
    http: HttpClient,
    router: Router,
    private realService: AuthService,
    private mockService: MockAuthService
  ) {
    super(http, router);
  }

  override login(credentials: LoginRequest): Observable<AuthResponse> {
    return USE_MOCK_DATA
      ? this.mockService.login(credentials)
      : this.realService.login(credentials);
  }

  override register(payload: RegisterRequest): Observable<AuthResponse> {
    return USE_MOCK_DATA
      ? this.mockService.register(payload)
      : this.realService.register(payload);
  }

  override getCurrentUser(): Observable<AuthResponse['user']> {
    return USE_MOCK_DATA
      ? this.mockService.getCurrentUser()
      : this.realService.getCurrentUser();
  }

  override logout(): Observable<{ message: string }> {
    return USE_MOCK_DATA
      ? this.mockService.logout()
      : this.realService.logout();
  }
}
