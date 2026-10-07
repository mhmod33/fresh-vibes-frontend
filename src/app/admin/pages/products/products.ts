import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '../../../shared/translate.pipe';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.checkAuthentication();
    this.loadProducts();
  }

  checkAuthentication() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.router.navigate(['/login']);
    }
  }

  loadProducts() {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getProducts().subscribe({
      next: (response: any) => {
        this.products = response.data || response;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;

        // Handle "Unauthenticated" error
        if (error.error && error.error.message === 'Unauthenticated.') {
          this.errorMessage = 'Your session has expired. Please login again.';
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 401) {
          this.errorMessage = 'Unauthorized. Please login again.';
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else if (error.status === 0) {
          this.errorMessage = 'Unable to connect to server. Please check your internet connection.';
        } else {
          this.errorMessage = 'Failed to load products. Please try again.';
        }

        console.error('Error loading products:', error);
      }
    });
  }

  editProduct(id: number | undefined) {
    if (!id) return;
    this.router.navigate(['/admin/products', id, 'edit']);
  }

  deleteProduct(id: number | undefined) {
    if (!id) return;

    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product');
        }
      });
    }
  }

  addNewProduct() {
    this.router.navigate(['/admin/products/new']);
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/vecteezy_ai-generated-fresh-healthy-vegetables-on-rustic-wooden_39620296.jpg';
  }
}
