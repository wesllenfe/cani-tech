export type UserRole = 'admin' | 'caregiver' | 'adopter';

export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  birth_date: string;
  role: UserRole;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}