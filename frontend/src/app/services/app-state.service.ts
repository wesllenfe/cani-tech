import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';

export interface ValidationError {
  field: string;
  message: string;
}

export interface LoadingState {
  [key: string]: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private loadingSubject = new BehaviorSubject<LoadingState>({});
  private errorSubject = new BehaviorSubject<string | null>(null);

  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor() {}

  /**
   * Define estado de loading para uma operação específica
   */
  setLoading(operation: string, loading: boolean): void {
    const currentState = this.loadingSubject.value;
    this.loadingSubject.next({
      ...currentState,
      [operation]: loading
    });
  }

  /**
   * Verifica se alguma operação está carregando
   */
  isLoading(operation?: string): boolean {
    const currentState = this.loadingSubject.value;
    if (operation) {
      return currentState[operation] || false;
    }
    return Object.values(currentState).some(loading => loading);
  }

  /**
   * Define mensagem de erro global
   */
  setError(error: string | null): void {
    this.errorSubject.next(error);
  }

  /**
   * Limpa erro global
   */
  clearError(): void {
    this.errorSubject.next(null);
  }

  /**
   * Wrapper para requisições HTTP com estado de loading e erro automático
   */
  wrapRequest<T>(
    request: Observable<T>,
    operation: string,
    showGlobalError: boolean = true
  ): Observable<T> {
    this.setLoading(operation, true);

    return request.pipe(
      tap(() => {
        if (showGlobalError) {
          this.clearError();
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (showGlobalError) {
          let errorMessage = 'Ocorreu um erro inesperado';

          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 0) {
            errorMessage = 'Erro de conexão. Verifique sua internet.';
          } else if (error.status >= 500) {
            errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          }

          this.setError(errorMessage);
        }
        return throwError(() => error);
      }),
      finalize(() => {
        this.setLoading(operation, false);
      })
    );
  }

  /**
   * Extrai erros de validação do Laravel
   */
  extractValidationErrors(error: HttpErrorResponse): ValidationError[] {
    if (error.status === 422 && error.error?.errors) {
      const errors: ValidationError[] = [];

      Object.keys(error.error.errors).forEach(field => {
        const messages = error.error.errors[field];
        if (Array.isArray(messages)) {
          messages.forEach(message => {
            errors.push({ field, message });
          });
        }
      });

      return errors;
    }

    return [];
  }
}