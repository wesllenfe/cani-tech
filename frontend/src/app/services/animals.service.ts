import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Animal, AnimalStatus } from '../models/animal.model';

export interface DashboardStatistics {
  total_animals: number;
  available: number;
  adopted: number;
  under_treatment: number;
  unavailable: number;
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
    return this.http.get<Animal[]>(`${this.base}/animals/public`, { params: httpParams });
  }

  getAnimals(params?: { q?: string; page?: number }): Observable<Animal[]> {
    let httpParams = new HttpParams();
    if (params?.q) httpParams = httpParams.set('q', params.q);
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    return this.http.get<Animal[]>(`${this.base}/animals`, { params: httpParams });
  }

  getAvailableAnimals(): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.base}/animals/available`);
  }

  getAnimal(id: number): Observable<Animal> {
    return this.http.get<Animal>(`${this.base}/animals/${id}`);
  }

  createAnimal(payload: Omit<Animal, 'id' | 'created_at' | 'updated_at'>): Observable<Animal> {
    return this.http.post<Animal>(`${this.base}/animals`, payload);
  }

  updateAnimal(id: number, payload: Partial<Animal>): Observable<Animal> {
    return this.http.put<Animal>(`${this.base}/animals/${id}`, payload);
  }

  updateStatus(id: number, status: AnimalStatus): Observable<Animal> {
    return this.http.patch<Animal>(`${this.base}/animals/${id}/status`, { status });
  }

  deleteAnimal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/animals/${id}`);
  }

  getStatistics(): Observable<DashboardStatistics> {
    return this.http.get<DashboardStatistics>(`${this.base}/animals/dashboard/statistics`);
  }

  adoptAnimal(id: number): Observable<Animal> {
    return this.http.post<Animal>(`${this.base}/animals/${id}/adopt`, {});
  }

  getMyAdoptions(): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.base}/my-adoptions`);
  }
}
