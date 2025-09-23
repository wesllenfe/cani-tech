import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

export interface Category {
  id: number;
  name: string;
  type: 'expense' | 'donation';
}

@Component({
  selector: 'app-doacao-publica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './doacao-publica.html',
  styleUrls: ['./doacao-publica.scss'],
})
export class DoacaoPublicaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private http = inject(HttpClient);

  categories: Category[] = [];
  loading = false;
  submitting = false;
  apiError: string | null = null;
  successMessage: string | null = null;

  form = this.fb.group({
    category_id: ['', [Validators.required]],
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    amount: ['', [Validators.required, Validators.min(0.01)]],
    donor_name: ['', [Validators.required, Validators.minLength(3)]],
    donor_email: ['', [Validators.email]],
    date: ['', [Validators.required]],
  });

  ngOnInit() {
    this.loadCategories();
    const today = new Date().toISOString().split('T')[0];
    this.form.patchValue({ date: today });
  }

  private loadCategories() {
    this.loading = true;
    this.http.get<{success: boolean, data: Category[]}>('/api/categories').pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (response) => {
        this.categories = response.data.filter(cat => cat.type === 'donation');
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
        this.apiError = 'Erro ao carregar categorias';
      }
    });
  }

  submit() {
    this.apiError = null;
    this.successMessage = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    this.http.post('/api/donations', this.form.value).pipe(
      finalize(() => this.submitting = false)
    ).subscribe({
      next: (response) => {
        this.successMessage = 'Doação registrada com sucesso! Obrigado pela sua contribuição.';
        this.form.reset();
        const today = new Date().toISOString().split('T')[0];
        this.form.patchValue({ date: today });
        setTimeout(() => this.successMessage = null, 5000);
      },
      error: (err) => {
        console.error('Erro ao registrar doação:', err);
        if (err?.status === 422 && err?.error?.errors) {
          const first = Object.values(err.error.errors)[0];
          this.apiError = Array.isArray(first) ? first[0] : 'Erro de validação';
        } else {
          this.apiError = err?.error?.message ?? 'Erro ao registrar doação';
        }
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/criar-conta']);
  }

  showError(controlName: string, error: string) {
    const ctrl = this.form.get(controlName);
    return ctrl?.hasError(error) && (ctrl.touched || this.form.touched);
  }
}
