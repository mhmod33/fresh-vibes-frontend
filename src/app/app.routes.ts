import { Routes } from '@angular/router';
import { LoginComponent } from './customer/auth/login/login';
import { RegisterComponent } from './customer/auth/register/register';
import { DashboardComponent } from './admin/pages/dashboard/dashboard';
import { ProductsComponent } from './customer/pages/products/products';
import { ContactComponent } from './customer/pages/contact/contact';
import { HomeComponent } from './customer/pages/home/home';
import { AboutComponent } from './customer/pages/about/about';
import { ProductDetailComponent } from './customer/pages/product-detail/product-detail';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '' }
];
