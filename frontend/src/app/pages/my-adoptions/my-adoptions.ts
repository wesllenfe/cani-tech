import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AdoptionService, AdoptionRequest, AdoptedAnimal } from '../../services/adoption.service';
import { HeaderComponent } from '../../components/header/header.component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-my-adoptions',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  template: `
    <div class="my-adoptions-page">
      <!-- Header -->
      <app-header></app-header>

      <div class="page-content">
        <div class="page-header">
          <div class="header-content">
            <div class="header-info">
              <h1 class="page-title">Meus Animais Adotados</h1>
              <p class="page-subtitle">Conheça os animais que você adotou</p>
            </div>
            <button class="btn btn-secondary" (click)="goToDashboard()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Voltar ao Dashboard
            </button>
          </div>
        </div>

      <!-- Estados de loading e erro -->
      <div *ngIf="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Carregando suas solicitações...</p>
      </div>

      <div *ngIf="error" class="error-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <h3>Erro ao carregar solicitações</h3>
        <p>{{ error }}</p>
        <button class="btn btn-primary" (click)="loadAdoptions()">Tentar novamente</button>
      </div>

      <!-- Lista de adoções -->
      <main *ngIf="!loading && !error" class="adoptions-content">
        <!-- Empty state -->
        <div *ngIf="adoptions.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <h3>Nenhum animal adotado ainda</h3>
          <p>Você ainda não adotou nenhum animal.</p>
          <button class="btn btn-primary" (click)="goToDashboard()">
            Ver animais disponíveis
          </button>
        </div>

        <!-- Lista de solicitações -->
        <div *ngIf="adoptions.length > 0" class="adoptions-list">
          <div class="list-header">
            <h2>{{ adoptions.length }} {{ adoptions.length === 1 ? 'animal adotado' : 'animais adotados' }}</h2>
            <div class="filters">
              <button
                class="filter-btn"
                [class.active]="statusFilter === 'all'"
                (click)="setStatusFilter('all')"
              >
                Todas
              </button>
              <button
                class="filter-btn"
                [class.active]="statusFilter === 'adopted'"
                (click)="setStatusFilter('adopted')"
              >
                Adotados
              </button>
            </div>
          </div>

          <div class="adoptions-grid">
            <article
              *ngFor="let adoption of filteredAdoptions"
              class="adoption-card"
              (click)="viewAnimal(adoption.id)"
            >
              <div class="card-header">
                <img
                  [src]="adoption.photo_url || '/assets/placeholder-animal.jpg'"
                  [alt]="adoption.name"
                  class="animal-photo"
                  (error)="$event.target.src='/assets/placeholder-animal.jpg'"
                >
                <div class="animal-info">
                  <h3 class="animal-name">{{ adoption.name }}</h3>
                  <p class="animal-breed" *ngIf="adoption.breed">{{ adoption.breed }}</p>
                  <div class="status-badge" [class]="getStatusClass(adoption.status)">
                    {{ getStatusText(adoption.status) }}
                  </div>
                </div>
              </div>

              <div class="card-content">
                <div class="request-info">
                  <div class="info-row">
                    <span class="label">Adotado em:</span>
                    <span class="value">{{ formatDate(adoption.adopted_at || adoption.created_at) }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Idade:</span>
                    <span class="value">{{ adoption.age_months }} meses</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Peso:</span>
                    <span class="value">{{ adoption.weight }}kg</span>
                  </div>
                </div>

                <div class="message" *ngIf="adoption.description">
                  <h4>Sobre {{ adoption.name }}:</h4>
                  <p>{{ adoption.description }}</p>
                </div>
              </div>

              <div class="card-actions">
                <button class="btn btn-secondary btn-sm" (click)="viewAnimal(adoption.id); $event.stopPropagation()">
                  Ver detalhes
                </button>
                <button
                  *ngIf="adoption.status === 'adopted'"
                  class="btn btn-primary btn-sm"
                  (click)="contactShelter(); $event.stopPropagation()"
                >
                  Entrar em contato
                </button>
              </div>
            </article>
          </div>
        </div>
      </main>
      </div>
    </div>
  `,
  styles: [`
    .my-adoptions-page {
      min-height: 100vh;
      background: #f8fafc;
      font-family: var(--font-sans);
    }

    .page-content {
      padding: clamp(16px, 4vw, 32px);
    }

    .page-header {
      max-width: 1200px;
      margin: 0 auto 32px auto;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;

      @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
    }

    .page-title {
      font-size: 2rem;
      font-weight: 800;
      color: #111827;
      margin: 0;
      line-height: 1.2;

      @media (max-width: 768px) {
        font-size: 1.75rem;
      }
    }

    .page-subtitle {
      color: #6b7280;
      margin: 8px 0 0 0;
      font-size: 1.1rem;
    }

    .loading-state, .error-state, .empty-state {
      max-width: 600px;
      margin: 64px auto;
      text-align: center;
      padding: 48px 24px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 24px 40px rgba(0, 0, 0, 0.08);
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e2e8f0;
      border-top: 3px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .empty-state svg {
      color: #d1d5db;
      margin-bottom: 24px;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 12px 0;
    }

    .empty-state p {
      color: #6b7280;
      margin: 0 0 24px 0;
      font-size: 1.1rem;
    }

    .adoptions-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .list-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      background: white;
      padding: 20px 24px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

      @media (max-width: 640px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      h2 {
        font-size: 1.25rem;
        font-weight: 700;
        color: #111827;
        margin: 0;
      }
    }

    .filters {
      display: flex;
      gap: 8px;
    }

    .filter-btn {
      padding: 8px 16px;
      border: 1px solid #d1d5db;
      background: white;
      color: #6b7280;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
      font-size: 0.9rem;

      &:hover {
        border-color: #3b82f6;
        color: #3b82f6;
      }

      &.active {
        background: #3b82f6;
        color: white;
        border-color: #3b82f6;
      }
    }

    .adoptions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    .adoption-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
      }
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px 20px 16px 20px;
    }

    .animal-photo {
      width: 60px;
      height: 60px;
      border-radius: 10px;
      object-fit: cover;
      flex-shrink: 0;
    }

    .animal-info {
      flex: 1;
    }

    .animal-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 4px 0;
    }

    .animal-breed {
      color: #6b7280;
      margin: 0 0 8px 0;
      font-size: 0.9rem;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;

      &.status-adopted {
        background: rgba(16, 185, 129, 0.1);
        color: #059669;
      }

      &.status-available {
        background: rgba(59, 130, 246, 0.1);
        color: #2563eb;
      }

      &.status-treatment {
        background: rgba(245, 158, 11, 0.1);
        color: #d97706;
      }

      &.status-unavailable {
        background: rgba(239, 68, 68, 0.1);
        color: #dc2626;
      }

      &.status-default {
        background: rgba(156, 163, 175, 0.1);
        color: #374151;
      }
    }

    .card-content {
      padding: 0 20px 16px 20px;
    }

    .request-info {
      margin-bottom: 16px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 0.9rem;

      .label {
        color: #6b7280;
        font-weight: 500;
      }

      .value {
        color: #111827;
        font-weight: 600;
      }
    }

    .message {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 12px;

      h4 {
        font-size: 0.9rem;
        font-weight: 600;
        color: #374151;
        margin: 0 0 6px 0;
      }

      p {
        color: #6b7280;
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.5;
        max-height: 3rem;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .card-actions {
      display: flex;
      gap: 8px;
      padding: 16px 20px 20px 20px;
      border-top: 1px solid #f3f4f6;
    }

    .btn {
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.9rem;
      border: none;
      flex: 1;
      justify-content: center;

      &.btn-sm {
        padding: 6px 12px;
        font-size: 0.85rem;
      }
    }

    .btn-primary {
      background: #3b82f6;
      color: white;

      &:hover {
        background: #2563eb;
      }
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;

      &:hover {
        background: #e5e7eb;
      }
    }

    @media (max-width: 640px) {
      .adoptions-grid {
        grid-template-columns: 1fr;
      }

      .card-header {
        padding: 16px;
      }

      .card-content {
        padding: 0 16px 12px 16px;
      }

      .card-actions {
        padding: 12px 16px 16px 16px;
      }
    }
  `]
})
export class MyAdoptionsComponent implements OnInit {
  private adoptionService = inject(AdoptionService);
  private router = inject(Router);

  adoptions: AdoptedAnimal[] = [];
  loading = true;
  error: string | null = null;
  statusFilter: 'all' | 'adopted' | 'available' = 'all';

  ngOnInit() {
    this.loadAdoptions();
  }

  get filteredAdoptions(): AdoptedAnimal[] {
    if (this.statusFilter === 'all') {
      return this.adoptions;
    }
    return this.adoptions.filter(adoption => adoption.status === this.statusFilter);
  }

  loadAdoptions() {
    this.loading = true;
    this.error = null;

    this.adoptionService.getMyAdoptedAnimals().pipe(
      catchError(err => {
        console.error('Erro ao carregar adoções:', err);
        this.error = 'Não foi possível carregar seus animais adotados.';
        this.loading = false;
        return of([]);
      })
    ).subscribe({
      next: (adoptions) => {
        this.adoptions = adoptions;
        this.loading = false;
      }
    });
  }

  setStatusFilter(status: typeof this.statusFilter) {
    this.statusFilter = status;
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  viewAnimal(animalId: number) {
    this.router.navigate(['/animals', animalId]);
  }

  contactShelter() {
    alert('Funcionalidade de contato será implementada em breve!');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusText(status: AdoptedAnimal['status']): string {
    const statusMap = {
      'adopted': 'Adotado',
      'available': 'Disponível',
      'under_treatment': 'Em tratamento',
      'unavailable': 'Indisponível'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: AdoptedAnimal['status']): string {
    const classMap = {
      'adopted': 'status-adopted',
      'available': 'status-available',
      'under_treatment': 'status-treatment',
      'unavailable': 'status-unavailable'
    };
    return classMap[status] || 'status-default';
  }
}
