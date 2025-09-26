import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();

    // Adiciona token Bearer para requisições à API (tanto localhost quanto URLs que começam com /api)
    if (token && (req.url.startsWith('http://localhost:8000/api') || req.url.startsWith('/api') || (environment.apiUrl && req.url.startsWith(environment.apiUrl)))) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      return next.handle(cloned);
    }

    // Para requisições sem token, adiciona headers básicos
    const cloned = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });

    return next.handle(cloned);
  }
}
