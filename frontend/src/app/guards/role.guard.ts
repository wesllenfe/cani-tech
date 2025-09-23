import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[];
    const userStr = localStorage.getItem('ct_user');

    if (!userStr) {
      this.router.navigate(['/login']);
      return false;
    }

    const user = JSON.parse(userStr) as User;

    if (!requiredRoles || requiredRoles.includes(user.role)) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}
