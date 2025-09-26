import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdaptiveAuthService } from '../../services/adaptive-auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class HeaderComponent {
  isAuthenticated = false;
  userRole: string | null = null;
  showDropdown = false;

  constructor(
    private router: Router,
    private authService: AdaptiveAuthService
  ) {
    this.checkAuthStatus();
  }

  private checkAuthStatus() {
    const token = this.authService.getToken();
    const user = this.authService.getUser();

    // Se há token mas não há dados do usuário, limpa tudo
    if (token && !user) {
      localStorage.removeItem('ct_token');
      localStorage.removeItem('ct_user');
      this.isAuthenticated = false;
      this.userRole = null;
      return;
    }

    this.isAuthenticated = this.authService.isAuthenticated();
    if (user) {
      this.userRole = user.role;
    }
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToProfile(): void {
    this.router.navigate(['/perfil']);
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      localStorage.removeItem('ct_token');
      localStorage.removeItem('ct_user');
      this.isAuthenticated = false;
      this.userRole = null;
      this.router.navigate(['/']);
    });
  }

  onDropdownMouseLeave(event: MouseEvent): void {
    setTimeout(() => {
      const relatedTarget = event.relatedTarget as HTMLElement;
      if (!relatedTarget || !relatedTarget.closest('.dropdown')) {
        this.showDropdown = false;
      }
    }, 100);
  }
}
