import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterRequest } from '../../services/auth.service';
import { FormValidationService } from '../../services/form-validation.service';
import { FormFieldComponent } from '../../components/form-field/form-field.component';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-criar-conta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  template: `
    <div class="create-account-container">
      <div class="create-account-card">
        <h2 class="text-center mb-4">Criar Conta</h2>
        
        <!-- Botão de teste temporário -->
        <div class="mb-3 text-center">
          <button 
            type="button" 
            class="btn btn-outline-info btn-sm"
            (click)="testNotifications()"
          >
            🧪 Testar Notificações
          </button>
        </div>

        <form [formGroup]="createAccountForm" (ngSubmit)="onSubmit()">
          <app-form-field
            label="Nome completo"
            placeholder="Digite seu nome completo"
            formId="create-account"
            [control]="createAccountForm.get('name')"
            fieldName="Nome"
            [required]="true"
            formControlName="name">
          </app-form-field>

          <app-form-field
            label="Email"
            type="email"
            placeholder="Digite seu email"
            formId="create-account"
            [control]="createAccountForm.get('email')"
            fieldName="Email"
            [required]="true"
            formControlName="email">
          </app-form-field>

          <app-form-field
            label="CPF"
            placeholder="000.000.000-00"
            formId="create-account"
            [control]="createAccountForm.get('cpf')"
            fieldName="CPF"
            [required]="true"
            formControlName="cpf">
          </app-form-field>

          <app-form-field
            label="Data de nascimento"
            type="date"
            formId="create-account"
            [control]="createAccountForm.get('birth_date')"
            fieldName="Data de nascimento"
            [required]="true"
            formControlName="birth_date">
          </app-form-field>

          <app-form-field
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            formId="create-account"
            [control]="createAccountForm.get('password')"
            fieldName="Senha"
            [required]="true"
            formControlName="password">
          </app-form-field>

          <app-form-field
            label="Confirmar senha"
            type="password"
            placeholder="Confirme sua senha"
            formId="create-account"
            [control]="createAccountForm.get('password_confirmation')"
            fieldName="Confirmação de senha"
            [required]="true"
            formControlName="password_confirmation">
          </app-form-field>

          <div class="d-grid gap-2 mt-4">
            <button
              type="submit"
              class="btn btn-primary btn-lg"
            >
              Criar Conta
            </button>
          </div>
        </form>

        <div class="text-center mt-3">
          <p>Já tem uma conta? <a routerLink="/login" class="text-decoration-none">Fazer login</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .create-account-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem 1rem;
    }

    .create-account-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      padding: 2.5rem;
      width: 100%;
      max-width: 500px;
    }

    h2 {
      color: #333;
      font-weight: 600;
      margin-bottom: 2rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 8px;
      padding: 0.75rem;
      font-weight: 500;
      transition: transform 0.2s ease;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }

    .text-center a {
      color: #667eea;
      font-weight: 500;
    }

    .text-center a:hover {
      color: #764ba2;
    }

    @media (max-width: 576px) {
      .create-account-card {
        padding: 1.5rem;
        margin: 1rem;
      }
    }
  `]
})
export class CriarContaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private formValidationService = inject(FormValidationService);
  private notificationService = inject(NotificationService);

  createAccountForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
    birth_date: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password_confirmation: ['', [Validators.required]]
  });

  ngOnInit() {
    // Limpar validações quando inicializar
    this.formValidationService.hideErrorsForForm('create-account');

    // Adicionar validador customizado para confirmação de senha
    this.createAccountForm.get('password_confirmation')?.setValidators([
      Validators.required,
      this.passwordMatchValidator.bind(this)
    ]);
  }

  passwordMatchValidator(control: any) {
    const password = this.createAccountForm?.get('password')?.value;
    const confirmPassword = control.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  // Método para testar as notificações
  testNotifications() {
    console.log('Testando notificações...');
    this.notificationService.error('Teste de Erro', 'Este CPF já está em uso.');
    this.notificationService.success('Teste de Sucesso', 'Notificação funcionando!');
    this.notificationService.warning('Teste de Aviso', 'Isso é um aviso de teste.');
    this.notificationService.info('Teste de Info', 'Esta é uma informação de teste.');
  }

  onSubmit() {
    // Validar formulário antes de enviar
    if (!this.formValidationService.validateForm(this.createAccountForm, 'create-account')) {
      this.notificationService.error('Erro no formulário', 'Por favor, corrija os erros no formulário');
      return;
    }

    const formData = this.createAccountForm.value as RegisterRequest;
    formData.role = 'adopter'; // Sempre adopter para novos usuários

    this.authService.register(formData).subscribe({
      next: (response) => {
        this.notificationService.success('Sucesso!', 'Conta criada com sucesso!');
        this.formValidationService.hideErrorsForForm('create-account');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Erro ao criar conta:', error);

        // Verificar a estrutura do erro
        console.log('Error structure:', {
          error: error.error,
          status: error.status,
          message: error.message
        });

        if (error.error?.errors) {
          // Priorizar erros específicos de campo
          const errors = error.error.errors;
          Object.keys(errors).forEach(key => {
            const fieldErrors = Array.isArray(errors[key]) ? errors[key] : [errors[key]];
            fieldErrors.forEach((errorMsg: string) => {
              this.notificationService.error('Erro de validação', errorMsg);
            });
          });
        } else if (error.error?.message) {
          // Mostrar mensagem geral do backend
          this.notificationService.error('Erro', error.error.message);
        } else if (error.message) {
          // Fallback para mensagem do erro HTTP
          this.notificationService.error('Erro', error.message);
        } else {
          // Fallback genérico
          this.notificationService.error('Erro', 'Erro ao criar conta. Tente novamente.');
        }
      }
    });
  }
}
