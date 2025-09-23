import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  cpf: string;
  birth_date: string;
  role: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.scss'],
})
export class PerfilComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  loading = false;
  saving = false;
  apiError: string | null = null;
  successMessage: string | null = null;
  user: UserProfile | null = null;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    birth_date: ['', [Validators.required]],
  });

  ngOnInit() {
    this.loadUserProfile();
  }

  private loadUserProfile() {
    this.loading = true;
    this.auth.getProfile().pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (response: any) => {
        this.user = response.user;
        this.form.patchValue({
          name: this.user?.name,
          email: this.user?.email,
          cpf: this.user?.cpf,
          birth_date: this.user?.birth_date
        });
      },
      error: (err: any) => {
        console.error('Erro ao carregar perfil:', err);
        this.apiError = 'Erro ao carregar dados do perfil';
      }
    });
  }

  submit(): void {
    this.apiError = null;
    this.successMessage = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.user) return;

    this.saving = true;

    this.auth.updateUser(this.user.id, this.form.value).pipe(
      finalize(() => this.saving = false)
    ).subscribe({
      next: (response: any) => {
        this.successMessage = 'Perfil atualizado com sucesso!';
        this.user = response.user;
        localStorage.setItem('ct_user', JSON.stringify(response.user));
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err: any) => {
        console.error('Erro ao atualizar perfil:', err);
        if (err?.status === 422 && err?.error?.errors) {
          const first = Object.values(err.error.errors)[0];
          this.apiError = Array.isArray(first) ? first[0] : 'Erro de validação';
        } else {
          this.apiError = err?.error?.message ?? 'Erro ao atualizar perfil';
        }
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
