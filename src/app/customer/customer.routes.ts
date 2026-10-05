import { Routes } from '@angular/router';

export const customerRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then(m => m.AboutComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products').then(m => m.ProductsComponent)
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetailComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact').then(m => m.ContactComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register').then(m => m.RegisterComponent)
  }
];
