import { Routes } from '@angular/router';


import { authGuard, guestGuard } from './core/guards/auth.guard';
import { AdminShellComponent } from './layout/admin-shell.component';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    component: AdminShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'produtos',
        loadComponent: () => import('./pages/products/product-list.page').then((m) => m.ProductListPage),
      },
      {
        path: 'produtos/novo',
        loadComponent: () => import('./pages/products/product-form.page').then((m) => m.ProductFormPage),
      },
      {
        path: 'produtos/:id/editar',
        loadComponent: () => import('./pages/products/product-form.page').then((m) => m.ProductFormPage),
      },
      {
        path: 'banners',
        loadComponent: () => import('./pages/banners/banner-list.page').then((m) => m.BannerListPage),
      },
      {
        path: 'banners/novo',
        loadComponent: () => import('./pages/banners/banner-form.page').then((m) => m.BannerFormPage),
      },
      {
        path: 'banners/:id/editar',
        loadComponent: () => import('./pages/banners/banner-form.page').then((m) => m.BannerFormPage),
      },
      {
        path: 'categorias',
        loadComponent: () => import('./pages/categories/category-list.page').then((m) => m.CategoryListPage),
      },
      {
        path: 'categorias/nova',
        loadComponent: () => import('./pages/categories/category-form.page').then((m) => m.CategoryFormPage),
      },
      {
        path: 'categorias/:id/editar',
        loadComponent: () => import('./pages/categories/category-form.page').then((m) => m.CategoryFormPage),
      },
      {
        path: 'carrinhos',
        loadComponent: () => import('./pages/carts/cart-lookup.page').then((m) => m.CartLookupPage),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
