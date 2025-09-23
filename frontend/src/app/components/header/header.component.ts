import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

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
    private authService: AuthService
  ) {
    this.isAuthenticated = !!localStorage.getItem('ct_token');
    const user = localStorage.getItem('ct_user');
    if (user) {
      this.userRole = JSON.parse(user).role;
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
