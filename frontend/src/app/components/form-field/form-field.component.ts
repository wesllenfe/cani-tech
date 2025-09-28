import { Component, Input, inject, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR, AbstractControl } from '@angular/forms';
import { FormValidationService } from '../../services/form-validation.service';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true
    }
  ],
  template: `
    <div class="form-group">
      <label [for]="fieldId" class="form-label">
        {{ label }}
        @if (required) {
          <span class="text-danger">*</span>
        }
      </label>

      @if (type === 'textarea') {
        <textarea
          [id]="fieldId"
          [placeholder]="placeholder"
          [class]="getInputClasses()"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onTouched()"
          [rows]="rows"
        ></textarea>
      } @else if (type === 'select') {
        <select
          [id]="fieldId"
          [class]="getInputClasses()"
          [value]="value"
          (change)="onInput($event)"
          (blur)="onTouched()"
        >
          <option value="">{{ placeholder || 'Selecione...' }}</option>
          @for (option of options; track option.value) {
            <option [value]="option.value">{{ option.label }}</option>
          }
        </select>
      } @else {
        <input
          [id]="fieldId"
          [type]="type"
          [placeholder]="placeholder"
          [class]="getInputClasses()"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onTouched()"
        />
      }

      @if (shouldShowError()) {
        <div class="invalid-feedback">
          {{ getErrorMessage() }}
        </div>
      }
    </div>
  `,
  styles: [`
    .form-group {
      margin-bottom: 1rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 500;
    }

    .form-control {
      display: block;
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
      border: 2px solid #ddd;
      border-radius: 8px;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }

    .form-control:focus {
      outline: 0;
      border-color: #007bff;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    .form-control.is-invalid {
      border-color: #dc3545;
    }

    .form-control.is-invalid:focus {
      border-color: #dc3545;
      box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    }

    .invalid-feedback {
      display: block;
      width: 100%;
      margin-top: 0.25rem;
      font-size: 0.875rem;
      color: #dc3545;
    }

    .text-danger {
      color: #dc3545;
    }

    select.form-control {
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m1 6 7 7 7-7'/%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
      background-size: 16px 12px;
      padding-right: 2.5rem;
    }

    textarea.form-control {
      resize: vertical;
      min-height: 100px;
    }
  `]
})
export class FormFieldComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() required: boolean = false;
  @Input() formId: string = '';
  @Input() control: AbstractControl | null = null;
  @Input() fieldName: string = '';
  @Input() rows: number = 3;
  @Input() options: Array<{value: string, label: string}> = [];

  protected formValidationService = inject(FormValidationService);

  value: string = '';
  fieldId: string = '';

  private onChange = (value: string) => {};
  onTouched = () => {};

  ngOnInit() {
    this.fieldId = `field-${Math.random().toString(36).substr(2, 9)}`;
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInput(event: any): void {
    const value = event.target.value;
    this.value = value;
    this.onChange(value);
  }

  shouldShowError(): boolean {
    if (!this.control || !this.formId) return false;

    const showValidation = this.formValidationService.shouldShowErrors(this.formId);
    return showValidation && this.control.invalid && this.control.touched;
  }

  getErrorMessage(): string {
    return this.formValidationService.getFieldErrorMessage(this.control, this.fieldName);
  }

  getInputClasses(): string {
    let classes = 'form-control';

    if (this.shouldShowError()) {
      classes += ' is-invalid';
    }

    return classes;
  }
}
