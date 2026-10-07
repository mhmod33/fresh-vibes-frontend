import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '../../../shared/translate.pipe';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, TimeoutError, timeout } from 'rxjs';

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
  successMessage = '';
  deletingProductIds = new Set<number>();

  constructor(
    private router: Router,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!this.checkAuthentication()) return;
    this.loadProducts();
  }

  checkAuthentication(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  loadProducts() {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.productService.getProducts().pipe(
      timeout({ first: 10_000 }),
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (response: any) => {
        this.products = response.data || response;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse | TimeoutError) => {
        if (error instanceof TimeoutError) {
          this.errorMessage = 'Loading products timed out. Please try again.';
          this.cdr.detectChanges();
          return;
        }

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
        this.cdr.detectChanges();
      }
    });
  }

  editProduct(id: number | undefined) {
    if (!id) return;
    this.router.navigate(['/admin/products', id, 'edit']);
  }

  deleteProduct(id: number | undefined) {
    if (!id) return;

    if (!window.confirm('Are you sure you want to delete this product?')) return;

    this.errorMessage = '';
    this.successMessage = '';
    this.deletingProductIds.add(id);
    this.cdr.detectChanges();

    this.productService.deleteProduct(id).pipe(
      finalize(() => {
        this.deletingProductIds.delete(id);
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== id);
        this.successMessage = 'Product deleted successfully.';
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        this.errorMessage = error.error?.message || 'Failed to delete product. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }

  isDeleting(id: number | undefined): boolean {
    return id !== undefined && this.deletingProductIds.has(id);
  }

  addNewProduct() {
    this.router.navigate(['/admin/products/new']);
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/vecteezy_ai-generated-fresh-healthy-vegetables-on-rustic-wooden_39620296.jpg';
  }
}
