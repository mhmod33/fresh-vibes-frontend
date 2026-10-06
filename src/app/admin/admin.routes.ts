import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products').then(m => m.ProductsComponent)
  },
  {
    path: 'products/new',
    loadComponent: () => import('./pages/product-form/product-form').then(m => m.ProductFormComponent)
  },
  {
    path: 'products/:id/edit',
    loadComponent: () => import('./pages/product-form/product-form').then(m => m.ProductFormComponent)
  }
];

export default adminRoutes;
