import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { DonationsService } from '../../services/donations.service';
import { CategoriesService } from '../../services/categories.service';
import { Donation } from '../../models/donation.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-doacoes-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './doacoes-admin.html',
  styleUrls: ['./doacoes-admin.scss'],
})
export class DoacoesAdminComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private http = inject(HttpClient);
  private donationsService = inject(DonationsService);
  private categoriesService = inject(CategoriesService);

  donations: Donation[] = [];
  categories: Category[] = [];
  loading = false;
  error: string | null = null;
  showForm = false;
  editingDonation: Donation | null = null;

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
    this.loadDonations();
  }

  private loadCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories.filter(cat => cat.type === 'donation');
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
      }
    });
  }

  private loadDonations() {
    this.loading = true;
    this.donationsService.getDonations().pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (donations) => {
        this.donations = donations;
      },
      error: (err) => {
        console.error('Erro ao carregar doações:', err);
        this.error = 'Erro ao carregar doações';
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.editingDonation = null;
    this.form.reset();
    const today = new Date().toISOString().split('T')[0];
    this.form.patchValue({ date: today });
  }

  editDonation(donation: Donation) {
    this.editingDonation = donation;
    this.showForm = true;
    this.form.patchValue({
      category_id: donation.category_id.toString(),
      title: donation.title,
      description: donation.description || '',
      amount: donation.amount.toString(),
      donor_name: donation.donor_name,
      donor_email: donation.donor_email || '',
      date: donation.date
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = this.form.value as any;

    const request = this.editingDonation
      ? this.donationsService.updateDonation(this.editingDonation.id, formData)
      : this.donationsService.createPublicDonation(formData);

    request.pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (response) => {
        this.loadDonations();
        this.toggleForm();
      },
      error: (err) => {
        console.error('Erro ao salvar doação:', err);
        this.error = 'Erro ao salvar doação';
      }
    });
  }

  deleteDonation(donation: Donation) {
    if (!confirm(`Tem certeza que deseja excluir a doação "${donation.title}"?`)) {
      return;
    }

    this.loading = true;
    this.donationsService.deleteDonation(donation.id).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: () => {
        this.loadDonations();
      },
      error: (err) => {
        console.error('Erro ao excluir doação:', err);
        this.error = 'Erro ao excluir doação';
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
