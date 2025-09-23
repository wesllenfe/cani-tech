import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdoptionRequest {
  id: number;
  animal_id: number;
  user_id: number;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  created_at: string;
  updated_at: string;
  animal: {
    id: number;
    name: string;
    photo_url?: string;
    breed?: string;
  };
}

export interface CreateAdoptionRequest {
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class AdoptionService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl || 'http://localhost:8000/api';

  private mockAdoptions: AdoptionRequest[] = [
    {
      id: 1,
      animal_id: 1,
      user_id: 1,
      status: 'pending',
      message: 'Estou muito interessado em adotar o Rex! Tenho experiência com cães e um quintal grande.',
      created_at: '2024-01-15T10:30:00.000000Z',
      updated_at: '2024-01-15T10:30:00.000000Z',
      animal: {
        id: 1,
        name: 'Rex',
        photo_url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
        breed: 'Vira-lata'
      }
    },
    {
      id: 2,
      animal_id: 3,
      user_id: 1,
      status: 'approved',
      message: 'Gostaria muito de dar uma nova família para a Luna.',
      created_at: '2024-01-10T14:20:00.000000Z',
      updated_at: '2024-01-12T09:15:00.000000Z',
      animal: {
        id: 3,
        name: 'Luna',
        photo_url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
        breed: 'Golden Retriever'
      }
    }
  ];

  adoptAnimal(animalId: number, request: CreateAdoptionRequest): Observable<AdoptionRequest> {
    if (environment.production === false) {
      const newAdoption: AdoptionRequest = {
        id: Date.now(),
        animal_id: animalId,
        user_id: 1,
        status: 'pending',
        message: request.message,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        animal: {
          id: animalId,
          name: 'Animal Mock',
          photo_url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400'
        }
      };

      this.mockAdoptions.unshift(newAdoption);
      return of(newAdoption);
    }

    return this.http.post<AdoptionRequest>(`${this.baseUrl}/animals/${animalId}/adopt`, request);
  }

  getMyAdoptions(): Observable<AdoptionRequest[]> {
    if (environment.production === false) {
      return of(this.mockAdoptions);
    }

    return this.http.get<AdoptionRequest[]>(`${this.baseUrl}/my-adoptions`);
  }

  getAdoptionRequest(id: number): Observable<AdoptionRequest> {
    if (environment.production === false) {
      const adoption = this.mockAdoptions.find(a => a.id === id);
      return of(adoption!);
    }

    return this.http.get<AdoptionRequest>(`${this.baseUrl}/adoptions/${id}`);
  }

  hasPendingRequest(animalId: number): Observable<boolean> {
    if (environment.production === false) {
      const hasPending = this.mockAdoptions.some(
        adoption => adoption.animal_id === animalId && adoption.status === 'pending'
      );
      return of(hasPending);
    }

    return this.http.get<boolean>(`${this.baseUrl}/animals/${animalId}/has-pending-adoption`);
  }

  getStatusText(status: AdoptionRequest['status']): string {
    const statusMap = {
      'pending': 'Aguardando aprovação',
      'approved': 'Aprovado',
      'rejected': 'Rejeitado'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: AdoptionRequest['status']): string {
    return `status-${status}`;
  }

  getStatusColor(status: AdoptionRequest['status']): string {
    const colorMap = {
      'pending': '#f59e0b',
      'approved': '#10b981',
      'rejected': '#ef4444'
    };
    return colorMap[status] || '#6b7280';
  }
}
