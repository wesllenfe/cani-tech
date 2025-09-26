import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ApiErrorHandlerService {

  constructor() {}

  /**
   * Manipula erros de API de forma consistente
   */
  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro inesperado';

    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      switch (error.status) {
        case 401:
          errorMessage = 'Não autorizado. Faça login novamente.';
          // Remover tokens inválidos
          localStorage.removeItem('ct_token');
          localStorage.removeItem('ct_user');
          break;
        case 403:
          errorMessage = 'Você não tem permissão para esta operação.';
          break;
        case 404:
          errorMessage = 'Recurso não encontrado.';
          break;
        case 422:
          errorMessage = error.error?.message || 'Dados inválidos.';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          break;
        default:
          errorMessage = error.error?.message || `Erro ${error.status}: ${error.statusText}`;
      }
    }

    console.error('Erro da API:', error);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Wrapper para requisições que precisam de tratamento de erro consistente
   */
  wrapRequest<T>(request: Observable<T>): Observable<T> {
    return request.pipe(
      catchError(this.handleError.bind(this))
    );
  }
}
