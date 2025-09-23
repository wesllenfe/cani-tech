import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

export interface Category {
  id: number;
  name: string;
  description: string;
  type: 'expense' | 'donation';
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categorias.html',
  styleUrls: ['./categorias.scss'],
})
export class CategoriasComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private http = inject(HttpClient);

  categories: Category[] = [];
  loading = false;
  error: string | null = null;
  showForm = false;
  editingCategory: Category | null = null;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    type: ['expense', [Validators.required]],
  });

  typeOptions = [
    { value: 'expense', label: 'Despesa' },
    { value: 'donation', label: 'Doação' }
  ];

  ngOnInit() {
    this.loadCategories();
  }

  private loadCategories() {
    this.loading = true;
    this.http.get<{success: boolean, data: Category[]}>('/api/categories').pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
        this.error = 'Erro ao carregar categorias';
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.editingCategory = null;
    this.form.reset({ type: 'expense' });
  }

  editCategory(category: Category) {
    this.editingCategory = category;
    this.showForm = true;
    this.form.patchValue({
      name: category.name,
      description: category.description,
      type: category.type
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = this.form.value;

    const request = this.editingCategory
      ? this.http.put(`/api/categories/${this.editingCategory.id}`, formData)
      : this.http.post('/api/categories', formData);

    request.pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (response) => {
        this.loadCategories();
        this.toggleForm();
      },
      error: (err) => {
        console.error('Erro ao salvar categoria:', err);
        this.error = 'Erro ao salvar categoria';
      }
    });
  }

  deleteCategory(category: Category) {
    if (!confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) {
      return;
    }

    this.loading = true;
    this.http.delete(`/api/categories/${category.id}`).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: () => {
        this.loadCategories();
      },
      error: (err) => {
        console.error('Erro ao excluir categoria:', err);
        this.error = 'Erro ao excluir categoria';
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  showError(controlName: string, error: string) {
    const ctrl = this.form.get(controlName);
    return ctrl?.hasError(error) && (ctrl.touched || this.form.touched);
  }
}
