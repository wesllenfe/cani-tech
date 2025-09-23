import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdaptiveAuthService } from '../../services/adaptive-auth.service';
import { LoginRequest, AuthResponse } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AdaptiveAuthService);

  loading = false;
  apiError: string | null = null;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    this.apiError = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: LoginRequest = {
      email: this.form.value.email ?? '',
      password: this.form.value.password ?? '',
    };
    this.loading = true;

    this.auth
      .login(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          if (err?.status === 422 && err?.error) {
            const first = err.error?.errors
              ? Object.values(err.error.errors)[0]
              : null;
            this.apiError = Array.isArray(first)
              ? first[0]
              : err.error?.message ?? 'Erro de validação';
          } else if (err?.status === 401) {
            this.apiError = err.error?.message ?? 'Credenciais inválidas';
          } else {
            this.apiError = 'Erro ao tentar realizar login. Tente novamente.';
          }
        },
      });
  }

  goToRegister() {
    this.router.navigate(['/criar-conta']);
  }
}
