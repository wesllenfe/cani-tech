import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

export interface CreateUserRequest {
  name: string;
  role: 'admin' | 'caregiver' | 'adopter';
}

interface UsersResponse {
  data: User[];
  // Add other properties from the response if needed, like pagination details
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
    return this.http.get<UsersResponse>(`${this.baseUrl}/users`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Cria um novo usuário admin
   */
  createAdminUser(userData: any): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/admin/create-user`, userData);
  }

  /**
   * Atualiza um usuário existente
   */
  updateUser(userId: number, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${userId}`, userData);
  }

  /**
   * Exclui um usuário
   */
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${userId}`);
  }
}
