import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../shared/translate.pipe';
import { ProductService } from '../../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from '../../../models/product.model';
import { environment } from '../../../../environments/environment';
import { finalize, TimeoutError, timeout } from 'rxjs';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslatePipe],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductFormComponent implements OnInit {
  isEditMode = false;
  productId: number | null = null;
  imagePreview: string | null = null;
  isLoading = signal(false);
  isSaving = false;
  errorMessage = '';

  productForm = {
    name: '',
    category: 'fresh',
    description: '',
    price: 0,
    stock: 0,
    is_active: true,
    image: ''
  };

  categories = [
    { id: 'fresh', name: 'Fresh Produce' },
    { id: 'aromatic', name: 'Aromatic & Medicinal' },
    { id: 'dry', name: 'Dry Crops' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Check authentication
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = Number(id);
      this.loadProduct();
    }
  }

  loadProduct() {
    if (!this.productId) return;

    this.isLoading.set(true);
    this.errorMessage = '';

    this.productService.getProduct(this.productId).pipe(
      timeout({ first: 15_000 }),
      finalize(() => {
        this.isLoading.set(false);
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (response: Product | { data: Product }) => {
        const product = 'data' in response ? response.data : response;
        const category = product.category || 'fresh';

        if (!this.categories.some(item => item.id === category)) {
          this.categories = [{ id: category, name: category }, ...this.categories];
        }

        this.productForm = {
          name: product.name,
          category,
          description: product.description,
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
          stock: product.stock,
          is_active: product.is_active,
          image: product.image || product.image_url || ''
        };

        const image = product.image || product.image_url;
        if (image) {
          this.updateImagePreview(image);
        } else {
          this.imagePreview = null;
        }

        this.isLoading.set(false);
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse | TimeoutError) => {
        console.error('Error loading product:', error);

        if (error instanceof TimeoutError) {
          this.errorMessage = 'Loading product details timed out. Please try again.';
        } else if (error.status === 401 || (error.error && error.error.message === 'Unauthenticated.')) {
          this.errorMessage = 'Your session has expired. Please login again.';
          setTimeout(() => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            this.router.navigate(['/login']);
          }, 2000);
        } else if (error.status === 404) {
          this.errorMessage = 'Product not found';
        } else if (error.status === 0) {
          this.errorMessage = 'Network error. Please check your connection.';
        } else {
          this.errorMessage = error.error?.message || 'Failed to load product';
        }
        this.cdr.detectChanges();
      }
    });
  }

  onImageUrlChange(image: string) {
    this.errorMessage = '';
    this.updateImagePreview(image);
  }

  removeImage() {
    this.productForm.image = '';
    this.imagePreview = null;
  }

  onSubmit() {
    if (this.isLoading() || this.isSaving) return;

    this.isSaving = true;
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('name', this.productForm.name);
    formData.append('description', this.productForm.description);
    formData.append('price', this.productForm.price.toString());
    formData.append('stock', this.productForm.stock.toString());
    formData.append('category', this.productForm.category);
    formData.append('is_active', this.productForm.is_active ? '1' : '0');
    formData.append('image', this.productForm.image);

    if (this.isEditMode && this.productId) {
      formData.append('_method', 'PUT');

      this.productService.updateProduct(this.productId, formData).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/admin/products']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error updating product:', error);
          this.isSaving = false;

          if (error.status === 401 || (error.error && error.error.message === 'Unauthenticated.')) {
            this.errorMessage = 'Your session has expired. Please login again.';
            setTimeout(() => {
              localStorage.removeItem('authToken');
              localStorage.removeItem('user');
              this.router.navigate(['/login']);
            }, 2000);
          } else if (error.error && error.error.errors) {
            const errors = error.error.errors;
            this.errorMessage = Object.values(errors).flat().join(', ');
          } else {
            this.errorMessage = error.error?.message || 'Failed to update product';
          }
        }
      });
    } else {
      this.productService.createProduct(formData).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/admin/products']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error creating product:', error);
          this.isSaving = false;

          if (error.status === 401 || (error.error && error.error.message === 'Unauthenticated.')) {
            this.errorMessage = 'Your session has expired. Please login again.';
            setTimeout(() => {
              localStorage.removeItem('authToken');
              localStorage.removeItem('user');
              this.router.navigate(['/login']);
            }, 2000);
          } else if (error.error && error.error.errors) {
            const errors = error.error.errors;
            this.errorMessage = Object.values(errors).flat().join(', ');
          } else {
            this.errorMessage = error.error?.message || 'Failed to create product';
          }
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/admin/products']);
  }

  private updateImagePreview(image: string) {
    if (!image.trim()) {
      this.imagePreview = null;
      return;
    }

    try {
      this.imagePreview = new URL(image, environment.apiUrl).toString();
    } catch {
      this.imagePreview = null;
      this.errorMessage = 'Enter a valid image URL or path';
    }
  }
}
