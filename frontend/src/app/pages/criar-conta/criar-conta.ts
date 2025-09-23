import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirm = control.get('confirm')?.value;
    if (!password || !confirm) return null;
    return password === confirm ? null : { passwordMismatch: true };
  };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './criar-conta.html',
  styleUrls: ['./criar-conta.scss'],
})
export class CriarContaComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  hidePassword = true;
  hideConfirm = true;
  apiError: string | null = null;
  loading = false;

  form = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      birth_date: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/),
        ],
      ],
      confirm: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]],
    },
    { validators: [passwordsMatchValidator()] }
  );

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.apiError = null;

    const { name, email, cpf, birth_date, password, confirm } = this.form.value;

    this.authService
      .register({
        name: name || '',
        email: email || '',
        cpf: cpf || '',
        birth_date: birth_date || '',
        password: password || '',
        password_confirmation: confirm || '',
        role: 'adopter'
      })
      .subscribe({
        next: (res) => {
          console.log('Conta criada com sucesso', res);
          localStorage.setItem('ct_token', res.token);
          localStorage.setItem('ct_user', JSON.stringify(res.user));
          this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          if (err.status === 422 && err.error?.errors) {
            this.apiError = Object.values(err.error.errors).flat().join(' ');
          } else {
            this.apiError = err.error?.message || 'Erro ao criar conta.';
          }
          this.loading = false;
        },
        complete: () => (this.loading = false),
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  showError(controlName: string, error: string) {
    const ctrl = this.form.get(controlName);
    return ctrl?.hasError(error) && (ctrl.touched || this.form.touched);
  }
}
