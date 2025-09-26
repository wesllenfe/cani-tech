import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { NotificationService } from '../../services/notification.service';

export interface FinancialSummary {
  totalDonations: number;
  totalExpenses: number;
  balance: number;
  donationsCount: number;
  expensesCount: number;
  currentMonth: {
    donations: number;
    expenses: number;
    balance: number;
  };
}

export interface CategorySummary {
  category: string;
  type: 'donation' | 'expense';
  total: number;
  count: number;
}

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './relatorios.html',
  styleUrls: ['./relatorios.scss'],
})
export class RelatoriosComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);

  loading = false;
  error: string | null = null;

  financialSummary: FinancialSummary | null = null;
  categoryDonations: CategorySummary[] = [];
  categoryExpenses: CategorySummary[] = [];
  recentDonations: any[] = [];
  recentExpenses: any[] = [];
  currentYear = new Date().getFullYear();

  ngOnInit() {
    this.loadReports();
  }

  private loadReports() {
    this.loading = true;
    this.error = null;

    forkJoin({
      donations: this.http.get<{success: boolean, data: any[]}>('/api/donations'),
      expenses: this.http.get<{success: boolean, data: any[]}>('/api/expenses'),
      categories: this.http.get<{success: boolean, data: any[]}>('/api/categories')
    }).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (data) => {
        this.processFinancialData(data.donations.data, data.expenses.data, data.categories.data);
      },
      error: (err) => {
        console.error('Erro ao carregar relatórios:', err);
        this.error = 'Erro ao carregar dados dos relatórios';
      }
    });
  }

  private processFinancialData(donations: any[], expenses: any[], categories: any[]) {
    const totalDonations = donations.reduce((sum, d) => sum + parseFloat(d.amount), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyDonations = donations.filter(d => {
      const date = new Date(d.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).reduce((sum, d) => sum + parseFloat(d.amount), 0);

    const monthlyExpenses = expenses.filter(e => {
      const date = new Date(e.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).reduce((sum, e) => sum + parseFloat(e.amount), 0);

    this.financialSummary = {
      totalDonations,
      totalExpenses,
      balance: totalDonations - totalExpenses,
      donationsCount: donations.length,
      expensesCount: expenses.length,
      currentMonth: {
        donations: monthlyDonations,
        expenses: monthlyExpenses,
        balance: monthlyDonations - monthlyExpenses
      }
    };

    this.processCategoryData(donations, expenses, categories);

    this.recentDonations = donations
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    this.recentExpenses = expenses
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  }

  private processCategoryData(donations: any[], expenses: any[], categories: any[]) {
    const donationsByCategory = new Map<number, {total: number, count: number}>();
    const expensesByCategory = new Map<number, {total: number, count: number}>();

    donations.forEach(d => {
      const current = donationsByCategory.get(d.category_id) || {total: 0, count: 0};
      current.total += parseFloat(d.amount);
      current.count += 1;
      donationsByCategory.set(d.category_id, current);
    });

    expenses.forEach(e => {
      const current = expensesByCategory.get(e.category_id) || {total: 0, count: 0};
      current.total += parseFloat(e.amount);
      current.count += 1;
      expensesByCategory.set(e.category_id, current);
    });

    this.categoryDonations = Array.from(donationsByCategory.entries()).map(([categoryId, data]) => {
      const category = categories.find(c => c.id === categoryId);
      return {
        category: category?.name || 'Categoria desconhecida',
        type: 'donation' as const,
        total: data.total,
        count: data.count
      };
    }).sort((a, b) => b.total - a.total);

    this.categoryExpenses = Array.from(expensesByCategory.entries()).map(([categoryId, data]) => {
      const category = categories.find(c => c.id === categoryId);
      return {
        category: category?.name || 'Categoria desconhecida',
        type: 'expense' as const,
        total: data.total,
        count: data.count
      };
    }).sort((a, b) => b.total - a.total);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
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

  getBalanceClass(): string {
    if (!this.financialSummary) return '';
    return this.financialSummary.balance >= 0 ? 'positive' : 'negative';
  }

  getCurrentMonthName(): string {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[new Date().getMonth()];
  }
}
