import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Expense } from '../models/expense.model';

interface ExpensesResponse {
  data: Expense[];
}

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getExpenses(): Observable<Expense[]> {
    return this.http.get<ExpensesResponse>(`${this.baseUrl}/expenses`).pipe(
      map(response => response.data)
    );
  }

  getExpense(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.baseUrl}/expenses/${id}`);
  }

  createExpense(expense: Omit<Expense, 'id' | 'created_at' | 'updated_at' | 'category' | 'user'>): Observable<Expense> {
    return this.http.post<Expense>(`${this.baseUrl}/expenses`, expense);
  }

  updateExpense(id: number, expense: Partial<Expense>): Observable<Expense> {
    return this.http.put<Expense>(`${this.baseUrl}/expenses/${id}`, expense);
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/expenses/${id}`);
  }
}
