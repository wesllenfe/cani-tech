import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('ct_token');
    const userStr = localStorage.getItem('ct_user');

    // Verifica se tem token E dados do usuário
    if (!token || !userStr) {
      // Limpa qualquer dado incompleto
      localStorage.removeItem('ct_token');
      localStorage.removeItem('ct_user');
      this.router.navigate(['/login']);
      return false;
    }

    try {
      // Verifica se os dados do usuário são válidos
      JSON.parse(userStr);
      return true;
    } catch (error) {
      // Se os dados do usuário estão corrompidos, limpa tudo
      localStorage.removeItem('ct_token');
      localStorage.removeItem('ct_user');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
