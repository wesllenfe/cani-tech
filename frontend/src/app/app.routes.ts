import { Routes } from '@angular/router';

import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home').then(m => m.HomeComponent),
  },
  {
    path: 'doacao-publica',
    loadComponent: () =>
      import('./pages/doacao-publica/doacao-publica').then(m => m.DoacaoPublicaComponent),
  },
  {
    path: 'animals/:id',
    loadComponent: () => 
      import('./components/animal-detail/animal-detail').then(m => m.AnimalDetailComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'criar-conta',
    loadComponent: () =>
      import('./pages/criar-conta/criar-conta').then(m => m.CriarContaComponent),
  },
  {
    path: 'dashboard',
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'caregiver', 'adopter'] },
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(m => m.DashboardComponent),
  },
  {
    path: 'perfil',
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'caregiver', 'adopter'] },
    loadComponent: () =>
      import('./pages/perfil/perfil').then(m => m.PerfilComponent),
  },
  {
    path: 'my-adoptions',
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'caregiver', 'adopter'] },
    loadComponent: () =>
      import('./pages/my-adoptions/my-adoptions').then(m => m.MyAdoptionsComponent),
  },
  {
    path: 'animais-admin',
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'caregiver'] },
    loadComponent: () =>
      import('./pages/animais-admin/animais-admin').then(m => m.AnimaisAdminComponent),
  },
  {
    path: 'criar-animal',
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'caregiver'] },
    loadComponent: () =>
      import('./pages/criar-animal/criar-animal').then(m => m.CriarAnimalComponent),
  },
  {
    path: 'editar-animal/:id',
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'caregiver'] },
    loadComponent: () =>
      import('./pages/criar-animal/criar-animal').then(m => m.CriarAnimalComponent),
  },
  {
    path: 'categorias',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./pages/categorias/categorias').then(m => m.CategoriasComponent),
  },
  {
    path: 'despesas',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./pages/despesas/despesas').then(m => m.DespesasComponent),
  },
  {
    path: 'doacoes-admin',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./pages/doacoes-admin/doacoes-admin').then(m => m.DoacoesAdminComponent),
  },
  {
    path: 'usuarios',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./pages/usuarios/usuarios').then(m => m.UsuariosComponent),
  },
  {
    path: 'relatorios',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./pages/relatorios/relatorios').then(m => m.RelatoriosComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
