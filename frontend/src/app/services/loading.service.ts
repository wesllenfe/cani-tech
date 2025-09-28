import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _isLoading = signal(false);
  private _loadingMessage = signal('Carregando...');
  private _activeRequests = new Set<string>();

  // Sinais públicos (readonly)
  public readonly isLoading = this._isLoading.asReadonly();
  public readonly loadingMessage = this._loadingMessage.asReadonly();

  /**
   * Inicia loading com uma mensagem específica
   */
  startLoading(message: string = 'Carregando...', requestId?: string): void {
    if (requestId) {
      this._activeRequests.add(requestId);
    }

    this._loadingMessage.set(message);
    this._isLoading.set(true);
  }

  /**
   * Para loading específico ou geral
   */
  stopLoading(requestId?: string): void {
    if (requestId) {
      this._activeRequests.delete(requestId);

      // Se ainda há requests ativos, não para o loading
      if (this._activeRequests.size > 0) {
        return;
      }
    }

    this._isLoading.set(false);
    this._loadingMessage.set('Carregando...');
  }

  /**
   * Para todos os loadings
   */
  stopAllLoading(): void {
    this._activeRequests.clear();
    this._isLoading.set(false);
    this._loadingMessage.set('Carregando...');
  }

  /**
   * Executa uma função async com loading automático
   */
  async withLoading<T>(
    fn: () => Promise<T>,
    message: string = 'Carregando...',
    requestId?: string
  ): Promise<T> {
    try {
      this.startLoading(message, requestId);
      return await fn();
    } finally {
      this.stopLoading(requestId);
    }
  }
}
