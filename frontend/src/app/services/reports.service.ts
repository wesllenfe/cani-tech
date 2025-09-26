import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiErrorHandlerService } from './api-error-handler.service';

export interface FinancialReport {
  totalDonations: number;
  totalExpenses: number;
  balance: number;
  donationsCount: number;
  expensesCount: number;
  currentMonth: {
    donations: number;
    expenses: number;
    balance: number;
  };
  categoryBreakdown: {
    donations: Array<{ category: string; total: number; count: number }>;
    expenses: Array<{ category: string; total: number; count: number }>;
  };
}

export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(
    private http: HttpClient,
    private errorHandler: ApiErrorHandlerService
  ) {}

  /**
   * Gera relatório financeiro completo
   */
  getFinancialReport(filters?: DateRangeFilter): Observable<FinancialReport> {
    let params = new HttpParams();

    if (filters?.startDate) {
      params = params.set('start_date', filters.startDate);
    }
    if (filters?.endDate) {
      params = params.set('end_date', filters.endDate);
    }

    return this.errorHandler.wrapRequest(
      this.http.get<FinancialReport>(`${this.baseUrl}/reports/financial`, { params })
    );
  }

  /**
   * Gera relatório de animais por período
   */
  getAnimalsReport(filters?: DateRangeFilter): Observable<any> {
    let params = new HttpParams();

    if (filters?.startDate) {
      params = params.set('start_date', filters.startDate);
    }
    if (filters?.endDate) {
      params = params.set('end_date', filters.endDate);
    }

    return this.errorHandler.wrapRequest(
      this.http.get<any>(`${this.baseUrl}/reports/animals`, { params })
    );
  }

  /**
   * Exporta relatório em formato CSV
   */
  exportToCsv(reportType: 'financial' | 'animals', filters?: DateRangeFilter): Observable<Blob> {
    let params = new HttpParams();
    params = params.set('format', 'csv');

    if (filters?.startDate) {
      params = params.set('start_date', filters.startDate);
    }
    if (filters?.endDate) {
      params = params.set('end_date', filters.endDate);
    }

    return this.errorHandler.wrapRequest(
      this.http.get(`${this.baseUrl}/reports/${reportType}/export`, {
        params,
        responseType: 'blob'
      })
    );
  }
}
