import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Animal, AnimalStatus } from '../models/animal.model';

export interface DashboardStatistics {
  total_animals: number;
  available: number;
  adopted: number;
  under_treatment: number;
  unavailable: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class AnimalsService {
  private base = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getPublicAnimals(params?: { q?: string; size?: string; status?: string; page?: number }): Observable<Animal[]> {
    let httpParams = new HttpParams();
    if (params?.q) httpParams = httpParams.set('q', params.q);
    if (params?.size) httpParams = httpParams.set('size', params.size);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    return this.http.get<ApiResponse<Animal[]>>(`${this.base}/animals/public`, { params: httpParams })
      .pipe(map(response => response.data));
  }

  getAnimals(params?: { q?: string; page?: number }): Observable<Animal[]> {
    let httpParams = new HttpParams();
    if (params?.q) httpParams = httpParams.set('q', params.q);
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    return this.http.get<ApiResponse<Animal[]>>(`${this.base}/animals`, { params: httpParams })
      .pipe(map(response => response.data));
  }

  getAvailableAnimals(): Observable<Animal[]> {
    return this.http.get<ApiResponse<Animal[]>>(`${this.base}/animals/available`)
      .pipe(map(response => response.data));
  }

  getAnimal(id: number): Observable<Animal> {
    return this.http.get<ApiResponse<Animal>>(`${this.base}/animals/${id}`)
      .pipe(map(response => response.data));
  }

  createAnimal(payload: Omit<Animal, 'id' | 'created_at' | 'updated_at'>): Observable<Animal> {
    return this.http.post<ApiResponse<Animal>>(`${this.base}/animals`, payload)
      .pipe(map(response => response.data));
  }

  updateAnimal(id: number, payload: Partial<Animal>): Observable<Animal> {
    return this.http.put<ApiResponse<Animal>>(`${this.base}/animals/${id}`, payload)
      .pipe(map(response => response.data));
  }

  updateStatus(id: number, status: AnimalStatus): Observable<Animal> {
    return this.http.patch<ApiResponse<Animal>>(`${this.base}/animals/${id}/status`, { status })
      .pipe(map(response => response.data));
  }

  deleteAnimal(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/animals/${id}`)
      .pipe(map(response => response.data));
  }

  getStatistics(): Observable<DashboardStatistics> {
    return this.http.get<ApiResponse<DashboardStatistics>>(`${this.base}/animals/dashboard/statistics`)
      .pipe(map(response => response.data));
  }

  adoptAnimal(id: number): Observable<Animal> {
    return this.http.post<ApiResponse<Animal>>(`${this.base}/animals/${id}/adopt`, {})
      .pipe(map(response => response.data));
  }

  getMyAdoptions(): Observable<Animal[]> {
    return this.http.get<ApiResponse<Animal[]>>(`${this.base}/my-adoptions`)
      .pipe(map(response => response.data));
  }
}
