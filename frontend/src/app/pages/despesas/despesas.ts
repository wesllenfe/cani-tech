import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { ExpensesService } from '../../services/expenses.service';
import { CategoriesService } from '../../services/categories.service';
import { Expense } from '../../models/expense.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-despesas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './despesas.html',
  styleUrls: ['./despesas.scss'],
})
export class DespesasComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private http = inject(HttpClient);
  private expensesService = inject(ExpensesService);
  private categoriesService = inject(CategoriesService);

  expenses: Expense[] = [];
  categories: Category[] = [];
  loading = false;
  error: string | null = null;
  showForm = false;
  editingExpense: Expense | null = null;

  form = this.fb.group({
    category_id: ['', [Validators.required]],
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    amount: ['', [Validators.required, Validators.min(0.01)]],
    date: ['', [Validators.required]],
  });

  ngOnInit() {
    this.loadCategories();
    this.loadExpenses();
  }

  private loadCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories.filter(cat => cat.type === 'expense');
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
      }
    });
  }

  private loadExpenses() {
    this.loading = true;
    this.expensesService.getExpenses().pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (expenses) => {
        this.expenses = expenses;
      },
      error: (err) => {
        console.error('Erro ao carregar despesas:', err);
        this.error = 'Erro ao carregar despesas';
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.editingExpense = null;
    this.form.reset();
    const today = new Date().toISOString().split('T')[0];
    this.form.patchValue({ date: today });
  }

  editExpense(expense: Expense) {
    this.editingExpense = expense;
    this.showForm = true;
    this.form.patchValue({
      category_id: expense.category_id.toString(),
      title: expense.title,
      description: expense.description || '',
      amount: expense.amount.toString(),
      date: expense.date
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = this.form.value as any;

    const request = this.editingExpense
      ? this.expensesService.updateExpense(this.editingExpense.id, formData)
      : this.expensesService.createExpense(formData);

    request.pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (response) => {
        this.loadExpenses();
        this.toggleForm();
      },
      error: (err) => {
        console.error('Erro ao salvar despesa:', err);
        this.error = 'Erro ao salvar despesa';
      }
    });
  }

  deleteExpense(expense: Expense) {
    if (!confirm(`Tem certeza que deseja excluir a despesa "${expense.title}"?`)) {
      return;
    }

    this.loading = true;
    this.expensesService.deleteExpense(expense.id).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: () => {
        this.loadExpenses();
      },
      error: (err) => {
        console.error('Erro ao excluir despesa:', err);
        this.error = 'Erro ao excluir despesa';
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

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }
}
