import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

export interface CreateUserRequest {
  name: string;
  email: string;
  cpf: string;
  birth_date: string;
  password: string;
  password_confirmation: string;
  role: 'admin' | 'caregiver' | 'adopter';
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Lista todos os usuários (admin apenas)
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  /**
   * Cria novo usuário com privilégios administrativos (admin apenas)
   */
  createAdminUser(userData: CreateUserRequest): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/admin/create-user`, userData);
  }

  /**
   * Atualiza dados de um usuário
   */
  updateUser(userId: number, userData: Partial<User>): Observable<{ message: string; user: User }> {
    return this.http.put<{ message: string; user: User }>(`${this.baseUrl}/users/${userId}`, userData);
  }

  /**
   * Remove um usuário do sistema (apenas se não for admin)
   */
  deleteUser(userId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/users/${userId}`);
  }
}
