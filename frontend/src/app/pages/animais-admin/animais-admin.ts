import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AdaptiveAnimalsService } from '../../services/adaptive-animals.service';
import { AnimalCardComponent } from '../../components/animal-card/animal-card';
import { HeaderComponent } from '../../components/header/header.component';
import { debounceTime, distinctUntilChanged, switchMap, startWith, catchError, of } from 'rxjs';

@Component({
  selector: 'app-animais-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AnimalCardComponent, HeaderComponent],
  templateUrl: './animais-admin.html',
  styleUrls: ['./animais-admin.scss'],
})
export class AnimaisAdminComponent implements OnInit {
  private svc = inject(AdaptiveAnimalsService);
  private router = inject(Router);

  qCtrl = new FormControl('');
  statusCtrl = new FormControl('');

  animals: any[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit() {
    this.setupReactiveSearch();
    this.loadAnimals();
  }

  private setupReactiveSearch() {
    this.qCtrl.valueChanges.pipe(
      startWith(this.qCtrl.value),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => this.fetchAnimals({ q: String(q || '').trim() })),
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

  private loadAnimals() {
    this.loading = true;
    this.fetchAnimals({}).subscribe({
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

  private fetchAnimals(filters?: { q?: string; status?: string }) {
    return this.svc.getAnimals(filters as any).pipe(
      catchError(err => {
        console.error('Erro ao buscar animais:', err);
        return of([]);
      })
    );
  }

  criarAnimal() {
    this.router.navigate(['/criar-animal']);
  }

  editarAnimal(animal: any) {
    this.router.navigate(['/editar-animal', animal.id]);
  }

  verDetalhes(animal: any) {
    this.router.navigate(['/animals', animal.id]);
  }

  onStatusChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const status = target?.value || '';
    this.statusCtrl.setValue(status);
    this.loadAnimals();
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  getAvailableCount(): number {
    return this.animals.filter(a => a.status === 'available').length;
  }

  getAdoptedCount(): number {
    return this.animals.filter(a => a.status === 'adopted').length;
  }
}
