import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) {}

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

      return next.handle(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
          // Se receber 401 (Unauthorized), significa que o token é inválido
          if (error.status === 401) {
            // Limpa os dados de autenticação
            localStorage.removeItem('ct_token');
            localStorage.removeItem('ct_user');
            // Redireciona para login se não estiver já lá
            if (!req.url.includes('/login') && this.router.url !== '/login') {
              this.router.navigate(['/login']);
            }
          }
          return throwError(() => error);
        })
      );
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
