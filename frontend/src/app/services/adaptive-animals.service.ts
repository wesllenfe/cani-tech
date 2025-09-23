import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardStatistics, AnimalsService } from './animals.service';
import { Animal, AnimalStatus } from '../models/animal.model';
import { MockAnimalsService } from './mock-animals.service';
import { USE_MOCK_DATA, getEnvironmentStatus } from '../config/environment.config';

@Injectable({ providedIn: 'root' })
export class AdaptiveAnimalsService {
  private realService = inject(AnimalsService);
  private mockService = inject(MockAnimalsService);

  private get service() {
    return USE_MOCK_DATA ? this.mockService : this.realService;
  }

  getPublicAnimals(params?: { q?: string; size?: string; status?: string; page?: number }): Observable<Animal[]> {
    return this.service.getPublicAnimals(params);
  }

  getAnimals(params?: { q?: string; page?: number }): Observable<Animal[]> {
    return this.service.getAnimals(params);
  }

  getAnimal(id: number): Observable<Animal> {
    return this.service.getAnimal(id);
  }

  createAnimal(payload: Omit<Animal, 'id' | 'created_at' | 'updated_at'>): Observable<Animal> {
    return this.service.createAnimal(payload);
  }

  updateAnimal(id: number, payload: Partial<Animal>): Observable<Animal> {
    return this.service.updateAnimal(id, payload);
  }

  updateStatus(id: number, status: AnimalStatus): Observable<Animal> {
    return this.service.updateStatus(id, status);
  }

  getStatistics(): Observable<DashboardStatistics> {
    return this.service.getStatistics();
  }

  deleteAnimal(id: number): Observable<any> {
    if (USE_MOCK_DATA && 'deleteAnimal' in this.mockService) {
      return this.mockService.deleteAnimal(id);
    }

    throw new Error('Método deleteAnimal não implementado no service real');
  }

  isMockMode(): boolean {
    return USE_MOCK_DATA;
  }

  getEnvironmentInfo(): { mode: string; totalAnimals: number } {
    return {
      mode: getEnvironmentStatus(),
      totalAnimals: USE_MOCK_DATA ? this.mockService.getTotalAnimals() : -1
    };
  }
}
