import { Injectable, signal } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {
  private _showValidationErrors = signal<{ [formId: string]: boolean }>({});

  public readonly showValidationErrors = this._showValidationErrors.asReadonly();

  /**
   * Ativa a exibição de erros para um formulário específico
   */
  showErrorsForForm(formId: string): void {
    const current = this._showValidationErrors();
    this._showValidationErrors.set({
      ...current,
      [formId]: true
    });
  }

  /**
   * Desativa a exibição de erros para um formulário específico
   */
  hideErrorsForForm(formId: string): void {
    const current = this._showValidationErrors();
    const updated = { ...current };
    delete updated[formId];
    this._showValidationErrors.set(updated);
  }

  /**
   * Verifica se deve mostrar erros para um formulário específico
   */
  shouldShowErrors(formId: string): boolean {
    return this._showValidationErrors()[formId] || false;
  }

  /**
   * Valida um formulário e marca para mostrar erros se inválido
   */
  validateForm(form: FormGroup, formId: string): boolean {
    if (form.valid) {
      this.hideErrorsForForm(formId);
      return true;
    } else {
      this.showErrorsForForm(formId);
      this.markAllFieldsAsTouched(form);
      return false;
    }
  }

  /**
   * Marca todos os campos do formulário como tocados
   */
  private markAllFieldsAsTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control) {
        control.markAsTouched();

        // Se for um FormGroup aninhado, aplicar recursivamente
        if (control instanceof FormGroup) {
          this.markAllFieldsAsTouched(control);
        }
      }
    });
  }

  /**
   * Obtém a mensagem de erro para um campo específico
   */
  getFieldErrorMessage(control: AbstractControl | null, fieldName: string): string {
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;

    if (errors['required']) {
      return `${fieldName} é obrigatório`;
    }

    if (errors['email']) {
      return 'Email deve ter um formato válido';
    }

    if (errors['minlength']) {
      return `${fieldName} deve ter pelo menos ${errors['minlength'].requiredLength} caracteres`;
    }

    if (errors['maxlength']) {
      return `${fieldName} deve ter no máximo ${errors['maxlength'].requiredLength} caracteres`;
    }

    if (errors['pattern']) {
      if (fieldName.toLowerCase().includes('telefone') || fieldName.toLowerCase().includes('celular')) {
        return 'Telefone deve ter um formato válido';
      }
      return `${fieldName} tem formato inválido`;
    }

    if (errors['min']) {
      return `${fieldName} deve ser maior que ${errors['min'].min}`;
    }

    if (errors['max']) {
      return `${fieldName} deve ser menor que ${errors['max'].max}`;
    }

    // Erro genérico
    return `${fieldName} é inválido`;
  }

  /**
   * Limpa todos os estados de validação
   */
  clearAllValidations(): void {
    this._showValidationErrors.set({});
  }
}
