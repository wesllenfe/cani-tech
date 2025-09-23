import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { DashboardStatistics } from './animals.service';
import { Animal, AnimalStatus } from '../models/animal.model';
import { MOCK_ANIMALS, MOCK_STATS } from '../mocks/mock-animals';

@Injectable({ providedIn: 'root' })
export class MockAnimalsService {

  private simulateDelay<T>(data: T, delayMs = 500): Observable<T> {
    return of(data).pipe(delay(delayMs));
  }

  getPublicAnimals(params?: { q?: string; size?: string; status?: string; page?: number }): Observable<Animal[]> {
    let filtered = [...MOCK_ANIMALS];

    if (params?.q && params.q.trim()) {
      const query = params.q.toLowerCase();
      filtered = filtered.filter(animal =>
        animal.name.toLowerCase().includes(query) ||
        (animal.breed && animal.breed.toLowerCase().includes(query))
      );
    }

    if (params?.status) {
      filtered = filtered.filter(animal => animal.status === params.status);
    }

    if (params?.size) {
      filtered = filtered.filter(animal => animal.size === params.size);
    }

    return this.simulateDelay(filtered, 300);
  }

  getTotalAnimals(): number {
    return MOCK_ANIMALS.length;
}

  getAnimals(params?: { q?: string; page?: number }): Observable<Animal[]> {
    return this.getPublicAnimals(params);
  }

  getAnimal(id: number): Observable<Animal> {
    const animal = MOCK_ANIMALS.find(a => a.id === id);
    if (!animal) {
      return throwError(() => new Error('Animal não encontrado'));
    }
    return this.simulateDelay(animal);
  }

  createAnimal(payload: Omit<Animal, 'id' | 'created_at' | 'updated_at'>): Observable<Animal> {
    const newAnimal: Animal = {
      id: Math.max(...MOCK_ANIMALS.map(a => a.id)) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      name: payload.name,
      breed: payload.breed,
      age_months: payload.age_months,
      gender: payload.gender,
      size: payload.size,
      color: payload.color || 'Não informado',
      description: payload.description,
      status: payload.status || AnimalStatus.AVAILABLE,
      vaccinated: payload.vaccinated,
      neutered: payload.neutered,
      medical_notes: payload.medical_notes,
      photo_url: payload.photo_url,
      weight: payload.weight,
      entry_date: payload.entry_date || new Date().toISOString().split('T')[0]
    };

    MOCK_ANIMALS.push(newAnimal);
    return this.simulateDelay(newAnimal);
  }

  updateAnimal(id: number, payload: Partial<Animal>): Observable<Animal> {
    const index = MOCK_ANIMALS.findIndex(a => a.id === id);

    if (index === -1) {
      return throwError(() => ({ status: 404, message: 'Animal não encontrado' }));
    }

    const updatedAnimal = {
      ...MOCK_ANIMALS[index],
      ...payload,
      updated_at: new Date().toISOString()
    };

    MOCK_ANIMALS[index] = updatedAnimal;

    return this.simulateDelay(updatedAnimal, 600);
  }

  updateStatus(id: number, status: Animal['status']): Observable<any> {
    return this.updateAnimal(id, { status }).pipe(
      delay(400)
    );
  }

  getStatistics(): Observable<DashboardStatistics> {
    const stats: DashboardStatistics = {
      total_animals: MOCK_ANIMALS.length,
      available: MOCK_ANIMALS.filter(a => a.status === AnimalStatus.AVAILABLE).length,
      adopted: MOCK_ANIMALS.filter(a => a.status === AnimalStatus.ADOPTED).length,
      under_treatment: MOCK_ANIMALS.filter(a => a.status === AnimalStatus.UNDER_TREATMENT).length,
      unavailable: MOCK_ANIMALS.filter(a => a.status === AnimalStatus.UNAVAILABLE).length
    };

    return this.simulateDelay(stats, 200);
  }

  deleteAnimal(id: number): Observable<any> {
    const index = MOCK_ANIMALS.findIndex(a => a.id === id);

    if (index === -1) {
      return throwError(() => ({ status: 404, message: 'Animal não encontrado' }));
    }

    MOCK_ANIMALS.splice(index, 1);

    return this.simulateDelay(null, 500);
  }
}
