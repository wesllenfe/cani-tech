import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Animal } from '../../models/animal.model';
import { DashboardStatistics } from '../../services/animals.service';
import { HeaderComponent } from '../../components/header/header.component';
import { AdaptiveAnimalsService } from '../../services/adaptive-animals.service';
import { AnimalCardComponent } from '../../components/animal-card/animal-card';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, startWith, catchError, of, combineLatest } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, AnimalCardComponent, HeaderComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit {
  private svc = inject(AdaptiveAnimalsService);

  qCtrl = new FormControl('');
  statusCtrl = new FormControl('');

  animals: Animal[] = [];
  stats: DashboardStatistics | null = null;
  loading = false;
  error: string | null = null;

  environmentInfo = this.svc.getEnvironmentInfo();

  ngOnInit() {
    console.log(`🔧 Modo atual: ${this.environmentInfo.mode}`);

    this.loadStatistics();
    this.setupReactiveSearch();
    this.loadInitial();
  }

  private setupReactiveSearch() {
    combineLatest([
      this.qCtrl.valueChanges.pipe(startWith(this.qCtrl.value)),
      this.statusCtrl.valueChanges.pipe(startWith(this.statusCtrl.value))
    ]).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(([q, status]) =>
        this.fetchAnimals({
          q: String(q || '').trim(),
          status: status || undefined
        })
      ),
      catchError(err => {
        console.error('Erro ao filtrar animais:', err);
        this.error = 'Erro ao filtrar animais';
        return of([]);
      })
    ).subscribe(list => {
      this.animals = list;
      this.loading = false;
    });
  }

  private loadInitial() {
    this.loading = true;
    this.fetchAnimals({ q: '', status: undefined }).subscribe({
      next: (list) => {
        this.animals = list;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar animais:', err);
        this.error = 'Não foi possível carregar animais.';
        this.loading = false;
      }
    });
  }

  private fetchAnimals(filters?: { q?: string; status?: string; page?: number }) {
    return this.svc.getPublicAnimals(filters).pipe(
      catchError(err => {
        console.warn('Endpoint público falhou, tentando rota autenticada...');
        return this.svc.getAnimals(filters as any).pipe(
          catchError(fallbackErr => {
            console.error('Ambos endpoints falharam:', fallbackErr);
            return of([]);
          })
        );
      })
    );
  }

  private loadStatistics() {
    this.svc.getStatistics().subscribe({
      next: (s: DashboardStatistics) => {
        this.stats = s;
        console.log('📊 Estatísticas carregadas:', s);
      },
      error: (err: Error) => {
        console.warn('Não foi possível carregar estatísticas:', err);
      }
    });
  }

  forceReload() {
    this.loading = true;
    this.error = null;
    this.loadStatistics();
    this.loadInitial();
  }

  get isMockMode() {
    return this.svc.isMockMode();
  }
}
