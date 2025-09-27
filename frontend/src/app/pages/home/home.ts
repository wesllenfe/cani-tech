import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdaptiveAnimalsService } from '../../services/adaptive-animals.service';
import { AdaptiveAuthService } from '../../services/adaptive-auth.service';
import { AnimalCardComponent } from '../../components/animal-card/animal-card';
import { HeaderComponent } from '../../components/header/header.component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, AnimalCardComponent, HeaderComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class HomeComponent implements OnInit {
  private svc = inject(AdaptiveAnimalsService);
  private authService = inject(AdaptiveAuthService);
  protected router = inject(Router);

  animals: any[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit() {
    this.loadAnimals();
  }

  private loadAnimals() {
    this.loading = true;
    this.svc.getPublicAnimals({}).pipe(
      catchError(err => {
        console.error('Erro ao carregar animais:', err);
        this.error = 'Erro ao carregar animais';
        return of([]);
      })
    ).subscribe({
      next: (animals) => {
        this.animals = animals;
        this.loading = false;
      }
    });
  }

  goToAnimals(): void {
    document.getElementById('animais')?.scrollIntoView({ behavior: 'smooth' });
  }

  goToDonation(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.router.navigate(['/doacao-publica']);
  }

  goToRegister(): void {
    this.router.navigate(['/criar-conta']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToProfile(): void {
    this.router.navigate(['/perfil']);
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
