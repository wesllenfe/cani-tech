import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  birth_date: string;
  role: 'admin' | 'caregiver' | 'adopter';
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.scss'],
})
export class UsuariosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private http = inject(HttpClient);

  users: User[] = [];
  loading = false;
  error: string | null = null;
  showForm = false;
  editingUser: User | null = null;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    birth_date: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: ['', [Validators.required]],
    role: ['adopter', [Validators.required]],
  });

  roleOptions = [
    { value: 'admin', label: 'Administrador' },
    { value: 'caregiver', label: 'Cuidador' },
    { value: 'adopter', label: 'Adotante' }
  ];

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers() {
    this.loading = true;
    this.http.get<User[]>('/api/users').pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => {
        console.error('Erro ao carregar usuários:', err);
        this.error = 'Erro ao carregar usuários';
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.editingUser = null;
    this.form.reset({ role: 'adopter' });
  }

  editUser(user: User) {
    this.editingUser = user;
    this.showForm = true;
    this.form.patchValue({
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      birth_date: user.birth_date,
      role: user.role
    });
    this.form.get('password')?.clearValidators();
    this.form.get('password_confirmation')?.clearValidators();
    this.form.updateValueAndValidity();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = this.form.value;

    const request = this.editingUser
      ? this.http.put(`/api/users/${this.editingUser.id}`, formData)
      : this.http.post('/api/admin/create-user', formData);

    request.pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (response) => {
        this.loadUsers();
        this.toggleForm();
      },
      error: (err) => {
        console.error('Erro ao salvar usuário:', err);
        this.error = 'Erro ao salvar usuário';
      }
    });
  }

  deleteUser(user: User) {
    if (!confirm(`Tem certeza que deseja excluir o usuário "${user.name}"?`)) {
      return;
    }

    this.loading = true;
    this.http.delete(`/api/users/${user.id}`).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        console.error('Erro ao excluir usuário:', err);
        this.error = 'Erro ao excluir usuário';
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

  getRoleLabel(role: string): string {
    const roleMap: { [key: string]: string } = {
      'admin': 'Administrador',
      'caregiver': 'Cuidador',
      'adopter': 'Adotante'
    };
    return roleMap[role] || role;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }
}
