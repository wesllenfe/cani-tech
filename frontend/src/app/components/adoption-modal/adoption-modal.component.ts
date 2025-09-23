import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Animal } from '../../models/animal.model';
import { AdoptionService, CreateAdoptionRequest } from '../../services/adoption.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-adoption-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './adoption-modal.component.html',
  styleUrls: ['./adoption-modal.component.scss']
})
export class AdoptionModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() animal: Animal | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() adopted = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private adoptionService = inject(AdoptionService);

  adoptionForm!: FormGroup;
  submitting = false;
  submitted = false;
  submitError: string | null = null;

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.adoptionForm = this.fb.group({
      message: ['', [Validators.maxLength(1000)]]
    });
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  onSubmit() {
    if (this.adoptionForm.invalid || !this.animal) return;

    this.submitting = true;
    this.submitError = null;

    const request: CreateAdoptionRequest = {
      message: this.adoptionForm.value.message?.trim() || undefined
    };

    this.adoptionService.adoptAnimal(this.animal.id, request).pipe(
      catchError(err => {
        console.error('Erro ao enviar solicitação de adoção:', err);
        this.submitError = 'Não foi possível enviar sua solicitação. Tente novamente.';
        this.submitting = false;
        return of(null);
      })
    ).subscribe({
      next: (result) => {
        if (result) {
          this.submitting = false;
          this.submitted = true;
          this.adopted.emit();
        }
      }
    });
  }

  goToMyAdoptions() {
    this.close.emit();
  }

  closeModal() {
    this.close.emit();
    setTimeout(() => {
      this.submitted = false;
      this.submitError = null;
      this.adoptionForm.reset();
    }, 300);
  }
}
