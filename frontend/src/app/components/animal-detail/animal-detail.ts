import { Component, OnInit, inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Animal } from '../../models/animal.model';
import { AdaptiveAnimalsService } from '../../services/adaptive-animals.service';
import { AdoptionModalComponent } from '../adoption-modal/adoption-modal.component';
import { AuthService } from '../../services/auth.service';
import { catchError, of } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-animal-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, AdoptionModalComponent],
  templateUrl: './animal-detail.html',
  styleUrls: ['./animal-detail.scss']
})
export class AnimalDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private elementRef = inject(ElementRef);
  private animalsService = inject(AdaptiveAnimalsService);
  private authService = inject(AuthService);

  animal: Animal | null = null;
  loading = true;
  error: string | null = null;

  showAdoptionModal = false;

  environmentInfo = this.animalsService.getEnvironmentInfo();

  ngOnInit() {
    console.log(`🔧 AnimalDetail usando: ${this.environmentInfo.mode}`);

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAnimal(+id);
    } else {
      this.error = 'ID do animal não encontrado';
      this.loading = false;
    }

    this.route.fragment.subscribe(fragment => {
      if (fragment === 'adopt' && this.animal) {
        setTimeout(() => this.scrollToAdopt(), 500);
      }
    });
  }

  private loadAnimal(id: number) {
    this.animalsService.getAnimal(id).pipe(
      catchError(err => {
        console.error('Erro ao carregar animal:', err);
        this.error = err.status === 404
          ? 'Animal não encontrado'
          : 'Não foi possível carregar os detalhes do animal';
        this.loading = false;
        return of(null);
      })
    ).subscribe({
      next: (animal) => {
        if (animal) {
          this.animal = animal;
        }
        this.loading = false;
      }
    });
  }

  goBack() {
    this.location.back();
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'available': 'Disponível',
      'adopted': 'Adotado',
      'under_treatment': 'Em tratamento',
      'unavailable': 'Indisponível'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getGenderText(gender: string): string {
    return gender === 'male' ? 'Macho' : 'Fêmea';
  }

  getSizeText(size: string): string {
    const sizeMap: { [key: string]: string } = {
      'small': 'Pequeno',
      'medium': 'Médio',
      'large': 'Grande',
      'extra_large': 'Extra Grande'
    };
    return sizeMap[size] || size;
  }

  getAgeText(ageMonths: number): string {
    if (ageMonths < 12) {
      return `${ageMonths} ${ageMonths === 1 ? 'mês' : 'meses'}`;
    }
    const years = Math.floor(ageMonths / 12);
    const months = ageMonths % 12;

    if (months === 0) {
      return `${years} ${years === 1 ? 'ano' : 'anos'}`;
    }
    return `${years} ${years === 1 ? 'ano' : 'anos'} e ${months} ${months === 1 ? 'mês' : 'meses'}`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  onAdoptClick() {
    if (!this.animal) return;

    if (this.animal.status !== 'available') {
      alert('Este animal não está disponível para adoção no momento.');
      return;
    }

    this.showAdoptionModal = true;
  }

  onEditClick() {
    this.router.navigate(['/editar-animal', this.animal?.id]);
  }

  onAdoptionModalClose() {
    this.showAdoptionModal = false;
  }

  onAdoptionSubmitted() {
    console.log('✅ Solicitação de adoção enviada com sucesso!');

    if (this.animal?.id) {
      this.loadAnimal(this.animal.id);
    }
  }

  private scrollToAdopt() {
    const adoptSection = this.elementRef.nativeElement.querySelector('.actions-section');
    if (adoptSection) {
      adoptSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      adoptSection.style.boxShadow = '0 0 20px rgba(59, 91, 255, 0.3)';
      setTimeout(() => {
        adoptSection.style.boxShadow = '';
      }, 2000);
    }
  }

  get isMockMode() {
    return this.animalsService.isMockMode();
  }

  get canEdit(): boolean {
    const user = this.authService.getUser();
    return user && (user.role === 'admin' || user.role === 'caregiver');
  }
}
