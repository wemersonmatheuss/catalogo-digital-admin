import { Routes } from '@angular/router';


import { authGuard, guestGuard } from './core/guards/auth.guard';
import { AdminShellComponent } from './layout/admin-shell.component';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    component: AdminShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'produtos',
        loadComponent: () => import('./features/products/product-list.page').then((m) => m.ProductListPage),
      },
      {
        path: 'produtos/novo',
        loadComponent: () => import('./features/products/product-form.page').then((m) => m.ProductFormPage),
      },
      {
        path: 'produtos/:id/editar',
        loadComponent: () => import('./features/products/product-form.page').then((m) => m.ProductFormPage),
      },
      {
        path: 'banners',
        loadComponent: () => import('./features/banners/banner-list.page').then((m) => m.BannerListPage),
      },
      {
        path: 'banners/novo',
        loadComponent: () => import('./features/banners/banner-form.page').then((m) => m.BannerFormPage),
      },
      {
        path: 'banners/:id/editar',
        loadComponent: () => import('./features/banners/banner-form.page').then((m) => m.BannerFormPage),
      },
      {
        path: 'categorias',
        loadComponent: () => import('./features/categories/category-list.page').then((m) => m.CategoryListPage),
      },
      {
        path: 'categorias/nova',
        loadComponent: () => import('./features/categories/category-form.page').then((m) => m.CategoryFormPage),
      },
      {
        path: 'categorias/:id/editar',
        loadComponent: () => import('./features/categories/category-form.page').then((m) => m.CategoryFormPage),
      },
      {
        path: 'carrinhos',
        loadComponent: () => import('./features/carts/cart-lookup.page').then((m) => m.CartLookupPage),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
