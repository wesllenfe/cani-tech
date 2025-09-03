import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';

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
  styleUrls: ['./criar-conta.scss']
})
export class CriarContaComponent {
  private fb = inject(FormBuilder);
   private router = inject(Router)

  hidePassword = true;
  hideConfirm = true;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
      ]
    ],
    confirm: ['', [Validators.required]],
    terms: [false, [Validators.requiredTrue]]
  }, { validators: [passwordsMatchValidator()] });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, email } = this.form.value;
    console.log('Register:', this.form.value);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  showError(controlName: string, error: string) {
    const ctrl = this.form.get(controlName);
    return ctrl?.hasError(error) && (ctrl.touched || this.form.touched);
  }
}
