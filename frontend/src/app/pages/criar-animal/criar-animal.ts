import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdaptiveAnimalsService } from '../../services/adaptive-animals.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-criar-animal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './criar-animal.html',
  styleUrls: ['./criar-animal.scss'],
})
export class CriarAnimalComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private svc = inject(AdaptiveAnimalsService);

  loading = false;
  apiError: string | null = null;
  isEditing = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    breed: [''],
    age_months: ['', [Validators.required, Validators.min(1), Validators.max(300)]],
    gender: ['', [Validators.required]],
    size: ['', [Validators.required]],
    color: ['', [Validators.required]],
    description: [''],
    status: ['available'],
    vaccinated: [false],
    neutered: [false],
    medical_notes: [''],
    photo_url: [''],
    weight: ['', [Validators.min(0.1), Validators.max(200)]],
    entry_date: ['', [Validators.required]],
  });

  genderOptions = [
    { value: 'male', label: 'Macho' },
    { value: 'female', label: 'Fêmea' }
  ];

  sizeOptions = [
    { value: 'small', label: 'Pequeno' },
    { value: 'medium', label: 'Médio' },
    { value: 'large', label: 'Grande' },
    { value: 'extra_large', label: 'Muito Grande' }
  ];

  statusOptions = [
    { value: 'available', label: 'Disponível' },
    { value: 'under_treatment', label: 'Em Tratamento' },
    { value: 'unavailable', label: 'Indisponível' }
  ];

  ngOnInit() {
    const today = new Date().toISOString().split('T')[0];
    this.form.patchValue({ entry_date: today });
    
    const route = inject(ActivatedRoute);
    const animalId = route.snapshot.paramMap.get('id');
    if (animalId) {
      this.isEditing = true;
      this.loadAnimalForEdit(+animalId);
    }
  }

  submit(): void {
    this.apiError = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const formData = this.form.value;
    const route = inject(ActivatedRoute);
    const animalId = route.snapshot.paramMap.get('id');
    
    const request = animalId 
      ? this.svc.updateAnimal(+animalId, formData as any)
      : this.svc.createAnimal(formData as any);
    
    request.pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (response) => {
        console.log(animalId ? 'Animal atualizado com sucesso:' : 'Animal criado com sucesso:', response);
        this.router.navigate(['/animais-admin']);
      },
      error: (err) => {
        console.error(animalId ? 'Erro ao atualizar animal:' : 'Erro ao criar animal:', err);
        if (err?.status === 422 && err?.error?.errors) {
          const first = Object.values(err.error.errors)[0];
          this.apiError = Array.isArray(first) ? first[0] : 'Erro de validação';
        } else {
          this.apiError = err?.error?.message ?? (animalId ? 'Erro ao atualizar animal' : 'Erro ao criar animal');
        }
      }
    });
  }

  goBack() {
    this.router.navigate(['/animais-admin']);
  }

  showError(controlName: string, error: string) {
    const ctrl = this.form.get(controlName);
    return ctrl?.hasError(error) && (ctrl.touched || this.form.touched);
  }

  private loadAnimalForEdit(id: number) {
    this.loading = true;
    this.svc.getAnimal(id).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (animal) => {
        this.form.patchValue({
          name: animal.name,
          breed: animal.breed,
          age_months: animal.age_months?.toString() || '',
          gender: animal.gender,
          size: animal.size,
          color: animal.color,
          description: animal.description,
          status: animal.status,
          vaccinated: animal.vaccinated,
          neutered: animal.neutered,
          medical_notes: animal.medical_notes,
          photo_url: animal.photo_url,
          weight: animal.weight?.toString() || '',
          entry_date: animal.entry_date
        });
      },
      error: (err) => {
        console.error('Erro ao carregar animal:', err);
        this.apiError = 'Erro ao carregar dados do animal';
      }
    });
  }
}
