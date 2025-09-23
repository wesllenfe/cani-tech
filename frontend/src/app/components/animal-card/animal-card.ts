import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Animal } from '../../models/animal.model';
import { AgePipe } from '../../pipes/age.pipe';
import { StatusPipe } from '../../pipes/status.pipe';

@Component({
  selector: 'app-animal-card',
  standalone: true,
  imports: [CommonModule, AgePipe, StatusPipe],
  templateUrl: './animal-card.html',
  styleUrls: ['./animal-card.scss'],
})
export class AnimalCardComponent {
  @Input() animal!: Animal;
  fallback = 'assets/images/animal-fallback.jpg';

  private router = inject(Router);

  view() {
    this.router.navigate(['/animals', this.animal.id]);
  }

  handleAdoptionClick() {
    if (this.animal.status === 'available') {
      this.router.navigate(['/animals', this.animal.id], {
        fragment: 'adopt',
      });
    }
  }

  getAdoptionButtonText(): string {
    switch (this.animal.status) {
      case 'available':
        return 'Quero adotar';
      case 'adopted':
        return 'Já adotado';
      case 'under_treatment':
        return 'Em tratamento';
      case 'unavailable':
        return 'Indisponível';
      default:
        return 'Ver mais';
    }
  }

  contact() {
    this.handleAdoptionClick();
  }
}
